// UNIT 4B · 15 "Early Black Friday" (Tập 6) — 9:16 film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// Script: ../script.md (approved table). One set: the MEGA STORE aisle. Frame 1 = the absurd result with his face (#19);
// voice-led (Steve VO) + in-scene lines rows 4, 6, 11, 12 (lip-sync); one peak (row 11); silent beats rows 6b and 10; loop row 13.
// Layout: PREPRODUCTION #21 safe area (title y 230/290, panel PY 320 PH 1300, captions y 1500).
// Voice timing: ?voice=voice_ph uses the placeholder timing (placeholder_voice.py); default is voice/ (the real take).
import { drawCharacter, paper, panel, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { track, idle, sum, wordChunk, ease, onTwos, boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const Q = new URLSearchParams(location.search), VDIR = Q.get('voice') || 'voice';
const PX = 40, PY = 320, PW = 1000, PH = 1300, FLOOR = 1400, K = 9.5, INK = '#2a2230', TITLE_Y = [230, 290], CAP_Y = 1500, CAM_Y = PY + PH / 2 - 70;
const STOOL_Y = 1290, SX = 225, PXX = 870;   // Steve's and Penny's standing spots in the two-shots

const LINE_DEFS = [   // id, char, caption, gap after (beat: after a joke 0.7, list 0.35, turn 0.6, silent beat 0.8–1.2)
  ['15_s01', 'steve', 'I waited for the Black Friday price. Smart.', 0.5],
  ['15_s02', 'steve', 'November fifth. Early Black Friday. Four ninety-nine.', 0.35],
  ['15_s03', 'steve', "Early? Please. I'll wait for the REAL one.", 0.5],
  ['15_p04', 'penny', 'Black Friday PREVIEW. Four seventy-nine.', 0.3],
  ['15_s05', 'steve', "It's going down. PATIENCE.", 0.5],
  ['15_p06', 'penny', 'Pre-early ACCESS. Members only.', 1.5],                       // + silent finger maths (6b)
  ['15_s07', 'steve', "No. I'm not paying to SAVE money.", 0.5],
  ['15_s08', 'steve', 'So I waited. EVERY day. Same aisle.', 0.6],                   // + 4 held frames of time-lapse
  ['15_s09', 'steve', 'Black Friday. Six a.m. The REAL price.', 1.5],                // + silent zap and the frozen face (10)
  ['15_s11', 'steve', "That's TEN dollars more!", 0.4],
  ['15_p12', 'penny', 'Thank you for your PATIENCE.', 1.2],
  ['15_s13', 'steve', 'Cyber Monday starts SUNDAY.', 2.0],
];
const IN_SCENE = new Set(['15_p04', '15_p06', '15_s11', '15_p12']);
const TITLE = ["POV: you're waiting for the", 'Black Friday price'];
let LINES = [], DUR = 0, T = {}, EV = [], SHOTS = [], STEVE = [], PENNY = [], VOICE = {}, WORDS = {};
const L_ = id => LINES.find(l => l.id === id);
const end = id => L_(id).t + VOICE[id].dur;
const wt = (id, i) => L_(id).t + Math.max(0, (WORDS[id] || [])[i]?.[1] ?? 0);

// ---------- helpers ----------
const frameOf = boilFrame;
const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const pen = (x, y, s, t, seed = 1) => new VPen(ctx, x, y, s, { lw: Math.max(2.4, s * 0.85), hand: true, frame: frameOf(t), seed });
const spen = (t, seed) => { const p = pen(0, 0, 1, t, seed); p.T = q => q; return p; };
function withCamera(zoom, fx, fy, fn, sx = 540, sy = CAM_Y) {
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.translate(sx, sy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore();
}
function hand(text, x, y, size, rot = 0, color = INK, font = 'Fredoka', weight = '600') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore();
}
function sfxText(text, x, y, size, rot = 0, fill = '#ffd84a') {   // white/yellow with a thick ink outline: readable on any set
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.22; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0); ctx.restore();
}
function speakingEnv(id, t) {
  const v = VOICE[id], L = L_(id); if (!v || !L) return -1;
  const ts = Math.floor(t * 8) / 8 - L.t; if (ts < 0 || ts > v.dur) return -1;
  return v.env[Math.min(v.env.length - 1, Math.floor(ts * 24))] || 0;
}
function mouthFor(char, t) {
  for (const L of LINES) {
    if (L.char !== char || !IN_SCENE.has(L.id)) continue;
    const e = speakingEnv(L.id, t);
    if (e >= 0) return char === 'steve' ? (e > 0.5 ? 'scream' : 'wide') : (e > 0.5 ? 'wide' : 'small');
  }
  return null;
}

// ---------- props ----------
function tagShape(x, y, w, h, t, seed, price, date, big = 1) {   // a hanging price tag: string, hole, date, a BIG price
  const p = spen(t, seed);
  p.line([[x - w * 0.25, y - 70], [x - 6, y + 6]], 4); p.line([[x + w * 0.25, y - 70], [x + 6, y + 6]], 4);
  p.part(roundPoly([[x - w / 2, y + 20], [x + w / 2, y + 20], [x + w / 2, y + h], [x - w / 2, y + h]], 14), '#fff1a8', { shade: 0.08, lw: 5 });
  p.part(roundPoly([[x - w / 2, y + 20], [x + w / 2, y + 20], [x + w / 2, y + 66], [x - w / 2, y + 66]], 14), '#d9382c', { shade: false, lw: 5 });
  p.dot(x, y + 10, 9, 9, '#ffffff');
  if (date) hand(date, x, y + 44, 38, 0, '#ffffff');
  hand('$' + price, x, y + 66 + (h - 66) / 2, 104 * big, 0, INK);
}
function banner(x, y, w, h, rot, color, text, tcol, size, t, seed, slap = 1) {   // text sits near the top so the next banner can overlap the bottom
  ctx.save(); ctx.translate(x, y + (1 - slap) * -220); ctx.rotate(rot); ctx.translate(-x, -y);
  const p = spen(t, seed), a = x - w / 2, b = y - h / 2;
  p.part(roundPoly([[a, b], [a + w, b + 3], [a + w - 4, b + h], [a + 3, b + h - 3]], 8), color, { shade: 0.1, lw: 4 });
  hand(text, x, b + 29, size * 0.92, 0, tcol);
  ctx.restore();
}
function stool(x, topY, t) {   // a two-step stool, top at topY
  const p = spen(t, 21);
  p.part(roundPoly([[x - 110, topY], [x + 110, topY], [x + 150, FLOOR], [x - 150, FLOOR]], 8), '#e8a53a', { shade: 0.14, lw: 5 });
  p.line([[x - 130, topY + (FLOOR - topY) * 0.5], [x + 130, topY + (FLOOR - topY) * 0.5]], 4);
  p.part(roundPoly([[x - 118, topY - 14], [x + 118, topY - 14], [x + 118, topY + 6], [x - 118, topY + 6]], 5), '#f2c14e', { shade: 0.1, lw: 4 });
}
function tvSet(t, glow = 0.6) {   // display table + TV (no logo)
  const p = spen(t, 31);
  p.part(roundPoly([[360, 1060], [760, 1060], [760, FLOOR], [360, FLOOR]], 6), '#c9a46a', { shade: 0.12, lw: 5 });
  p.part([[340, 1040], [780, 1040], [780, 1068], [340, 1068]], '#e9d8b4', { shade: false, lw: 4 });
  p.part(roundPoly([[470, 1030], [650, 1030], [680, 1042], [440, 1042]], 4), '#3a3646', { shade: false, lw: 4 });
  p.part(roundPoly([[380, 810], [740, 810], [740, 1030], [380, 1030]], 18), '#2a2630', { shade: 0.1, lw: 6 });
  p.part(roundPoly([[398, 828], [722, 828], [722, 1012], [398, 1012]], 8), '#9fd0ee', { shade: 0.1, lw: 3 });
  p.line([[420, 850], [520, 836]], 8, 'rgba(255,255,255,0.75)');
  ctx.save(); ctx.globalAlpha = 0.18 * glow; ctx.fillStyle = '#bfe4ff'; ctx.beginPath(); ctx.moveTo(398, 1012); ctx.lineTo(722, 1012); ctx.lineTo(860, FLOOR); ctx.lineTo(260, FLOOR); ctx.closePath(); ctx.fill(); ctx.restore();
}
function rope(t, k) {   // velvet rope round the TV table: two brass posts, red rope sagging; k 0 slack/off … 1 tight
  const p = spen(t, 41), a = [335, 1000], b = [785, 1000], sag = 90 * (1 - 0.8 * k);
  for (const x of [a[0], b[0]]) {
    p.part(roundPoly([[x - 14, 1000], [x + 14, 1000], [x + 14, FLOOR - 24], [x - 14, FLOOR - 24]], 4), '#e0b04a', { shade: 0.15, lw: 4 });
    p.part(ellipsePts(x, 1000, 26, 26, 24), '#f0c860', { shade: 0.15, lw: 4 });
    p.part(roundPoly([[x - 44, FLOOR - 24], [x + 44, FLOOR - 24], [x + 44, FLOOR], [x - 44, FLOOR]], 8), '#c8962e', { shade: 0.1, lw: 4 });
  }
  const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([a[0] + 28 + (b[0] - a[0] - 56) * u, 1004 + sag * 4 * u * (1 - u)]); }
  p.line(pts, 16, '#a9202c');
}
function membership(x, y, t, swing = 0) {   // the sign hung on the rope
  ctx.save(); ctx.translate(x, y - 70); ctx.rotate(swing); ctx.translate(-x, -(y - 70));
  const p = spen(t, 51);
  p.line([[x - 90, y - 70], [x - 110, y]], 5); p.line([[x + 90, y - 70], [x + 110, y]], 5);
  p.part(roundPoly([[x - 190, y], [x + 190, y], [x + 190, y + 170], [x - 190, y + 170]], 14), '#1f3a6e', { shade: 0.1, lw: 5 });
  hand('MEMBERSHIP', x, y + 46, 54, 0, '#ffffff'); hand('$49.99', x, y + 120, 92, 0, '#ffd84a');
  ctx.restore();
}
function sleepingBag(x, y, t, open = 1) {   // y = bottom; covers his legs, a zip down the middle
  const p = spen(t, 61), w = 270;
  p.part(roundPoly([[x - w, y - 230 * open - 20 * (1 - open)], [x + w, y - 230 * open - 20 * (1 - open)], [x + w + 30, y], [x - w - 30, y]], 70), '#3f8f7a', { shade: 0.14, lw: 6 });
  p.line([[x - 40, y - 230 * open], [x - 30, y - 120], [x - 44, y]], 5, 'rgba(255,255,255,0.7)');
  p.part(roundPoly([[x - w - 20, y - 150 * open], [x - w + 60, y - 150 * open], [x - w + 60, y - 10], [x - w - 20, y - 10]], 10), '#2f6e5d', { shade: false, lw: 3 });
}
function tvBox(x, y, t, h = 270) {   // the TV box he hugs (bottom centre); a picture of a TV on the front
  const p = spen(t, 71), w = 330;
  p.part(roundPoly([[x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2, y], [x - w / 2, y]], 8), '#c9a46a', { shade: 0.12, lw: 6 });
  p.part(roundPoly([[x - 110, y - h * 0.78], [x + 110, y - h * 0.78], [x + 110, y - h * 0.3], [x - 110, y - h * 0.3]], 10), '#9fd0ee', { shade: 0.08, lw: 4 });
  hand('55"', x, y - h * 0.9, 40, 0, INK);
}
// Steve SITTING on the aisle floor in a sleeping bag up to his chest; a hip at hipY. box: hugging the TV box in front of his belly.
const STAINS = [[-120, 0.30, 46, 24, '#6b5a3a'], [90, 0.55, 58, 30, '#5a4a30'], [-30, 0.80, 40, 20, '#7a6a44'], [170, 0.25, 36, 22, '#4f5a3a'], [-190, 0.62, 50, 26, '#5a4a30'], [30, 0.12, 34, 18, '#8a6d3b'], [130, 0.85, 44, 22, '#6b5a3a'], [-90, 0.42, 30, 16, '#4a3f2c']];
function stains(p, x, top, bot, bw, dirt) {   // dirt 0..1: more brown blotches on the sleeping bag
  const n = Math.round(dirt * STAINS.length);
  for (let i = 0; i < n; i++) { const [dx, fy, rx, ry, c] = STAINS[i]; p.part(ellipsePts(x + dx * bw, top + 40 + (bot - top - 60) * fy, rx * bw, ry, 18), c, { shade: false, lw: 0.01 }); }
}
function bagSeat(x, t, { hipY = 1205, s = 10, bw = 1, box = true, dirt = 1, extra = {}, over = {} } = {}) {
  const bot = hipY + 22 * s + 10, top = hipY - 130, p = spen(t, 62);
  const tq = onTwos(t), base = track(STEVE, tq), pose = sum({ expr: 'neutral', ...base }, idle(tq, x), extra);
  pose.sit = 1; pose.armL = 'down'; pose.armR = 'down'; Object.assign(pose, over);
  drawCharacter(ctx, 'steve', x, hipY + 22 * s, s, pose, { frame: frameOf(t) });
  p.part(roundPoly([[x - 150 * bw, top], [x + 150 * bw, top], [x + 262 * bw, bot - 30], [x + 250 * bw, bot], [x - 250 * bw, bot], [x - 262 * bw, bot - 30]], 60), '#3f8f7a', { shade: 0.14, lw: 6 });   // the bag, up to his chest
  stains(p, x, top, bot, bw, dirt);
  p.part(roundPoly([[x - 150 * bw, top], [x + 150 * bw, top], [x + 160 * bw, top + 30], [x - 160 * bw, top + 30]], 16), '#2f6e5d', { shade: false, lw: 4 });   // folded-over rim
  p.line([[x + 60 * bw, top + 30], [x + 70 * bw, bot - 10]], 5, 'rgba(255,255,255,0.7)');
  if (box) {
    tvBox(x, bot - 6, t, 205);
    const sleeve = CAST.steve.color, sh = hipY - 23 * s;   // two arms wrapped round the box, hands on its top corners
    for (const sg of [-1, 1]) { p.line([[x + sg * 62, sh + 6], [x + sg * 200, sh + 110], [x + sg * 130, bot - 211 + 22]], 24, sleeve); p.dot(x + sg * 128, bot - 211 + 22, 17, 17, '#fffdf8'); }
  }
}
function cart(x, y, t, plant = true, k = 1) {   // a shopping cart with a dead plant; (x, y) = bottom-centre at floor
  const p = spen(t, 81);
  if (plant) {   // dead plant: brown droopy stalks in a pot
    p.part(roundPoly([[x - 40, y - 190], [x + 40, y - 190], [x + 30, y - 120], [x - 30, y - 120]], 6), '#b5673a', { shade: 0.14, lw: 4 });
    p.line([[x, y - 190], [x - 10, y - 270], [x - 60, y - 280]], 6, '#7a5a38'); p.line([[x + 4, y - 190], [x + 30, y - 260], [x + 70, y - 240]], 6, '#7a5a38');
    p.part(ellipsePts(x - 64, y - 270, 14, 8, 10), '#a88a52', { shade: false, lw: 3 });
  }
  p.part([[x - 120, y - 130], [x + 120, y - 130], [x + 90, y - 50], [x - 90, y - 50]], '#dfe6ea', { shade: 0.08, lw: 4 });
  for (let i = -2; i <= 2; i++) p.line([[x + i * 40, y - 128], [x + i * 30, y - 52]], 2.5, 'rgba(42,34,48,0.5)');
  p.line([[x - 120, y - 130], [x - 150, y - 160]], 7);
  for (const dx of [-60, 60]) p.part(ellipsePts(x + dx, y - 22, 20, 20, 16), '#2a2230', { shade: false, lw: 3 });
}
function pizza(x, y, n, t) {   // a stack of flat boxes
  const p = spen(t, 91);
  for (let i = 0; i < n; i++) { const yy = y - i * 34, dx = ((i * 37) % 21) - 10; p.part(roundPoly([[x - 95 + dx, yy - 32], [x + 95 + dx, yy - 32], [x + 95 + dx, yy], [x - 95 + dx, yy]], 4), i % 2 ? '#f5efe2' : '#efe3cd', { shade: 0.1, lw: 3.5 }); p.line([[x - 30 + dx, yy - 16], [x + 30 + dx, yy - 16]], 3, '#d9382c'); }
}

// ---------- the set ----------
// o: tag {price, date}|null · tv · banners 0..4 (stack, bottom first) · slapAt (time the newest banner landed) · rope 0..1 · sign · stoolOn
function aisle(t, o = {}) {
  ctx.fillStyle = '#dfe7ec'; ctx.fillRect(PX - 900, PY - 900, PW + 1800, FLOOR - PY + 900);
  ctx.fillStyle = '#c9c3b4'; ctx.fillRect(PX - 900, FLOOR, PW + 1800, 900);
  const p = spen(t, 3); p.line([[PX - 900, FLOOR], [PX + PW + 900, FLOOR]], 4);
  for (let i = -3; i < 14; i++) p.line([[i * 150, FLOOR], [i * 150 - 140 + 540 * 0, FLOOR + 400]], 2, 'rgba(42,34,48,0.15)');
  for (const y of [880, 1150]) {   // muted shelving
    p.line([[PX - 900, y], [PX + PW + 900, y]], 5, '#9a9fa8');
    for (let i = -8; i < 20; i++) { const x = -300 + i * 100, hh = 70 + ((i * 37 + y) % 40); p.part(roundPoly([[x, y - hh], [x + 76, y - hh], [x + 76, y], [x, y]], 4), ['#d8c8e8', '#c8dcc8', '#e8d8c0', '#c8d6e8', '#e8c8c8'][(i + (y > 1000 ? 2 : 0) + 10) % 5], { shade: 0.1, lw: 2.5 }); }
  }
  p.part(roundPoly([[PX - 20, 330], [PX + PW + 20, 330], [PX + PW + 20, 392], [PX - 20, 392]], 4), '#1f3a6e', { shade: false, lw: 4 }); hand('MEGA STORE', 540, 363, 48, 0, '#ffffff');
  if (o.tv) tvSet(t);
  if (o.tag) tagShape(565, 560 + 70 + (o.tagDy || 0), 340, 190, t, 5, o.tag.price, o.tag.date);
  if (o.rope > 0) rope(t, o.rope);
  if (o.sign) membership(560, 1105, t, o.signSwing || 0);
  const B = [['EARLY BLACK FRIDAY', '#d9382c', '#ffffff', 50, 700, 0, 0.028], ['PREVIEW', '#2f6ac8', '#ffffff', 52, 560, -0.05, -0.03], ['PRE-EARLY ACCESS', '#f2c14e', INK, 50, 660, 0.03, 0.04], ['CYBER MONDAY EARLY ACCESS', '#8e44ad', '#ffffff', 40, 740, -0.04, 0]];
  for (let i = 0; i < (o.banners || 0); i++) {
    const [txt, col, tc, sz, w, dx, rot] = B[i], last = i === (o.banners - 1);
    banner(600 + dx * 400 + (i === 3 ? -40 : 0), 450 + i * 46, w, 96 + (i === 3 ? 20 : 0), rot, col, txt, tc, sz, t, 100 + i, last && o.slapAt != null ? ease.out(seg(t, o.slapAt, o.slapAt + 0.12)) : 1);
  }
  if (o.flap) { ctx.save(); ctx.translate(900, 520); ctx.rotate(0.35 * Math.sin(t * 9) - 0.2); spen(t, 7).part([[0, 0], [60, 0], [0, 50]], '#2f6ac8', { shade: false, lw: 3 }); ctx.restore(); }
  if (o.night) { ctx.save(); ctx.fillStyle = `rgba(20,28,64,${0.5 * o.night})`; ctx.fillRect(PX - 900, PY - 900, PW + 1800, H + 1800); ctx.restore(); }
}

// ---------- characters ----------
function who(id, x, t, keys, extra = {}, scale = K, y = FLOOR) {
  const tq = onTwos(t), base = keys ? track(keys, tq) : {}, pose = sum({ expr: 'neutral', ...base }, idle(tq, x), extra);
  const m = mouthFor(id, tq); if (m) pose.mouth = m;
  drawCharacter(ctx, id, base.x ?? x, base.y ?? y, base.scale ?? scale, pose, { frame: frameOf(t) });
  return base;
}
const steve = (t, x = SX, extra = {}, scale = K, y = FLOOR) => who('steve', x, t, STEVE, extra, scale, y);
const penny = (t, x = PXX, extra = {}, y = STOOL_Y, scale = K) => who('penny', x, t, PENNY, extra, scale, y);
function bagFrame(t, { x = 540, over = {}, tvbox = true, plant = true } = {}) {   // frame-1 composition: Steve sitting in the bag, hugging the box
  if (plant) cart(170, FLOOR + 30, t, true);
  pizza(905, FLOOR + 36, 7, t);
  bagSeat(x, t, { box: tvbox, over });
}

// Steve's pointing arm at the $509 tag, drawn over his spiked hair and face so it is always clearly visible (sleeve + hand + finger).
function pointArm(t, x, wag = 0) {
  const p = spen(t, 77), sh = [x + 30, FLOOR - 59 * K], el = [x + 130, sh[1] + 70 + wag], hd = [x + 235, sh[1] + 12 + wag], ft = [x + 300, hd[1] - 22];
  p.line([sh, el, hd], 38, INK); p.line([sh, el, hd], 28, CAST.steve.color);
  p.line([hd, ft], 20, INK); p.line([hd, ft], 11, '#fffdf8'); p.dot(hd[0], hd[1], 26, 22, '#fffdf8');
}

// ---------- timeline ----------
function buildTimeline() {
  let t = 0.1;
  LINES = LINE_DEFS.map(([id, char, text, gap]) => { const L = { id, char, text, t }; t += VOICE[id].dur + gap; return L; });
  DUR = +t.toFixed(2);
  T = {
    r2: L_('15_s02').t, slap1: wt('15_s02', 2), r3: L_('15_s03').t, r4: L_('15_p04').t, r5: L_('15_s05').t, r6: L_('15_p06').t, r6b: end('15_p06') + 0.3,
    r7: L_('15_s07').t, r8: L_('15_s08').t, r9: L_('15_s09').t, shutter: L_('15_s09').t + 0.5, zap: end('15_s09') + 0.5, close: end('15_s09') + 1.0,
    r11: L_('15_s11').t, r12: L_('15_p12').t, r13: L_('15_s13').t,
  };
  T.slap2 = wt('15_p04', 0) + 0.15; T.maths = [0, 1, 2].map(i => T.r6b + 0.1 + i * 0.35); T.rope = L_('15_p06').t - 0.15; T.slap3 = L_('15_p06').t - 0.4;
  T.slap4 = end('15_s13') - 0.9; T.tl = [0, 1, 2, 3].map(i => T.r8 + i * 1.0);
  T.unroll = end('15_p12') - 0.9;
  STEVE = [
    { t: 0, expr: 'nervous', sit: 1, hair: 3, bags: 1, armL: 'hold', armR: 'hold', look: -0.4, fx: ['sweat'] },
    { t: 1.1, dur: 0.12, expr: 'nervous', sit: 1, hair: 3, bags: 1, armL: 'hold', armR: 'hold', look: 0.6, tilt: -4, fx: ['sweat'] },        // blink / eyes flick to the banner
    { t: 2.0, dur: 0.12, expr: 'deadpan', sit: 1, hair: 3, bags: 1, armL: 'hold', armR: 'hold', look: -0.3, tilt: 0, fx: ['sweat'] },
    { t: T.r2, dur: 0.2, expr: 'happy', hair: 0, bags: 0, armL: 'down', armR: 'point', look: 0.5, lean: 0 },
    { t: T.slap1, dur: 0.2, expr: 'happy', hair: 0, armR: 'point', armL: 'hips', look: 0.5, lean: 8 },                                // leans in
    { t: T.r3, dur: 0.2, expr: 'smug', hair: 0, armR: 'up', armL: 'hips', look: 0.6, lean: -2 },                                       // finger wag
    { t: T.r3 + 0.6, dur: 0.15, expr: 'smug', hair: 0, armR: 'wave', armL: 'hips', look: 0.6, tilt: 5 },
    { t: T.r3 + 1.2, dur: 0.15, expr: 'smug', hair: 0, armR: 'up', armL: 'hips', look: 0.6, tilt: -4 },
    { t: T.r4, dur: 0.2, expr: 'smug', hair: 0, armR: 'cross', armL: 'cross', look: 0.7, lean: 0, tilt: 0 },
    { t: T.r5, dur: 0.2, expr: 'smug', hair: 1, armL: 'hold', armR: 'hold', look: 0.4, lean: 3 },                                      // hand rub: hold ↔ chin
    ...[0, 1, 2].flatMap(i => [{ t: T.r5 + 0.5 + i * 0.5, dur: 0.12, expr: 'smug', hair: 1, armL: 'chin', armR: 'hold', look: 0.4 }, { t: T.r5 + 0.75 + i * 0.5, dur: 0.12, expr: 'smug', hair: 1, armL: 'hold', armR: 'chin', look: 0.4 }]),
    { t: T.r6, dur: 0.12, expr: 'shocked', hair: 1, armL: 'down', armR: 'down', look: 0.7, lean: 0 },
    { t: T.r6b, dur: 0.2, expr: 'confused', hair: 1, armL: 'hold', armR: 'up', look: -0.2, fx: ['sweat'] },                            // finger maths
    { t: T.r6b + 0.4, dur: 0.1, expr: 'confused', hair: 1, armL: 'hold', armR: 'wave', look: -0.2, fx: ['sweat'] },
    { t: T.r6b + 0.8, dur: 0.1, expr: 'dead_inside', hair: 1, armL: 'hold', armR: 'up', look: -0.2, fx: ['sweat'] },
    { t: T.r7, dur: 0.2, expr: 'deadpan', hair: 1, armL: 'cross', armR: 'cross', look: 0.5, lean: 0 },
    { t: T.r8, dur: 0.1, expr: 'dead_inside', hair: 2, bags: 0.4, sit: 1, armL: 'hold', armR: 'hold', look: 0.4 },
    { t: T.tl[2], dur: 0.1, expr: 'dead_inside', hair: 3, bags: 1, sit: 1, armL: 'hold', armR: 'hold', look: 0.4, fx: ['sweat'] },
    { t: T.r9, dur: 0.1, expr: 'nervous', hair: 3, bags: 1, sit: 1, armL: 'hold', armR: 'hold', look: 0.3, fx: ['sweat'] },
    { t: T.shutter, dur: 0.2, expr: 'nervous', hair: 3, bags: 1, armL: 'down', armR: 'down', look: 0.5, fx: ['sweat'] },                                  // stands up, hopeful
    { t: T.shutter + 1.2, dur: 0.2, expr: 'happy', hair: 3, bags: 1, armL: 'down', armR: 'down', look: 0.6 },
    { t: T.shutter + 2.4, dur: 0.2, expr: 'nervous', hair: 3, bags: 1, armL: 'down', armR: 'down', look: 0.5, fx: ['sweat'] },
    { t: T.zap, dur: 0.08, expr: 'shocked', hair: 3, bags: 1, armL: 'down', armR: 'down', look: 0.5 },
    { t: T.close, dur: 0.1, expr: 'shocked', hair: 3, bags: 1, armL: 'down', armR: 'down', look: 0.5, tilt: 0 },                                  // frozen; eye twitch below
    { t: T.close + 0.35, dur: 0.05, expr: 'horrified', hair: 3, bags: 1, armL: 'down', armR: 'down', look: 0.5, tilt: 3 },
    { t: T.close + 0.5, dur: 0.05, expr: 'shocked', hair: 3, bags: 1, armL: 'down', armR: 'down', look: 0.5, tilt: 0 },
    { t: T.r11, dur: 0.1, expr: 'furious', hair: 3, bags: 1, puff: 1, armL: 'hips', armR: 'point', look: 0.6, lean: 5, fx: ['sweat', 'vein'] },
    { t: T.r12, dur: 0.2, expr: 'furious', hair: 3, bags: 1, puff: 1, armL: 'hips', armR: 'point', look: 0.6, lean: 5, fx: ['sweat', 'vein'] },
    { t: end('15_p12') + 0.1, dur: 0.3, expr: 'dead_inside', hair: 3, bags: 1, puff: 0, armL: 'down', armR: 'down', look: 0.6, lean: 0, fx: ['sweat'] },
    { t: T.r13, dur: 0.2, expr: 'dead_inside', sit: 1, hair: 3, bags: 1, armL: 'hold', armR: 'hold', look: -0.3, fx: ['sweat'] },
  ].sort((a, b) => a.t - b.t);
  PENNY = [
    { t: 0, expr: 'deadpan', armL: 'down', armR: 'point', gun: true },
    { t: T.r4 - 0.1, dur: 0.1, expr: 'deadpan', armL: 'down', armR: 'point', gun: true },
    { t: T.slap2, dur: 0.1, expr: 'smug', armL: 'up', armR: 'point', gun: true, zap: true },                                           // slap the banner, zap the tag
    { t: T.slap2 + 0.25, dur: 0.1, expr: 'smug', armL: 'down', armR: 'point', gun: true },
    { t: T.r6 - 0.3, dur: 0.1, expr: 'deadpan', armL: 'down', armR: 'point', gun: true },
    { t: T.r6 + 0.4, dur: 0.1, expr: 'deadpan', armL: 'down', armR: 'wide', gun: true, zap: true },
    { t: T.r6 + 0.65, dur: 0.1, expr: 'deadpan', armL: 'down', armR: 'point', gun: true },
    { t: T.tl[0], dur: 0.1, expr: 'deadpan', armL: 'down', armR: 'point', gun: true, zap: true },
    { t: T.tl[0] + 0.2, dur: 0.1, expr: 'deadpan', armL: 'down', armR: 'point', gun: true },
    { t: T.zap, dur: 0.06, expr: 'deadpan', armL: 'down', armR: 'point', gun: true, zap: true },
    { t: T.zap + 0.25, dur: 0.1, expr: 'deadpan', armL: 'down', armR: 'point', gun: true },
    { t: T.r12, dur: 0.15, expr: 'smug', armL: 'wide', armR: 'down', gun: false },                                                    // flat, tiny smile, hands over the coupon
  ].sort((a, b) => a.t - b.t);
  const pennyIn = t => 520 * (1 - ease.out(seg(t, T.r4 - 0.7, T.r4 - 0.1)));   // she and her stool slide in from the right
  const stage = (t, o) => { aisle(t, o); };
  const twoShot = (t, o, cam = 1, extraS = {}, extraP = {}) => {
    withCamera(cam, 540, CAM_Y, () => {
      aisle(t, o);
      const dx = pennyIn(t); stool(PXX + dx, STOOL_Y, t); penny(t, PXX + dx, extraP); steve(t, SX, extraS);
    });
  };
  const tagAt = t => (t < T.slap2 ? { price: 499, date: 'NOV 5' } : t < T.rope + 0.3 ? { price: 479, date: 'NOV 12' } : t < T.tl[0] ? { price: 459, date: 'NOV 19' } : { price: 459, date: 'NOV 19' });
  SHOTS = [
    [0, t => withCamera(1, 540, CAM_Y, () => { aisle(t, { banners: 3, flap: true, night: 0.15 }); bagFrame(t); })],     // row 1 frame 1
    [T.r2, t => withCamera(1, 540, CAM_Y, () => {   // row 2 flashback: clean-shaven, tag $499, banner slaps down
      aisle(t, { tv: true, tag: { price: 499, date: 'NOV 5' }, banners: t >= T.slap1 ? 1 : 0, slapAt: T.slap1 }); steve(t, SX);
      if (t > T.slap1 && t < T.slap1 + 0.5) sfxText('SLAP!', 720, 640, 70, 0.1);
    })],
    [T.r3, t => withCamera(1, 540, CAM_Y, () => {   // row 3: pushes the empty cart away, wags a finger at the TV
      aisle(t, { tv: true, tag: { price: 499, date: 'NOV 5' }, banners: 1 }); cart(SX + 300 + 560 * ease.inOut(seg(t, T.r3 + 0.2, T.r3 + 1.3)), FLOOR + 80, t, false);
      steve(t, SX + 40);
    })],
    [T.r4, t => twoShot(t, { tv: true, tag: tagAt(t), banners: t >= T.slap2 ? 2 : 1, slapAt: T.slap2, tagDy: t > T.slap2 && t < T.slap2 + 0.2 ? -20 : 0 })],   // row 4: Penny, PREVIEW, $479
    [T.r5, t => twoShot(t, { tv: true, tag: tagAt(t), banners: 2 })],
    [T.r6, t => twoShot(t, { tv: true, tag: tagAt(t), banners: t >= T.slap3 ? 3 : 2, slapAt: T.slap3, rope: ease.out(seg(t, T.rope, T.rope + 0.25)), sign: t > T.rope + 0.15, signSwing: 0.07 * Math.sin((t - T.rope) * 11) * Math.exp(-(t - T.rope) * 1.5) })],
    [T.r6b, t => {   // 6b: finger maths, floating numbers one by one (turn ≈ 14 s)
      twoShot(t, { tv: true, tag: tagAt(t), banners: 3, rope: 1, sign: true });
      withCamera(1, 540, CAM_Y, () => {   // thought bubble beside his head, numbers pop one by one
        const k0 = ease.out(seg(t, T.maths[0] - 0.1, T.maths[0] + 0.1)); if (k0 <= 0) return;
        ctx.save(); ctx.globalAlpha = Math.min(1, k0); const bp = spen(t, 55);
        bp.part(roundPoly([[405, 392], [785, 392], [785, 622], [405, 622]], 40), '#ffffff', { shade: false, lw: 5 });
        for (const [cx, cy, r] of [[385, 640, 12], [362, 668, 8]]) bp.part(ellipsePts(cx, cy, r, r, 14), '#ffffff', { shade: false, lw: 4 });
        ctx.restore();
        const n = ['$459', '+ $49.99', '= $508.99'], cs = [INK, '#b86e00', '#d9382c'], ys = [450, 520, 590];
        n.forEach((s, i) => { const k = ease.outBack(seg(t, T.maths[i], T.maths[i] + 0.2)); if (k > 0) { ctx.save(); ctx.translate(595, ys[i]); ctx.scale(k, k); hand(s, 0, 0, i === 2 ? 76 : 62, 0, cs[i]); ctx.restore(); } });
      });
    }],
    [T.r7, t => twoShot(t, { tv: true, tag: tagAt(t), banners: 3, rope: 1, sign: true })],
    ...[0, 1, 2, 3].map(i => [T.tl[i], t => withCamera(1, 540, CAM_Y, () => {   // row 8: 4 held frames, same framing; only hair, eye bags, bag dirt, boxes, tag, lights change
      const tags = [469, 489, 479, 499], st = [2, 2, 3, 3][i], nights = [0, 0.6, 0, 0.6];
      const o = { tv: true, tag: { price: tags[i], date: '' }, banners: 3, rope: 1, sign: true, night: nights[i] };
      aisle(t, o); stool(PXX, STOOL_Y, t); penny(t, PXX); pizza(500, FLOOR + 36, [1, 3, 5, 7][i], t);
      bagSeat(240, t, { s: 9.5, hipY: 1215, bw: 0.75, box: false, dirt: [0.25, 0.5, 0.75, 1][i], extra: { tilt: -6 }, over: { hair: st, bags: [0.4, 0.6, 0.9, 1][i], look: 0.9, fx: i > 1 ? ['sweat'] : [] } });
    })]),
    [T.r9, t => t < T.shutter ? withCamera(1, 540, CAM_Y, () => {   // row 9: the calendar, 27, six o'clock
      ctx.fillStyle = '#dfe7ec'; ctx.fillRect(PX, PY, PW, PH);
      const p = spen(t, 30), k = ease.outBack(seg(t, T.r9, T.r9 + 0.15));
      ctx.save(); ctx.translate(310, 880); ctx.scale(k, k); ctx.translate(-310, -880);
      p.part(roundPoly([[120, 520], [500, 520], [500, 1240], [120, 1240]], 10), '#fffdf6', { shade: 0.05, lw: 5 });
      p.part([[120, 520], [500, 520], [500, 690], [120, 690]], '#d9382c', { shade: false, lw: 5 });
      hand('NOVEMBER', 310, 604, 64, 0, '#ffffff'); hand('27', 310, 880, 270, 0, INK); hand('FRIDAY', 310, 1100, 64, 0, INK); ctx.restore();
      const c = ease.outBack(seg(t, T.r9 + 0.12, T.r9 + 0.3)); ctx.save(); ctx.translate(790, 880); ctx.scale(c, c); ctx.translate(-790, -880);
      p.part(ellipsePts(790, 880, 190, 190, 48), '#fffdf6', { shade: 0.05, lw: 6 });
      p.line([[790, 880], [790, 880 + 120 * 0 - 120 * Math.cos(Math.PI)]], 12); p.line([[790, 880], [790, 740]], 8, INK); p.dot(790, 880, 12, 12, INK);
      hand('6:00', 790, 1130, 100, 0, INK); ctx.restore();
    }) : withCamera(1, 540, CAM_Y, () => {   // the shutter is already rolling UP; Steve (hopeful) stands up out of the bag in front of it
      const k = ease.inOut(seg(t, T.shutter, T.shutter + 1.6)), up = k * 1100;
      aisle(t, { tv: true, tag: { price: 499, date: '' }, banners: 3, rope: 1, sign: true });
      stool(PXX, STOOL_Y, t); penny(t, PXX);
      const sp = spen(t, 72); ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH - up); ctx.clip();
      sp.part([[PX - 5, PY - 10], [PX + PW + 5, PY - 10], [PX + PW + 5, PY + PH], [PX - 5, PY + PH]], '#b9c0c8', { shade: false, lw: 4 });
      for (let y = PY + 50; y < PY + PH; y += 60) sp.line([[PX, y], [PX + PW, y]], 3, 'rgba(42,34,48,0.35)'); ctx.restore();
      sleepingBag(300, 1500, t, 0.35);
      steve(t, 560, {}, K, FLOOR + 110 * (1 - ease.out(seg(t, T.shutter, T.shutter + 0.45))));
      const bp = spen(t, 56); bp.part(roundPoly([[PX + 20, PY + 20], [PX + 330, PY + 20], [PX + 330, PY + 90], [PX + 20, PY + 90]], 14), '#fffdf6', { shade: false, lw: 4 }); hand('FRI NOV 27 · 6:00', PX + 175, PY + 56, 30, 0, INK);
    })],
    [T.zap, t => withCamera(t < T.close ? 1.1 : 2.6, 540, t < T.close ? CAM_Y : 700, () => {   // row 10: zap → $509; then the close-up of the frozen face
      aisle(t, { tv: true, tag: t < T.zap + 0.1 ? { price: 499, date: '' } : { price: 509, date: '' }, banners: 3, rope: 1, sign: true });
      stool(PXX, STOOL_Y, t); penny(t, PXX); steve(t, SX + 120, { sit: 0 });
      if (t > T.zap && t < T.zap + 0.4) sfxText('ZAP!', 700, 780, 80, -0.1);
    }, 540, t < T.close ? CAM_Y : CAM_Y)],
    [T.r11, t => withCamera(1, 540, CAM_Y, () => {   // row 11: THE peak, the hair spikes up, pointing at $509
      aisle(t, { tv: true, tag: { price: 509, date: '' }, banners: 3, rope: 1, sign: true });
      stool(PXX, STOOL_Y, t); penny(t, PXX); const jx = t < T.r11 + 0.3 ? (Math.floor(t * 24) % 2 ? 6 : -6) : 0; steve(t, SX + jx); pointArm(t, SX + jx, jx);
    })],
    [T.r12, t => withCamera(1, 540, CAM_Y, () => {   // row 12: flat "thank you" + the coupon unrolls to the floor
      aisle(t, { tv: true, tag: { price: 509, date: '' }, banners: 3, rope: 1, sign: true });
      stool(PXX, STOOL_Y, t); const un = ease.out(seg(t, T.unroll, T.unroll + 1.0));
      steve(t, SX); pointArm(t, SX); penny(t, PXX);
      const cx = 975, cy = 860, cw = 104, h = 60 + 540 * un, p = spen(t, 99);   // coupon strip on Penny's far side, unrolling down to the floor
      p.part(roundPoly([[cx - cw / 2, cy], [cx + cw / 2, cy], [cx + cw / 2, cy + h], [cx - cw / 2, cy + h]], 4), '#ffffff', { shade: 0.04, lw: 4 });
      ctx.save(); ctx.beginPath(); ctx.rect(cx - cw / 2, cy, cw, h); ctx.clip();
      hand('THANK', cx, cy + 34, 27, 0, '#d9382c'); hand('YOU!', cx, cy + 74, 38, 0, '#d9382c');
      hand('10% OFF', cx, cy + 150, 24, 0, INK); hand('your next', cx, cy + 188, 22, 0, INK); hand('purchase*', cx, cy + 216, 22, 0, INK);
      hand('*in 2027', cx, cy + 330, 22, 0, '#6b6470'); hand('THANKS', cx, cy + 450, 24, 0, '#d9382c'); hand('THANKS', cx, cy + 520, 24, 0, '#d9382c'); ctx.restore();
    })],
    [T.r13, t => withCamera(1, 540, CAM_Y, () => {   // row 13: back to frame 1 + a new banner slaps on: the loop
      aisle(t, { banners: 4, slapAt: T.slap4, night: 0.15 });
      bagFrame(t, { over: t > end('15_s13') + 0.3 ? { expr: 'dead_inside' } : {} });
      if (t > T.slap4 && t < T.slap4 + 0.5) sfxText('SLAP!', 880, 700, 66, 0.12);
    })],
  ];
  EV = [
    ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
    { t: 0.0, type: 'muzak' }, { t: T.slap1, type: 'slap' }, { t: T.slap2, type: 'slap' }, { t: T.slap2 + 0.05, type: 'zap' }, { t: T.slap3, type: 'slap' },
    { t: T.r6 + 0.4, type: 'zap' }, { t: T.rope, type: 'snap' }, { t: T.tl[0], type: 'zap' }, { t: T.shutter, type: 'shutter' },
    { t: T.zap, type: 'zap' }, { t: T.slap4, type: 'slap' }, { t: end('15_s13') + 0.4, type: 'zip' },
  ].sort((a, b) => a.t - b.t);
}

// ---------- kinetic captions ----------
function captions(t) {
  const c = wordChunk(LINES, WORDS, t); if (!c) return null;
  ctx.save(); ctx.translate(540, CAP_Y);
  ctx.font = '600 80px Fredoka'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const parts = c.words.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), gap = 22;
  let x = -(parts.reduce((a, p) => a + p.wd, 0) + gap * (parts.length - 1)) / 2;
  for (const p of parts) { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(p.w, x, 0); ctx.fillStyle = p.stress ? '#ffd84a' : '#ffffff'; ctx.fillText(p.w, x, 0); x += p.wd + gap; }
  ctx.restore();
  return { id: c.id, text: c.words.map(w => w.w).join(' '), x0: 80, y0: CAP_Y - 60, x1: 1000, y1: CAP_Y + 60 };
}

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = '600 50px Fredoka';
  ctx.fillText(TITLE[0], 540, TITLE_Y[0]); ctx.fillText(TITLE[1], 540, TITLE_Y[1]); ctx.textAlign = 'start';
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
  panel(ctx, PX, PY, PW, PH, 5, null, frameOf(t));
  ctx.font = '600 30px Fredoka'; ctx.fillStyle = 'rgba(42,34,48,0.55)'; ctx.textAlign = 'right'; ctx.fillText('UNIT 4B', PX + PW - 24, PY + PH - 22); ctx.textAlign = 'start';
  const cap = captions(t); window.__texts = cap ? [cap] : [];
}

window.render = render; window.TEXTS = t => { render(t); return window.__texts; };
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  VOICE = await (await fetch(`${VDIR}/voice.json`)).json();
  WORDS = await (await fetch(`${VDIR}/words.json`)).json();
  buildTimeline(); window.DUR = DUR; window.EV = EV; window.T = T;
  render(0); window.READY = true;
})();
