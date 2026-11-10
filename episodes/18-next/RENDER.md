# Tập 9 One Percent: render v1 (gate 4)
Output: episodes/18-next/film/out/one_percent_v1.mp4 (git-ignored). Contact sheet: film/out/contact_2s.png.

| Line | Start | End |
|---|---|---|
| s1 | 0.50 | 3.39 |
| s2 | 3.69 | 6.16 |
| s3 | 6.46 | 8.28 |
| s4 | 8.58 | 11.61 |
| 4b silent | 11.6 | 13.2 |
| s5 | 13.21 | 14.50 |
| s6 | 14.80 | 17.26 |
| s7 | 17.56 | 18.63 |
| 7b silent | 18.7 | 20.1 |
| 8 silent (power-down) | 20.1 | 21.2 |
| s9 PUNCH | 21.20 | 22.42 |
| s10a button | 23.12 | 24.78 |
Total 27.3 s, punch 77.7 %. Button 23.1 to 27.3 = 4.2 s (loop push-in tail included).

## QA (tools/qa_video.py --punch 21.2): PASS
duration 27.3 s; punch 77.7 %; no static >= 3 s; hook diff 67.0 (>= 4); first 1.8 s -16.3 dBFS; -14.0 LUFS, TP -2.8 dB.
## Weak spots
Button slightly over 4 s; 12.0 s under-table close-up crops the face; reflection on black phone is faint; cat/Steve overlap in table shots.

# v2 (5 self-review fixes) -> film/out/one_percent_v2.mp4
Total 27.0 s (FILM_TOTAL 27.3 -> 27.0), punch 21.2 s = 78.5 %, button 23.12 to 27.0 = 3.88 s. QA PASS: -14.0 LUFS, TP -2.8 dB, hook diff 67, no static >= 3 s.
1. 18.7-20.1 re-framed: whole head below the title; cat stands then stretches on the cable in 3 poses, drags the plug out; pop insert shows the cat.
2. 6.4-7.3 prone pose: head upright and inside frame, arm to plug, two fingers at the gap, cable on the floor.
3. Punch camera shifted so the whole cat (fedora, paw lick) is in frame.
4. Black-screen reflection: face (eyes, spiky hair) visible.
5. Button 3.88 s; loop push-in ends at 27.0 and still matches frame 1.
Sheets: film/out/contact_2s_v2.png, film/out/fixcheck_v2.png (frames 7.25, 19.3, 21.1, 22.0).
