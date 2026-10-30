"""Sound mix for 15 Early Black Friday (Tập 6), adapted from Tập 5: low bright shop muzak that stops dead at the 6 a.m. shutter,
paper banner slaps, price-gun zaps, a velvet-rope snap, a rolling shutter, a sleeping-bag zip. All SFX are synthesised (no API).
Run with the lemo-opuscar venv:  ~/lemo-opuscar/.venv/bin/python mix.py   (reads events.json, voice/*.wav -> out/mix_raw.wav, out/mix.wav)
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
GAIN_DB = {'15_s01': 0, '15_s02': 0, '15_s03': 0, '15_p04': -1, '15_s05': -1, '15_p06': -1, '15_s07': +1, '15_s08': -1, '15_s09': 0, '15_s11': +2, '15_p12': -2, '15_s13': -2}
voice_on = np.zeros(len(buf))
for e in EV:
    if e['type'] != 'voice': continue
    a, sr = sf.read(os.path.join(HERE, 'voice', e['id'] + '.wav'))
    if a.ndim > 1: a = a.mean(1)
    x = S.norm(resample_poly(a, SR, sr) if sr != SR else a, 0.9) * 10 ** (GAIN_DB.get(e['id'], 0) / 20)
    pan = 0.3 if e['id'].startswith('15_p') else -0.05
    S.add(buf, x, e['t'], 0.95, pan)
    s = int(e['t'] * SR); voice_on[s:s + len(x)] = 1

# ---------- shop muzak: bright, low, cut dead at the shutter ----------
mus = np.zeros_like(buf)
stop = at('shutter')[0]
def harp(n, t, v=0.25): S.add(mus, SM.note('harp', n, 1.2, vel=v), t, 0.2, 0.2)
bars = [('C3', ['E4', 'G4', 'C5', 'G4']), ('A2', ['E4', 'A4', 'C5', 'A4']), ('F2', ['F4', 'A4', 'C5', 'A4']), ('G2', ['D4', 'G4', 'B4', 'G4'])]
t, i = 0.0, 0
while t < stop - 0.2:
    bass, fig = bars[i % 4]; S.add(mus, P.pluck('upright_bass_pizz', bass, 0.45, vel=0.4), t, 0.26)
    for j, n in enumerate(fig):
        if t + j * 0.35 < stop - 0.1: harp(n, t + j * 0.35, 0.2)
    t += 1.4; i += 1
mus *= np.clip(1 - 0.55 * S.lp(voice_on, 8), 0.4, 1)[:, None]
k = int(stop * SR); mus[k:] = 0                                                # silence from the shutter on

# ---------- foley ----------
fol = np.zeros_like(buf)
def slap():   # a paper banner slapped on a wall
    x = S.bp(S.noise(0.12), 600, 4500) * S.env_exp(0.12, 0.018); return S.norm(x) * 0.9
def zap():    # price gun: ratchet clicks + a "ka-chunk"
    out = np.zeros(int(0.5 * SR))
    for j, d in enumerate([0, 0.045, 0.09]): out[int(d * SR):int(d * SR) + len(S.click(1.3 + j * 0.2))] += S.click(1.3 + j * 0.2, 0.7)
    c = S.clack(0.8, 1.0); out[int(0.15 * SR):int(0.15 * SR) + len(c)] += c
    return S.norm(out)
def snap():   # velvet rope pulled tight: a crack and a short brass twang
    d = 0.5; x = np.zeros(int(d * SR)); c = S.click(0.7, 1.0); x[:len(c)] += c
    x += np.sin(2 * np.pi * 420 * tt(d)) * np.exp(-tt(d) * 14) * 0.25 + np.sin(2 * np.pi * 630 * tt(d)) * np.exp(-tt(d) * 18) * 0.15
    return S.norm(x)
def shutter(d=1.0):   # a rolling shutter: slat rattle speeding up + a low rumble
    x = np.zeros(int(d * SR))
    t = 0.0
    while t < d - 0.05:
        c = S.clack(0.5 + 0.4 * np.random.rand(), 0.8); s0 = int(t * SR); x[s0:s0 + len(c)] += c[:len(x) - s0]; t += 0.075 - 0.03 * t / d
    x += S.lp(S.noise(d), 260) * 0.8 * np.sin(np.pi * tt(d) / d)
    return S.norm(x)
def zipper(d=0.6):    # sleeping-bag zip: fast ticks, rising noise
    n = S.hp(S.noise(d), 3000) * (0.4 + tt(d) / d); g = (np.sin(2 * np.pi * 70 * tt(d) * (1 + tt(d))) > 0.6).astype(float)
    return S.norm(S.lp(g, 3000) * n) * 0.8
def add_fol(x, t, g, p=0.0): S.add(fol, x, t, g, p)
for t in at('slap'): add_fol(slap(), t, 0.6)
for t in at('zap'): add_fol(zap(), t, 0.55, 0.3)
for t in at('snap'): add_fol(snap(), t, 0.5)
for t in at('shutter'): add_fol(shutter(), t, 0.7)
for t in at('zip'): add_fol(zipper(), t, 0.55)
np.random.seed(3)

buf += fol + mus
buf *= 0.9 / np.abs(buf).max()
for ch in (0, 1): buf[:, ch] = S.limit(S.compress(buf[:, ch], thr=.1, ratio=5), .28)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
raw, out = os.path.join(HERE, 'out', 'mix_raw.wav'), os.path.join(HERE, 'out', 'mix.wav')
sf.write(raw, buf.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-2.5:LRA=11,alimiter=limit=0.7:level=false', '-ar', str(SR), out], check=True)
print('mix.wav', round(len(buf) / SR, 2), 's')
