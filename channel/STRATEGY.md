# UNIT 4B — channel improvement plan (2026-10-26)

Built from: `channel/PERFORMANCE.md` (Tập 1: 1.3K views, 45.5 % viewed, swipe at ~0:18, 8 likes, 0 comments),
`research/viral/2026-10-26-motion/NOTES.md` (motion study), `research/viral/2026-10-26-storytelling/`
(TRANSCRIPTS, CHANNELS, LITERATURE, SCRIPTS) and the user's notes on Tập 1–2 (stiff, hard to follow, too much assumed).

## 1. Diagnosis — why the first two shorts underperform
| Problem | Evidence | Root cause |
|---|---|---|
| Viewers leave mid-video | 45.5 % viewed, swipe ~0:18; swipes cluster when the payoff is guessable (Dashlet, NSDI 2023) | hook gave away the ending; 5–6 s stretches with nothing new |
| Feels stiff | user, twice; still frames 24–59 % of seconds | static art asked to carry silent stretches |
| Too little said | 1.2–1.3 words/s vs 2.2–3.7 for the references | "show, don't say" swung too far for this art style |
| Hard to follow | user: "where does the extra hour come from?", frames unclear | assumed rules/culture; shots that don't read at phone size |
| No conversation | 0 comments | nothing for the viewer to answer |
| Slow production | Tập 1: 8 versions, Tập 2: 4 | each episode hand-builds sets, timing and fixes |

## 2. Content strategy
**Positioning (unchanged):** small everyday disasters, told by a normal tired adult (Steve), with a deadpan cat (Snuggles).
**Change:** voice-led "illustrated radio" (JOKES.md §0): one opinionated voice ~2.5 words/s from second 0, a picture per
sentence, a laugh every 5–8 s, a turn at 12–18 s, an ending that reframes and loops.

**Three repeatable series** (recognisable formats make each new short easier to write, draw and recognise):
| Series | Engine | Title pattern | First episodes |
|---|---|---|---|
| **Steve vs. Everyday Machines** | Steve, first person, vs. one thing that should be simple | "The self-checkout thinks I'm a criminal" | Self-checkout · Wi-Fi only works in one corner · 2-factor code · printer · smart speaker |
| **Snuggles' Human Documentary** | the cat narrates Steve like wildlife; Steve answers in two words | "Documentary: the human tries to leave the house" | Leaving the house · the gym · "just one episode" · Monday |
| **Seasonal** | the same voice-led format on a dated moment, with the rule shown on screen | "POV: you get an extra hour of sleep" | The Extra Hour (1 Nov) · New Year's resolutions · Black Friday · holiday family call |

Cast lore (Penny the 8-year-old landlord, Dead Ted, Nana) appears only as a background gag that needs no explanation,
until the channel has an audience that knows them.

## 3. Script standard (checked before any production)
1. Funny with the screen off (read aloud, no pictures).
2. 70–90 words for ~30 s; first sentence = premise as a judgement, ≤ 2 s.
3. Beat sheet: hook 0–2 s · setup 2–8 · escalation list 8–15 · **turn 12–18** · drift/false hope · punch at 75–85 % · button that loops.
4. One planted detail in the first 3 s that pays off at the end.
5. Concrete, international words (numbers, objects, times); no idioms, no puns; any custom explained on screen.
6. Every sentence names its picture (one still per sentence; a cutaway drawing for each exaggeration).
7. Score with `references/scorecard.md` ≥ 32/40, then the QA script checklist.

## 4. Production (to get from ~2 days to < 1 day per short)
- **Storyboard-driven film**: write the script as a table (line → picture); a generator lays out shots on the word timings
  from the voice take (each sentence = a shot, cut on the first word), so timing never needs hand-tuning.
- **Still library**: reusable sets (bedroom from the foot of the bed, kitchen, front door, supermarket, desk, bathroom)
  and Steve poses already drawn with the motion layer v2; new episodes mostly assemble.
- **Voice**: one take per character (as now), ~2.5 words/s, then split; ASR check.
- **QA**: `qa_video.py` + contact sheet every 1 s + the new readability item ("would a viewer with no context understand
  this frame?") before the user sees anything.

## 5. Publishing and packaging
- **Cadence** (user, 2026-10-26): a new short every 2–3 days, posted as soon as it passes QA and review. Same day on YouTube, Facebook, Instagram.
- **Time**: 17:00–20:00 US Eastern (05:00–08:00 VN) on weekdays; seasonal ones on the morning of the day.
- **Title** = the situation in ≤ 50 characters, spoken in the first line too.
- **First frame** = the premise picture with the first word already on screen (no title card, no silence).
- **Pinned comment / caption question** the viewer can answer from their own life ("What's the most expensive banana you've ever bought?").
- **Engagement**: reply to every comment in the first 2 hours; turn good comments into future premises.

## 6. Measurement — one change at a time
| Video | Variable tested | Compare with |
|---|---|---|
| Tập 2 (A: Extra Hour, voice-led) | voice-led density 2.5 w/s vs 1.2 | Tập 1 avg % viewed and swipe point |
| Tập 3 (B: Self-checkout) | evergreen international topic vs seasonal | Tập 2 |
| Tập 4 (C: Leaving the house) | Snuggles-narrated series vs Steve first person | Tập 3 |
| Tập 5–6 | title/first-frame variants on the winning format | — |
Targets (our own, not industry): avg % viewed > 60 % within three shorts; swipe point after 0:20; ≥ 5 comments.
Every video gets a `channel/PERFORMANCE.md` entry at 48 h and 7 d; rules that come out of it go into QA.md / JOKES.md.

## 7. Next 2 weeks
| When | What |
|---|---|
| Mon 26 Oct | Tập 2 voice-led (v5) done; post as soon as approved (EU clocks went back 25 Oct, US on 1 Nov) |
| Tue 27 – Wed 28 | produce Tập 3 (Self-checkout) with the voice-driven timeline; post ~28–29 Oct |
| Thu 29 – Fri 30 | Tập 1 + Tập 2 48 h post-mortems; produce Tập 4 (Leaving the house); post ~31 Oct |
| then | every 2–3 days; after Tập 4 review the 3-video test and pick the main series |
