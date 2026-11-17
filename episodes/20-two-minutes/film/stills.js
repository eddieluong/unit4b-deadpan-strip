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
  const s = 19, X = 540, hc0 = 625, Y = hc0 + 80 * s;
  candle(905, 920, 100, t);
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', lid: 0.55, brow: 'worried', mouth: 'line', fx: ['gloom', 'sweat'], look: 0, hair: 0, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,120,90,0.45)', 0, 260);
  // empty plate under the phone: clear white rim + well
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12;
  outline(() => { ctx.ellipse(540, 1480, 545, 235, 0, 0, 7); }, '#fbfaf5', 8); ctx.restore();
  outline(() => { ctx.ellipse(540, 1495, 440, 175, 0, 0, 7); }, '#e8e5db', 4);
  // arms: sleeves from the shoulders (behind the phone) up to fists holding the knife and fork
  for (const [hx, sx] of [[115, 1], [965, -1]]) {
    const pts = [[540 - sx * 150 * -1 * -1, 0]];
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const path = () => { ctx.beginPath(); ctx.moveTo(540 + (hx < 540 ? -150 : 150), 925); ctx.quadraticCurveTo(hx < 540 ? 80 : 1000, 975, hx, 800); };
    ctx.strokeStyle = INK; ctx.lineWidth = 36; path(); ctx.stroke(); ctx.strokeStyle = '#e2b23c'; ctx.lineWidth = 24; path(); ctx.stroke(); ctx.restore();
  }
  knife(115, 855, 160); fist(115, 805); fork(965, 855, 160); fist(965, 805);
  // phone (dark bezel, notch, light screen) propped on the plate; red badge only behind the text
  const px = 540, py = 1255, pw = 960, ph = 650; glowBlob(px, py, 760, 'rgba(255,90,70,0.3)');
  ctx.save(); ctx.translate(px, py); const q = spen(0.1, 9);
  q.part(roundPoly([[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [pw / 2, ph / 2], [-pw / 2, ph / 2]], 64), '#1b1f33', { shade: 0.08, lw: 7 });
  ctx.fillStyle = '#f6f7fc'; ctx.beginPath(); ctx.roundRect(-pw / 2 + 38, -ph / 2 + 30, pw - 76, ph - 60, 34); ctx.fill();
  ctx.fillStyle = '#1b1f33'; ctx.beginPath(); ctx.roundRect(-pw / 2 + 38, -34, 20, 68, 10); ctx.fill();   // notch / camera pill on the left edge
  ctx.fillStyle = '#d9dcec'; ctx.beginPath(); ctx.roundRect(pw / 2 - 38 - 14, -60, 6, 120, 3); ctx.fill();
  // scooter icon (no logo)
  ctx.save(); ctx.translate(0, -208); ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const wx of [-62, 62]) { ctx.beginPath(); ctx.arc(wx, 30, 24, 0, 7); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-62, 30); ctx.lineTo(-30, 30); ctx.lineTo(0, -4); ctx.lineTo(40, -4); ctx.lineTo(62, 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40, -4); ctx.lineTo(28, -40); ctx.lineTo(50, -40); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-92, -34, 62, 40, 8); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#e8262f'; ctx.beginPath(); ctx.roundRect(-400, -100, 800, 290, 60); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  ctx.lineJoin = 'round'; ctx.lineWidth = 18; ctx.font = '600 270px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeText('2 MIN', 0, 55); ctx.fillStyle = '#fff6dc'; ctx.fillText('2 MIN', 0, 55);
  ctx.restore();
  { const dp = spen(t, 31); drop(dp, 150, 520, 26, 0.3); drop(dp, 905, 440, 22, -0.2); }
  title(); plate('steve', ['Two MINUTES.'], ['MINUTES']);
}

// ---------- hallway (stills 2 + 3) ----------
function hall(t, doorX, doorW, doorTop, floorY, lx = doorX - doorW / 2 - 10, ly = doorTop - 94) {
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
  outline(() => { ctx.roundRect(lx - 60, ly - 36, 120, 72, 14); }, '#f4efe4', 5); text('4A', lx, ly + 2, 46, INK);
  // flat welcome mat in perspective (wider at the front edge), thin stripes
  p.part(roundPoly([[doorX - doorW / 2 + 20, floorY + 8], [doorX + doorW / 2 - 20, floorY + 8], [doorX + doorW / 2 + 50, floorY + 66], [doorX - doorW / 2 - 50, floorY + 66]], 4), '#b84a4a', { shade: false, lw: 5 });
  ctx.save(); ctx.strokeStyle = 'rgba(255,230,200,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(doorX - doorW / 2 + 4, floorY + 26); ctx.lineTo(doorX + doorW / 2 - 4, floorY + 26); ctx.moveTo(doorX - doorW / 2 - 14, floorY + 46); ctx.lineTo(doorX + doorW / 2 + 14, floorY + 46); ctx.stroke(); ctx.restore();
}
function bag(x, y, k = 1) {   // takeaway bag hanging from (x,y): cup lid + straw peeking out, receipt sticker, twisted handles
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  outline(() => { ctx.roundRect(-34, 8, 68, 44, 10); }, '#f4f4f4', 5);                                 // cup behind the bag mouth
  outline(() => { ctx.ellipse(0, 8, 40, 12, 0, 0, 7); }, '#d9423e', 5);                               // cup lid
  ctx.beginPath(); ctx.moveTo(10, 4); ctx.lineTo(26, -44); ctx.stroke();                              // straw
  outline(() => { ctx.moveTo(-84, 30); ctx.lineTo(84, 30); ctx.lineTo(96, 250); ctx.lineTo(-96, 250); ctx.closePath(); }, '#c99a62', 6);
  ctx.fillStyle = 'rgba(42,34,48,0.18)'; ctx.fillRect(-84, 30, 168, 24);
  outline(() => { ctx.moveTo(-84, 30); ctx.lineTo(-108, 24); ctx.lineTo(-96, 250); ctx.lineTo(-96, 250); ctx.closePath(); }, '#b0834d', 5);
  outline(() => { ctx.roundRect(-58, 100, 104, 112, 6); }, '#ffffff', 4);                              // white receipt sticker
  ctx.strokeStyle = 'rgba(42,34,48,0.7)'; ctx.lineWidth = 5; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-42, 122 + i * 19); ctx.lineTo(i % 2 ? 14 : 30, 122 + i * 19); ctx.stroke(); }
  ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-46, 30); ctx.bezierCurveTo(-46, -34, 0, -40, 0, 0); ctx.bezierCurveTo(0, -40, 46, -34, 46, 30); ctx.stroke();   // handles
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
  bag(NX - 150, nshY + 150, 0.95); fist(NX - 150, nshY + 154, 0.42);
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
  SEED = 12; hall(t, 840, 300, 610, 1450, 985, 440);
  const ns = 8.2, NX = 850, NY = 1450, nshY = NY - 52 * 0.9 * ns;
  glowBlob(NX, 1000, 400, 'rgba(255,220,150,0.5)');
  nanaDraw(t, NX, NY, ns, { armL: armTo(NX, nshY, ns * 0.9, NX - 120, nshY + 140, [0, -2]), armR: armTo(NX, nshY, ns * 0.9, NX + 105, nshY - 150, [5, -3]) });
  bag(NX - 120, nshY + 140, 0.9); fist(NX - 120, nshY + 144, 0.38);
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
