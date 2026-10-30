"""Sound mix for 14 Halloween Candy (Tập 5) (adapted from Tập 4): a low spooky pizzicato bed until the lights go off, then
silence so every doorbell, knock and the meow lands; wrapper crinkles for the week; a two-tone doorbell; a soft end sting.
Run with the lemo-opuscar venv:  ~/lemo-opuscar/.venv/bin/python mix.py   (reads events.json, voice/*.wav)
"""
import json, os, sys, subprocess
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
def tt(d): return np.arange(int(d * SR)) / SR

# ---------- voices (level by intensity) ----------
GAIN_DB = {'14_s02': +1, '14_s05': 0, '14_s09': -3, '14_s13': +3, '14_p12': -2, '14_s15': -3, '14_s16': -3, '14_meow': +1}
voice_on = np.zeros(len(buf))
for e in EV:
    if e['type'] != 'voice': continue
    a, sr = sf.read(os.path.join(HERE, 'voice', e['id'] + '.wav'))
    if a.ndim > 1: a = a.mean(1)
    x = S.norm(resample_poly(a, SR, sr) if sr != SR else a, 0.9) * 10 ** (GAIN_DB.get(e['id'], 0) / 20)
    if e['id'] == '14_p12': x = S.lp(x, 2800)                   # a kid behind glass, under a sheet
    pan = {'14_p12': 0.3, '14_meow': -0.25}.get(e['id'], -0.05)
    S.add(buf, x, e['t'], 0.95, pan)
    s = int(e['t'] * SR); voice_on[s:s + len(x)] = 1

# ---------- night air under the dark scenes ----------
night = S.lp(S.noise(DUR), 500)[:len(buf)] * 0.025
buf += night[:, None]

# ---------- music: a sneaky minor pizzicato bed, cut dead when the lights go off ----------
mus = np.zeros_like(buf)
stop = at('click')[0]
def harp(n, t, v=0.25): S.add(mus, SM.note('harp', n, 1.4, vel=v), t, 0.22, 0.2)
t, i = 0.0, 0
bars = [('A2', ['C4', 'E4', 'A4']), ('F2', ['C4', 'F4', 'A4']), ('E2', ['B3', 'E4', 'G#4']), ('A2', ['C4', 'E4', 'A4'])]
while t < stop - 0.3:
    bass, fig = bars[i % 4]; S.add(mus, P.pluck('upright_bass_pizz', bass, 0.5, vel=0.4), t, 0.28)
    for j, n in enumerate(fig):
        if t + j * 0.45 < stop - 0.2: harp(n, t + j * 0.45, 0.18)
    t += 1.4; i += 1
for t0 in at('sting'): S.add(mus, P.pluck('upright_bass_pizz', 'A1', 1.2, vel=0.6), t0, 0.4); harp('A4', t0 + 0.05, 0.28)
mus *= np.clip(1 - 0.5 * S.lp(voice_on, 8), 0.45, 1)[:, None]

# ---------- foley ----------
fol = np.zeros_like(buf)
def tone(f, d, v=0.3): return np.sin(2 * np.pi * f * tt(d)) * np.exp(-tt(d) * 3) * np.minimum(1, tt(d) * 200) * v
def crinkle(d=0.35):
    n = S.hp(S.noise(d), 2500); g = (S._rng.random(len(n)) > 0.985).astype(float)
    return S.lp(g, 400) * n * 6 * np.sin(np.pi * tt(d)[:len(n)] / d)
for t in at('murmur'): S.add(fol, S.lp(S.noise(3.0), 900) * np.sin(np.pi * tt(3.0) / 3.0), t, 0.08)
for t in at('slap'): S.add(fol, S.click(0.7), t, 0.4)
for t in at('crinkle'): S.add(fol, crinkle(), t, 0.35, 0.1)
for t in at('rustle'): S.add(fol, crinkle(0.8), t, 0.4, 0.1)
for t in at('tick'):
    for j in range(3): S.add(fol, S.click(1.4, 0.6), t + j * 0.25, 0.3)
for t in at('ding'):
    S.add(fol, tone(784, 0.9, 0.5), t, 0.45, 0.4); S.add(fol, tone(622, 1.1, 0.5), t + 0.38, 0.45, 0.4)
for t in at('click'): S.add(fol, S.click(1.0, 1.0), t, 0.6)
for t in at('thud'): S.add(fol, S.thump(0.6, 70), t, 0.5)
for t in at('knock'):
    for j in range(3): S.add(fol, S.thump(1.0, 110), t + j * 0.2, 0.7, 0.4)
for t in at('chew'):
    for j in range(4): S.add(fol, S.lp(S.noise(0.12), 900) * np.sin(np.pi * tt(0.12) / 0.12), t + j * 0.28, 0.25)

buf += fol + mus
buf *= 0.9 / np.abs(buf).max()
for ch in (0, 1): buf[:, ch] = S.limit(S.compress(buf[:, ch], thr=.1, ratio=5), .28)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
raw, out = os.path.join(HERE, 'out', 'mix_raw.wav'), os.path.join(HERE, 'out', 'mix.wav')
sf.write(raw, buf.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-2.5:LRA=11,alimiter=limit=0.7:level=false', '-ar', str(SR), out], check=True)
print('mix.wav', round(len(buf) / SR, 2), 's')
