"""Tập 9 voice: two seeds x one ElevenLabs take per character, Whisper-split into lines, per-line speed, fades.
  ELEVENLABS_API_KEY from env only.  ~/lemo-opuscar/.venv/bin/python voice_gen.py [--split]   (--split = reuse saved takes)
Writes voice/<id>.wav, voice/timeline.json, voice/take_<char>.wav (raw)."""
import json, os, re, sys, difflib, subprocess, urllib.request
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'voice'); os.makedirs(OUT, exist_ok=True)
SR = 24000; SEEDS = [1809, 2718]   # two takes per character; best take chosen per line
VOICE = {'steve': 'Y9z2nW5YxRRbI3XaIf8x', 'snuggles': 'nPczCjzI2devNBz1zQrb'}
# id, spoken text with light tags (CAPS = stress word). Numbers as words, no "..." in text.
TAKES = {
 'steve': ([('s2', "[hushed, panicked] Okay. Nobody MOVE."), ('s3', "[pleading, whispering] It's THIS close."),
            ('s5', "[desperate, straining] Come ON!"), ('s7', "[relieved, quick] On my WAY."),
            ('s9', "[flat, polite, dead inside] Thank you.")],
           {'stability': 0.35, 'similarity_boost': 0.85, 'style': 0.4, 'use_speaker_boost': True, 'speed': 1.0}),
 'snuggles': ([('s1', "[flat, noir] One percent. One message. One MAN."), ('s4', "[dry, noir] The other socket was behind the fridge. Of COURSE."),
               ('s6', "[dry] Two percent. He felt RICH."), ('s10a', "[dry, flat] Plan B ran in the FAMILY."),
               ('s10b', "[dry, flat] The backup was ALSO at one percent.")],
              {'stability': 0.5, 'similarity_boost': 0.85, 'style': 0.35, 'use_speaker_boost': True, 'speed': 1.0}),
}
SPEED = json.load(open(os.path.join(HERE, 'speeds.json'))) if os.path.exists(os.path.join(HERE, 'speeds.json')) else {}
# script order: (id, pause_after). Silent beats folded into pauses: 4b = 0.8 after s4 (+0.2); 7b 1.0 + 8 0.6 after s7 (+0.2)
ORDER = [('s1', .3), ('s2', .3), ('s3', .3), ('s4', 1.6), ('s5', .3), ('s6', .3), ('s7', 2.6), ('s9', .88), ('s10a', 0)]
# gate-4 film timing: frame 1 held 0.5 s before the first word; longer 4b/7b/8 holds; punch pinned at 21.2 s of a 27.3 s film
ABS = {'s1': 0.5, 's9': 21.2}; FILM_TOTAL = 27.0
CHOICE = json.load(open(os.path.join(HERE, 'choice.json'))) if os.path.exists(os.path.join(HERE, 'choice.json')) else {}  # id -> seed override
def rms(x, hop=240):
    n = len(x) // hop; return np.sqrt((x[:n*hop].reshape(n, hop)**2).mean(1) + 1e-12)
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
def generate(c, SEED):
    body = {'text': ' '.join(t for _, t in TAKES[c][0]), 'model_id': 'eleven_v3', 'seed': SEED, 'voice_settings': TAKES[c][1]}
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE[c]}?output_format=pcm_24000', data=json.dumps(body).encode(),
        headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
    pcm = np.frombuffer(urllib.request.urlopen(req).read(), dtype='<i2').astype(np.float32) / 32768
    sf.write(os.path.join(OUT, f'take_{c}_{SEED}.wav'), pcm, SR)
def split(c, M, SEED):
    ids = [i for i, _ in TAKES[c][0]]; parts = [re.sub(r'\[[^\]]*\]', '', t).strip() for _, t in TAKES[c][0]]
    x, _ = sf.read(os.path.join(OUT, f'take_{c}_{SEED}.wav')); r = rms(x); db = 20*np.log10(r/r.max())
    segs, _ = M.transcribe(resample_poly(x, 2, 3).astype(np.float32), language='en', word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    tw = [(norm(w.word), w.start, w.end) for s in segs for w in s.words if norm(w.word)]
    print(c, 'heard:', ' '.join(w for w, _, _ in tw))
    tstr, owner = '', []
    for j, (w, _, _) in enumerate(tw): tstr += w; owner += [j]*len(w)
    sstr, ends = '', []
    for p in parts: sstr += ''.join(norm(w) for w in p.split()); ends.append(len(sstr)-1)
    cmap = {}
    for a0, b0, n in difflib.SequenceMatcher(a=sstr, b=tstr, autojunk=False).get_matching_blocks():
        for k in range(n): cmap[a0+k] = b0+k
    def word_at(ci):
        for j in range(ci, -1, -1):
            if j in cmap: return owner[cmap[j]]
        return 0
    cuts = [0]
    for e in ends[:-1]:
        k = min(word_at(e), len(tw)-2); a = int(tw[k][2]*100); b = max(a+1, int(tw[k+1][1]*100)); a, b = min(a, len(r)-2), min(b, len(r)-1)
        cuts.append(a + int(np.argmin(r[a:b+1])))
    cuts.append(len(r)); res = {}
    for k, i in enumerate(ids):
        a, b = cuts[k], cuts[k+1]; loud = np.where(db[a:b] > -32)[0]
        s = max(a, a+loud[0]-4); e = min(b, a+loud[-1]+30)   # 40 ms pre-roll, 300 ms tail
        y = x[s*240:e*240].copy(); ry = rms(y); dy = 20*np.log10(ry/ry.max()); q = dy < -38; j = 0; keep = []
        while j < len(q):   # internal pauses > 0.6 s -> 0.5 s (crossfaded at the quietest part)
            if q[j]:
                k2 = j
                while k2 < len(q) and q[k2]: k2 += 1
                if j > 0 and k2 < len(q) and k2-j > 40: keep.append((j+15, k2-15))
                j = k2
            else: j += 1
        for a2, b2 in reversed(keep):
            A, B, xf = a2*240, b2*240, 240
            y = np.concatenate([y[:A], y[A:A+xf]*np.linspace(1, 0, xf) + y[B:B+xf]*np.linspace(0, 1, xf), y[B+xf:]])
        res[i] = (y, db[a:b].max())
    return res
def finish(i, y):
    sp = SPEED.get(i, 1.0)
    if abs(sp-1) > 1e-3:
        tmp = os.path.join(OUT, '_t.wav'); sf.write(tmp, y, SR)
        o = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'atempo={sp}', '-ar', str(SR), '-f', 'wav', '-'], capture_output=True, check=True).stdout
        import io; y, _ = sf.read(io.BytesIO(o))
    fi, fo = int(.015*SR), int(.12*SR); y = y.copy(); y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)**1.5
    sf.write(os.path.join(OUT, f'{i}.wav'), y, SR); return y
def asr_score(y, M, want):
    segs, _ = M.transcribe(resample_poly(y, 2, 3).astype(np.float32), language='en', beam_size=5, condition_on_previous_text=False)
    got = norm(''.join(s.text for s in segs)); return difflib.SequenceMatcher(a=norm(want), b=got).ratio()
if __name__ == '__main__':
    from faster_whisper import WhisperModel
    M = WhisperModel('base.en', device='cpu', compute_type='int8'); cand = {}   # id -> {seed: (y, pk)}
    for c in TAKES:
        for sd in SEEDS:
            if not os.path.exists(os.path.join(OUT, f'take_{c}_{sd}.wav')): generate(c, sd)
            for i, v in split(c, M, sd).items(): cand.setdefault(i, {})[sd] = v
    text = {i: re.sub(r'\[[^\]]*\]', '', t) for c in TAKES for i, t in TAKES[c][0]}
    lines, report = {}, {}
    for i, d in cand.items():
        sc = {sd: asr_score(finish(i + f'_t{sd}', y), M, text[i]) for sd, (y, _) in d.items()}   # also writes <id>_t<seed>.wav
        dur = {sd: len(d[sd][0]) / SR for sd in d}
        # pick: better ASR match (>0.02 wins); else punch line s9 -> the quieter take, others -> the shorter (tighter) take
        a, b = SEEDS; pick = a if sc[a] - sc[b] > 0.02 else b if sc[b] - sc[a] > 0.02 else None
        if pick is None:
            lv = {sd: np.sqrt((d[sd][0]**2).mean()) for sd in d}
            pick = min(lv, key=lv.get) if i == 's9' else min(dur, key=dur.get)
        pick = CHOICE.get(i, pick); lines[i] = d[pick]; report[i] = {'seed': pick, 'asr': {str(k): round(v, 2) for k, v in sc.items()}, 'dur_raw': {str(k): round(v, 2) for k, v in dur.items()}}
    ys = {i: finish(i, y) for i, (y, _) in lines.items()}
    def mix(order, name):
        t, tl = 0.0, []
        for i, p in order:
            t = ABS.get(i, t)
            d = len(ys[i]) / SR; tl.append({'id': i, 'start': round(t, 3), 'end': round(t + d, 3), 'speed': SPEED.get(i, 1.0)}); t += d + p
        total = FILM_TOTAL; punch = [x for x in tl if x['id'] == 's9'][0]['start']
        buf = np.zeros(int((total + .3) * SR))
        for x in tl: y = ys[x['id']]; s0 = int(x['start'] * SR); buf[s0:s0 + len(y)] += y
        sf.write(os.path.join(OUT, name), buf, SR); return tl, total, punch
    tl, total, punch = mix(ORDER, 'voice_mix.wav')
    tl2, total2, punch2 = mix([(i if i != 's10a' else 's10b', p) for i, p in ORDER], 'voice_mix_10b.wav')
    json.dump({'lines': tl, 'total': total, 'voice_end': tl[-1]['end'], 'punch_start': punch, 'punch_pct': round(100 * punch / total, 1), 'total_10b': total2, 'punch_pct_10b': round(100 * punch2 / total2, 1), 'picks': report}, open(os.path.join(OUT, 'timeline.json'), 'w'), indent=1)
    for i in ys: print(i, 'dur', round(len(ys[i]) / SR, 2), report[i])
    print('total', round(total, 2), 'punch', round(punch, 2), round(100 * punch / total, 1), '%  | 10b total', round(total2, 2), round(100 * punch2 / total2, 1), '%')
