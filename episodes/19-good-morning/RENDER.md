# Tập 10 Good Morning: render v1 (timing B)
Output: episodes/19-good-morning/film/out/good_morning_v1.mp4 (git-ignored). Contact sheet: film/out/sheet_v1.png. Re-render: `cd film && sh render.sh`.

| Line | Start | End |
|---|---|---|
| s1 | 0.00 | 3.22 |
| s2 | 3.52 | 5.42 |
| s3 | 5.72 | 8.21 |
| s4 | 8.51 | 10.32 |
| 4b silent (peace, birds) | 10.32 | 11.00 |
| Mom added you (ping) | 11.00 | 12.10 |
| s6 | 12.12 | 12.99 |
| Auntie added you (ping 13.0) | 13.00 | 14.45 |
| s6b | 13.79 | 14.48 |
| Grandma added you (ping 14.55) | 14.55 | 15.70 |
| s7 | 15.28 | 17.77 |
| s8 | 17.97 | 20.00 |
| 8b silent (soft ping 20.15, Grandma message) | 20.00 | 21.00 |
| s9 PUNCH | 21.00 | 22.26 |
| s10 button | 22.96 | 24.96 |
Total 26.96 s, punch 77.9 %. End hold 2.0 s (loop push-in matches frame 1).

## QA (tools/qa_video.py --punch 21.0): PASS
duration 27.0 s; punch 77.9 %; no static >= 3 s; hook diff 36.4 (>= 4); first 1.8 s -17.3 dBFS; -14.0 LUFS, TP -3.0 dB. 1080x1920, 30 fps.
## Weak spots (v1)
Thumb in the album and leave-group shots is a long plain bar; pour cards still overlap Steve's face in the close-ups at 1.4 s; Grandma bubble sits low in the 20.5 s insert; heart overlay crowds the 24 s phone; sfx are synthesised placeholders (pings, chirps).
