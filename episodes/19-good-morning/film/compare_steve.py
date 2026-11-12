"""Compare old Voice-Design Steve (Tập 9 s2.wav) vs the IVC clone on the same line/settings. Key from env only."""
import json, os, subprocess, urllib.request, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'voice'); REPO = os.path.join(HERE, '..', '..', '..')
vid = json.load(open(os.path.join(REPO, 'styles/deadpan-strip/elevenlabs.json')))['characters']['steve']['voice_id']
body = {'text': "[hushed, panicked] Okay. Nobody MOVE.", 'model_id': 'eleven_v3', 'seed': 2718,
        'voice_settings': {'stability': 0.35, 'similarity_boost': 0.85, 'style': 0.4, 'use_speaker_boost': True, 'speed': 1.0}}
req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=pcm_24000', data=json.dumps(body).encode(),
    headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
pcm = np.frombuffer(urllib.request.urlopen(req).read(), dtype='<i2').astype(np.float32) / 32768
sf.write(os.path.join(OUT, 'clone_s2_raw.wav'), pcm, 24000)
def norm(src, dst): subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-af','loudnorm=I=-14:TP=-1.5:LRA=7','-ar','24000','-ac','1',dst], check=True)
old = os.path.join(HERE, '..', '..', '18-next', 'film', 'voice', 's2.wav')
norm(old, os.path.join(OUT, '_old.wav')); norm(os.path.join(OUT, 'clone_s2_raw.wav'), os.path.join(OUT, '_new.wav'))
a, _ = sf.read(os.path.join(OUT, '_old.wav')); b, _ = sf.read(os.path.join(OUT, '_new.wav'))
sf.write(os.path.join(OUT, 'compare_steve.wav'), np.concatenate([a, np.zeros(int(.6*24000)), b]), 24000)
print('old', len(a)/24000, 'new', len(b)/24000)
