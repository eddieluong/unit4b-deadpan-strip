# UNIT 4B — why views and "CTR" are low (diagnosis, 2026-11-06)

Sources: `channel/PERFORMANCE.md`, `channel/STRATEGY.md`, `styles/deadpan-strip/QA.md`, public data pulled with yt-dlp on
2026-11-06 (7 Shorts, channel UCfFgYzIDT28afga2jynBbKQ), a contact sheet of frames 0.05 s / 1.0 s / 2.5 s of every
released file, and the benchmarks in the `youtube` skill (`references/shorts-playbook.md`).
**No Studio export was available**, so stayed-to-watch, retention and impressions are known only for Tập 1–2.
Labels: **[O]** = observed in data, **[I]** = inferred, needs Studio data to confirm.

## 0. First: "CTR" is the wrong metric for this channel
All 7 uploads are Shorts, and Tập 2 got 97 % of its views from the Shorts feed [O]. In the feed there is no thumbnail and
no click: the video starts playing. YouTube judges a Short by **Viewed vs Swiped Away** ("stayed to watch") and
**average % viewed** (skill benchmark: ≥ 75 % stayed is good, < 50 % = broken hook; ≥ 70 % viewed gets pushed).
Impressions CTR and custom thumbnails matter only on the channel page, in search and in related videos, which is
a small slice for a channel with 6 subscribers. **"Low CTR" here means "most people swipe past in the first second."**

## 1. Public numbers (2026-11-06)

| # | Short | Length | Posted | Views | Likes | Like rate | Comments |
|---|---|---|---|---|---|---|---|
| 1 | The courier always comes when you go to the bathroom | 39.8 s | 24 Oct | 1.3K | 8 | ~0.6 % | 0 |
| 2 | POV: you get an extra hour of sleep | 47.3 s | 26 Oct | 686 | 6 | 0.9 % | 1 (ours) |
| 3 | The self-checkout thinks I'm a criminal | 58.1 s | 28 Oct | 1,238 | 14 | 1.1 % | 1 (ours) |
| 4 | Storm warning. Everyone buys toilet paper. | 55.7 s | 29 Oct | 1,412 | 17 | 1.2 % | 1 (ours) |
| 5 | I bought the Halloween candy a week early. | 50.4 s | 29 Oct | 1,244 | 16 | 1.3 % | 1 (ours) |
| 6 | Never wait for Black Friday. | 49.3 s | 2 Nov (YT) | 715 | 11 | 1.5 % | 1 (ours) |
| 7 | When the news says World War 3 is coming. | 45.6 s | 6 Nov | 85 (hours old) | 2 | — | 1 (ours) |

Channel: 6 subscribers, 0 playlists, no tags on any video [O].
Known Studio numbers: stayed-to-watch **17.3 %** (Tập 1) and **30.1 %** (Tập 2); average viewed 45 % and ~63 % [O].

**Pattern [O]:** every Short stops between ~700 and ~1,400 views, mostly on day 1, and none takes off. This is the size of
YouTube's first test audience (the "explore" phase); no Short has earned the second push. Zero viewer comments on
any video, like rate ~1 %.

## 2. Causes, ranked by evidence

### Cause 1 — The opening loses 70–83 % of viewers (retention/hook)  · evidence: strong
- [O] Stayed-to-watch 17 % and 30 %, against ≥ 75 % "good" and < 50 % "broken hook". That alone explains why each
  Short stalls at the test-audience size.
- [O] Contact sheet: in Tập 3, 4, 5 and 6 the picture at 0.05 s, 1.0 s and 2.5 s is almost the same frame (only the
  caption word changes). The feed gives about one second; what a swiper sees is a still drawing.
- [O] Frame 1 is a beige panel with the character small in the middle, a small black "POV: …" header on beige, and a
  muted palette. Faces fill roughly 5–10 % of the screen.
- [I] Rule #19 (frame 1 = funniest image with a face) is followed, but the image is too small, too calm and too similar
  in colour to read as "something is happening" at swipe speed. The rule fixed *what* is in frame 1, not *how loud* it is.
- [I] Whether rule #19 helped is unknown: Tập 3–6 stayed-to-watch was never read (see Cause 4).

### Cause 2 — Too long for one joke (retention/length)  · evidence: strong
- [O] Lengths: 39.8 → 47.3 → 58.1 → 55.7 → 50.4 → 49.3 → 45.6 s. The channel's own rule (QA.md row 8, JOKES.md) says
  25–30 s by default. Every Short since that rule is 50–95 % longer than it.
- [O] Average view duration 0:18 and 0:30. With a 25–30 s cut the same watch time would be 65–100 %+ viewed and
  could loop (avg > 100 %), which is what the feed rewards most.
- [O] Punch placed at 68–85 %, so in a 50–58 s Short the payoff lands at 35–48 s, after most viewers have left.

### Cause 3 — Topics are dated and the format has no recurring hook (topic demand / niche fit)  · evidence: medium
- [O] 5 of 7 topics are tied to a date or the news (extra hour, storm, Halloween, Black Friday, WW3 news). They decay
  within days, and Shorts already lose push after ~28–30 days, so they cannot pick up views later.
- [O] The two evergreen everyday topics (courier, self-checkout) are among the top three by views; the dated ones split
  both ways (storm 1.4K, Extra Hour 686, Black Friday 715). Too few videos to call this a trend [I].
- [I] "Relatable animated comedy" is crowded. With lore deliberately hidden (STRATEGY §2), nothing tells a viewer this is
  a series to follow: 6 subs after ~6.5K views (~0.1 % view-to-sub). The STRATEGY series ("Steve vs. Everyday
  Machines", "Snuggles' Human Documentary") are not visible in titles, frames or playlists.
- [I] No competitor benchmark has been done for this exact format (2D character comedy Shorts, 30–60 s).

### Cause 4 — The test loop is open: changes are made without reading results (process)  · evidence: strong
- [O] PERFORMANCE.md has 48 h numbers only for Tập 1–2. Tập 3–6 say "(read 30 Oct / 31 Oct / 1 Nov)" and were never
  filled. Each video changed several things at once (frame 1, topic, voice, length, loop ending, posting day).
- [I] So the channel cannot tell which changes helped. Seven videos went out without one confirmed lesson after Tập 2.

### Cause 5 — Cadence, timing and session chaining  · evidence: weak to medium
- [O] 7 Shorts in 14 days is good volume, but uneven: two on 29 Oct, Tập 6 on YouTube 3 days after FB/IG, 4-day gap
  before Tập 7.
- [O] Posting times (~10:40, 14:30, 16:30, 16:50 VN) = ~22:40–05:00 US Eastern, not the planned 17:00–20:00 ET. For
  Shorts the first test audience is chosen by the algorithm, so timing matters less than for long-form [I].
- [O] No playlists, no series name in titles, no end-screen equivalent (Shorts "related video" link not used [I]).
  Viewers who like one Short have no path to the next.
- [O] Tập 7's custom thumbnail did not upload. Low impact in the feed, visible on the channel grid.

### Not a main cause: titles and metadata
- [O] Titles are short, situation-first and relatable ("The self-checkout thinks I'm a criminal"). They are fine.
  Small fixes only: no tags (minor), and the "POV:" header in frame differs from the title [O], so the same idea is
  written twice in two wordings.

## 3. Action list

### A. Next video (do all of these; they enforce existing rules, they don't rewrite approved work)
1. **Cut to 25–30 s** (the rule already in QA.md / JOKES.md). If the script runs longer, cut setup, not the punch. Gate
   it in pre-production: no render if the voice take is over 32 s.
2. **Make the first second move and fill the screen.** At 0.0 s: the face fills ≥ 25 % of the frame (close-up of
   the strangest moment), one visible motion within 0.3 s (zoom punch, object flying, shake), and a picture change by
   1.0 s. Add a QA check: frames at 0.0 / 0.5 / 1.0 s must be visibly different.
3. **Make the opening text big.** Put the hook as large on-screen text (2–5 words, high contrast, inside the safe area),
   not a small header on beige. The title and the frame-1 text should be the same phrase.
4. **Evergreen everyday topic** (courier/self-checkout type), no date or news tie.
5. **Ask a question viewers want to answer** and pin it (pinning needs phone verification of the channel; do that once).
6. **Change one notch at a time.** For the next video the variable is *length* (25–30 s) together with the frame-1
   loudness fix only if the owner accepts both as one "hook package"; otherwise length first.

### B. On existing videos
- **Studio Test & Compare is not available for Shorts** (it runs on long-form thumbnails/titles) [I — confirm in Studio:
  Content → video → Edit → "Test & Compare"; if it is missing on Shorts, this is why]. So the existing Shorts cannot be
  A/B tested the usual way. Options:
  1. Edit titles on the two lowest (Tập 2 "POV: you get an extra hour of sleep" → evergreen phrasing; Tập 6) and watch
     for any second push over 7 days. Cheap, low expected effect (titles matter little in the feed).
  2. **Re-cut test:** make a 25–30 s, loud-opening re-edit of the best evergreen Short (Self-Checkout or Courier) and
     post it as a new Short ≥ 2 weeks later, with a different first frame. Compare stayed-to-watch with the original.
     This is the cleanest test of Causes 1–2.
  3. Use Facebook/Instagram as a test bench for two openings of the same Short before the YouTube upload.
- Set Tập 7's thumbnail by hand in Studio (channel grid only).
- Create two playlists that match STRATEGY's series (e.g. "Steve vs. Everyday Machines", "Seasonal") and add the 7 Shorts.

### C. Process
- Fill the 48 h rows for Tập 3–7 from Studio before the next script (needed to confirm or drop Causes 1–3).
- Read stayed-to-watch per video every time; it is the one number that decides reach.
- After the Studio export: if any Short is ≥ 50 % stayed, copy its opening pattern; if all are < 40 %, the first frame
  style itself (beige panel, small figure) is the bottleneck and needs a redesign test.

## 4. Data still needed (to finish the CTR/retention part)
YouTube Studio → Analytics → **Advanced mode** → **Content**, period **last 90 days**, one row per video, columns:
Impressions, Impressions click-through rate, Views, Average view duration, Average percentage viewed, Subscribers —
plus, for Shorts, **Stayed to watch / Viewed vs swiped away** and **Shown in feed** if the column picker offers them.
Export as CSV and save it in `data/analytics/` (e.g. `data/analytics/content-90d-2026-11.csv`). Also screenshot or note
the retention curve of Tập 3 (best evergreen) and Tập 6.
