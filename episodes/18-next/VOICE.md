# Tập 9 — One Percent: voice v1 (gate 3)

Pipeline: `film/voice_gen.py` (Tập 8 method: one ElevenLabs v3 take per character, Whisper-split into lines, per-line
atempo speed from `film/speeds.json`, fades). 2 takes per character (seeds 1809, 2718, 5 lines each, ~4 cheap API calls).
Voices: Steve `Y9z2nW5YxRRbI3XaIf8x`, Snuggles `nPczCjzI2devNBz1zQrb` (from `styles/deadpan-strip/elevenlabs.json`).
WAVs are git-ignored (`episodes/*/film/voice/*.wav`): rebuild with `~/lemo-opuscar/.venv/bin/python episodes/18-next/film/voice_gen.py`
(takes are re-generated only if `voice/take_*.wav` are missing). Alternate takes: `voice/<id>_t<seed>.wav`; override a pick via `film/choice.json` {"s9": 2718}.
Text (no "..." , numbers as words): Steve tags `[hushed, panicked]`, `[pleading, whispering]`, `[desperate, straining]`, `[relieved, quick]`, `[flat, polite, dead inside]`; Snuggles `[flat, noir]` / `[dry]`.

| # | Speaker | Line (CAPS = stress) | File | Dur (s) | Speed | Take | Why |
|---|---|---|---|---|---|---|---|
| 1 | Snuggles | One percent. One message. One MAN. | `s1.wav` | 2.89 | x1.10 | 2718 | tighter (3.18 vs 3.71 s raw); both flat |
| 2 | Steve | Okay. Nobody MOVE. | `s2.wav` | 2.47 | x1.00 | 2718 | tighter, ASR identical |
| 3 | Steve | It's THIS close. | `s3.wav` | 1.82 | x1.00 | 2718 | tighter |
| 4 | Snuggles | The other socket was behind the fridge. Of COURSE. | `s4.wav` | 3.03 | x1.05 | 1809 | tighter by 0.1 s (near tie) |
| 5 | Steve | Come ON! | `s5.wav` | 1.29 | x1.05 | 1809 | tie on length; ASR identical |
| 6 | Snuggles | Two percent. He felt RICH. | `s6.wav` | 2.46 | x1.00 | 1809 | tie, slightly tighter |
| 7 | Steve | On my WAY. | `s7.wav` | 1.07 | x1.08 | 2718 | quicker (1.15 vs 1.27 s raw) = relief, quick |
| 9 | Steve | Thank you. (PUNCH) | `s9.wav` | 0.67 | x0.90 | 1809 | quieter, flatter take (alt 2718 is 1.11 s, more drawn out) |
| 10a | Snuggles | Plan B ran in the FAMILY. | `s10a.wav` | 1.66 | x1.00 | 2718 | tighter |
| 10b | Snuggles | The backup was ALSO at one percent. | `s10b.wav` | 2.40 | x1.00 | 1809 | near tie |

Takes were picked automatically (Whisper transcript match, which was equal for all, then shortest = tightest; for the
punch the quieter take). I could not listen, so the owner should judge by ear; the alternates are in `voice/<id>_t<seed>.wav`.

## Timing (preview = lines + the script's pauses; silent beats 4b 0.8, 7b 1.0, 8 0.6 folded into pauses)
| Version | Total | Punch (s9) starts | Punch % |
|---|---|---|---|
| `voice/preview.wav` (10a), -14.3 LUFS, peak -1.5 dB | 22.25 s | 19.23 s | 86.4 % |
| `voice/preview_10b.wav` (10b), -14.4 LUFS | 22.99 s | 19.23 s | 83.6 % |

Speech alone is 19.4 s (10a). Script estimate was 27 s with the punch at 20.6 s (78 %). Our punch lands about 1.4 s
earlier in absolute time and the voice track ends at 22.3 s, so the film can run to ~27 s by holding the pictures
(frame 1 before the first word, a longer power-down beat 8, a longer button after line 10) which moves the punch back
towards 78 %. Never above 32 s. Lines are at natural speed (x1.0 to x1.1); more air can be added without re-voicing.
