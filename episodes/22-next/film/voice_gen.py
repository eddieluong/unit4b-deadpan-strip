"""Tap 13 Perfect voice: one ElevenLabs call per line x 2 seeds, trimmed, per-line speed, fades, timeline.
  ELEVENLABS_API_KEY from env only.  HF_HUB_OFFLINE=1 ~/lemo-opuscar/.venv/bin/python voice_gen.py
Writes voice/<id>.wav (+ <id>_t<seed>.wav), voice/timeline.json, voice/preview.wav, voice/take_<id>_<seed>.wav (raw)."""
import json, os, re, io, difflib, subprocess, urllib.request
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'voice'); os.makedirs(OUT, exist_ok=True)
SR = 24000; SEEDS = [1809, 2718]
_EL = json.load(open(os.path.join(HERE, '..', '..', '..', 'styles', 'deadpan-strip', 'elevenlabs.json')))['characters']
VID = {k: _EL[k]['voice_id'] for k in ('steve', 'snuggles', 'ted')}
def st(stab, style, sp=1.0): return {'stability': stab, 'similarity_boost': 0.85, 'style': style, 'use_speaker_boost': True, 'speed': sp}
# id: (voice, text with tag, settings)
LINES = {
 's1':  ('steve', "[careful, shivering, quiet] Okay. Just a LITTLE warmer.", st(.4, .3)),
 's2':  ('snuggles', "[dry, noir narrator, flat] Two settings. ICE... and lava.", st(.5, .35)),
 's3':  ('steve', "[strained calm, through teeth] That's LAVA.", st(.35, .3)),
 's4':  ('steve', "[flat, defeated] ...And that's the ARCTIC.", st(.4, .3)),
 's5':  ('steve', "[focused whisper] Just. One. HAIR.", st(.35, .3)),
 's5b': ('steve', "[held-breath whisper] Easy... easy...", st(.35, .3)),
 's6':  ('steve', "[bliss, warm, not shouted] Ohhh... PERFECT.", st(.25, .45)),
 's7':  ('snuggles', "[hushed dread, whisper] Nobody MOVE.", st(.5, .3)),
}
SPEED = {'s1': 1.15, 's2': 1.15, 's3': 1.15, 's4': .95, 's5': 1.15, 's5b': 1.05, 's6': .9, 's7': .9}
GAIN = {'s1': -3, 's2': -1.5, 's3': -2, 's4': -3, 's5': -3.5, 's5b': -4, 's6': 0, 's7': -3}
# pauses after, from script.md
def order(punch=None): return [('s1', .2), ('s2', .3), ('s3', .2), ('s4', .3), ('s5', .2), ('s5b', .4), ('s6', .3), ('s7', 0)]
END_HOLD = 0.0
CHOICE = json.load(open(os.path.join(HERE, 'choice.json'))) if os.path.exists(os.path.join(HERE, 'choice.json')) else {}
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
def rms(x, hop=240): n = len(x)//hop; return np.sqrt((x[:n*hop].reshape(n, hop)**2).mean(1) + 1e-12)
def generate(i, sd):
    p = os.path.join(OUT, f'take_{i}_{sd}.wav')
    if os.path.exists(p): return
    v, t, s = LINES[i]
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VID[v]}?output_format=pcm_24000',
        data=json.dumps({'text': t, 'model_id': 'eleven_v3', 'seed': sd, 'voice_settings': s}).encode(),
        headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
    sf.write(p, np.frombuffer(urllib.request.urlopen(req).read(), dtype='<i2').astype(np.float32)/32768, SR)
def trim(x):
    r = rms(x); db = 20*np.log10(r/r.max()); loud = np.where(db > -32)[0]
    return x[max(0, loud[0]-4)*240:min(len(r), loud[-1]+30)*240].copy()
def finish(i, y):
    sp = SPEED.get(i.split('_t')[0], 1.0)
    if abs(sp-1) > 1e-3:
        tmp = os.path.join(OUT, '_t.wav'); sf.write(tmp, y, SR)
        o = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'atempo={sp}', '-ar', str(SR), '-f', 'wav', '-'], capture_output=True, check=True).stdout
        y, _ = sf.read(io.BytesIO(o))
    fi, fo = int(.015*SR), int(.12*SR); y = y.copy(); y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)**1.5
    y = y*10**(GAIN.get(i.split('_t')[0], 0)/20); sf.write(os.path.join(OUT, f'{i}.wav'), y, SR); return y
def asr(y, M, want):
    segs, _ = M.transcribe(resample_poly(y, 2, 3).astype(np.float32), language='en', beam_size=5, condition_on_previous_text=False)
    return difflib.SequenceMatcher(a=norm(want), b=norm(''.join(s.text for s in segs))).ratio()
def f0(y):
    import numpy as np
    seg = y[:int(len(y))]; fr = 1440; ps = []
    for k in range(0, len(seg)-fr, fr//2):
        w = seg[k:k+fr]
        if np.sqrt((w**2).mean()) < 0.02: continue
        ac = np.correlate(w, w, 'full')[fr-1:]; lo, hi = SR//400, SR//70; ps.append(SR/(lo+np.argmax(ac[lo:hi])))
    return (float(np.median(ps)) if ps else 0.0)
if __name__ == '__main__':
    from faster_whisper import WhisperModel
    M = WhisperModel('base.en', device='cpu', compute_type='int8'); ys, rep = {}, {}
    for i in LINES:
        want = re.sub(r'\[[^\]]*\]', '', LINES[i][1]); c = {}
        for sd in SEEDS:
            generate(i, sd); x, _ = sf.read(os.path.join(OUT, f'take_{i}_{sd}.wav')); y = finish(f'{i}_t{sd}', trim(x))
            c[sd] = (y, asr(y, M, want))
        a, b = SEEDS; pick = a if c[a][1]-c[b][1] > .02 else b if c[b][1]-c[a][1] > .02 else min(c, key=lambda s: len(c[s][0]))
        pick = CHOICE.get(i, pick); ys[i] = finish(i, trim(sf.read(os.path.join(OUT, f'take_{i}_{pick}.wav'))[0]))
        rep[i] = {'seed': pick, 'asr': {str(s): round(c[s][1], 2) for s in c}, 'dur_raw': {str(s): round(len(c[s][0])/SR, 2) for s in c}, 'f0_hz': round(f0(ys[i]))}
    out = {}
    for punch in ('main',):
        t, tl = 0.0, []
        for i, p in order(punch):
            d = len(ys[i])/SR; tl.append({'id': i, 'start': round(t, 3), 'end': round(t+d, 3), 'speed': SPEED.get(i, 1.0)}); t += d+p
        total = tl[-1]['end'] + END_HOLD; ps = tl[-1]['start']
        buf = np.zeros(int((total+.3)*SR))
        for x in tl: y = ys[x['id']]; s0 = int(x['start']*SR); buf[s0:s0+len(y)] += y
        sf.write(os.path.join(OUT, f'voice_mix_{punch}.wav'), buf, SR)
        out[punch] = {'lines': tl, 'voice_end': tl[-1]['end'], 'punch_start': ps, 'punch_pct_of_voice_end': round(100*ps/total, 1), 'vo_sum': round(sum(len(ys[x['id']])/SR for x in tl), 2)}
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(OUT, 'voice_mix_main.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7', '-ar', str(SR), '-ac', '1', os.path.join(OUT, 'preview.wav')], check=True)
    json.dump({'variants': out, 'picks': rep}, open(os.path.join(OUT, 'timeline.json'), 'w'), indent=1)
    for i in ys: print(i, round(len(ys[i])/SR, 2), rep[i])
    for k, v in out.items(): print(k, 'vo_sum', v['vo_sum'], 'voice_end', round(v['voice_end'], 2), 'punch', round(v['punch_start'], 2), v['punch_pct_of_voice_end'], '%')
