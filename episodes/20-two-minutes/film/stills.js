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
function napkin(x, y, w, k = 1, rot = 0) {   // bib tied round the neck at (x,y)=top centre
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
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


// place a leaning Steve so his head centre is at (hx,hy); returns body origin + helpers (lean th in radians, clockwise)
function placeSteve(hx, hy, sc, th) { return { X: hx - 42 * sc * Math.sin(th), Y: hy + 38 * sc + 42 * sc * Math.cos(th), sc, th }; }
function neckOf(P) { const { X, Y, sc, th } = P; return [X + 27 * sc * Math.sin(th) * -1 * -1, Y - 38 * sc - 27 * sc * Math.cos(th)]; }
function handLocal(P, T) {   // arm pose that reaches world point T despite the lean
  const { X, Y, sc, th } = P, px = X, py = Y - 38 * sc, vx = T[0] - px, vy = T[1] - py;
  const ux = vx * Math.cos(th) + vy * Math.sin(th), uy = -vx * Math.sin(th) + vy * Math.cos(th);
  const shY = Y - 60 * sc; return { hand: [ux / sc, (shY - (py + uy)) / sc], bend: [0, 4] };
}
function drool(x, y, len) { ctx.save(); ctx.strokeStyle = INK; ctx.fillStyle = '#d9f0ff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 7, y); ctx.lineTo(x - 5, y + len); ctx.arc(x, y + len, 9, Math.PI, 0, true); ctx.lineTo(x + 7, y); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function squiggle(x, y, w, dir = 1) { ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x, y); for (let i = 1; i <= 5; i++) ctx.lineTo(x + dir * (i * w / 5), y + (i % 2 ? -16 : 16)); ctx.stroke(); ctx.restore(); }

// ---------- STILL 1 · HOOK (glance test) ----------
function still1(t) {
  SEED = 5;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2b2036'); g.addColorStop(1, '#4a2f3a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const s = 19, X = 540, hc0 = 625, Y = hc0 + 80 * s, shY = Y - 60 * s;
  glowBlob(540, 700, 600, 'rgba(255,170,90,0.18)');
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', lid: 0.45, brow: 'worried', mouth: 'small', fx: ['gloom', 'sweat'], look: 0, hair: 0, bags: 1,
    armL: armTo(X, shY, s, 120, 800, [0, 5]), armR: armTo(X, shY, s, 960, 800, [0, 5]) }, { frame: boilFrame(t) });
  // extra dark sunken bags + drool
  { const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,120,90,0.4)', 0, 260);
    ctx.save(); ctx.strokeStyle = 'rgba(60,30,50,0.55)'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    for (const ex of [-1, 1]) { ctx.beginPath(); ctx.arc(X + ex * 7.2 * s, hc0 + 6 * s, 58, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); } ctx.restore();
    drool(X + 20, hc0 + 6.8 * s, 70); }
  napkin(X, hc0 + 15 * s - 6, 250, 1.25);
  // table top edge (hides his lap) with cloth drape
  const tp = spen(t, 3);
  tp.part(roundPoly([[-60, 1250], [1140, 1250], [1140, 1930], [-60, 1930]], 12), '#8e3b46', { shade: 0.1, lw: 6 });
  ctx.save(); ctx.fillStyle = 'rgba(255,240,220,0.13)'; for (let i = 0; i < 9; i++) ctx.fillRect(i * 140 - 20, 1262, 70, 670); ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 1250, W, 16);
  candle(985, 1245, 90, t);
  squiggle(280, 1110, 80, -1); squiggle(800, 1110, 80, 1); squiggle(300, 1170, 70, -1); squiggle(780, 1170, 70, 1);   // stomach growl
  // empty plate with a clear white rim, phone propped on it
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12;
  outline(() => { ctx.ellipse(540, 1520, 520, 175, 0, 0, 7); }, '#fbfaf5', 8); ctx.restore();
  outline(() => { ctx.ellipse(540, 1530, 420, 130, 0, 0, 7); }, '#e8e5db', 4);
  knife(120, 850, 160); fist(120, 800); fork(960, 850, 160); fist(960, 800);
  const px = 540, py = 1385, pw = 800, ph = 520; glowBlob(px, py, 600, 'rgba(255,90,70,0.25)');
  ctx.save(); ctx.translate(px, py); ctx.rotate(-0.045); const q = spen(0.1, 9);
  q.part(roundPoly([[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [pw / 2, ph / 2], [-pw / 2, ph / 2]], 56), '#1b1f33', { shade: 0.08, lw: 7 });
  ctx.fillStyle = '#f6f7fc'; ctx.beginPath(); ctx.roundRect(-pw / 2 + 32, -ph / 2 + 26, pw - 64, ph - 52, 30); ctx.fill();
  ctx.fillStyle = '#1b1f33'; ctx.beginPath(); ctx.roundRect(-pw / 2 + 32, -30, 18, 60, 9); ctx.fill();
  ctx.save(); ctx.translate(0, -160); ctx.scale(0.8, 0.8); ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const wx of [-62, 62]) { ctx.beginPath(); ctx.arc(wx, 30, 24, 0, 7); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-62, 30); ctx.lineTo(-30, 30); ctx.lineTo(0, -4); ctx.lineTo(40, -4); ctx.lineTo(62, 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40, -4); ctx.lineTo(28, -40); ctx.lineTo(50, -40); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-92, -34, 62, 40, 8); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#e8262f'; ctx.beginPath(); ctx.roundRect(-310, -75, 620, 240, 52); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.font = '600 225px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeText('2 MIN', 0, 48); ctx.fillStyle = '#fff6dc'; ctx.fillText('2 MIN', 0, 48);
  ctx.restore();
  { const dp = spen(t, 31); drop(dp, 150, 520, 26, 0.3); drop(dp, 905, 440, 22, -0.2); }
  title(); plate('steve', ['Two MINUTES.'], ['MINUTES']);
}

// ---------- hallway in perspective (stills 2 + 3) ----------
function hall(t, doorX, doorW, doorTop, floorY, lx = doorX - doorW / 2 - 10, ly = doorTop - 94) {
  const FL = 110, FR = 970;   // far wall spans FL..FR; side walls recede to the viewer
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#d9b98f'); g.addColorStop(1, '#c79c70'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const p = spen(t, 3);
  p.part(roundPoly([[FL, 190], [FR, 190], [FR, floorY], [FL, floorY]], 2), '#dcbc92', { shade: false, lw: 5 });
  ctx.save(); ctx.fillStyle = 'rgba(150,60,70,0.12)'; for (let x = FL + 10; x < FR; x += 110) ctx.fillRect(x, 190, 48, floorY - 190); ctx.restore();
  p.part([[-20, 20], [FL, 190], [FL, floorY], [-20, floorY + 150]], '#b98f68', { shade: false, lw: 5 });          // left wall
  p.part([[1100, 20], [FR, 190], [FR, floorY], [1100, floorY + 150]], '#a9815d', { shade: false, lw: 5 });         // right wall
  p.part([[-20, -20], [1100, -20], [1100, 20], [FR, 190], [FL, 190], [-20, 20]], '#efe3cf', { shade: false, lw: 5 }); // ceiling
  p.part([[-20, floorY + 150], [FL, floorY], [FR, floorY], [1100, floorY + 150], [1100, 1950], [-20, 1950]], '#7a5a4a', { shade: 0.1, lw: 5 });
  ctx.save(); ctx.strokeStyle = 'rgba(42,34,48,0.35)'; ctx.lineWidth = 4;
  for (let i = -3; i <= 9; i++) { const x0 = FL + i * 110; ctx.beginPath(); ctx.moveTo(x0, floorY); ctx.lineTo(540 + (x0 - 540) * 2.7, 1950); ctx.stroke(); } ctx.restore();
  // wall sconce on the right wall
  glowBlob(1040, 470, 260, 'rgba(255,225,150,0.55)'); outline(() => { ctx.moveTo(1010, 440); ctx.lineTo(1070, 430); ctx.lineTo(1070, 520); ctx.lineTo(1010, 510); ctx.closePath(); }, '#ffe9a8', 5);
  // open door (opening slightly skewed in perspective), lit interior, frame, leaf swung toward the viewer
  const L = doorX - doorW / 2, R = doorX + doorW / 2;
  p.part([[L - 24, doorTop - 24], [R + 24, doorTop - 4], [R + 24, floorY - 18], [L - 24, floorY]], '#6a3f33', { shade: 0.1, lw: 6 });
  const ig = ctx.createLinearGradient(0, doorTop, 0, floorY); ig.addColorStop(0, '#ffe2a0'); ig.addColorStop(1, '#ffc674');
  ctx.fillStyle = ig; ctx.beginPath(); ctx.moveTo(L, doorTop); ctx.lineTo(R, doorTop + 22); ctx.lineTo(R, floorY - 22); ctx.lineTo(L, floorY); ctx.fill();
  p.part([[R, doorTop + 22], [R + 150, doorTop + 70], [R + 150, floorY - 60], [R, floorY - 22]], '#8a5a44', { shade: 0.1, lw: 6 });
  ctx.fillStyle = '#e8c84a'; ctx.beginPath(); ctx.arc(R + 28, (doorTop + floorY) / 2 + 20, 12, 0, 7); ctx.fill();
  outline(() => { ctx.roundRect(lx - 60, ly - 36, 120, 72, 14); }, '#f4efe4', 5); text('4A', lx, ly + 2, 46, INK);
  p.part(roundPoly([[L + 20, floorY + 8], [R - 20, floorY + 8], [R + 50, floorY + 66], [L - 50, floorY + 66]], 4), '#b84a4a', { shade: false, lw: 5 });
  ctx.save(); ctx.strokeStyle = 'rgba(255,230,200,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(L + 4, floorY + 26); ctx.lineTo(R - 4, floorY + 26); ctx.moveTo(L - 14, floorY + 46); ctx.lineTo(R + 14, floorY + 46); ctx.stroke(); ctx.restore();
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
function nanaScene(t, X, Y, s, rot, hands, props) {   // whole-body cosy lean around the feet, hip out, front foot forward
  ctx.save(); ctx.translate(X, Y); ctx.rotate(rot); ctx.translate(-X, -Y);
  drawCharacter(ctx, 'nana', X, Y, s, { expr: 'happy', mouth: 'smile', eyes: 'happy', fx: ['blush'], tilt: -6, ...hands }, { frame: boilFrame(t) });
  outline(() => { ctx.moveTo(X - 3 * s, Y - 56 * s); ctx.lineTo(X + 3 * s, Y - 56 * s); ctx.lineTo(X + 13 * s, Y - 36 * s); ctx.lineTo(X + 19.5 * s, Y - 20 * s); ctx.lineTo(X + 16 * s, Y - 8 * s); ctx.lineTo(X - 15 * s, Y - 8 * s); ctx.closePath(); }, '#f2a6c6', 5);
  ctx.save(); ctx.strokeStyle = 'rgba(42,34,48,0.35)'; ctx.lineWidth = 3; for (const dx of [-8, 0, 8]) { ctx.beginPath(); ctx.moveTo(X + dx * s, Y - 40 * s); ctx.lineTo(X + dx * s * 1.4, Y - 9 * s); ctx.stroke(); } ctx.restore();
  outline(() => { ctx.rect(X - 11 * s, Y - 32 * s, 24 * s, 5 * s); }, '#fff1f5', 4);
  outline(() => { ctx.ellipse(X, Y - 55 * s, 6 * s, 2.6 * s, 0, 0, 7); }, '#fff1f5', 4);
  outline(() => { ctx.ellipse(X - 6 * s, Y + 6, 4.2 * s, 1.8 * s, 0, 0, 7); }, '#6a4a7a', 5);   // front slipper
  props && props();
  ctx.restore();
}

// ---------- STILL 2 · beat 8 ----------
function still2(t) {
  SEED = 9; hall(t, 770, 330, 650, 1400);
  const ns = 8.4, NX = 770, NY = 1410, nshY = NY - 52 * 0.9 * ns;
  glowBlob(NX, 1000, 420, 'rgba(255,220,150,0.5)');
  nanaScene(t, NX, NY, ns, 0.07, { armL: armTo(NX, nshY, ns * 0.9, NX - 150, nshY + 150, [0, -2]), armR: armTo(NX, nshY, ns * 0.9, NX + 100, nshY - 25, [3, -3]) }, () => {
    bag(NX - 150, nshY + 150, 0.95); fist(NX - 150, nshY + 154, 0.42);
    drumstick(NX + 100, nshY + 35, 0.28, 0.82); fist(NX + 100, nshY - 23, 0.4);
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (const dx of [-14, 8, 30]) { ctx.beginPath(); ctx.moveTo(NX + 125 + dx, nshY - 165); ctx.bezierCurveTo(NX + 145 + dx, nshY - 195, NX + 107 + dx, nshY - 220, NX + 129 + dx, nshY - 255); ctx.stroke(); } ctx.restore();
  });
  // Steve half out of his own door (left edge), twisted toward her, hand on the doorknob
  const sd = spen(t, 5); sd.part([[-30, 40], [105, 130], [105, 1490], [-30, 1720]], '#8a5a44', { shade: 0.1, lw: 6 });
  ctx.fillStyle = '#e8c84a'; ctx.beginPath(); ctx.arc(80, 1170, 16, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
  const s = 15, th = 0.2, P = placeSteve(395, 1010, s, th), knob = [84, 1170];
  drawCharacter(ctx, 'steve', P.X, P.Y, s, { eyes: 'dot', lid: 0.1, brow: 'raised', mouth: 'small', fx: ['sweat'], look: 0.9, hair: 0, bags: 1, lean: th * 180 / Math.PI, tilt: -5,
    armL: handLocal(P, knob), armR: { hand: [6, -14], bend: [0, 2] } }, { frame: boilFrame(t) });
  const nk = neckOf(P); napkin(nk[0], nk[1] - 4, 250, s / 15.5, th); fist(knob[0] + 6, knob[1] - 4, 0.42);
  { const dp = spen(t, 31); drop(dp, 590, 900, 22, 0.3); }
  title(); plate('nana', ['It\u2019s still WARM, dear.'], ['WARM']);
}

// ---------- STILL 3 · beat 9 punch ----------
function still3(t) {
  SEED = 12; hall(t, 880, 300, 620, 1400, 700, 480);
  const ns = 9.4, NX = 860, NY = 1420, nshY = NY - 52 * 0.9 * ns;
  glowBlob(NX, 1000, 420, 'rgba(255,220,150,0.5)');
  nanaScene(t, NX, NY, ns, -0.05, { armL: armTo(NX, nshY, ns * 0.9, NX - 130, nshY + 150, [0, -2]), armR: armTo(NX, nshY, ns * 0.9, NX + 115, nshY - 170, [5, -3]) }, () => {
    bag(NX - 130, nshY + 150, 0.9); fist(NX - 130, nshY + 154, 0.4);
    ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = 'round';   // wave motion arcs
    for (const a of [-2.3, -1.7, -1.1, -0.5]) { ctx.beginPath(); ctx.moveTo(NX + 125 + Math.cos(a) * 85, nshY - 250 + Math.sin(a) * 85); ctx.lineTo(NX + 125 + Math.cos(a) * 125, nshY - 250 + Math.sin(a) * 125); ctx.stroke(); }
    ctx.restore();
    drumstick(NX + 115, nshY - 150, 0.4, 0.86); fist(NX + 115, nshY - 170, 0.4);
  });
  const s = 23, th = 0.1, P = placeSteve(350, 800, s, th);
  drawCharacter(ctx, 'steve', P.X, P.Y, s, { expr: 'dead_inside', lid: 0.72, brow: undefined, mouth: 'line', fx: ['gloom'], look: 0, hair: 0, bags: 1, lean: th * 180 / Math.PI, tilt: -9, headDy: -1.5 }, { frame: boilFrame(t) });
  const nk = neckOf(P); napkin(nk[0], nk[1] - 4, 250, s / 15.5, th);
  { const dp = spen(t, 31); drop(dp, 585, 740, 26, 0.3); }
  title(); plate('steve', ['\u2026Enjoy.'], ['Enjoy']);
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
