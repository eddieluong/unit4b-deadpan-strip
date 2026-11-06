"""Tập 8 voice: one ElevenLabs take per character (fixed seed), Whisper-split into lines, per-line speed, fades.
  ELEVENLABS_API_KEY from env only.  ~/lemo-opuscar/.venv/bin/python voice_gen.py [--split]   (--split = reuse saved takes)
Writes voice/<id>.wav, voice/timeline.json, voice/take_<char>.wav (raw)."""
import json, os, re, sys, difflib, subprocess, urllib.request
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'voice'); os.makedirs(OUT, exist_ok=True)
SR = 24000; SEED = 1708
VOICE = {'steve': 'Y9z2nW5YxRRbI3XaIf8x', 'snuggles': 'nPczCjzI2devNBz1zQrb'}
# id, spoken text with one light tag (CAPS = stress word)
TAKES = {
 'steve': ([('s2', "[hushed, thrilled] They're TYPING."), ('s3', "[pleading, whispering] No. Come BACK."),
            ('s5', "[strained, not fine] Okay. I'm FINE."), ('s7', "[rising dread, awe] Is that a paragraph? It's a PARAGRAPH."),
            ('s9', "[flat, dead inside] Kay.")],
           {'stability': 0.35, 'similarity_boost': 0.85, 'style': 0.4, 'use_speaker_boost': True}),
 'snuggles': ([('s1', "[flat, noir] Nine forty-one. He asked ONE question."), ('s4', "[flat, noir] They came back. They left AGAIN."),
               ('s6', "[noir, tense] Someone was writing. Someone was writing a LOT."), ('s10', "[flat] Nine hours. One LETTER."),
               ('s11', "[dry, flat] Revenge. Served in LOWERCASE.")],
              {'stability': 0.5, 'similarity_boost': 0.85, 'style': 0.35, 'use_speaker_boost': True}),
}
SPEED = json.load(open(os.path.join(HERE, 'speeds.json'))) if os.path.exists(os.path.join(HERE, 'speeds.json')) else {}
# script order: (id, pause_after); silent beats folded into pauses: 2b=0.8 after s2 (+0.2), 7b 1.0 + 8 2.5 after s7 (+0.3)
ORDER = [('s1', .3), ('s2', .2 + .8), ('s3', .3), ('s4', .3), ('s5', .3), ('s6', .2), ('s7', .3 + 1.0 + 2.5), ('s9', .7), ('s10', .4), ('s11', 0)]
def rms(x, hop=240):
    n = len(x) // hop; return np.sqrt((x[:n*hop].reshape(n, hop)**2).mean(1) + 1e-12)
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
def generate(c):
    body = {'text': ' '.join(t for _, t in TAKES[c][0]), 'model_id': 'eleven_v3', 'seed': SEED, 'voice_settings': TAKES[c][1]}
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE[c]}?output_format=pcm_24000', data=json.dumps(body).encode(),
        headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
    pcm = np.frombuffer(urllib.request.urlopen(req).read(), dtype='<i2').astype(np.float32) / 32768
    sf.write(os.path.join(OUT, f'take_{c}.wav'), pcm, SR)
def split(c, M):
    ids = [i for i, _ in TAKES[c][0]]; parts = [re.sub(r'\[[^\]]*\]', '', t).strip() for _, t in TAKES[c][0]]
    x, _ = sf.read(os.path.join(OUT, f'take_{c}.wav')); r = rms(x); db = 20*np.log10(r/r.max())
    segs, _ = M.transcribe(resample_poly(x, 2, 3).astype(np.float32), language='en', word_timestamps=True, beam_size=5, initial_prompt=' '.join(parts))
    tw = [(norm(w.word), w.start, w.end) for s in segs for w in s.words if norm(w.word)]
    print(c, 'heard:', ' '.join(w for w, _, _ in tw))
    tstr, owner = '', []
    for j, (w, _, _) in enumerate(tw): tstr += w; owner += [j]*len(w)
    sstr, ends = '', []
    for p in parts: sstr += ''.join(norm(w) for w in p.split()); ends.append(len(sstr)-1)
    cmap = {}
    for a0, b0, n in difflib.SequenceMatcher(a=sstr, b=tstr, autojunk=False).get_matching_blocks():
        for k in range(n): cmap[a0+k] = b0+k
    def word_at(ci):
        for j in range(ci, -1, -1):
            if j in cmap: return owner[cmap[j]]
        return 0
    cuts = [0]
    for e in ends[:-1]:
        k = min(word_at(e), len(tw)-2); a = int(tw[k][2]*100); b = max(a+1, int(tw[k+1][1]*100)); a, b = min(a, len(r)-2), min(b, len(r)-1)
        cuts.append(a + int(np.argmin(r[a:b+1])))
    cuts.append(len(r)); res = {}
    for k, i in enumerate(ids):
        a, b = cuts[k], cuts[k+1]; loud = np.where(db[a:b] > -32)[0]
        s = max(a, a+loud[0]-4); e = min(b, a+loud[-1]+30)   # 40 ms pre-roll, 300 ms tail
        y = x[s*240:e*240].copy(); res[i] = (y, db[a:b].max())
    return res
def finish(i, y):
    sp = SPEED.get(i, 1.0)
    if abs(sp-1) > 1e-3:
        tmp = os.path.join(OUT, '_t.wav'); sf.write(tmp, y, SR)
        o = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'atempo={sp}', '-ar', str(SR), '-f', 'wav', '-'], capture_output=True, check=True).stdout
        import io; y, _ = sf.read(io.BytesIO(o))
    fi, fo = int(.015*SR), int(.12*SR); y = y.copy(); y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)**1.5
    sf.write(os.path.join(OUT, f'{i}.wav'), y, SR); return y
if __name__ == '__main__':
    from faster_whisper import WhisperModel
    M = WhisperModel('base.en', device='cpu', compute_type='int8'); lines = {}
    for c in TAKES:
        if '--split' not in sys.argv: generate(c)
        lines.update(split(c, M))
    ys = {i: finish(i, y) for i, (y, _) in lines.items()}
    t, tl = 0.0, []
    for i, p in ORDER:
        d = len(ys[i])/SR; tl.append({'id': i, 'start': round(t, 3), 'end': round(t+d, 3), 'speed': SPEED.get(i, 1.0)}); t += d + p
    total = tl[-1]['end']; punch = [x for x in tl if x['id'] == 's9'][0]['start']
    json.dump({'lines': tl, 'total': total, 'punch_start': punch, 'punch_pct': round(100*punch/total, 1)}, open(os.path.join(OUT, 'timeline.json'), 'w'), indent=1)
    buf = np.zeros(int((total+.3)*SR))
    for x in tl: y = ys[x['id']]; s = int(x['start']*SR); buf[s:s+len(y)] += y
    sf.write(os.path.join(OUT, 'voice_mix.wav'), buf, SR)
    for i, (_, pk) in lines.items(): print(i, 'dur', round(len(ys[i])/SR, 2), 'cut-region max dB', round(pk, 1))
    print('total', round(total, 2), 'punch', round(punch, 2), round(100*punch/total, 1), '%')
