# Tập 10 — Good Morning: voice v2 (original voices, gate 3)

Pipeline: `film/voice_gen.py` (Tập 9 method: one ElevenLabs v3 take per character per seed, seeds 1809 and 2718, Whisper-split
into lines, per-line atempo from `film/speeds.json`, fades, auto-pick by transcript match then tightest; punch = quieter take).
Voices read from `styles/deadpan-strip/elevenlabs.json`: Snuggles `nPczCjzI2devNBz1zQrb` (Brian, premade), Steve = original Voice Design v3 `LOYCqPiwanfdLVO55I4W` (copied to the new workspace 2026-11-12; read from `steve.voice_id`).
WAVs are git-ignored: rebuild with `HF_HUB_OFFLINE=1 ~/lemo-opuscar/.venv/bin/python episodes/19-good-morning/film/voice_gen.py`
(writes `voice/preview.wav` at -14 LUFS; `HF_HUB_OFFLINE=1` stops faster-whisper hanging on a Hugging Face check; takes are re-generated only if `voice/take_*_<seed>.wav` are missing).
Alternate takes: `voice/<id>_t<seed>.wav`; override a pick via `film/choice.json` {"s9": 1809}.
Text (no "...", numbers as words, one CAPS word per line): Steve `[groggy, disbelieving]`, `[betrayed, whining]`, `[resolute, flat]`,
`[flat, tired]`, `[louder, strained]`, `[desperate, shouting]`, `[flat, quiet, defeated]`; Snuggles `[flat, noir]` / `[dry, noir]` / `[dry, flat]`.
Not voiced (on-screen text / sfx): the "Mom / Auntie / Grandma added you" notifications, Grandma's "Steve? Are you okay?", pings.

## Steve voice (original, copied to the new workspace)
Owner copied the original Voice Design voices to the new ElevenLabs workspace: Steve `Y9z2nW5YxRRbI3XaIf8x` -> **`LOYCqPiwanfdLVO55I4W`** (old id kept as `voice_id_old`).
Compare "[hushed, panicked] Okay. Nobody MOVE." (Tập 9 settings, seed 2718): `film/voice/compare_steve_orig.wav` = old Tập 9 `s2.wav`, 0.6 s, new-id line (both -14 LUFS), script `film/compare_steve_orig.py`.
Median F0 (autocorrelation tracker, octave errors possible): old 200 Hz, new-id 161 Hz; durations 2.47 s vs 3.28 s (new id reads slower/lower on this line). **The owner should judge by ear.**

| # | Speaker | Line (CAPS = stress) | File | Dur (s) | Speed | Take | Why |
|---|---|---|---|---|---|---|---|
| 1 | Snuggles | Six A.M. The family group chat woke UP. | `s1.wav` | 3.37 | x1.00 | 1809 | tighter (kept from v1, same voice) |
| 2 | Steve | Why are they all AWAKE? | `s2.wav` | 1.90 | x1.00 | 2718 | tighter (1.90 vs 2.34 raw) |
| 3 | Steve | I deleted my PHOTOS for this. | `s3.wav` | 2.59 | x1.00 | 2718 | tighter (2.59 vs 2.83) |
| 4 | Steve | That's it. I'm LEAVING. | `s4.wav` | 1.81 | x1.00 | 2718 | tighter (1.81 vs 1.98) |
| 6 | Steve | No. | `s6.wav` | 0.87 | x1.00 | 2718 | tighter (0.87 vs 1.04) |
| 6b | Steve | NO. | `s6b.wav` | 0.69 | x1.00 | 1809 | tighter (0.69 vs 1.02) |
| 7 | Snuggles | Nobody leaves. They ADD you back. | `s7.wav` | 2.61 | x1.00 | 2718 | tighter (kept) |
| 8 | Steve | Stop BLOOMING! (the one peak) | `s8.wav` | 2.03 | x1.00 | 1809 | tighter (2.03 vs 2.31) |
| 9 | Steve | Good morning. (PUNCH, flat) | `s9.wav` | 1.26 | x0.90 | 1809 | quieter take (alt 2718 is 0.97 s raw) |
| 10 | Snuggles | By Tuesday, he was SENDING them. | `s10.wav` | 2.00 | x1.00 | 2718 | tighter (kept) |

Whisper heard every line correctly in both seeds (ASR 1.00; s1 "6 a m" is spelling only). Picks are automatic; I could not listen. Alternates: `voice/<id>_t<seed>.wav`.

## Timing (preview = lines + the script's pauses; silent beats folded in: 4b+ping+"Mom added you" 2.5 s after s4, 1.0 s after each of 6/6b, 8b 1.3 s after s8, 0.7 s before s10)
| Version | Total | Punch (s9) starts | Punch % |
|---|---|---|---|
| `voice/preview.wav` natural, no extra holds, -14.0 LUFS | 26.73 s | 22.77 s | 85.2 % |

A 27 s film with the punch at 76–78 % needs the punch at ~21.0 s, i.e. cutting ~1.8 s before it.
- **A (keep lines natural, hold the end):** punch stays at 22.77 s; picture hold after s10 (ends 26.73 s) of ~2.9 s -> total ~29.6 s, punch 77 %. Over the 25–30 s base but under the 32 s cap.
- **B (tighten, then hold the end):** atempo x1.05 on s1, s3, s7 (-0.40 s; s8 peak and s9 untouched), pauses 4b 2.5 -> 1.8 s, 6/6b 1.0 -> 0.8 s each, 8b 1.3 -> 1.0 s (-1.4 s)
  -> punch 20.97 s, s10 ends 24.93 s; ~2.0 s end hold -> total ~26.9 s, punch 77.9 %.
No re-voicing needed for either: edit `ORDER` / `speeds.json` and re-run (takes are cached).

## Superseded: IVC clones (v1 and v2), unused
Clone v1 `prNYC4dAg4xnMXOGf79f` (owner: "a bit heavy"; kept as `steve.voice_id_clone_v1`) and clone v2 `VKJKY6ggD6l8lts8yILS` (lighter, too high, ~+4–6 semitones vs old; `steve.voice_id_clone_v2`) are fallbacks only.
Clone v1 outputs are in `film/voice/clone_v1/` (takes, s*.wav, preview, timeline; preview 27.45 s, punch 85.2 %); clone v2 outputs in `film/voice/v2/` (preview 25.17 s, punch 86.1 %).
Compare files: `compare_steve.wav` (old vs v1), `compare_steve_v2.wav` (old, v1, v2). `STEVE_CLONE=v2` in `voice_gen.py` still renders the v2 set.
