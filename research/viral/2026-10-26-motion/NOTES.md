# Why UNIT 4B feels stiff — measured against reference shorts (2026-10-26)

10 reference shorts (6 Haminations, 2 TheOdd1sOut, Casually Explained, Pencilmation) vs Tập 1 / Tập 2, low-res copies
analysed locally (not kept). Script: frame difference at 12 fps on a 36×64 blurred grey image; "cut" = jump > 18;
"still" = share of 1-s windows with motion < 0.6 (boil-proof).

| Video | Length | Changes (cuts/jumps) | Avg shot | Motion (median) | Still seconds |
|---|---|---|---|---|---|
| Haminations ×6 (storytime) | 14–44 s | 18–118 | 0.3–0.9 s | 2.7–4.4 | 0–19 % |
| TheOdd1sOut ×2 | 37–59 s | 31–61 | 1.0–1.1 s | 1.7–2.1 | 7–11 % |
| Pencilmation | 61 s | 24 | 2.4 s | 0.67 | 47 % |
| Casually Explained (deadpan slides, the exception) | 49 s | 5 | 8.2 s | 0.05 | 86 % |
| **UNIT 4B Tập 1** | 39.8 s | 15 | 2.5 s | 1.66 (mostly line boil) | 3 % |
| **UNIT 4B Tập 2 v1** | 29.8 s | 9 | 3.0 s | 0.82 | 24 % |
| Tập 2 0:06–0:10 (old) | 4.4 s | 0 | — | 0.00 | 100 % |
| **Motion test (new layer)** | 5.6 s | 0 | — | 2.26 | 0 % |

What the reference animators do (6 fps strips): a new pose or expression on almost every phrase; head and hair bob
with the voice; hands act (hips, fists, pointing); a mid/close shot of the speaker most of the time; big 1–3 word
kinetic captions in the middle of the picture; quick cutaways to the event being described.

Targets for UNIT 4B: motion median ≥ 1.8 with no character still > ~1 s; a new pose per phrase; a shot change or
camera move every ~1–2.5 s; kinetic word captions. Tools: `styles/deadpan-strip/demo/motion.js` (track / idle /
speech / pop / wordChunk) and lean / tilt / headDy / tail + new arm poses (wave, facepalm, chin, cross, reach, wide)
in `cast_stick.js`. Test: `styles/deadpan-strip/demo/motion-test/`.
