"""ElevenLabs voices for UNIT 4B, a drop-in replacement for core/tts/tts.py.

    export ELEVENLABS_API_KEY=...            # never commit it
    python demo/elevenlabs_tts.py lines.json out/ [--cast elevenlabs.json] [--fx] [--dry-run]
    python demo/elevenlabs_tts.py --audition ted out/audition/      # every mode of one character, one sample line
    python demo/elevenlabs_tts.py --audition-expr ted out/ted_faces/  # all 26 expressions of one character, in-character lines

lines.json = [{"id": "s03_ted", "char": "ted", "expr": "proud", "text": "For the boos."}, ...]
  char  : steve | nana | penny | ted | snuggles   (voice_id, modes and expression colouring come from elevenlabs.json)
  expr  : one of the 26 face names from demo/cast.js (neutral, deadpan, shocked, ...). The same field drives the face in the
          animation and the delivery here: expression tags + stability + speed, coloured by the character's base_speed and flavor.
  mode  : one of the character's named modes (dad_joke, deadpan_threat, ...). Wins over expr when both are given.
          With neither, the character's first mode is used.
  text  : the spoken line. Eleven v3 audio tags may be written inline ("[sighs] Fine."); if the line starts with a tag,
          the mode's own tags are not added. Numbers as words ("nineteen eighty-seven").
  seed  : optional int, makes a take reproducible
  tail  : optional, overrides the mode's tail tag(s) ("" to drop it)
  stability / style / speed : optional per-line overrides of the voice settings (stability 0.0 = most expressive)

Writes, like tts.py: out/<id>.wav (24 kHz mono 16-bit, leading/trailing silence trimmed) and out/dur.json,
plus out/captions.json (each line with every [tag] removed, ready for subtitles).
Takes are cached in out/.cache/: an unchanged line, voice and setting is never paid for twice.
--fx applies the character's post filter from elevenlabs.json with ffmpeg (Ted's echo, Snuggles's radio warmth).
With the fallback model (eleven_multilingual_v2: no audio tags) tags are stripped before sending.
"""
import argparse, hashlib, json, os, re, shutil, subprocess, sys, time, urllib.error, urllib.request, wave
from array import array

API = 'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format={fmt}'
TAG = re.compile(r'\[[^\]]*\]')
SR = 24000
AUDITION = {
    'steve': "Sorry, quick question. Is the ghost included in the rent?",
    'nana': "Oh, I don't do that sort of thing anymore, dear. Mostly my hip.",
    'penny': "Rent is due Friday. Late fees are fifteen percent.",
    'ted': "I used to hate facial hair. But then it grew on me.",
    'snuggles': "Apartment 4B. Three a.m. Somebody opened a can of tuna.",
}


def caption(text):
    return re.sub(r'\s+', ' ', TAG.sub('', text)).strip()


def resolve(c, L, expressions):
    """Delivery for one line: a named mode, or an expression coloured by the character."""
    if L.get('mode') or not L.get('expr'):
        name = L.get('mode') or next(iter(c['modes']))
        return f'mode:{name}', dict(c['modes'][name])
    e = dict(expressions[L['expr']])
    flavor = c.get('flavor', '') if e.get('flavor') else ''   # only calm deliveries get the character's flavor tag
    tags = ' '.join(t for t in (flavor, e.get('tags', '')) if t)
    speed = round(max(0.7, min(1.2, c.get('base_speed', 1.0) * e.get('speed', 1.0))), 2)
    return f"expr:{L['expr']}", {'tags': tags, 'tail': e.get('tail', ''), 'stability': e['stability'],
                                 'similarity_boost': 0.8, 'style': e.get('style', 0.3), 'speed': speed}


def build_text(line, mode, model, fallback):
    text = line['text'].strip()
    if not text.startswith('['):
        text = f"{mode.get('tags', '')} {text}".strip()
    tail = line.get('tail', mode.get('tail', ''))
    if tail:
        text = f'{text} {tail}'
    return caption(text) if model == fallback else text


def trim(pcm):
    """Cut leading/trailing silence (2 % of peak), keep 30 ms before and 80 ms after, as tts.py does."""
    s = array('h'); s.frombytes(pcm)
    if not s: return pcm
    peak = max(abs(v) for v in s) or 1
    loud = [i for i, v in enumerate(s) if abs(v) > peak * 0.02]
    if not loud: return pcm
    a, b = max(0, loud[0] - int(.03 * SR)), min(len(s), loud[-1] + int(.08 * SR))
    return s[a:b].tobytes()


def write_wav(path, pcm):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)


def synth(key, voice, payload, fmt):
    req = urllib.request.Request(API.format(voice=voice, fmt=fmt), data=json.dumps(payload).encode(), method='POST',
                                 headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/pcm'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            body = e.read().decode('utf-8', 'replace')[:400]
            if e.code == 429 and attempt < 3:      # rate limit / concurrency: back off and retry
                time.sleep(2 * (attempt + 1)); continue
            sys.exit(f'elevenlabs_tts: HTTP {e.code} for voice {voice}: {body}')
        except urllib.error.URLError as e:
            if attempt < 3: time.sleep(2); continue
            sys.exit(f'elevenlabs_tts: cannot reach ElevenLabs ({e.reason}). Check the network and try again.')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('lines', nargs='?'); ap.add_argument('out', nargs='?')
    ap.add_argument('--cast', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'elevenlabs.json'))
    ap.add_argument('--audition', metavar='CHAR'); ap.add_argument('--audition-expr', metavar='CHAR')
    ap.add_argument('--fx', action='store_true')
    ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--model')
    a = ap.parse_args()
    cast = json.load(open(a.cast, encoding='utf-8'))
    model = a.model or cast['model_id']; fallback = cast.get('fallback_model_id'); fmt = cast.get('output_format', 'pcm_24000')
    chars = cast['characters']; expressions = cast.get('expressions', {})

    if a.audition_expr:
        cid = a.audition_expr
        if cid not in chars: sys.exit(f"unknown character '{cid}'; choose from {', '.join(chars)}")
        out = a.lines or a.out or f'audition_{cid}_expr'
        lines = [{'id': f'{cid}_{e}', 'char': cid, 'expr': e, 'text': chars[cid]['expression_lines'][e]} for e in expressions]
    elif a.audition:
        if a.audition not in chars: sys.exit(f"unknown character '{a.audition}'; choose from {', '.join(chars)}")
        out = a.lines or a.out or f'audition_{a.audition}'
        lines = [{'id': f'{a.audition}_{m}', 'char': a.audition, 'mode': m, 'text': AUDITION[a.audition]} for m in chars[a.audition]['modes']]
    else:
        if not (a.lines and a.out): ap.error('give lines.json and an output folder, or --audition CHAR OUT')
        lines, out = json.load(open(a.lines, encoding='utf-8')), a.out

    # check everything before spending a single credit
    problems = []
    for L in lines:
        c = chars.get(L.get('char'))
        if not c: problems.append(f"{L.get('id')}: unknown char '{L.get('char')}'"); continue
        if L.get('mode') and L['mode'] not in c['modes']: problems.append(f"{L['id']}: '{L['char']}' has no mode '{L['mode']}' ({', '.join(c['modes'])})")
        if L.get('expr') and L['expr'] not in expressions: problems.append(f"{L['id']}: unknown expr '{L['expr']}' ({', '.join(expressions)})")
        if not c.get('voice_id') and not a.dry_run: problems.append(f"{L['id']}: no voice_id for '{L['char']}' in {a.cast}")
    if problems: sys.exit('elevenlabs_tts:\n  ' + '\n  '.join(dict.fromkeys(problems)))
    key = os.environ.get('ELEVENLABS_API_KEY', '')
    if not key and not a.dry_run: sys.exit('elevenlabs_tts: set ELEVENLABS_API_KEY first (export ELEVENLABS_API_KEY=...).')
    if a.fx and not shutil.which('ffmpeg'): sys.exit('elevenlabs_tts: --fx needs ffmpeg on PATH.')

    os.makedirs(os.path.join(out, '.cache'), exist_ok=True)
    dur, caps = {}, {}
    for L in lines:
        c = chars[L['char']]; mname, m = resolve(c, L, expressions)
        text = build_text(L, m, model, fallback)
        settings = {k: m[k] for k in ('stability', 'similarity_boost', 'style', 'speed') if k in m}
        settings.update({k: L[k] for k in ('stability', 'style', 'speed') if k in L})   # per-line override for big emotional beats
        settings['use_speaker_boost'] = True
        payload = {'text': text, 'model_id': model, 'voice_settings': settings}
        if 'seed' in L: payload['seed'] = int(L['seed'])
        caps[L['id']] = caption(text)   # spoken words, tags removed (includes words in a tail)
        if a.dry_run:
            print(json.dumps({'id': L['id'], 'voice': c.get('voice_id') or f"<{L['char']} voice_id>", **payload}, ensure_ascii=False)); continue
        h = hashlib.sha1(json.dumps([c['voice_id'], payload], sort_keys=True).encode()).hexdigest()[:16]
        cached = os.path.join(out, '.cache', h + '.pcm')
        if os.path.exists(cached):
            pcm = open(cached, 'rb').read()
        else:
            pcm = synth(key, c['voice_id'], payload, fmt)
            open(cached + '.part', 'wb').write(pcm); os.replace(cached + '.part', cached)
        pcm = trim(pcm)
        wav = os.path.join(out, L['id'] + '.wav'); write_wav(wav, pcm)
        if a.fx and c.get('fx'):
            tmp = wav + '.fx.wav'
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-af', c['fx'], '-ar', str(SR), '-ac', '1', '-c:a', 'pcm_s16le', tmp], check=True)
            os.replace(tmp, wav)
            with wave.open(wav) as w: frames = w.getnframes()
            dur[L['id']] = round(frames / SR, 3)
        else:
            dur[L['id']] = round(len(pcm) / 2 / SR, 3)
        print(L['id'], f"[{L['char']}/{mname}]", dur[L['id']], text)
    if not a.dry_run:
        json.dump(dur, open(os.path.join(out, 'dur.json'), 'w', encoding='utf-8'), indent=1)
    json.dump(caps, open(os.path.join(out, 'captions.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)


if __name__ == '__main__':
    main()
