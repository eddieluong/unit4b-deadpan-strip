// UNIT 4B · 20 "Two Minutes Away" — 3 KEY STILLS, full-bleed 9:16 panel (title inside the panel). render(0|1|2).
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
  const T = 'POV: "2 minutes away"'; ctx.save(); ctx.font = '600 56px Fredoka'; const w = ctx.measureText(T).width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 52, w, 104, 52); ctx.fill();
  text(T, 540, TITLE_Y + 3, 56, '#fff6dc'); ctx.restore();
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


let SEED = 1;
function drop(p, x, y, sz, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 }); ctx.restore();
}
function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
function faceGlow(hc, rgba, dx = 0, dy = 100) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 8, 0, 7); ctx.clip();
  const g = ctx.createRadialGradient(hc[0] + dx, hc[1] + dy, 20, hc[0] + dx, hc[1] + dy, hc[2] * 1.5); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(hc[0] - 500, hc[1] - 500, 1000, 1000); ctx.restore();
}
function outline(fn, fill, lw = 6) { ctx.save(); ctx.fillStyle = fill; ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); fn(); ctx.fill(); ctx.stroke(); ctx.restore(); }
// fist gripping a handle that runs vertically through it
function fist(x, y, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.ellipse(0, 0, 40, 36, 0, 0, 7); ctx.fill(); ctx.stroke();
  for (const fy of [-22, -7, 8, 23]) { ctx.beginPath(); ctx.roundRect(-22, fy - 7, 50, 14, 7); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
function fork(x, y, len, rot = 0) {   // handle from (x,y) upward, tines at the top
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = INK; ctx.fillStyle = '#e9edf2'; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.roundRect(-9, -len, 18, len + 60, 9); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-34, -len - 120); ctx.lineTo(-34, -len - 30); ctx.quadraticCurveTo(-34, -len + 4, 0, -len + 4); ctx.quadraticCurveTo(34, -len + 4, 34, -len - 30); ctx.lineTo(34, -len - 120);
  ctx.lineTo(22, -len - 120); ctx.lineTo(22, -len - 40); ctx.lineTo(11, -len - 40); ctx.lineTo(11, -len - 120); ctx.lineTo(-11, -len - 120); ctx.lineTo(-11, -len - 40); ctx.lineTo(-22, -len - 40); ctx.lineTo(-22, -len - 120); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}
function knife(x, y, len, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = INK; ctx.fillStyle = '#e9edf2'; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.roundRect(-9, -len + 40, 18, len + 20, 9); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-9, -len + 40); ctx.lineTo(-9, -len - 130); ctx.quadraticCurveTo(34, -len - 120, 30, -len - 20); ctx.lineTo(9, -len + 40); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}
function drumstick(x, y, rot, sz = 1) {   // grip end at (x,y), meat towards -y
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sz, sz); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.fillStyle = '#f6efe0'; ctx.beginPath(); ctx.roundRect(-8, -70, 16, 80, 8); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(-9, 10, 9, 0, 7); ctx.arc(9, 10, 9, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c9772e'; ctx.beginPath(); ctx.moveTo(-10, -60); ctx.bezierCurveTo(-60, -90, -64, -170, -2, -188); ctx.bezierCurveTo(56, -172, 56, -96, 10, -60); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,225,160,0.7)'; ctx.beginPath(); ctx.ellipse(-20, -140, 9, 22, 0.3, 0, 7); ctx.fill();
  ctx.fillStyle = '#f6efe0'; ctx.beginPath(); ctx.ellipse(28, -178, 14, 11, 0, 0, 7); ctx.fill(); ctx.stroke();   // bitten edge
  ctx.restore();
}
function napkin(x, y, w, k = 1) {   // bib tied round the neck at (x,y)=top centre
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  outline(() => { ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, 38, w / 2, 0); ctx.lineTo(w * 0.42, 240); ctx.lineTo(-w * 0.42, 240); ctx.closePath(); }, '#fffaf0', 6);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(214,70,70,0.55)';
  for (let i = -4; i < 5; i++) ctx.fillRect(i * 60 - 14, 0, 28, 260); for (let j = 0; j < 5; j++) ctx.fillRect(-w, 30 + j * 56, 2 * w, 28); ctx.restore();
  outline(() => { ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, 38, w / 2, 0); ctx.lineTo(w * 0.42, 240); ctx.lineTo(-w * 0.42, 240); ctx.closePath(); }, 'rgba(0,0,0,0)', 6);
  outline(() => { ctx.moveTo(-w / 2 - 6, -4); ctx.lineTo(-w / 2 - 70, -40); ctx.lineTo(-w / 2 - 50, 26); ctx.closePath(); }, '#fffaf0', 5);   // knot ears
  outline(() => { ctx.moveTo(w / 2 + 6, -4); ctx.lineTo(w / 2 + 70, -40); ctx.lineTo(w / 2 + 50, 26); ctx.closePath(); }, '#fffaf0', 5);
  ctx.restore();
}
function candle(x, y, h, t) {
  glowBlob(x, y - h - 40, 260, 'rgba(255,190,90,0.55)');
  outline(() => { ctx.ellipse(x, y + 6, 58, 16, 0, 0, 7); }, '#c9a463', 5);
  outline(() => { ctx.moveTo(x - 24, y); ctx.lineTo(x - 22, y - h); ctx.quadraticCurveTo(x, y - h - 12, x + 22, y - h); ctx.lineTo(x + 24, y); ctx.closePath(); }, '#fff2cf', 5);
  ctx.fillStyle = '#fff2cf'; ctx.beginPath(); ctx.moveTo(x - 22, y - h + 2); ctx.quadraticCurveTo(x - 16, y - h + 40, x - 12, y - h + 12); ctx.fill();   // drip
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y - h - 4); ctx.lineTo(x, y - h - 16); ctx.stroke();
  outline(() => { ctx.moveTo(x, y - h - 74); ctx.bezierCurveTo(x + 24, y - h - 40, x + 18, y - h - 14, x, y - h - 14); ctx.bezierCurveTo(x - 18, y - h - 14, x - 22, y - h - 42, x, y - h - 74); }, '#ffb52e', 4);
  outline(() => { ctx.ellipse(x, y - h - 34, 7, 14, 0, 0, 7); }, '#fff6b0', 0.1);
}

// ---------- STILL 1 · HOOK (glance test) ----------
function still1(t) {
  SEED = 5;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2b2036'); g.addColorStop(1, '#4a2f3a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const p = spen(t, 3);
  // table top
  p.part(roundPoly([[-60, 900], [1140, 900], [1140, 1930], [-60, 1930]], 20), '#8e3b46', { shade: 0.1, lw: 6 });
  ctx.save(); ctx.fillStyle = 'rgba(255,240,220,0.13)'; for (let i = 0; i < 9; i++) ctx.fillRect(i * 140 - 20, 900, 70, 1030); ctx.restore();
  const s = 19, X = 540, hc0 = 650, Y = hc0 + 80 * s, shY = Y - 60 * s;
  candle(905, 945, 100, t);
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', lid: 0.55, brow: 'worried', mouth: 'line', fx: ['gloom', 'sweat'], look: 0, hair: 0, bags: 1,
    armL: armTo(X, shY, s, 115, 830, [0, 4]), armR: armTo(X, shY, s, 965, 830, [0, 4]) }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,120,90,0.45)', 0, 260);
  // fork (his right = screen right) and knife held up, handles in fists
  knife(115, 880, 160); fist(115, 830); fork(965, 880, 160); fist(965, 830);
  // empty plate under the phone
  outline(() => { ctx.ellipse(540, 1535, 525, 215, 0, 0, 7); }, '#f4f1ea', 7);
  outline(() => { ctx.ellipse(540, 1545, 440, 170, 0, 0, 7); }, '#e6e2d8', 4);
  // phone propped on the plate, GIANT 2 MIN badge as the screen
  const px = 540, py = 1265, pw = 1000, ph = 640; glowBlob(px, py, 760, 'rgba(255,90,70,0.45)');
  ctx.save(); ctx.translate(px, py); const q = spen(0.1, 9);
  q.part(roundPoly([[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [pw / 2, ph / 2], [-pw / 2, ph / 2]], 60), '#20253d', { shade: 0.08, lw: 7 });
  const sg = ctx.createLinearGradient(0, -ph / 2, 0, ph / 2); sg.addColorStop(0, '#ff4a3a'); sg.addColorStop(1, '#d1202e');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(-pw / 2 + 24, -ph / 2 + 24, pw - 48, ph - 48, 40); ctx.fill();
  ctx.lineJoin = 'round'; ctx.lineWidth = 22; ctx.strokeStyle = INK; ctx.font = '600 350px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeText('2 MIN', 0, 14); ctx.fillStyle = '#fff6dc'; ctx.fillText('2 MIN', 0, 14);
  ctx.restore();
  { const dp = spen(t, 31); drop(dp, 150, 520, 26, 0.3); drop(dp, 905, 440, 22, -0.2); }
  title(); plate('steve', ['Two MINUTES.'], ['MINUTES']);
}

// ---------- hallway (stills 2 + 3) ----------
function hall(t, doorX, doorW, doorTop, floorY) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#d9b98f'); g.addColorStop(1, '#c79c70'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.fillStyle = 'rgba(150,60,70,0.12)'; for (let x = 20; x < W; x += 120) ctx.fillRect(x, 0, 52, floorY); ctx.restore();   // wallpaper stripes
  const p = spen(t, 3);
  p.part(roundPoly([[-40, floorY], [1120, floorY], [1120, 1940], [-40, 1940]], 6), '#7a5a4a', { shade: 0.1, lw: 6 });
  ctx.save(); ctx.strokeStyle = 'rgba(42,34,48,0.35)'; ctx.lineWidth = 4; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(i * 150 - 40, floorY); ctx.lineTo(i * 260 - 300, 1930); ctx.stroke(); } ctx.restore();
  // open door: lit interior, frame, door leaf swung
  p.part(roundPoly([[doorX - doorW / 2 - 24, doorTop - 24], [doorX + doorW / 2 + 24, doorTop - 24], [doorX + doorW / 2 + 24, floorY], [doorX - doorW / 2 - 24, floorY]], 6), '#6a3f33', { shade: 0.1, lw: 6 });
  const ig = ctx.createLinearGradient(0, doorTop, 0, floorY); ig.addColorStop(0, '#ffe2a0'); ig.addColorStop(1, '#ffc674');
  ctx.fillStyle = ig; ctx.fillRect(doorX - doorW / 2, doorTop, doorW, floorY - doorTop);
  p.part(roundPoly([[doorX + doorW / 2, doorTop], [doorX + doorW / 2 + 150, doorTop + 40], [doorX + doorW / 2 + 150, floorY - 30], [doorX + doorW / 2, floorY]], 4), '#8a5a44', { shade: 0.1, lw: 6 });
  ctx.fillStyle = '#e8c84a'; ctx.beginPath(); ctx.arc(doorX + doorW / 2 + 28, floorY * 0.62 + doorTop * 0.38, 12, 0, 7); ctx.fill();
  outline(() => { ctx.roundRect(doorX - doorW / 2 - 70, doorTop - 130, 120, 70, 14); }, '#f4efe4', 5); text('4A', doorX - doorW / 2 - 10, doorTop - 94, 46, INK);
  // warm welcome mat
  p.part(roundPoly([[doorX - doorW / 2, floorY + 20], [doorX + doorW / 2, floorY + 20], [doorX + doorW / 2 - 20, floorY + 120], [doorX - doorW / 2 + 20, floorY + 120]], 8), '#b84a4a', { shade: false, lw: 5 });
}
function bag(x, y, k = 1) {   // anonymous paper delivery bag hanging from (x,y) handle top
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 36, Math.PI, 0); ctx.stroke();
  outline(() => { ctx.moveTo(-70, 0); ctx.lineTo(70, 0); ctx.lineTo(80, 190); ctx.lineTo(-80, 190); ctx.closePath(); }, '#c99a62', 6);
  ctx.fillStyle = 'rgba(42,34,48,0.2)'; ctx.fillRect(-70, 0, 140, 22);
  outline(() => { ctx.moveTo(-70, 0); ctx.lineTo(-90, -4); ctx.lineTo(-80, 190); ctx.lineTo(-70, 190); ctx.closePath(); }, '#b0834d', 5);
  ctx.restore();
}
function nanaDraw(t, X, Y, s, hands) {
  drawCharacter(ctx, 'nana', X, Y, s, { expr: 'happy', mouth: 'smile', eyes: 'happy', fx: ['blush'], ...hands }, { frame: boilFrame(t) });
  // dressing gown over the dress: pink quilted robe, belt, fluffy collar
  const sc = s;
  outline(() => { ctx.moveTo(X - 3 * sc, Y - 56 * sc); ctx.lineTo(X + 3 * sc, Y - 56 * sc); ctx.lineTo(X + 15 * sc, Y - 8 * sc); ctx.lineTo(X - 15 * sc, Y - 8 * sc); ctx.closePath(); }, '#f2a6c6', 5);
  ctx.save(); ctx.strokeStyle = 'rgba(42,34,48,0.35)'; ctx.lineWidth = 3; for (const dx of [-8, 0, 8]) { ctx.beginPath(); ctx.moveTo(X + dx * sc, Y - 40 * sc); ctx.lineTo(X + dx * sc * 1.4, Y - 9 * sc); ctx.stroke(); } ctx.restore();
  outline(() => { ctx.rect(X - 11 * sc, Y - 32 * sc, 22 * sc, 5 * sc); }, '#fff1f5', 4);
  outline(() => { ctx.ellipse(X, Y - 55 * sc, 6 * sc, 2.6 * sc, 0, 0, 7); }, '#fff1f5', 4);
}

// ---------- STILL 2 · beat 8 ----------
function still2(t) {
  SEED = 9; hall(t, 705, 330, 640, 1450);
  const ns = 8.6, NX = 705, NY = 1450, nshY = NY - 52 * 0.9 * ns;
  // Nana: left arm (screen left) holds the bag, right arm lifts the drumstick to her smile
  glowBlob(NX, 1000, 420, 'rgba(255,220,150,0.5)');
  nanaDraw(t, NX, NY, ns, { armL: armTo(NX, nshY, ns * 0.9, NX - 150, nshY + 150, [0, -2]), armR: armTo(NX, nshY, ns * 0.9, NX + 105, nshY - 20, [3, -3]) });
  bag(NX - 150, nshY + 150, 0.62); fist(NX - 150, nshY + 154, 0.42);
  drumstick(NX + 105, nshY + 40, 0.28, 0.82); fist(NX + 105, nshY - 18, 0.4);
  // steam from the food
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (const dx of [-14, 8, 30]) { ctx.beginPath(); ctx.moveTo(NX + 130 + dx, nshY - 160); ctx.bezierCurveTo(NX + 150 + dx, nshY - 190, NX + 112 + dx, nshY - 215, NX + 134 + dx, nshY - 250); ctx.stroke(); } ctx.restore();
  // Steve in the foreground-left with the napkin bib, looking across the hall
  const s = 16, X = 235, hc0 = 1010, Y = hc0 + 80 * s, shY = Y - 60 * s;
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', lid: 0.5, brow: 'worried', mouth: 'line', fx: ['sweat'], look: 0.9, hair: 0, bags: 1 }, { frame: boilFrame(t) });
  napkin(X, hc0 + 15 * s - 4, 250, 1.05);
  { const dp = spen(t, 31); drop(dp, 430, 880, 22, 0.3); }
  title(); plate('nana', ['It’s still WARM, dear.'], ['WARM']);
}

// ---------- STILL 3 · beat 9 punch ----------
function still3(t) {
  SEED = 12; hall(t, 840, 300, 610, 1450);
  const ns = 8.2, NX = 850, NY = 1450, nshY = NY - 52 * 0.9 * ns;
  glowBlob(NX, 1000, 400, 'rgba(255,220,150,0.5)');
  nanaDraw(t, NX, NY, ns, { armL: armTo(NX, nshY, ns * 0.9, NX - 120, nshY + 140, [0, -2]), armR: armTo(NX, nshY, ns * 0.9, NX + 105, nshY - 150, [5, -3]) });
  bag(NX - 120, nshY + 140, 0.55); fist(NX - 120, nshY + 144, 0.38);
  drumstick(NX + 105, nshY - 130, 0.3, 0.8); fist(NX + 105, nshY - 150, 0.38);
  const s = 21, X = 360, hc0 = 790, Y = hc0 + 80 * s, shY = Y - 60 * s;
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', lid: 0.6, brow: undefined, mouth: 'line', fx: ['gloom', 'sweat'], look: 0.3, hair: 0, bags: 1 }, { frame: boilFrame(t) });
  napkin(X, hc0 + 15 * s - 4, 300, 1.35);
  { const dp = spen(t, 31); drop(dp, 700, 640, 26, 0.3); }
  title(); plate('steve', ['…Enjoy.'], ['Enjoy']);
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
