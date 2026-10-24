"""Sound mix for 10 We Missed You (Tập 1) v3: real life, small sounds.
A light "waiting" loop (harp + soft plucked bass) under the day, a solemn string swell only inside the lighthouse
cutaway, the music stops at the note, and the waiting loop comes back for the loop ending.
Run with the lemo-opuscar venv:  ~/lemo-opuscar/.venv/bin/python mix.py   (reads events.json, voice/*.wav)
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

# ---------- voices ----------
# Level per line from Steve's prosody profile (styles/deadpan-strip/VOICE_PROSODY.md): never flatten every line to the same level.
GAIN_DB = {'10_02_steve': 0, '10_03_steve': +2, '10_04_steve': -3, '10_06_steve': +1.5, '10_07_steve': -5, '10_08_steve': -4,
           '10_01_snuggles': -1, '10_09_snuggles': -1}
voice_on = np.zeros(len(buf))
for e in EV:
    if e['type'] != 'voice': continue
    a, sr = sf.read(os.path.join(HERE, 'voice', e['id'] + '.wav'))
    if a.ndim > 1: a = a.mean(1)
    x = S.norm(resample_poly(a, SR, sr) if sr != SR else a, 0.9) * 10 ** (GAIN_DB.get(e['id'], 0) / 20)   # loudness carries the feeling (VOICE_PROSODY.md)
    fi, fo = int(0.015 * SR), int(0.12 * SR); x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo) ** 1.5   # no hard starts or cut-offs
    S.add(buf, x, e['t'], 0.95, -0.08 if 'steve' in e['id'] else 0.08)
    s = int(e['t'] * SR); voice_on[s:s + len(x)] = 1

# ---------- music ----------
def hz(n):
    names = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    m = names[n[0]] + (1 if '#' in n else -1 if 'b' in n[1:-1] else 0) + 12 * (int(n[-1]) + 1)
    return 440 * 2 ** ((m - 69) / 12)

def strings(note, d, v=0.5, att=0.5):
    tt = np.arange(int(d * SR)) / SR; f = hz(note); out = np.zeros_like(tt)
    for det in (-0.12, 0, 0.13):
        ph = 2 * np.pi * np.cumsum(f * 2 ** (det / 12) * (1 + 0.006 * np.sin(2 * np.pi * 5.3 * tt + det * 9))) / SR
        out += sum(np.sin(k * ph) / k for k in range(1, 9))
    return S.lp(out, 2400) * np.minimum(1, tt / att) * np.minimum(1, (d - tt) / 0.4).clip(0) * v / 3

mus = np.zeros_like(buf)
def harp(n, t, v=0.4):
    S.add(mus, SM.note('harp', n, 2.0, vel=v), t, 0.28, 0.25)
def waiting(t0, t1):
    """light, a little hopeful, very small: harp figure over a plucked bass, one bar = 2.4 s"""
    bars = [('C3', ['E4', 'G4', 'C5', 'G4']), ('A2', ['E4', 'A4', 'C5', 'A4']), ('F2', ['F4', 'A4', 'C5', 'A4']), ('G2', ['D4', 'G4', 'B4', 'G4'])]
    t, i = t0, 0
    while t < t1 - 0.3:
        bass, fig = bars[i % 4]
        S.add(mus, P.pluck('upright_bass_pizz', bass, 0.6, vel=0.5), t, 0.3)
        for j, n in enumerate(fig):
            if t + j * 0.6 < t1 - 0.2: harp(n, t + j * 0.6, 0.32)
        t += 2.4; i += 1

stop = at('stop')[0]
waiting(at('wait')[0], at('violin')[0])
for t0 in at('cold'): S.add(mus, P.pluck('upright_bass_pizz', 'C2', 1.2, vel=0.6), t0 + 0.15, 0.4)   # cold open: one low pluck under the note
v0 = at('violin')[0]                     # the lighthouse: one solemn string swell, then back to normal life
for n, v in (('D3', 0.3), ('A3', 0.25), ('F4', 0.22), ('D5', 0.18)): S.add(mus, strings(n, 1.5, v, att=0.25), v0, 1.0)
waiting(at('wait2')[0], stop)
mus[int(stop * SR):] = 0                 # the note on the door: music just stops
waiting(at('wait3')[0], DUR)
mus *= np.clip(1 - 0.5 * S.lp(voice_on, 8), 0.45, 1)[:, None]

# ---------- foley ----------
fol = np.zeros_like(buf)
def buzz(t):
    for j in range(2):
        d = 0.3; tt = np.arange(int(d * SR)) / SR
        S.add(fol, np.sign(np.sin(2 * np.pi * 160 * tt)) * 0.25 * np.minimum(1, (d - tt) * 30), t + j * 0.42, 0.22)
for t in at('buzz'): buzz(t)
for t in at('truck'): S.add(fol, S.rumble(3.0, 0.8), t, 0.5, -0.5); S.add(fol, S.whoosh(1.4, 0.4), t + 1.6, 0.25, -0.7)
for t in at('chair'):
    d = 0.35; S.add(fol, S.bp(S.noise(d), 200, 1200) * S.env_exp(d, 0.1), t, 0.35)
    for j in range(4): S.add(fol, S.step(0.7), t + 0.25 + j * 0.13, 0.45, -0.3)
for t in at('tick'):    # cold open: a wall clock, so the first second is not silent
    for j in range(4): S.add(fol, S.click(1.8, 0.8), t + 0.12 + j * 0.5, 0.6, 0.3)
for t in at('paper'): S.add(fol, S.lp(S.hp(S.noise(0.35), 1500), 6000) * S.env_exp(0.35, 0.09), t, 0.5, 0.3)
for t in at('crack'):
    for j in range(3): S.add(fol, S.click(0.7, 0.8), t + j * 0.09, 0.35)
for t in at('ding'): S.add(fol, S.ding(0.6), t, 0.18, 0.2)
for t in at('pop'): S.add(fol, S.pop(0.7), t, 0.35)
for t in at('steps'):
    for j in range(5): S.add(fol, S.step(0.8), t + j * 0.1, 0.45, -0.4 + j * 0.05)
for t in at('whoosh'): S.add(fol, S.whoosh(0.4, 0.5), t, 0.25)
for t in at('door'): S.add(fol, S.thump(0.6, 90), t, 0.5); S.add(fol, S.click(0.6, 0.5), t + 0.05, 0.3)
for t in at('flush'):
    d = 1.5; tt = np.arange(int(d * SR)) / SR
    S.add(fol, S.bp(S.noise(d), 300, 3000) * np.sin(np.pi * tt / d) ** 0.7, t, 0.22)

room = S.lp(S.brown(DUR), 300)[:len(buf)] * 0.026   # a steady room bed, so gaps between lines are never dead silence   # brown() can round to one sample more than buf
buf += room[:, None] + fol + mus
buf *= 0.9 / np.abs(buf).max()
for ch in (0, 1): buf[:, ch] = S.limit(S.compress(buf[:, ch], thr=.1, ratio=5), .28)   # tame transients so mux.sh hits -14 LUFS with safe peaks
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), buf.astype(np.float32), SR)
# pre-master to the platform target with true-peak headroom, so mux.sh's loudnorm has almost nothing to do
import subprocess
raw, out = os.path.join(HERE, 'out', 'mix_raw.wav'), os.path.join(HERE, 'out', 'mix.wav')
os.replace(out, raw)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-2.5:LRA=11,alimiter=limit=0.7:level=false', '-ar', str(SR), out], check=True)
print('mix.wav', round(len(buf) / SR, 2), 's')
