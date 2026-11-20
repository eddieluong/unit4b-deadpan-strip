# Tập 18 — One Screw · release metadata (draft 2026-11-20)

Files: `Tap18-one-screw.mp4` (28.6 s, 11.9 MB), `Tap18-one-screw-crf27.mp4` (4.5 MB, for the 10 MB upload tool), `Tap18-sheet.png` (2 s), `Tap18-sheet-0.5s.png`, thumbnails `thumb_A/B/C.png` + `thumbsheet.png` (source `film/thumbsheet.py`, `film/thumb.mjs`; set the cover by hand in Studio).
Role: glance hook on a non-phone object (a giant screw in an open palm + a worried face), new punch shape: a silent visual collapse, then a flat understatement. No brand or store name. Steve keeps the tie.

## QA (tools/qa_video.py, punch 23.635)
```
duration       28.6 s   (info; length is free)
punchline      82.6 %   (target 70–85)
static >= 3 s none
hook diff     0-0.5 6.8, 0.5-1.0 6.9, 0-1.0 10.6   (each must be >= 4)
first 1.8 s   -17.8 dBFS (aim above about -30)
loudness      -14.0 LUFS, true peak -3.2 dB (target -14 ±0.5, <= -1.2)

RESULT PASS
```
Revision 2 (Opus review): wide collapse shot 21.0-23.6 s (whole wardrobe + whole Steve, fold 21.75-22.75 s, dust, silence, then punch close-up); close drawer-front shot with flip and flip-back 8.4-11.5 s. Voice unchanged. Punch still 82.6 %.

## Thumbnails (nothing important below y 1536; no punch-line text)
- **A (recommended):** frame-1 picture (giant screw in the palm, worried face, wardrobe blurred behind), text `ONE SCREW`.
- B: the peak, arms up, screw dropping from the sleeve, text `DONE!` (best emotion, shows the screw falling).
- C: the aftermath, deadpan face, folded-flat wardrobe, text `SPARE?` (curiosity, but the collapse needs a beat to read).

## YouTube Short
- Titles (≤ 60 with tag, situation-first, no spoiler):
  - A: `POV: one screw left over #shorts` (32; the burned-in line)
  - **B (RECOMMENDED):** `POV: you built it and one screw is left over #shorts` (51; the whole situation, searchable)
  - C: `POV: flat-pack furniture, one screw left #shorts` (48)
- Description (first 125 chars = hook):
```
POV: you spent hours building the wardrobe and there is ONE screw left over. It's fine. It's a spare. Right? 🔩
The box said EASY. One person. Steve would like a word.
What is the worst thing YOU built that "had a spare screw"? Tell us below.

#relatable #comedy #animation #flatpack #shorts
```
- Tags: `one screw left over, flat pack furniture, assembling furniture fail, wardrobe collapse, spare screw, furniture instructions, easy assembly, diy fail, relatable comedy, dark comedy short, animated comedy short, cartoon, UNIT 4B, Sweaty Steve, everyday problems, shorts`
- Hashtags: #relatable #comedy #animation #flatpack #shorts
- Audience: not made for kids (owner) · Category: Comedy · Language: English · Altered/synthetic: as Tập 7–14 (owner's declaration)
- Playlist: Steve vs. Everyday Machines (owner may choose a new one for non-machine topics)

## Instagram Reel caption
```
POV: you built the whole wardrobe and there is ONE screw left over. It's fine. It's a spare. 🔩 What did YOU build that "had a spare"? ▶️ More on YouTube: youtube.com/@unit4bcomedy (link in bio) #relatable #comedy #animation #flatpack
```

## Pinned comment
`Be honest: how many leftover screws live in YOUR drawer right now? And did the thing survive? Tell us below.`
(zero-spoiler alternative: `What did you build that you probably should not have trusted?`)

## Upload settings
- Auto-dubbing OFF (channel level). Posting slot: **24/11**, ~19:00–20:00 VN, the only Short that day; note the publish time.
- Order: YouTube first, then Instagram. Kids/altered declarations, the cover and the publish click are the owner's.

## Skill check (criteria applied by hand: `youtube-seo-thumbnail`, `youtube-titles-thumbnails`, `youtube-seo-optimize`; checklist pass)
| Option | Score | Note |
|---|---|---|
| **A** | **9.0** | giant screw plus a face reads in one glance, 2 words, matches frame 1 and the title; wardrobe plant hidden |
| B | 8.5 | strongest emotion; the screw in the air already hints at the leftover |
| C | 8.0 | funniest face, but the pile reads as cardboard boxes until the video explains it |
Recommended: thumbnail A + title B.
Suggestions NOT applied (repo rules win): 70-char search titles and 5 title variants; long entity descriptions, chapters, links, translated metadata, end screens, Test & Compare; exactly 3 hashtags (house pattern 5); open-mouth shock face, arrows, brand/logo; changes to length or captions that would confound the glance-hook test.
Conflicts: none with QA.md.
