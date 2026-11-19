# RULES DIGEST for Tập 13 (compiled 2026-11-19 from the files named in each bracket)

Model: `episodes/21-next/script.md` (Tập 12, On Empty). Tập N = BANK row N+9. Conflicts are listed in section 5, not resolved.

## 1. Hard rules (script / picture / voice / motion)
- **Script:** 25–30 s base, 40 s max; punch at 70–85 % (Tập 12 ~78 %); button ≤ 4 s after it, or none. [QA Script; PERFORMANCE 3-Short]
- **Script:** one joke, one everyday problem a first-time viewer gets with zero lore; read it aloud with no pictures first. [JOKES §0.1, §1; QA Before writing]
- **Script:** the premise is a judgement in ≤ 2 s; the cause stays hidden until the punch; new information every 2–3 s. [JOKES §0.3; QA retention map]
- **Script:** one emotion peak only (intensity 4, 2–5 s, in the scene); 5–8 short muttered lines; no lines from animals (Snuggles narrates only). [PREPRODUCTION §3, #18; QA Script]
- **Script:** every number in a reveal matches the premise (Tập 12: the tank reads 0.12, not 0.00). [Tập 12 script self-review v2]
- **Script:** every rule the joke needs is shown or said in an earlier row; no brand, celebrity, currency symbol, real place or country; no real profanity (bleep + grawlix). [PREPRODUCTION §2, §4; JOKES §1]
- **Vehicles (Tập 12):** helmet on in every shot; coasting only on an empty road, no unsafe riding. [Tập 12 script]
- **Picture:** frame 1 = the telling image with a face and the premise line from 0.0 s; no title card; title baselines y ≈ 230 / 290, art from PY 320, captions y ≈ 1500. [PREPRODUCTION #19, #21]
- **Picture:** a new shot or move every ~1.5–2.5 s; no character still > ~1 s; silent beats 0.6–1 s on a face, never an object alone > 3 s; faces ≥ 25 % of frame. [QA Picture; PREPRODUCTION #9, #17, #20]
- **Voice:** one take per character; gaps: setup→payoff 0.3 s, before laugh 0.45, after joke 0.7, before punch 0.8. VO is not lip-sync. [PREPRODUCTION #13, #15–16]
- **Voice:** stability ~0.35 natural, 0.5 narrator, 0.0 only for the one real peak; one CAPS stress word per line; captions burned in. [QA Voice; JOKES §1]
- **Sound:** music stops dead at or before the punch; −14 LUFS ±0.5, true peak ≤ −1.2 dB. [QA Sound]

## 2. QA gates (run in order, stop at the first fail)
- [ ] **Glance test:** frame 1 understood in 0.2 s without reading: one big number or icon next to a face. Tập 8–10 opened on a phone; Tập 12 on a gauge (non-phone). A line of text is not a hook. [QA Script; PERFORMANCE 3-Short]
- [ ] **Logic check:** each number and object in the reveal agrees with the premise. [Tập 12 self-review]
- [ ] Hook in 1.5 s: frames 0.0 / 0.5 / 1.0 s differ; `tools/qa_video.py --punch <s>` passes. [QA Script]
- [ ] Read aloud with no pictures: still funny; `asr_check.py`: every word heard. [JOKES §0.1; QA Voice]
- [ ] Contact sheet every 2 s; title clear of the top ~170 px. [QA Picture]
- [ ] Owner gates: script table + emotion arc → 3 stills → voice take → full render. No fix-after-render loops. [PREPRODUCTION §5]

## 3. Data: keep and test
- **Keep:** 25–30 s base (viewed 57 → 74 → 80.7 % for Tập 8–10); auto-dubbing OFF; one Short a day; post every Short on Instagram (1.7–2.5 K views, all non-followers). [PERFORMANCE 3-Short]
- **Bottleneck:** stayed (target ≥ 50 %) is the only failing metric: Tập 8 31.9 %, Tập 9 47.2 %, Tập 10 28.1 %. The first second decides.
- **Test (carried):** glance hook, one variable. Tập 11 introduced it, Tập 12 kept it. Tập 13 keeps it; do not change the hook until a read says so. [PERFORMANCE 3-Short]
- **Pending:** Tập 11 48 h (posted 2026-11-18, BANK row 20; no PERFORMANCE entry yet). Tập 12 48 h: YouTube is still a private draft (commit 548524d), IG reel is live; the clock starts when the YouTube Short goes public.
- **Open, not decided:** posting slot 07–08 VN (Tập 9 was 75 % VN). Subscribers are not a goal yet (0 from ~3,000 views).

## 4. Used topics and mechanisms (avoid repeating)
- **Used topics:** BANK rows 01–21 (apartments, thermostat, safety, landlords, 3 a.m. fridge, burnout, dad jokes, neighbour gifts, missed delivery, DST, self-checkout, storm panic-buying, Halloween, early Black Friday, doomscrolling, typing dots, phone battery, family chat, delivery ETA, fuel on empty).
- **Last 4 episodes:**

| Tập (BANK) | Frame 1 opener | Reveal | Punch shape | Loop |
|---|---|---|---|---|
| 9 One Percent (18) | phone: "1 %" | the cat caused it all | escalation ×3, reveal | yes |
| 10 Good Morning (19) | phone: group chat | none (escalation ×3) | flat "…Good morning." | no |
| 11 Two Minutes Away (20) | phone: "2 MIN" | neighbour eats the order | flat "…Enjoy." | yes |
| 12 On Empty (21) | non-phone: gauge on E | gauge reads full (0.12) | callback question "…Since TUESDAY?" | yes |

- **Avoid for Tập 13:** a phone-screen opener (3 of the last 4); cat reveal (BANK 11, 14, 18); a one-word or two-word flat tag (Tập 10, 11); a callback-question punch again (Tập 12); escalation ×3 by default; a loop whose button repeats the opening line; hours or days as the hook (BANK 14, 16, 17).
- **Keep:** non-phone glance frame (object + face); planted-word payoff as a method (Tập 6, stayed 46.8 %), with a new punch shape; flat delivery of the punch.
- **Candidates left (21-next/IDEAS.md, not chosen):** Nine Hours (phone, needs rework); Only 1 Left! (text hook fails the glance test, overlaps BANK 15); Unknown Number (phone, twist guessable); Six O'Clock (non-phone alarm, check overlap with BANK 11).

## 5. Changes since the Tập 12 digest (episodes/21-next/RULES-DIGEST.md, 2026-11-18)
- **BANK:** row 21 On Empty added (commit 548524d). Row 20 Two Minutes Away was already there.
- **Added:** reveal logic check (§2) and vehicle safety (§1). Test variable unchanged.
- **Still open:** C1 length (JOKES "length is free" vs QA "25–30 s"); C4 dialogue density (QA "5–8 lines" vs JOKES "one voice from second 0"); C9 emotion (JOKES "nobody screams over a delivery" vs PREPRODUCTION "one explosion"). Decide by owner note, not by a new digest.
