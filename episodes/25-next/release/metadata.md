# Tập 16 — One Bulb · release metadata (draft 2026-11-20)

**Owner pick (2026-11-25, gate 3):** "OK, lấy mặc định A + tiêu đề đề xuất": thumbnail A, title `POV: the Christmas lights are one giant knot #shorts`.

Files: `Tap16-one-bulb.mp4` (17.2 MB, full quality) · `Tap16-one-bulb-crf27.mp4` (6.7 MB, for the 10 MB upload tool) · sheets `Tap16-sheet.png` (2 s), `Tap16-sheet-0.5s.png` · thumbnails `thumb_A/B/C.png`, `thumbsheet.png` (source `film/thumb.mjs` + `film/thumbsheet.py`, frames from scene.js with title and captions off).
Role in the plan: glance hook on a non-phone object (a giant knot of lights ≥ 40 % of frame 1 plus Steve's sweaty face), self-inflicted cause reveal (he plugged in the whole 200-bulb pile, power strip "MAX 3 STRINGS"), cartoon-logic blackout, flat punch, button loops to frame 1. Steve keeps the tie.
Runtime 25.6 s, punch 20.8 s (81.2 %), -14.0 LUFS.

## Thumbnails (1080x1920, nothing important below y 1536, no punch-line text)
- **A (recommended):** frame-1 picture: sweaty Steve over the giant knot, text `ONE BULB` (2 words). Same picture as frame 1, zero lore.
- B: the peak: Steve wrapped in glowing lights, arms up, star on his head, text `ONE BULB`. Strong colour and emotion but gives away that he lit everything.
- C: wordless punch: black street, bulging eyes and teeth in a dark window. Best curiosity gap, but the premise is unreadable without the video.
- Set the cover by hand in Studio (extension upload does not stick).

## YouTube Short
- Titles (situation-first, no spoiler, ≤ 60 chars with the tag):
  - A: `POV: getting the Christmas lights out #shorts` (45; the burned-in title line)
  - **B (RECOMMENDED):** `POV: the Christmas lights are one giant knot #shorts` (51; shows the premise and a search phrase)
  - C: `POV: you only need ONE working bulb #shorts` (44)
- Description (first 125 chars = hook), file-ready:
```
POV: you put the Christmas lights away neatly. This is what came out. One bulb is all he needs. 🎄
Steve untangles, plugs in, and finds out what 200 bulbs can do to one power strip.
How tangled are YOUR lights this year? Tell us below.

#relatable #comedy #animation #christmas #shorts
```
- Tags: `tangled christmas lights, christmas lights problems, christmas decorations fail, christmas humor, holiday stress, untangling lights, christmas lights not working, everyday annoyances, relatable comedy, dark comedy short, animated comedy short, cartoon, UNIT 4B, Sweaty Steve, everyday problems, shorts`
- Hashtags: #relatable #comedy #animation #christmas #shorts
- Audience: not made for kids (owner's declaration) · Category: Comedy · Language: English · Auto-dubbing OFF · Altered/synthetic: same as Tập 7–14 (owner's declaration)
- Playlist: Steve vs. Everyday Machines

## Instagram Reel (crop: Original)
```
POV: you put the Christmas lights away neatly. This is what came out. 🎄 How tangled are YOUR lights this year? Tell us below. ▶️ More on YouTube: youtube.com/@unit4bcomedy (link in bio) #relatable #comedy #animation #christmas
```

## Pinned comment
`Be honest: do you wrap your lights neatly, or just throw them in the box? Tell us below.`

## Posting slot
24/11 (owner calendar), ~19:00–20:00 VN, the only Short that day. YouTube first, then Instagram. Declarations, thumbnail and the publish click are the OWNER's.

## Skill check (criteria applied by hand: youtube-seo-thumbnail, youtube-titles-thumbnails, youtube-seo-optimize; checklist, no rewrite)
| Option | Score | Note |
|---|---|---|
| **A** | **9.0** | giant knot is an instant read, readable face, 2 words, matches frame 1 |
| B | 8.5 | best colour, shows the lit-up Steve; reveals the "lights everywhere" payoff |
| C | 8.0 | curiosity gap; premise unreadable alone, no text |
Recommended: thumbnail A + title B.
Not applied (repo rules win): 70-char search titles, chapters, long entity description, exactly 3 hashtags, arrows/shock faces/brand, any change to length or captions.

## QA output (tools/qa_video.py --punch 20.8)
```
duration       25.6 s   (info; length is free)
punchline      81.2 %   (target 70–85)
static >= 3 s none
hook diff     0-0.5 7.4, 0.5-1.0 27.0, 0-1.0 26.5   (each must be >= 4)
first 1.8 s   -16.5 dBFS (aim above about -30)
loudness      -14.0 LUFS, true peak -2.5 dB (target -14 ±0.5, <= -1.2)
RESULT PASS
```
Notes: hook checked on the 0.5 s sheet (frame 1 = knot + face). Risk: cartoon-logic blackout and a Christmas theme (non-Christmas viewers); the film has a Christmas title line so it will age after December.
