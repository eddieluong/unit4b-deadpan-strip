"""One ElevenLabs take per character (one timbre), split into lines at the quietest point between them.
    ELEVENLABS_API_KEY=... python3 one_take.py          # generate + split
    python3 one_take.py --split                          # re-split the saved takes only
Writes voice_el/<char>_take.wav (raw), voice/<id>.wav (trimmed: 40 ms pre-roll, 300 ms tail, 15/120 ms fades)
and voice/voice.json ({id: {dur, env}}) for scene.js lip-sync and captions.
"""
import json, os, sys, urllib.request
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 24000
VOICE = {'steve': 'Y9z2nW5YxRRbI3XaIf8x', 'steve_scene': 'Y9z2nW5YxRRbI3XaIf8x', 'penny': 'uLjMe2KKO62jRu3id160'}
# feelings come from the words and one light tag per sentence; no "..." or [pause] (they read as AI)
TAKES = {
    'steve': (['15_s01', '15_s02', '15_s03', '15_s05', '15_s07', '15_s08', '15_s09', '15_s13'],
              "[dry, self-mocking] I waited for the Black Friday price. SMART. "
              "[pleased] November fifth. EARLY Black Friday. Four ninety-nine. "
              "[smug] Early? Please. I'll wait for the REAL one. "
              "[greedy whisper] It's going down. PATIENCE. "
              "[stubborn] No. I'm not paying to SAVE money. "
              "[grim, slower] So I waited. EVERY day. Same aisle. "
              "[dread and hope] Black Friday. Six a.m. The REAL price. "
              "[flat, defeated] Cyber Monday starts SUNDAY.",
              {'stability': 0.35, 'similarity_boost': 0.85, 'style': 0.5, 'use_speaker_boost': True}),
    'steve_scene': (['15_s11'], "[outraged, in the moment] That's TEN dollars more!",
              {'stability': 0.0, 'similarity_boost': 0.85, 'style': 0.8, 'use_speaker_boost': True}),
    'penny': (['15_p04', '15_p06', '15_p12'],
              "[crisp, salesy but flat, a small child] Black Friday PREVIEW. Four seventy-nine. "
              "[flat] Pre-early ACCESS. Members only. "
              "[flat, corporate, tiny smile] Thank you for your PATIENCE.",
              {'stability': 0.5, 'similarity_boost': 0.85, 'style': 0.3, 'use_speaker_boost': True}),
}


def generate(char):
    ids, text, vs = TAKES[char]
    body = {'text': text, 'model_id': 'eleven_v3', 'seed': 4243, 'voice_settings': vs}
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE[char]}?output_format=pcm_24000',
                                 data=json.dumps(body).encode(),
                                 headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
    pcm = np.frombuffer(urllib.request.urlopen(req).read(), dtype='<i2').astype(np.float32) / 32768
    sf.write(os.path.join(HERE, 'voice_el', f'{char}_take.wav'), pcm, SR)


def frames_rms(x, hop=240):   # 10 ms
    n = len(x) // hop
    return np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)


def split(char):
    ids, _, _ = TAKES[char]
    x, _ = sf.read(os.path.join(HERE, 'voice_el', f'{char}_take.wav'))
    r = frames_rms(x); db = 20 * np.log10(r / r.max())
    quiet = db < -38
    # silent runs (start, end) in frames, longest first; need len(ids)-1 cuts
    runs, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if i > 0 and j < len(quiet): runs.append((i, j))
            i = j
        else: i += 1
    # pick, for each line boundary, the long-enough gap nearest to where the text says it should be
    import re
    parts = [re.sub(r'\[[^\]]*\]', '', s).strip() for s in re.split(r'(?=\[)', TAKES[char][1]) if s.strip()]
    frac = np.cumsum([len(p) for p in parts])[:-1] / sum(len(p) for p in parts)
    runs = [g for g in runs if g[1] - g[0] >= 15]          # >= 150 ms
    picked = []
    for f in frac:
        g = min((g for g in runs if g not in picked), key=lambda g: abs((g[0] + g[1]) / 2 / len(r) - f))
        picked.append(g)
    runs = sorted(picked)
    if len(runs) != len(ids) - 1: sys.exit(f'{char}: found {len(runs)} gaps, need {len(ids) - 1}')
    cuts = [0] + [a + int(np.argmin(r[a:b])) for a, b in runs] + [len(r)]
    out = {}
    for k, id_ in enumerate(ids):
        a, b = cuts[k], cuts[k + 1]
        loud = np.where(db[a:b] > -32)[0]
        s = max(a, a + loud[0] - 4); e = min(b, a + loud[-1] + 30)      # 40 ms pre-roll, 300 ms tail
        y = x[s * 240:e * 240].copy()
        # QA: internal pauses capped — shorten any silence over 0.4 s to 0.3 s (cut at its quietest middle, 10 ms crossfade)
        ry = frames_rms(y); dby = 20 * np.log10(ry / ry.max()); q = dby < -35; j = 0; keep = []
        while j < len(q):
            if q[j]:
                k2 = j
                while k2 < len(q) and q[k2]: k2 += 1
                if j > 0 and k2 < len(q) and k2 - j > 40: keep.append((j + 15, k2 - 15))
                j = k2
            else: j += 1
        for a2, b2 in reversed(keep):
            A, B, xf = a2 * 240, b2 * 240, 240
            y = np.concatenate([y[:A], y[A:A + xf] * np.linspace(1, 0, xf) + y[B:B + xf] * np.linspace(0, 1, xf), y[B + xf:]])
        fi, fo = int(0.015 * SR), int(0.12 * SR)
        y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo) ** 1.5
        sf.write(os.path.join(HERE, 'voice', id_ + '.wav'), y, SR)
        env = frames_rms(y, SR // 24); env = np.round(np.clip(env / env.max(), 0, 1), 2)
        out[id_] = {'dur': round(len(y) / SR, 3), 'env': env.tolist()}
        print(id_, out[id_]['dur'], 's')
    return out


if __name__ == '__main__':
    voice = {}
    only = [a for a in sys.argv[1:] if not a.startswith('--')] or list(TAKES)
    for c in only:
        if '--split' not in sys.argv: generate(c)
        voice.update(split(c))
    vj = os.path.join(HERE, 'voice', 'voice.json')
    old = json.load(open(vj)) if os.path.exists(vj) else {}
    old.update(voice); json.dump(old, open(vj, 'w'))
