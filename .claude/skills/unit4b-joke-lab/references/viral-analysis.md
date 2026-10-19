# Learning from viral shorts

Goal: understand **why** a viral comedy short works, then write an **original** UNIT 4B joke that uses the
same mechanism. We study structure, never copy content.

## 1. Collect

Preferred (free, runs on the user's machine):
```bash
pip install yt-dlp youtube-transcript-api
python tools/viral_research.py find --search "<topic> animated comedy" --search "<topic> relatable shorts" \
    --channel <reference channel URL> --shorts-only --limit 40 --out research/viral/<date>-<topic>
python tools/viral_research.py subs --from research/viral/<date>-<topic>/candidates.json --top 10
```
- Pick sources that match the channel: animated or sketch comedy shorts, relatable/sarcastic humor, 15–60 s.
- Rank by views and views/day; prefer videos that outperform their channel.
- If the vidIQ connector is available and has credits, `vidiq_outliers` (contentType "short") and
  `vidiq_video_transcript` do the same job; use them instead of the script when the shell has no YouTube access.
- If the user gives specific video URLs, run `subs` on those directly.
- If YouTube asks to sign in, add `--cookies-from-browser chrome` before the subcommand.
- Videos without captions are skipped; note how many were skipped.

## 2. Break each video down into a DNA card

Read `transcripts/<id>.md`. The `[t s · p %]` prefix shows where each line falls in the video.
For each of the top videos write a card in `research/viral/<date>-<topic>/DNA.md`:

```
### <video id> · <views> views · <duration>s
- Pain point: (the shared annoyance, one sentence, in your own words)
- Hook (0–2 s): what the first line/image promises — type: question / bold claim / visual absurdity / "POV:"
- Setup length: s · Punchline at: % · Button/tag: yes/no · Loop: yes/no
- Mechanism: (name from techniques.md: reversal, escalation ×3, literal idiom, status flip, fake praise, …)
- Who wins / who loses: (status move)
- Reaction beat: (what the face or silence does)
- Why it spreads: (quotable line? relatable to tag a friend? rewatch for a detail?)
- Title pattern: (e.g. "POV: …", "When your … ", "Me vs …")
- Our angle: (which UNIT 4B character's engine could carry this mechanism, and a different situation for it)
```
Then add a short **Patterns** section at the top of DNA.md: what most of the top videos share
(average punch position, hook types, mechanisms that repeat, title patterns, typical length).

## 3. Transform, don't copy (hard rules)

A new episode may take from a source video only: the **mechanism**, the **pacing numbers**, the **hook type**
and the **broad topic area**. Everything else must be new:
- **Different situation.** Change the concrete premise (not "landlord raises rent" → "landlord raises rent for a cat").
  Test: someone who saw the source would not say "that's the same joke".
- **Different words.** No line may share 5+ consecutive words with any transcript, except stock phrases
  ("per my last email", "are you kidding me"). Do not reuse a source's punchline even reworded.
- **Our characters only.** The joke must depend on a UNIT 4B engine (Penny's age, Ted being dead, Nana's
  menace, Snuggles' noir voice, Steve's normality); if it works without them, it's too close to the source.
- **No real names.** Never mention the source creator, channel or video in the episode.
- **One source mechanism per episode** at most; mixing two sources' surface details is still copying.

Before saving an episode made from viral research, run the originality check:
```bash
python tools/viral_research.py check episodes/NN-slug/lines.json research/viral/<date>-<topic>/transcripts
```
It must report no shared 5-word runs. Record in `episodes/BANK.md` which mechanism was borrowed (not the source).

## 4. Report to the user
In their language: the top patterns (3–5 bullets with numbers), the 3–5 strongest DNA cards (one line each:
views, mechanism, why it spreads), then the original premises you propose from them, each with its score.
Never paste transcript text into the reply beyond a few words needed to name a mechanism.
