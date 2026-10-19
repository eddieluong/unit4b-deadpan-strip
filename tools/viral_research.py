"""Find viral comedy shorts on YouTube and pull their subtitles for joke analysis.

    pip install yt-dlp youtube-transcript-api

    # 1) find candidates: from channels and/or search queries, ranked by views
    python tools/viral_research.py find --channel https://www.youtube.com/@SomeChannel --search "animated comedy shorts" \
        --out research/viral/2026-10-17-landlords --limit 40 --shorts-only

    # 3) originality check: no 5-word run shared between a new script and any transcript
    python tools/viral_research.py check episodes/09-slug/lines.json research/viral/2026-10-17-landlords/transcripts

    # 2) pull subtitles for the top N candidates (or for any video URLs / ids)
    python tools/viral_research.py subs --from research/viral/2026-10-17-landlords/candidates.json --top 10
    python tools/viral_research.py subs https://www.youtube.com/shorts/VIDEO_ID --out research/viral/manual

Outputs (in --out):
  candidates.json / candidates.md   ranked list: title, channel, views, duration, views/day, url
  transcripts/<id>.md               metadata + subtitle lines as "[t s · p %] text" (p = position in the video,
                                    which shows where the hook, setup and punchline land)
Transcripts are other creators' words: keep them for analysis only (they are git-ignored), never reuse them.
If YouTube asks you to sign in ("confirm you're not a bot"), pass --cookies-from-browser chrome (or firefox).
"""
import argparse, datetime as dt, json, os, re, sys

SHORT_MAX = 180  # seconds; YouTube Shorts can be up to 3 minutes


def ydl(opts=None, cookies=None):
    try:
        import yt_dlp
    except ImportError:
        sys.exit('viral_research: install yt-dlp first: pip install yt-dlp youtube-transcript-api')
    o = {'quiet': True, 'no_warnings': True, 'skip_download': True, 'ignoreerrors': True}
    if cookies: o['cookiesfrombrowser'] = (cookies,)
    o.update(opts or {})
    return yt_dlp.YoutubeDL(o)


def video_id(s):
    m = re.search(r'(?:v=|/shorts/|youtu\.be/|/embed/)([A-Za-z0-9_-]{11})', s)
    return m.group(1) if m else (s if re.fullmatch(r'[A-Za-z0-9_-]{11}', s) else None)


def views_per_day(views, upload_date):
    if not views or not upload_date: return None
    try:
        d = dt.datetime.strptime(str(upload_date), '%Y%m%d').date()
        return round(views / max(1, (dt.date.today() - d).days), 1)
    except ValueError:
        return None


def flat_entries(url, limit, cookies):
    with ydl({'extract_flat': 'in_playlist', 'playlistend': limit}, cookies) as y:
        info = y.extract_info(url, download=False) or {}
    out = []
    for e in info.get('entries') or []:
        if not e: continue
        if e.get('_type') == 'playlist' and e.get('entries'):  # channel pages can nest tabs
            out += [x for x in e['entries'] if x]
        else:
            out.append(e)
    return out[:limit]


def cmd_find(a):
    sources = []
    for ch in a.channel or []:
        base = ch.rstrip('/')
        sources.append(base + ('/shorts' if a.shorts_only and not base.endswith('/shorts') else ''))
    for q in a.search or []:
        sources.append(f'ytsearch{a.limit}:{q}')
    if not sources: sys.exit('viral_research find: give at least one --channel or --search')
    seen, rows = set(), []
    for src in sources:
        for e in flat_entries(src, a.limit, a.cookies_from_browser):
            vid = e.get('id') or video_id(e.get('url', ''))
            if not vid or vid in seen: continue
            seen.add(vid)
            dur = e.get('duration')
            if a.shorts_only and dur and dur > SHORT_MAX: continue
            views = e.get('view_count') or 0
            if views < a.min_views: continue
            rows.append({'id': vid, 'title': e.get('title') or '', 'channel': e.get('channel') or e.get('uploader') or '',
                         'views': views, 'duration': dur, 'upload_date': e.get('upload_date'),
                         'views_per_day': views_per_day(views, e.get('upload_date')),
                         'url': f'https://www.youtube.com/shorts/{vid}' if (dur or 0) <= SHORT_MAX else f'https://www.youtube.com/watch?v={vid}',
                         'source': src})
    rows.sort(key=lambda r: r['views'], reverse=True)
    os.makedirs(a.out, exist_ok=True)
    json.dump(rows, open(os.path.join(a.out, 'candidates.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    md = ['| # | Views | Views/day | Sec | Title | Channel | Link |', '|---|---|---|---|---|---|---|']
    for i, r in enumerate(rows, 1):
        md.append(f"| {i} | {r['views']:,} | {r['views_per_day'] or ''} | {r['duration'] or ''} | {r['title'].replace('|', '/')} | {r['channel']} | {r['url']} |")
    open(os.path.join(a.out, 'candidates.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    print(f'{len(rows)} candidates -> {a.out}/candidates.md')


def parse_vtt(text):
    """WebVTT (YouTube auto captions repeat lines while they scroll) -> [(start_seconds, text)] without repeats."""
    out, last = [], ''
    for block in re.split(r'\n\s*\n', text):
        m = re.search(r'(\d+):(\d{2}):(\d{2})[.,](\d{3})\s*-->', block)
        if not m: continue
        start = int(m[1]) * 3600 + int(m[2]) * 60 + int(m[3]) + int(m[4]) / 1000
        lines = [re.sub(r'<[^>]+>', '', l).strip() for l in block.split('\n')[1:] if '-->' not in l]
        for line in (l for l in lines if l):
            if line != last and not (out and out[-1][1].endswith(line)):
                out.append((round(start, 2), line)); last = line
    return out


def fetch_transcript(vid, langs, cookies, tmpdir):
    """youtube-transcript-api first (fast, no download), yt-dlp subtitles as a fallback."""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        api = YouTubeTranscriptApi()
        if hasattr(api, 'fetch'):
            data = api.fetch(vid, languages=langs)
            return [(round(s.start, 2), s.text.replace('\n', ' ')) for s in data], 'youtube-transcript-api'
        data = YouTubeTranscriptApi.get_transcript(vid, languages=langs)  # older versions
        return [(round(s['start'], 2), s['text'].replace('\n', ' ')) for s in data], 'youtube-transcript-api'
    except Exception as e:
        first_error = e
    os.makedirs(tmpdir, exist_ok=True)
    with ydl({'writesubtitles': True, 'writeautomaticsub': True, 'subtitleslangs': langs, 'subtitlesformat': 'vtt',
              'outtmpl': os.path.join(tmpdir, '%(id)s.%(ext)s')}, cookies) as y:
        y.download([f'https://www.youtube.com/watch?v={vid}'])
    for f in sorted(os.listdir(tmpdir)):
        if f.startswith(vid) and f.endswith('.vtt'):
            return parse_vtt(open(os.path.join(tmpdir, f), encoding='utf-8').read()), 'yt-dlp'
    raise RuntimeError(f'no subtitles ({type(first_error).__name__}: {str(first_error)[:120]})')


def video_meta(vid, cookies):
    with ydl({}, cookies) as y:
        i = y.extract_info(f'https://www.youtube.com/watch?v={vid}', download=False) or {}
    return {k: i.get(k) for k in ('title', 'channel', 'view_count', 'like_count', 'comment_count', 'duration', 'upload_date', 'description')}


def cmd_subs(a):
    ids = [video_id(x) for x in a.videos]
    if a.__dict__.get('from'):
        rows = json.load(open(a.__dict__['from'], encoding='utf-8'))
        ids += [r['id'] for r in rows[:a.top]]
        a.out = a.out or os.path.dirname(a.__dict__['from'])
    ids = [i for i in dict.fromkeys(ids) if i]
    if not ids: sys.exit('viral_research subs: give video URLs/ids or --from candidates.json')
    out = os.path.join(a.out or 'research/viral/manual', 'transcripts'); os.makedirs(out, exist_ok=True)
    ok = 0
    for vid in ids:
        try:
            meta = video_meta(vid, a.cookies_from_browser)
            lines, via = fetch_transcript(vid, a.lang, a.cookies_from_browser, os.path.join(out, '.tmp'))
        except Exception as e:
            print(f'{vid}: skipped ({e})'); continue
        dur = meta.get('duration') or (lines[-1][0] + 2 if lines else 0)
        head = [f"# {meta.get('title') or vid}", '',
                f"- url: https://www.youtube.com/watch?v={vid}", f"- channel: {meta.get('channel')}",
                f"- views: {meta.get('view_count')} · likes: {meta.get('like_count')} · comments: {meta.get('comment_count')}",
                f"- duration: {dur}s · uploaded: {meta.get('upload_date')} · subtitles via {via}",
                '', '## Subtitles (analysis only, do not reuse)', '']
        body = [f"[{t:6.2f}s · {round(100 * t / dur) if dur else 0:3d}%] {txt}" for t, txt in lines]
        open(os.path.join(out, f'{vid}.md'), 'w', encoding='utf-8').write('\n'.join(head + body) + '\n')
        ok += 1; print(f'{vid}: {len(lines)} lines -> {out}/{vid}.md')
    print(f'{ok}/{len(ids)} transcripts saved')


STOCK = {'per my last email', 'are you kidding me right', 'what do you mean by', 'i don t know what',
         'thank you so much for', 'oh my god oh my'}


def words(t):
    return re.sub(r"[^a-z0-9' ]+", ' ', re.sub(r'\[[^\]]*\]', ' ', t.lower())).replace("'", ' ').split()


def ngrams(ws, n):
    return {' '.join(ws[i:i + n]) for i in range(len(ws) - n + 1)}


def cmd_check(a):
    lines = json.load(open(a.lines, encoding='utf-8'))
    src = {}
    for f in sorted(os.listdir(a.transcripts)):
        if f.endswith('.md'):
            txt = open(os.path.join(a.transcripts, f), encoding='utf-8').read()
            body = txt.split('## Subtitles', 1)[-1]
            src[f[:-3]] = ngrams(words(re.sub(r'\[\s*[\d.]+s\s*·\s*\d+%\]', ' ', body)), a.n)
    if not src: sys.exit(f'viral_research check: no transcripts in {a.transcripts}')
    hits = []
    for L in lines:
        for g in ngrams(words(L.get('text', '') + ' ' + L.get('tail', '')), a.n):
            if any(g.startswith(st) or st.startswith(g) for st in STOCK): continue
            for vid, grams in src.items():
                if g in grams: hits.append((L.get('id'), vid, g))
    if hits:
        print(f'FAIL: {len(hits)} shared {a.n}-word run(s). Rewrite these lines:')
        for lid, vid, g in hits: print(f'  {lid}  ~ {vid}: "{g}"')
        sys.exit(1)
    print(f'OK: no {a.n}-word run shared with {len(src)} transcript(s).')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--cookies-from-browser', metavar='BROWSER', help='chrome | firefox | edge | safari, if YouTube asks to sign in')
    sub = ap.add_subparsers(dest='cmd', required=True)
    f = sub.add_parser('find', help='rank videos from channels and searches by views')
    f.add_argument('--channel', action='append', help='channel URL, e.g. https://www.youtube.com/@Name (repeatable)')
    f.add_argument('--search', action='append', help='search query (repeatable)')
    f.add_argument('--limit', type=int, default=30, help='videos per source (default 30)')
    f.add_argument('--min-views', type=int, default=0)
    f.add_argument('--shorts-only', action='store_true')
    f.add_argument('--out', default=f'research/viral/{dt.date.today()}')
    s = sub.add_parser('subs', help='download subtitles for videos')
    s.add_argument('videos', nargs='*', help='video URLs or ids')
    s.add_argument('--from', help='candidates.json from the find step')
    s.add_argument('--top', type=int, default=10, help='how many candidates from --from (default 10)')
    s.add_argument('--lang', nargs='+', default=['en', 'en-US', 'en-GB'])
    s.add_argument('--out')
    c = sub.add_parser('check', help='originality check: shared word runs between a lines.json and transcripts')
    c.add_argument('lines', help='episode lines.json')
    c.add_argument('transcripts', help='folder with transcripts/<id>.md')
    c.add_argument('-n', type=int, default=5, help='run length in words (default 5)')
    a = ap.parse_args()
    {'find': cmd_find, 'subs': cmd_subs, 'check': cmd_check}[a.cmd](a)


if __name__ == '__main__':
    main()
