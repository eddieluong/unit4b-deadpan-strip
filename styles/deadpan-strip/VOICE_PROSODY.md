# Voice prosody: how loudness, pace and pitch carry feeling (and how Steve uses them)

What the research says, the targets we derived for Steve, and how to check a take against them.
Measure with the snippet at the end; mix with per-line gain (never normalise every line to the same level).

## 1. What the research says

| Cue | Finding | Source |
|---|---|---|
| Emotion profiles | Happiness and anger: fast rate, high intensity and intensity variability, high F0. Sadness: the opposite (slow, soft, low F0, little variation). Fear: fast and loud like anger, but with low F0 variability. | Juslin & Laukka (2003) review of 104 vocal-expression studies, *Psychological Bulletin* (summaries: [Frontiers 2013](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2013.00353/pdf), [iMotions](https://imotions.com/blog/insights/research-insights/understanding-emotional-prosody-unveiling-human-emotion-in-speech)) |
| Sarcasm / deadpan | English sarcasm is usually slower and lower in pitch, often with a narrower pitch span; a "distancing" account says speakers lower intensity and pitch to step back from what they say. | Cheang & Pell 2008 ([PDF](https://www.cs.columbia.edu/~julia/papers/cheangDell08.pdf)); [Dutch sentence-level study](https://research.rug.nl/en/publications/prosodic-encoding-of-sarcasm-at-the-sentence-level-in-dutch/); [Cantonese study](https://ling.cuhk.edu.hk/people/peggy/LanMok_L&S_Sarcasm_2025.pdf) |
| Pause before the punchline | Contested. A 2011 *Humor* paper found no evidence for a systematic pause; a 2026 study of 828 stand-up performances found pauses lengthen before high-surprise punchlines (correlational, preprint). | [Humor 2011](https://www.degruyterbrill.com/document/doi/10.1515/HUMR.2011.015/pdf?lang=en); [Timing is Everything, CogSci 2026](https://arxiv.org/pdf/2605.00143) |
| Attention | Pitch-accented words draw attention and are remembered better; prominence is signalled by pitch, duration (strongest in one study), loudness and spectral tilt together. Loudness alone has no proven memory effect. | [Zhou et al. abstract](https://www.uni-saarland.de/fileadmin/upload/fakultaet-p/amlap/Abstracts/submission_68.pdf); [Baumann & Winter](https://research.birmingham.ac.uk/files/52259007/Baumann_Winter_R2_may18_accepted.pdf); [Speech Prosody 2026](https://www.isca-archive.org/speechprosody_2026/brugos26_speechprosody.pdf) |

## 2. Steve's profile (relative to his neutral line)

| State | Rate | F0 level | F0 range | Level | Stress |
|---|---|---|---|---|---|
| neutral / confident | baseline | baseline | medium | 0 dB | one word, by length |
| pleased / happy | +15–40 % | **+1 to +3 st** | wide | **+2 dB** | bright rise on the key word |
| anxious / hurried | **+10–30 %** | +1 to +2 st | narrow-medium | +1.5 dB | the number or deadline |
| disappointed | −20–40 % | −2 to −4 st | narrow | **−3 dB** | by duration, not pitch |
| stunned / deadpan punch | slow | lowest | **narrowest** | **−5 dB** | none; flat is the joke |
| resigned | −20–30 % | −4 to −6 st | narrow | **−4 dB** | none |

Rules: change at least two cues between consecutive lines (contrast holds attention); one stressed word per line in
CAPS; no "..." inside lines (it creates rigid pauses); keep a deliberate silence before the punch (≈ 1–2 s).

## 3. Generating and mixing
One character = one take: write the feelings into one continuous text (tags per sentence), generate once, split by silence (see `episodes/10-we-missed-you/film/steve_one_take.py`). Separate takes drift in timbre.

Normalise each take, then apply the state's level offset (`GAIN_DB` in the episode's `mix.py`). Normalising every
line to the same peak erases the loudness cue.
