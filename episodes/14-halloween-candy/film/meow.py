"""The cat only meows (#18): reuse Tập 2's ElevenLabs sound-generation meow as voice/14_meow.wav and add it to voice.json."""
import json, os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
x, sr = sf.read(os.path.join(HERE, '..', '..', '11-extra-hour', 'film', 'voice', '11_meow.wav'))
if x.ndim > 1: x = x.mean(1)
sf.write(os.path.join(HERE, 'voice', '14_meow.wav'), x, sr)
env = np.sqrt([np.mean(x[i:i + sr // 24] ** 2) for i in range(0, len(x), sr // 24)]); env = np.round(np.clip(env / env.max(), 0, 1), 2)
vj = os.path.join(HERE, 'voice', 'voice.json'); v = json.load(open(vj))
v['14_meow'] = {'dur': round(len(x) / sr, 3), 'env': env.tolist()}; json.dump(v, open(vj, 'w'))
wj = os.path.join(HERE, 'voice', 'words.json'); w = json.load(open(wj))
w['14_meow'] = [['Meow.', 0.0, round(len(x) / sr, 2)]]; json.dump(w, open(wj, 'w'))
print('14_meow', v['14_meow']['dur'], 's')
