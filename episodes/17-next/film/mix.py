"""Mix for 17 Typing (Tap 8): voice_mix + synthesised sfx + quiet low pluck bed. Run: ~/lemo-opuscar/.venv/bin/python mix.py -> out/mix.wav"""
import json, os, sys, subprocess
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.expanduser('~/lemo-opuscar'))
from core.audio import sfx as S, pluck as P, sampler as SM
HERE = os.path.dirname(os.path.abspath(__file__)); SR = S.SR
ev = json.load(open(os.path.join(HERE, 'events.json'))); T = ev['T']; EV = ev['ev']
TL = json.load(open(os.path.join(HERE, 'voice', 'timeline.json'))); DUR = TL['total']
buf = np.zeros((int(DUR * SR) + SR // 2, 2)); np.random.seed(5)
tt = lambda d: np.arange(int(d * SR)) / SR
a, sr = sf.read(os.path.join(HERE, 'voice', 'voice_mix.wav'))
if a.ndim > 1: a = a.mean(1)
v = S.norm(resample_poly(a, SR, sr) if sr != SR else a, 0.9)
v = v[:len(buf)]; S.add(buf, v, 0.0, 0.95, 0.0)
voice_on = np.zeros(len(buf))
for l in TL['lines']: voice_on[int(l['start'] * SR):int(l['end'] * SR)] = 1
# music: low pluck ostinato, cut during the silent beat 7b and the punch
mus = np.zeros_like(buf); t, i = 0.0, 0
while t < DUR:
    S.add(mus, P.pluck('upright_bass_pizz', ['E2', 'E2', 'G2', 'F2'][i % 4], 0.8, vel=0.45), t, 0.3)
    if i % 2: S.add(mus, SM.note('harp', 'B5', 0.6, vel=0.1), t + 0.4, 0.1, 0.3)
    t += 0.8; i += 1
env = np.clip(1 - 0.6 * S.lp(voice_on, 8), 0.4, 1)
for a0, a1 in [(T['still'] - 0.1, T['ping']), (T['k'] - 0.05, T['k'] + 1.0)]:
    env[int(a0 * SR):int(a1 * SR)] = 0
env = S.lp(env, 30); mus *= env[:, None]
fol = np.zeros_like(buf)
def F(x, t, g, p=0.0): S.add(fol, x, t, g, p)
def tone(f0, f1, d, e=6):
    n = tt(d); f = np.linspace(f0, f1, len(n)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-n * e)
def swell(): return S.norm(tone(200, 700, 0.35, 5)) * 0.8
def ping(): n = tt(0.6); return S.norm((np.sin(2 * np.pi * 1320 * n) + 0.3 * np.sin(2 * np.pi * 2640 * n)) * np.exp(-n * 7))
def pop(): d = 0.25; return S.norm(S.bp(S.noise(d), 800, 5000) * S.env_exp(d, 0.03) + tone(900, 200, d, 14) * 0.6)
def blip(): return S.norm(tone(500, 900, 0.12, 20)) * 0.7
def boing(): return S.norm(tone(150, 500, 0.4, 7) * (1 + 0.3 * np.sin(2 * np.pi * 14 * tt(0.4))))
def tick(): return S.norm(S.click(1.0, 1.0)) * 0.6
def bell(): n = tt(1.0); return S.norm((np.sin(2 * np.pi * 1760 * n) + 0.4 * np.sin(2 * np.pi * 1760 * 2.76 * n)) * np.exp(-n * 4))
def thud(): d = 0.7; n = tt(d); return S.norm(np.sin(2 * np.pi * (80 - 35 * n) * n) * np.exp(-n * 8) + S.lp(S.noise(d), 300) * S.env_exp(d, 0.05) * 0.6)
def deflate(): d = 1.2; n = tt(d); return S.norm(S.bp(S.noise(d), 600, 2500) * (1 - n / d) ** 1.5 * 0.9)
def whoosh(): d = 0.4; return S.norm(S.bp(S.noise(d), 500, 3500) * np.sin(np.pi * tt(d) / d)) * 0.7
def taps(d, n0):
    x = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.05:
        c = S.click(0.6 + 0.5 * np.random.rand(), 0.6); s0 = int(t * SR); x[s0:s0 + len(c)] += c[:len(x) - s0]; t += 0.06 + 0.04 * np.random.rand()
    return S.norm(x)
for e in EV:
    fn, g = {'swell': (swell, .5), 'ping': (ping, .5), 'pop': (pop, .8), 'blip': (blip, .4), 'boing': (boing, .6), 'tick': (tick, .5), 'bell': (bell, .45), 'thud': (thud, .9), 'deflate': (deflate, .5), 'whoosh': (whoosh, .5)}[e['n']]
    F(fn(), e['t'], g)
F(taps(T['typed'] - T['type0'], 0), T['type0'], 0.45)
F(taps(T['del1'] - T['del0'], 0), T['del0'], 0.4)
F(tick(), T['k1'], 0.7)
# rising tension 12.4-15.6 and paper swish 16.6-18.9
d = 3.2; n = tt(d); drone = np.sin(2 * np.pi * np.cumsum(70 + 40 * n / d) / SR) * (n / d) ** 1.5 * 0.3; F(drone, 12.4, 0.5)
d = 2.3; F(S.norm((lambda z: z * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * np.arange(len(z)) / SR)))(S.bp(S.noise(d), 2000, 7000))) * 0.3, 16.6, 0.4)
buf += fol + mus
buf *= 0.9 / np.abs(buf).max()
for ch in (0, 1): buf[:, ch] = S.limit(S.compress(buf[:, ch], thr=.1, ratio=5), .28)
buf = buf[:int(DUR * SR)]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
raw, out = os.path.join(HERE, 'out', 'mix_raw.wav'), os.path.join(HERE, 'out', 'mix.wav')
sf.write(raw, buf.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-2.5:LRA=11,alimiter=limit=0.7:level=false', '-ar', str(SR), out], check=True)
print('mix.wav', round(len(buf) / SR, 2), 's')
