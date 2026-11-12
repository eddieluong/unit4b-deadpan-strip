"""old Tập 9 s2 + clone v1 + clone v2 on the same line/settings ("Okay. Nobody MOVE.", seed 2718), each -14 LUFS, 0.6 s gaps. Key from env only.
v1 line = voice/clone_s2_raw.wav (made by compare_steve.py); v2 raw -> voice/clone_v2_s2_raw.wav."""
import json, os, subprocess, urllib.request, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'voice'); REPO = os.path.join(HERE, '..', '..', '..')
vid = json.load(open(os.path.join(REPO, 'styles/deadpan-strip/elevenlabs.json')))['characters']['steve']['voice_id_clone_v2']
body = {'text': "[hushed, panicked] Okay. Nobody MOVE.", 'model_id': 'eleven_v3', 'seed': 2718,
        'voice_settings': {'stability': 0.35, 'similarity_boost': 0.85, 'style': 0.4, 'use_speaker_boost': True, 'speed': 1.0}}
req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=pcm_24000', data=json.dumps(body).encode(),
    headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
pcm = np.frombuffer(urllib.request.urlopen(req).read(), dtype='<i2').astype(np.float32) / 32768
sf.write(os.path.join(OUT, 'clone_v2_s2_raw.wav'), pcm, 24000)
def norm(src, dst): subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-af','loudnorm=I=-14:TP=-1.5:LRA=7','-ar','24000','-ac','1',dst], check=True)
parts = []
for name, src in [('old', os.path.join(HERE, '..', '..', '18-next', 'film', 'voice', 's2.wav')), ('v1', os.path.join(OUT, 'clone_s2_raw.wav')), ('v2', os.path.join(OUT, 'clone_v2_s2_raw.wav'))]:
    d = os.path.join(OUT, f'_cmp_{name}.wav'); norm(src, d); parts.append(sf.read(d)[0])
gap = np.zeros(int(.6 * 24000)); sf.write(os.path.join(OUT, 'compare_steve_v2.wav'), np.concatenate([parts[0], gap, parts[1], gap, parts[2]]), 24000)
print([round(len(p) / 24000, 2) for p in parts])
