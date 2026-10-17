# UNIT 4B — Main Cast & Voices

Series premise: Steve moves into apartment 4B of an old building and slowly realises he is the only normal person in it. The landlord is eight, the previous tenant never left (he died in 1987), the sweet old lady downstairs is clearly a retired something, and the building cat narrates everything like a film noir.

Shared by every episode. Visuals live in `demo/cast.js` (`CAST`), voices in `voices.json`. Never retype colours or voice settings per episode. Joke formats and sample scripts: `JOKES.md`.

## Sweaty Steve — The new tenant (straight man)
- **The name is the joke**: he is always sweating. Viewers learn his whole personality from two words. Others call him "Steve".
- **Look**: chibi, head about 2/3 of his height: spiky black hair, a mustard hoodie `#e2b23c` with the hood behind his neck, stick limbs. Default lid 0: always a little alarmed. **Visual gag**: the sweat drop. It is almost always there; the day it's missing is a joke.
- **Personality**: 29, freelance designer, chronic over-apologizer. Polite to a fault, even to the ghost and the cat. Just wants a normal apartment.
- **Comic function**: the audience's eyes. Asks the reasonable question; gets the unreasonable answer.
- **Go-to faces**: nervous, awkward, shocked, horrified, cringe. Rarely smug.
- **Never**: becomes weird himself. If Steve gets strange, the show loses its anchor.
- **Voice**: Kokoro `am_puck`, speed 1.06, +3 dB at 3 kHz. Quick, bright, slightly breathless. Alt `am_eric`.

## Nana Knuckles — Sweet old lady in 2A (implied retired assassin)
- **The name is the joke**: "Nana" is soft, "Knuckles" is not. Nobody in the building asks how she got the nickname. Others call her "Nana".
- **Look**: a tiny body in a lavender dress `#9b7bc4`, a white beehive twice the height of her head with a knitting needle stuck in it, and bottle-bottom glasses that magnify her eyes to twice their size. **Visual gag**: things come out of the beehive (scissors, a phone, a passport in another name); her magnified eyes make every tiny look huge.
- **Personality**: 78. Bakes, knits, calls everyone "dear". Mentions alarming skills casually and never explains them. Her only weakness is her hip ("Mostly my hip.").
- **Comic function**: sweet face, dark line. The scariest person in the building, and the kindest.
- **Go-to faces**: happy, proud, deadpan for threats, evil for the extra panel. Never horrified: nothing scares her.
- **Never**: shown hurting anyone. Everything is implied.
- **Voice**: Kokoro `bf_isabella`, speed 0.86, pitch −1 semitone (formants kept), light vibrato (`vibrato=f=5.5:d=0.06`). Warm, slow, British. Alt `bf_alice`.

## Penny Pincher — The landlord (age 8)
- **The name is the joke**: a penny-pincher is a stingy person, and she is the stingiest landlord alive. Others call her "Penny" or "Ms. Pincher" (she insists).
- **Look**: chibi with a box-shaped black bob framing a big round face, a navy blazer `#3d5a96` and a tiny black tie on a toddler-sized body. Default lid 0.5 (unimpressed). **Visual gag**: executive gravitas on someone who can't reach the doorbell.
- **Personality**: inherited the building. Runs it like a ruthless CEO: late fees, fine print, "per my last email". Still eight: needs help with juice boxes, has a bedtime, takes naps "for strategy".
- **Comic function**: corporate jargon in a child's voice; normalized absurdity (everyone obeys her).
- **Go-to faces**: deadpan, skeptical, side_eye, smug. The rare happy or laughing face is her "kid slip" and should land like a punchline.
- **Never**: in danger, never the butt of a joke about being a child. She always wins.
- **Voice**: Kokoro `af_sky`, speed 1.06, pitch +4 semitones (formants kept). Crisp, flat, precise. Alt `af_nova`.

## Dead Ted — Previous tenant (deceased, 1987)
- **The name is the joke**: he is dead, and it rhymes. He introduces himself as "Ted"; everyone else adds the "Dead".
- **Look**: chibi ghost of a man: pale and see-through, bald with grey tufts, round reading glasses, a sage cardigan `#8aa37b`, a wisp instead of legs, a mug of tea, and fluffy pink slippers floating under the wisp. Default lid 0.6 (tired). **Visual gag**: the slippers float with him, always a step behind; a ghost who still wants warm feet.
- **Personality**: died in 4B in 1987, refuses to move out. Passive-aggressive British flatmate energy: the thermostat, the dishes, "the walls are thin, Steve". Secretly lonely; likes to look at cheese.
- **Comic function**: normalized absurdity. Death treated as a minor inconvenience.
- **Go-to faces**: dead_inside, deadpan, sad over the cheese, proud after every dad joke.
- **Voice**: Kokoro `bm_lewis`, speed 0.88, high-pass 140 Hz + double echo (`aecho=0.8:0.7:70|140:0.25|0.14`) so he sounds a little "elsewhere". Alt `bm_daniel`.

## Sgt. Snuggles — Building cat, noir narrator
- **The name is the joke**: a hard-boiled 1940s detective voice belonging to a cat called Snuggles. He gave himself the "Sgt.".
- **Look**: chibi charcoal cat `#4a4a54`, big round head with big ears, yellow eyes, a fedora two sizes too small, a toothpick. **Visual gag**: a hard-boiled noir detective named Sgt. Snuggles.
- **Personality**: has lived in the building longer than anyone alive. Narrates everything like a 1940s detective. Only the viewer hears him.
- **Comic function**: fourth-wall aside, extra-panel button, loop narrator.
- **Go-to faces**: side_eye, smug, deadpan. One shocked face per season, at most.
- **Voice**: Kokoro `am_onyx`, speed 0.84, pitch −1 semitone, low-pass 6.5 kHz + short room echo (old-radio warmth). Deep, slow, American noir. Alt `bm_george` (−2 semitones).

## Contrast check
| | Accent | Pitch | Pace | Energy |
|---|---|---|---|---|
| Steve | American | mid-high | fast | anxious |
| Nana Knuckles | British | mid, warm | slow | sweet |
| Penny | American | high | crisp | flat |
| Ted | British | mid-low, echoed | slow | weary |
| Snuggles | American | very low | very slow | noir |

Every pair differs in at least two columns, so viewers can tell who is speaking with their eyes closed.

## Silhouette check
Fill every character solid black: Steve = a big round head with a spiky crown; Nana = a tiny body under a towering egg; Penny = a near-square block of hair on a T of a blazer; Ted = a round bald head over a wisp and two floating ovals; Snuggles = a big-eared head with a tiny hat. No two outlines can be confused, even at thumbnail size.

## ElevenLabs voices (main)
Each character has a custom comedic ElevenLabs voice (Voice Design) and 36 deliveries: the 26 face expressions plus 10 sarcasm styles (sarcastic, mock_excited, fake_sweet, condescending, eye_roll, mock_sympathy, slow_clap, passive_aggressive, mocking_mimic, fake_gasp), plus five named modes. All live in `elevenlabs.json`, are generated with `demo/elevenlabs_tts.py`, and 180 ready-made clips sit in `voice-samples/elevenlabs/`. Guide: `ELEVENLABS.md`. The Kokoro settings below are only a free offline fallback.

## Voice processing (all characters)
1. Generate each line separately with `core/tts/tts.py` and the voices above.
2. Apply the per-character filter from `voices.json`, then the common compressor.
3. RMS-match; one shared short room reverb; music ducked −8 dB under dialogue; master −14 LUFS.
4. Punchlines: their own line, speed −8 to −12 %, silence inserted in the edit.
5. Write numbers as words in the TTS text ("nineteen eighty-seven") and as digits in captions.
