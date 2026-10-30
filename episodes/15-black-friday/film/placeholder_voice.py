"""Stills before the voice take: fake voice.json / words.json from the script at ~2.2 words/s.
The real take (one_take.py + split_words.py) overwrites both files."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
lines = json.load(open(os.path.join(HERE, '..', 'lines.json')))
V, W = {}, {}
for l in lines:
    words = re.sub(r'\[[^\]]*\]', '', l['text']).split()
    dur = round(len(words) / 2.2 + 0.3, 2)
    step = (dur - 0.2) / len(words)
    W[l['id']] = [[w, round(i * step, 2), round((i + 1) * step, 2)] for i, w in enumerate(words)]
    V[l['id']] = {'dur': dur, 'env': [0.6 if i % 3 else 0.2 for i in range(int(dur * 24))]}
json.dump(V, open(os.path.join(HERE, 'voice_ph', 'voice.json'), 'w'))
json.dump(W, open(os.path.join(HERE, 'voice_ph', 'words.json'), 'w'))
print('placeholder voice for', len(V), 'lines')
