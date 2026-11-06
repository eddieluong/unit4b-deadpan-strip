# Viral DNA notes — Tập 8 research (2026-11-06)

Method: `tools/viral_research.py find` (4 query batches, `--shorts-only`, min 50-300 k views) then `subs`.
Raw lists: `candidates.md` + `b/ c/ d/ candidates.md`; transcripts git-ignored (`transcripts/`, other creators' words, analysis only).

## Limits (read first)
- YouTube search ranks by all-time views and the keyword "annoying" pulled Annoying Orange; the "Sec" column reads 100+ s
  for many items, so the under-35 s filter had to be done by hand. No recent-date filter exists in the tool.
- `youtube_transcript_api` is not installed in the venv, so `subs` fell back to yt-dlp and got only 2 of 10 files
  (C7V_86O4zKs 17 lines, peyR6WETV2c 0 lines). Most short animated memes are music/silent anyway.
- Consequence: the DNA below is metadata-based (title, length, views, date, our own reading), not full-transcript analysis.
  Do not quote pacing numbers as measured. To fix: `pip install youtube-transcript-api` in the venv, then rerun `subs`.

## Under-35 s relatable/animated Shorts found (pulled with yt-dlp metadata)
| id | Title (short) | Sec | Views | Posted | Likes % | Note |
|---|---|---|---|---|---|---|
| gbUY1W77bJQ | "sucker" (OC animation meme) | 24 | 11.9 M | 2022-03 | 6.2 % | music-led, no dialogue, loop |
| ntXZHukmuh0 | Low Battery (two phones cartoon) | 25 | 8.1 M | 2020-09 | 0.3 % | human-less, battery as character |
| ItqW44kSIAg | Low Battery short | 27 | 1.2 M | 2021-01 | 0.4 % | same topic, smaller |
| 9H3S7z4viaM | Learning With Buddy Ep 1: Cleaning | 24 | 1.27 M | 2026-07 | 1.0 % | 90s-TV parody, deadpan lesson, series format |
| _7Av8kh43_k | Somebody call an ambulance | 27 | 0.96 M | 2025-07 | 6.2 % | meme-sync, loop |
| C7V_86O4zKs | Paparazzi (OC meme, plot twist) | 33 | 1.14 M | 2026-07 | 5.3 % | song-synced, twist at ~50 %, 17 caption lines |
| sDU_x5BQFas | "This joke was written by AI" | 30 | 4.0 M | 2025-04 | 2.3 % | cartoon clip, commentary title |
| peyR6WETV2c | GUESS (animation meme) | 23 | 2.1 M | — | — | no subtitles |

## Patterns (what we can honestly say)
1. **Length 23-33 s dominates** the animation-meme set; all are under 35 s with the premise visible in the first frame.
   Supports the 25-30 s target.
2. **Topic demand for low battery is proven** (two separate Low Battery cartoons at 8.1 M and 1.2 M), and it is wordless, so
   it travels across languages. Their mechanism: object as character. Ours must be human-first (Steve) to stay original.
3. **Title pattern:** short noun phrase or "POV:" with no setup; numbers/emotion words rare. We use a `POV: ...` caption.
4. **Hook (0-2 s):** visual absurdity or a face, not a spoken question (4 of 5 viewed formats are music/visual-led).
5. **Loop:** the most-viewed items (sucker, ambulance, paparazzi) are loop-friendly seamless 20-33 s clips. Supports ending on a
   loop button back into frame 1.
6. **Series framing works for deadpan** (Buddy: a fixed host introduces each "lesson"). Cf. our Snuggles V.O.

## DNA cards (metadata-level)
### ntXZHukmuh0 · 8.1 M · 25 s
- Pain point: battery dying at the worst time.
- Hook: character face/object absurdity (phone with expression). Setup/punch/loop: not measured (no subtitles).
- Mechanism: personification of the problem. Our angle: keep the pain on a human; escalation of attempts to charge, punch where the warning itself drains the last percent.
### 9H3S7z4viaM · 1.27 M · 24 s
- Pain point: chores/cleaning, taught in a mock-lesson tone.
- Mechanism: deadpan instructor voice vs absurd action; episode-number framing makes it bingeable. Our angle: Snuggles' flat V.O. over Steve's attempt.
### C7V_86O4zKs · 1.14 M · 33 s
- Hook visual/music; twist roughly mid-clip; no spoken dialogue we can reuse. Mechanism: expectation reversal at ~50 %.
  Our angle: put the reversal at 75-85 % (our house rule), not mid.

## How these fed IDEAS.md
Only pacing targets (25-30 s, premise in frame 1, loop), the object-as-visual-hook idea (giant typing bubble), and the
low-battery demand signal. No lines, premises or punchlines were taken; originality check not needed (no lines.json yet).
