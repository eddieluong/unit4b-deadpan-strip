// UNIT 4B · 09 "Welcome Gifts" — 9:16 film page (lemo-opuscar page contract: READY, DUR, render(t), EV, TEXTS).
// Stick cast from lib/cast_stick.js, hand-drawn line. Timings follow episodes/09-welcome-gifts/script.md.
import { drawCharacter, CAST, nameTab, paper, panel } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts, mix } from './lib/cast_v2.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 150, PW = 1000, PH = 1420, FLOOR = 1400, K = 7; // panel box, floor line (world px), character scale
const INK = '#2a2230', WALL = '#ece2cf', FLOORC = '#d8c6a8', HALL = '#c9bca6', DOOR = '#c7a985';

// ---------- dialogue timing (start times in s; durations come from voice/voice.json) ----------
const LINES = [
  ['09_01_nana', 'nana', 0.3, 'Welcome to the building, dear! Banana bread.'],
  ['09_02_steve', 'steve', 4.5, 'And... a shovel?'],
  ['09_03_nana', 'nana', 6.9, 'Every new tenant needs one.'],
  ['09_04_steve', 'steve', 10.5, 'Oh! A gift!'],
  ['09_05_steve', 'steve', 12.6, 'This is a bill.'],
  ['09_06_penny', 'penny', 14.5, 'For the gift.'],
  ['09_07_ted', 'ted', 17.5, 'Welcome card. From all the old tenants.'],
  ['09_08_steve', 'steve', 21.4, 'Aw. Where are they now?'],
  ['09_09_ted', 'ted', 23.8, 'Here.'],
  ['09_10_snuggles', 'snuggles', 28.0, "In this building, everybody brings what they're good at."],
].map(([id, char, t, text]) => ({ id, char, t, text }));
const DUR = 35.2;
let VOICE = {};

// sound events for the mix (mix.py reads events.json)
const EV = [
  ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
  { t: 0.0, type: 'motif' }, { t: 8.3, type: 'cloth' }, { t: 9.9, type: 'knock' }, { t: 10.2, type: 'paper' },
  { t: 12.35, type: 'paper' }, { t: 14.3, type: 'paper' }, { t: 16.55, type: 'whoosh' }, { t: 26.4, type: 'stop' },
  { t: 31.8, type: 'paper' }, { t: 32.8, type: 'sting' },
];

// ---------- helpers ----------
const step8 = t => Math.floor(t * 8) / 8;                 // characters move on 8 fps steps
const frameOf = t => Math.floor(t * 24);
const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
function speaking(char, t) {                              // 0..1 voice level for lip-sync, sampled on 8 fps steps
  for (const L of LINES) {
    if (L.char !== char) continue;
    const v = VOICE[L.id]; if (!v) continue;
    const ts = step8(t) - L.t; if (ts < 0 || ts > v.dur) continue;
    return v.env[Math.min(v.env.length - 1, Math.floor(ts * 24))] || 0;
  }
  return -1;
}
function talkMouth(char, t, pose) {
  const e = speaking(char, t);
  if (e < 0) return pose;
  return { ...pose, mouth: e > 0.55 ? 'wide' : e > 0.18 ? 'small' : 'line' };
}
function blink(char, t, pose, frozen) {                   // a blink every ~4 s, 2 drawings long
  if (frozen || (pose.eyes && pose.eyes !== 'dot')) return pose;
  const off = { steve: 0.7, nana: 1.9, penny: 2.6, ted: 0.2, snuggles: 3.1 }[char], p = (t + off) % 4.2;
  return p < 0.17 ? { ...pose, eyes: 'closed' } : pose;
}
const SARC = { fake_sweet: 'happy', sarcastic: 'smug' };
function actor(id, x, t, pose, scale = K, frozen = false) {
  let p = { ...pose, expr: SARC[pose.expr] || pose.expr };
  p = blink(id, t, talkMouth(id, t, p), frozen);
  drawCharacter(ctx, id, x, FLOOR, scale, p, { frame: frozen ? 0 : frameOf(t) });
}
const pen = (x, y, s = K, t = 0, seed = 1) => new VPen(ctx, x, y, s, { lw: Math.max(2.4, s * 0.85), hand: true, frame: frameOf(t), seed });

// ---------- set ----------
function room(t, door = 'open') {
  ctx.fillStyle = WALL; ctx.fillRect(PX - 600, PY - 600, PW + 1200, FLOOR - PY + 600);   // wider than the panel so push-ins never show an edge
  ctx.fillStyle = FLOORC; ctx.fillRect(PX - 600, FLOOR, PW + 1200, PY + PH - FLOOR + 600);
  const p = pen(0, FLOOR, 1, t, 3); p.lw = 4;
  p.line([[PX - 600, 0], [PX + PW + 600, 0]], 4);
  // floorboards (pen y is up from the floor line, so boards sit at negative y)
  for (const y of [60, 130]) p.line([[PX - 600, -y], [PX + PW + 600, -y]], 2, 'rgba(42,34,48,0.25)');
  // door frame (world px → pen units with s=1, y up from FLOOR)
  const dx0 = 650, dx1 = 920, dTop = 610;
  if (door === 'open') {
    p.part([[dx0, 0], [dx1, 0], [dx1, FLOOR - dTop], [dx0, FLOOR - dTop]], HALL, { shade: false });
    p.part([[dx1, 0], [dx1 + 46, -20], [dx1 + 46, FLOOR - dTop + 30], [dx1, FLOOR - dTop]], DOOR, { shade: false });
  } else {
    p.part([[dx0, 0], [dx1, 0], [dx1, FLOOR - dTop], [dx0, FLOOR - dTop]], DOOR, { shade: false });
    p.dot(dx0 + 32, 380, 9, 9, '#e8c35a');
    p.part(roundPoly([[dx0 + 50, 470], [dx1 - 50, 470], [dx1 - 50, 720], [dx0 + 50, 720]], 6), null, { shade: false, lw: 2.5 });
  }
  p.part([[dx0 - 18, 0], [dx0, 0], [dx0, FLOOR - dTop], [dx0 - 18, FLOOR - dTop + 18]], '#efe7d6', { shade: false, lw: 3 });
  p.line([[dx0 - 18, FLOOR - dTop + 18], [dx1 + 18, FLOOR - dTop + 18], [dx1 + 18, 0]], 3.5);
  // apartment number on the wall
  ctx.font = '600 44px Fredoka'; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText('4B', (dx0 + dx1) / 2, dTop - 30); ctx.textAlign = 'start';
  // moving boxes behind Steve
  const box = (x, y, w, h, label, s) => {
    p.part([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], '#d6ad74', { shade: 0.12 });
    p.line([[x + w / 2, y + h], [x + w / 2, y + h - 26]], 6, '#b98e55');
    if (label) { ctx.save(); ctx.font = '30px "Patrick Hand"'; ctx.fillStyle = '#5b4632'; ctx.translate(x + w / 2, FLOOR - y - h / 2 + 12); ctx.rotate(s); ctx.textAlign = 'center'; ctx.fillText(label, 0, 0); ctx.restore(); }
  };
  box(70, 0, 200, 150, 'KITCHEN', -0.04); box(95, 150, 160, 120, 'STUFF', 0.05); box(280, 0, 120, 90, '', 0);
  // light switch + a nail with nothing on it
  p.part(roundPoly([[560, 520], [590, 520], [590, 570], [560, 570]], 4), '#f6f1e6', { shade: false, lw: 2.5 });
}

// ---------- props (local units, y up from the origin) ----------
function shovel(x, y, s, t, h = 118) {
  const p = pen(x, y, s, t, 41);
  p.tube([[0, 14], [0, h - 7]], 2.4, '#b5895a');
  p.tube([[-5, h - 6], [5, h - 6]], 2.4, '#b5895a');
  p.line([[-3, h - 6], [0, h - 11], [3, h - 6]], p.lw * 0.6);
  p.part(roundPoly([[-6.5, 15], [6.5, 15], [5.5, 4], [0, -1], [-5.5, 4]], 1.4), '#aab1ba', { shade: 0.2 });
}
function bread(x, y, s, t) {
  const p = pen(x, y, s, t, 43);
  p.part(ellipsePts(0, 0, 8.5, 4.6, 32), '#c98b4a', { shade: 0.25 });
  for (const d of [-4, 0, 4]) p.line([[d - 1.5, -1.6], [d + 1.5, 2.6]], p.lw * 0.6, '#8a5a2c');
}
function giftBox(x, y, s, t) {
  const p = pen(x, y, s, t, 47);
  p.part(roundPoly([[-8, 0], [8, 0], [8, 12], [-8, 12]], 1), '#5fb3a5', { shade: 0.18 });
  p.fill([[-1.4, 0], [1.4, 0], [1.4, 12], [-1.4, 12]], '#f2c14e');
  for (const sx of [-1, 1]) p.part(roundPoly([[0, 12.4], [sx * 6, 16.5], [sx * 5.5, 11.8]], 1), '#f2c14e', { shade: 0.2, lw: p.lw * 0.7 });
}
function card(x, y, s, t) {
  const p = pen(x, y, s, t, 53);
  p.part(roundPoly([[-8, -5.5], [8, -5.5], [8, 5.5], [-8, 5.5]], 0.8), '#fffdf6', { shade: false });
  for (let i = 0; i < 4; i++) { const yy = 3 - i * 2.2; p.line([[-6, yy], [-3, yy + 0.7], [0, yy - 0.4], [3 + (i % 2), yy + 0.5]], p.lw * 0.35); }
}
function mouse(x, y, s, t) {
  const p = pen(x, y, s, t, 59);
  p.line(p.curve([-5, 1.6], [-10, 0.5], [-11, 3.5]), p.lw * 0.6, '#c58ea0');
  p.part(ellipsePts(0, 2.6, 5.4, 2.7, 26), '#9a9aa8', { shade: 0.2 });
  p.part(ellipsePts(5.3, 4.4, 1.8, 1.8, 14), '#9a9aa8', { shade: false, lw: p.lw * 0.7 });
  p.line([[6, 2.9], [7.6, 1.7]], p.lw * 0.45); p.line([[6, 1.7], [7.6, 2.9]], p.lw * 0.45);
  for (const sx of [-1, 1]) p.part(roundPoly([[0, 5.4], [sx * 3.4, 7.6], [sx * 3.4, 3.4]], 0.6), '#e89aac', { shade: false, lw: p.lw * 0.6 });
  p.dot(0, 5.4, 0.9, 0.9, '#e89aac');
}
function doormat(x, y, s, t) {
  const p = pen(x, y, s, t, 61);
  p.part(roundPoly([[-26, 0], [26, 0], [24, 4], [-24, 4]], 1), '#a8845c', { shade: 0.2 });
  ctx.save(); ctx.font = `${3.2 * s}px "Patrick Hand"`; ctx.fillStyle = '#f3e6cf'; ctx.textAlign = 'center';
  ctx.fillText('WELCOME', x, y - 0.6 * s); ctx.restore();
}

// ---------- camera ----------
function withCamera(zoom, fx, fy, fn, sx = fx, sy = fy) {   // world point (fx, fy) lands at screen (sx, sy), scaled by zoom
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.translate(sx, sy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy);
  fn(); ctx.restore();
}

// ---------- shots ----------
const STEVE_X = 330, VIS_X = 785;
function steveWithGifts(t, pose, frozen = false, x = STEVE_X) {
  shovel(x + 16 * K, FLOOR, K, frozen ? 0 : t);   // behind Steve, so his head overlaps the handle
  actor('steve', x, t, { armL: 'hold', armR: 'down', ...pose }, K, frozen);
  bread(x + 0, FLOOR - 47 * K, K, frozen ? 0 : t);
}

function shotNana(t) {   // 0 – 10.2
  room(t, 'open');
  const handed = t >= 8.2;
  let sPose = t < 4.2 ? { expr: 'happy', look: 0.6 } : t < 6.9 ? { expr: 'confused', look: 0.7 } : t < 8.2 ? { expr: 'nervous', look: 0.6 } : { expr: 'awkward', look: 0.5 };
  if (handed) steveWithGifts(t, sPose); else actor('steve', STEVE_X, t, sPose);
  const nPose = { expr: t >= 6.9 ? 'fake_sweet' : 'happy', look: -0.5, ...(handed ? { arm: 'down' } : { armL: 'hold', armR: 'down' }) };
  actor('nana', VIS_X, t, nPose);
  if (!handed) { bread(VIS_X + 1 * K * 0.9, FLOOR - 43 * K, K, t); shovel(VIS_X + 12 * K, FLOOR, K, t); }
}
function shotPenny(t) {  // 10.2 – 12.4 and 14.3 – 16.6
  room(t, 'open');
  const after = t >= 14.3;
  steveWithGifts(t, after ? (t > 15.7 ? { expr: 'dead_inside', look: 0.5 } : { expr: 'confused', look: 0.6 }) : { expr: 'happy', look: 0.6 });
  actor('penny', VIS_X, t, { expr: 'deadpan', look: -0.5, ...(after ? { arm: 'hips' } : { arm: 'hold' }) });
  if (!after) giftBox(VIS_X, FLOOR - 33 * K, K, t);
}
function shotBill(t) {   // 12.4 – 14.3: insert, the box is open, one sheet of paper
  ctx.fillStyle = '#e9dcc3'; ctx.fillRect(PX, PY, PW, PH);
  const p = pen(540, 1250, 18, t, 71);
  p.part(roundPoly([[-22, 0], [22, 0], [22, 20], [-22, 20]], 1.5), '#5fb3a5', { shade: 0.15 });
  p.fill([[-2.5, 0], [2.5, 0], [2.5, 20], [-2.5, 20]], '#f2c14e');
  const q = pen(540, 1150, 14, t, 73);
  q.part(roundPoly([[-22, 0], [22, 0], [21, 46], [-21, 46]], 0.8), '#fffdf6', { shade: false });
  ctx.save(); ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = '600 64px Fredoka'; ctx.fillText('INVOICE', 540, 1150 - 39 * 14);
  ctx.font = '50px "Patrick Hand"'; ctx.textAlign = 'left';
  const rows = [['1 × welcome gift', '$49.99'], ['gift wrapping', '$12.00'], ['bow (premium)', '$8.50']];
  rows.forEach(([a, b], i) => { const y = 1150 - (30 - i * 7) * 14; ctx.fillText(a, 540 - 18 * 14, y); ctx.textAlign = 'right'; ctx.fillText(b, 540 + 18 * 14, y); ctx.textAlign = 'left'; });
  ctx.font = '600 54px Fredoka'; ctx.fillText('TOTAL', 540 - 18 * 14, 1150 - 6 * 14); ctx.textAlign = 'right'; ctx.fillText('$70.49', 540 + 18 * 14, 1150 - 6 * 14);
  ctx.restore();
  q.line([[-18, 12], [18, 12]], 3);
}
function shotTed(t) {    // 16.6 – 26.4
  room(t, 'closed');
  const enter = step8(seg(t, 16.6, 17.4));
  let sPose;
  if (t < 16.8) sPose = { expr: 'neutral', look: 0.4 };
  else if (t < 17.5) sPose = { expr: 'shocked', look: 0.6 };
  else if (t < 21.4) sPose = { expr: 'nervous', look: 0.6 };
  else if (t < 23.8) sPose = { expr: 'happy', look: 0.6 };
  else if (t < 25.0) sPose = { expr: 'awkward', look: 0.6 };
  else { const s = step8(t); sPose = { expr: 'nervous', look: s < 25.4 ? -0.9 : s < 25.8 ? 0.9 : -0.2 }; }  // eyes slide around the empty room
  steveWithGifts(t, sPose);
  const tedX = 1010 - (1010 - 745) * enter;
  const look = t >= 23.8 ? (step8(t) < 24.3 ? -0.9 : 0.9) : -0.5;
  actor('ted', tedX, t, { expr: t >= 23.8 ? 'deadpan' : 'proud', look, armL: 'point' });
  card(tedX - 23 * K, FLOOR - 62 * K, K, t);
}
function shotMat(t, zoom) {  // 26.4 – 27.6 insert on the doormat; 27.6 – 31.8 Snuggles turns to camera
  room(t, 'open');
  const turn = t >= 27.6;
  steveWithGifts(t, { expr: 'horrified', look: 0.6 }, true);
  doormat(VIS_X - 20, FLOOR + 18, K, 0);
  mouse(VIS_X - 60, FLOOR + 10, K, 0);
  actor('snuggles', VIS_X + 120, t, { expr: 'smug', look: turn ? 0 : -0.8 }, K, !turn);
}
function shotButton(t) {     // 31.8 – end: Steve, the shovel, the realisation
  room(t, 'open');
  const late = t >= 32.8;
  steveWithGifts(t, late ? { expr: 'dead_inside', look: 0.3 } : { expr: 'horrified', look: 0.6 }, !late);
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
  for (const w of words) { const tryS = cur ? cur + ' ' + w : w; if (ctx.measureText(tryS).width > maxW && cur) { out.push(cur); cur = w; } else cur = tryS; }
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
  lines.forEach((s, i) => ctx.fillText(s, 540, y0 + 82 + i * lh));
  ctx.textAlign = 'start';
  return { id: L.id, text: L.text, x0: 70, y0: y0 - 30, x1: 1010, y1: y0 + h };
}

// ---------- frame ----------
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  paper(ctx, W, H, 11);
  ctx.font = '600 40px Fredoka'; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText('UNIT 4B', 540, 100); ctx.textAlign = 'start';
  if (t < 10.2) withCamera(1, 540, FLOOR, () => shotNana(t));
  else if (t < 12.4) withCamera(1, 540, FLOOR, () => shotPenny(t));
  else if (t < 14.3) withCamera(1, 540, 900, () => shotBill(t));
  else if (t < 16.6) withCamera(1.12, VIS_X, FLOOR - 200, () => shotPenny(t));
  else if (t < 26.4) withCamera(1, 540, FLOOR, () => shotTed(t));
  else if (t < 27.6) withCamera(2.1, VIS_X + 35, FLOOR, () => shotMat(t), 540, 1330);
  else if (t < 31.8) withCamera(1 + 0.1 * seg(t, 27.6, 31.8), 600, FLOOR - 150, () => shotMat(t), 540, FLOOR - 150);
  else withCamera(1.7, STEVE_X + 40, FLOOR - 380, () => shotButton(t));
  panel(ctx, PX, PY, PW, PH, 5, null, frameOf(t));
  const cap = caption(t);
  window.__texts = cap ? [cap] : [];
}

window.DUR = DUR; window.EV = EV; window.render = render; window.TEXTS = t => { render(t); return window.__texts; };
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  VOICE = await (await fetch('voice_el/voice.json')).json();
  render(0); window.READY = true;
})();
