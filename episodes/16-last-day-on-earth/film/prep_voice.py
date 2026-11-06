"""voice/voice.json {id:{dur,env}} and voice/words.json {id:[[word,start,end]]} for scene.js. Run with the lemo-opuscar venv."""
import json, os, re
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
H = os.path.dirname(os.path.abspath(__file__)); M = WhisperModel('base.en', device='cpu', compute_type='int8')
L = json.load(open(os.path.join(H, '..', 'lines.json'))); V, W = {}, {}
for l in L:
    x, sr = sf.read(os.path.join(H, 'voice', l['id'] + '.wav')); hop = sr // 24; n = len(x) // hop
    env = np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12); env = np.round(np.clip(env / env.max(), 0, 1), 2)
    V[l['id']] = {'dur': round(len(x) / sr, 3), 'env': env.tolist()}
    segs, _ = M.transcribe(resample_poly(x, 2, 3).astype(np.float32), language='en', word_timestamps=True, beam_size=5)
    W[l['id']] = [(w.word.strip(), round(w.start, 2), round(w.end, 2)) for s in segs for w in s.words]
    print(l['id'], V[l['id']]['dur'], ' '.join(w for w, _, _ in W[l['id']]))
W['16_s01'] = W['16_s01']  # (a.m. merged by hand in words.json after this script)
json.dump(V, open(os.path.join(H, 'voice', 'voice.json'), 'w')); json.dump(W, open(os.path.join(H, 'voice', 'words.json'), 'w'))
