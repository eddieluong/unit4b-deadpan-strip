# UNIT 4B — why views and "CTR" are low (diagnosis, 2026-11-06, v2 with Studio data)

Sources: YouTube Studio read on 2026-11-06 (data through 4 Nov) → `data/analytics/studio-2026-11-06.csv` (per Short) and
`data/analytics/studio-2026-11-06-channel.md` (channel); public data via yt-dlp; `channel/PERFORMANCE.md`,
`channel/STRATEGY.md`, `styles/deadpan-strip/QA.md`; a contact sheet of frames 0.05 / 1.0 / 2.5 s of every released file;
benchmarks from the `youtube` skill (`references/shorts-playbook.md`).
Labels: **[O]** = observed in data, **[I]** = inferred (mechanism or cause not directly visible).

## 0. "CTR" is the wrong metric for this channel
97.2 % of all views come from the Shorts feed [O]. There is no thumbnail and no click there: the Short starts playing.
The feed's "CTR" is **stayed to watch vs swiped away** (skill benchmark ≥ 75 % good, < 50 % broken hook), then
**average % viewed** (≥ 70 % gets pushed). Thumbnail CTR only matters for channel page and search (2.4 % of views).

## 1. The numbers

| # | Short | Length | Views | Stayed to watch | Avg view | ≈ % viewed |
|---|---|---|---|---|---|---|
| 1 | The courier always comes when you go to the bathroom | 39.8 s | 1,342 | 17.5 % | 0:18 | 45 % |
| 2 | POV: you get an extra hour of sleep | 47.3 s | 686 | 31.0 % | 0:30 | 63 % |
| 3 | The self-checkout thinks I'm a criminal | 58.1 s | 1,238 | 38.7 % | 0:28 | 48 % |
| 4 | Storm warning. Everyone buys toilet paper. | 55.7 s | 1,412 | 40.9 % | 0:32 | 57 % |
| 5 | I bought the Halloween candy a week early. | 50.4 s | 1,244 | 43.8 % | 0:21 | 42 % |
| 6 | Never wait for Black Friday. | 49.3 s | 715 | 46.8 % | 0:28 | 57 % |
| 7 | When the news says World War 3 is coming. | 45.6 s | 93 | too new | | |

Channel lifetime [O]: 6.6K views, 2.4K engaged views, 72 likes, **+7 subscribers**, 35.2 % stayed / 64.8 % swiped,
**99.9 % new viewers**, "new viewers who returned: Low" on every Short, each Short peaks on day 1 and is ~0 from day 2.
**Audience: Vietnam 42.6 %, Philippines 21.5 %, United States 2.6 %**, Indonesia 2.2 %, Malaysia 2.0 %. Age 25–44 = 81 %.
96.6 % watch with no subtitles. Channel country of residence = Vietnam. YouTube auto-dubbing is on (20 languages).

## 2. What the data says that the notes did not

1. **The hook work is paying off.** Stayed-to-watch rose every single video: 17.5 → 31.0 → 38.7 → 40.9 → 43.8 → 46.8 %
   [O]. Rule #19 (frame 1 = the funniest image with a face) and the louder openings are working. Keep them; don't swing.
2. **…but views did not rise with it.** Every Short still stops at ~700–1,400 views on day 1 [O]. Tập 6 had the best
   hold (46.8 %) and one of the lowest view counts. So the hook is no longer the only ceiling.
3. **YouTube is testing the Shorts on the wrong audience.** Two thirds of views come from Vietnam and the Philippines,
   2.6 % from the US [O], for English, US-culture jokes (Black Friday, daylight saving, Halloween, self-checkout).

## 3. Causes, ranked by evidence

### Cause 1 — Audience mismatch: US-culture English comedy is tested on a Vietnamese/Filipino audience · strong
- [O] Vietnam 42.6 %, Philippines 21.5 %, US 2.6 %. Channel country = Vietnam, uploads from Vietnam.
- [O] 96.6 % watch without subtitles; the jokes are spoken English with deadpan timing and wordplay ("Patience",
  "Pre-Early Access").
- [I] For a new channel YouTube seeds the first test audience partly from the uploader's location/language signals.
  Viewers who don't share the culture or don't follow fast spoken English swipe or leave before the punch, so the
  Short never "graduates" to a wider, better-matched audience. This fits both the day-1 cliff and the flat ~1K views
  whatever the hook quality.
- [I] Auto-dubbing in 20 languages (but not Vietnamese) does not help the main audience and may flatten the comic
  timing for the rest.

### Cause 2 — Completion is too low because the Shorts are too long · strong
- [O] Average view 0:18–0:32 on 40–58 s Shorts = 42–63 % viewed (target ≥ 70 %, > 100 % = loops).
- [O] Lengths 46–58 s against the channel's own 25–30 s rule (QA.md row 8, JOKES.md).
- [O] Tập 4 curve: ~75 % of starters left by 0:07, ~60 % by 0:14, ~50 % at 0:28, ~40 % at 0:56. The punch sits at
  68–85 % of the runtime (35–48 s), after half of the viewers have gone.
- [I] The same watch time on a 28 s Short would be ~100 % viewed and could loop.

### Cause 3 — The opening still loses more than half of viewers · strong (but improving)
- [O] Swiped away 53–65 % on Tập 3–6 (benchmark: < 50 % swiped).
- [O] Contact sheet: in Tập 3–6 frames 0.05 s, 1.0 s and 2.5 s are almost identical (only the caption word changes);
  the figure is small in a beige panel with a small "POV" header.
- [I] The next notch is motion and size in the first second, not a new hook concept.

### Cause 4 — Nothing makes a viewer come back · strong
- [O] 99.9 % new viewers, returning "Low" on all Shorts, +7 subscribers from 6.6K views (0.1 %), 0 viewer comments.
- [O] No playlists; series names from STRATEGY §2 are not visible on titles or frames.
- [I] Each Short is a one-off joke from a stranger; with cast lore deliberately hidden, there is no "I want the next
  one" hook yet.

### Cause 5 — Process and cadence · medium
- [O] 48 h numbers for Tập 3–6 were never logged (now in `data/analytics/`), so seven videos changed several things at
  once without a read.
- [O] Uneven posting (two on 29 Oct, Tập 6 on YouTube 3 days after FB/IG, 4-day gap before Tập 7); posting at
  ~22:40–05:00 US Eastern instead of the planned 17:00–20:00 ET [I: small effect for Shorts].

### Not a main cause
- **Titles/thumbnails:** titles are short and situation-first; feed views don't see thumbnails. Fine as is.
- **Dated topics:** the Storm and Halloween Shorts are among the best; the data doesn't show dated topics hurting yet.
  They do die after a few days, so prefer evergreen when the choice is equal.

## 4. Action list

### A. Next video (proposals; approved scripts, thumbnails and playbook rules stay as they are)
1. **25–30 s cut** (the existing rule). Gate: no render if the voice take is over 32 s. Punch by ~22 s.
2. **Topic that works for both the US and Southeast Asia**: phones, bosses, delivery apps, family group chats, Wi-Fi,
   alarms, prices. Avoid US-only rituals (Black Friday, daylight saving, Thanksgiving) until the audience shifts.
3. **Burned-in English captions on every line** (already partly there), short words, slower first line. 96.6 % watch
   with no CC; non-native viewers need to read the joke.
4. **First second: one notch louder** — face ≥ 25 % of the frame, visible motion by 0.3 s, a picture change by 1.0 s.
   QA check: frames 0.0 / 0.5 / 1.0 s must differ.
5. Pin a question viewers can answer (verify the channel phone once so pinning works).

### B. Tests (one variable each, compare stayed-to-watch, % viewed and US share in Studio → Audience → Geography)
| Test | How | Read after |
|---|---|---|
| Length | next Short at 25–30 s, same style | 48 h: % viewed vs Tập 4–6 (42–57 %) |
| Audience fit | one universal topic vs one US-only topic, same length | 48 h: geography + stayed |
| Posting time | post at 07:00–08:00 VN (= 19:00–20:00 ET) for two Shorts | US share vs 2.6 % |
| Auto-dubbing | turn it off on the next two Shorts (Studio → Settings → Upload defaults) | stayed/% viewed vs dubbed ones |

**Existing videos:** Studio Test & Compare runs on long-form thumbnails/titles; it is not offered for Shorts [I —
confirm under Content → the Short → Edit]. So for Shorts:
- Re-cut test: a 25–30 s, louder-opening re-edit of Storm or Self-Checkout posted as a new Short ≥ 2 weeks later;
  compare with the original's 40.9 % / 38.7 % stayed and 57 % / 48 % viewed.
- Try a Facebook/Instagram pre-test of two openings before a YouTube upload.
- Create two playlists ("Steve vs. Everyday Machines", "Seasonal") and add the 7 Shorts; set Tập 7's thumbnail by hand.

### C. Decision (owner, 2026-11-06): global English audience, run the 3-Short plan
"không nhất thiết phải là khán giả mỹ, hướng đến global, làm theo đề xuất 3 tập".
Plan for the next 3 Shorts (Tập 8–10), one variable per Short on top of the A-list base:
| Short | Base (all three) | Variable | Success signal at 48 h |
|---|---|---|---|
| Tập 8 | 25–30 s, universal topic, burned-in captions, louder first second | — (new base) | % viewed ≥ 70 %, stayed ≥ 50 % |
| Tập 9 | same | posting at 07:00–08:00 VN (US evening / EU night) | share of views outside VN + PH above Tập 8 |
| Tập 10 | same | auto-dubbing off (owner flips the upload default) | stayed / % viewed vs Tập 8–9 |
Read geography per Short (Studio → the Short → Analytics → Audience) and log it in PERFORMANCE.md.
After Tập 10: keep what moved the numbers, then decide the next variable.

## 5. Data still missing
- Retention curves of Tập 3, 5, 6 (only Tập 4 read) — Studio → the Short → Analytics → Engagement.
- Tập 7 numbers at 48 h (8 Nov), including geography.
- Per-video geography (only channel-level read).
