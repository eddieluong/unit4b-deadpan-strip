"""Re-time the approved per-line voice takes (voice/s*.wav, not re-voiced) onto the 27 s picture timeline.
Writes voice/voice_mix.wav + voice/timeline.json. Run: ~/lemo-opuscar/.venv/bin/python retime.py"""
import json, os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(HERE, 'voice'); SR = 24000
START = {'s1': 0.30, 's2': 2.70, 's3': 4.80, 's4': 7.10, 's5': 9.30, 's7': 13.85, 's8': 16.45, 's9': 20.50, 's10': 23.15}
SPEED = json.load(open(os.path.join(HERE, 'speeds.json'))); TOTAL = 27.0
buf = np.zeros(int((TOTAL + 0.3) * SR)); tl = []
for i, t0 in START.items():
    y, sr = sf.read(os.path.join(V, i + '.wav')); assert sr == SR
    if y.ndim > 1: y = y.mean(1)
    s0 = int(t0 * SR); buf[s0:s0 + len(y)] += y; tl.append({'id': i, 'start': t0, 'end': round(t0 + len(y) / SR, 3), 'speed': SPEED.get(i, 1.0)})
sf.write(os.path.join(V, 'voice_mix.wav'), buf, SR)
p = START['s9']
json.dump({'lines': tl, 'total': TOTAL, 'voice_end': tl[-1]['end'], 'punch_start': p, 'punch_pct': round(100 * p / TOTAL, 1)}, open(os.path.join(V, 'timeline.json'), 'w'), indent=1)
print([(x['id'], x['start'], x['end']) for x in tl], 'punch', p, round(100 * p / TOTAL, 1), '%')
