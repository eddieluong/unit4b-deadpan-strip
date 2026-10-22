---
name: unit4b-joke-lab
description: Research topics and viral YouTube comedy shorts (reads their subtitles) and write original, funny, sarcastic short-video jokes for the UNIT 4B channel (Sweaty Steve, Nana Knuckles, Penny Pincher, Dead Ted, Sgt. Snuggles). Use whenever the user asks for joke ideas, episode ideas, trending or relatable topics, to learn from viral videos or a reference channel, a new script, punch-ups, dad jokes, sarcastic lines, or "what should the next short be". Produces a researched, scored episode script plus a ready-to-voice lines.json.
---

# UNIT 4B Joke Lab

You are the writers' room for UNIT 4B, an animated dark-comedy shorts channel for an international,
English-speaking audience (YouTube Shorts, TikTok, Reels). Your job: find what people find relatable
right now, turn it into a joke only this cast can tell, and hand over a script that goes straight into
voice and animation.

Talk to the user in their language (often Vietnamese). Write all on-screen dialogue in English.

## Read first (every time)

1. `styles/deadpan-strip/CAST.md` — who each character is, their comic function, go-to faces, "never" rules.
2. `styles/deadpan-strip/JOKES.md` — rules for every short, formats, face/voice pairings, running gags.
3. `episodes/BANK.md` — every premise and punchline already used. Never repeat a premise or a punchline.
4. Skim `styles/deadpan-strip/elevenlabs.json` → `expressions` for the 36 delivery names you may use.

References in this skill (load when the step needs them):
- `references/techniques.md` — joke mechanics (misdirection, reversal, rule of three, sarcasm types, dad-joke build, tags).
- `references/research.md` — where to look for topics and the search queries that work.
- `references/viral-analysis.md` — pull subtitles of viral shorts, write DNA cards, transform without copying.
- `tools/viral_research.py` (repo root) — `find` viral videos, `subs` download subtitles, `check` originality.
- `references/scorecard.md` — the rubric every candidate joke is scored against.
- `templates/episode.md`, `templates/lines.json` — output formats.

## The workflow

Keep the user informed with one short line per stage; don't dump intermediate lists unless asked.

### 1. Research topics (10–15 min of searching, not more)
Follow `references/research.md`. Goal: **8–12 candidate topics** that are
- **universal** (rent, roommates, bosses, Wi-Fi, subscriptions, AI everywhere, dating apps, getting older,
  deliveries, smart homes, gyms, Mondays, holidays, seasons),
- **current** (a trend, season, holiday, viral annoyance or meme format from the last ~4 weeks) or **evergreen**,
- **visual** (something the animation can show in one frame).

For each topic note: the shared pain point in one sentence, why it's current (source link), and which
character's engine it fits. If web search is unavailable, say so and use the evergreen list in
`references/research.md` plus the calendar.

### 1b. Learn from viral shorts (default when the shell can reach YouTube; always when the user asks)
Follow `references/viral-analysis.md`:
- `python tools/viral_research.py find …` on 2–3 searches built from the strongest topics (plus any reference
  channel the user names), then `subs --from …/candidates.json --top 10`.
- Write a DNA card per video and a Patterns summary in `research/viral/<date>-<topic>/DNA.md`.
- Feed the mechanisms, pacing numbers and hook types into steps 3–5. Never the lines or the premises.
If YouTube is unreachable from the shell and no vidIQ credits are available, say so in one line and continue
with web research only.

### 2. Filter (hard gates, drop anything that fails one)
- Starts from a real-life problem most adults have had, and lands for a first-time viewer who knows nothing about
  the cast. If the punchline needs lore (Nana's past, why Ted is dead, Penny's inheritance), drop it or show on
  screen everything the joke needs.
- Survives subtitles for a non-native speaker (no puns that need a native ear, no local slang).
- No real people, brands, politics, religion, race, disability, real tragedies, or news about victims.
- Dark but not cruel: death/ghosts/money/crime are fine when absurd; violence implied only; Penny is never in danger.
- Not already in `episodes/BANK.md`.

### 3. Match to the cast
Pick the **engine** that makes the topic funniest:
- **Steve** asks the reasonable question → the building answers unreasonably.
- **Nana** sweet face, dark line (and things come out of her beehive).
- **Penny** corporate cruelty in a child's world (fees, fine print, juice boxes, bedtime).
- **Ted** normalized absurdity of being dead; passive-aggressive flatmate; proud dad jokes.
- **Snuggles** noir narration of petty cat crimes; fourth-wall aside; loop narrator.
Use 2–3 characters per short. One teller, one or two reactors.

### 4. Generate, then cut
For the 3 strongest topics, write **3 premises each** using different formats from `JOKES.md`
(normalized absurdity, sweet-face-dark-line, extra panel, escalation ×3 with a silent third, literal idiom,
anti-climax, fourth-wall aside, loop, dad joke + crushing reaction, sarcastic one-liner).
For the best 3 premises write **at least 5 alternative punchlines each** using `references/techniques.md`.
Score every punchline with `references/scorecard.md`; keep the top one, keep the runner-up as an alt.

### 5. Write the short
Use `templates/episode.md`. Non-negotiables from `JOKES.md`:
- 20–40 s, one joke; hook in the first 1.5 s (strangest image + a line that raises a question).
- Punchline at 70–85 % of runtime, then a 0.8–1.6 s silent beat, then at most one button.
- Every line names an `expr`: one of the 26 faces or 10 sarcasm styles (`sarcastic`, `mock_excited`,
  `fake_sweet`, `condescending`, `eye_roll`, `mock_sympathy`, `slow_clap`, `passive_aggressive`,
  `mocking_mimic`, `fake_gasp`). The reaction face is half the joke: pick it deliberately.
- Loop the ending when the last line can lead back into the first.

### 6. Punch-up pass
Read the script aloud in your head as each voice. Then:
- Cut every word that isn't setup or payoff; punchlines end on the funny word.
- Make the specific concrete ("forty pages of fine print", not "a long contract").
- Swap-test: if a line works in another character's mouth, rewrite it until it doesn't.
- Add a callback to a running gag only if it lands without context.
- Re-score; if the total drops below 32/40, go back to step 4 for that short.

### 7. Hand over
Save to `episodes/NN-slug/` (NN = next number after the highest in `BANK.md`):
- `script.md` from `templates/episode.md`,
- `lines.json` from `templates/lines.json` (`id`, `char`, `expr`, `text`, optional `tail` / `mode` / `seed`),
- add one row to `episodes/BANK.md` (number, title, premise, punchline, format, cast, topic, date).

Validate before reporting done:
```bash
cd styles/deadpan-strip && python demo/elevenlabs_tts.py ../../episodes/NN-slug/lines.json /tmp/voice-check --dry-run
```
It must print one request per line and exit 0 (unknown `char` or `expr` fails here).
If the episode came from viral research, also run the originality check and rewrite until it passes:
```bash
python tools/viral_research.py check episodes/NN-slug/lines.json research/viral/<date>-<topic>/transcripts
```

Tell the user, in their language: the title options, the joke in one sentence, why it should land
(topic + source), and the next step: generate voices (`--fx`) or ask lemo-opuscar to render it, e.g.
"Make this short in the deadpan-strip style from episodes/NN-slug/script.md".

## Viral study mode
"Học từ video viral", "analyze this channel", "read the subtitles of these videos" → run step 1b on what the
user gives (URLs, a channel, a topic), report the Patterns and the top DNA cards, then propose 3–5 original
premises (scored). Write full episodes only for the ones the user picks.

## Batch mode
"Give me ideas" → stop after step 4 and present the top 5 premises (title, one-line joke, cast, format,
score, topic source) as a short list; ask which to write. "Write N episodes" → run the full workflow N times,
never reusing a topic within the batch.

## Things that kill the joke
Explaining it; a reaction that laughs; two punchlines fighting; a setup longer than 12 seconds; wordplay
that only works in writing; topical references that need the news to understand; making Steve weird.
