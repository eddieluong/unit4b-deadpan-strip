# UNIT 4B — Deadpan Strip: animated dark-comedy shorts

Lemo-Opuscar style (`styles/deadpan-strip/`). Cast and premise in README.md and `styles/deadpan-strip/CAST.md`.

## Before any episode work
- Read `styles/deadpan-strip/PREPRODUCTION.md`, `QA.md`, `JOKES.md` and the last 3 entries of `channel/PERFORMANCE.md`.
- Deliver the script table (speaker, VO/in-scene, line, emotion, intensity 1–5, stressed word, picture, motion reason)
  + emotion arc and STOP for the owner's OK; then 3 key stills; then voice; only then render.
- Joke ideas: `.claude/skills/unit4b-joke-lab`. Used jokes: `episodes/BANK.md`.

## Fixed rules
- Start from a real everyday problem; a first-time viewer must get it with zero cast lore.
- Emotionalize the small problem in visuals/camera/narration, keep voices real (one short peak max, flat punchline).
- Keep 5–8 short muttered lines that add attitude; cut only lines that describe the screen.
- Motion: action per line, new shot or camera move every ~1.5–2.5 s, no character still > ~1 s, one micro-gag per beat.
- On feedback move ONE notch and say which notch; never swing to the opposite extreme.
- Run QA.md on a 2 s contact sheet before showing any video (hook 1.5 s, punch at 70–85 %, -14 LUFS, readable faces).
- Voices: ElevenLabs, key from `$ELEVENLABS_API_KEY` only; per-line speed, one CAPS stress word.

## After every deliverable
- Commit + push (GitHub eddieluong/unit4b-deadpan-strip; gh is logged in) and update the Notion page
  "UNIT 4B – Deadpan Strip" (id 4016968af9d0810e9940ee4af90fc7e0). Run `git fsck` after commits.
- After posting: 48 h / 7 d post-mortem in `channel/PERFORMANCE.md`; move new rules into QA.md or JOKES.md.

## Saving tokens
- Show options on one contact sheet; ask for all notes in one message. Long text in files, reply with the path.
