"""Sound mix for 16 Last Day on Earth (Tập 7). Anxious low ostinato (2 A.M.) -> up-tempo list -> bleep -> birds/harp morning; music cut dead at row 12 (before the punch).
All SFX synthesised. Run: ~/lemo-opuscar/.venv/bin/python mix.py  (reads events.json, voice/*.wav -> out/mix_raw.wav, out/mix.wav)"""
import json, os, sys, subprocess
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.expanduser('~/lemo-opuscar'))
from core.audio import sfx as S, sampler as SM, pluck as P
HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json'))); DUR, EV = ev['dur'], ev['ev']
SR = S.SR; at = lambda k: [e['t'] for e in EV if e['type'] == k]
buf = np.zeros((int(DUR * SR), 2)); np.random.seed(7)
tt = lambda d: np.arange(int(d * SR)) / SR
GAIN = {'16_s01': 1, '16_s02': 1, '16_s03': 0, '16_s04': 0, '16_s05': 0, '16_s06': 0, '16_s07': 1, '16_s08': 0, '16_s10': 0, '16_s11': 0, '16_s12': 0, '16_s13': -1, '16_p14': -1}
voice_on = np.zeros(len(buf))
for e in EV:
    if e['type'] != 'voice': continue
    a, sr = sf.read(os.path.join(HERE, 'voice', e['id'] + '.wav'))
    if a.ndim > 1: a = a.mean(1)
    x = S.norm(resample_poly(a, SR, sr) if sr != SR else a, 0.9) * 10 ** (GAIN.get(e['id'], 0) / 20)
    S.add(buf, x, e['t'], 0.95, 0.25 if e['id'].startswith('16_p') else -0.05)
    s = int(e['t'] * SR); voice_on[s:s + len(x)] = 1
# ---------- music ----------
mus = np.zeros_like(buf); stop = at('musicStop')[0]; r4 = [e['t'] for e in EV if e['type'] == 'voice' and e['id'] == '16_s04'][0]
bleep = at('bleep')[0]; r9 = bleep + 0.6
t, i = 0.0, 0
while t < min(r4, stop) - 0.1:   # anxious: low pedal + sparse high tick
    S.add(mus, P.pluck('upright_bass_pizz', 'E2' if i % 4 < 3 else 'F2', 0.8, vel=0.5), t, 0.3)
    if i % 2: S.add(mus, SM.note('harp', 'B5', 0.6, vel=0.12), t + 0.4, 0.12, 0.3)
    t += 0.8; i += 1
bars = [('C3', ['E4', 'G4', 'C5', 'G4']), ('A2', ['E4', 'A4', 'C5', 'A4']), ('F2', ['F4', 'A4', 'C5', 'A4']), ('G2', ['D4', 'G4', 'B4', 'G4'])]
t, i = r4, 0
while t < bleep - 0.05:   # up-tempo list
    b, fig = bars[i % 4]; S.add(mus, P.pluck('upright_bass_pizz', b, 0.3, vel=0.5), t, 0.3)
    for j, n in enumerate(fig):
        if t + j * 0.25 < bleep: S.add(mus, SM.note('harp', n, 0.8, vel=0.3), t + j * 0.25, 0.22, 0.2)
    t += 1.0; i += 1
t, i = r9 + 0.9, 0
while t < stop - 0.2:    # soft morning
    for j, n in enumerate(['C4', 'E4', 'G4', 'E4']):
        if t + j * 0.4 < stop - 0.1: S.add(mus, SM.note('harp', n, 1.0, vel=0.2), t + j * 0.4, 0.2, 0.2)
    t += 1.6; i += 1
mus *= np.clip(1 - 0.55 * S.lp(voice_on, 8), 0.4, 1)[:, None]
mus[int(stop * SR):] = 0
# ---------- foley ----------
fol = np.zeros_like(buf)
def F(x, t, g, p=0.0): S.add(fol, x, t, g, p)
def slap(): return S.norm(S.bp(S.noise(0.12), 600, 4500) * S.env_exp(0.12, 0.018)) * 0.9
def snip():
    out = np.zeros(int(0.3 * SR))
    for d in (0, 0.07):
        c = S.bp(S.noise(0.05), 3000, 9000) * S.env_exp(0.05, 0.008); out[int(d * SR):int(d * SR) + len(c)] += c
    return S.norm(out)
def splat(): d = 0.35; return S.norm(S.lp(S.noise(d), 900) * S.env_exp(d, 0.09) + S.lp(S.noise(d), 200) * S.env_exp(d, 0.05))
def click(): return S.norm(S.click(1.0, 1.0))
def chaching():
    out = np.zeros(int(0.9 * SR))
    for k, (f, d) in enumerate([(1568, 0.0), (2093, 0.12)]):
        n = tt(0.7); out[int(d * SR):int(d * SR) + len(n)] += (np.sin(2 * np.pi * f * n) + 0.4 * np.sin(2 * np.pi * f * 2.76 * n)) * np.exp(-n * 6)
    c = S.clack(0.6, 1.0); out[:len(c)] += c
    return S.norm(out)
def typing(d):
    x = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.05:
        c = S.click(0.6 + 0.5 * np.random.rand(), 0.6); s0 = int(t * SR); x[s0:s0 + len(c)] += c[:len(x) - s0]; t += 0.05 + 0.04 * np.random.rand()
    return S.norm(x)
def bleepf(): n = tt(0.6); return np.sin(2 * np.pi * 1000 * n) * 0.35 * np.minimum(1, np.minimum(n / 0.01, (0.6 - n) / 0.01))
def slam(): return S.norm(S.thump(1.0)) if hasattr(S, 'thump') else slap()
def chirp(f0):
    x = np.zeros(int(0.5 * SR))
    for k in range(3):
        n = tt(0.1); s0 = int((k * 0.14) * SR); y = np.sin(2 * np.pi * (f0 + 900 * n / 0.1 * (1 if k % 2 else -1)) * n) * np.hanning(len(n)); x[s0:s0 + len(y)] += y
    return S.norm(x) * 0.7
def doorbell():
    out = np.zeros(int(1.2 * SR))
    for f, d in [(784, 0.0), (622, 0.45)]:
        n = tt(0.75); out[int(d * SR):int(d * SR) + len(n)] += (np.sin(2 * np.pi * f * n) + 0.3 * np.sin(2 * np.pi * f * 2 * n)) * np.exp(-n * 4)
    return S.norm(out)
def thud(): d = 0.6; n = tt(d); return S.norm(np.sin(2 * np.pi * (70 - 30 * n) * n) * np.exp(-n * 9) + S.lp(S.noise(d), 300) * S.env_exp(d, 0.05) * 0.6)
def whoosh(): d = 0.4; return S.norm(S.bp(S.noise(d), 500, 3500) * np.sin(np.pi * tt(d) / d)) * 0.6
def smash(): d = 0.5; n = tt(d); return S.norm(S.noise(d) * S.env_exp(d, 0.1) + np.sin(2 * np.pi * 90 * n) * np.exp(-n * 8))
for k, (fn, g, p) in {'slap': (slap, .6, 0), 'snip': (snip, .7, 0), 'splat': (splat, .8, 0), 'click': (click, .6, 0), 'chaching': (chaching, .5, .2), 'bleep': (bleepf, .55, 0), 'slam': (slam, .8, 0),
                      'doorbell': (doorbell, .6, 0), 'thud': (thud, .9, 0), 'whoosh': (whoosh, .4, 0), 'smash': (smash, .7, 0)}.items():
    for t in at(k): F(fn(), t, g, p)
for e in EV:
    if e['type'] == 'typing': F(typing(e['d']), e['t'], 0.45)
for t in at('birds'): F(chirp(2600), t, 0.35, -0.3); F(chirp(3200), t + 0.25, 0.3, 0.3)
buf += fol + mus
buf *= 0.9 / np.abs(buf).max()
for ch in (0, 1): buf[:, ch] = S.limit(S.compress(buf[:, ch], thr=.1, ratio=5), .28)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
raw, out = os.path.join(HERE, 'out', 'mix_raw.wav'), os.path.join(HERE, 'out', 'mix.wav')
sf.write(raw, buf.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-2.5:LRA=11,alimiter=limit=0.7:level=false', '-ar', str(SR), out], check=True)
print('mix.wav', round(len(buf) / SR, 2), 's')
