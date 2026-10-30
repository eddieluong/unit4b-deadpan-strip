"""Speed up narration clips without changing pitch (ffmpeg atempo), then refresh voice.json.
    ~/lemo-opuscar/.venv/bin/python tempo.py 1.12 11_s01 11_s02 ...
"""
import sys, json, subprocess, numpy as np, soundfile as sf
from one_take import frames_rms, SR
f, ids = float(sys.argv[1]), sys.argv[2:]
v = json.load(open('voice/voice.json'))
for id_ in ids:
    src = f'voice/{id_}.wav'; tmp = f'voice/{id_}.tmp.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'atempo={f}', '-ar', str(SR), tmp], check=True)
    y, _ = sf.read(tmp); sf.write(src, y, SR); subprocess.run(['rm', tmp])
    env = frames_rms(y, SR // 24); env = np.round(np.clip(env / env.max(), 0, 1), 2)
    v[id_] = {'dur': round(len(y) / SR, 3), 'env': env.tolist()}; print(id_, v[id_]['dur'])
json.dump(v, open('voice/voice.json', 'w'))
