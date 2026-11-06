"""Per-line ElevenLabs takes for ep16. ELEVENLABS_API_KEY from env only.
   python3 voice_gen.py [--split] [ids...]   (--split = re-trim saved originals only)"""
import json, os, sys, urllib.request
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 24000
VOICE = {'steve': 'Y9z2nW5YxRRbI3XaIf8x', 'penny': 'uLjMe2KKO62jRu3id160'}
LINES = json.load(open(os.path.join(HERE, '..', 'lines.json')))
INT = {'16_s01': 2, '16_s02': 2, '16_s03': 3, '16_s04': 2, '16_s05': 2, '16_s06': 2, '16_s07': 3, '16_s08': 5,
       '16_s10': 1, '16_s11': 2, '16_s12': 3, '16_s13': 1, '16_p14': 1}
def vs(i):
    n = INT[i]
    if i == '16_p14': return {'stability': 0.5, 'similarity_boost': 0.85, 'style': 0.3, 'use_speaker_boost': True}
    if n <= 2: return {'stability': 0.5, 'similarity_boost': 0.85, 'style': 0.3, 'use_speaker_boost': True}
    if n <= 4: return {'stability': 0.3, 'similarity_boost': 0.85, 'style': 0.6, 'use_speaker_boost': True}
    return {'stability': 0.0, 'similarity_boost': 0.85, 'style': 0.8, 'use_speaker_boost': True}
def gen(l, seed):
    body = {'text': l.get('spoken', l['text']), 'model_id': 'eleven_v3', 'seed': seed, 'voice_settings': vs(l['id'])}
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE[l['char']]}?output_format=pcm_24000",
        data=json.dumps(body).encode(), headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
    pcm = np.frombuffer(urllib.request.urlopen(req).read(), dtype='<i2').astype(np.float32) / 32768
    sf.write(os.path.join(HERE, 'voice_el', l['id'] + '.wav'), pcm, SR)
def rms(x, hop=240):
    n = len(x) // hop; return np.sqrt((x[:n*hop].reshape(n, hop)**2).mean(1) + 1e-12)
def trim(l):
    x, _ = sf.read(os.path.join(HERE, 'voice_el', l['id'] + '.wav')); r = rms(x); db = 20*np.log10(r/r.max())
    loud = np.where(db > -35)[0]; s = max(0, loud[0]-4); e = min(len(r), loud[-1]+11)   # 40 ms pre, 110 ms tail
    y = x[s*240:e*240].copy(); r = rms(y); db = 20*np.log10(r/r.max()); q = db < -38; j = 0; keep = []
    while j < len(q):
        if q[j]:
            k = j
            while k < len(q) and q[k]: k += 1
            if j > 0 and k < len(q) and k - j > 60: keep.append((j+25, k-25))   # >0.6 s -> 0.5 s
            j = k
        else: j += 1
    for a, b in reversed(keep):
        A, B, xf = a*240, b*240, 240
        y = np.concatenate([y[:A], y[A:A+xf]*np.linspace(1,0,xf) + y[B:B+xf]*np.linspace(0,1,xf), y[B+xf:]])
    fi, fo = int(.015*SR), int(.1*SR); y[:fi] *= np.linspace(0,1,fi); y[-fo:] *= np.linspace(1,0,fo)**1.5
    sf.write(os.path.join(HERE, 'voice', l['id'] + '.wav'), y, SR); return len(y)/SR, len(x)/SR, len(keep)
if __name__ == '__main__':
    ids = [a for a in sys.argv[1:] if not a.startswith('--')]; out = {}
    for l in LINES:
        if ids and l['id'] not in ids: continue
        if '--split' not in sys.argv: gen(l, int(os.environ.get('SEEDBASE', 1600)) + int(l['id'][-2:]))
        out[l['id']] = trim(l); print(l['id'], out[l['id']])
