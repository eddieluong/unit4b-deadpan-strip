# RULES DIGEST for Tập 12 (compiled 2026-11-18 from the files named in each bracket)

Model: `episodes/20-two-minutes/script.md` (Tập 11). Numbers are quoted from the source. Conflicts are listed in section 5, not resolved.

## 1. Hard rules (script / picture / voice / motion)
- **Script:** 25–30 s base, 40 s max; punch at 70–85 % (Tập 11 target: ~77 %); after the punch one button ≤ 4 s, then loop. [QA Script; PERFORMANCE 3-Short]
- **Script:** one joke, one everyday problem a first-time viewer gets with zero lore. [JOKES §1; QA Before writing]
- **Script:** voice-led, one opinionated voice from second 0, ~2 words/s, no silent first second. [JOKES §0.2]
- **Script:** the premise is stated as a judgement in ≤ 2 s; the cause stays hidden until the punch ("the hook asks, the punch answers"). [JOKES §0.3; QA Script]
- **Script:** a new fact or joke every 5–8 s; new information every 2–3 s; no window with nothing new. [PREPRODUCTION #7; QA retention map]
- **Script:** every rule the joke depends on is shown or said in an earlier row. [PREPRODUCTION §2; JOKES §0.12]
- **Script:** one emotion peak only (intensity 4–5, 2–5 s, in the scene); punch said flat, 1 word where possible. [PREPRODUCTION §3; Tập 11 arc]
- **Script:** no real profanity: cut before the swear, 1 kHz bleep 0.6 s, grawlix "#@$%&!". [PREPRODUCTION §4]
- **Script:** 5–8 short muttered lines that carry attitude; cut lines that only describe the picture. [QA Script; JOKES §1]
- **Script:** no lines from animals: sound + body language only; the cat never talks. [PREPRODUCTION #18]
- **Script:** one running gag per episode at most; no brand, celebrity, local politics or real country. [JOKES §1, §5]
- **Picture:** frame 1 is the strangest/telling image with a character's face, premise line from 0.0 s; no title-card opening. [PREPRODUCTION #19; JOKES §0.2]
- **Picture:** the title line sits inside the panel below the phone safe area: baselines y ≈ 230 and 290 of 1920; art from PY 320; captions y ≈ 1500. [PREPRODUCTION #21, §6]
- **Picture:** no shot over ~2.5–3 s without a change (new face, prop, camera move or cut); no character still > ~1 s. [QA Picture; PREPRODUCTION #9]
- **Picture:** faces ≥ 25 % of the frame; two-shot head ≥ 1/6 of frame height; captions never cover the punch face. [QA Picture; DIAGNOSIS]
- **Picture:** a pose must read the beat at phone size (hiding = sitting, not lying flat). [PREPRODUCTION #20]
- **Picture:** silent beats 0.6–1 s on a face reaction; never an object alone for > 3 s. [PREPRODUCTION #17]
- **Picture:** voice-over is not lip-sync; lips move only for lines said inside the scene. [PREPRODUCTION #13]
- **Voice:** one take per character, cut at the quietest point; internal pauses ≤ 0.6 s; narration at natural speed, never sped up. [QA Voice; PREPRODUCTION #15]
- **Voice:** gaps by beat: setup→payoff 0.3 s, before laugh 0.45, after joke 0.7, time passing 0.6, before punch 0.8. [PREPRODUCTION #16]
- **Voice:** stability ~0.35 for natural emotion, 0.5 for narrator, 0.0 only for the one real peak. [QA Voice; PREPRODUCTION §3]
- **Voice:** one CAPS stress word per line; captions burned in on every line. [JOKES §1; PREPRODUCTION §6]
- **Motion:** every beat has an action with a reason; on twos; no wobble; a micro-gag per beat. [PREPRODUCTION #9, #7; JOKES §0]
- **Motion:** music stops dead before or at the punch; final mix −14 LUFS ±0.5, true peak ≤ −1.2 dB. [QA Sound]

## 2. QA gates (run in order, stop at the first fail)
- [ ] **Glance test:** frame 1 is understood in 0.2 s WITHOUT reading: one big number/icon next to a face (Tập 11: "2 MIN" + hollow face). A chat screen or line of text is not a hook. [QA Script, Tập 8–10 result]
- [ ] Hook in 1.5 s: frames 0.0 / 0.5 / 1.0 s differ; visible motion by 0.3 s; `tools/qa_video.py --punch <s>` passes. [QA Script; DIAGNOSIS §4.A.4]
- [ ] Retention map: every 2–3 s window lists what is new; empty windows are cut. [QA Script]
- [ ] Read the script aloud with no pictures: still funny. [JOKES §0.1]
- [ ] `asr_check.py`: every word heard. [QA Voice]
- [ ] Contact sheet every 2 s, title clear of the phone top area (~170 px masked). [QA Picture; PREPRODUCTION #21]
- [ ] Owner gates in order: script table + emotion arc → 3 stills → voice take → full render. No fix-after-render loops. [PREPRODUCTION §5]

## 3. Data: keep and test
- **Keep:** 25–30 s base (Tập 8–10 viewed 57 → 74 → 80.7 %, so the story holds people). [PERFORMANCE 3-Short]
- **Keep:** auto-dubbing OFF; one Short per day; post every Short on Instagram (1.7–2.5 K views, all non-followers).
- **Keep:** the punch at ~77–79 %, loop ending. Best "stayed" so far: Tập 6 46.8 % (planted word + loop, 49 s) and Tập 9 47.2 % (the only number-icon hook so far).
- **Bottleneck:** the first second. Stayed is the only failing metric: Tập 8 31.9 %, Tập 9 47.2 %, Tập 10 28.1 %; target ≥ 50 %. [PERFORMANCE 3-Short]
- **Test in Tập 11 (result not in yet):** glance hook. Tập 12 must keep it (one variable at a time), so do not change the hook again unless the Tập 11 48 h read says so.
- **Open:** posting slot 07–08 VN raised views but skewed VN (75 %); keep it fixed, do not decide yet.
- **Not a goal yet:** subscribers (0 from ~3,000 views).

## 4. Used topics and mechanisms (avoid repeating)
- Used topics: see `episodes/BANK.md` (rows 01–19). Tập 11 "Two Minutes Away" (episodes/20-two-minutes, delivery app) is NOT in BANK yet: add its row before the Tập 12 script.
- Used premise format: 4 of the last 4 shorts (Tập 8–11) are a phone screen in frame 1 (dots, 1 %, group chat, "2 MIN"). Next one must start from a non-phone object or a person.
- Used mechanism: cat causes the reveal (BANK 11, 14, 18). Avoid for Tập 12.
- Used mechanism: loop ending (BANK 05, 10, 11, 13, 14, 15, 17, 18; Tập 11). Loop is still the default, but do not add a new "match cut to frame 1" by default.
- Used mechanism: "escalation ×3 with a silent third" (BANK 02, 17, 18, 19). Use only if the third beat is clearly new.
- Used punch shape: flat one-word punch "…Enjoy." (Tập 11) and "…cool." (Tập 1). Do not reuse the flat-word punch in Tập 12.
- Used list of 2–3 days/hours (BANK 14, 16, 17). Avoid a count of hours as the hook.

## 5. Changes since the older digest (episodes/17-next/RULES-DIGEST.md, 2026-11-06)
- **Added QA row:** "Glance test" (QA §2 Script; from Tập 8–10 result, commit 859d053).
- **Added Tập 8–10 data:** 3-Short test result in PERFORMANCE.md; the old "no render if voice > 32 s" rule is superseded by the 25–30 s base with punch at 70–85 %.
- **Resolved:** BANK gaps for Tập 6 and 7 are now rows 15–16 (commit 22b64ac); the old "MISSING from BANK" note is closed.
- **Changed:** auto-dubbing OFF (Tập 10) is now a keep. Posting slot 07–08 VN is still a test with no verdict.
- **Changed:** the title line now sits inside the panel (Tập 11 "POV: 2 minutes away"), consistent with PREPRODUCTION #21; still open vs JOKES §0.2 (C5).
- **Changed:** every Tập 8+ script is 25–30 s; Tập 3–7 (45–58 s) are no longer the model.
- **Still open:** C1 length (JOKES "length is free" vs QA "25–30 s"); C4 dialogue density (QA "5–8 lines" vs JOKES §0 "one voice from second 0"); C9 emotion (JOKES "nobody screams over a delivery" vs PREPRODUCTION "one explosion"). Decide by owner note, not by a new digest.
