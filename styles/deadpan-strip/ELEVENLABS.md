# UNIT 4B — Giọng ElevenLabs

Mỗi nhân vật có một giọng gốc và 5 kiểu giọng (mode). Mode là cách đọc: châm chọc, mặt lạnh, dad joke, hoảng loạn… Tất cả nằm trong `elevenlabs.json`; script `demo/elevenlabs_tts.py` đọc file đó và xuất WAV đúng định dạng pipeline Lemo-Opuscar cần (thay cho `core/tts/tts.py`).

> Soạn theo hiểu biết về ElevenLabs tới giữa 2026 (Eleven v3, audio tag, Voice Design), chưa đối chiếu lại tài liệu mới nhất. Nếu API trả lỗi về một trường (ví dụ `speed`), xoá trường đó trong `elevenlabs.json`.

## 1. Tạo giọng (một lần)

1. Vào ElevenLabs → **Voices → Create a Voice → Voice Design**.
2. Dán `design_prompt` của từng nhân vật (trong `elevenlabs.json`), bấm generate, nghe các bản preview, chọn bản hợp nhất và lưu với tên `UNIT4B Steve`, `UNIT4B Nana`…
   - Không ưng bản nào: tìm trong **Voice Library** bằng chuỗi `library_search` rồi thêm vào My Voices.
3. Copy **Voice ID** của từng giọng vào trường `voice_id` trong `elevenlabs.json`.
4. Đặt API key: `export ELEVENLABS_API_KEY=...` (không commit key vào git).
5. Nghe thử mọi mode của một nhân vật:
   `python demo/elevenlabs_tts.py --audition ted out/audition_ted`
6. Chỉnh `stability` / `tags` cho tới khi từng mode nghe đúng chất, rồi mới làm tập phim.

**Penny (8 tuổi):** ElevenLabs có thể hạn chế giọng trẻ em trong Voice Design và Voice Library. Nếu không tạo được, thiết kế một giọng nữ trẻ, nhỏ, cao, rồi nâng +2 đến +3 bán cung khi hậu kỳ (`rubberband=pitch=1.15:formant=preserved`).

**Dùng thương mại:** kênh có kiếm tiền thì cần gói trả phí của ElevenLabs cho quyền thương mại; kiểm tra điều khoản gói bạn đang dùng.

## 2. Bảng kiểu giọng

| Nhân vật | Mode | Dùng khi | Audio tag | Stability |
|---|---|---|---|---|
| **Steve** | `nervous` | mặc định, hỏi câu hợp lý | [nervously] | 0.5 |
| | `panic` | bị hù, la hét | [panicking] | 0.0 |
| | `weak_sarcasm` | cố châm chọc mà không tới | [sarcastic][nervous laugh] | 0.5 |
| | `dad_joke_bomb` | kể chơi chữ, hối hận ngay | [hopeful] … [awkward pause] …sorry. | 0.5 |
| | `apology` | xin lỗi ma, mèo, trẻ con | [sheepishly] | 0.5 |
| **Nana Knuckles** | `sweet` | mặc định, hiền hậu | [warmly] | 0.5 |
| | `deadpan_threat` | câu đen, nói như đọc công thức nấu ăn | [calmly] | 1.0 |
| | `menace_whisper` | panel cuối, bí mật | [whispers] | 0.5 |
| | `cackle` | cười vì joke đen của chính mình | [chuckles] … [giggles] | 0.0 |
| | `nostalgic` | "hồi xưa bà…" rồi đi rất sai hướng | [wistfully] | 0.5 |
| **Penny** | `corporate` | mặc định: phí, điều khoản | [matter-of-fact] | 1.0 |
| | `bored_sarcasm` | phản ứng với người lớn | [sarcastic] | 0.5 |
| | `unimpressed` | sau dad joke của Ted: "No." | [deadpan] | 1.0 |
| | `kid_slip` | lộ ra vẫn là trẻ con | [excited] … [giggles] | 0.0 |
| | `negotiation` | chốt deal, chậm và chắc | [slowly] | 1.0 |
| **Ted** | `passive_aggressive` | mặc định: máy sưởi, bát đĩa | [sighs] | 0.5 |
| | `dry_sarcasm` | câu đáp một chữ: "And yet." | [dryly] | 1.0 |
| | `dad_joke` | chuyên môn của ông: chơi chữ, rất hài lòng | [proudly] … [chuckles] | 0.5 |
| | `melancholy` | phô mai, quá khứ, chuyện đã chết | [wistfully][softly] | 0.5 |
| | `boo` | "boo" cho có, vì nghĩa vụ | [flatly] | 1.0 |
| **Snuggles** | `noir` | mặc định, dẫn chuyện, câu loop | [low, slow narration] | 0.5 |
| | `sarcastic_aside` | nút chốt phá tường: "Worth it." | [sarcastic] | 0.5 |
| | `dramatic` | làm quá về cá ngừ | [dramatically] | 0.0 |
| | `cat_pun` | chơi chữ hiếm hoi, nói như thú tội | [deadpan] | 1.0 |
| | `smug` | hoá ra nó đúng từ đầu | [smugly][purrs] | 0.5 |

Mỗi nhân vật có đủ cả ba loại giọng mà kênh cần:
- **Châm chọc:** `weak_sarcasm`, `bored_sarcasm`, `dry_sarcasm`, `sarcastic_aside`.
- **Mặt lạnh:** `deadpan_threat`, `unimpressed`, `boo`, `cat_pun`.
- **Dad joke:** Ted kể (`dad_joke`), Steve kể hỏng (`dad_joke_bomb`), Penny dập (`unimpressed`). Đây là bộ ba cho running gag dad joke.

## 2b. Giọng theo biểu cảm (26 × 5 nhân vật)

Mỗi biểu cảm trên mặt nhân vật có một cách đọc tương ứng. Trong kịch bản chỉ cần ghi `"expr": "shocked"`: cùng một trường vừa điều khiển khuôn mặt trong phim, vừa điều khiển giọng ElevenLabs.

Cách đọc = audio tag + stability của biểu cảm, nhân với tốc độ gốc của nhân vật. Với các biểu cảm "bình tĩnh" (cột flavor), script thêm tag chất giọng riêng của nhân vật phía trước. Ví dụ Nana mặt lạnh thành `[warmly] [deadpan] I've buried men for less, dear.`: giọng vẫn hiền mà câu thì đen, đúng chất joke của bà.

| Biểu cảm | Audio tag | Stability | Tốc độ | Flavor |
|---|---|---|---|---|
| `neutral` (bình thường) | — | 0.5 | ×1.0 | có |
| `deadpan` (mặt lạnh) | [deadpan] | 1.0 | ×0.92 | có |
| `side_eye` (liếc ngang) | [suspiciously] | 0.5 | ×0.95 | có |
| `smug` (đắc ý) | [smugly] | 0.5 | ×0.95 | có |
| `skeptical` (nghi ngờ) | [skeptical] | 0.5 | ×0.96 | có |
| `happy` (vui) | [cheerfully] | 0.5 | ×1.04 |  |
| `grin` (cười toe) | [excited] | 0.0 | ×1.08 |  |
| `laughing` (cười lăn) | [laughs] … [laughs harder] | 0.0 | ×1.0 |  |
| `proud` (tự hào) | [proudly] | 0.5 | ×0.95 | có |
| `shocked` (sốc) | [gasps] | 0.0 | ×1.1 |  |
| `horrified` (kinh hãi) | [screaming] | 0.0 | ×1.15 |  |
| `nervous` (lo lắng) | [nervously] | 0.5 | ×1.1 |  |
| `awkward` (ngượng) | [awkward laugh] | 0.5 | ×1.0 |  |
| `embarrassed` (xấu hổ) | [embarrassed] | 0.5 | ×1.02 |  |
| `confused` (bối rối) | [confused] | 0.5 | ×0.95 | có |
| `sad` (buồn) | [sadly] | 0.5 | ×0.88 | có |
| `crying` (khóc) | [crying] | 0.0 | ×0.9 |  |
| `angry` (giận) | [angrily] | 0.5 | ×1.02 |  |
| `furious` (điên tiết) | [shouting] | 0.0 | ×1.1 |  |
| `disgusted` (ghê) | [disgusted] | 0.5 | ×0.95 |  |
| `evil` (gian ác) | [mischievously] … [evil laugh] | 0.5 | ×0.9 |  |
| `dead_inside` (chết trong lòng) | [monotone] | 1.0 | ×0.85 | có |
| `sleepy` (buồn ngủ) | [yawns] [sleepily] | 0.5 | ×0.82 |  |
| `cringe` (muốn độn thổ) | [cringing] | 0.5 | ×1.0 |  |
| `dizzy` (choáng) | [dazed] | 0.0 | ×0.9 |  |
| `knocked_out` (bất tỉnh) | [groans] | 0.5 | ×0.8 |  |

| Nhân vật | Tốc độ gốc | Tag chất giọng (flavor) |
|---|---|---|
| Sweaty Steve | 1.06 | — |
| Nana Knuckles | 0.88 | [warmly] |
| Penny Pincher | 1.04 | [crisp] |
| Dead Ted | 0.9 | [weary] |
| Sgt. Snuggles | 0.86 | [low, gravelly] |

Mỗi nhân vật có 26 câu thử viết đúng tính cách, ví dụ Penny `deadpan`: "No.", Ted `proud`: "Why did the ghost go to the party? For the boos." (trường `expression_lines` trong `elevenlabs.json`). Nghe thử cả 26 biểu cảm của một nhân vật:

```bash
python demo/elevenlabs_tts.py --audition-expr ted out/ted_faces
```

Khi nào dùng `mode` thay cho `expr`: các mode đặt tên (`dad_joke`, `deadpan_threat`, `kid_slip`…) là cách đọc đặc trưng chỉ nhân vật đó có. Một dòng có cả hai thì `mode` thắng giọng, `expr` vẫn quyết định khuôn mặt.

## 2c. Gói châm chọc (10 kiểu × 5 nhân vật)

Mười cách đọc chỉ dành cho giọng, để joke châm chọc nghe rõ ý mỉa. Dùng như một `expr` trong file thoại; khuôn mặt hiện theo cột "Mặt".

| Kiểu | Audio tag | Mặt | Stability | Ví dụ (Penny) |
|---|---|---|---|---|
| `sarcastic` (châm chọc khô) | [sarcastic] | `smug` | 0.5 | “Oh sure. I'll fix the sink. Right after never.” |
| `mock_excited` (giả vờ hào hứng) | [sarcastically excited] | `grin` | 0.0 | “Yay! A complaint! My favorite kind of paperwork!” |
| `fake_sweet` (ngọt xớt giả tạo) | [sickly sweet] | `happy` | 0.5 | “Of course you can have a pet. For a small monthly fee.” |
| `condescending` (kẻ cả, coi thường) | [condescending] | `skeptical` | 0.5 | “It's called a lease. Grown-ups read them.” |
| `eye_roll` (thở dài, đảo mắt) | [sighs heavily] [bored] | `side_eye` | 0.5 | “Ugh. Fine. You can have one extra day. Plus interest.” |
| `mock_sympathy` (giả vờ thương cảm) | [mock sympathy] | `sad` | 0.5 | “Aww, your heater's broken? Have you tried being warmer?” |
| `slow_clap` (vỗ tay mỉa, giọng phẳng) | [flatly] [slow clap] | `deadpan` | 1.0 | “Wow. You paid on time. Do you want a sticker?” |
| `passive_aggressive` (thụ động-hung hăng) | [passive-aggressive] | `awkward` | 0.5 | “Per my last email. And the one before that.” |
| `mocking_mimic` (nhại giọng người khác) | [mocking, in a silly voice] | `disgusted` | 0.0 | “'But Penny, it's raining in my kitchen.' Not my problem.” |
| `fake_gasp` (giả vờ sốc) | [fake gasp] [sarcastically] | `shocked` | 0.0 | “Gasp. The tenant wants a refund. How original.” |

Mỗi nhân vật có câu riêng cho cả 10 kiểu (trường `expression_lines`). Tổng cộng 36 cách đọc × 5 nhân vật = 180 câu, đã tạo sẵn bằng ElevenLabs, nằm trong `voice-samples/elevenlabs/`.

## Giọng đang dùng

Tạo bằng Voice Design theo hướng hoạt hình hài (prompt ở `design_prompt`), theo lựa chọn trên trang chọn giọng:

| Nhân vật | Bản | Voice ID |
|---|---|---|
| Sweaty Steve | bản 3 | `Y9z2nW5YxRRbI3XaIf8x` |
| Nana Knuckles | bản 3 | `4m2IGvkby0duGcRUvLDs` |
| Penny Pincher | bản 3 | `uLjMe2KKO62jRu3id160` |
| Dead Ted | bản 3 | `izA0O6Rq9ZDMyG36oEyJ` |
| Sgt. Snuggles | bản 1 | `l4SjkRNDNFXHMWSAVCoK` |

Penny dùng giọng hoạt hình do người lớn lồng (ElevenLabs không cho tạo giọng trẻ em).

## 3. Viết thoại cho ElevenLabs

- File thoại: `[{"id", "char", "expr" hoặc "mode", "text"}]`; ví dụ đầy đủ ở `voice-samples/ep07_dad_joke.lines.json`.
- Tag viết trực tiếp trong câu cũng được: `"[sighs] Fine. [beat] Do the dishes."`. Câu bắt đầu bằng tag thì script không thêm tag của mode.
- **Punchline luôn là một dòng riêng.** Khoảng im lặng trước punchline cắt trong dựng phim, đừng trông vào `[beat]` hay dấu chấm lửng. Giọng v3 không cho im lặng chính xác.
- **Câu setup của dad joke đặt `"tail": ""`** để Ted không cười trước khi nói câu chốt.
- Phụ đề lấy từ `captions.json` (tag đã bị xoá, giữ lại chữ trong tail).
- Eleven v3 mỗi lần đọc một khác. Với câu quan trọng, chạy 2–3 lần (đổi `"seed"`) rồi chọn bản hay nhất; giữ `seed` của bản đó để tái tạo.
- Takes được cache trong `out/.cache/`: chạy lại một câu không đổi thì không tốn credit.
- `--fx` áp filter hậu kỳ của nhân vật (tiếng vang của Ted, âm radio cũ của Snuggles).
- Số viết bằng chữ trong `text` ("nineteen eighty-seven"); phụ đề trong phim có thể đổi lại thành số.

## 4. Lệnh

```bash
export ELEVENLABS_API_KEY=...
python demo/elevenlabs_tts.py --audition steve out/audition_steve            # nghe thử 5 mode của Steve
python demo/elevenlabs_tts.py --audition-expr steve out/steve_faces          # nghe thử 26 biểu cảm của Steve
python demo/elevenlabs_tts.py lines.json out/voice --fx                  # tạo thoại cho một tập
python demo/elevenlabs_tts.py lines.json out/voice --dry-run             # xem trước request, không tốn credit
python demo/elevenlabs_tts.py lines.json out/voice --model eleven_multilingual_v2   # bản dự phòng, không có audio tag
```

Đầu ra giống `tts.py`: `out/voice/<id>.wav` (24 kHz mono), `dur.json`, thêm `captions.json`. Các bước mix và kiểm tra tiếp theo của Lemo-Opuscar giữ nguyên.
