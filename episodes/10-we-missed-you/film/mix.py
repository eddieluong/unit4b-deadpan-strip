"""Sound mix for 10 We Missed You: a melodramatic score (harp + bowed string pad) played completely straight,
cut dead at the note on the door, one huge hit on "Why?!", then the longing theme starts again for the loop.
Run with the lemo-opuscar venv:  ~/lemo-opuscar/.venv/bin/python mix.py   (reads events.json, voice_el/*.wav)
"""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.expanduser('~/lemo-opuscar'))
from core.audio import sfx as S, sampler as SM

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
DUR, EV = ev['dur'], ev['ev']
SR = S.SR
at = lambda k: [e['t'] for e in EV if e['type'] == k]
buf = np.zeros((int(DUR * SR), 2))

# ---------- voices ----------
voice_on = np.zeros(len(buf))
for e in EV:
    if e['type'] != 'voice': continue
    a, sr = sf.read(os.path.join(HERE, 'voice_el', e['id'] + '.wav'))
    if a.ndim > 1: a = a.mean(1)
    x = S.norm(resample_poly(a, SR, sr) if sr != SR else a, 0.9)
    S.add(buf, x, e['t'], 0.95, -0.1 if 'steve' in e['id'] else 0.1)
    s = int(e['t'] * SR); voice_on[s:s + len(x)] = 1

# ---------- score ----------
def hz(n):
    names = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    m = names[n[0]] + (1 if '#' in n else -1 if 'b' in n[1:-1] else 0) + 12 * (int(n[-1]) + 1)
    return 440 * 2 ** ((m - 69) / 12)

def strings(note, d, v=0.5, att=0.7, trem=False):
    """bowed string pad: 3 detuned band-limited saws with vibrato, slow attack, soft release"""
    tt = np.arange(int(d * SR)) / SR; f = hz(note); out = np.zeros_like(tt)
    for det in (-0.12, 0, 0.13):
        ph = 2 * np.pi * np.cumsum(f * 2 ** (det / 12) * (1 + 0.006 * np.sin(2 * np.pi * 5.3 * tt + det * 9))) / SR
        out += sum(np.sin(k * ph) / k for k in range(1, 9))
    env = np.minimum(1, tt / att) * np.minimum(1, (d - tt) / 0.5).clip(0)
    if trem: env *= 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 7 * tt))
    return S.lp(out, 2600) * env * v / 3

mus = np.zeros_like(buf)
def harp(n, t, v=0.5):
    try: S.add(mus, SM.note('harp', n, 2.5, vel=v), t, 0.35, 0.2)
    except Exception as e: print('harp', e)

def longing(t0, t1):   # D minor: harp arpeggios over a string pad, one chord per 2.4 s
    chords = [('D3', 'F3', 'A3', 'D4'), ('Bb2', 'D3', 'F3', 'Bb3'), ('G2', 'Bb2', 'D3', 'G3'), ('A2', 'C#3', 'E3', 'A3')]
    t, i = t0, 0
    while t < t1 - 0.4:
        ch = chords[i % 4]; d = min(2.4, t1 - t)
        for j, n in enumerate(ch): harp(n[:-1] + str(int(n[-1]) + 1), t + j * 0.18, 0.45)
        S.add(mus, strings(ch[3][:-1] + str(int(ch[3][-1]) + 1), d + 0.4, 0.22), t, 1.0, -0.2)
        S.add(mus, strings(ch[0], d + 0.4, 0.18), t, 1.0, 0.2)
        t += 2.4; i += 1

stop = at('stop')[0]
longing(0.0, at('swell')[0])
# the swell: hope! F major, louder, then on into the montage
sw = at('swell')[0]
for n, v in (('F4', 0.32), ('A4', 0.28), ('C5', 0.26), ('F3', 0.3)): S.add(mus, strings(n, 3.3, v, att=0.4), sw, 1.0)
for j, n in enumerate(('F4', 'A4', 'C5', 'F5')): harp(n, sw + j * 0.12, 0.6)
longing(sw + 3.1, at('tremble')[0])
tr = at('tremble')[0]   # 4:58 PM: tremolo strings, rising
for n in ('D4', 'F4', 'G#4'): S.add(mus, strings(n, stop - tr, 0.24, att=1.5, trem=True), tr, 1.0)
mus[int(stop * SR):] = 0   # the note on the door: music stops dead
hit = at('hit')[0]          # "Why?!": one huge hit, then nothing
for n, v in (('D2', 0.5), ('D3', 0.4), ('A3', 0.3), ('D4', 0.3), ('F4', 0.25)): S.add(mus, strings(n, 2.0, v, att=0.02), hit, 1.0)
try: S.add(mus, SM.note('gran_cassa', 'C2', 3, vel=1.0), hit, 0.9)
except Exception as e: print('gran_cassa', e)
loop = at('longing2')[0]    # the loop: the longing theme starts again, quietly
longing(loop, DUR)
duck = np.clip(1 - 0.55 * S.lp(voice_on, 8), 0.4, 1)
mus *= duck[:, None]

# ---------- foley ----------
fol = np.zeros_like(buf)
def buzz(t):
    for j in range(2):
        d = 0.32; tt = np.arange(int(d * SR)) / SR
        S.add(fol, np.sign(np.sin(2 * np.pi * 160 * tt)) * S.lp(np.ones_like(tt), 30) * 0.3 * np.minimum(1, (d - tt) * 30), t + j * 0.45, 0.25)
for t in at('buzz'): buzz(t)
for t in at('truck'):
    S.add(fol, S.rumble(2.2, 0.8), t, 0.45, 0.6); S.add(fol, S.whoosh(1.2, 0.5), t + 0.6, 0.3, -0.6)
for t in at('steps'):
    for j in range(5): S.add(fol, S.step(0.8), t + j * 0.11, 0.5, -0.2 + j * 0.1)
for t in at('slam'): S.add(fol, S.thump(1.0, 80), t, 0.8); S.add(fol, S.clack(0.5, 1.0), t, 0.5)
for t in at('flush'):
    d = 1.6; tt = np.arange(int(d * SR)) / SR
    S.add(fol, S.bp(S.noise(d), 300, 3000) * np.sin(np.pi * tt / d) ** 0.7 * (0.7 + 0.3 * np.sin(2 * np.pi * 3 * tt)), t, 0.25)

# room tone keeps the silences alive
room = S.lp(S.brown(DUR), 300) * 0.018
buf += room[:, None] + fol + mus
peak = np.abs(buf).max(); buf *= 0.9 / peak if peak > 0.9 else 1
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), buf.astype(np.float32), SR)
print('mix.wav', round(len(buf) / SR, 2), 's')
