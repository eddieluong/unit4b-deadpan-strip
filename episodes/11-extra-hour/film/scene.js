// UNIT 4B · 11 "The Extra Hour" (Tập 2) — 9:16 film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// Built from the Tập 1 post-mortem (channel/PERFORMANCE.md): the hook asks (why is he awake at 5:02?), the punch answers
// (the cat — the narrator — eats at six, *his* six); something new every 2–3 s; ~30 s; only clock digits on screen.
import { drawCharacter, nameTab, paper, panel } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts } from './lib/cast_v2.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 150, PW = 1000, PH = 1420, FLOOR = 1400, K = 7;
const INK = '#2a2230', WALL = '#e6dcc8', FLOORC = '#cdb894';
const BED = { x0: 300, x1: 1010, top: 1060 };          // mattress top
const HEAD = { x: 420, y: 1010 };                      // Steve's head on the pillow
const WIN = { x0: 560, x1: 860, y0: 470, y1: 800 };    // screen coords of the bedroom window

const LINES = [
  ['11_01_snuggles', 'snuggles', 1.6, "Saturday night. The clocks go back one hour. The human thinks it's a gift."],
  ['11_02_steve', 'steve', 6.45, "Extra hour. I'm gonna sleep so much."],
  ['11_03_steve', 'steve', 12.5, 'No. No, no, no. Sleep. Come on.'],
  ['11_04_steve', 'steve', 19.25, 'Okay. Here it comes.'],
  ['11_05_snuggles', 'snuggles', 22.5, 'Breakfast is at six.'],
  ['11_06_snuggles', 'snuggles', 24.7, 'MY six.'],
  ['11_07_steve', 'steve', 26.85, 'Happy daylight saving.'],
].map(([id, char, t, text]) => ({ id, char, t, text }));
const DUR = 29.8;
const TITLE = ['POV: you get an', 'extra hour of sleep'];
const T = { cold: 1.5, flip: 2.5, cat1: 4.3, steve: 6.4, dream: 7.9, off: 10.8, open: 11.6, plead: 12.4, turn: 14.6, sheep: 17.2, droop: 19.0, drop: 21.6, land: 21.85, kitchen: 26.2, my: 24.6 };
let VOICE = {};

const EV = [
  ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
  { t: 0.0, type: 'tick' }, { t: 0.4, type: 'bird' }, { t: T.cold, type: 'lullaby' }, { t: T.flip, type: 'flip' },
  { t: T.dream, type: 'pop' }, { t: T.off, type: 'click' }, { t: T.off + 0.2, type: 'snore' }, { t: T.open, type: 'sting' },
  { t: T.open + 0.6, type: 'tick2' }, { t: T.turn, type: 'rustle' }, { t: T.sheep, type: 'pop' }, { t: T.droop, type: 'hum' },
  { t: T.drop, type: 'stop' }, { t: T.land, type: 'thump' }, { t: T.kitchen, type: 'kibble' }, { t: T.kitchen + 1.6, type: 'crunch' },
];

// ---------- helpers ----------
const step8 = t => Math.floor(t * 8) / 8, frameOf = t => Math.floor(t * 24);
const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
function speaking(char, t) {
  for (const L of LINES) {
    if (L.char !== char) continue;
    const v = VOICE[L.id]; if (!v) continue;
    const ts = step8(t) - L.t; if (ts < 0 || ts > v.dur) continue;
    return v.env[Math.min(v.env.length - 1, Math.floor(ts * 24))] || 0;
  }
  return -1;
}
function actor(id, x, t, pose, { y = FLOOR, scale = K, frozen = false, talk = true } = {}) {
  const p = { ...pose }, e = talk ? speaking(id, t) : -1;
  if (e >= 0 && id !== 'snuggles') p.mouth = e > 0.55 ? 'wide' : e > 0.18 ? 'small' : 'line';   // Snuggles is voice-over: no lip-sync
  const blinkP = (t + (id === 'steve' ? 0.7 : 3.1)) % 4.2;
  if (!frozen && blinkP < 0.17 && (!p.eyes || p.eyes === 'dot') && !['happy', 'sleepy', 'laughing'].includes(p.expr)) p.eyes = 'closed';
  drawCharacter(ctx, id, x, y, scale, p, { frame: frozen ? 0 : frameOf(t) });
}
const pen = (x, y, s, t, seed = 1) => new VPen(ctx, x, y, s, { lw: Math.max(2.4, s * 0.85), hand: true, frame: frameOf(t), seed });
const spen = (t, seed) => { const p = pen(0, 0, 1, t, seed); p.T = q => q; return p; };   // screen-space pen
function withCamera(zoom, fx, fy, fn, sx = fx, sy = fy) {
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.translate(sx, sy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore();
}
function hand(text, x, y, size, rot = 0, color = INK, font = 'Patrick Hand', weight = '') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore();
}
function timeTag(text, t, pop = 1) {   // big yellow clock tag, screen space (after the camera)
  const p = spen(t, 91);
  ctx.save(); ctx.translate(230, 250); ctx.scale(pop, pop); ctx.translate(-230, -250);
  p.part(roundPoly([[80, 196], [380, 192], [384, 300], [84, 304]], 8), '#f7e27a', { shade: false, lw: 3.5 });
  hand(text, 232, 250, 76, -0.03, INK, 'Fredoka', '600');
  ctx.restore();
}
const jitter = (t, a = 6) => (Math.floor(t * 8) % 2 ? a : -a);
function night(alpha = 1, glow = null) {   // blue night over the whole panel; optional warm/phone glow hole
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = alpha; ctx.fillStyle = '#6f7fb4'; ctx.fillRect(PX, PY, PW, PH);
  ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 1;
  if (glow) { const g = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.r); g.addColorStop(0, glow.c); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(PX, PY, PW, PH); }
  ctx.restore();
}

// ---------- set: bedroom ----------
function bedroom(t, { moon = true } = {}) {
  ctx.fillStyle = WALL; ctx.fillRect(PX - 600, PY - 600, PW + 1200, FLOOR - PY + 600);
  ctx.fillStyle = FLOORC; ctx.fillRect(PX - 600, FLOOR, PW + 1200, PY + PH - FLOOR + 600);
  const p = pen(0, FLOOR, 1, t, 3);
  p.line([[PX - 600, 0], [PX + PW + 600, 0]], 4);
  for (const y of [60, 130]) p.line([[PX - 600, -y], [PX + PW + 600, -y]], 2, 'rgba(42,34,48,0.25)');
  // window with the night sky and the moon
  const w = spen(t, 5);
  w.part([[WIN.x0, WIN.y0], [WIN.x1, WIN.y0], [WIN.x1, WIN.y1], [WIN.x0, WIN.y1]], '#2d3c6b', { shade: false, lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); ctx.clip();
  if (moon) w.part(ellipsePts(780, 560, 42, 42, 30), '#f6efc8', { shade: false, lw: 3 });
  for (const [sx, sy] of [[610, 520], [680, 640], [820, 700], [600, 740]]) w.dot(sx, sy, 3, 3, '#f6efc8');
  ctx.restore();
  w.line([[(WIN.x0 + WIN.x1) / 2, WIN.y0], [(WIN.x0 + WIN.x1) / 2, WIN.y1]], 5);
  w.line([[WIN.x0, (WIN.y0 + WIN.y1) / 2], [WIN.x1, (WIN.y0 + WIN.y1) / 2]], 5);
  w.part([[WIN.x0 - 30, WIN.y1], [WIN.x1 + 30, WIN.y1], [WIN.x1 + 30, WIN.y1 + 26], [WIN.x0 - 30, WIN.y1 + 26]], '#efe7d6', { shade: false, lw: 4 });
  // bed: headboard, frame, mattress
  const b = spen(t, 21);
  b.part(roundPoly([[BED.x0 - 20, 820], [BED.x0 + 30, 820], [BED.x0 + 30, FLOOR], [BED.x0 - 20, FLOOR]], 10), '#9a6b4a', { shade: 0.15 });
  b.part(roundPoly([[BED.x0, BED.top + 60], [BED.x1, BED.top + 60], [BED.x1, BED.top + 200], [BED.x0, BED.top + 200]], 8), '#9a6b4a', { shade: 0.15 });
  for (const lx of [BED.x0 + 40, BED.x1 - 40]) b.line([[lx, BED.top + 200], [lx, FLOOR]], 9, '#7a5238');
  b.part(roundPoly([[BED.x0 + 20, BED.top], [BED.x1, BED.top], [BED.x1, BED.top + 70], [BED.x0 + 20, BED.top + 70]], 12), '#f4f1ea', { shade: 0.1 });
  // nightstand + digital clock
  const n = spen(t, 25);
  n.part(roundPoly([[80, 1150], [270, 1150], [270, FLOOR], [80, FLOOR]], 6), '#b98a5e', { shade: 0.15 });
  n.line([[95, 1260], [255, 1260]], 3);
  n.dot(175, 1210, 6, 6, '#e8c35a');
}
function pillow(t) { spen(t, 31).part(roundPoly([[BED.x0 + 40, BED.top - 70], [BED.x0 + 220, BED.top - 80], [BED.x0 + 230, BED.top + 10], [BED.x0 + 34, BED.top + 14]], 30), '#ffffff', { shade: 0.12 }); }
function blanket(t, x0 = 540) {   // over the legs/body, wavy top
  const p = spen(t, 33), pts = [];
  for (let x = x0; x <= BED.x1 + 10; x += 40) pts.push([x, BED.top - 30 - 60 * Math.max(0, 1 - (x - x0) / 260) + Math.sin(x * 0.02) * 10]);
  p.part([...pts, [BED.x1 + 10, BED.top + 90], [x0 - 10, BED.top + 90]], '#7fa7c9', { shade: 0.15 });
  for (let x = x0 + 60; x < BED.x1; x += 120) p.line([[x, BED.top - 20], [x + 30, BED.top + 70]], 2.5, 'rgba(42,34,48,0.3)');
}
function bedClock(t, text, glow = true) {
  const p = spen(t, 27);
  p.part(roundPoly([[96, 1060], [256, 1060], [256, 1150], [96, 1150]], 10), '#2f2b36', { shade: false });
  hand(text, 176, 1106, 54, 0, glow ? '#ff5a4a' : '#ff8a7a', 'Fredoka', '600');
}
function lamp(t, on) {
  const p = spen(t, 29);
  p.line([[230, 1060], [230, 990]], 5, '#6b625c');
  p.part([[190, 990], [270, 990], [255, 930], [205, 930]], on ? '#f7e09a' : '#c9bfa8', { shade: false, lw: 3.5 });
}
// Steve lying on his back, head on the pillow (left), body under the blanket
function steveLying(t, pose, { turned = false } = {}) {
  ctx.save();
  ctx.beginPath(); ctx.rect(PX - 600, PY - 600, HEAD.x + 130 - PX + 600, PH + 1200); ctx.rect(HEAD.x + 130, BED.top - 40, 2000, 2000); ctx.clip();   // only the head shows above the blanket (no stray limbs)
  ctx.translate(HEAD.x, HEAD.y); ctx.rotate(-Math.PI / 2); ctx.translate(-HEAD.x, -HEAD.y);
  // after rotation the character's "up" points left: put the feet to the right of the head
  actor('steve', HEAD.x, t, { arm: 'hold', ...pose }, { y: HEAD.y + 560, scale: K });
  ctx.restore();
}

// ---------- shots ----------
function cat(t, pose = {}, x = 710, y = WIN.y1 + 26, scale = 4.2) { actor('snuggles', x, t, { expr: 'side_eye', look: -0.6, ...pose }, { y, scale }); }
function shotCold(t) {   // the hook: 5:02, wide awake, phone glow
  bedroom(t); pillow(t); lamp(t, false);
  steveLying(t, { expr: 'shocked', eyes: 'wide', mouth: 'line' });
  blanket(t); bedClock(t, '5:02');
  night(1, { x: HEAD.x + 40, y: HEAD.y - 40, r: 260, c: 'rgba(170,200,255,0.55)' });
}
function shotSaturday(t) {   // lamp on, sitting up; the clock flips 1:59 → 1:00
  bedroom(t); pillow(t); lamp(t, true);
  const pose = t < T.flip + 0.6 ? { expr: 'neutral', look: -0.8 } : { expr: 'happy', look: -0.8, fx: ['sparkle'] };
  actor('steve', 470, t, { sit: true, ...pose }, { y: BED.top + 22 * K - 40 });
  blanket(t, 520);
  bedClock(t, t < T.flip ? '1:59' : '1:00');
  if (t >= T.flip && t < T.flip + 1.4) { const k = seg(t, T.flip, T.flip + 0.3); hand('+1 hour', 176, 990 - 40 * k, 52, -0.05, '#2e8b57', 'Fredoka', '600'); }
  cat(t, { expr: 'side_eye' });
  night(0.35, { x: 230, y: 960, r: 520, c: 'rgba(255,214,140,0.45)' });
}
function shotCat(t) { bedroom(t); lamp(t, true); cat(t, { expr: t < T.cat1 + 0.8 ? 'side_eye' : 'smug', look: -0.8 }); night(0.35, { x: 230, y: 960, r: 520, c: 'rgba(255,214,140,0.4)' }); }
function dreamBubble(t, x, y) {   // what he pictures: asleep, a big sun, "12:00"
  const p = spen(t, 88), k = seg(t, T.dream, T.dream + 0.25);
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
  for (const [dx, dy, r] of [[-170, 210, 14], [-130, 160, 22]]) p.part(ellipsePts(x + dx, y + dy, r, r, 18), '#fffdf6', { shade: false, lw: 3 });
  p.part(ellipsePts(x, y, 250, 150, 40), '#fffdf6', { shade: false, lw: 4 });
  p.part(ellipsePts(x + 130, y - 60, 46, 46, 30), '#f7d35c', { shade: false, lw: 3 });
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; p.line([[x + 130 + Math.cos(a) * 58, y - 60 + Math.sin(a) * 58], [x + 130 + Math.cos(a) * 76, y - 60 + Math.sin(a) * 76]], 3, '#e0a830'); }
  p.part(roundPoly([[x - 160, y + 20], [x + 60, y + 20], [x + 60, y + 60], [x - 160, y + 60]], 8), '#7fa7c9', { shade: false, lw: 3 });
  actor('steve', x - 150, t, { expr: 'sleepy' }, { y: y + 40, scale: 1.6, talk: false });
  hand('12:00', x - 20, y - 70, 54, -0.04, INK, 'Fredoka', '600');
  ctx.restore();
}
function shotPlan(t) {   // hands behind his head, smug; then the dream bubble
  bedroom(t); pillow(t); lamp(t, true);
  actor('steve', 470, t, { sit: true, expr: 'smug', arm: 'up', look: 0.2 }, { y: BED.top + 22 * K - 40 + (Math.floor(t * 4) % 2 ? 0 : 5) });
  blanket(t, 520); bedClock(t, '1:00');
  if (t >= T.dream) dreamBubble(t, 640, 560);
  night(0.35, { x: 230, y: 960, r: 520, c: 'rgba(255,214,140,0.45)' });
}
function shotOff(t) {   // the lamp clicks off; dark; zzz
  bedroom(t); pillow(t); lamp(t, false);
  steveLying(t, { expr: 'sleepy' }); blanket(t); bedClock(t, '1:00');
  night(1);
}
function shotOpen(t) {   // eyes snap open: close on the face and the clock
  bedroom(t); pillow(t); lamp(t, false);
  steveLying(t, { expr: 'shocked', eyes: 'wide', mouth: 'line' }, {}); blanket(t); bedClock(t, '5:02');
  night(0.9);
}
function shotPlead(t) {   // eyes squeezed shut, whispering; at 5:20 he turns over and puts the pillow on his head
  bedroom(t); lamp(t, false);
  const turned = t >= T.turn;
  if (!turned) { pillow(t); steveLying(t, { expr: 'angry', eyes: 'closed', fx: ['sweat'] }); blanket(t); }
  else {
    pillow(t); steveLying(t, { expr: 'dead_inside' }); blanket(t);
    spen(t, 35).part(roundPoly([[HEAD.x - 150, HEAD.y - 110], [HEAD.x + 120, HEAD.y - 125], [HEAD.x + 130, HEAD.y + 30], [HEAD.x - 160, HEAD.y + 40]], 30), '#ffffff', { shade: 0.12 });   // pillow over the head
  }
  bedClock(t, turned ? '5:20' : '5:02');
  night(0.9);
}
function sheepBubble(t, x, y) {   // counting sheep; the last one stops and stares
  const p = spen(t, 61);
  p.part(ellipsePts(x, y, 300, 190, 40), '#fffdf6', { shade: false, lw: 4 });
  for (const [dx, dy, r] of [[-230, 240, 16], [-260, 290, 10]]) p.part(ellipsePts(x + dx, y + dy, r, r, 18), '#fffdf6', { shade: false, lw: 3 });
  p.line([[x - 60, y + 110], [x - 60, y + 30]], 6, '#9a6b4a'); p.line([[x + 20, y + 110], [x + 20, y + 30]], 6, '#9a6b4a');
  p.line([[x - 80, y + 55], [x + 40, y + 55]], 6, '#9a6b4a'); p.line([[x - 80, y + 85], [x + 40, y + 85]], 6, '#9a6b4a');
  const k = seg(t, T.sheep, T.sheep + 1.0);
  const sheep = (sx, sy, stare) => {
    const q = spen(t, 63 + Math.round(sx));
    q.part(ellipsePts(sx, sy, 50, 34, 24), '#ffffff', { shade: 0.1 });
    q.part(ellipsePts(sx + (stare ? 0 : 42), sy - 14, 20, 16, 18), '#3a3440', { shade: false });
    if (stare) { q.dot(sx - 7, sy - 16, 4, 4, '#ffffff'); q.dot(sx + 7, sy - 16, 4, 4, '#ffffff'); }
    for (const lx of [-25, 25]) q.line([[sx + lx, sy + 30], [sx + lx, sy + 52]], 4);
  };
  sheep(x - 220 + 520 * k, y + 20 - Math.sin(k * Math.PI) * 120, false);      // jumping
  sheep(x + 190, y + 60, false);
  if (t > T.sheep + 0.8) sheep(x - 190, y + 60, true);                      // stops, stares at us
}
function shotSheep(t) { bedroom(t); pillow(t); lamp(t, false); steveLying(t, { expr: 'dead_inside' }); blanket(t); bedClock(t, '5:41'); night(0.9); sheepBubble(t, 470, 560); }
function shotDroop(t) {   // 5:58: eyelids drooping, a small smile
  bedroom(t); pillow(t); lamp(t, false);
  const lid = Math.min(0.95, 0.5 + 0.45 * seg(t, T.droop, T.drop - 0.3));
  steveLying(t, { expr: 'sleepy', eyes: 'dot', lid, mouth: 'smile' }); blanket(t); bedClock(t, '5:58');
  night(0.9);
}
function shotDrop(t) {   // 6:00: the cat lands on his face; his feet kick under the blanket
  bedroom(t); pillow(t); lamp(t, false);
  steveLying(t, { expr: 'shocked', eyes: 'wide' }, {});
  ctx.save(); if (t > T.land + 0.4) ctx.translate(0, Math.floor(t * 5) % 2 ? -8 : 0); blanket(t); ctx.restore(); bedClock(t, '6:00');
  const k = seg(t, T.drop, T.land), y = HEAD.y + 70 - (1 - k) * (1 - k) * 700;
  cat(t, { expr: t < T.land + 0.6 ? 'deadpan' : 'smug', look: 0 }, HEAD.x - 10, y, 5.4);
  if (t >= T.land && t < T.land + 0.25) hand('THUMP', HEAD.x + 120, HEAD.y - 260, 64, 0.08, INK, 'Fredoka', '600');
  night(0.8);
}
// ---------- set: kitchen (the button) ----------
function shotKitchen(t) {
  ctx.fillStyle = '#ddd2bd'; ctx.fillRect(PX - 600, PY - 600, PW + 1200, FLOOR - PY + 600);
  ctx.fillStyle = '#c4ad88'; ctx.fillRect(PX - 600, FLOOR, PW + 1200, 800);
  const p = pen(0, FLOOR, 1, t, 41); p.line([[PX - 600, 0], [PX + PW + 600, 0]], 4);
  const s = spen(t, 43);
  s.part([[110, 520], [380, 520], [380, 820], [110, 820]], '#1f2a4d', { shade: false, lw: 5 });          // window: still dark
  s.line([[245, 520], [245, 820]], 5); s.line([[110, 670], [380, 670]], 5);
  s.part(roundPoly([[640, 880], [980, 880], [980, FLOOR], [640, FLOOR]], 8), '#e9e4da', { shade: 0.1 });   // oven
  s.part(roundPoly([[680, 1020], [940, 1020], [940, 1300], [680, 1300]], 10), '#3a3440', { shade: false });
  s.part(roundPoly([[740, 905], [880, 905], [880, 975], [740, 975]], 6), '#1d1b22', { shade: false });
  hand('6:01', 810, 942, 50, 0, '#5af07a', 'Fredoka', '600');                                               // never changed
  s.part(ellipsePts(560, FLOOR - 14, 52, 16, 24), '#c0392b', { shade: false });                              // bowl
  const pouring = t < T.kitchen + 1.6;
  actor('steve', 430, t, { expr: 'dead_inside', armR: pouring ? 'point' : 'down', look: 0.6 });
  if (pouring) {   // kibble bag + falling bits
    const b = pen(430 + 23 * K, FLOOR - 70 * K, K, t, 45);
    b.part(roundPoly([[-5, -8], [6, -8], [6, 8], [-5, 8]], 1), '#e7b85a', { shade: 0.15 });
    for (let i = 0; i < 6; i++) { const yy = FLOOR - 62 * K + ((step8(t) * 900 + i * 70) % 420); spen(t, 47 + i).dot(560 + (i % 3) * 10 - 10, yy, 5, 5, '#8a5a2b'); }
  }
  cat(t, { expr: 'happy', look: -0.6 }, 610, FLOOR + (Math.floor(t * 6) % 2 ? 6 : 0), 4.6);   // eating: head bob
  night(0.55, { x: 810, y: 940, r: 260, c: 'rgba(120,255,150,0.25)' });
}

// ---------- captions ----------
function captionAt(t) {
  for (let i = 0; i < LINES.length; i++) {
    const L = LINES[i], v = VOICE[L.id]; if (!v) continue;
    const next = LINES[i + 1] ? LINES[i + 1].t - 0.05 : DUR;
    const end = Math.min(next, L.t + Math.max(v.dur + 0.5, 0.9 + L.text.length / 17));
    if (t >= L.t && t < end) return L;
  }
  return null;
}
function wrap(text, maxW) {
  const words = text.split(' '), out = []; let cur = '';
  for (const w of words) { const s = cur ? cur + ' ' + w : w; if (ctx.measureText(s).width > maxW && cur) { out.push(cur); cur = w; } else cur = s; }
  if (cur) out.push(cur); return out;
}
function caption(t) {
  const L = captionAt(t); if (!L) return null;
  ctx.font = '54px "Patrick Hand"';
  const lines = wrap(L.text, 860), lh = 62, h = 70 + lines.length * lh, y0 = 1600;
  ctx.fillStyle = '#fbf7ee'; ctx.strokeStyle = INK; ctx.lineWidth = 4.5;
  ctx.beginPath(); ctx.roundRect(70, y0, 940, h, 22); ctx.fill(); ctx.stroke();
  nameTab(ctx, 96, y0 - 30, L.char, 30);
  ctx.fillStyle = INK; ctx.font = '54px "Patrick Hand"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  lines.forEach((s, i) => ctx.fillText(s, 540, y0 + 82 + i * lh)); ctx.textAlign = 'start';
  return { id: L.id, text: L.text, x0: 70, y0: y0 - 30, x1: 1010, y1: y0 + h };
}

// ---------- frame ----------
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.fillStyle = INK; ctx.textAlign = 'center';
  ctx.font = '600 52px Fredoka'; ctx.fillText(TITLE[0], 540, 72); ctx.fillText(TITLE[1], 540, 132);
  ctx.textAlign = 'start';
  const bedCam = (fn, zoom = 1.3, fx = 560, fy = 1000) => withCamera(zoom, fx, fy, fn, 540, 900);
  let tag = null;
  if (t < T.cold) { bedCam(() => shotCold(t), 1.7, 380, 1010); tag = '5:02 AM'; }
  else if (t < T.cat1) bedCam(() => shotSaturday(t), 1.15 + 0.05 * seg(t, T.cold, T.cat1), 450, 980);
  else if (t < T.steve) withCamera(1.9, 710, 700, () => shotCat(t), 540, 860);
  else if (t < T.off) bedCam(() => shotPlan(t), 1.15, 470, 900);
  else if (t < T.open) { bedCam(() => shotOff(t), 1.15, 470, 1000); if (t > T.off + 0.2) hand('z z z', 640, 760, 70, -0.1, '#d8dcf0'); }
  else if (t < T.plead) { bedCam(() => shotOpen(t), 1.9 - 0.2 * seg(t, T.open, T.open + 0.3), 300, 1060); tag = '5:02 AM'; }
  else if (t < T.sheep) { withCamera(1.7, 380, 1030, () => shotPlead(t), 540 + (t < T.turn ? jitter(t, 3) : 0), 900); tag = t < T.turn ? '5:02 AM' : '5:20 AM'; }
  else if (t < T.droop) { bedCam(() => shotSheep(t), 1.15, 520, 900); tag = '5:41 AM'; }
  else if (t < T.drop) { withCamera(1.8 + 0.15 * seg(t, T.droop, T.drop), 380, 1010, () => shotDroop(t), 540, 900); tag = '5:58 AM'; }
  else if (t < T.my) { withCamera(1.6 + 0.3 * seg(t, T.land, T.my), 400, 960, () => shotDrop(t), 540 + (t >= T.land && t < T.land + 0.3 ? jitter(t, 14) : 0), 900); tag = '6:00 AM'; }
  else if (t < T.kitchen) { withCamera(2.5 + 0.15 * seg(t, T.my, T.kitchen), HEAD.x - 10, HEAD.y - 120, () => shotDrop(t), 540, 860); }
  else { withCamera(1.25 + 0.15 * seg(t, T.kitchen, DUR), 560, 1060, () => shotKitchen(t), 540, 940); }
  if (tag) timeTag(tag, t);
  panel(ctx, PX, PY, PW, PH, 5, null, frameOf(t));
  ctx.font = '600 30px Fredoka'; ctx.fillStyle = 'rgba(42,34,48,0.55)'; ctx.textAlign = 'right'; ctx.fillText('UNIT 4B', PX + PW - 24, PY + PH - 22); ctx.textAlign = 'start';
  const cap = caption(t); window.__texts = cap ? [cap] : [];
}

window.DUR = DUR; window.EV = EV; window.render = render; window.TEXTS = t => { render(t); return window.__texts; };
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  VOICE = await (await fetch('voice/voice.json')).json();
  render(0); window.READY = true;
})();
