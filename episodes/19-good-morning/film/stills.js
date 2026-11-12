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
  const phx = 810, phy = 1070;
  // pillow behind his head
  const pl = spen(t, 14);
  pl.part(roundPoly([[-40, 560], [650, 540], [680, 1250], [-40, 1270]], 120), '#f4f1ff', { shade: 0.1, lw: 6 });
  pl.line([[40, 700], [90, 1100]], 4, 'rgba(42,34,48,0.18)');
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', lid: 0.5, brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.5, hair: 2, bags: 1,
    armL: armTo(X, shY, s, phx - 120, phy + 90, [0, -3]), armR: armTo(X, shY, s, phx - 120, phy + 90, [0, -3]) }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s);
  faceGlow(hc, 'rgba(255,170,215,0.65)', 200, 20);
  // blanket up to the chest
  const bp = spen(t, 15);
  bp.part(roundPoly([[-60, 1290], [200, 1260], [520, 1280], [760, 1310], [1140, 1290], [1140, 1930], [-60, 1930]], 60), '#7fa7d9', { shade: 0.12, lw: 6 });
  for (const x of [140, 420, 700]) bp.line([[x, 1380], [x + 30, 1600]], 4, 'rgba(42,34,48,0.35)');
  // cat, buried to the neck in cards, fully inside the frame
  drawCharacter(ctx, 'snuggles', 215, 1575, 8, { eyes: 'dot', lid: 0.35, mouth: 'line', look: 0.4 }, { frame: boilFrame(t) });
  // phone, screen to the viewer
  phoneAt(phx, phy, 260, 400, 0.08, (w, h) => {
    ctx.fillStyle = '#ff9fc0'; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, -h / 2 + 40, w - 44, 150, 14); ctx.fill(); rose(0, -h / 2 + 115, 46);
    text('Good Morning', 0, -h / 2 + 235, 30, '#a02a58'); ctx.fillStyle = '#ffe29a'; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, 20, w - 44, 120, 14); ctx.fill(); sun(0, 80, 34);
  });
  glowBlob(phx - 20, phy - 120, 380, 'rgba(255,170,215,0.4)');
  // fountain of cards leaving the screen: motion streaks, then cards in flight, a few overlapping the screen edge
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (const [x0, x1, y1] of [[760, 700, 520], [810, 800, 440], [860, 920, 500], [900, 1000, 600], [720, 640, 640]]) { ctx.beginPath(); ctx.moveTo(x0, 930); ctx.quadraticCurveTo((x0 + x1) / 2, y1 - 60, x1, y1); ctx.stroke(); }
  ctx.restore();
  for (const [x, y, w, r, k] of [[1000, 1010, 110, -0.25, 0], [760, 860, 130, 0.3, 1], [880, 780, 130, -0.5, 2], [700, 640, 130, 0.4, 0], [940, 620, 120, 0.6, 1], [820, 520, 120, -0.3, 2], [1010, 760, 100, 0.8, 0], [620, 840, 110, -0.7, 1]]) card(x, y, w, r, k);
  sparkle(560, 560, 34); sparkle(1000, 480, 28, '#fff7a8'); sparkle(640, 1010, 24);
  // falling onto his chest and the blanket
  card(700, 1380, 150, -0.3, 0); card(330, 1440, 160, 0.25, 1);
  pileRow(600, 1060, 1400, 1560, 8, 170, 250); pileRow(20, 330, 1470, 1560, 3, 160, 220);
  ctx.save(); ctx.fillStyle = '#e63946'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(955, 880, 56, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); text('47', 955, 884, 56, '#fff');
  ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(phx - 120, phy + 90, 46, 34, 0.3, 0, 7); ctx.fill(); ctx.stroke();   // hand on the phone edge
  // sweat drops, clear of the pillow
  { const dp = spen(t, 31); drop(dp, 140, 700, 22, 0.3); drop(dp, 90, 860, 18, -0.2); drop(dp, 520, 1010, 20, 0.2); }
  // nothing under the caption plate: plain blanket strip
  ctx.fillStyle = '#7fa7d9'; ctx.fillRect(0, 1625, W, H - 1625);
  title(); plate('snuggles', ['Six A.M. The family', 'group chat woke UP.'], ['UP']);
}

// ---------- STILL 2 · CLIMAX ----------
function still2(t) {
  SEED = 21; room(t, false);
  pileRow(-40, 330, 20, 1200, 22, 190, 300); pileRow(760, 1120, 20, 1200, 22, 190, 300);
  pileRow(300, 780, 20, 220, 8, 170, 240);
  const s = 12, X = 540, hc0 = 860, Y = hc0 + 80 * s, shY = Y - 60 * s;
  const pcx = 540, pcy = 1470;
  glowBlob(pcx, pcy, 700, 'rgba(255,120,190,0.6)');
  // Steve leaning over the bed, both arms straight down onto the pillow
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'pinpoint', brow: 'worried', mouth: 'O', fx: ['sweat', 'gloom'], look: 0, hair: 2, bags: 1, lean: 0,
    armL: armTo(X, shY, s, pcx - 200, pcy - 60, [-8, 0]), armR: armTo(X, shY, s, pcx + 200, pcy - 60, [8, 0]) }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,140,200,0.4)', 0, 150);
  // mattress/blanket hides his legs
  const bp = spen(t, 16);
  bp.part(roundPoly([[-60, 1420], [540, 1400], [1140, 1420], [1140, 1930], [-60, 1930]], 50), '#7fa7d9', { shade: 0.12, lw: 6 });
  for (const [x, y, w, r, k] of [[210, 1330, 130, -0.9, 0], [880, 1320, 130, 0.9, 2], [140, 1560, 140, -0.4, 1], [930, 1560, 140, 0.5, 0]]) card(x, y, w, r, k);
  // pillow glowing pink from inside (phone underneath)
  const pp = spen(t, 17);
  pp.part(roundPoly([[pcx - 340, pcy - 110], [pcx + 340, pcy - 110], [pcx + 370, pcy + 110], [pcx - 370, pcy + 110]], 80), '#ffc2dc', { shade: 0.1, lw: 7 });
  glowBlob(pcx, pcy, 440, 'rgba(255,90,170,0.7)'); glowBlob(pcx, pcy, 240, 'rgba(255,255,255,0.55)');
  pp.line([[pcx - 280, pcy + 70], [pcx - 120, pcy + 50], [pcx + 60, pcy + 80], [pcx + 280, pcy + 60]], 4, 'rgba(42,34,48,0.35)');
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 6; ctx.lineCap = 'round';   // light leaking from the seams
  for (const [x, y, dx, dy] of [[-370, 0, -60, -10], [370, 0, 60, -10], [-250, 110, -30, 50], [250, 110, 30, 50], [-200, -110, -20, -50], [200, -110, 20, -50]]) { ctx.beginPath(); ctx.moveTo(pcx + x, pcy + y); ctx.lineTo(pcx + x + dx, pcy + y + dy); ctx.stroke(); }
  ctx.restore();
  for (const [x, y, r] of [[pcx - 376, pcy - 10, 44], [pcx + 380, pcy, 44], [pcx - 160, pcy + 118, 36], [pcx + 190, pcy + 116, 36], [pcx - 330, pcy + 90, 30], [pcx + 20, pcy - 118, 34]]) rose(x, y, r);
  for (const [x, y] of [[250, 1230], [830, 1250], [690, 1250]]) sparkle(x, y, 30);
  for (const sx of [-1, 1]) { ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(pcx + sx * 200, pcy - 60, 48, 36, 0, 0, 7); ctx.fill(); ctx.stroke(); }
  { const dp = spen(t, 32); drop(dp, 300, 900, 24, 0.4); drop(dp, 250, 1020, 18, 0.2); drop(dp, 800, 1000, 22, -0.3); }
  title(); plate('steve', ['Stop BLOOMING!'], ['BLOOMING']);
}

// ---------- STILL 3 · PUNCH ----------
function still3(t) {
  SEED = 33; room(t, true);
  const s = 17, X = 320, hc0 = 920, Y = hc0 + 80 * s, shY = Y - 60 * s;
  const phx = 770, phy = 1390, pw = 330, ph = 490;
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'deadpan', lid: 0.55, mouth: 'line', look: 0.7, hair: 2, bags: 1, fx: ['gloom', 'sweat'],
    armL: armTo(X, shY, s, phx - pw / 2 + 5, phy + 40, [0, -3]), armR: armTo(X, shY, s, phx - pw / 2 + 5, phy + 40, [0, -3]) }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,225,235,0.35)', 200, 40);
  const bp = spen(t, 15);
  bp.part(roundPoly([[-60, 1530], [300, 1520], [640, 1540], [1140, 1530], [1140, 1930], [-60, 1930]], 60), '#7fa7d9', { shade: 0.12, lw: 6 });
  glowBlob(phx, phy - 60, 480, 'rgba(255,215,235,0.4)');
  phoneAt(phx, phy, pw, ph, 0.05, (w, h) => {
    // Grandma bubble (received, left) then Steve's sent glittery rose (right) with Sent ✓
    ctx.fillStyle = '#e8eaf4'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, -h / 2 + 36, w - 70, 190, 26); ctx.fill(); ctx.stroke();
    text('Grandma', -w / 2 + 100, -h / 2 + 66, 26, '#6a3b8a', 'Fredoka');
    ctx.font = '600 36px Fredoka'; ctx.fillStyle = INK; ctx.textAlign = 'center';
    text('Steve? Are you', -12, -h / 2 + 122, 32); text('okay? \u{1F64F}', -12, -h / 2 + 166, 32);
    card(w / 2 - 125, 62, 150, 0.06, 0, false); ctx.save(); ctx.translate(0, 0); ctx.restore();
    text('Sent ✓', w / 2 - 100, h / 2 - 50, 34, '#3a8a4a');
  });
  ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(phx - pw / 2 + 5, phy + 40, 46, 34, 0.3, 0, 7); ctx.fill(); ctx.stroke();   // hand on the phone edge
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
