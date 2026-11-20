"""Tap 15 The Lid: build voice/film_timeline.json + voice/voice_mix.wav from voice/timeline.json ('main'). No re-voicing.
Run: ~/lemo-opuscar/.venv/bin/python retime.py"""
import json, os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(HERE, 'voice')
m = json.load(open(os.path.join(V, 'timeline.json')))['variants']['main']
TOTAL = round(m['voice_end'] + 3.0, 2); PUNCH = m['punch_start']
y, sr = sf.read(os.path.join(V, 'voice_mix_main.wav'))
if y.ndim > 1: y = y.mean(1)
buf = np.zeros(int((TOTAL + 0.3) * sr)); buf[:len(y)] = y[:len(buf)]
sf.write(os.path.join(V, 'voice_mix.wav'), buf, sr)
json.dump({'lines': m['lines'], 'total': TOTAL, 'punch_start': PUNCH, 'punch_pct': round(100 * PUNCH / TOTAL, 1)}, open(os.path.join(V, 'film_timeline.json'), 'w'), indent=1)
print('voice_mix', len(y) / sr, '-> total', TOTAL, 'punch', PUNCH, round(100 * PUNCH / TOTAL, 1), '%')
