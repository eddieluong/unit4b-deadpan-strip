"""Whisper each trimmed clip -> voice/words.json {id: [[word, start, end]]} and print transcript vs script."""
import json, re, soundfile as sf, numpy as np, os
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
M = WhisperModel('base.en', device='cpu', compute_type='int8')
H = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(os.path.join(H, '..', 'lines.json')))
out = {}; norm = lambda s: re.sub(r'[^a-z0-9 ]', '', re.sub(r'\[[^\]]*\]', '', s).lower().replace('-', ' ')).split()
for l in L:
    x, sr = sf.read(os.path.join(H, 'voice', l['id'] + '.wav'))
    segs, _ = M.transcribe(resample_poly(x, 2, 3).astype(np.float32), language='en', word_timestamps=True, beam_size=5)
    ws = [(w.word.strip(), round(w.start, 2), round(w.end, 2)) for s in segs for w in s.words]
    out[l['id']] = ws
    print(l['id'], 'OK' if [re.sub('[^a-z0-9]', '', w.lower()) for w, _, _ in ws] == [re.sub('[^a-z0-9]', '', w) for w in norm(l['text'])] else 'DIFF', '|', ' '.join(w for w, _, _ in ws))
json.dump(out, open(os.path.join(H, 'voice', 'words.json'), 'w'))
