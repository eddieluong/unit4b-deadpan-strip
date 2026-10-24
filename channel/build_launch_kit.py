"""Build the UNIT 4B launch kit page (one self-contained HTML file with the art inlined).

    python3 channel/build_launch_kit.py <out.html>
"""
import base64, html, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
b64 = lambda p: base64.b64encode(open(os.path.join(ROOT, p), 'rb').read()).decode()

ART = {'avatar': 'channel/branding/art/avatar_1080.jpg', 'yt': 'channel/branding/art/youtube_banner_2560x1440.jpg',
       'fb': 'channel/branding/art/facebook_cover_1640x624.jpg', 'cover': 'channel/release/tap01/cover_tap01.jpg'}

YT_DESC = """Small problems. Big feelings.

UNIT 4B is a hand-drawn comedy about the tiny disasters of everyday life: the package that never comes, the Wi-Fi that dies at 99%, the landlord who answers emails in fine print. Steve lives in apartment 4B. He is a normal, tired adult. The building is not normal. And the cat on the windowsill narrates everything like a nature documentary.

New shorts every week."""

PLATFORMS = [
  {'id': 'yt', 'name': 'YouTube', 'when': 'do this first',
   'steps': ['Open youtube.com while signed in to the Google account you want to own the channel',
             'Profile picture → Create a channel (use a Brand Account if others will help manage it)',
             'Name: UNIT 4B · Handle: @unit4bcomedy',
             'YouTube Studio → Customization → Branding: upload the profile picture and the banner',
             'Customization → Basic info: paste the description',
             'Settings → Channel → Advanced: audience "No, not made for kids"'],
   'fields': [('Name', 'UNIT 4B', True), ('Handle', '@unit4bcomedy', True), ('Description', YT_DESC, False)],
   'art': [('avatar', 'Profile picture · 1080×1080'), ('yt', 'Banner · 2560×1440 (keep the art in the middle strip)')],
   'post': ('Tập 1 as a Short', [
       ('Title', 'The courier always comes when you go to the bathroom #shorts'),
       ('Description', "I took the whole day off. I didn't shower. I refreshed the app 41 times. Thirty seconds. That's all it took.\n\n#shorts #relatable #comedy #animation #delivery"),
       ('Settings', 'Not made for kids · Category: Comedy')])},
  {'id': 'fb', 'name': 'Facebook Page', 'when': 'second',
   'steps': ['From your personal Facebook: Menu → Pages → Create new Page',
             'Page name: UNIT 4B · Category: Comedian (or Entertainment website)',
             'Paste the intro (bio)', 'Upload the profile picture and the cover photo',
             'Set the username to @unit4bcomedy if it is free'],
   'fields': [('Page name', 'UNIT 4B', True), ('Category', 'Comedian', True),
              ('Intro (≤ 101 characters)', 'Small problems. Big feelings. A hand-drawn comedy about everyday disasters. New shorts every week.', False)],
   'art': [('avatar', 'Profile picture'), ('fb', 'Cover photo · 1640×624')],
   'post': ('Tập 1 as a Reel', [('Caption', 'The courier always comes when you go to the bathroom. 🙃 #relatable #comedy #animation')])},
  {'id': 'ig', 'name': 'Instagram', 'when': 'third',
   'steps': ['Sign up (app or instagram.com), username: unit4bcomedy', 'Edit profile: name, bio, photo, link (the YouTube channel)',
             'Settings → Account type → Switch to a Creator account',
             'Accounts Center → connect the UNIT 4B Facebook Page (lets Reels go to both)'],
   'fields': [('Name', 'UNIT 4B', True), ('Username', 'unit4bcomedy', True),
              ('Bio (≤ 150 characters)', 'Small problems. Big feelings.\nA hand-drawn comedy about everyday disasters 🏢\nNew shorts every week ↓', False)],
   'art': [('avatar', 'Profile picture')],
   'post': ('Tập 1 as a Reel', [('Caption', 'Took the whole day off. Refreshed the app 41 times. Went to the bathroom for 30 seconds. 🙃\n\n#relatable #comedy #animation #reels #delivery'),
                               ('Cover', 'Use the frame at 0:00 (picture below) · Share to feed: on')])},
  {'id': 'tt', 'name': 'TikTok', 'when': 'last',
   'steps': ['Sign up, username: unit4bcomedy', 'Edit profile: name, bio, photo',
             'Settings → Account → switch to a Business account (Creator tools, analytics)',
             'Add the YouTube and Instagram links when TikTok offers them'],
   'fields': [('Name', 'UNIT 4B', True), ('Username', 'unit4bcomedy', True),
              ('Bio (≤ 80 characters)', 'Small problems. Big feelings. 🏢 A hand-drawn comedy. New shorts weekly.', False)],
   'art': [('avatar', 'Profile picture')],
   'post': ('Tập 1', [('Caption', 'took the whole day off for this 🙃 #relatable #comedy #animation #delivery #fyp'),
                      ('Cover', 'Frame at 0:00 (picture below)')])},
]


def field(pid, i, k, v, big):
    fid = f'{pid}-f{i}'
    return (f'<div class="field"><div class="k">{html.escape(k)}<em>{len(v)} chars</em></div>'
            f'<div class="v{" big" if big else ""}" id="{fid}">{html.escape(v)}</div>'
            f'<button class="copy" type="button" data-for="{fid}">Copy</button></div>')


def block(P):
    steps = ''.join(f'<li><label><input type="checkbox" id="{P["id"]}-s{i}"><span>{html.escape(s)}</span></label></li>' for i, s in enumerate(P['steps']))
    fields = ''.join(field(P['id'], i, k, v, big) for i, (k, v, big) in enumerate(P['fields']))
    art = ''.join(f'<figure><img src="data:image/jpeg;base64,{IMG[a]}" alt="{html.escape(c)}"><figcaption>{html.escape(c)}</figcaption></figure>' for a, c in P['art'])
    title, items = P['post']
    post = ''.join(field(P['id'] + 'p', i, k, v, False) for i, (k, v) in enumerate(items))
    cover = f'<figure><img src="data:image/jpeg;base64,{IMG["cover"]}" alt="Tập 1 cover frame" style="max-width:220px"><figcaption>Cover frame · 0:00</figcaption></figure>' if P['id'] in ('ig', 'tt') else ''
    return (f'<section class="platform" id="{P["id"]}"><h2>{html.escape(P["name"])} <span class="when">{P["when"]}</span></h2>'
            f'<ol class="steps">{steps}</ol><div class="fields">{fields}</div><div class="art">{art}</div>'
            f'<div class="post"><h3>Post: {html.escape(title)}</h3>{post}{cover}</div></section>')


IMG = {k: b64(p) for k, p in ART.items()}
tpl = open(os.path.join(HERE, 'launch-kit.template.html'), encoding='utf-8').read()
page = tpl.replace('{{AVATAR}}', IMG['avatar']).replace('{{PLATFORMS}}', '\n'.join(block(P) for P in PLATFORMS))
open(sys.argv[1], 'w', encoding='utf-8').write(page)
print('wrote', sys.argv[1], round(len(page) / 1024), 'KB')
