// UNIT 4B · 19 "One Percent" — 3 KEY STILLS, full-bleed 9:16 panel (title inside the panel). render(0|1|2).
import { drawCharacter, paper, panel, nameTab, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const INK = '#2a2230', TITLE_Y = 232, PL_Y = 1640;   // caption plate starts at y 1640 (> 82 % of H)
const spen = (t, seed) => { const p = new VPen(ctx, 0, 0, 1, { lw: 3, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
const armTo = (X, shY, sc, hx, hy, bend) => ({ hand: [(hx - X) / sc, (shY - hy) / sc], bend });
const headOf = (x, y, s) => [x, y - 80 * s, 15 * s];
function title() {   // inside the panel, top; clears y 170
  ctx.save(); ctx.font = '600 50px Fredoka'; const w = ctx.measureText("POV: your phone is at 1%").width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.9)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 48, w, 96, 48); ctx.fill();
  text("POV: your phone is at 1%", 540, TITLE_Y + 3, 50, '#fff6dc'); ctx.restore();
}
function plate(id, lines, stress = []) {   // caption plate with name tab; words in `stress` go yellow
  ctx.save(); ctx.fillStyle = 'rgba(30,24,40,0.88)'; ctx.beginPath(); ctx.roundRect(40, PL_Y, 1000, 240, 36); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  nameTab(ctx, 70, PL_Y - 30, id, 34);
  const size = lines.length > 1 ? 76 : 100; ctx.save(); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  lines.forEach((ln, li) => {
    const ws = ln.split(' '), gap = 20, wd = ws.map(w => ctx.measureText(w).width); let x = 540 - (wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
    const y = PL_Y + 135 + (li - (lines.length - 1) / 2) * (size + 6);
    ws.forEach((w, i) => { ctx.fillStyle = stress.some(s => w.startsWith(s)) ? '#ffd84a' : '#fff'; ctx.fillText(w, x, y); x += wd[i] + gap; });
  });
  ctx.restore();
}

function faceGlow(hc, rgba = 'rgba(110,190,255,0.5)', dx = 0, dy = 160) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 8, 0, 7); ctx.clip();
  const g = ctx.createRadialGradient(hc[0] + dx, hc[1] + dy, 20, hc[0] + dx, hc[1] + dy, hc[2] * 1.5); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.fillStyle = g; ctx.fillRect(hc[0] - 400, hc[1] - 400, 800, 800); ctx.restore();
}
function drop(p, x, y, sz, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 }); ctx.restore();
}


// ---------- shared props ----------
let SEED = 1; const rnd = () => (SEED = (SEED * 16807) % 2147483647) / 2147483647;
const CARD = ['#ffc6d9', '#ffe29a', '#ffd0b0', '#f9b7d0', '#fff0c2', '#ffb8c6'];
function rose(x, y, r, col = '#e84a78') {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#4aa24a'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  for (const a of [-0.9, 2.4]) { ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(r * 1.15, 0, r * 0.6, r * 0.28, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
  for (let i = 0; i < 6; i++) { const a = i * 1.05; ctx.fillStyle = i % 2 ? col : '#f2658e'; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45, r * 0.62, 0, 7); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#c92e5c'; ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, r * 0.2, 0.3, 4.6); ctx.stroke(); ctx.restore();
}
function sun(x, y, r) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#f4a21c'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 1.25, Math.sin(a) * r * 1.25); ctx.lineTo(Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7); ctx.stroke(); }
  ctx.fillStyle = '#ffd23c'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
}
function sparkle(x, y, r, col = '#fff') {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = '#d99a2b'; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * 0.28 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}
// a glittery "Good Morning" card centred at (x,y), width w (3:4), rotation rot, kind 0 rose / 1 sun / 2 flowers
function card(x, y, w, rot, kind, label = true) {
  const h = w * 1.25; ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.shadowColor = 'rgba(60,30,40,0.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = CARD[kind * 2 % 6]; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * 0.08); ctx.fill(); ctx.shadowColor = 'transparent';
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, kind === 1 ? '#ffe9a0' : '#ffd6e4'); g.addColorStop(1, kind === 1 ? '#ffb27a' : '#ff9fc0');
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = Math.max(3, w * 0.025); ctx.strokeStyle = INK; ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(2, w * 0.02); ctx.setLineDash([w * 0.05, w * 0.05]); ctx.beginPath(); ctx.roundRect(-w / 2 + w * 0.06, -h / 2 + w * 0.06, w * 0.88, h - w * 0.12, w * 0.05); ctx.stroke(); ctx.setLineDash([]);
  if (kind === 1) { sun(0, -h * 0.12, w * 0.2); } else { rose(-w * 0.1, -h * 0.1, w * 0.2); rose(w * 0.18, -h * 0.02, w * 0.13, '#ff7a9c'); if (kind === 2) rose(-w * 0.2, h * 0.04, w * 0.1, '#ffb347'); }
  sparkle(w * 0.3, -h * 0.35, w * 0.12); sparkle(-w * 0.32, -h * 0.05, w * 0.08, '#fff7a8'); sparkle(w * 0.22, h * 0.14, w * 0.07);
  if (label) text('Good Morning', 0, h * 0.34, w * 0.15, '#a02a58', 'Fredoka');
  ctx.restore();
}
function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
function room(t, pt) {   // warm morning room; window top-left with a sunbeam
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffe3b0'); g.addColorStop(1, '#f6b985'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const p = spen(t, 3);
  p.part(roundPoly([[600, 330], [1010, 330], [1010, 700], [600, 700]], 8), '#9fd8f7', { shade: false, lw: 6 });
  ctx.fillStyle = '#ffeaa0'; ctx.beginPath(); ctx.arc(900, 420, 44, 0, 7); ctx.fill(); ctx.fillStyle = '#ffb36a'; ctx.fillRect(606, 600, 398, 94);
  p.line([[805, 330], [805, 700]], 5); p.line([[600, 515], [1010, 515]], 5);
  if (pt) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,236,160,0.22)'; ctx.beginPath(); ctx.moveTo(600, 700); ctx.lineTo(1010, 700); ctx.lineTo(560, 1500); ctx.lineTo(60, 1500); ctx.fill(); ctx.restore(); }
}
function pileRow(cx0, cx1, y0, y1, n, wmin, wmax) { for (let i = 0; i < n; i++) card(cx0 + rnd() * (cx1 - cx0), y0 + rnd() * (y1 - y0), wmin + rnd() * (wmax - wmin), (rnd() - 0.5) * 1.6, Math.floor(rnd() * 3)); }
function phoneAt(x, y, w, h, rot, screen) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const q = spen(0.1, 9);
  q.part(roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], w * 0.12), '#2a3050', { shade: 0.1, lw: 6 });
  ctx.fillStyle = '#fff4f8'; ctx.beginPath(); ctx.roundRect(-w / 2 + 12, -h / 2 + 16, w - 24, h - 32, 16); ctx.fill();
  screen && screen(w, h); ctx.restore();
}


const RED = '#e63946';
function socketAt(x, y, k = 1) {   // generic wall plate with two slots (no regional shape detail)
  const p = spen(0.1, 51); p.part(roundPoly([[x - 70 * k, y - 95 * k], [x + 70 * k, y - 95 * k], [x + 70 * k, y + 95 * k], [x - 70 * k, y + 95 * k]], 18 * k), '#f4f1ea', { shade: 0.1, lw: 6 });
  ctx.fillStyle = INK; for (const dy of [-38, 38]) { ctx.beginPath(); ctx.roundRect(x - 34 * k, y + dy * k - 8 * k, 68 * k, 16 * k, 8 * k); ctx.fill(); }
}
function plug(x, y, k = 1, rot = 0) {   // plug body pointing right: grey block, two prongs
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const p = spen(0.1, 61);
  for (const dy of [-32, 32]) p.part(roundPoly([[40 * k, dy * k - 8 * k], [110 * k, dy * k - 8 * k], [110 * k, dy * k + 8 * k], [40 * k, dy * k + 8 * k]], 3 * k), '#c8ccd4', { shade: 0.15, lw: 5 });
  p.part(roundPoly([[-60 * k, -62 * k], [40 * k, -62 * k], [40 * k, 62 * k], [-60 * k, 62 * k]], 18 * k), '#e9ebf2', { shade: 0.12, lw: 6 });
  ctx.restore();
}
function batteryIcon(cx, cy, w, h, fill, label, col = '#fff') {
  ctx.save(); ctx.lineWidth = 9; ctx.strokeStyle = col; ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 22); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(cx + w / 2 + 4, cy - h * 0.2, 16, h * 0.4, 6); ctx.fill();
  ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 14, cy - h / 2 + 14, w * 0.12, h - 28, 10); ctx.fill(); ctx.restore();
  text(label, cx + w * 0.05, cy + 4, h * 0.62, col, 'Fredoka');
}
function bolt(x, y, k, col = '#ffd23c') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); [[8, -30], [-14, 4], [0, 4], [-8, 30], [16, -6], [2, -6]].forEach(([a, b], i) => i ? ctx.lineTo(a * k, b * k) : ctx.moveTo(a * k, b * k)); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function flyDrop(x, y, sz, rot) { drop(spen(0.1, 70 + x), x, y, sz, rot); }
function handAt(x, y, r) { ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.85, 0, 0, 7); ctx.fill(); ctx.stroke(); }

// ---------- STILL 1 · HOOK ----------
function still1(t) {
  room(t, false);
  ctx.fillStyle = 'rgba(120,20,30,0.18)'; ctx.fillRect(0, 0, W, H);
  const s = 20, X = 330, hc0 = 900, Y = hc0 + 80 * s;
  // phone held up to camera, screen = giant red battery 1%
  const phx = 885, phy = 780, pw = 130, ph = 250;
  const q = spen(t, 9); q.part(roundPoly([[phx - pw, phy - ph], [phx + pw, phy - ph], [phx + pw, phy + ph], [phx - pw, phy + ph]], 36), '#2a3050', { shade: 0.1, lw: 7 });
  ctx.fillStyle = '#2b0d12'; ctx.beginPath(); ctx.roundRect(phx - pw + 14, phy - ph + 18, 2 * pw - 28, 2 * ph - 36, 24); ctx.fill();
  batteryIcon(phx - 14, phy, 190, 150, '#2b0d12', '1%', '#ff4a55');
  ctx.save(); ctx.translate(phx, phy); ctx.rotate(Math.PI / 2); ctx.restore();
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'wide', brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.5, hair: 2, bags: 1,
    armL: armTo(X, Y - 60 * s, s, phx - 40, phy + 330, [0, -3]), armR: { hand: [0, -4], bend: [0, 0] } }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,45,60,0.65)', 230, 0);
  glowBlob(phx, phy, 520, 'rgba(255,40,55,0.35)'); handAt(phx - 20, phy + 265, 56);
  for (const [x, y, z, r] of [[60, 640, 26, -0.6], [700, 520, 24, 0.7], [690, 1100, 22, 1.2], [70, 1000, 24, -1.1], [650, 640, 18, 0.4]]) flyDrop(x, y, z, r);
  // foreground: wall socket, plug a finger's width away, taut cable, fist
  socketAt(880, 1400, 1.05); plug(640, 1405, 1.1);
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(575, 1405); ctx.lineTo(-20, 1590); ctx.stroke(); ctx.strokeStyle = '#f2f2f2'; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(740, 1300); ctx.lineTo(760, 1295); ctx.stroke(); ctx.restore();
  handAt(560, 1405, 62);
  for (const dy of [-34, 0, 34]) { ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(618, 1405 + dy, 34, 15, 0, 0, 7); ctx.fill(); ctx.stroke(); }
  // cat's eyes + fedora peeking at the left edge
  drawCharacter(ctx, 'snuggles', 60, 1500 + 34 * 7, 7, { eyes: 'wide', look: 0.9, mouth: 'line' }, { frame: boilFrame(t) });
  title(); plate('snuggles', ['One percent. One message.', 'One MAN.'], ['MAN']);
}

// ---------- STILL 2 · CLIMAX ----------
function still2(t) {
  room(t, false);
  ctx.fillStyle = '#c99a62'; ctx.fillRect(0, 1480, W, 440);
  // table over him
  const tp = spen(t, 41); tp.part(roundPoly([[-40, 800], [1120, 800], [1120, 880], [-40, 880]], 10), '#a98660', { shade: 0.12, lw: 6 });
  for (const x of [60, 1020]) tp.part(roundPoly([[x - 26, 880], [x + 26, 880], [x + 26, 1530], [x - 26, 1530]], 6), '#8a6a48', { shade: 0.12, lw: 6 });
  socketAt(900, 1260, 0.95);
  const s = 11.5, th = 0.75, X = 0, Y = 1923, sn = Math.sin(th), cs = Math.cos(th);
  const loc = (dx, dy) => [(dx * cs + dy * sn) / s, (dx * sn - dy * cs) / s];   // screen offset → local (u right, v up)
  const sh = [X + 60 * s * sn, Y - 60 * s * cs];
  const handS = [800, 1260]; const [hu, hv] = loc(handS[0] - sh[0], handS[1] - sh[1]);
  // foot on the wall (drawn leg)
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(300, 1610); ctx.lineTo(150, 1440); ctx.lineTo(70, 1250); ctx.stroke(); ctx.fillStyle = '#e8503a'; ctx.beginPath(); ctx.ellipse(48, 1225, 44, 26, 1.4, 0, 7); ctx.fill(); ctx.restore();
  const hcx = X + 80 * s * sn, hcy = Y - 80 * s * cs;
  // phone in his teeth (sideways at the mouth), "2%" + bolt
  const mx = hcx - 49, my = hcy + 53, pcx = mx + 190, pcy = my + 40;
  phoneAt(pcx, pcy, 190, 290, 0.2, (w, h) => { ctx.fillStyle = '#10261a'; ctx.beginPath(); ctx.roundRect(-w / 2 + 12, -h / 2 + 16, w - 24, h - 32, 14); ctx.fill(); text('2%', -10, 10, 74, '#7dff9a'); bolt(0, -85, 1.4); });
  ctx.save(); ctx.translate(X, Y); ctx.scale(1, 1); ctx.restore();
  ctx.save(); ctx.translate(X, Y); ctx.rotate(th); ctx.translate(-X, -Y);
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'pinpoint', brow: 'worried', mouth: 'line', fx: ['sweat'], look: 0, hair: 2, bags: 1, arm: 'down',
    armL: { hand: [-6, -14], bend: [-3, -2] }, armR: { hand: [hu, hv], bend: [0, -3] } }, { frame: boilFrame(t) });
  ctx.restore();
  faceGlow([hcx, hcy, 170], 'rgba(150,255,170,0.3)', 100, 60);
  // plug at the socket with a spark
  plug(780, 1260, 0.9); handAt(745, 1260, 40);
  ctx.save(); ctx.fillStyle = '#ffd23c'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.translate(860, 1260); ctx.beginPath();
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = i % 2 ? 24 : 70; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  glowBlob(860, 1260, 260, 'rgba(255,230,120,0.6)');
  // cat lying on the cable behind him, watching
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(740, 1290); ctx.bezierCurveTo(760, 1480, 900, 1590, 1100, 1560); ctx.stroke(); ctx.strokeStyle = '#f2f2f2'; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
  drawCharacter(ctx, 'snuggles', 960, 1610, 7, { eyes: 'dot', lid: 0.45, look: -0.6, mouth: 'line', tail: 0.2 }, { frame: boilFrame(t) });
  phoneAt(pcx, pcy, 190, 290, 0.2, (w, h) => { ctx.fillStyle = '#10261a'; ctx.beginPath(); ctx.roundRect(-w / 2 + 12, -h / 2 + 16, w - 24, h - 32, 14); ctx.fill(); text('2%', -10, 10, 74, '#7dff9a'); bolt(0, -85, 1.4); });
  title(); plate('steve', ['Come ON!'], ['ON']);
}

// ---------- STILL 3 · PUNCH ----------
function still3(t) {
  room(t, true);
  ctx.fillStyle = '#c99a62'; ctx.fillRect(0, 1430, W, 490); spen(t, 5).line([[0, 1430], [W, 1430]], 5);
  const s = 16, X = 330, Y = 1920, shY = Y + 15 * s - 60 * s;
  socketAt(975, 1330, 0.85);
  const phx = 570, phy = 1330;
  drawCharacter(ctx, 'steve', X, Y, s, { sit: true, expr: 'deadpan', lid: 0.55, mouth: 'line', look: 1, tilt: 12, hair: 2, bags: 1, fx: ['gloom'],
    armL: armTo(X, shY, s, phx - 90, phy + 130, [0, -3]), armR: { hand: [0, -4] } }, { frame: boilFrame(t) });
  // black phone, faint face reflection
  const q = spen(t, 9); q.part(roundPoly([[phx - 105, phy - 160], [phx + 105, phy - 160], [phx + 105, phy + 160], [phx - 105, phy + 160]], 26), '#2a3050', { shade: 0.1, lw: 6 });
  ctx.fillStyle = '#0b0b12'; ctx.beginPath(); ctx.roundRect(phx - 92, phy - 146, 184, 292, 16); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.beginPath(); ctx.ellipse(phx - 10, phy - 20, 60, 70, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.14)'; for (const dx of [-26, 18]) { ctx.beginPath(); ctx.ellipse(phx + dx, phy - 40, 9, 5, 0, 0, 7); ctx.fill(); }
  // unplugged plug on the floor beside the socket; cable runs under the cat
  plug(905, 1565, 0.8, 0.15);
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(850, 1565); ctx.bezierCurveTo(760, 1610, 640, 1500, 480, 1560); ctx.stroke(); ctx.strokeStyle = '#f2f2f2'; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
  drawCharacter(ctx, 'snuggles', 800, 1585, 8, { eyes: 'dot', lid: 0.55, look: -0.5, mouth: 'line', tail: 0.3 }, { frame: boilFrame(t) });
  ctx.fillStyle = '#3d3d4c'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(762, 1372, 18, 28, 0.4, 0, 7); ctx.fill(); ctx.stroke();   // licked paw
  title(); plate('steve', ['…Thank you.'], ['Thank']);
}

const STILLS = [still1, still2, still3];
function render(i) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); STILLS[Math.round(i)](0.1); ctx.restore();
  panel(ctx, 6, 6, W - 12, H - 12, 5, null, boilFrame(0.1));
}
window.render = render; window.TEXTS = () => []; window.DUR = 3;
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  render(0); window.READY = true;
})();
