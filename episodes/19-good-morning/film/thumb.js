// UNIT 4B · 19 "Good Morning" thumbnails (1080x1920). render(0|1|2) = option A|B|C. Props copied from stills.js.
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
  ctx.save(); ctx.font = '600 50px Fredoka'; const w = ctx.measureText("POV: the family group chat at 6 A.M.").width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.9)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 48, w, 96, 48); ctx.fill();
  text("POV: the family group chat at 6 A.M.", 540, TITLE_Y + 3, 50, '#fff6dc'); ctx.restore();
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

// A hand gripping a phone's left edge: palm behind the edge, three finger tips curling over it, thumb across the bezel.
function gripHand(x, y, rot, dir) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.ellipse(0, 0, 46, 34, 0, 0, 7); ctx.fill(); ctx.stroke();
  for (const [fy, len] of [[-18, 34], [-2, 38], [14, 34]]) { ctx.beginPath(); ctx.roundRect(14, fy - 8, len, 16, 8); ctx.fill(); ctx.stroke(); }   // fingers over the edge
  ctx.beginPath(); ctx.moveTo(-8, 26); ctx.quadraticCurveTo(18, 38, 40, 22); ctx.quadraticCurveTo(22, 30, -4, 14); ctx.closePath(); ctx.fill(); ctx.stroke();   // thumb
  ctx.restore();
}

function big(s, x, y, size, rot = 0, fill = '#fff', stroke = INK) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.2; ctx.strokeStyle = stroke; ctx.strokeText(s, 0, 8); ctx.strokeText(s, 0, 0); ctx.fillStyle = fill; ctx.fillText(s, 0, 0); ctx.restore();
}
function badge(x, y, r, label) { ctx.save(); ctx.fillStyle = '#e63946'; ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); text(label, x, y + 4, r * 1.05, '#fff'); }
function bg(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function blanket(y, t, seed) { const bp = spen(t, seed); bp.part(roundPoly([[-60, y + 20], [540, y], [1140, y + 20], [1140, 1930], [-60, 1930]], 50), '#7fa7d9', { shade: 0.12, lw: 6 }); }

// ---- A: Steve buried in "Good Morning" cards, 47 badge, "6 A.M." ----
function optA(t) {
  SEED = 5; bg('#ffd9e6', '#f6a8c4'); glowBlob(540, 900, 900, 'rgba(255,255,255,0.5)');
  pileRow(-60, 1140, 20, 760, 34, 200, 330);
  const s = 20, X = 540, hc0 = 1010, Y = hc0 + 80 * s;
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', lid: 0.45, brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0, hair: 2, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
  faceGlow(headOf(X, Y, s), 'rgba(255,170,215,0.5)', 0, 120);
  blanket(1380, t, 16);
  pileRow(-60, 1140, 1330, 1700, 22, 230, 340);
  { const dp = spen(t, 31); drop(dp, 160, 1000, 30, 0.3); drop(dp, 930, 1100, 28, -0.3); }
  for (const [x, y, r] of [[120, 1290, 40], [960, 1260, 44]]) sparkle(x, y, r);
  big('6 A.M.', 540, 250, 330, -0.02, '#fff', INK);
  badge(905, 1400, 112, '47');
}
// ---- B: flat-faced Steve sends one glittery rose (the punch), "GOOD MORNING." ----
function optB(t) {
  SEED = 9; bg('#ffe3b0', '#f6b985'); glowBlob(540, 1000, 900, 'rgba(255,225,235,0.5)');
  const s = 21, X = 540, hc0 = 980, Y = hc0 + 80 * s;
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'deadpan', lid: 0.55, mouth: 'line', look: 0, hair: 2, bags: 1, fx: ['gloom'], arm: 'down' }, { frame: boilFrame(t) });
  faceGlow(headOf(X, Y, s), 'rgba(255,225,235,0.4)', 0, 140);
  blanket(1500, t, 15);
  phoneAt(780, 1600, 360, 440, 0.06, (w, h) => { card(0, -20, 220, 0.04, 0, false); text('Sent ✓', 0, h / 2 - 58, 40, '#3a8a4a'); });
  gripHand(780 - 180 + 5, 1650, 0.3, 1);
  for (const [x, y, r] of [[110, 1560, 40], [330, 1700, 30]]) sparkle(x, y, r);
  big('GOOD', 540, 200, 240, -0.02, '#fff', INK);
  big('MORNING.', 540, 410, 205, 0.01, '#ffd84a', INK);
}
// ---- C: giant notification "Mom added you." + Steve peeking, "AGAIN." ----
function optC(t) {
  SEED = 13; bg('#3a2a5a', '#1a1030'); glowBlob(540, 800, 1000, 'rgba(255,110,190,0.45)');
  pileRow(-80, 1160, 1100, 1400, 10, 240, 340);
  ctx.save(); ctx.translate(540, 560); ctx.rotate(-0.04);
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.fillStyle = '#fff6fa'; ctx.beginPath(); ctx.roundRect(-470, -280, 940, 560, 70); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.translate(540, 560); ctx.rotate(-0.04); rose(-340, -150, 52); text('Family', -120, -150, 56, '#a02a58'); text('now', 380, -150, 44, '#8a7a90');
  text('Mom', 0, -10, 190, INK); text('added you.', 0, 140, 160, INK); ctx.restore();
  big('AGAIN.', 540, 1010, 230, 0.02, '#ffd84a', '#2b0d12');
  const s = 12, X = 540, hc0 = 1590;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 1380, W, 540); ctx.clip();
  drawCharacter(ctx, 'steve', X, hc0 + 80 * s, s, { eyes: 'pinpoint', brow: 'worried', mouth: 'O', fx: ['sweat'], hair: 2, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
  ctx.restore();
}
const OPTS = [optA, optB, optC];
function render(i) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.textBaseline = 'alphabetic'; OPTS[i](0.1); ctx.font = '600 34px Fredoka'; ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.textAlign = 'right'; ctx.fillText('UNIT 4B', W - 30, H - 30); ctx.textAlign = 'start'; }
window.render = render; window.DUR = 3; window.TEXTS = () => [];
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) { const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f); }
  render(0); window.READY = true;
})();
