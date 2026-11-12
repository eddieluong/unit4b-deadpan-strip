"""old Tập 9 s2 vs original Voice Design Steve (new workspace id) on "Okay. Nobody MOVE." seed 2718, -14 LUFS, 0.6 s gap. Key from env only."""
import json, os, subprocess, urllib.request, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'voice'); REPO = os.path.join(HERE, '..', '..', '..')
vid = json.load(open(os.path.join(REPO, 'styles/deadpan-strip/elevenlabs.json')))['characters']['steve']['voice_id']
body = {'text': "[hushed, panicked] Okay. Nobody MOVE.", 'model_id': 'eleven_v3', 'seed': 2718,
        'voice_settings': {'stability': 0.35, 'similarity_boost': 0.85, 'style': 0.4, 'use_speaker_boost': True, 'speed': 1.0}}
req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=pcm_24000', data=json.dumps(body).encode(),
    headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
pcm = np.frombuffer(urllib.request.urlopen(req).read(), dtype='<i2').astype(np.float32) / 32768
sf.write(os.path.join(OUT, 'orig_s2_raw.wav'), pcm, 24000)
parts = []
for name, src in [('old', os.path.join(HERE, '..', '..', '18-next', 'film', 'voice', 's2.wav')), ('orig', os.path.join(OUT, 'orig_s2_raw.wav'))]:
    d = os.path.join(OUT, f'_cmp_{name}.wav'); subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-af','loudnorm=I=-14:TP=-1.5:LRA=7','-ar','24000','-ac','1',d], check=True); parts.append(sf.read(d)[0])
sf.write(os.path.join(OUT, 'compare_steve_orig.wav'), np.concatenate([parts[0], np.zeros(int(.6*24000)), parts[1]]), 24000)
def f0(x, sr=24000):
    out=[]
    for i in range(0, len(x)-1200, 480):
        f=x[i:i+1200]
        if np.sqrt((f**2).mean())<0.02: continue
        f=f-f.mean(); ac=np.correlate(f,f,'full')[len(f)-1:]; lo,hi=int(sr/400),int(sr/70); k=lo+np.argmax(ac[lo:hi])
        if ac[k]>0.4*ac[0]: out.append(sr/k)
    return float(np.median(out))
print('dur', [round(len(p)/24000,2) for p in parts], 'F0 old/orig', [round(f0(p)) for p in parts])
