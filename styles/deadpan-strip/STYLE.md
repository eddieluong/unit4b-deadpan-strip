# Deadpan Strip — Style Prompt

> An animated gag strip for adults: flat paper-coloured panels, small bean-headed characters with tiny lidded eyes, almost no motion, and a silent beat before every punchline. The joke lives in timing and in the gap between a sweet face and a dark line.
> References (grammar only): newspaper gag strips and dark-humour webcomics animated for social video (panel holds, reaction beats, deadpan delivery, the "one more panel" twist). Borrow the *grammar*, never any artist's characters, eye design, colour scheme or catchphrases.

## 1. Essence, and what it is not

A frame reads as Deadpan Strip in one glance when it has:

1. **Chibi proportions.** The head is about 2/3 of the character's height, the body is one small shape, limbs are single ink lines. Each lead keeps one signature that reads in silhouette (a beehive, a box bob, a fedora on a cat, a ghost's wisp and slippers). Big heads give big faces, so every expression reads on a phone. Average, evenly proportioned designs are a pitfall.
   **Bean heads, almost nothing else.** Rounded-square head about 45 % of the body height, one flat body shape, arms and legs as single ink lines, small ink-oval feet, no hands, no visible nose.
   **Simplicity budget per character:** one head shape, one body shape, one or two signature features (a hair shape, glasses, a hat, a wisp). No pockets, buttons, patterns, wrinkles, textures or extra props unless the joke needs that prop in that shot.
2. **Tiny lidded eyes.** Small solid black ovals (never white sclera, never pupils), each with a heavy flat upper-lid line. The lid height carries the emotion: half-closed is the default deadpan.
3. **Paper and panel.** An off-white paper ground with faint grain, often inside a hand-drawn panel border (rounded corners, slightly uneven line) that can split into 2–3 panels.
4. **Stillness.** Characters hold poses. Motion is rare, small and therefore funny.
5. **The beat.** A silent, motionless hold before the punchline, and a reaction hold after it.

Not a sitcom cartoon (no boiling thick outlines, no big expressive eyes), not a whiteboard explainer (characters act, nobody narrates), not anime (no sparkle, no speed lines except as a joke).

**Red lines (non-negotiable):** never use big white empty eyes, pale-white skin as a signature, stick-figure casts, or any existing strip's characters, logos, lettering or catchphrases. Invent your own cast. Never name a source artist in the film.

## 2. Materials & rendering

- **Line**: one warm near-black (`#2a2422` family), ~3 px for characters at 1080p (arms and legs are this line alone), 2 px for background detail, round caps and joins. Width is **constant in screen space** (stroke after transforming points). A faint marker wobble: resample outlines every ~10 px and offset along the normal by ≤ 0.8 px with low-frequency noise; cycle **2 drawings at 8 fps**. Much calmer than a sitcom boil: it should feel drawn, not nervous.
- **Fill**: flat colour, no gradients, no shading except one optional cheek blush (flat translucent oval) and one hard-edged floor shadow ellipse under each character.
- **Paper**: the background is `#f4efe4`-ish paper with procedural grain (static per shot, never animated in screen space) and a 1–2 % vignette. Sets are drawn in **2 tones max** plus line: a wall colour, a floor colour, a few line-only props.
- **Panel border**: 4–5 px line with rounded corners and slight per-side wobble; gutter 24–32 px of paper. A panel can be added, removed or split on a cut.
- **Faces**: eyes, lid line, optional brows (short straight dashes, only when needed), mouth as a single line or a small open shape. Mouths are tiny; a wide-open mouth is a special event. Glasses are two plain rings and a bridge, nothing more.
- **Expressions carry the comedy.** The body stays simple so the face can do the work. Every face is built from the same parts: eyes (dot with a straight or slanted lid, wide, pinpoint, happy arcs, closed, squint `> <`, `x`, spiral), brows (raised, worried, angry, skeptic), a mouth (line, smile, frown, smirk, wobble, O, grin, gritted teeth, scream, tongue, evil crescent, crying) and comic symbols (sweat drop, blush, tears, anger mark, gloom lines, sparkle, ?, zzz, steam). 26 named combinations live in `EXPRESSIONS` in `demo/cast.js`; use a name, not hand-built parts, unless a shot needs something new.
- **Reaction faces snap, they don't morph.** Change expression on a cut or on one 8 fps step, with at most one in-between drawing. The funniest change is often the smallest one (neutral → side_eye).
- **Rendering model**: Canvas 2D, layers back to front: paper → set → floor shadows → characters → panel border → captions. Everything is vector; no bitmaps except the paper grain texture.

## 3. Colour logic

- **One identity colour per character** (their clothing), saturated but slightly dusty. No two leads share a hue family. Skin is a small set of warm natural tones, varied across the cast; never white or grey.
- Sets use **desaturated** versions of a single hue so characters always pop.
- **Red is reserved** for danger and dark reveals (fire, a warning light, a stain, a single heart). If red appears, it is the joke.
- **The drain**: on the darkest beat of a film the set may drop to greyscale while the characters keep their colour, for one hold only.
- Example cast palette (UNIT 4B): Steve mustard `#e2b23c`, Nana Knuckles lavender `#9b7bc4`, Penny navy `#3d5a96`, Ted sage `#8aa37b`, Snuggles charcoal `#4a4a54`.
- **Each lead carries one surreal signature** that reads in silhouette (a beehive, a ghost's floating slippers, a fedora on a cat). The signature is part of the character design, never a costume for one episode.

## 4. Type & subtitles

- **Speech bubbles are optional**; burned-in captions are the default. Captions: bottom-centred, rounded hand-lettered sans (e.g. *Patrick Hand*, *Gochi Hand* or *Itim*, all OFL), 44–56 px at 1080p, dark text on a paper-coloured plate with the panel's line weight. A small **name tab** in the speaker's identity colour on the left of the plate.
- **Sound words** (THUD, beep) in the same hand font, drawn into the panel at an angle, never animated with bounce.
- The silent beat shows **no caption** (or a single "…" in the speaker's tab, only if the format needs it).
- Reading time: hold ≥ max(1.8 s, speech + 0.6 s). For quick back-and-forth: max(audio + 0.35 s, 0.9 s + chars / 17).
- Keep faces out of the bottom 18 % (caption band) and the top 6 % (title / channel tag in 9:16).

## 5. Motion quality

- **Characters on 8 fps steps** (holds of 3 frames at 24 fps). Camera, panel transitions and props that fly on ones.
- **Pose-to-pose, not tweened acting**: snap between 2–4 key poses per line, with one in-between at most.
- **Idle**: a blink every 3–6 s (lid drops for 2 drawings), breathing ±0.8 % vertical scale. Nothing else.
- **Lip-sync**: 3 mouth shapes (closed line, small open, wide), chosen from voice RMS sampled at 8 fps. Listeners keep a closed line.
- **The beat**: total stillness, including wobble frozen on one drawing. Then a single small change (eyes slide sideways, lid drops further) is the reaction.
- **Gags that move**: when something must move fast (a fall, a slap of a door), it goes in 1–2 frames with a smear shape and a hold after. No squash-and-stretch bounce.
- What never moves: the paper grain, the panel border during a hold, background props.

## 6. Camera grammar

A vocabulary, not a route. Opening and ending come from the topic.

| Move | What it expresses | Can serve |
|---|---|---|
| Locked medium two-shot inside a panel | the relationship; the deadpan standard | setups; any dialogue |
| Hard cut to a tighter panel on one face | the line that matters | the punchline; a confession; a realisation |
| Panel split (1 → 2 or 3) | two places or times at once | before/after; what they say vs what they do |
| Extra panel slides in from the right | "but wait" | the twist after the twist; a callback |
| Static insert of an object | the evidence | a receipt; a phone screen; the burning toaster |
| Slow push-in during a silent beat | dread | the pause before the dark line; a reveal |
| Pull back to a wide that shows more | context reversal | who was listening; what was behind them |
| Hold on an empty panel after a character exits | absence as a joke | a walk-out; a departure; a cat refusing |

Framing rules: characters stand on a shared floor line, feet visible in medium shots, heads at roughly the upper third. Two-shots leave 8–12 % of frame width between characters unless they touch. Transitions are hard cuts and panel operations only; **no dissolves, no swipes, no zooms with motion blur**.

## 7. Sound palette

- **Score is sparse**: a short dry motif on one or two instruments (muted ukulele, upright bass pizzicato, toy glockenspiel, felt piano, brushed snare). It plays under setups and **stops dead** before the punchline.
- **Silence is the instrument.** The beat contains only room tone (fridge hum, clock tick, distant traffic). Cut the music with its reverb tail.
- **Foley**: dry and close, slightly comic but not cartoonish: soft cloth rustle on pose snaps, a paper "tk" on panel cuts, a single low thud, a kettle click. No boings, no slide whistles.
- **Stinger**: after the punchline, one short dry sting (a two-note bass pluck or a single glock tink) or none at all.
- **Voices**: every lead has a distinct timbre, pace and pitch range (cast table lives with the cast, not here). Delivery is understated; the darkest lines are said the most casually. Compress, RMS-match, a short shared room reverb so everyone stands in the same space. Duck music −8 dB under dialogue. Master −14 LUFS.

## 8. Native moves

- **The extra panel.** The scene ends, then one more panel appears with a quieter, darker or stranger beat. *Fits content like:* a product that "works perfectly"; a family photo; a horoscope coming true.
- **Sweet face, dark line.** The cutest character delivers the bleakest logic, in the calmest voice. *Fits content like:* a child explaining inheritance; a pet's opinion on its owners; a toddler's review of a restaurant.
- **The silent beat.** Freeze everything for 0.8–1.6 s, then let one eye-slide land the joke. *Fits content like:* a price reveal; an awkward compliment; a text message arriving.
- **Split truth.** Left panel: what they say. Right panel: what is actually happening. *Fits content like:* "I'm fine"; a job interview; a smart-home demo.
- **Fourth-wall aside.** One character (often a pet) turns to the viewer and comments; the others don't notice. *Fits content like:* office meetings; family dinners; first dates.
- **The drain.** The set goes greyscale for the darkest beat, then colour snaps back as if nothing happened. *Fits content like:* a doctor's text; checking the bank app; Monday morning.
- **Rule of three, third panel silent.** Two spoken beats, then a third panel with no words at all. *Fits content like:* workout plans; budgeting; diet attempts.

## 9. Pitfalls of the medium

- **Too much motion kills it.** If characters move during dialogue more than once per line, it becomes a generic cartoon. Hold.
- **Beats that are too short** read as a rendering glitch, not a pause: ≥ 0.8 s, and make it clean (no caption, no music).
- **Captions over the punchline face**: move the camera, never the caption.
- **TTS rushes punchlines.** Generate the punchline as its own line, slow it (speed −8 to −12 %), and insert the silence in the edit, not in the text.
- **Identity colours drifting**: keep them in one cast file and import it; never retype hex values per shot.
- **Lids drawn as eyebrows**: the lid line touches the top of the eye; brows float above with a gap. Mixing them breaks the deadpan read.
- **Red used decoratively** wastes the danger signal.
- **Kokoro mispronounces made-up names**: respell in the TTS text and keep the real spelling in captions.
- **Surreal characters need a mundane problem.** A ghost who haunts is boring; a ghost who complains about the thermostat is the joke.

## 10. Engine

`demo/cast.js` (shared with the channel bible) holds the reusable recipes:

- `drawCharacter(ctx, id, x, y, scale, pose, { frame })`: draws a cast member at a floor point. `pose` = `{ expr: one of EXPRESSION_NAMES }`, optionally overriding any part: `eyes`, `lid` 0..1, `look` −1..1, `brow`, `mouth`, `fx: [...]`, `arm` / `armL` / `armR` ('down'|'point'|'up'|'hips'|'shrug'|'hold'). Some expressions bring an arm pose (shocked → hands up, confused → shrug); pass `arm` to override.
- `EXPRESSIONS`, `EXPRESSION_NAMES`: the 26 named faces (neutral, deadpan, side_eye, smug, skeptical, happy, grin, laughing, proud, shocked, horrified, nervous, awkward, embarrassed, confused, sad, crying, angry, furious, disgusted, evil, dead_inside, sleepy, cringe, dizzy, knocked_out). Signature features are built in (Steve's hair and hood, Nana's beehive, needle and glasses, Penny's bob and tie, Ted's glasses, cardigan, wisp, mug and slippers, Snuggles's fedora and toothpick). Add any other prop per shot, drawn with the same line and flat fill.
- `CAST`: identity colours, skin, proportions and accessories per character.
- `paper(ctx, w, h, seed)`, `panel(ctx, x, y, w, h, seed)`: ground and border with wobble.
- `wobbleStroke(ctx, pts, seed, frame)`: constant-width marker line with the 2-drawing cycle.

Minimal use: `paper(ctx,1080,1920,1); panel(ctx,40,160,1000,1300,2); drawCharacter(ctx,'ted',540,1300,5,{lid:.6,mouth:'line'},{frame:f});`

Cast bible: `CAST.md`. Joke formats and sample scripts for shorts: `JOKES.md`.

## 11. Variation space

You decide the premise, which cast members appear, the set, the number of panels, the camera path, the pacing and where the beat falls. Ranges, all far from any one episode:

- Structures: **three-panel gag** (setup, escalation, silent payoff); **interview** (one character asks, three answer in split panels); **the ritual** (the same morning repeated, one detail worse each time).
- Openings: **mid-sentence** (we cut in after the problem started); **the object** (an insert of the evidence before we see who caused it); **the aside** (the pet addresses the viewer first).
- Endings: **the extra panel**; **the walk-out** (a character leaves; the empty panel holds); **the callback** (the first line returns with a new meaning).

Formats: 9:16 shorts (25–60 s, one gag) and 16:9 compilations (several gags joined by a paper "tk" cut and a 1 s title card).
