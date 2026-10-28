# UNIT 4B — social accounts kit

Everything needed to set up YouTube, TikTok, Facebook and Instagram, and to post Tập 1. Accounts are created and
logged in by the owner; profile fields below are ready to paste (or to fill with Claude in Chrome once logged in).

## Live accounts (2026-10-23)

| Platform | Account | Status |
|---|---|---|
| YouTube | [@unit4bcomedy](https://www.youtube.com/@unit4bcomedy) (channel `UCfFgYzIDT28afga2jynBbKQ`) | Avatar, banner, description, links (IG, FB) published. Keywords set; country Vietnam; not made for kids. Upload defaults: Comedy, English video + metadata language. |
| Facebook | [UNIT 4B Page](https://www.facebook.com/unit4bcomedy) | Intro, username, avatar, cover done. Page settings still show "No Instagram connected". |
| Instagram | [@unit4bcomedy](https://www.instagram.com/unit4bcomedy) | Name, bio, avatar; Creator account. |
| TikTok | registered, region not US yet | On hold. |

## Published (2026-10-24) — Tập 1 v8 (`Tap01-we-missed-you_v8.mp4`, one-take voice)

| Where | Link | Notes |
|---|---|---|
| YouTube Short | https://youtube.com/shorts/Zu5q8GsMslM | Public, not made for kids. Community posts not yet available on the new channel. |
| Facebook Reel | https://www.facebook.com/reel/1606233407903191/ | Posted as the Page. |
| Facebook post | Page feed | Cover image + A/B/C poll-style question ("how many times have you refreshed a delivery app today?") + Short link. |
| Instagram Reel | https://www.instagram.com/unit4bcomedy/reel/De3BThCOSLD/ | Original 9:16 crop; not cross-posted to the personal Facebook. |
| Instagram post | profile grid | Cover (4:5) + intro "Hi, we're UNIT 4B" + question "longest you've waited for a delivery?". |

Lesson: Instagram web defaults video to a 1:1 crop; pick **Original** in the crop step.

**YouTube automatic dubbing (2026-10-24):** Settings → Channel → Advanced: Allow automatic dubbing ✓, Manually review dubs before
publishing ✓, review in **all** languages. Viewers whose YouTube language is English always get the original audio, so
English-speaking countries need no extra setting. Dubs appear under each video's Languages page after auto subtitles are
generated; listen to each one (deadpan timing, punchline pause) before publishing, and reject languages that break the joke.
Studio note: the Sweet Kurt Google account also owns "Head Office Explains"; switch channel at youtube.com/channel_switcher
before opening UNIT 4B Studio.

## Identity (same everywhere)

| Field | Value |
|---|---|
| Name | **UNIT 4B** |
| Handle | **@unit4bcomedy** (YouTube: free on 2026-10-23; `@unit4b` is taken. TikTok/Instagram/Facebook: check at signup; fallbacks `@unit4btoons`, `@unit4b_comedy`, `@weareunit4b`) |
| Category | Comedy / Entertainment · Animation |
| Language / audience | English, worldwide |
| Tagline | Small problems. Big feelings. |
| Avatar | `channel/branding/art/avatar_1080.jpg` (1080×1080, circle-safe) |
| YouTube banner | `channel/branding/art/youtube_banner_2560x1440.jpg` (2560×1440, key art inside the 1546×423 safe area) |
| Facebook cover | `channel/branding/art/facebook_cover_1640x624.jpg` (1640×624, key art inside x 220–1420 for phones) |
| Rebuild art | `node core/render/still.mjs channel/branding 0 --size 1080x1080 --q asset=avatar` (also `youtube` 2560x1440, `facebook` 1640x624) |

## Bios

**YouTube channel description** (≤ 1000 chars)
> Small problems. Big feelings.
>
> UNIT 4B is a hand-drawn comedy about the tiny disasters of everyday life: the package that never comes, the
> Wi-Fi that dies at 99%, the landlord who answers emails in fine print. Steve lives in apartment 4B. He is a
> normal, tired adult. The building is not normal. And the cat on the windowsill narrates everything like a nature
> documentary.
>
> New shorts every week.

**TikTok bio** (≤ 80 chars)
> Small problems. Big feelings. 🏢 A hand-drawn comedy. New shorts weekly.

**Instagram bio** (≤ 150 chars)
> Small problems. Big feelings.
> A hand-drawn comedy about everyday disasters 🏢
> New shorts every week ↓

**Facebook Page** — Name: UNIT 4B · Category: Comedian / Entertainment website · Intro (≤ 101 chars):
> Small problems. Big feelings. A hand-drawn comedy about everyday disasters. New shorts every week.

Link in bio everywhere: the YouTube channel URL (once it exists).

## Tập 1 — "We Missed You" (episodes/10-we-missed-you/film/out/Tap01-we-missed-you.mp4, 39.8 s, 9:16)

**YouTube Shorts**
- Title: `The courier always comes when you go to the bathroom #shorts`
- Description: `I took the whole day off. I didn't shower. I refreshed the app 41 times. Thirty seconds. That's all it took.`
  then a blank line and `#shorts #relatable #comedy #animation #delivery`
- Audience: not made for kids. Category: Comedy.

**TikTok**
- Caption: `took the whole day off for this 🙃 #relatable #comedy #animation #delivery #fyp`
- Cover: the frame at 0:00 (Steve beside the note).

**Instagram Reels**
- Caption: `Took the whole day off. Refreshed the app 41 times. Went to the bathroom for 30 seconds. 🙃` + line break +
  `#relatable #comedy #animation #reels #delivery #mondaymood`
- Cover: frame at 0:00; share to feed: on.

**Facebook Reels**
- Caption: `The courier always comes when you go to the bathroom. 🙃 #relatable #comedy #animation`

## Posting plan (first month)
- Same video on all four, same day; YouTube first, the others within the hour.
- Weekly cadence to start (the bios promise "every week"); go to 2–3 a week once episodes are faster to produce.
- Best first slot to test: Tue–Thu, 17:00–20:00 in the target audience's time zone (US Eastern for English).
- After 7 days, compare average view duration and % viewed per platform before changing anything.

## Setup steps for the owner
1. **YouTube:** youtube.com → avatar → Create a channel → name "UNIT 4B" → handle @unit4bcomedy. Then YouTube Studio
   → Customization: profile picture, banner, description. Use a Brand Account if more people will manage it.
2. **TikTok:** sign up in the app → Profile → Edit: name, username, bio, photo. Switch to a Creator/Business
   account in Settings → Account for analytics.
3. **Instagram:** sign up → Edit profile: name, username, bio, photo → Settings → Account type → Creator.
   Link it to the Facebook Page (Accounts Center) to cross-post Reels.
4. **Facebook:** from a personal profile → Pages → Create new Page: name, category, intro, profile picture, cover.
Turn on two-factor authentication on all four before the first post.

## Posting checklist (lessons from Tập 2–3)
- YouTube: the Sweet Kurt Google account owns several channels (UNIT 4B, Head Office Explains, Untold Legend Archive).
  Before commenting, check the avatar next to the comment box says UNIT 4B; switch at youtube.com/channel_switcher.
  Pinning a comment needs the owner's phone verification (youtube.com/verify).
- Facebook: the account may be acting as another Page; switch to UNIT 4B (facebook.com/unit4bcomedy → Switch) and
  check "What's on your mind, UNIT 4B?" before creating the Reel.
- Instagram web: pick Original in the crop step (default is 1:1); decline the notifications prompt.
- Upload files must be < 10 MB for the browser tool: re-encode the release copy (x264 CRF 27).
