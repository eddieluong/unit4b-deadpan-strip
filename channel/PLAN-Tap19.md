# Plan: Tập 19, the next Short (Opus, 2026-11-25; owner OK)

**Folder:** `episodes/28-next`. **BANK row:** 28 (rows 24–27 for Tập 15–18 still need adding).

**Owner OK (2026-11-25):** "1 đăng 15–18 trước, 2 mỗi ngày, 3 OK phiên mới".
- **Order:** post Tập 15–18 first, one per day: 15 on 26/11, 16 on 27/11, 17 on 28/11, 18 on 29/11. Tập 19 follows on ~30/11.
- **Cadence:** one Short per day continues.
- **Where:** run this plan in a NEW Opus session.

## First steps in the new session (before step 0)
1. **Gate 3 for Tập 15–18** (sheet `channel/sheets/thumbs_Tap15-18.png`): DONE. **Owner (2026-11-25):** "OK, lấy mặc định A + tiêu đề đề xuất" (thumbnail A + the recommended title in each `release/metadata.md`).
2. **Uploads:** a YT private draft + IG Reel for each, with the full-quality file. Copy it to `~/Videos/UNIT4B/` and have the owner pick it in the dialog. Fix the posting slot in each metadata.md, and add BANK rows 24–27.
3. **Tập 14 YT draft:** ask whether to swap in the full file.

## Where things stand (from git, 25/11)
- **Tập 14:** YouTube private draft UocJIKLmPso holds the crf27 file. The IG Reel is up. Whether the owner published it on 20/11 is not recorded.
- **Tập 15–18:** rendered, QA passed and committed (04ec865), waiting for gate 3 (video, thumbnail, title). Not uploaded. Their slots (21–24/11) have passed.
- **Overdue reads:** Tập 13 (7 d), Tập 14 (48 h) and the glance-hook test for Tập 13–16. Its result decides what Tập 19 tests.

## Steps and models
| # | Step | Who / model | Output |
|---|---|---|---|
| 0 | Studio status of Tập 13–18 (public? date, views, APV, swipe-away) | Sonnet agent (browser, get_page_text) | facts list |
| 1 | Post-mortems: Tập 13 at 7 d, Tập 14 at 48 h+, plus the glance-hook verdict | Haiku reads PERFORMANCE/DIAGNOSIS; Opus writes conclusions | `channel/PERFORMANCE.md` + new rules → QA/JOKES |
| 2 | Pre-read: PREPRODUCTION, QA, JOKES, BANK, last 3 PERFORMANCE entries | Haiku/Explore | 1-page summary |
| 3 | Demand research for early December (global English; seasonal vs evergreen) | Sonnet agent (web) | top 5 everyday problems with evidence |
| 4 | Joke-lab round (`unit4b-joke-lab`): 3 ideas, scored | Opus | idea shortlist |
| 5 | **Gate 1:** script table + emotion arc, checked with `/youtube script` and `/youtube hook` (checklist pass) | Opus → **owner** | `episodes/28-next/script.md` |
| 6 | 3 key stills on ONE sheet, Opus review | Sonnet; Opus | **Gate 2: owner** |
| 7 | Voice (ElevenLabs eleven_v3, per-line speed, one CAPS word) | Sonnet | `film/voice/` |
| 8 | Render + QA.md (2 s sheet, -14 LUFS, punch 70–85 %) + Opus self-review on the 0.5 s sheet | Sonnet; Opus | release mp4 + sheets |
| 9 | Thumbnails A/B/C (`youtube-seo-thumbnail` + `youtube-titles-thumbnails`) and metadata (`youtube-seo-optimize`); house rules win | Sonnet | `release/metadata.md` |
| 10 | **Gate 3:** video + thumbnails + titles on one sheet | **owner** | picks |
| 11 | YT private draft + IG Reel. The owner picks the full-quality file in the dialog (`~/Videos/UNIT4B/`) | Sonnet | URLs |
| 12 | Publish, declarations, cover | **owner** | — |
| 13 | Commit/push/fsck + Notion after each step; BANK row | Opus | — |

## Open for the owner (one message)
1. **Tập 15–18:** gate 3 is still open. Should those go out first (one per day from 26/11), with Tập 19 after them (~30/11)? Or does Tập 19 jump the queue?
2. **Cadence:** keep one Short per day, or go back to every 2–3 days now that the 5-day run is done?
3. **Session:** run this plan in a new Opus session (recommended: this one is very long), using this file as the hand-off.
