"""Sound mix for 11 The Extra Hour (Tập 2): a warm harp lullaby for Saturday night, then a quiet room and a ticking
clock for the insomnia, one hopeful phrase as he drifts off, dead stop when the cat lands, a small plucked loop in the
kitchen. Run with the lemo-opuscar venv:  ~/lemo-opuscar/.venv/bin/python mix.py   (reads events.json, voice/*.wav)
"""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.expanduser('~/lemo-opuscar'))
from core.audio import sfx as S, sampler as SM, pluck as P

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
DUR, EV = ev['dur'], ev['ev']
SR = S.SR
at = lambda k: [e['t'] for e in EV if e['type'] == k]
buf = np.zeros((int(DUR * SR), 2))

# ---------- voices (level per line from VOICE_PROSODY.md: never flatten every line to the same level) ----------
GAIN_DB = {'11_s02': +1.5, '11_s04': +1, '11_s08': -1.5, '11_s10': -2, '11_s11': -2, '11_s12': -3, '11_n01': -1, '11_n02': -2, '11_s13': -3}
voice_on = np.zeros(len(buf))
for e in EV:
    if e['type'] != 'voice': continue
    a, sr = sf.read(os.path.join(HERE, 'voice', e['id'] + '.wav'))
    if a.ndim > 1: a = a.mean(1)
    x = S.norm(resample_poly(a, SR, sr) if sr != SR else a, 0.9) * 10 ** (GAIN_DB.get(e['id'], 0) / 20)
    S.add(buf, x, e['t'], 0.95, -0.08 if 'steve' in e['id'] else 0.08)
    s = int(e['t'] * SR); voice_on[s:s + len(x)] = 1

# ---------- music ----------
mus = np.zeros_like(buf)
def harp(n, t, v=0.3): S.add(mus, SM.note('harp', n, 2.0, vel=v), t, 0.28, 0.2)
def lullaby(t0, t1):   # 3/4 rocking figure, one bar = 1.8 s
    bars = [('F2', ['F4', 'A4', 'C5']), ('C3', ['E4', 'G4', 'C5']), ('D3', ['D4', 'F4', 'A4']), ('C3', ['E4', 'G4', 'Bb4'])]
    t, i = t0, 0
    while t < t1 - 0.3:
        bass, fig = bars[i % 4]
        S.add(mus, P.pluck('upright_bass_pizz', bass, 0.8, vel=0.45), t, 0.28)
        for j, n in enumerate(fig):
            if t + j * 0.6 < t1 - 0.2: harp(n, t + j * 0.6, 0.28)
        t += 1.8; i += 1
lullaby(at('lullaby')[0], at('click')[0])
for t0 in at('sting'):   # eyes snap open: a low pluck and a sour harp pair
    S.add(mus, P.pluck('upright_bass_pizz', 'C2', 1.2, vel=0.7), t0, 0.45)
    harp('F#4', t0 + 0.02, 0.35); harp('C5', t0 + 0.04, 0.35)
for t0 in at('choir'):   # the clock goes back: a soft "aaah" chord
    for n, v in (('F4', 0.2), ('A4', 0.18), ('C5', 0.16), ('F5', 0.12)):
        pass
    for j, n in enumerate(['F4', 'A4', 'C5', 'F5']): harp(n, t0 + j * 0.05, 0.3)
for t0 in at('hum'):     # drifting off: one hopeful, slow phrase
    for j, n in enumerate(['C5', 'A4', 'F4', 'A4']): harp(n, t0 + j * 0.45, 0.22)
stop = at('stop')[0]
mus[int(stop * SR):] = 0                   # the cat lands: music just stops
k0 = at('outro')[0]                        # kitchen: a small plucked loop
for j, n in enumerate(['F2', 'C3', 'F2']): S.add(mus, P.pluck('upright_bass_pizz', n, 0.6, vel=0.4), k0 + 0.3 + j * 0.9, 0.25)
for j, n in enumerate(['A4', 'C5', 'A4']): harp(n, k0 + 0.75 + j * 0.9, 0.2)
mus *= np.clip(1 - 0.5 * S.lp(voice_on, 8), 0.45, 1)[:, None]

# ---------- foley ----------
fol = np.zeros_like(buf)
def tt(d): return np.arange(int(d * SR)) / SR
for t in at('tick'):
    for j in range(3): S.add(fol, S.click(1.8, 0.7), t + 0.1 + j * 0.5, 0.5, 0.4)
for t in at('purr'):     # the cat asleep at the foot of the bed
    d = 1.4; S.add(fol, S.lp(S.noise(d), 180) * (0.6 + 0.4 * np.sin(2 * np.pi * 24 * tt(d))) * np.sin(np.pi * tt(d) / d), t, 0.35, 0.3)
for t in at('tick2'):
    j = 0
    while t + j * 1.0 < at('stop')[0] - 0.2: S.add(fol, S.click(1.9, 0.5), t + j * 1.0, 0.22, 0.4); j += 1
for t in at('click'): S.add(fol, S.click(0.9, 1.0), t, 0.6, 0.4)
for t in at('whoosh'): S.add(fol, S.whoosh(0.35, 0.6), t, 0.35)
for t in at('pillow'): S.add(fol, S.lp(S.noise(0.25), 900) * S.env_exp(0.25, 0.06), t, 0.6)
for t in at('buzz'):
    d = 0.25; S.add(fol, np.sign(np.sin(2 * np.pi * 160 * tt(d))) * 0.2 * np.minimum(1, (d - tt(d)) * 30), t, 0.15, 0.3)
for t in at('lapse'):    # time-lapse: fast scroll ticks rising
    for j in range(16): S.add(fol, S.click(1.2 + j * 0.06, 0.5), t + j * 0.05, 0.2, 0.3)
    S.add(fol, S.whoosh(0.6, 0.5), t + 0.2, 0.25)
for t in at('pop'): S.add(fol, S.pop(0.7), t, 0.3)
for t in at('ding'): S.add(fol, S.ding(0.6), t, 0.2, 0.4)
for t in at('hops'):
    for j in range(3): S.add(fol, S.thump(0.4, 120), t + 0.2 + j * 0.27, 0.25, 0.3 - j * 0.15)
for t in at('thump'): S.add(fol, S.thump(1.0, 70), t, 0.8); S.add(fol, S.bp(S.noise(0.2), 400, 3000) * S.env_exp(0.2, 0.05), t, 0.3)
for t in at('kibble'):
    rng = np.random.default_rng(3)
    for j in range(40): S.add(fol, S.click(1.4 + rng.random(), 0.5), t + 0.1 + rng.random() * 1.4, 0.18, 0.2)
for t in at('plink'):    # kibble bouncing off the cat's hat
    for j in range(4): S.add(fol, S.click(2.2, 0.6), t + j * 0.18, 0.25, 0.3)

room = S.lp(S.brown(DUR), 300)[:len(buf)] * 0.026
buf += room[:, None] + fol + mus
buf *= 0.9 / np.abs(buf).max()
for ch in (0, 1): buf[:, ch] = S.limit(S.compress(buf[:, ch], thr=.1, ratio=5), .28)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
import subprocess
raw, out = os.path.join(HERE, 'out', 'mix_raw.wav'), os.path.join(HERE, 'out', 'mix.wav')
sf.write(raw, buf.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-2.5:LRA=11,alimiter=limit=0.7:level=false', '-ar', str(SR), out], check=True)
print('mix.wav', round(len(buf) / SR, 2), 's')
