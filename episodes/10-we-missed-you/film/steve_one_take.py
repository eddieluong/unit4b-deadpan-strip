"""Generate all of Steve's lines in ONE ElevenLabs take (one person, one timbre), then split them in the film by the quietest point between lines,
with 40 ms pre-roll, a 300 ms natural tail, 15 ms fade-in and 120 ms fade-out, compressor + a light shared room (see voice_mono/).
    ELEVENLABS_API_KEY=... python3 steve_one_take.py voice_mono/steve_all.pcm
"""
import json, urllib.request, sys
import os
K = os.environ['ELEVENLABS_API_KEY']; V = 'Y9z2nW5YxRRbI3XaIf8x'
# all six Steve lines in ONE generation so the timbre stays one person; feelings come from the words and light tags
TEXT = ("[relaxed, to himself] Okay. Nine to five. EASY. "
        "[pleasantly surprised] Oh, nice. He's CLOSE. "
        "[deflated, slower] It's the GARBAGE truck. "
        "[hurried, anxious] Okay, THIRTY seconds. I'll be thirty seconds. "
        "[quiet, flat] Cool. "
        "[sighs, resigned] I'll just take another day off.")
body = {'text': TEXT, 'model_id': 'eleven_v3', 'seed': 4242,
        'voice_settings': {'stability': 0.5, 'similarity_boost': 0.85, 'style': 0.45, 'use_speaker_boost': True}}
req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{V}?output_format=pcm_24000', data=json.dumps(body).encode(),
                             headers={'xi-api-key': K, 'Content-Type': 'application/json'})
open(sys.argv[1], 'wb').write(urllib.request.urlopen(req).read()); print('ok')
