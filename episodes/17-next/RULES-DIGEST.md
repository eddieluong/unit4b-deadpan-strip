# RULES DIGEST for the next UNIT 4B Short (Tập 8 onward)

Compiled 2026-11-06 from the files named in each bracket. Numbers are quoted as written in the source. Conflicts are listed in section 6, not resolved.

## 1. Hard rules for the script
1. Length 25–30 s; punch by ~22 s; no render if the voice take is over 32 s. [DIAGNOSIS §4.A.1]
2. One joke per Short; 40 s max. [QA §2 Script]
3. Start from an everyday problem; a first-time viewer must get it with zero backstory. [JOKES §1; QA §2 Before writing; PREPRODUCTION §1 #1]
4. Frame 1 = strangest or most telling image with a character's face, premise line from 0.0 s; no title-card opening, no silent first second. [PREPRODUCTION §1 #19; JOKES §0.2; QA §2 Script]
5. The hook asks, the punch answers; if the cold open shows the outcome, the cause stays hidden until the punch. [QA §2 Script]
6. Punchline at 70–85 % of runtime; then at most one button, ≤ 4 s. [QA §2 Script]
7. Something new every 2–3 s; a laugh or new fact every 5–8 s. [PREPRODUCTION §1 #7; JOKES §0.4]
8. A turn at 12–18 s (escalation or new problem). [JOKES §0.5]
9. Voice-led, one opinionated voice from second 0, natural pace, first person. [JOKES §0.2]
10. Show any rule (daylight saving, holiday, custom) on screen or in a line before the joke uses it. [PREPRODUCTION §1 #12; JOKES §0.12; QA §2 Before writing]
11. Voice-over is not lip-sync: lips move only for lines said inside the scene. [PREPRODUCTION §1 #13; JOKES §0.13]
12. Animals make only their sound (ElevenLabs sound generation) and body language; no lines. [PREPRODUCTION §1 #18]
13. After each story turn, a silent beat of 0.6–1 s on a face reaction; never an object alone for > 3 s. [PREPRODUCTION §1 #17]
14. One emotion peak (intensity 5) max, in the scene, 2–5 s; the punchline is said flat; never flat for the whole Short. [PREPRODUCTION §3; JOKES §1]
15. No real profanity: cut before the swear, 1 kHz bleep 0.6 s, grawlix "#@$%&!" on screen. [PREPRODUCTION §4]
16. A pose must read the beat at phone size: hiding = sitting against the wall, not lying flat. [PREPRODUCTION §1 #20]
17. Title stays below the phone safe area: baselines y ≈ 230 and 290 (1080×1920); art from PY 320; captions y ≈ 1500. [PREPRODUCTION §1 #21, §6]
18. Captions burned in on every line; one stressed word per line in CAPS. [JOKES §1; PREPRODUCTION §6]
19. Gaps by beat: setup→payoff 0.3 s, before laugh 0.45, after joke 0.7, time passing 0.6, before punch 0.8; narration at natural speed, never sped up. [PREPRODUCTION §1 #15, #16]
20. Universal topics; language that survives subtitles; no puns needing a native ear, brands, celebrities, local politics. [JOKES §1]
21. Dark never cruel; never punch down; Penny is never in danger. [JOKES §1]
22. Loop the ending to frame 1 when possible; end with a question viewers answer from their own life (pinned comment). [JOKES §1; QA §2 Delivery]
23. Use one running gag per episode at most. [JOKES §5]

## 2. Script table, gates and order
- Table columns (all required): # | Speaker | VO or in-scene | Line (caption text) | Emotion | Intensity 1–5 | Stressed word | Pause after (beat type) | Picture | Motion (and reason). [PREPRODUCTION §2]
- Table rules: VO vs in-scene decides lip-sync; picture readable with no context; motion only with a reason, else "hold"; every dependency-rule is in an earlier row. [PREPRODUCTION §2]
- Before writing: problem in one line with no character names; not already in BANK. [QA §2 Before writing]
- Gate 1: script table + emotion arc approved by owner (text only). [PREPRODUCTION §5.1]
- Gate 2: narrator/new voice auditioned, 3–4 options on the real line, approved. [QA §2 Voice]
- Gate 3: three key stills (hook, climax, ending) approved. [PREPRODUCTION §5.2]
- Gate 4: voice take listened once, approved; asr_check.py: every word heard. [PREPRODUCTION §5.3; QA §2 Voice]
- Gate 5: full render → tools/qa_video.py --punch → contact sheet every 2 s → QA checklist → owner review. [PREPRODUCTION §5.4; QA §2]
- Never fix-after-render loops; changes at render stage should be small. [PREPRODUCTION §5.4]
- After posting: entries at 48 h and 7 d in channel/PERFORMANCE.md; move new rules into QA.md/JOKES.md. [QA §2 Delivery]

## 3. QA checks that affect writing
- Hook in 1.5 s; frames 0.0 / 0.5 / 1.0 s must differ; visible motion by 0.3 s. [QA §2; DIAGNOSIS §4.A.4]
- Retention map: every 2–3 s window lists what is new; empty windows get cut. [QA §2 Script]
- No shot over ~3 s without a change. [QA §2 Picture]
- Faces: two-shot head ≥ 1/6 of frame height; 1.3× framing for rooms, 1.6× for reactions. [QA §2 Picture]
- Captions must not cover the punchline face. [QA §2 Picture]
- Music stops dead before or at the punchline. [QA §2 Sound]
- Internal pauses ≤ 0.6 s in a take. [QA §2 Voice]
- Watch the whole thing once as a viewer; fix the swipe point first. [QA §2 Delivery]

## 4. Jokes and topics already used (BANK.md)
- 01 The Listing: apartment "Ted is included" (normalized absurdity).
- 02 The Thermostat: thermostat wars, silent third beat (Ted running gag).
- 03 Walking Home: neighborhood safety, "I wasn't talking about me."
- 04 The Complaint: rent hike, "The hat was expensive."
- 05 3 A.M.: fridge cheese, noir loop.
- 06 Dying Here: job burnout, literal idiom.
- 07 For the Boos: ghost dad joke (Ted's puns).
- 08 Repair Plus: flood + repair subscription.
- 09 Welcome Gifts: neighbors' gift list.
- 10 We Missed You = Tập 1: missed delivery, day off.
- 11 The Extra Hour = Tập 2: daylight saving, cat on face.
- 12 Self-Checkout = Tập 3: "unexpected item" machine.
- 13 Storm Stock-Up = Tập 4: panic buying, toilet paper.
- 14 Halloween Candy = Tập 5: candy eaten early.
- MISSING from BANK: Tập 6 Early Black Friday (episodes/15-black-friday) and Tập 7 Last Day on Earth (episodes/16-last-day-on-earth). Not added; QA §2 says one row per episode. episodes/15-ideas.md not read.
- Topic pattern so far: seasonal and US rituals (Halloween, DST, Black Friday) and news anxiety (WW3, no real country). See conflict C7.

## 5. Lessons from the last 3 posted episodes
- Tập 5 Halloween Candy (50.4 s): 42 % viewed, 43.8 % stayed; frame 1 hiding pose under window worked per #19/#20; posted 2 days early; punch at 81 %.
- Tập 6 Early Black Friday (49.3 s): 57 % viewed, 46.8 % stayed (best so far); planted word + loop ending worked; punch at 85 %; US-only ritual.
- Tập 7 Last Day on Earth (45.6 s): 48 h numbers due 8 Nov, not yet read; planted word + loop; punch at 81.9 %; custom thumbnail did not upload via extension, set by hand.
- Pattern: all three ran 45–50 s, above the 25–30 s rule (C1); planted-word payoff and loop endings are the consistent pattern.
- Data still missing: retention curves of Tập 3, 5, 6; Tập 7 at 48 h; per-video geography [DIAGNOSIS §5].

## 6. Conflicts between files (not resolved)
- C1 Length: DIAGNOSIS §4.A.1 "25–30 s" and QA §2 "25–30 s by default (40 s max)" vs JOKES §1 "Length is free" and PREPRODUCTION §1 #16 "No length target"; PREPRODUCTION §1 #15 gives "≈ 75 words for 38 s".
- C2 Speech rate: PREPRODUCTION §1 #8 "~2.3–2.5 words/s" vs #15 and JOKES §0.2 "~2 words/s"; JOKES §0 also cites reference shorts at 2.2–3.7.
- C3 Voice stability: QA §2 "~0.35 natural, 0.5 narrator" vs PREPRODUCTION §3 bands "1–2: 0.5; 3–4: 0.3 (style 0.6); 5: 0.0".
- C4 Dialogue density: QA §2 and JOKES §1 "5–8 short lines, show don't say" vs JOKES §0 "voice carries the short, one voice from second 0"; JOKES §0 says it replaces the older calibration but QA was not updated.
- C5 Opening: QA §2 and PREPRODUCTION §6 use an on-screen title line ("POV: …") vs JOKES §0.2 "no title-card openings".
- C6 Gaps: PREPRODUCTION §1 #15 "~0.25–0.3 s between lines" vs #16 beat table (0.35–0.8 s).
- C7 Topics: DIAGNOSIS §4.A.2 "avoid US-only rituals (Black Friday, DST, Thanksgiving)" vs Tập 2, 5, 6 using them; DIAGNOSIS §4.B tests a "US-only topic" on purpose.
- C8 Face size: QA "head ≥ 1/6 of frame height" vs DIAGNOSIS §4.A.4 "face ≥ 25 % of frame" in the first second (different measures).
- C9 Emotion: JOKES §1 "nobody sobs or screams over a delivery" vs PREPRODUCTION §3 / §1 #14 "one explosion, 5, loud, with swearing" at the climax. Reconcile by stakes only if the owner agrees.
- C10 Records: QA §2 "one row per new episode" vs BANK.md missing Tập 6–7 (see §4).
