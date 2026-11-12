# Tập 10 — Good Morning: voice v1 (gate 3)

Pipeline: `film/voice_gen.py` (Tập 9 method: one ElevenLabs v3 take per character per seed, seeds 1809 and 2718, Whisper-split
into lines, per-line atempo from `film/speeds.json`, fades, auto-pick by transcript match then tightest; punch = quieter take).
Voices read from `styles/deadpan-strip/elevenlabs.json`: Snuggles `nPczCjzI2devNBz1zQrb` (Brian, premade), Steve = **clone** (below).
WAVs are git-ignored: rebuild with `HF_HUB_OFFLINE=1 ~/lemo-opuscar/.venv/bin/python episodes/19-good-morning/film/voice_gen.py`
(`HF_HUB_OFFLINE=1` stops faster-whisper hanging on a Hugging Face check; takes are re-generated only if `voice/take_*_<seed>.wav` are missing).
Alternate takes: `voice/<id>_t<seed>.wav`; override a pick via `film/choice.json` {"s9": 1809}.
Text (no "...", numbers as words, one CAPS word per line): Steve `[groggy, disbelieving]`, `[betrayed, whining]`, `[resolute, flat]`,
`[flat, tired]`, `[louder, strained]`, `[desperate, shouting]`, `[flat, quiet, defeated]`; Snuggles `[flat, noir]` / `[dry, noir]` / `[dry, flat]`.
Not voiced (on-screen text / sfx): the "Mom / Auntie / Grandma added you" notifications, Grandma's "Steve? Are you okay?", pings.

## Steve voice (new ElevenLabs account)
The old Voice-Design voice `Y9z2nW5YxRRbI3XaIf8x` does not exist on the new account (kept as `steve.voice_id_old`). Steve is now an
**Instant Voice Clone**, id `prNYC4dAg4xnMXOGf79f` ("Steve – UNIT 4B (clone)"), made 2026-11-12 from ~69 s of his old lines
(Tập 8 take, Tập 9 takes, 10 expression samples from `bible/audio/steve_*.mp3`). Compare old vs clone on Tập 9 "Okay. Nobody MOVE.":
`film/voice/compare_steve.wav` (old `18-next s2.wav`, 0.6 s silence, clone; both -14 LUFS), script `film/compare_steve.py`.
**The owner should judge by ear.** If the clone is off, fix by re-cloning with different samples, not by rewriting the lines.

| # | Speaker | Line (CAPS = stress) | File | Dur (s) | Speed | Take | Why |
|---|---|---|---|---|---|---|---|
| 1 | Snuggles | Six A.M. The family group chat woke UP. | `s1.wav` | 3.37 | x1.00 | 1809 | tighter (3.37 vs 3.99 s raw) |
| 2 | Steve | Why are they all AWAKE? | `s2.wav` | 2.07 | x1.00 | 1809 | tighter (2.07 vs 2.46) |
| 3 | Steve | I deleted my PHOTOS for this. | `s3.wav` | 2.89 | x1.00 | 2718 | near tie, slightly tighter |
| 4 | Steve | That's it. I'm LEAVING. | `s4.wav` | 2.03 | x1.00 | 1809 | tighter (2.03 vs 2.56) |
| 6 | Steve | No. | `s6.wav` | 0.74 | x1.00 | 1809 | tighter, flat |
| 6b | Steve | NO. | `s6b.wav` | 0.93 | x1.00 | 2718 | tighter |
| 7 | Snuggles | Nobody leaves. They ADD you back. | `s7.wav` | 2.61 | x1.00 | 2718 | tighter |
| 8 | Steve | Stop BLOOMING! (the one peak) | `s8.wav` | 1.84 | x1.00 | 2718 | tighter |
| 9 | Steve | Good morning. (PUNCH, flat) | `s9.wav` | 1.37 | x0.90 | 2718 | quieter take (alt 1809 is 0.98 s raw) |
| 10 | Snuggles | By Tuesday, he was SENDING them. | `s10.wav` | 2.00 | x1.00 | 2718 | tighter |

Whisper heard every line correctly in both seeds (s1 "6 a m" is just spelling). Picks are automatic; I could not listen.

## Timing (preview = lines + the script's pauses; silent beats folded in: 4b+ping+"Mom added you" 2.5 s after s4, 1.0 s after each of 6/6b, 8b 1.3 s after s8, 0.7 s before s10)
| Version | Total | Punch (s9) starts | Punch % |
|---|---|---|---|
| `voice/preview.wav` natural, no extra holds, -14.0 LUFS | 27.45 s | 23.38 s | 85.2 % |

Speech alone is 19.85 s (16.48 s before the punch). The lines run longer than the script estimate (punch was planned at 20.6 s), so a 27 s film
with the punch at 76–78 % needs the punch at ~21.0 s: that means cutting 2.4 s before it. Two ways, pick one:
- **A (keep lines natural):** punch stays at 23.4 s, add ~2.9 s of picture hold after it (reaction hold on the face 1.0 s + button 3.0 s instead of 2.0 s + a 1.0 s end-loop hold)
  -> total ~30.3 s, punch 77 %. Under the 32 s cap, but over the 25–30 s base.
- **B (tighten, then hold the end):** atempo x1.05 on s1, s3, s7 (-0.5 s; no change to s8 peak or s9), pauses 4b 2.5 -> 1.8 s, 6/6b 1.0 -> 0.8 s each, 8b 1.3 -> 1.0 s (-1.6 s)
  -> punch ~21.3 s; then ~2.0 s of hold after s10 (button picture, frame-1 match cut) gives total ~27.5 s, punch 77 %.
No re-voicing needed for either: edit `ORDER` / `speeds.json` and re-run (takes are cached).
