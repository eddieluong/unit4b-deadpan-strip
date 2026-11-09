// UNIT 4B · 18 "Good Morning" — 3 KEY STILLS, full-bleed 9:16 panel (title inside the panel). render(0|1|2).
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

// ---------- STILL 1 · HOOK ----------
function still1(t) {
  SEED = 7; room(t, true);
  const s = 17, X = 330, hc0 = 900, Y = hc0 + 80 * s, shY = Y - 60 * s;
  const phx = 800, phy = 1060;
  // Steve (head+shoulders), arms up to the phone
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', lid: 0.5, brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.5, hair: 3, bags: 1,
    armL: armTo(X, shY, s, phx - 130, phy + 120, [0, -3]), armR: armTo(X, shY, s, phx + 120, phy + 150, [0, -3]) }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s);
  faceGlow(hc, 'rgba(255,170,215,0.6)', 170, 40);
  // pillow + blanket over his body
  const bp = spen(t, 15);
  bp.part(roundPoly([[-60, 1270], [140, 1230], [520, 1250], [760, 1290], [1140, 1270], [1140, 1930], [-60, 1930]], 60), '#7fa7d9', { shade: 0.12, lw: 6 });
  for (const x of [140, 420, 700]) bp.line([[x, 1330], [x + 30, 1600]], 4, 'rgba(42,34,48,0.35)');
  // cat half-buried at the left, ears and fedora out
  drawCharacter(ctx, 'snuggles', 150, 1300 + 34 * 8 - 60, 8, { eyes: 'dot', lid: 0.35, mouth: 'line', look: 0.4 }, { frame: boilFrame(t) });
  // phone, tilted, screen towards the viewer, counter badge
  phoneAt(phx, phy, 260, 400, 0.12, (w, h) => {
    ctx.fillStyle = '#ff9fc0'; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, -h / 2 + 40, w - 44, 150, 14); ctx.fill(); rose(0, -h / 2 + 115, 46);
    text('Good Morning', 0, -h / 2 + 235, 30, '#a02a58'); ctx.fillStyle = '#ffe29a'; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, 20, w - 44, 120, 14); ctx.fill(); sun(0, 80, 34);
  });
  glowBlob(phx - 20, phy - 120, 380, 'rgba(255,170,215,0.45)');
  // avalanche: arc of cards pouring out of the phone up-left then down onto his chest and the blanket
  const flow = [[780, 760, 150, 0.4, 0], [640, 640, 120, -0.5, 1], [900, 880, 110, 0.9, 2], [880, 640, 100, 0.3, 1], [1010, 790, 100, -0.4, 0], [560, 800, 100, 0.8, 2], [720, 540, 100, -0.2, 0]];
  flow.forEach(([x, y, w, r, k]) => card(x, y, w, r, k));
  sparkle(500, 560, 36); sparkle(940, 560, 28, '#fff7a8'); sparkle(610, 1180, 24);
  pileRow(560, 1060, 1240, 1560, 11, 170, 260); pileRow(40, 560, 1400, 1580, 6, 160, 240);
  card(470, 1235, 190, -0.25, 0); card(560, 1185, 170, 0.35, 1);   // chest/lap
  // counter badge
  ctx.save(); ctx.fillStyle = '#e63946'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(960, 930, 62, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); text('47', 960, 934, 62, '#fff');
  title(); plate('snuggles', ['Six A.M. The family', 'group chat woke UP.'], ['UP']);
}

// ---------- STILL 2 · CLIMAX ----------
function still2(t) {
  SEED = 21; room(t, false);
  // card pile climbing the sides up to the ceiling
  pileRow(-40, 330, 20, 1100, 22, 190, 300); pileRow(760, 1120, 20, 1100, 22, 190, 300);
  pileRow(300, 780, 20, 220, 8, 170, 240);
  const s = 12, X = 540, hc0 = 840, Y = hc0 + 80 * s, shY = Y - 60 * s;
  const pcx = 540, pcy = 1360;
  glowBlob(pcx, pcy, 700, 'rgba(255,120,190,0.7)');
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'pinpoint', brow: 'worried', mouth: 'O', fx: ['sweat', 'gloom'], look: 0, hair: 2, bags: 1,
    armL: armTo(X, shY, s, pcx - 190, pcy - 40, [-6, -2]), armR: armTo(X, shY, s, pcx + 190, pcy - 40, [6, -2]) }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,140,200,0.4)', 0, 150);
  // roses/cards squeezing out of the pillow seams
  for (const [x, y, w, r, k] of [[250, 1330, 130, -0.9, 0], [850, 1320, 130, 0.9, 2], [330, 1520, 140, -0.4, 1], [760, 1530, 140, 0.5, 0]]) card(x, y, w, r, k);
  // pillow with a pink glow, hands on top
  const pp = spen(t, 17);
  pp.part(roundPoly([[pcx - 330, pcy - 150], [pcx + 330, pcy - 150], [pcx + 360, pcy + 150], [pcx - 360, pcy + 150]], 90), '#ffc2dc', { shade: 0.1, lw: 7 });
  glowBlob(pcx, pcy, 420, 'rgba(255,110,180,0.55)');
  pp.line([[pcx - 280, pcy + 100], [pcx - 120, pcy + 70], [pcx + 60, pcy + 110], [pcx + 280, pcy + 80]], 4, 'rgba(42,34,48,0.4)');
  for (const [x, y, r] of [[pcx - 360, pcy - 20, 40], [pcx + 366, pcy - 10, 40], [pcx - 150, pcy + 160, 34], [pcx + 180, pcy + 158, 34], [pcx - 330, pcy + 130, 30]]) rose(x, y, r);
  for (const [x, y] of [[300, 1150], [790, 1170], [400, 1700 - 520], [690, 1150]]) sparkle(x, y, 30);
  // his hands pressing down
  for (const sx of [-1, 1]) { ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(pcx + sx * 190, pcy - 150, 46, 34, 0, 0, 7); ctx.fill(); ctx.stroke(); }
  title(); plate('steve', ['Stop BLOOMING!'], ['BLOOMING']);
}

// ---------- STILL 3 · PUNCH ----------
function still3(t) {
  SEED = 33; room(t, true);
  const s = 17, X = 320, hc0 = 920, Y = hc0 + 80 * s, shY = Y - 60 * s;
  const phx = 800, phy = 1200, pw = 360, ph = 560;
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'deadpan', lid: 0.55, mouth: 'line', look: 0.7, hair: 3, bags: 1, fx: ['gloom'],
    armL: armTo(X, shY, s, phx - pw / 2 - 20, phy + 150, [0, -3]), armR: armTo(X, shY, s, phx - pw / 2 - 20, phy + 150, [0, -3]) }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,225,235,0.35)', 200, 40);
  const bp = spen(t, 15);
  bp.part(roundPoly([[-60, 1330], [300, 1300], [640, 1320], [1140, 1340], [1140, 1930], [-60, 1930]], 60), '#7fa7d9', { shade: 0.12, lw: 6 });
  glowBlob(phx, phy - 60, 480, 'rgba(255,215,235,0.4)');
  phoneAt(phx, phy, pw, ph, 0.05, (w, h) => {
    // Grandma bubble (received, left) then Steve's sent glittery rose (right) with Sent ✓
    ctx.fillStyle = '#e8eaf4'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, -h / 2 + 36, w - 70, 190, 26); ctx.fill(); ctx.stroke();
    text('Grandma', -w / 2 + 100, -h / 2 + 66, 26, '#6a3b8a', 'Fredoka');
    ctx.font = '600 36px Fredoka'; ctx.fillStyle = INK; ctx.textAlign = 'center';
    text('Steve? Are you', -12, -h / 2 + 120, 38); text('okay? \u{1F64F}', -12, -h / 2 + 170, 38);
    card(w / 2 - 125, 62, 150, 0.06, 0, false); ctx.save(); ctx.translate(0, 0); ctx.restore();
    text('Sent ✓', w / 2 - 100, h / 2 - 50, 34, '#3a8a4a');
  });
  title(); plate('steve', ['…Good morning.'], ['morning']);
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
