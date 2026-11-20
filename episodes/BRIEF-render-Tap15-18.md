# Brief: Tập 15–18, voice → render → QA → thumbnails → metadata (Opus, 2026-11-20)

Owner: "làm đủ 4 video luôn đi" (make all 4 now). One Sonnet agent per episode, running in parallel.

| Tập | Title | Folder | Script | Stills |
|---|---|---|---|---|
| 15 | The Lid | `episodes/24-next` | `24-next/script.md` | approved (gate 2) |
| 16 | One Bulb | `episodes/25-next` | `25-next/script.md` | approved (gate 2) |
| 17 | Mosquito | `episodes/26-next` (create) | `SCRIPTS-Tap17-18.md` → copy into `26-next/script.md` | not yet: make 3 key stills first (hook, peak, punch) |
| 18 | One Screw | `episodes/27-next` (create) | `SCRIPTS-Tap17-18.md` → copy into `27-next/script.md` | not yet: make 3 key stills first |

## Reference implementation: Tập 14 (`episodes/23-next`)
Copy its pipeline and read it before writing code:
- `film/stills.js`, `film/scene.js`, `events.json`, `gaps.json`
- `voice_gen.py` (ElevenLabs eleven_v3, per-line speed, one CAPS stress word; run with `HF_HUB_OFFLINE=1 ~/lemo-opuscar/.venv/bin/python`)
- `retime.py`, `mix.py`, `render.sh`, `mksheet.py`
- `thumb.js` / `thumb.mjs` / `thumbsheet.py`
- `release/metadata.md` (copy its structure)

Voice IDs and cast looks: as in 23-next and `styles/deadpan-strip/CAST.md`.

The API key comes only from env `$ELEVENLABS_API_KEY`. Never print it or write it anywhere.

## Read first
- `styles/deadpan-strip/PREPRODUCTION.md`, `QA.md`, `JOKES.md`.
- The episode's script table. The script is approved: do not change lines, punches or the order of beats.
- Steve keeps the tie (owner, gate 2).

## Lessons from the Tập 14 self-review (apply from the start)
- **No stiff stretches:** every line needs its own action; a new shot or camera move every 1.5–2.5 s; no character still for more than ~1 s; one micro-gag per beat.
- **The peak hits hard:** 2–3 stabs, a camera shake and an impact sfx. Keep the voice to one short peak only.
- **The reveal reads instantly:** the cause or plant is visible and readable in the payoff frame.
- **No lore chips:** no name labels, no name tags. Faces are fully in frame in the punch shot (never cropped).
- **Captions burned in** on every line, never covering the punch face, and nothing important in the bottom 20 %.

## Targets (QA.md)
- 25–30 s.
- The hook reads in 1.5 s, and frame 1 is the script's glance hook (one big symbol ≥ 40 % plus Steve's face ≥ 25 %).
- Punch at 70–85 %. Button ≤ 3–4 s, looping to frame 1.
- -14 LUFS.
- Music stops at the reveal; silence or near-silence under the punch line.

**QA command:** `~/lemo-opuscar/.venv/bin/python tools/qa_video.py <mp4> --punch <s>`, run from the repo root.

**Render:** use `--workers 2`, because 4 renders run in parallel.

**Logs:** always redirect to `film/out/tmp/*.log` and read only the tail.

## Deliverables per episode (in its folder)
1. For Tập 17–18 only: `film/stills/still_{1_hook,2_peak,3_punch}.png`.
2. Voice files plus `film/voice/film_timeline.json`.
3. Release files:
   - `release/TapNN-<slug>.mp4`, the full-quality render.
   - Also a `release/TapNN-<slug>-crf27.mp4` under 10 MB.
4. QA files:
   - `release/TapNN-sheet.png` (2 s contact sheet), plus `TapNN-sheet-0.5s.png`.
   - The QA output pasted into `release/metadata.md`.
5. Thumbnails: `release/thumb_A.png`, `thumb_B.png`, `thumb_C.png` and `thumbsheet.png`. Follow the 23-next rules: 1080x1920, nothing important below y 1536, ≤ 2 words of text, no punch-line text.
6. `release/metadata.md`:
   - 3 titles (≤ 60 chars with #shorts, situation-first, no spoiler) with one marked recommended.
   - Description (the first 125 chars are the hook).
   - Tags and 5 hashtags.
   - An IG caption with the line "▶️ More on YouTube: youtube.com/@unit4bcomedy (link in bio)".
   - A pinned comment.
   - The posting slot.
   - The skill-check table (as in 23-next).
7. **Self-review before reporting:** watch your own 0.5 s sheet as a first-time viewer, then fix stiff stretches, unclear reveals, crops and caption overlaps. Do at most 2 rounds.

**Do NOT:** commit, upload, edit BANK.md, or touch another episode's folder.

**Report (short):**
- File paths.
- Duration, punch time and %, and LUFS.
- QA pass/fail.
- What the self-review fixed.
- Any risk for the owner.
