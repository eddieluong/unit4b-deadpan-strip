# Tập 11 — Two Minutes Away: voice (round 1)

Pipeline: `film/voice_gen.py` (adapted from Tập 10): ElevenLabs v3, 2 seeds (1809, 2718) per take, Whisper-split into lines, atempo from `film/speeds.json`,
per-line dB trim (`GAIN` in the script), auto-pick (better ASR, else tighter; punch s9 = quieter). Picks recorded in `film/choice.json`.
Voices (sweetkurt workspace, current `voice_id`): Steve `LOYCqPiwanfdLVO55I4W`, Nana `24qXy78DXDNKGKMxVGhR`, Snuggles `nPczCjzI2devNBz1zQrb` (Brian). Plain mode, no clone.
Takes: `steve` (s1,s3,s4,s5,s9; stability 0.35), `steve_peak` (s7 alone; stability 0.0, the only one), `nana` (speed 0.9), `snuggles`.
Rebuild: `HF_HUB_OFFLINE=1 ~/lemo-opuscar/.venv/bin/python film/voice_gen.py`. Alternates: `film/voice/<id>_t<seed>.wav`.
Preview: `film/out/voice_preview.mp3` (about -14 LUFS, silent beats = silence, no ping sfx).

| Line | Voice | Pick (seed) | Dur (s) | Whisper match | LUFS | Note |
|---|---|---|---|---|---|---|
| 1 Two MINUTES. | Steve | 2718 | 2.02 | 1.00 | -24.2 | hollow whisper |
| 2 He said that an HOUR ago. | Snuggles | 1809 | 1.70 | 1.00 | -20.0 | tighter than 2718 (2.20) |
| 3 Why is he going LEFT? | Steve | 1809 | 1.91 | 1.00 | -20.5 | |
| 4 Fine. I'll WAIT. | Steve | 2718 | 1.83 | 1.00 | -23.4 | |
| 5 It's STILL two. | Steve | 1809 | 1.59 | 0.91 | -24.9 | Whisper hears "to" (spelling only); 2718 was 0.84 |
| 7 FOOD! (PEAK) | Steve | 1809 | 1.24 | 1.00 | -18.6 | loudest line, stability 0.0 |
| 8 It's still WARM, dear. | Nana | 2718 | 2.74 | 1.00 | -20.3 | slow, cosy (speed 0.9, atempo 0.92) |
| 9 Enjoy. (PUNCH) | Steve | 1809 | 1.28 | 1.00 | -25.7 | quietest; "…Enjoy." rendered as plain "Enjoy." + [flat, low, slow], atempo 0.85 (2718 was 2.12 s raw, ASR 0.83) |
| 10 So he ordered AGAIN. | Snuggles | 2718 | 2.01 | 1.00 | -20.5 | dry noir |

Not voiced: 6 ping, 5b, 7b.

## Timing
Pauses (script "Pause after", silent beats folded in): s1 .2, s2 .3, s3 .2, s4 .3, s5 1.3 (.2 + 5b 1.0 + ping .1), s7 1.0 (.2 + 7b .8), s8 .8, s9 .7.
- Total speech: 17.4 s (sum of lines). Speech block incl. pauses: 21.06 s (first word to end of s10).
- Punch (s9) starts 17.13 s; with the planned 2.0 s end hold the film is ~23.1 s, punch 74 %.
- vs the 27 s plan (punch 20.4 s, 77 %): about 3.9 s short, mostly because the ping notification (held 1.0 s) and the Nana pan / push-outs are not padded. Adding ~1.0 s ping hold, ~1.0 s after s8 and a ~2.5 s button hold gives ~27 s with punch ~19.3 s (71 %); to hit 77 % stretch the pauses before s9 by ~1.3 s. Decide at the picture lock.

Not listened to by ear: checks were Whisper text, durations and LUFS (peak line s7 loudest, punch s9 quietest).
