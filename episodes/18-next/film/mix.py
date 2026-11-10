"""Mix for 18 One Percent (Tap 9): voice_mix + synthesised sfx + light pluck bed (-8 dB under voice). Run: ~/lemo-opuscar/.venv/bin/python mix.py -> out/mix.wav"""
import json, os, sys, subprocess
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.expanduser('~/lemo-opuscar'))
from core.audio import sfx as S, pluck as P, sampler as SM
HERE = os.path.dirname(os.path.abspath(__file__)); SR = S.SR
ev = json.load(open(os.path.join(HERE, 'events.json'))); T = ev['T']; EV = ev['ev']
TL = json.load(open(os.path.join(HERE, 'voice', 'timeline.json'))); DUR = TL['total']
buf = np.zeros((int(DUR * SR) + SR // 2, 2)); np.random.seed(9)
tt = lambda d: np.arange(int(d * SR)) / SR
a, sr = sf.read(os.path.join(HERE, 'voice', 'voice_mix.wav'))
if a.ndim > 1: a = a.mean(1)
v = S.norm(resample_poly(a, SR, sr) if sr != SR else a, 0.9)
v = v[:len(buf)]; S.add(buf, v, 0.0, 0.95, 0.0)
voice_on = np.zeros(len(buf))
for l in TL['lines']: voice_on[int(l['start'] * SR):int(min(l['end'], DUR) * SR)] = 1
mus = np.zeros_like(buf); t, i = 0.0, 0
while t < DUR:
    S.add(mus, P.pluck('upright_bass_pizz', ['E2', 'E2', 'G2', 'F2'][i % 4], 0.8, vel=0.4), t, 0.3)
    if i % 2: S.add(mus, SM.note('harp', 'B5', 0.6, vel=0.1), t + 0.4, 0.1, 0.3)
    t += 0.8; i += 1
env = np.clip(1 - 0.6 * S.lp(voice_on, 8), 0.4, 1)   # ~ -8 dB under dialogue
for a0, a1 in [(T['mute0'], T['mute1']), (T['mute2'], T['mute3']), (T['mute4'] - 0.05, T['mute5'] - 0.0)]:
    env[int(a0 * SR):int(a1 * SR)] = 0   # silent beats 4b, 7b, 8 + punch lead-in
env = S.lp(env, 30); mus *= env[:, None]
fol = np.zeros_like(buf)
def F(x, t, g, p=0.0): S.add(fol, x, t, g, p)
def tone(f0, f1, d, e=6):
    n = tt(d); f = np.linspace(f0, f1, len(n)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-n * e)
def blip(): return S.norm(tone(1500, 1500, 0.09, 30)) * 0.5
def twang(): d = 0.7; n = tt(d); return S.norm(np.sin(2 * np.pi * np.cumsum(260 + 60 * np.exp(-n * 6) * np.sin(2 * np.pi * 30 * n)) / SR) * np.exp(-n * 5))
def scrape(): d = 0.28; return S.norm(S.bp(S.noise(d), 150, 900) * S.env_exp(d, 0.02) * (1 + 0.5 * np.sin(2 * np.pi * 40 * tt(d)))) * 0.8
def clack(): d = 0.15; n = tt(d); return S.norm(tone(900, 500, d, 30) + S.bp(S.noise(d), 1500, 5000) * np.exp(-n * 40))
def thud(): d = 0.5; n = tt(d); return S.norm(np.sin(2 * np.pi * (90 - 40 * n) * n) * np.exp(-n * 9) + S.lp(S.noise(d), 300) * S.env_exp(d, 0.05) * 0.5)
def spark(): d = 0.25; n = tt(d); return S.norm(S.bp(S.noise(d), 3000, 9000) * np.exp(-n * 18) * (1 + np.sin(2 * np.pi * 90 * n)))
def ding(): n = tt(0.9); return S.norm((np.sin(2 * np.pi * 1320 * n) + 0.3 * np.sin(2 * np.pi * 2640 * n)) * np.exp(-n * 5))
def whoosh(): d = 0.4; return S.norm(S.bp(S.noise(d), 500, 3500) * np.sin(np.pi * tt(d) / d)) * 0.7
def pop(): d = 0.25; return S.norm(S.bp(S.noise(d), 800, 5000) * S.env_exp(d, 0.03) + tone(900, 200, d, 14) * 0.6)
def power(): return S.norm(tone(900, 60, 0.8, 4))
def led(): return S.norm(tone(1100, 1100, 0.07, 28)) * 0.6
G = {'blip': (blip, .22), 'twang': (twang, .6), 'scrape': (scrape, .5), 'clack': (clack, .5), 'thud': (thud, .8), 'spark': (spark, .5), 'ding': (ding, .5), 'whoosh': (whoosh, .45), 'pop': (pop, .8), 'power': (power, .55), 'led': (led, .4)}
for e in EV:
    fn, g = G[e['n']]; F(fn(), e['t'], g)
def taps(d):
    x = np.zeros(int(d * SR)); t = 0.0
    while t < d - 0.05:
        c = S.click(0.6 + 0.5 * np.random.rand(), 0.6); s0 = int(t * SR); x[s0:s0 + len(c)] += c[:len(x) - s0]; t += 0.06 + 0.04 * np.random.rand()
    return S.norm(x)
for a0, a1 in ev.get('taps', []): F(taps(a1 - a0), a0, 0.4)
buf += fol + mus
buf *= 0.9 / np.abs(buf).max()
for ch in (0, 1): buf[:, ch] = S.limit(S.compress(buf[:, ch], thr=.1, ratio=5), .28)
buf = buf[:int(DUR * SR)]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
raw, out = os.path.join(HERE, 'out', 'mix_raw.wav'), os.path.join(HERE, 'out', 'mix.wav')
sf.write(raw, buf.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-2.5:LRA=11,alimiter=limit=0.7:level=false', '-ar', str(SR), out], check=True)
print('mix.wav', round(len(buf) / SR, 2), 's')
