"""Re-time the approved per-line voice takes (voice/<id>.wav, not re-voiced) onto the ~26.5 s picture timeline.
Writes voice/voice_mix.wav + voice/film_timeline.json. Run: ~/lemo-opuscar/.venv/bin/python retime.py"""
import json, os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(HERE, 'voice'); SR = 24000
START = {'s1': 0.30, 's2': 1.95, 's3': 4.35, 's4': 6.55, 's5': 8.45, 's6': 14.00, 's7': 15.85, 's8a': 20.40, 's9': 23.90}
TOTAL = 26.5
buf = np.zeros(int((TOTAL + 0.3) * SR)); tl = []
for i, t0 in START.items():
    y, sr = sf.read(os.path.join(V, i + '.wav')); assert sr == SR
    if y.ndim > 1: y = y.mean(1)
    s0 = int(t0 * SR); buf[s0:s0 + len(y)] += y; tl.append({'id': i, 'start': t0, 'end': round(t0 + len(y) / SR, 3)})
sf.write(os.path.join(V, 'voice_mix.wav'), buf, SR)
p = START['s8a']
json.dump({'lines': tl, 'total': TOTAL, 'punch_start': p, 'punch_pct': round(100 * p / TOTAL, 1)}, open(os.path.join(V, 'film_timeline.json'), 'w'), indent=1)
print([(x['id'], x['start'], x['end']) for x in tl], 'punch', p, round(100 * p / TOTAL, 1), '%')
