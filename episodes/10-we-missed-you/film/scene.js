// UNIT 4B · 10 "We Missed You" — 9:16 film page (lemo-opuscar page contract: READY, DUR, render(t), EV, TEXTS).
// An everyday problem played as a tragic love story. Stick cast from lib/cast_stick.js. Timings follow script.md.
import { drawCharacter, nameTab, paper, panel } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts } from './lib/cast_v2.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 150, PW = 1000, PH = 1420, FLOOR = 1400, K = 7;
const INK = '#2a2230', WALL = '#ece2cf', FLOORC = '#d8c6a8', DOOR = '#c7a985';
const WIN = { x0: 120, x1: 470, y0: 560, y1: 1010 };       // window on the left wall (world px)
const DOOR_X0 = 650, DOOR_X1 = 920, DOOR_TOP = 610;

const LINES = [
  ['10_01_snuggles', 'snuggles', 0.3, "Nine a.m. The kid is waiting for a man he's never met."],
  ['10_02_steve', 'steve', 4.1, "He said he's coming today."],
  ['10_03_steve', 'steve', 8.4, "He's on his way!"],
  ['10_04_snuggles', 'snuggles', 10.8, 'Seven hours. No food. No shower. No blinking.'],
  ['10_05_steve', 'steve', 17.1, "I can't hold it anymore."],
  ['10_06_steve', 'steve', 24.2, 'Why?!'],
  ['10_07_snuggles', 'snuggles', 27.9, 'Same window. Same time. Tomorrow.'],
].map(([id, char, t, text]) => ({ id, char, t, text }));
const DUR = 32.0;
const T = { hug: 7.0, hugEnd: 8.3, montage: 10.6, m2: 12.6, m3: 14.6, late: 16.8, wc: 20.5, flush: 21.6, note: 22.3, drain: 24.0, phone2: 26.2, back: 27.6 };
let VOICE = {};

const EV = [
  ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
  { t: 0.0, type: 'longing' }, { t: T.hug, type: 'buzz' }, { t: T.hug + 0.2, type: 'swell' },
  { t: T.m2 + 0.1, type: 'truck' }, { t: T.m2 + 0.6, type: 'steps' }, { t: T.late, type: 'tremble' },
  { t: T.wc + 0.15, type: 'slam' }, { t: T.flush, type: 'flush' }, { t: T.note, type: 'stop' },
  { t: 24.2, type: 'hit' }, { t: T.phone2, type: 'buzz' }, { t: 30.0, type: 'longing2' },
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
function actor(id, x, t, pose, { y = FLOOR, scale = K, frozen = false, rot = 0, voiceOff = false } = {}) {
  let p = { ...pose };
  const e = voiceOff ? -1 : speaking(id, t);
  if (e >= 0) p.mouth = e > 0.55 ? 'wide' : e > 0.18 ? 'small' : 'line';
  const blinkP = (t + (id === 'steve' ? 0.7 : 3.1)) % 4.2;
  if (!frozen && blinkP < 0.17 && (!p.eyes || p.eyes === 'dot') && !(p.expr && ['happy', 'crying', 'sleepy', 'proud', 'laughing', 'cringe'].includes(p.expr))) p.eyes = 'closed';
  ctx.save(); if (rot) { ctx.translate(x, y); ctx.rotate(rot); ctx.translate(-x, -y); }
  drawCharacter(ctx, id, x, y, scale, p, { frame: frozen ? 0 : frameOf(t) });
  ctx.restore();
}
const pen = (x, y, s, t, seed = 1) => new VPen(ctx, x, y, s, { lw: Math.max(2.4, s * 0.85), hand: true, frame: frameOf(t), seed });
function withCamera(zoom, fx, fy, fn, sx = fx, sy = fy) {
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.translate(sx, sy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore();
}
function hand(text, x, y, size, rot = 0, color = INK) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${size}px "Patrick Hand"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore();
}
function timeTag(text, t) {   // sticky label in the top-left of the panel
  const p = pen(0, 0, 1, t, 91); p.T = q => q;
  p.part(roundPoly([[80, 200], [330, 196], [334, 280], [84, 284]], 6), '#f7e27a', { shade: false, lw: 3 });
  hand(text, 207, 240, 54, -0.03);
}

// ---------- set ----------
function room(t, { grey = false, light = 'day' } = {}) {
  ctx.save(); if (grey) ctx.filter = 'grayscale(1)';
  ctx.fillStyle = WALL; ctx.fillRect(PX - 600, PY - 600, PW + 1200, FLOOR - PY + 600);
  ctx.fillStyle = FLOORC; ctx.fillRect(PX - 600, FLOOR, PW + 1200, PY + PH - FLOOR + 600);
  const p = pen(0, FLOOR, 1, t, 3);
  p.line([[PX - 600, 0], [PX + PW + 600, 0]], 4);
  for (const y of [60, 130]) p.line([[PX - 600, -y], [PX + PW + 600, -y]], 2, 'rgba(42,34,48,0.25)');
  // window: sky, sun, a cloud, frame and sill
  const sky = light === 'eve' ? '#f2b98a' : '#bfe0f2';
  p.part([[WIN.x0, FLOOR - WIN.y1], [WIN.x1, FLOOR - WIN.y1], [WIN.x1, FLOOR - WIN.y0], [WIN.x0, FLOOR - WIN.y0]], sky, { shade: false, lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); ctx.clip();
  p.part(ellipsePts(light === 'eve' ? 400 : 380, FLOOR - (light === 'eve' ? 960 : 650), 46, 46, 30), light === 'eve' ? '#f08a5d' : '#f7d35c', { shade: false, lw: 3 });
  p.part(ellipsePts(220, FLOOR - 720, 60, 24, 30), '#ffffff', { shade: false, lw: 3 });
  ctx.restore();
  p.line([[(WIN.x0 + WIN.x1) / 2, FLOOR - WIN.y0], [(WIN.x0 + WIN.x1) / 2, FLOOR - WIN.y1]], 5);
  p.line([[WIN.x0, FLOOR - (WIN.y0 + WIN.y1) / 2], [WIN.x1, FLOOR - (WIN.y0 + WIN.y1) / 2]], 5);
  p.part([[WIN.x0 - 30, FLOOR - WIN.y1 - 26], [WIN.x1 + 30, FLOOR - WIN.y1 - 26], [WIN.x1 + 30, FLOOR - WIN.y1], [WIN.x0 - 30, FLOOR - WIN.y1]], '#efe7d6', { shade: false, lw: 4 });
  // front door (closed)
  p.part([[DOOR_X0, 0], [DOOR_X1, 0], [DOOR_X1, FLOOR - DOOR_TOP], [DOOR_X0, FLOOR - DOOR_TOP]], DOOR, { shade: false, lw: 4 });
  p.dot(DOOR_X0 + 32, 380, 9, 9, '#e8c35a');
  p.part(roundPoly([[DOOR_X0 + 50, 470], [DOOR_X1 - 50, 470], [DOOR_X1 - 50, 720], [DOOR_X0 + 50, 720]], 6), null, { shade: false, lw: 2.5 });
  p.line([[DOOR_X0 - 18, FLOOR - DOOR_TOP + 18], [DOOR_X1 + 18, FLOOR - DOOR_TOP + 18], [DOOR_X1 + 18, 0]], 3.5);
  p.line([[DOOR_X0 - 18, 0], [DOOR_X0 - 18, FLOOR - DOOR_TOP + 18]], 3.5);
  ctx.restore();
}
function noteOnDoor(t, scale = 1) {
  const cx = (DOOR_X0 + DOOR_X1) / 2, cy = 900, p = pen(cx, cy, 6 * scale, t, 97);
  p.part(roundPoly([[-17, -12], [17, -13], [17, 12], [-17, 12]], 0.8), '#fffdf2', { shade: false });
  p.fill([[-4, 11], [4, 11], [4, 14], [-4, 14]], 'rgba(240,220,140,0.9)');
  hand('SORRY', cx, cy - 34 * scale, 46 * scale, -0.04, '#c0392b');
  hand('WE MISSED', cx, cy + 6 * scale, 40 * scale, -0.04, '#c0392b');
  hand('YOU!', cx, cy + 44 * scale, 46 * scale, -0.04, '#c0392b');
}
function phone(t, lines, sub) {   // close insert of a phone screen held in a hand
  ctx.fillStyle = '#e9dcc3'; ctx.fillRect(PX, PY, PW, PH);
  const p = pen(540, 1330, 14, t, 71);
  p.part(roundPoly([[-21, 0], [21, 0], [21, 72], [-21, 72]], 5), '#2f2b36', { shade: false });
  p.part(roundPoly([[-18, 5], [18, 5], [18, 67], [-18, 67]], 3), '#fbfaf6', { shade: false, lw: 3 });
  ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = INK;
  lines.forEach(([txt, size, col], i) => { ctx.font = `600 ${size}px Fredoka`; ctx.fillStyle = col || INK; ctx.fillText(txt, 540, 1330 - 54 * 14 + i * 110); });
  if (sub) { ctx.font = '48px "Patrick Hand"'; ctx.fillStyle = '#6b625c'; ctx.fillText(sub, 540, 1330 - 20 * 14); }
  ctx.restore();
}

// ---------- shots ----------
const STEVE_WIN = 300;   // Steve at the window
function shotWindow(t, { snug = false, light = 'day' } = {}) {
  room(t, { light });
  actor('steve', snug ? 230 : STEVE_WIN, t, { expr: 'sad', look: -0.8, armL: 'up' });
  if (snug) actor('snuggles', 445, t, { expr: 'smug', look: 0.6 }, { y: FLOOR - (FLOOR - WIN.y1) + 26, scale: 4.4 });
}
function shotMontage(t) {
  room(t);
  if (t < T.m2) { timeTag('11:00', t); actor('steve', 560, t, { expr: 'grin', look: 0.9, armR: 'point' }); }
  else if (t < T.m3) {
    timeTag('1:00 PM', t);
    const k = step8(seg(t, T.m2 + 0.3, T.m2 + 0.8)), x = 250 + 330 * k;
    if (k > 0 && k < 1) { const p = pen(0, FLOOR, 1, t, 5); for (const dy of [380, 460, 540]) p.line([[x - 160, dy], [x - 60, dy]], 4, 'rgba(42,34,48,0.5)'); }
    actor('steve', x, t, { expr: k < 1 ? 'shocked' : t > T.m2 + 1.5 ? 'sad' : 'happy', look: 0.9 });
    if (t > T.m2 + 1.0) hand('vroooom...', 820, 1150, 50, -0.08, '#6b625c');
  } else { timeTag('3:00 PM', t); actor('steve', 590, t, { expr: 'sleepy' }, { rot: 0.12 }); }
}
function shotLate(t) {
  room(t, { light: 'eve' });
  actor('steve', 470, t, { expr: 'horrified', look: 0.9, armL: 'hold', armR: 'hold' });
}
function shotWC(t) {
  ctx.fillStyle = '#d9e4e6'; ctx.fillRect(PX, PY, PW, PH);
  const p = pen(540, 1400, 7, t, 81);
  p.part([[-26, 0], [26, 0], [26, 110], [-26, 110]], '#9cc3c9', { shade: false });
  p.dot(-19, 50, 1.6, 1.6, '#e8c35a');
  p.part(roundPoly([[-8, 80], [8, 80], [8, 92], [-8, 92]], 2), '#fffdf6', { shade: false, lw: 3 });
  hand('WC', 540, 1400 - 86 * 7, 64);
  const shake = t < T.wc + 0.4 ? Math.sin(t * 90) * 6 : 0;
  if (t < T.wc + 0.5) hand('SLAM!', 790 + shake, 520, 90, -0.12);
  timeTag('0:30', t);
  if (t >= T.flush) hand('flushhh...', 760, 1000, 64, 0.06, '#3f7f8c');
}
function shotNote(t) {
  room(t, { light: 'eve' });
  actor('steve', 330, t, { expr: 'shocked', look: 0.9 }, { frozen: true });
  noteOnDoor(t);
}
function shotDrain(t) {
  room(t, { grey: true, light: 'eve' });
  noteOnDoor(t);
  actor('steve', 420, t, { expr: 'crying', arm: 'up' });
}
function shotPhone2(t) { phone(t, [['New delivery date:', 56], ['TOMORROW', 92, '#c0392b'], ['9 AM – 5 PM', 76]], 'Thank you for your patience!'); }

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
  ctx.font = '600 40px Fredoka'; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText('UNIT 4B', 540, 100); ctx.textAlign = 'start';
  if (t < 4.0) withCamera(1 + 0.08 * seg(t, 0, 4), 330, 1000, () => { shotWindow(t); timeTag('9:00 AM', t); });
  else if (t < T.hug) withCamera(1.8, STEVE_WIN, 820, () => shotWindow(t), 540, 760);
  else if (t < T.hugEnd) withCamera(1, 540, 900, () => phone(t, [['Your package is', 60], ['OUT FOR', 96, '#2e8b57'], ['DELIVERY!', 96, '#2e8b57']], 'Arriving today, 9 AM – 5 PM'));
  else if (t < T.montage) withCamera(1.6, STEVE_WIN, 820, () => { room(t); actor('steve', STEVE_WIN, t, { expr: 'crying', armL: 'hold', armR: 'hold' }); }, 540, 760);
  else if (t < T.late) withCamera(1, 540, 1000, () => shotMontage(t));
  else if (t < T.wc) { withCamera(1 + 0.25 * seg(t, T.late, T.wc), 470, 800, () => shotLate(t), 540, 800); timeTag('4:58 PM', t); }   // tag in screen space, unzoomed
  else if (t < T.note) withCamera(1, 540, 900, () => shotWC(t));
  else if (t < T.drain) withCamera(1, 540, 1000, () => shotNote(t));
  else if (t < T.phone2) withCamera(1.12, 560, 800, () => shotDrain(t), 540, 760);
  else if (t < T.back) withCamera(1, 540, 900, () => shotPhone2(t));
  else withCamera(1 + 0.06 * seg(t, T.back, DUR), 330, 1000, () => shotWindow(t, { snug: true }));
  panel(ctx, PX, PY, PW, PH, 5, null, frameOf(t));
  const cap = caption(t); window.__texts = cap ? [cap] : [];
}

window.DUR = DUR; window.EV = EV; window.render = render; window.TEXTS = t => { render(t); return window.__texts; };
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  VOICE = await (await fetch('voice_el/voice.json')).json();
  render(0); window.READY = true;
})();
