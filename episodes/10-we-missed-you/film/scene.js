// UNIT 4B · 10 "We Missed You" (Tập 1) v7 — 9:16 film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// Show, don't say — but keep the lines that add attitude, irony or inner logic the picture can't (Steve's muttering).
import { drawCharacter, nameTab, paper, panel } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts } from './lib/cast_v2.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 150, PW = 1000, PH = 1420, FLOOR = 1400, K = 7;
const INK = '#2a2230', WALL = '#ece2cf', FLOORC = '#d8c6a8', DOOR = '#c7a985';
const WIN = { x0: 90, x1: 380, y0: 560, y1: 960 };
const DOOR_X0 = 650, DOOR_X1 = 920, DOOR_TOP = 610;
const CHAIR_X = 450;

const LINES = [
  ['10_01_snuggles', 'snuggles', 2.0, 'Nine a.m. The human has taken a day off... to wait for a package.'],
  ['10_02_steve', 'steve', 6.9, 'Okay. Nine to five. Easy.'],
  ['10_03_steve', 'steve', 10.4, "Oh, nice. He's close."],
  ['10_04_steve', 'steve', 15.3, "...it's the garbage truck."],
  ['10_06_steve', 'steve', 21.0, "Okay... thirty seconds. I'll be thirty seconds."],
  ['10_07_steve', 'steve', 30.4, '...cool.'],
  ['10_08_steve', 'steve', 32.4, "...I'll just take another day off."],
  ['10_09_snuggles', 'snuggles', 35.4, 'Same chair. Same door. Tomorrow.'],
].map(([id, char, t, text]) => ({ id, char, t, text }));
const DUR = 39.8;
const TITLE = ['POV: you took the day off', 'for a package'];   // on-screen hook, the whole video
const T = { cold: 1.8, app1: 4.4, pocket: 5.6, lean: 6.5, app2: 9.3, sitUp: 10.3, map: 12.6, truck: 13.8, three: 17.6, light0: 19.6, late: 20.8, map2: 21.6, map2e: 22.6, look: 23.0, bubble: 23.4, run: 26.4, wc: 27.0, flush: 27.8, note: 28.6, melt: 29.6, app3: 32.2, dayoff: 33.2, back: 35.2 };
let VOICE = {};

const EV = [
  ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
  { t: 0.0, type: 'cold' }, { t: 0.0, type: 'tick' }, { t: 0.05, type: 'paper' }, { t: T.cold, type: 'wait' }, { t: T.pocket + 0.3, type: 'crack' }, { t: T.app2, type: 'buzz' }, { t: T.sitUp + 0.2, type: 'ding' },
  { t: T.truck + 0.1, type: 'truck' }, { t: T.truck + 0.3, type: 'chair' }, { t: T.light0, type: 'violin' }, { t: T.late, type: 'wait2' },
  { t: T.bubble, type: 'pop' }, { t: T.run, type: 'steps' }, { t: T.wc + 0.1, type: 'door' }, { t: T.flush, type: 'flush' },
  { t: T.note, type: 'stop' }, { t: T.app3, type: 'buzz' }, { t: T.dayoff + 0.7, type: 'whoosh' }, { t: T.back + 0.2, type: 'wait3' },
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
function actor(id, x, t, pose, { y = FLOOR, scale = K, frozen = false } = {}) {
  const p = { ...pose }, e = speaking(id, t);
  if (e >= 0 && id !== 'snuggles') p.mouth = e > 0.55 ? 'wide' : e > 0.18 ? 'small' : 'line';   // Snuggles is voice-over: no lip-sync
  const blinkP = (t + (id === 'steve' ? 0.7 : 3.1)) % 4.2;
  if (!frozen && blinkP < 0.17 && (!p.eyes || p.eyes === 'dot') && !['happy', 'sleepy', 'laughing'].includes(p.expr)) p.eyes = 'closed';
  drawCharacter(ctx, id, x, y, scale, p, { frame: frozen ? 0 : frameOf(t) });
}
const pen = (x, y, s, t, seed = 1) => new VPen(ctx, x, y, s, { lw: Math.max(2.4, s * 0.85), hand: true, frame: frameOf(t), seed });
function withCamera(zoom, fx, fy, fn, sx = fx, sy = fy) {
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.translate(sx, sy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore();
}
function hand(text, x, y, size, rot = 0, color = INK) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${size}px "Patrick Hand"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore();
}
function timeTag(text, t) {
  const p = pen(0, 0, 1, t, 91); p.T = q => q;
  p.part(roundPoly([[80, 200], [340, 196], [344, 280], [84, 284]], 6), '#f7e27a', { shade: false, lw: 3 });
  hand(text, 212, 240, 54, -0.03);
}
const jitter = (t, a = 6) => (Math.floor(t * 8) % 2 ? a : -a);

// ---------- set ----------
function room(t, { grey = false, light = 'day', tally = 0 } = {}) {
  ctx.save(); if (grey) ctx.filter = 'grayscale(1)';
  ctx.fillStyle = WALL; ctx.fillRect(PX - 600, PY - 600, PW + 1200, FLOOR - PY + 600);
  ctx.fillStyle = FLOORC; ctx.fillRect(PX - 600, FLOOR, PW + 1200, PY + PH - FLOOR + 600);
  const p = pen(0, FLOOR, 1, t, 3);
  p.line([[PX - 600, 0], [PX + PW + 600, 0]], 4);
  for (const y of [60, 130]) p.line([[PX - 600, -y], [PX + PW + 600, -y]], 2, 'rgba(42,34,48,0.25)');
  const sky = light === 'eve' ? '#f2b98a' : '#bfe0f2';
  p.part([[WIN.x0, FLOOR - WIN.y1], [WIN.x1, FLOOR - WIN.y1], [WIN.x1, FLOOR - WIN.y0], [WIN.x0, FLOOR - WIN.y0]], sky, { shade: false, lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); ctx.clip();
  p.part(ellipsePts(300, FLOOR - (light === 'eve' ? 900 : 640), 40, 40, 30), light === 'eve' ? '#f08a5d' : '#f7d35c', { shade: false, lw: 3 });
  p.part(ellipsePts(170, FLOOR - 700, 52, 20, 30), '#ffffff', { shade: false, lw: 3 });
  ctx.restore();
  p.line([[(WIN.x0 + WIN.x1) / 2, FLOOR - WIN.y0], [(WIN.x0 + WIN.x1) / 2, FLOOR - WIN.y1]], 5);
  p.line([[WIN.x0, FLOOR - (WIN.y0 + WIN.y1) / 2], [WIN.x1, FLOOR - (WIN.y0 + WIN.y1) / 2]], 5);
  p.part([[WIN.x0 - 26, FLOOR - WIN.y1 - 24], [WIN.x1 + 26, FLOOR - WIN.y1 - 24], [WIN.x1 + 26, FLOOR - WIN.y1], [WIN.x0 - 26, FLOOR - WIN.y1]], '#efe7d6', { shade: false, lw: 4 });
  p.part([[DOOR_X0, 0], [DOOR_X1, 0], [DOOR_X1, FLOOR - DOOR_TOP], [DOOR_X0, FLOOR - DOOR_TOP]], DOOR, { shade: false, lw: 4 });
  p.dot(DOOR_X0 + 32, 380, 9, 9, '#e8c35a');
  p.part(roundPoly([[DOOR_X0 + 50, 470], [DOOR_X1 - 50, 470], [DOOR_X1 - 50, 720], [DOOR_X0 + 50, 720]], 6), null, { shade: false, lw: 2.5 });
  p.line([[DOOR_X0 - 18, FLOOR - DOOR_TOP + 18], [DOOR_X1 + 18, FLOOR - DOOR_TOP + 18], [DOOR_X1 + 18, 0]], 3.5);
  p.line([[DOOR_X0 - 18, 0], [DOOR_X0 - 18, FLOOR - DOOR_TOP + 18]], 3.5);
  ctx.restore();
  if (tally) tallyMarks(t, tally);
}
function tallyMarks(t, n) {   // how many times he refreshed the app, scratched on the wall like a prisoner
  const p = pen(0, 0, 1, t, 7); p.T = q => q;
  for (let i = 0; i < n; i++) {
    const g = Math.floor(i / 5), r = i % 5, gx = 440 + (g % 4) * 52, gy = 470 + Math.floor(g / 4) * 64;
    if (r < 4) p.line([[gx + r * 9, gy], [gx + r * 9 + 2, gy + 50]], 3.5);
    else p.line([[gx - 6, gy + 40], [gx + 40, gy + 10]], 3.5);
  }
}
const TALLY = t => t < T.map ? 0 : t < T.truck ? 6 : t < T.three ? 14 : 41;
function chair(x, t) {   // a plain wooden kitchen chair, seat ~22 units high
  const p = pen(x, FLOOR, K, t, 17);
  for (const sx of [-1, 1]) p.line([[sx * 12, 0], [sx * 12, 21]], p.lw * 1.1, '#8a6040');
  p.part(roundPoly([[-15, 20], [15, 20], [15, 23.5], [-15, 23.5]], 1), '#b98a5e', { shade: 0.2 });
  for (const sx of [-1, 1]) p.line([[sx * 12, 23], [sx * 12, 52]], p.lw * 1.1, '#8a6040');
  p.part(roundPoly([[-13, 44], [13, 44], [13, 52], [-13, 52]], 1.5), '#b98a5e', { shade: 0.2 });
}
function steveInChair(t, pose, { frozen = false, y = FLOOR, x = CHAIR_X } = {}) { chair(CHAIR_X, t); actor('steve', x, t, { sit: true, look: 0.7, ...pose }, { frozen, y }); }
function noteOnDoor(t) {
  const cx = (DOOR_X0 + DOOR_X1) / 2, cy = 900, p = pen(cx, cy, 6, t, 97);
  p.part(roundPoly([[-17, -12], [17, -13], [17, 12], [-17, 12]], 0.8), '#fffdf2', { shade: false });
  p.fill([[-4, 11], [4, 11], [4, 14], [-4, 14]], 'rgba(240,220,140,0.9)');
  hand('SORRY', cx, cy - 34, 46, -0.04, '#c0392b'); hand('WE MISSED', cx, cy + 6, 40, -0.04, '#c0392b'); hand('YOU!', cx, cy + 44, 46, -0.04, '#c0392b');
}
function phoneFrame(t) {
  ctx.fillStyle = '#e9dcc3'; ctx.fillRect(PX, PY, PW, PH);
  const p = pen(540, 1330, 14, t, 71);
  p.part(roundPoly([[-21, 0], [21, 0], [21, 72], [-21, 72]], 5), '#2f2b36', { shade: false });
  p.part(roundPoly([[-18, 5], [18, 5], [18, 67], [-18, 67]], 3), '#fbfaf6', { shade: false, lw: 3 });
}
function phone(t, lines, sub) {
  phoneFrame(t);
  ctx.save(); ctx.textAlign = 'center';
  lines.forEach(([txt, size, col], i) => { ctx.font = `600 ${size}px Fredoka`; ctx.fillStyle = col || INK; ctx.fillText(txt, 540, 1330 - 54 * 14 + i * 110); });
  if (sub) { ctx.font = '48px "Patrick Hand"'; ctx.fillStyle = '#6b625c'; ctx.fillText(sub, 540, 1330 - 20 * 14); }
  ctx.restore();
}
function phoneMap(t, sub = 'refreshed just now') {   // tracking map: a tiny truck that has not moved
  phoneFrame(t);
  const p = pen(540, 1330, 14, t, 75);
  p.fill(roundPoly([[-17, 22], [17, 22], [17, 64], [-17, 64]], 2), '#e4efe0');
  p.line([[-13, 26], [-6, 40], [4, 34], [10, 50], [14, 60]], 5, '#7aa6c2');
  p.part(roundPoly([[-15, 24], [-10, 24], [-10, 28], [-15, 28]], 0.6), '#f2c14e', { shade: false, lw: 2 });
  p.dot(14, 60, 1.6, 1.6, '#c0392b');
  ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = INK;
  ctx.font = '600 60px Fredoka'; ctx.fillText('Stop 14 of 87', 540, 1330 - 14 * 14);
  ctx.font = '44px "Patrick Hand"'; ctx.fillStyle = '#6b625c'; ctx.fillText(sub, 540, 1330 - 9 * 14);
  ctx.restore();
}
function thoughtBubble(t, x, y) {   // "30 sec?" next to a toilet
  const p = pen(0, 0, 1, t, 88); p.T = q => q;
  for (const [dx, dy, r] of [[-70, 120, 12], [-45, 80, 18]]) p.part(ellipsePts(x + dx, y + dy, r, r, 18), '#fffdf6', { shade: false, lw: 3 });
  p.part(ellipsePts(x + 60, y - 20, 185, 105, 40), '#fffdf6', { shade: false, lw: 4 });
  const q = pen(x - 45, y + 45, 4.2, t, 89);   // a toilet you can read at a glance: tank, seat, bowl
  q.part(roundPoly([[-11, 14], [3, 14], [3, 30], [-11, 30]], 1.5), '#ffffff', { shade: 0.15 });
  q.part(roundPoly([[-12, 8], [16, 8], [16, 13], [-12, 13]], 2), '#ffffff', { shade: 0.15 });
  q.part(roundPoly([[-8, -2], [12, -2], [14, 8], [-10, 8]], 2), '#ffffff', { shade: 0.15 });
  q.part(roundPoly([[-3, -8], [7, -8], [7, -2], [-3, -2]], 1), '#ffffff', { shade: 0.15 });
  hand('30 sec?', x + 120, y - 15, 62, -0.05);
}

// ---------- shots ----------
function cat(t, pose = {}) { actor('snuggles', 245, t, { expr: 'side_eye', look: 0.8, ...pose }, { y: WIN.y1 + 26, scale: 4.2 }); }   // the narrator, watching from the sill
function shotCold(t) {   // cold open: the ending first — the note, and his face
  room(t, { light: 'eve', tally: 41 });
  noteOnDoor(t);
  actor('steve', 470, t, { expr: 'dead_inside', look: 0.9 }, { frozen: true });
}
function dreamFrame() {   // soft cloud edge so the cutaway reads as "inside his head"
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.88)';
  for (let x = PX; x <= PX + PW; x += 70) for (const y of [PY, PY + PH]) { ctx.beginPath(); ctx.arc(x, y, 62, 0, Math.PI * 2); ctx.fill(); }
  for (let y = PY; y <= PY + PH; y += 70) for (const x of [PX, PX + PW]) { ctx.beginPath(); ctx.arc(x, y, 62, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function shotMorning(t) { room(t); timeTag('9:00 AM', t); hand('earlier that day', 212, 320, 44, -0.03, '#6b625c'); cat(t); steveInChair(t, { expr: 'neutral' }); }
function phoneInset(t, lines) {   // the phone in his hand, blown up beside him like a comic inset
  const x0 = 690, y0 = 560, p = pen(0, 0, 1, t, 77); p.T = q => q;
  p.line([[x0 - 20, y0 + 300], [CHAIR_X + 40, 980]], 3, 'rgba(42,34,48,0.5)');
  p.part(roundPoly([[x0 - 140, y0], [x0 + 140, y0], [x0 + 140, y0 + 330], [x0 - 140, y0 + 330]], 26), '#2f2b36', { shade: false });
  p.part(roundPoly([[x0 - 122, y0 + 24], [x0 + 122, y0 + 24], [x0 + 122, y0 + 306], [x0 - 122, y0 + 306]], 16), '#fbfaf6', { shade: false, lw: 3 });
  ctx.save(); ctx.textAlign = 'center';
  lines.forEach(([txt, size, col], i) => { ctx.font = `600 ${size}px Fredoka`; ctx.fillStyle = col || INK; ctx.fillText(txt, x0, y0 + 100 + i * 80); });
  ctx.restore();
}
function shotConfident(t) {   // phone in hand → phone on the knee, knuckle crack → leans back, hands behind his head
  room(t);
  if (t < T.pocket) { steveInChair(t, { expr: 'neutral', look: 0.9, armR: 'hold' }); phoneInset(t, [['Your delivery', 30], ['TODAY', 50, '#2e8b57'], ['9 AM – 5 PM', 34]]); }
  else if (t < T.lean) { const crack = Math.floor(t * 8) % 2 ? 'hold' : 'shrug'; steveInChair(t, { expr: 'smug', look: 0.4, armL: crack, armR: crack }); }
  else steveInChair(t, { expr: 'smug', look: 0.6, arm: 'up' }, { y: FLOOR + 10 + (Math.floor(t * 4) % 2 ? 0 : 6) });   // leaning back, nodding
}
function shotSitUp(t) { room(t); steveInChair(t, { expr: 'happy', fx: ['sparkle', 'blush'] }, { y: FLOOR - (t > T.sitUp + 0.2 ? 20 : 0) }); }
function shotMap(t) { phoneMap(t); timeTag('11:00 AM', t); }
function garbageTruck(t, k) {
  ctx.save(); ctx.beginPath(); ctx.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); ctx.clip();
  const x = WIN.x1 + 60 - (WIN.x1 - WIN.x0 + 420) * k, p = pen(x, 950, 2.6, t, 33);
  p.part(roundPoly([[0, 0], [130, 0], [130, 70], [0, 70]], 4), '#6aa36f', { shade: 0.1 });
  p.part(roundPoly([[-40, 0], [0, 0], [0, 50], [-30, 50], [-40, 30]], 3), '#e8e2d2', { shade: false });
  for (const wx of [-20, 95]) p.part(ellipsePts(wx, 0, 11, 11, 18), '#3a3440', { shade: false });
  hand('GARBAGE', x + 170, 950 - 95, 46, 0, '#fffdf6');
  ctx.restore();
}
function shotTruck(t) {   // the one small peak: jumps up, checks the window, his face drops, sits back down
  room(t, { tally: TALLY(t) }); timeTag('1:00 PM', t);
  chair(CHAIR_X, t);
  const up = t > T.truck + 0.3 && t < T.truck + 3.2;
  garbageTruck(t, seg(t, T.truck + 0.5, T.truck + 3.0));
  if (up) actor('steve', 530, t, t < T.truck + 1.4 ? { expr: 'grin', look: -0.9, arm: 'up' } : { expr: 'dead_inside', look: -0.6 });
  else actor('steve', CHAIR_X, t, { sit: true, expr: t < T.truck + 0.2 ? 'neutral' : 'deadpan', look: 0.7 });
}
function stinkLines(x, y, t) {
  const p = pen(0, FLOOR, 1, t, 41);
  for (const dx of [-60, 0, 60]) { const pts = []; for (let i = 0; i <= 8; i++) pts.push([x + dx + Math.sin(i * 1.3 + step8(t) * 3) * 10, FLOOR - (y - i * 12)]); p.line(pts, 3.5, '#8fae6a'); }
}
function shotAfternoon(t) {
  room(t, { tally: TALLY(t) }); timeTag('3:00 PM', t); cat(t, { expr: 'deadpan' });
  steveInChair(t, { expr: 'dead_inside', armL: 'hold' });
  const p = pen(CHAIR_X + 3, FLOOR - (48 - 15) * K, K, t, 45);   // cracker box in his hand
  p.part(roundPoly([[-5, -4], [5, -4], [5, 7], [-5, 7]], 0.8), '#e7b85a', { shade: 0.15 });
  stinkLines(CHAIR_X, FLOOR - (15 + 98) * K, t);
  for (let i = 0; i < 5; i++) pen(CHAIR_X - 60 + i * 30, FLOOR - 4, K, t, 50 + i).dot(0, 0, 0.9, 0.6, '#d8a95a');
}
function shotLighthouse(t) {   // 1.3 s cutaway: how it feels inside
  ctx.fillStyle = '#5b7fa6'; ctx.fillRect(PX, PY, PW, PH);
  ctx.fillStyle = '#2f4f74'; ctx.fillRect(PX, 1150, PW, 420);
  const p = pen(0, 0, 1, t, 61); p.T = q => q;
  for (let i = 0; i < 6; i++) { const y = 1180 + i * 60; p.line([[PX + 40 + (i % 2) * 60, y], [PX + 200, y - 10], [PX + 360, y], [PX + 520, y - 10], [PX + 680, y], [PX + 840, y - 10], [PX + 980, y]], 3, '#9ec3e6'); }
  p.part([[600, 1250], [820, 1250], [780, 700], [640, 700]], '#f4efe4', { shade: false, lw: 4 });
  for (const y of [1100, 950, 800]) p.fill([[600 + (1250 - y) * 0.073, y], [820 - (1250 - y) * 0.073, y], [820 - (1250 - y + 70) * 0.073, y - 70], [600 + (1250 - y + 70) * 0.073, y - 70]], '#3d5a96');
  p.part([[630, 700], [790, 700], [790, 620], [630, 620]], '#f7e9a8', { shade: false, lw: 4 });
  actor('steve', 710, t, { expr: 'sad', look: -0.9, arm: 'down' }, { y: 690, scale: 2.2 });
  ctx.save(); ctx.globalAlpha = 0.35 + 0.2 * Math.sin(step8(t) * 6); ctx.fillStyle = '#fff6c0';
  ctx.beginPath(); ctx.moveTo(710, 650); ctx.lineTo(PX, 520); ctx.lineTo(PX, 760); ctx.closePath(); ctx.fill(); ctx.restore();
}
function shotLate(t) {   // 4:58: squirming, checks the phone, glances at the bathroom, the idea, a nod, he runs
  room(t, { light: 'eve', tally: 41 });
  const run = t >= T.run, k = step8(seg(t, T.run, T.run + 0.5));
  if (run) { chair(CHAIR_X, t); actor('steve', CHAIR_X - 420 * k, t, { expr: 'nervous', look: -0.9, arm: 'up', fx: ['sweat'] }); return; }
  cat(t, { expr: 'smug' });
  const nod = t > T.bubble + 1.6 && Math.floor(t * 6) % 2;
  const torn = t >= T.bubble && t < T.bubble + 1.6;   // eyes flick between the front door and the bathroom, legs bouncing
  const look = torn ? (Math.floor(t * 2.5) % 2 ? 0.9 : -0.9) : t < T.look ? 0.7 : -0.9;
  const pose = t < T.look ? { expr: 'nervous', look, armR: 'hold', fx: ['sweat'] } : { expr: t < T.bubble + 1.6 ? 'skeptical' : 'grin', look, fx: ['sweat'] };
  steveInChair(t, pose, { x: CHAIR_X + jitter(t, t < T.look || torn ? 6 : 0), y: FLOOR + (nod ? 8 : torn && Math.floor(t * 8) % 2 ? 5 : 0) });
  if (t >= T.bubble) thoughtBubble(t, 300, 520);
}
function shotWC(t) {
  ctx.fillStyle = '#d9e4e6'; ctx.fillRect(PX, PY, PW, PH);
  const p = pen(540, 1400, 7, t, 81);
  p.part([[-26, 0], [26, 0], [26, 110], [-26, 110]], '#9cc3c9', { shade: false });
  p.dot(-19, 50, 1.6, 1.6, '#e8c35a');
  p.part(roundPoly([[-8, 80], [8, 80], [8, 92], [-8, 92]], 2), '#fffdf6', { shade: false, lw: 3 });
  hand('WC', 540, 1400 - 86 * 7, 64);
  timeTag('0:30', t);
  if (t >= T.flush) hand('flush', 880, 1000, 64, 0.06, '#3f7f8c');
}
function shotNote(t) {
  const melting = t >= T.melt && t < T.melt + 0.17;   // one-frame melt, then snaps back
  room(t, { light: 'eve', grey: t >= T.melt, tally: 41 });
  noteOnDoor(t);
  cat(t, { expr: t < T.melt ? 'shocked' : 'deadpan' });
  ctx.save();
  if (melting) { ctx.translate(380, FLOOR); ctx.scale(1.12, 0.82); ctx.translate(-380, -FLOOR); }
  actor('steve', 380, t, { expr: t < T.melt ? 'shocked' : 'dead_inside', look: 0.8, ...(melting ? { eyes: 'spiral', mouth: 'wobble' } : {}) }, { frozen: t < T.melt });
  ctx.restore();
}
function shotDayOff(t) {   // he files another day off: the form, then the tick
  const sent = t >= T.dayoff + 0.7;   // SENT stays on screen for 1.3 s
  const pop = sent && t < T.dayoff + 0.95 ? 1.35 : 1;   // SENT pops in
  phone(t, [['Request day off', 58], ['TOMORROW', 76, '#3d5a96'], [sent ? 'SENT ✓' : 'Reason: personal', sent ? Math.round(84 * pop) : 52, sent ? '#2e8b57' : '#6b625c']]);
  if (sent) { const q = pen(540, 1330, 14, t, 79); for (const [dx, dy] of [[-15, 35], [15, 35], [-13, 46], [13, 46]]) q.dot(dx, dy, 0.8, 0.8, '#f2c14e'); }
}
function shotLoop(t) {   // next morning: he sighs, sits; the cat yawns
  room(t, { tally: 41 }); timeTag('9:00 AM', t);
  const sigh = t > T.back + 0.9 && t < T.back + 1.5, yawn = t > T.back + 2.6 && t < T.back + 3.4;
  cat(t, yawn ? { expr: 'sleepy', mouth: 'O' } : { expr: 'smug' });
  steveInChair(t, { expr: sigh ? 'sad' : 'dead_inside' }, { y: FLOOR + (sigh ? 12 : 0) });
}

// ---------- captions ----------
function captionAt(t) {
  for (let i = 0; i < LINES.length; i++) {
    const L = LINES[i], v = VOICE[L.id]; if (!v) continue;
    const next = LINES[i + 1] ? LINES[i + 1].t - 0.05 : DUR;
    const end = Math.min(next, L.t + Math.max(v.dur + 0.6, 0.9 + L.text.length / 17));
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
  const wide = (fn, zoom = 1.3, fx = 545, fy = 1000, sx = 540, sy = 1000) => withCamera(zoom, fx, fy, fn, sx, sy);   // closer than v5: faces read on a phone
  if (t < T.cold) withCamera(1.6, 640, 900, () => shotCold(t), 540, 860);
  else if (t < T.app1) wide(() => shotMorning(t), 1.3 + 0.05 * seg(t, T.cold, T.app1));
  else if (t < T.app2) withCamera(1.35, CHAIR_X + 110, 900, () => shotConfident(t), 540, 860);
  else if (t < T.sitUp) withCamera(1, 540, 900, () => phone(t, [['Your package is', 60], ['OUT FOR', 96, '#2e8b57'], ['DELIVERY', 96, '#2e8b57']]));
  else if (t < T.map) withCamera(1.6, CHAIR_X, 900, () => shotSitUp(t), 540, 860);
  else if (t < T.truck) withCamera(1, 540, 900, () => shotMap(t));
  else if (t < T.three) wide(() => shotTruck(t), 1.3, 470);
  else if (t < T.light0) wide(() => shotAfternoon(t), 1.35);
  else if (t < T.late) { withCamera(1, 540, 900, () => shotLighthouse(t)); dreamFrame(); }
  else if (t >= T.map2 && t < T.map2e) withCamera(1, 540, 900, () => { phoneMap(t, 'refreshed 41 times today'); timeTag('4:58 PM', t); });
  else if (t < T.wc) { withCamera(1.25, CHAIR_X - 60, 860, () => shotLate(t), 540, 860); timeTag('4:58 PM', t); }
  else if (t < T.note) withCamera(1, 540, 900, () => shotWC(t));
  else if (t < T.app3) withCamera(1.3 + 0.15 * seg(t, T.note, T.melt), 540, 900, () => shotNote(t), 540, 900);
  else if (t < T.dayoff) withCamera(1, 540, 900, () => phone(t, [['New delivery date:', 56], ['TOMORROW', 76, '#c0392b'], ['9 AM – 5 PM', 76]]), 540 + (t < T.app3 + 0.5 ? jitter(t, 12) : 0), 900);   // buzzes
  else if (t < T.back) { const k = seg(t, T.dayoff, T.dayoff + 0.3); ctx.fillStyle = '#e9dcc3'; ctx.fillRect(PX, PY, PW, PH); withCamera(1, 540, 900, () => shotDayOff(t), 540 + 900 * (1 - k) * (1 - k), 900); }   // the next screen slides in
  else wide(() => shotLoop(t), 1.2 + 0.18 * seg(t, T.back, DUR), 500);
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
