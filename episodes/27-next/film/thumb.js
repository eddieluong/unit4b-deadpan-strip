// UNIT 4B · 23 "Every Floor" (Tập 14) — THUMBNAILS A/B/C (copied from stills.js; text instead of the title pill). Was: 3 KEY STILLS, full-bleed 9:16 panel. render(0|1|2).
// 0 = frame-1 hook (giant lit lift panel + Steve), 1 = PEAK (row 6: CLOSE button pops off), 2 = PUNCH (row 8: doors open at G on the neighbours).
import { drawCharacter, paper, panel } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const INK = '#2a2230', TITLE_Y = 232;
const SKIN = '#e2ac84';
const spen = (t, seed, lw = 3) => { const p = new VPen(ctx, 0, 0, 1, { lw, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
// pen in Steve/Snuggles local units (same mapping drawCharacter uses)
const lpen = (X, Y, s, seed = 5) => new VPen(ctx, X, Y, s, { lw: Math.max(2.4, s * 0.95), hand: true, frame: boilFrame(0.1), seed });
function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
function strokedText(s, x, y, size, fill = '#fff', lw = 10) {
  ctx.save(); ctx.font = `600 ${size}px "Fredoka"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.strokeText(s, x, y); ctx.fillStyle = fill; ctx.fillText(s, x, y); ctx.restore();
}
function bigText(s, y, size = 150, fill = '#fff6dc', rot = 0) { strokedText(s, 540, y, size, fill, 22); }
function title(T) {   // 1-2 lines inside the panel, top; clears y 170 (iPhone safe area)
  const L = Array.isArray(T) ? T : [T]; ctx.save(); ctx.font = '600 56px Fredoka';
  const w = Math.max(...L.map(l => ctx.measureText(l).width)) + 70, h = 104 + (L.length - 1) * 68, top = TITLE_Y - 52 + (L.length > 1 ? -4 : 0);
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, top, w, h, 52); ctx.fill();
  L.forEach((l, i) => text(l, 540, top + 55 + i * 68, 56, '#fff6dc')); ctx.restore();
}
function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---------- props ----------
import { CAST } from './lib/cast_stick.js';
function cloud(x, y, r, a = 0.9) {
  const parts = [[0, 0, r], [r * 0.9, r * 0.15, r * 0.75], [-r * 0.9, r * 0.2, r * 0.7], [r * 0.35, -r * 0.6, r * 0.7]].map(([dx, dy, rr]) => [x + dx, y + dy, rr]);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(42,34,48,0.55)'; ctx.lineWidth = 5;
  parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke(); });
  ctx.fillStyle = '#ffffff'; parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr - 2, 0, 7); ctx.fill(); });
  ctx.restore();
}
const SK = '#e2ac84', MUSTARD = (CAST.steve && CAST.steve.color) || '#e3a82b';
const RED = '#c8312b';
const armTube = (pts, w, col, seed = 31) => spen(0.1, seed, 5).tube(pts, w, col);
const NOARM = { hand: [0, 0], bend: [0, 0] };

function liftWall(t, y0 = 0, y1 = H) {
  ctx.fillStyle = '#d6c9ad'; ctx.fillRect(0, y0, W, y1 - y0);
  const p = spen(t, 40, 5);
  for (let x = 0; x < W + 270; x += 270) { ctx.fillStyle = (Math.floor(x / 270) % 2) ? 'rgba(255,255,255,0.14)' : 'rgba(120,100,60,0.10)'; ctx.fillRect(x, y0, 270, y1 - y0); p.line([[x, y0], [x, y1]], 5, '#a89a78'); }
}
function tie(X, Y, s, loose = false) {   // red tie on Steve's chest (local units)
  const p = lpen(X, Y, s, 77), rot = loose ? 14 : 0;
  ctx.save(); const c = p.T([0, 59]); ctx.translate(c[0], c[1]); ctx.rotate(rot * Math.PI / 180); ctx.translate(-c[0], -c[1] + (loose ? 6 * s : 0));
  const blade = loose ? [[-1.7, 56], [1.7, 56], [3, 46], [0, 41], [-3, 46]] : [[-1.7, 58], [1.7, 58], [3.2, 46], [0, 41], [-3.2, 46]];
  p.part(blade, RED, { shade: 0.2, lw: Math.max(4, s * 0.5) });
  p.part(roundPoly([[-2.6, 60.4], [2.6, 60.4], [2, 56.6], [-2, 56.6]], 1), '#a62620', { shade: false, lw: Math.max(4, s * 0.5) });
  ctx.restore();
  if (!loose) for (const sx of [-1, 1]) p.part([[sx * 1.2, 61.6], [sx * 5.6, 62.4], [sx * 3, 58.6]], '#ffffff', { shade: false, lw: Math.max(3.4, s * 0.4) });
}
function steve(X, Y, s, pose, hairStage, bags, loose) {
  window.STEVE_SKIN = SK;
  drawCharacter(ctx, 'steve', X, Y, s, { hair: hairStage, bags, arm: 'down', armL: NOARM, armR: NOARM, noShadow: true, ...pose }, { frame: boilFrame(0.1) });
  tie(X, Y, s, loose);
}
// ---- lift buttons ----
function glyph(kind, x, y, r) {
  ctx.save(); ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineWidth = r * 0.12; ctx.lineJoin = 'round';
  const tri = (cx, dir) => { ctx.beginPath(); ctx.moveTo(cx - dir * r * 0.34, y - r * 0.34); ctx.lineTo(cx + dir * r * 0.04, y); ctx.lineTo(cx - dir * r * 0.34, y + r * 0.34); ctx.closePath(); ctx.fill(); };
  if (kind === 'open') { tri(x - r * 0.2, -1); tri(x + r * 0.2, 1); ctx.fillRect(x - r * 0.04, y - r * 0.4, r * 0.08, r * 0.8); }
  if (kind === 'close') { tri(x - r * 0.28, 1); tri(x + r * 0.28, -1); }
  if (kind === 'bell') { ctx.beginPath(); ctx.arc(x, y - r * 0.05, r * 0.38, Math.PI, 0); ctx.lineTo(x + r * 0.5, y + r * 0.3); ctx.lineTo(x - r * 0.5, y + r * 0.3); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(x, y + r * 0.45, r * 0.12, 0, 7); ctx.fill(); }
  ctx.restore();
}
function lbtn(cx, cy, r, label, state = 'lit', seed = 1) {
  const p = spen(0.1, seed, Math.max(4, r * 0.07));
  ctx.fillStyle = 'rgba(42,34,48,0.35)'; ctx.beginPath(); ctx.arc(cx + r * 0.06, cy + r * 0.08, r * 1.16, 0, 7); ctx.fill();
  ctx.fillStyle = '#7d8493'; ctx.beginPath(); ctx.arc(cx, cy, r * 1.14, 0, 7); ctx.fill(); p.outline(ellipsePts(cx, cy, r * 1.14, r * 1.14, 40), true, Math.max(4, r * 0.08));
  if (state === 'missing') { ctx.fillStyle = '#1a1620'; ctx.beginPath(); ctx.arc(cx, cy, r * 0.82, 0, 7); ctx.fill(); return; }
  ctx.fillStyle = state === 'lit' ? '#ffd45a' : '#4a4452'; ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, 7); ctx.fill();
  if (state === 'lit') { ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(cx - r * 0.1, cy - r * 0.12, r * 0.62, 0, 7); ctx.fill(); }
  p.outline(ellipsePts(cx, cy, r * 0.9, r * 0.9, 40), true, Math.max(3, r * 0.06));
  if (['open', 'close', 'bell'].includes(label)) glyph(label, cx, cy, r); else text(label, cx, cy + r * 0.04, label.length > 1 ? r * 0.98 : r * 1.12, INK, 'Fredoka');
}
function glowOn(cx, cy, r, a = 0.55) { glowBlob(cx, cy, r * 2.1, `rgba(255,170,40,${a})`); }
function plate(x0, y0, x1, y1) {
  const p = spen(0.1, 55, 8);
  p.part(roundPoly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 36), '#b4bac6', { shade: 0.16, lw: 9 });
  ctx.fillStyle = '#8f95a3'; for (const [x, y] of [[x0 + 28, y0 + 28], [x1 - 28, y0 + 28], [x0 + 28, y1 - 28], [x1 - 28, y1 - 28]]) { ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill(); }
}
function floorDisplay(x, y, w, h, num, arrow) {
  const p = spen(0.1, 61, 6);
  p.part(roundPoly([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]], 14), '#1a1620', { shade: false, lw: 7 });
  text(num, x + (arrow ? 22 : 0), y + 4, h * 0.78, '#ff5a3a', 'Fredoka');
  if (arrow) { ctx.fillStyle = '#ff5a3a'; ctx.beginPath(); ctx.moveTo(x - w * 0.36, y - h * 0.16); ctx.lineTo(x - w * 0.14, y - h * 0.16); ctx.lineTo(x - w * 0.25, y + h * 0.2); ctx.closePath(); ctx.fill(); }
}
function bag(x0, y0, x1, y1, squash = 0, seed = 5) {   // olive backpack; squash pushes a dent into the right edge
  const p = spen(0.1, seed, 8), r = 70;
  const body = roundPoly([[x0, y0 + 30], [x1 - 60, y0], [x1 - squash * 0.3, y0 + (y1 - y0) * 0.25], [x1 + squash * 0.1, (y0 + y1) / 2], [x1 - squash * 0.3, y0 + (y1 - y0) * 0.75], [x1 - 40, y1 - 10], [x0 + 20, y1]], r, 8);
  p.part(body, '#6d8f58', { shade: 0.2, lw: 9 });
  const pk = roundPoly([[x0 + 60, y0 + (y1 - y0) * 0.5], [x1 - 160, y0 + (y1 - y0) * 0.5], [x1 - 150, y1 - 40], [x0 + 60, y1 - 30]], 40, 6);
  p.part(pk, '#587a46', { shade: 0.2, lw: 7 });
  p.line([[x0 + 80, y0 + (y1 - y0) * 0.62], [x1 - 180, y0 + (y1 - y0) * 0.62]], 6, '#2a2230');
  ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(x0 + 130, y0 + (y1 - y0) * 0.62, 14, 0, 7); ctx.fill();
  p.line([[x0 + 90, y0 + 70], [x1 - 140, y0 + 56]], 6, '#3f5a34');
}
// ---------- STILL 1 · HOOK ----------
function still1(t) {
  liftWall(t);
  const s = 15, X = 400, hcY = 610, Y = hcY + 80 * s;
  // cup arm (behind head layer is fine): right arm up holding the coffee
  const shR = [X + 8 * s, Y - 60 * s];
  steve(X, Y, s, { eyes: 'dot', lid: 0.1, brow: 'worried', mouth: 'teeth', look: 0.5, fx: ['sweat'], tilt: -3 }, 0, 0, false);
  armTube([[X - 8 * s, Y - 60 * s], [X - 190, Y - 52 * s + 40], [X - 175, Y - 38 * s]], 56, MUSTARD, 33);
  armTube([shR, [X + 230, Y - 56 * s + 20], [X + 300, Y - 48 * s - 60]], 56, MUSTARD, 34);
  // coffee cup in the right hand
  { const cx = X + 318, cy = Y - 48 * s - 70, p = spen(t, 66, 6);
    p.part(roundPoly([[cx - 52, cy - 62], [cx + 52, cy - 62], [cx + 40, cy + 62], [cx - 40, cy + 62]], 10), '#f4efe6', { shade: 0.15, lw: 7 });
    ctx.fillStyle = '#8a5a3a'; ctx.fillRect(cx - 47, cy - 30, 94, 38); p.line([[cx - 47, cy - 30], [cx + 47, cy - 30]], 5); p.line([[cx - 47, cy + 8], [cx + 47, cy + 8]], 5);
    cloud(cx - 4, cy - 100, 22, 0.9); cloud(cx + 20, cy - 150, 18, 0.85);
    spen(0.1, 67, 5).tube([[cx - 24, cy + 20], [cx, cy + 34], [cx + 26, cy + 20]], 36, SK); }
  ctx.fillStyle = SK; // hand over the cup grip
  floorDisplay(880, 430, 250, 130, '12', true);
  // giant panel
  const px0 = 20, py0 = 1040, px1 = 1060, py1 = 1885; plate(px0, py0, px1, py1);
  const labels = ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'G', 'open', 'close', 'bell'];
  const bx = [150, 410, 670, 930], by = [1135, 1325, 1515, 1705], r = 80, pos = [];
  labels.forEach((l, i) => { const cx = bx[i % 4], cy = by[Math.floor(i / 4)]; pos.push([cx, cy]); lbtn(cx, cy, r, l, 'lit', 100 + i); });
  pos.forEach(([cx, cy]) => glowOn(cx, cy, r));
  glowBlob(540, 1460, 900, 'rgba(255,170,50,0.18)');
  bigText('EVERY FLOOR', 262, 138, '#ffe27a');
}
// ---------- STILL 2 · PEAK (row 6) ----------
function still2(t) {
  liftWall(t);
  const s = 15, X = 330, hcY = 640, Y = hcY + 80 * s;
  // panel strip at the right
  plate(640, 690, 1060, 1860);
  const rows = [['close', 'open'], ['12', '11'], ['10', '9'], ['8', '7'], ['6', '5'], ['4', '3'], ['G', 'bell']];
  const cols = [760, 940], r = 58, pos = [];
  // 7 rows x 2 = 14 buttons; compute y
  rows.forEach((row, j) => row.forEach((l, k) => { const cx = cols[k], cy = 800 + j * 170; pos.push([cx, cy, l]); lbtn(cx, cy, r, l, l === 'close' ? 'missing' : 'lit', 200 + j * 2 + k); }));
  pos.forEach(([cx, cy, l]) => { if (l !== 'close') glowOn(cx, cy, r, 0.6); });
  // Steve (rage), wild hair, loose tie
  steve(X, Y, s, { expr: 'furious', eyes: 'angry', brow: 'angry', mouth: 'teeth', fx: ['vein', 'sweat'], puff: 1, tilt: 4 }, 2, 1, true);
  // stabbing arm to the empty CLOSE socket + fist
  armTube([[X + 8 * s, Y - 60 * s], [X + 250, Y - 60 * s - 30], [716, 812]], 54, MUSTARD, 35);
  { const q = spen(t, 68, 6), f = ellipsePts(742, 806, 44, 40, 24); ctx.fillStyle = SK; ctx.beginPath(); f.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.fill(); q.outline(f, true, 6); }
  // the popped button, flying, with motion lines
  { const bxp = 900, byp = 560, q = spen(0.1, 71, 6);
    for (const [dx, dy] of [[-70, 55], [-110, 100], [-40, 90]]) q.line([[bxp + dx, byp + dy], [bxp + dx * 0.4, byp + dy * 0.4]], 7, '#7a6a52');
    lbtn(bxp, byp, 52, 'close', 'lit', 300); glowOn(bxp, byp, 52, 0.5);
    for (const a of [-0.9, -0.5, -0.1]) { const x = 760 + Math.cos(a) * 80, y = 800 + Math.sin(a) * 80; q.line([[x, y], [760 + Math.cos(a) * 130, 800 + Math.sin(a) * 130]], 8, '#ffb62e'); } }
  // backpack, huge, squashed against the lower panel (drawn over Steve's lower body)
  bag(120, 1190, 790, 1790, 70, 9);
  // squash marks on the panel side
  { const q = spen(0.1, 72, 7); for (const y of [1380, 1500, 1620]) { q.line([[826, y - 24], [850, y], [826, y + 24]], 8, '#5a4a32'); } }
  // straps over Steve's shoulders
  { const q = spen(0.1, 73, 9); q.line([[X - 140, Y - 58 * s + 10], [X - 150, 1210]], 26, '#3f5a34'); q.line([[X + 140, Y - 58 * s + 10], [X + 150, 1210]], 26, '#3f5a34'); }
  // camera-shake ticks
  { const q = spen(0.1, 74, 7); for (const [x, y, a] of [[120, 380, 0.5], [60, 520, 0.2], [980, 360, -0.5]]) q.line([[x, y], [x + Math.cos(a) * 60, y + Math.sin(a) * 60]], 9, '#2a2230'); }
  bigText('CLOSE!!!', 262, 170, '#ff8a7a');
}
// ---------- STILL 3 · PUNCH (row 8) ----------
function neighbour(x, hy, r, skin, hair, shirt, kind, seed) {
  const p = spen(0.1, seed, 6);
  p.part(roundPoly([[x - r * 1.5, hy + r * 0.95], [x + r * 1.5, hy + r * 0.95], [x + r * 1.7, 1700], [x - r * 1.7, 1700]], r * 0.6), shirt, { shade: 0.15, lw: 7 });
  p.line([[x - r * 1.35, hy + r * 1.9], [x + r * 1.1, hy + r * 2.3]], r * 0.34, shirt === '#4a6a8a' ? '#3a5a7a' : '#3a3a4a'); p.line([[x + r * 1.35, hy + r * 1.9], [x - r * 1.1, hy + r * 2.3]], r * 0.34, shirt === '#4a6a8a' ? '#3a5a7a' : '#3a3a4a');
  const head = ellipsePts(x, hy, r, r * 1.06, 40);
  if (kind === 1) p.part(ellipsePts(x, hy - r * 0.55, r * 0.86, r * 0.6, 24), hair, { shade: false, lw: 6 });
  if (kind === 2) { p.part(ellipsePts(x, hy - r * 1.2, r * 0.5, r * 0.4, 20), hair, { shade: false, lw: 6 }); }
  p.part(head, skin, { shade: false, lw: 6 });
  if (kind === 1) p.part(roundPoly([[x - r, hy - r * 0.2], [x + r, hy - r * 0.2], [x + r * 0.8, hy - r * 0.9], [x, hy - r * 1.1], [x - r * 0.8, hy - r * 0.9]], r * 0.3), hair, { shade: false, lw: 6 });
  if (kind === 2) p.part(roundPoly([[x - r * 0.95, hy - r * 0.35], [x + r * 0.95, hy - r * 0.35], [x + r * 0.75, hy - r * 0.95], [x - r * 0.75, hy - r * 0.95]], r * 0.3), hair, { shade: false, lw: 6 });
  for (const sx of [-1, 1]) { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + sx * r * 0.38, hy + r * 0.05, r * 0.1, 0, 7); ctx.fill(); p.line([[x + sx * r * 0.7, hy - r * 0.32], [x + sx * r * 0.12, hy - r * 0.14]], 7); }
  p.line([[x - r * 0.4, hy + r * 0.6], [x, hy + r * 0.45], [x + r * 0.4, hy + r * 0.6]], 7);
}
function still3(t) {
  // lobby behind
  ctx.fillStyle = '#bfd1c0'; ctx.fillRect(0, 0, W, H);
  const lp = spen(t, 40, 5); for (let x = 200; x < W; x += 260) lp.line([[x, 330], [x, 1600]], 5, '#9bb09c');
  ctx.fillStyle = '#8fa592'; ctx.fillRect(0, 1450, W, 470);
  // crowd (behind Nana and Steve)
  neighbour(130, 800, 62, '#d9a07a', '#3a2a2a', '#7a4a4a', 1, 10);
  neighbour(520, 690, 70, '#f0c7a0', '#7a7a82', '#4a6a8a', 2, 11);
  neighbour(900, 760, 66, '#b9805a', '#2a2230', '#6a5a8a', 0, 12);
  neighbour(1000, 960, 52, '#e4b690', '#5a3a2a', '#4a7a5a', 1, 13);
  // Nana (nameless old lady) front, arms folded
  { const NX = 320, NY = 1735, ns = 12; window.STEVE_SKIN = SK;
    drawCharacter(ctx, 'nana', NX, NY, ns, { eyes: 'dot', lid: 0.42, brow: 'angry', mouth: 'line', arm: 'cross', fx: [], noShadow: true }, { frame: boilFrame(0.1) }); }
  for (const [x0, y0, x1, y1] of [[230, 1165, 410, 1210], [410, 1160, 230, 1213]]) { armTube([[x0, y0], [x1, y1]], 40, (CAST.nana && CAST.nana.color) || '#9a7ac8', 41); ctx.fillStyle = '#fffdf8'; ctx.beginPath(); ctx.arc(x1, y1, 19, 0, 7); ctx.fill(); }
  // lift ceiling + display + side doors (foreground)
  { const p = spen(t, 80, 7);
    p.part(roundPoly([[-20, -20], [W + 20, -20], [W + 20, 340], [-20, 340]], 10), '#d6c9ad', { shade: 0.1, lw: 8 });
    floorDisplay(540, 250, 260, 130, 'G', false);
    for (const [x0, x1] of [[-20, 130], [950, 1100]]) { p.part(roundPoly([[x0, 300], [x1, 300], [x1, 1760], [x0, 1760]], 6), '#aeb4bf', { shade: 0.18, lw: 8 }); p.line([[(x0 + x1) / 2, 360], [(x0 + x1) / 2, 1700]], 4, '#8f95a3'); }
    ctx.fillStyle = '#8d8574'; ctx.fillRect(0, 1755, W, 165); p.line([[0, 1755], [W, 1755]], 8); }
  // Steve in the lift, decayed, foreground right
  { const s = 14, X = 745, hcY = 1190, Y = hcY + 80 * s;
    steve(X, Y, s, { eyes: 'dot', lid: 0.55, brow: 'worried', mouth: 'line', look: -0.9, fx: ['sweat'], tilt: 5 }, 2, 1, true);
    armTube([[X - 8 * s, Y - 60 * s], [X - 200, Y - 56 * s + 100], [X - 190, Y - 40 * s]], 54, MUSTARD, 36);
    armTube([[X + 8 * s, Y - 60 * s], [X + 200, Y - 56 * s + 100], [X + 190, Y - 40 * s]], 54, MUSTARD, 37); }
  ctx.fillStyle = '#8d8574'; ctx.fillRect(0, 1755, W, 165); spen(t, 81, 8).line([[0, 1755], [W, 1755]], 8);
  const dp = spen(t, 83, 5); dp.line([[0, 1920], [0, 1755]], 4);
  strokedText('DING', 860, 470, 70, '#fff6dc', 12);
  bigText('SURPRISE.', 1440, 150, '#fff6dc');
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
