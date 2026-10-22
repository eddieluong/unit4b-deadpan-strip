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
  ['10_01_snuggles', 'snuggles', 0.2, "Nine a.m. The kid is waiting for a man he's never met. Again."],
  ['10_02_steve', 'steve', 6.4, "He said he's coming today..."],
  ['10_03_steve', 'steve', 9.7, "HE'S ON HIS WAY! He's on his waaay!"],
  ['10_04_snuggles', 'snuggles', 14.8, 'Seven hours. No food. No shower. No blinking.'],
  ['10_05_steve', 'steve', 20.3, "I'M HERE! I'M COMING! I'M HEEERE!"],
  ['10_06_steve', 'steve', 23.6, "...that's a garbage truck."],
  ['10_07_steve', 'steve', 25.4, 'Thirty seconds. Nobody comes in thirty seconds.'],
  ['10_08_steve', 'steve', 34.2, 'WHYYYYY?!'],
  ['10_09_steve', 'steve', 39.5, '...tomorrow.'],
  ['10_10_snuggles', 'snuggles', 41.0, 'Same window. Same time. Tomorrow.'],
].map(([id, char, t, text]) => ({ id, char, t, text }));
const DUR = 45.6;
const T = { close: 6.2, phone: 8.9, jump: 10.1, montage: 14.6, m3: 17.2, truck: 20.0, late: 25.3, wc: 30.8, flush: 31.9, note: 32.6, drain: 34.0, phone2: 37.9, back: 39.3 };
let VOICE = {};

const EV = [
  ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
  { t: 0.0, type: 'longing' }, { t: T.phone, type: 'buzz' }, { t: 9.7, type: 'swell' },
  { t: T.truck, type: 'truck' }, { t: T.truck + 0.4, type: 'steps' }, { t: 23.5, type: 'sadtrombone' }, { t: T.late, type: 'tremble' },
  { t: T.wc + 0.15, type: 'slam' }, { t: T.flush, type: 'flush' }, { t: T.note, type: 'stop' },
  { t: 34.2, type: 'hit' }, { t: T.phone2, type: 'buzz' }, { t: 41.0, type: 'longing2' },
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
const hop = (t, h = 70) => Math.abs(Math.sin(step8(t) * Math.PI * 2.2)) * h;    // jumping for joy, on 8 fps steps
const jitter = (t, a = 8) => (Math.floor(t * 8) % 2 ? a : -a);                    // trembling, 2 drawings
function shotWindow(t, { snug = false, light = 'day', expr = 'sad' } = {}) {
  room(t, { light });
  actor('steve', snug ? 230 : STEVE_WIN, t, { expr, look: -0.8, armL: 'up' });
  if (snug) actor('snuggles', 445, t, { expr: 'smug', look: 0.6 }, { y: FLOOR - (FLOOR - WIN.y1) + 26, scale: 4.4 });
}
function shotJump(t) {          // "HE'S ON HIS WAY!": jumping, arms flailing, tears of joy, sparkles
  room(t);
  const arm = Math.floor(t * 8) % 2 ? 'up' : 'shrug';
  actor('steve', 540, t, { expr: 'laughing', arm, fx: ['sparkle', 'tears'] }, { y: FLOOR - hop(t) });
  const p = pen(0, FLOOR, 1, t, 9);
  for (const [x, y] of [[300, 900], [800, 850], [380, 620], [720, 560]]) if ((Math.floor(t * 8) + x) % 3) p.part(roundPoly([[x, y + 22], [x + 6, y + 6], [x + 22, y], [x + 6, y - 6], [x, y - 22], [x - 6, y - 6], [x - 22, y], [x - 6, y + 6]], 2, 2), '#f2c14e', { shade: false, lw: 2.5 });
}
function shotMontage(t) {
  room(t);
  if (t < T.m3) { timeTag('11:00 AM', t); actor('steve', 560, t, { expr: 'grin', look: 0.9, armR: 'point' }); hand('practice #47', 300, 1130, 50, -0.06, '#6b625c'); }
  else { timeTag('3:00 PM', t); actor('steve', 590, t, { expr: 'sleepy' }, { rot: 0.12 }); }
}
function garbageTruck(t, k) {   // drives across the window
  ctx.save(); ctx.beginPath(); ctx.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); ctx.clip();
  const x = WIN.x1 + 60 - (WIN.x1 - WIN.x0 + 420) * k, p = pen(x, 990, 2.6, t, 33);
  p.part(roundPoly([[0, 0], [130, 0], [130, 70], [0, 70]], 4), '#6aa36f', { shade: 0.1 });
  p.part(roundPoly([[-40, 0], [0, 0], [0, 50], [-30, 50], [-40, 30]], 3), '#e8e2d2', { shade: false });
  for (const wx of [-20, 95]) p.part(ellipsePts(wx, 0, 11, 11, 18), '#3a3440', { shade: false });
  hand('GARBAGE', x + 170, 990 - 95, 46, 0, '#fffdf6');
  ctx.restore();
}
function shotTruck(t) {         // 4:00 PM: a truck! sprint to the window... it's the garbage truck
  room(t); timeTag('4:00 PM', t);
  const k = step8(seg(t, T.truck + 0.3, T.truck + 1.0)), x = 840 - 280 * k;   // door → just right of the window, truck stays visible
  if (k > 0 && k < 1) { const p = pen(0, FLOOR, 1, t, 5); for (const dy of [380, 460, 540]) p.line([[x + 60, dy], [x + 170, dy]], 4, 'rgba(42,34,48,0.5)'); }
  garbageTruck(t, seg(t, 21.0, 25.0));
  const sad = t >= 23.5;
  actor('steve', x, t, sad ? { expr: 'dead_inside', look: -0.8, arm: 'down' } : { expr: 'shocked', look: -0.9, arm: k < 1 ? 'up' : 'point' }, { y: FLOOR - (k >= 1 && !sad ? hop(t, 40) : 0) });
}
function shotLate(t) {
  room(t, { light: 'eve' });
  actor('steve', 470 + jitter(t, 7), t, { expr: t < 28 ? 'nervous' : 'horrified', look: 0.9, armL: 'hold', armR: 'hold', fx: ['sweat', 'gloom'] });
}
function shotWC(t) {
  ctx.fillStyle = '#d9e4e6'; ctx.fillRect(PX, PY, PW, PH);
  const p = pen(540, 1400, 7, t, 81);
  p.part([[-26, 0], [26, 0], [26, 110], [-26, 110]], '#9cc3c9', { shade: false });
  p.dot(-19, 50, 1.6, 1.6, '#e8c35a');
  p.part(roundPoly([[-8, 80], [8, 80], [8, 92], [-8, 92]], 2), '#fffdf6', { shade: false, lw: 3 });
  hand('WC', 540, 1400 - 86 * 7, 64);
  const shake = t < T.wc + 0.4 ? jitter(t, 6) : 0;
  if (t < T.wc + 0.6) hand('SLAM!', 790 + shake, 520, 90, -0.12);
  timeTag('0:30', t);
  if (t >= T.flush) hand('flushhh...', 760, 1000, 64, 0.06, '#3f7f8c');
}
function shotNote(t) {
  room(t, { light: 'eve' });
  actor('steve', 330, t, { expr: 'shocked', look: 0.9 }, { frozen: true });
  noteOnDoor(t);
}
function shotDrain(t) {         // "WHYYYYY?!": greyscale, flailing arms, tears, shaking camera (shake is in render)
  room(t, { grey: true, light: 'eve' });
  noteOnDoor(t);
  const arm = Math.floor(t * 8) % 2 ? 'up' : 'shrug';
  actor('steve', 420, t, { expr: 'crying', arm, fx: ['gloom'] });
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
  const shake = t >= 34.2 && t < 37.6 ? [((Math.floor(t * 12) * 37) % 29) - 14, ((Math.floor(t * 12) * 53) % 23) - 11] : [0, 0];
  if (t < T.close) withCamera(1 + 0.1 * seg(t, 0, T.close), 330, 1000, () => { shotWindow(t); timeTag('9:00 AM', t); });
  else if (t < T.phone) withCamera(1.8, STEVE_WIN, 820, () => shotWindow(t, { expr: 'happy' }), 540, 760);
  else if (t < T.jump) withCamera(1, 540, 900, () => phone(t, [['Your package is', 60], ['OUT FOR', 96, '#2e8b57'], ['DELIVERY!', 96, '#2e8b57']], 'Arriving today, 9 AM – 5 PM'));
  else if (t < T.montage) withCamera(1.2, 540, 900, () => shotJump(t), 540, 860);
  else if (t < T.truck) withCamera(1, 540, 1000, () => shotMontage(t));
  else if (t < T.late) withCamera(1, 540, 1000, () => shotTruck(t));
  else if (t < T.wc) { withCamera(1 + 0.3 * seg(t, T.late, T.wc), 470, 800, () => shotLate(t), 540, 800); timeTag('4:58 PM', t); }
  else if (t < T.note) withCamera(1, 540, 900, () => shotWC(t));
  else if (t < T.drain) withCamera(1, 540, 1000, () => shotNote(t));
  else if (t < T.phone2) withCamera(1.12 + 0.05 * Math.abs(Math.sin(t * 9)), 560, 800, () => shotDrain(t), 540 + shake[0], 760 + shake[1]);
  else if (t < T.back) withCamera(1, 540, 900, () => shotPhone2(t));
  else withCamera(1 + 0.06 * seg(t, T.back, DUR), 330, 1000, () => shotWindow(t, { snug: true, expr: t < 41 ? 'sad' : 'dead_inside' }));
  panel(ctx, PX, PY, PW, PH, 5, null, frameOf(t));
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
