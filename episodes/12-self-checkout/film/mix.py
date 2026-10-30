"""Sound mix for 12 Self-Checkout (Tập 3): shop murmur under everything, scanner beeps and error tones, the alarm,
four keypad beeps on "one, two, three, four", the shop going dead silent after the shout, a printer, a museum "aah".
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

# ---------- voices (level by intensity: VOICE_PROSODY.md) ----------
GAIN_DB = {'12_s02': -1, '12_s04': +1, '12_s08': 0, '12_s09': +0.5, '12_s11': -1.5, '12_s15': -2, '12_s16': -1,
           '12_s07': 0, '12_s14': +3, '12_m03': -4, '12_m05': -4, '12_m06': -4, '12_t13': -2, '12_t17': -2}
voice_on = np.zeros(len(buf))
for e in EV:
    if e['type'] != 'voice': continue
    a, sr = sf.read(os.path.join(HERE, 'voice', e['id'] + '.wav'))
    if a.ndim > 1: a = a.mean(1)
    x = S.norm(resample_poly(a, SR, sr) if sr != SR else a, 0.9) * 10 ** (GAIN_DB.get(e['id'], 0) / 20)
    if e['id'].startswith('12_m'): x = S.bp(x, 300, 5000)          # the machine: a small speaker
    pan = 0.25 if e['id'].startswith('12_m') else (-0.1 if 'steve' in e['id'] or '_s' in e['id'] else 0.15)
    S.add(buf, x, e['t'], 0.95, pan)
    s = int(e['t'] * SR); voice_on[s:s + len(x)] = 1

# ---------- shop murmur (stops dead on the shout, comes back for "next week") ----------
stop = at('stop')[0]
mur = S.lp(S.noise(DUR), 900)[:len(buf)] * 0.05 * (1 + 0.3 * np.sin(2 * np.pi * 0.3 * tt(DUR)[:len(buf)]))
gate = np.ones(len(buf)); gate[int(stop * SR):] = 0
m2 = [t for t in at('murmur') if t > stop]
if m2: gate[int(m2[0] * SR):] = 1
buf += (mur * gate)[:, None]

# ---------- music: a small plucked shopping loop, off at the alarm's peak, a soft end sting ----------
mus = np.zeros_like(buf)
def harp(n, t, v=0.25): S.add(mus, SM.note('harp', n, 1.6, vel=v), t, 0.25, 0.2)
t, i = at('murmur')[0], 0
bars = [('C3', ['E4', 'G4', 'C5']), ('F2', ['F4', 'A4', 'C5']), ('G2', ['D4', 'G4', 'B4']), ('C3', ['E4', 'G4', 'C5'])]
while t < stop - 0.3:
    bass, fig = bars[i % 4]; S.add(mus, P.pluck('upright_bass_pizz', bass, 0.5, vel=0.4), t, 0.25)
    for j, n in enumerate(fig):
        if t + j * 0.5 < stop - 0.2: harp(n, t + j * 0.5, 0.2)
    t += 1.5; i += 1
for t0 in at('sting'): S.add(mus, P.pluck('upright_bass_pizz', 'C2', 1.2, vel=0.6), t0, 0.4); harp('C5', t0 + 0.05, 0.3)
mus *= np.clip(1 - 0.5 * S.lp(voice_on, 8), 0.45, 1)[:, None]

# ---------- foley ----------
fol = np.zeros_like(buf)
def tone(f, d, v=0.3): return np.sin(2 * np.pi * f * tt(d)) * np.minimum(1, np.minimum(tt(d), d - tt(d)) * 120) * v
for t in at('beep'): S.add(fol, tone(1800, 0.12, 0.5), t, 0.35, 0.3)
for t in at('error'): S.add(fol, np.concatenate([tone(880, 0.16, 0.5), tone(660, 0.24, 0.5)]), t, 0.35, 0.3)
for t in at('alarm'):
    for j in range(8): S.add(fol, tone(1250 if j % 2 == 0 else 950, 0.22, 0.35), t + j * 0.25, 0.3, 0.4)
for t in at('key'): S.add(fol, tone(2200, 0.09, 0.5), t, 0.35, 0.3)
for t in at('zoom'): S.add(fol, S.whoosh(0.3, 0.5), t, 0.25)
for t in at('steps'):
    for j in range(6): S.add(fol, S.step(0.7), t + j * 0.28, 0.35, 0.5 - j * 0.05)
for t in at('printer'):
    d = 1.6; S.add(fol, S.bp(S.noise(d), 800, 4000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 14 * tt(d)))) * np.minimum(1, (d - tt(d)) * 4), t, 0.18, 0.2)
for t in at('choir'):
    for n, v in (('C4', 0.22), ('E4', 0.2), ('G4', 0.18), ('C5', 0.15)): harp(n, t, v)
for t in at('belt'):
    d = 2.0; S.add(fol, S.lp(S.noise(d), 300) * np.minimum(1, np.minimum(tt(d), d - tt(d)) * 3), t, 0.2)

buf += fol + mus
buf *= 0.9 / np.abs(buf).max()
for ch in (0, 1): buf[:, ch] = S.limit(S.compress(buf[:, ch], thr=.1, ratio=5), .28)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
raw, out = os.path.join(HERE, 'out', 'mix_raw.wav'), os.path.join(HERE, 'out', 'mix.wav')
sf.write(raw, buf.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-2.5:LRA=11,alimiter=limit=0.7:level=false', '-ar', str(SR), out], check=True)
print('mix.wav', round(len(buf) / SR, 2), 's')
