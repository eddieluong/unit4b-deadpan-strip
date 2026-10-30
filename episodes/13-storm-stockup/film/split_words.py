"""Split a one-take voice into script lines using Whisper word timings (for takes with many short lines, where cutting at
the longest silences picks the wrong gaps). Cuts at the quietest point between the last word of a line and the first word
of the next; same trimming/fades as one_take.py; rewrites voice/<id>.wav and voice/voice.json.
    ~/lemo-opuscar/.venv/bin/python split_words.py steve snuggles
"""
import sys, os, re, json, difflib
import numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from one_take import TAKES, frames_rms, SR

HERE = os.path.dirname(os.path.abspath(__file__))
from faster_whisper import WhisperModel
M = WhisperModel('base.en', device='cpu', compute_type='int8')
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())


def split(char):
    ids, text, _ = TAKES[char]
    parts = [re.sub(r'\[[^\]]*\]', '', s).strip() for s in re.split(r'(?=\[)', text) if s.strip()]
    x, _ = sf.read(os.path.join(HERE, 'voice_el', f'{char}_take.wav'))
    from scipy.signal import resample_poly
    x16 = resample_poly(x, 2, 3).astype(np.float32)   # Whisper expects 16 kHz; the take is 24 kHz
    segs, _ = M.transcribe(x16, language='en', word_timestamps=True, beam_size=5, initial_prompt=' '.join(parts))
    tw = [(norm(w.word), w.start, w.end) for s in segs for w in s.words if norm(w.word)]
    # align on characters (robust to "a.m." vs "a m", "five" vs "5"): script char → transcript word
    tstr, owner = '', []
    for j, (w, _, _) in enumerate(tw): tstr += w; owner += [j] * len(w)
    sstr, ends = '', []
    for p in parts:
        sstr += ''.join(norm(w) for w in p.split()); ends.append(len(sstr) - 1)
    sm = difflib.SequenceMatcher(a=sstr, b=tstr, autojunk=False)
    cmap = {}
    for a0, b0, n in sm.get_matching_blocks():
        for k in range(n): cmap[a0 + k] = b0 + k
    def word_at(ci):
        for j in range(ci, -1, -1):
            if j in cmap: return owner[cmap[j]]
        return 0
    sw = list(sstr)
    r = frames_rms(x); db = 20 * np.log10(r / r.max())
    q = db < -38; SIL = []; i = 0
    while i < len(q):
        if q[i]:
            j = i
            while j < len(q) and q[j]: j += 1
            if j - i >= 12 and i > 0: SIL.append((i, j))
            i = j
        else: i += 1
    cuts = [0]
    for e in ends[:-1]:
        k = min(word_at(e), len(tw) - 2)
        a, b = int(tw[k][2] * 100), max(int(tw[k][2] * 100) + 1, int(tw[k + 1][1] * 100))
        a, b = min(a, len(r) - 2), min(b, len(r) - 1)
        mid = (a + b) / 2
        near = [g for g in SIL if abs((g[0] + g[1]) / 2 - mid) < 60]          # a real pause within 0.6 s wins
        if near: g = min(near, key=lambda g: abs((g[0] + g[1]) / 2 - mid)); cuts.append(g[0] + int(np.argmin(r[g[0]:g[1]])))
        else: cuts.append(a + int(np.argmin(r[a:b + 1])) if b > a else a)
        print('cut after', repr(sstr[max(0,e-8):e+1]), '->', tw[k][0], round(tw[k][2], 2), 'next', tw[k + 1][0])
    cuts.append(len(r))
    out = {}
    for k, id_ in enumerate(ids):
        a, b = cuts[k], cuts[k + 1]
        loud = np.where(db[a:b] > -32)[0]
        s = max(a, a + loud[0] - 4); e = min(b, a + loud[-1] + 30)
        y = x[s * 240:e * 240].copy()
        ry = frames_rms(y); dby = 20 * np.log10(ry / ry.max()); qq = dby < -35; jj = 0; keep = []   # keep natural pauses; cap > 0.7 s at 0.5 s
        while jj < len(qq):
            if qq[jj]:
                k2 = jj
                while k2 < len(qq) and qq[k2]: k2 += 1
                if jj > 0 and k2 < len(qq) and k2 - jj > 70: keep.append((jj + 25, k2 - 25))   # only pauses > 0.7 s, shortened to 0.5 s
                jj = k2
            else: jj += 1
        for a2, b2 in reversed(keep):
            A, B, xf = a2 * 240, b2 * 240, 240
            y = np.concatenate([y[:A], y[A:A + xf] * np.linspace(1, 0, xf) + y[B:B + xf] * np.linspace(0, 1, xf), y[B + xf:]])
        fi, fo = int(0.015 * SR), int(0.12 * SR)
        y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo) ** 1.5
        sf.write(os.path.join(HERE, 'voice', id_ + '.wav'), y, SR)
        env = frames_rms(y, SR // 24); env = np.round(np.clip(env / env.max(), 0, 1), 2)
        out[id_] = {'dur': round(len(y) / SR, 3), 'env': env.tolist()}
        print(id_, out[id_]['dur'], 's |', parts[k])
    return out


if __name__ == '__main__':
    vj = os.path.join(HERE, 'voice', 'voice.json')
    v = json.load(open(vj)) if os.path.exists(vj) else {}
    for c in sys.argv[1:]: v.update(split(c))
    json.dump(v, open(vj, 'w'))
