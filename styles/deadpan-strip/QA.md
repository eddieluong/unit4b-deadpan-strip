# UNIT 4B — Lessons from Tập 1 and the QA checklist for every short

Tập 1 ("We Missed You", internal script 10) took six versions. Each round of feedback exposed a mistake that
was predictable. This file turns them into rules and a checklist. Run the checklist **before** showing a
video to anyone. `JOKES.md` holds the writing rules; this file holds the review.

## 1. What went wrong, why, and the rule now

| # | Version | Problem the viewer saw | Root cause | Rule now |
|---|---|---|---|---|
| 1 | ep 09 pilot | "I watched it and didn't understand it." | The punchline needed lore (Nana is a retired assassin; old tenants died in 4B). We wrote from the characters, not from life. | Start from a real everyday problem. A first-time viewer must get it with zero backstory. |
| 2 | v1 | Voices stiff, no comedy, no emotional pop. | Default TTS settings, one generic tag per line, no performance direction. | Every line gets a specific feeling and a v3 tag; stability around 0.35. |
| 3 | v2 | "Nobody reacts like that to a late delivery." | We over-corrected: "emotionalize" read as "act big" (squealing, screaming, sobbing). | Inside a drama, outside a normal person. Exaggeration lives in pictures, music and narration; one short peak max; punchline said flat. |
| 4 | v3 | Lines that only describe what's on screen. | Dialogue written before the shot list; the picture wasn't trusted. | Cut lines that describe the image. |
| 5 | v4 | "Now you cut all the dialogue and lost the charm." | Over-corrected again: cut lines that carried attitude and irony along with the descriptive ones. | Keep short muttered lines that add attitude, irony or inner logic (5–8 per short). |
| 6 | v5 | Narrator voice didn't fit; the user wanted American. | Voice chosen early and never auditioned against alternatives. | Audition 3–4 voices on the real line before producing; ask about accent. |
| 7 | v5 review | Weak hook (6 s of a man sitting), 48 s for one joke, 13 s after the punch, static stretches, faces too small on a phone, bugs ("SENT ✓" visible 0.3 s, cat hidden behind a head, cutaway with no "dream" cue). | No review pass against the platform: we checked correctness (lines, levels) but not retention. | Run the checklist below on a contact sheet every 2 s before delivering. |
| 8 | Tập 1 live (YouTube, first 2 days) | 1.3K views but **45.5 % average viewed**: viewers swiped away around 0:18 of 40 s; 8 likes, 0 comments. | The cold open showed the ending (the note), so the middle had no question left to answer; 0:14–0:21 (3 PM tally marks, crackers, lighthouse cutaway) was 5–6 s with no line and no new information. Nothing asked the viewer to comment. | The hook raises a question and keeps the answer for the punch. Something new every 2–3 s (a line, a jump in time, a new action, a stake that rises). No beat without new information. Default length 25–30 s. End on something viewers can answer in the comments. |

**The pattern behind 2–5:** each fix swung to the opposite extreme. When feedback says "too X", move one notch,
not to the other end, and say which notch you chose.

## 2. QA checklist (run on every short)

The measurable items are automated: `python tools/qa_video.py <video.mp4> --punch <seconds>` checks duration,
punchline position, static stretches (with the line boil blurred out), the level of the first 1.8 s and loudness,
and exits non-zero on a failure. Run it, then do the rest by eye on a contact sheet every 2 s.

### Before writing
- [ ] The problem is something most adults have lived. Write it in one line without any character names.
- [ ] The joke works for a first-time viewer who knows nothing about the cast.
- [ ] Not already in `episodes/BANK.md`.

### Script
- [ ] **Hook in 1.5 s:** frame 1 is the strangest or most telling image (cold open with the outcome is allowed and often best), plus an on-screen title line ("POV: …").
- [ ] **The hook asks, the punch answers:** if the cold open shows an outcome, the cause must stay hidden until the punch.
- [ ] **Retention map:** list every 2–3 s window and what is new in it; any window with nothing new gets cut.
- [ ] **One joke, 25–30 s by default (40 s max).** Punchline at 70–85 %. After it: one button at most (≤ 4 s), then out or loop.
- [ ] **Show, don't say, without going silent:** no line describes the picture; 5–8 short lines that carry attitude, irony or inner logic.
- [ ] **Real voice:** each line is something a tired real person would mutter. One short peak max. Punchline flat.
- [ ] Every silent beat has a face change that carries it.

### Voice
- [ ] Narrator and any new voice auditioned (3–4 options on the real line) and approved.
- [ ] stability ~0.35 for natural emotion, 0.5 for the narrator; stability 0.0 only for a real peak.
- [ ] Internal pauses capped at 0.6 s; trim a take rather than stretch the edit around it.
- [ ] `asr_check.py`: every word heard (ignore diffs that are only audio tags or number formatting).

### Picture (check on a contact sheet every 2 s)
- [ ] **No shot over ~3 s without a change** (new face, new prop, camera move, cut).
- [ ] **Faces readable on a phone:** in two-shots the head is ≥ 1/6 of the frame height; use 1.3× framing for rooms and 1.6× for reaction shots.
- [ ] Every on-screen text (phone, sign, label, thought bubble) is fully in frame and stays ≥ 1 s.
- [ ] No character or prop hides another; nothing important is cut by the panel edge.
- [ ] Cutaways and fantasies are marked as such (dream border, colour shift).
- [ ] Captions don't cover the punchline face; title stays clear of the art.

### Sound
- [ ] Music stops dead before or at the punchline.
- [ ] Final: −14 LUFS ±0.5, true peak ≤ −1.2 dB with no `mux.sh` warning. With little dialogue, pre-master in `mix.py` (compress → limit → loudnorm TP −2.5).

### Delivery
- [ ] Pinned comment / caption asks a question the viewer can answer from their own life.
- [ ] 48 h after posting: read average % viewed and viewed-vs-swiped; note the swipe-away second here.
- [ ] Watch the whole thing once as a viewer: where would you swipe away? Fix that moment first.
- [ ] Score with `scorecard.md` after the render, not only the script.
- [ ] Commit, push, update the episode page on Notion (see memory: sync rule).

## 3. Tooling notes learned on the way
- One character = one take. Generating each line separately (different tags and settings) made Steve sound like several people. Generate all of a character's lines in one request (fixed seed, same settings), split at the quietest point between lines, keep a 300 ms natural tail, fade in 15 ms / out 120 ms, and give every line the same light room. Never cut a line where it is still loud: v7 endings were cut at −25 to −31 dBFS, heard as a click at every line end.
- "One voice doing all the characters" (the competitors' trick) was tried on Tập 1 with ElevenLabs: Steve's voice faking a documentary narrator. Pitch-shifting broke the sound and the v3 impression stayed weak; the user preferred the separate voices of v7. Revisit only with a real performance (speech-to-speech) or a newer model.
- Voices: "..." and [pause] in the text make ElevenLabs insert even, rigid pauses that read as AI. Write lines with normal punctuation, give each take its neighbours (`previous_text` / `next_text`, multilingual v2), and start voice casting from conversational community voices in the Voice Library rather than the premade ones.
- Measuring "static" on raw frames is wrong for this style: the hand-drawn boil changes every frame. Blur (5×5 blocks) and compare frames 1 s apart (`tools/qa_video.py` does this).
- A slide transition must paint the panel background first, or the paper shows through behind the moving screen.
- Props drawn in front of a window (the cat) can hide the joke behind the window (the GARBAGE sign): check what the key shot must show and clear it.
- `mux.sh` loudnorm raises gain; a mix with long silences has a high crest factor and will clip after normalization. Pre-master in `mix.py`.
- `sfx.brown(d)` can return one sample more than the buffer; slice to `len(buf)`.
- Seated stick figures: `pose.sit` lowers the body; the floor is at local `+pen.sit`.
- When a camera push-in is used, put on-screen tags (time labels) in screen space, after the camera, or they get cropped.
- Keep the original takes in `voice_el/` and derive trimmed versions into `voice/`; document trims in `lines.json` (`film_trim`).
