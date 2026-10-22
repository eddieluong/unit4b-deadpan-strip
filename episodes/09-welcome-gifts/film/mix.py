"""Sound mix for 09 Welcome Gifts: voices + dry foley + a sparse pizzicato motif that stops dead before the punchline.
Run with the lemo-opuscar venv:  ~/lemo-opuscar/.venv/bin/python mix.py  (reads events.json, voice_el/*.wav; writes out/mix.wav)
"""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.expanduser('~/lemo-opuscar'))
from core.audio import sfx as S, pluck as P

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
DUR, EV = ev['dur'], ev['ev']
SR = S.SR
buf = np.zeros((int(DUR * SR), 2))


def load_voice(i):
    a, sr = sf.read(os.path.join(HERE, 'voice_el', i + '.wav'))
    if a.ndim > 1: a = a.mean(1)
    return resample_poly(a, SR, sr) if sr != SR else a


PAN = {'steve': -0.25, 'nana': 0.25, 'penny': 0.25, 'ted': 0.2, 'snuggles': 0.15}
voice_on = np.zeros(len(buf))
for e in EV:
    if e['type'] != 'voice': continue
    x = S.norm(load_voice(e['id']), 0.9)
    S.add(buf, x, e['t'], 0.95, PAN[e['id'].split('_')[-1]])
    s = int(e['t'] * SR); voice_on[s:s + len(x)] = 1

# ---- foley (dry, close) ----
fol = np.zeros_like(buf)
for e in EV:
    t, k = e['t'], e['type']
    if k == 'knock':
        for j in range(3): S.add(fol, S.thump(0.8, 110), t + j * 0.16, 0.5, 0.35); S.add(fol, S.clack(0.7, 0.4), t + j * 0.16, 0.5, 0.35)
    elif k == 'paper': S.add(fol, S.lp(S.hp(S.noise(0.12), 1800), 7000) * S.env_exp(0.12, 0.03), t, 0.12)
    elif k == 'cloth': S.add(fol, S.lp(S.noise(0.35), 1200) * S.env_exp(0.35, 0.12), t, 0.18, -0.1)
    elif k == 'whoosh': S.add(fol, S.whoosh(0.6, 0.6), t, 0.35, 0.4)

# ---- room tone: low fridge hum + brown noise, always on (the silent beats keep only this) ----
tt = np.arange(len(buf)) / SR
room = S.lp(S.brown(DUR), 300) * 0.02 + np.sin(2 * np.pi * 60 * tt) * 0.004
buf += room[:, None]

# ---- music: muted pizzicato bass walk, plays under the setups, cut dead at 'stop' ----
stop = next(e['t'] for e in EV if e['type'] == 'stop')
mus = np.zeros_like(buf)
walk = ['C2', 'E2', 'G2', 'A2', 'G2', 'E2', 'D2', 'G1']
beat = 0.62
n = 0; t = 0.15
while t < stop - 0.3:
    note = walk[n % len(walk)]
    S.add(mus, P.pluck('upright_bass_pizz', note, 0.5, vel=0.55), t, 0.32)
    if n % 4 == 3: S.add(mus, P.pluck('kalimba', 'G4' if n % 8 == 3 else 'E4', None, vel=0.35), t + beat / 2, 0.06, 0.3)
    n += 1; t += beat
cut = int(stop * SR); mus[cut:] *= 0                                                       # stops dead, no tail
duck = 1 - 0.6 * S.lp(voice_on, 8)                                                         # ~ -8 dB under dialogue
mus *= np.clip(duck, 0.35, 1)[:, None]
# sting after the button: two dry bass plucks, down a fifth
sting = next(e['t'] for e in EV if e['type'] == 'sting')
S.add(mus, P.pluck('upright_bass_pizz', 'G2', 0.35, vel=0.7), sting, 0.45)
S.add(mus, P.pluck('upright_bass_pizz', 'C2', 0.9, vel=0.75), sting + 0.32, 0.5)

buf += fol + mus
peak = np.abs(buf).max(); buf *= 0.9 / peak if peak > 0.9 else 1
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), buf.astype(np.float32), SR)
print('mix.wav', round(len(buf) / SR, 2), 's, peak', round(float(np.abs(buf).max()), 3))
