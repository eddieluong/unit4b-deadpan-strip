# UNIT 4B — performance log and post-mortems

One entry per video, written **48 hours after posting** (and updated at 7 days). Read the last three entries
before writing a new script. Rules that come out of an entry go into `styles/deadpan-strip/QA.md` (lessons table +
checklist) or `JOKES.md`, so they are enforced, not just remembered.

Where to read the numbers: YouTube Studio → Content → the Short → Analytics → Overview (views, average percentage
viewed, likes) and Engagement (audience retention curve, viewed vs. swiped away). Facebook: Page → Professional
dashboard → Content. Instagram: the Reel → View insights.

## Running summary

| # | Video | Length | Posted | Views 48 h | Avg % viewed | Viewed vs swiped | Likes | Comments | Subs | Swipe-away point | Main lesson |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | We Missed You (v8) | 39.8 s | 2026-10-24 | 1.3K | 45.5 % | 17.3 % stayed | 8 | 0 | 0 | ~0:18 | Hook gave away the ending; 0:14–0:21 had nothing new |
| 2 | The Extra Hour (v10) | 47.3 s | 2026-10-26 | 683 | ~63 % (0:30 of 0:48) | 30.1 % stayed | 6 | 1 (ours) | 0 | first seconds (70 % swiped) | Story now holds viewers (avg view 0:30 vs 0:18) but the opening loses 70 %: frame 1 was a phone notice + clock |
| 3 | Self-Checkout | 58.1 s | 2026-10-28 | 1,238 (lifetime, read 6 Nov) | ~48 % (0:28) | 38.7 % stayed | 14 | 1 (ours) | +2 | | frame 1 = arrest pose (rule #19); three voices; one peak (4) |
| 4 | Storm Stock-Up | 55.7 s | 2026-10-29 | 1,412 (lifetime, read 6 Nov) | ~57 % (0:32) | 40.9 % stayed | 17 | 1 (ours) | +2 | ~25 % gone by 0:07, 50 % by 0:28 | frame 1 = absurd result (paper-towel tower); punch at 68 % |
| 5 | Halloween Candy | 50.4 s | 2026-10-29 | 1,244 (lifetime, read 6 Nov) | ~42 % (0:21) | 43.8 % stayed | 16 | 1 (ours) | | | seasonal, posted 2 days early; hiding pose under the window; punch 81 % |
| 6 | Early Black Friday | 49.3 s | 2026-10-30 | 715 (lifetime, read 6 Nov) | ~57 % (0:28) | 46.8 % stayed | 11 | 1 (ours) | | | planted word payoff ("Patience") + loop ending; punch 85 % |

Studio numbers for all Shorts and the channel (geography: Vietnam 42.6 %, Philippines 21.5 %, US 2.6 %):
`data/analytics/studio-2026-11-06*`; diagnosis in `channel/DIAGNOSIS-2026-11.md`.

## Entry template (copy for each video)

```
## Tập N — <title>  (posted YYYY-MM-DD HH:MM ET, file <name>.mp4, length XX s)

### Numbers
| Platform | Views 48 h | Views 7 d | Avg % viewed | Viewed vs swiped | Likes | Comments | Shares | Subs gained |
|---|---|---|---|---|---|---|---|---|

### Retention
- Where the curve drops (second → what is on screen at that second):
- Rewatch / loop (avg % > 100?):

### What worked (keep)
### What didn't (cause → evidence)
### Rules changed (file + one line each)
### Test for the next video (one variable at a time)
```

## Tập 1 — We Missed You  (posted 2026-10-24 ~10:00 ET, `Tap01-we-missed-you_v8.mp4`, 39.8 s)

### Numbers (YouTube, first 1 day 23 h)
| Platform | Views 48 h | Avg % viewed | Viewed vs swiped | Likes | Comments | Subs gained |
|---|---|---|---|---|---|---|
| YouTube | 1.3K | 45.5 % | not read yet | 8 | 0 | 0 |
| Facebook / Instagram | not read yet | | | | | |

### Retention
- Average viewer leaves at ~0:18 of 40 s.
- On screen at 0:14–0:21: 1 PM garbage-truck beat, then 3 PM (stink lines, crackers, tally marks) and the lighthouse
  dream cutaway: 5–6 s with no line and no new information.

### What worked (keep)
- YouTube tested it with strangers on a 0-sub channel (1.3K views): the cold open + "POV" title earned the first seconds.
- Hand-drawn stick look, Brian narrator, Steve one-take voice: no complaints.

### What didn't
- **The hook answered its own question.** Frame 1 showed the note ("Sorry we missed you"), so viewers knew the ending
  and had no reason to wait for it.
- **A dead middle.** The waiting montage repeated one idea ("he waits a long time") instead of raising the stakes.
- **Too long for one joke** (40 s).
- **Nothing to answer.** No question in caption or pinned comment → 0 comments; like rate ~0.6 %.

### Rules changed
- `QA.md` row 8 + checklist: hook asks / punch answers; retention map (something new every 2–3 s); 25–30 s default;
  question CTA; 48 h review.
- `JOKES.md`: default length 25–30 s.

### Test for the next video
- Tập 2 "The Extra Hour": hook shows the effect (awake at 5:02) but hides the cause (the cat); 26–28 s; pinned
  question "What time did your body wake you up today?". Compare avg % viewed and comments with Tập 1.

## Tập 2 — The Extra Hour  (posted 2026-10-26 ~midday VN, `Tap02-extra-hour-v10.mp4`, 47.3 s)
Links: YouTube https://youtube.com/shorts/sysVz2F47k8 · Facebook https://www.facebook.com/reel/2609924412786304/ ·
Instagram https://www.instagram.com/unit4bcomedy/reel/De8YgKLNFzw/. Question comment posted on YouTube (pinning needs the
owner's phone verification). Tests vs Tập 1: voice-led narration (~1.8 words/s, was 1.2), beat-based pauses, emotion arc
with one bleeped explosion, the cause shown physically (cat on his face → meow). Fill the numbers on 28 Oct (48 h).

### Numbers at 48 h (2026-10-28, YouTube Studio)
| | Tập 1 | Tập 2 |
|---|---|---|
| Views | 1.3K (1.4K now) | 683 (flat after day 1; 97 % from the Shorts feed) |
| Stayed to watch (vs swiped away) | 17.3 % | **30.1 %** |
| Average view duration | 0:18 of 0:40 (45 %) | **0:30 of 0:48 (~63 %)** |
| Likes / comments | 8 / 0 | 6 / 1 (our question) |

### What worked (keep)
- Voice-led narration, beat-based pauses, emotion arc: those who stay watch ~63 % (was 45 %); "a part that kept viewers
  watching longer than usual" flagged by Studio again.
- Stayed-to-watch rose 17 % → 30 %.

### What didn't
- **The first frame.** 70 % still swipe in the first seconds. Frame 1 was a phone notice over a clock — UI, not a
  character, no emotion, nothing odd. YouTube stopped pushing after day 1 (views flat), consistent with a low stay rate.
- No comments from viewers (the question was ours, unpinned: pinning needs phone verification).

### Rules changed
- PREPRODUCTION #19: **frame 1 = the funniest/strangest image of the short with a character's face in it** (the climax
  or the absurd result: Steve with a cat on his face, a machine flashing at him, the queue staring), + the premise line
  spoken from 0.0 s. Explanations (notices, rules) come after the hook, not as the hook.

### Test for the next video
- Tập 3 (Self-checkout): cold open on the climax image (red light flashing, the whole queue staring at Steve holding a
  banana) with the premise line at 0.0 s. Compare stayed-to-watch with Tập 2 (30.1 %).

## Tập 3 — Self-Checkout  (posted 2026-10-28 ~16:30 VN, `Tap03-self-checkout.mp4`, 58.1 s)
Links: YouTube https://youtube.com/shorts/A8EUF5YzIYE · Facebook https://www.facebook.com/reel/2520662781750579/ ·
Instagram https://www.instagram.com/unit4bcomedy/reel/DfCE5FNBxjR/. Question comment posted as @unit4bcomedy.
Test vs Tập 2: frame 1 = the climax with Steve's face (arrest pose, alarm, staring queue) — compare stayed-to-watch with
Tập 2's 30.1 %. Read the numbers on 30 Oct (48 h).

## Tập 4 — Storm Stock-Up  (posted 2026-10-29, `Tap04-storm-stockup.mp4`, 55.7 s)
Links: YouTube https://youtube.com/shorts/XJXUFs969gs · Facebook https://www.facebook.com/reel/1127695759951561/ ·
Instagram https://www.instagram.com/unit4bcomedy/reel/DfD5WS6hT8S/. Question comment "What's the weirdest thing you've
seen people panic-buy?" posted as @unit4bcomedy (also in the Instagram caption).
Tests: frame 1 = the absurd result (Steve walled in by 48 packs of paper towels, cat on top) + a cat button again.
Known risk: punch "She WON." at 68 % (three-beat ending of ~15 s) — watch the retention curve after 0:38.
Read the numbers on 31 Oct (48 h).

## Tập 5 — Halloween Candy  (posted 2026-10-29 ~14:30 VN, `Tap05-halloween-candy.mp4`, 50.4 s)
Links: YouTube https://youtube.com/shorts/9tHLVOgOOFY · Facebook https://www.facebook.com/reel/1544038004420200/ ·
Instagram https://www.instagram.com/unit4bcomedy/reel/DfEfN8gBl-H/. Question comment "Be honest: how much of the Halloween
candy did you eat before the kids came?" posted as @unit4bcomedy (also in the Instagram caption).
Tests: dated seasonal topic, posted 2 days before Halloween (owner: "đăng luôn") instead of on the day; frame 1 = Steve
hiding under the window with a ghost at the glass (#19, #20); punch at 81 %. Read the numbers on 31 Oct (48 h).

## Tập 6 — Early Black Friday  (posted 2026-10-30 ~16:50 VN, `Tap06-early-black-friday.mp4`, 49.3 s)
Title "Never wait for Black Friday." Links: Facebook https://www.facebook.com/reel/1665623641813225/ · YouTube https://youtube.com/shorts/bF8qnPpoxkg
(posted 2026-11-02 ~08:06 VN, 3 days after FB/IG: Chrome profile lacked the channel) ·
Instagram https://www.instagram.com/unit4bcomedy/reel/DfHUQ00BrKc/. Question comment "Be honest: do you buy on the early
deal or wait for Black Friday?" posted on all three (also in the Instagram caption).
Tests: planted word that pays off ("Patience." → "Thank you for your PATIENCE.") + a loop ending ("Cyber Monday starts
SUNDAY." back to frame 1); posted the day it was made (owner: "đăng ngay hôm nay") instead of 4 Nov; beard removed
(read as fake), time shown by hair/eye bags/sleeping bag/pizza boxes; punch at 84.9 %. Read the numbers on 1 Nov (48 h).

## Tập 7 — Last Day on Earth  (posted 2026-11-06 ~10:40 VN, `Tap07-last-day-on-earth.mp4`, 45.6 s)
Title "When the news says World War 3 is coming." Links: YouTube https://youtube.com/shorts/58gXRhcWbuU ·
Facebook https://www.facebook.com/reel/1138412621906656 · Instagram https://www.instagram.com/unit4bcomedy/reel/DfYpW8XJUQx/.
Question comment "Be honest: what's the first thing you'd do if the world ended tomorrow?" posted as UNIT 4B on all three.
YouTube posted the same day from the Sweet Kurt Chrome profile (Browser 1). Custom thumbnail (option A) did NOT take
via the extension upload (PNG and 720x1280 JPG) — set it by hand in Studio.
Tests: news-anxiety topic (WW3, no real country named); voice v2 with acting tags + Creative stability (vs flat v1);
planted word pays off ("nothing MATTERS" → Penny "That still MATTERS.") + loop to the 2 A.M. phone; shortest so far
(45.6 s); punch at 81.9 %. Read the numbers on 8 Nov (48 h).
**Read 9 Nov (~3 days, `data/analytics/studio-2026-11-09.md`):** YouTube 106 views, stayed 31.1 %, AVD 0:18 (~39 % viewed),
3 likes, 1 comment, 0 subs, Shorts feed 91.5 %, Vietnam 81.1 % (only country shown). FB 31 views (drop at 0:02).
IG 1,716 views, 17 likes (100 % non-followers). Worst YouTube reach so far; posted the same day as Tập 8.

## Tập 8 — Typing...  (posted 2026-11-06 ~16:40 VN, `Tap08-typing.mp4`, 29.8 s)
Title `When you see "typing..." for 9 hours. #shorts` (title A) · thumbnail B ("9 HOURS" + giant "k").
Links: YouTube https://youtube.com/shorts/jLJ6X_fgGO0 · Facebook https://www.facebook.com/reel/1496663622330286/ ·
Instagram https://www.instagram.com/unit4bcomedy/reel/DfZUYr8hJ9m/ (FB/IG posted ~17:30 VN, same caption with the question).
Uploaded by Claude from Chrome Browser 1 (title, description, file); the owner set audience, tags, altered-content (No),
playlist "Steve vs. Everyday Machines", Public and the thumbnail by hand (extension upload again did not take, same as Tập 7).
Question comment: "What's the worst one-letter reply you ever got?" posted as @unit4bcomedy on YouTube; NOT pinned
(pinning needs the channel phone verified, owner step). On FB/IG the question is in the caption.
Tests (DIAGNOSIS-2026-11 §4C, new base): 29.8 s (vs 45–58 s), universal topic (typing dots), burned-in captions,
full-bleed panel + face ≥ 25 % + motion by 0.3 s, warm skin for Steve; punch at 78.6 %; normal posting time.
Read on 8 Nov ~16:40 VN (48 h): stayed-to-watch (target ≥ 50 %), % viewed (target ≥ 70 %), geography (VN/PH vs rest).
**Read 9 Nov (~3 days):** YouTube 156 views, stayed 31.5 % (target 50 %, MISS; Tập 6 46.8 %), AVD 0:17 (~57 % viewed,
target 70 %, MISS; = Tập 6), 1 like, 1 comment, +1 sub, Shorts feed 96.2 %, Vietnam 58.3 %, new viewers 98.1 %.
FB 41 views (drop at 0:02). IG 1,705 views, 13 likes, 1 save. **Lesson:** the shorter cut lifted % viewed vs Tập 7
(39 → 57 %) but not above Tập 6; the full-bleed/bigger-face notch did NOT lift stayed (31.5 % vs 46.8 %). Sample is
small (156); two Shorts on one day may have split the test audience. IG gives ~11x the YouTube views.

## Tập 9 — One Percent  (posted 2026-11-11 07:00–08:00 VN, `Tap09-one-percent.mp4`, ~27 s)
Title `When your phone is at 1% and the cable won't reach. #shorts` (title A) · thumbnail A. YouTube https://youtube.com/shorts/I65fHa7wqSw.
NOT posted on Facebook/Instagram (no reel found on either, read 17 Nov).
Test (DIAGNOSIS-2026-11 §4C): Tập 8 base + posting slot 07:00–08:00 VN, one Short that day.
**Read 17 Nov (~6 days, `channel/analytics-2026-11-17.md`):** YouTube 1,431 views (9x Tập 8), stayed 47.2 % (target 50 %,
near miss; best since Tập 6), AVD 0:20 (~74 % viewed, target 70 %, PASS — first pass), 0 subs, Shorts feed ~95 %,
Vietnam 75 %. Retention: steady decline, no cliff. **Lesson:** frame 1 = one number everybody reads in 0.2 s ("1%" + cable)
gives the best stayed; the morning VN slot brought views but a VN-heavy audience.

## Tập 10 — Good Morning  (published 2026-11-12, `Tap10-good-morning.mp4`, 26.96 s)
Title `When Mom adds you back to the family group chat. #shorts` (title B) · thumbnail A. YouTube https://youtube.com/shorts/drgy_WCVgPo
(uploaded file CRF 29) · Facebook https://www.facebook.com/reel/960206003552750/ · Instagram https://www.instagram.com/unit4bcomedy/reel/Dfqb36JO5Ze/
(FB/IG 2026-11-13 ~08:15 VN). Voices: original Voice Design voices copied to the sweetkurt ElevenLabs workspace.
Test: Tập 8 base + auto-dubbing OFF. Punch at 21.0 s (77.9 %).
**Read 17 Nov (~5 days):** YouTube 1,485 views (#1 Short), stayed 28.1 % (MISS, lowest of the three), AVD 0:21 (80.7 % viewed,
PASS, best ever), 8 likes, 0 subs, Shorts feed ~95 %, Vietnam 43 % / US 19 % (most global audience so far).
Retention: sharp early drop, then flat. FB 239 views, avg watch 4 s (15 %), 0 reactions. IG 2,484 views (100 % non-followers),
43 likes, 9 shares, 2 saves, 1 comment. **Lesson:** people who stay watch to the end (story works), but frame 1
(group chat at 6 A.M.) needs reading before it lands, so most swipe. Auto-dub OFF coincides with the first real non-VN audience.

## 3-Short test result (Tập 8–10, read 2026-11-17)
| | Tập 8 base | Tập 9 + 07–08 VN slot | Tập 10 + auto-dub OFF |
|---|---|---|---|
| YT views | 159 | 1,431 | 1,485 |
| Stayed (≥ 50 %) | 31.9 % ✗ | 47.2 % ✗ (close) | 28.1 % ✗ |
| % viewed (≥ 70 %) | ~57 % ✗ | ~74 % ✓ | 80.7 % ✓ |
| Vietnam share | 58 % | 75 % | 43 % (US 19 %) |
| IG views | 1,711 | not posted | 2,484 |
- **Keep:** 25–30 s base (story holds people: 74–81 % viewed); auto-dubbing OFF; one Short per day (Tập 8 shared its day with Tập 7 and got 159).
- **Bottleneck = the first second.** Stayed is the only metric still failing. Best hook = one instantly readable number/icon on the
  phone + Steve's face (Tập 9). Text-to-read hooks (Tập 10 group chat, Tập 8 dots) lose 70 %.
- **Slot:** 07–08 VN raised views but skewed VN; not enough data to call. Keep it fixed so the hook is the only variable.
- **Platforms:** IG gives the most views every time (1.7–2.5K, all non-followers); FB is weak (4 s avg). Post every Short on IG.
- **Subs:** 0 from ~3,000 YouTube views. Not a test goal yet; revisit after stayed ≥ 50 %.
- **Next test (Tập 11):** variable = "glance hook": frame 1 shows one big number/icon on a phone + Steve's face reacting, readable
  without reading words; everything else as Tập 10.
