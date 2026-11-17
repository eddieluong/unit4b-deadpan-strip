"""Tập 10 voice: two seeds x one ElevenLabs take per character, Whisper-split into lines, per-line speed, fades.
  ELEVENLABS_API_KEY from env only.  ~/lemo-opuscar/.venv/bin/python voice_gen.py [--split]   (--split = reuse saved takes)
Writes voice/<id>.wav, voice/timeline.json, voice/take_<char>.wav (raw)."""
import json, os, re, sys, difflib, subprocess, urllib.request
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'voice'); os.makedirs(OUT, exist_ok=True)
SR = 24000; SEEDS = [1809, 2718]
_EL = json.load(open(os.path.join(HERE, '..', '..', '..', 'styles', 'deadpan-strip', 'elevenlabs.json')))['characters']
VOICE = {'steve': _EL['steve']['voice_id'], 'steve_peak': _EL['steve']['voice_id'], 'nana': _EL['nana']['voice_id'], 'snuggles': _EL['snuggles']['voice_id']}
SPK = {'steve_peak': 'steve'}
TAKES = {
 'steve': ([('s1', "[hollow, whispering] Two MINUTES."), ('s3', "[betrayed, flat] Why is he going LEFT?"), ('s4', "[stubborn, flat] Fine. I'll WAIT."),
            ('s5', "[flat, despairing] It's STILL two."), ('s9', "[flat, low, slow] Enjoy.")],
           {'stability': 0.35, 'similarity_boost': 0.85, 'style': 0.35, 'use_speaker_boost': True, 'speed': 1.0}),
 'steve_peak': ([('s7', "[joyful, shouting] FOOD!")],
           {'stability': 0.0, 'similarity_boost': 0.85, 'style': 0.5, 'use_speaker_boost': True, 'speed': 1.0}),
 'nana': ([('s8', "[warmly, sweet] It's still WARM, dear.")],
           {'stability': 0.5, 'similarity_boost': 0.85, 'style': 0.3, 'use_speaker_boost': True, 'speed': 0.9}),
 'snuggles': ([('s2', "[dry, noir] He said that an HOUR ago."), ('s10', "[dry, flat] So he ordered AGAIN.")],
              {'stability': 0.5, 'similarity_boost': 0.85, 'style': 0.35, 'use_speaker_boost': True, 'speed': 1.0}),
}
SPEED = json.load(open(os.path.join(HERE, 'speeds.json'))) if os.path.exists(os.path.join(HERE, 'speeds.json')) else {}
# script order (id, pause_after) from script.md. 4b silent 0.8 + ping 0.3 + "Mom added you" held 1.2 folded after s4 (+0.2);
# 6 / 6b: tap + ping + notification 1.0 each; 8: 0.3 + silent beat 8b 1.0 (+ Grandma ping) -> 1.3; punch pause 0.7
ORDER = [('s1', .2), ('s2', .3), ('s3', .2), ('s4', .3), ('s5', 1.3), ('s7', 1.0), ('s8', .8), ('s9', .7), ('s10', 0)]   # s5: .2+5b 1.0+ping .1; s7: .2+7b .8
ABS = {}; END_HOLD = 2.0   # picture hold after the last word (button + loop push-in), film total = voice end + END_HOLD
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
GAIN = {'s1': -3, 's2': -1.5, 's3': -2, 's4': -3, 's5': -3.5, 's7': 0, 's8': -4, 's9': -4.5, 's10': -2}   # dB: peak s7 loudest, punch s9 quietest
def finish(i, y):
    sp = SPEED.get(i, 1.0)
    if abs(sp-1) > 1e-3:
        tmp = os.path.join(OUT, '_t.wav'); sf.write(tmp, y, SR)
        o = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'atempo={sp}', '-ar', str(SR), '-f', 'wav', '-'], capture_output=True, check=True).stdout
        import io; y, _ = sf.read(io.BytesIO(o))
    fi, fo = int(.015*SR), int(.12*SR); y = y.copy(); y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)**1.5
    y = y * 10**(GAIN.get(i.split('_t')[0], 0)/20)
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
        total = tl[-1]['end'] + END_HOLD; punch = [x for x in tl if x['id'] == 's9'][0]['start']
        buf = np.zeros(int((total + .3) * SR))
        for x in tl: y = ys[x['id']]; s0 = int(x['start'] * SR); buf[s0:s0 + len(y)] += y
        sf.write(os.path.join(OUT, name), buf, SR); return tl, total, punch
    tl, total, punch = mix(ORDER, 'voice_mix.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(OUT, 'voice_mix.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7', '-ar', str(SR), '-ac', '1', os.path.join(OUT, 'preview.wav')], check=True)
    json.dump({'lines': tl, 'total': total, 'voice_end': tl[-1]['end'], 'punch_start': punch, 'punch_pct': round(100 * punch / total, 1), 'picks': report}, open(os.path.join(OUT, 'timeline.json'), 'w'), indent=1)
    for i in ys: print(i, 'dur', round(len(ys[i]) / SR, 2), report[i])
    print('total', round(total, 2), 'punch', round(punch, 2), round(100 * punch / total, 1), '%')
