// UNIT 4B · 20 "Two Minutes Away" — 3 KEY STILLS, full-bleed 9:16 panel (title inside the panel). render(0|1|2).
import { drawCharacter, paper, panel, nameTab, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { onTwos, boilFrame, ease } from './lib/motion.js';

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

// ---------- hallway in perspective (stills 2 + 3) ----------
const sceneSconce = y => y;
function hall(t, doorX, doorW, doorTop, floorY, lx = doorX - doorW / 2 - 10, ly = doorTop - 94, open = 1, sconceY = 470) {
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
  { const sy = sceneSconce(sconceY); glowBlob(1040, sy, 260, 'rgba(255,225,150,0.55)'); outline(() => { ctx.moveTo(1010, sy - 30); ctx.lineTo(1070, sy - 40); ctx.lineTo(1070, sy + 50); ctx.lineTo(1010, sy + 40); ctx.closePath(); }, '#ffe9a8', 5); }
  // open door (opening slightly skewed in perspective), lit interior, frame, leaf swung toward the viewer
  const L = doorX - doorW / 2, R = doorX + doorW / 2;
  p.part([[L - 24, doorTop - 24], [R + 24, doorTop - 4], [R + 24, floorY - 18], [L - 24, floorY]], '#6a3f33', { shade: 0.1, lw: 6 });
  const ig = ctx.createLinearGradient(0, doorTop, 0, floorY); ig.addColorStop(0, '#ffe2a0'); ig.addColorStop(1, '#ffc674');
  ctx.fillStyle = ig; ctx.beginPath(); ctx.moveTo(L, doorTop); ctx.lineTo(R, doorTop + 22); ctx.lineTo(R, floorY - 22); ctx.lineTo(L, floorY); ctx.fill();
  if (open < 1) { const xe = R - (R - L) * (1 - open) * 1; p.part([[L, doorTop], [R, doorTop + 22], [R, floorY - 22], [L, floorY]].map(([x, y], i) => i === 0 || i === 3 ? [lerp(L, R, 1 - (1 - open)) * 0 + (open > 0.02 ? lerp(L, R, open) : L), y] : [x, y]), '#8a5a44', { shade: 0.1, lw: 6 }); ctx.fillStyle = '#e8c84a'; ctx.beginPath(); ctx.arc(lerp(L, R, open) + 24, (doorTop + floorY) / 2 + 20, 12, 0, 7); ctx.fill(); }
  if (open > 0.5) {
  p.part([[R, doorTop + 22], [R + 150, doorTop + 70], [R + 150, floorY - 60], [R, floorY - 22]], '#8a5a44', { shade: 0.1, lw: 6 });
  ctx.fillStyle = '#e8c84a'; ctx.beginPath(); ctx.arc(R + 28, (doorTop + floorY) / 2 + 20, 12, 0, 7); ctx.fill();
  }
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


const lerp = (a, b, k) => a + (b - a) * k;

// =====================================================================================
// FULL FILM (Tập 11): worlds ported from the approved round-3 stills + animation layer. Timings: voice/timeline.json (retime.py).
// =====================================================================================
const RED = '#e8262f', SKIN = '#e2ac84';
let TL = null, EVT = null, DUR = 27, EV = [], LN = {};
const clamp01 = k => Math.max(0, Math.min(1, k)), seg = (t, a, b) => clamp01((t - a) / (b - a));
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
function cam(zoom, fx, fy, fn, rot = 0, dx = 0, dy = 0) { ctx.save(); ctx.translate(540 + dx, 960 + dy); if (rot) ctx.rotate(rot); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const hsh = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const blink = (t, b, per = 3.1, off = 0) => Math.min(1, b + (((t + off) % per) < 0.13 ? 0.55 : 0));
function bgFill(c0, c1) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(-1300, -1300, W + 2600, H + 2600); }

// ---------- caption plate (fits long lines) ----------
function plate(id, lines, stress = []) {
  ctx.save(); ctx.fillStyle = 'rgb(30,24,40)'; ctx.beginPath(); ctx.roundRect(40, PL_Y, 1000, 240, 36); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  nameTab(ctx, 70, PL_Y - 30, id, 34);
  let size = lines.length > 1 ? 76 : 100; ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.font = `600 ${size}px Fredoka`; const widest = Math.max(...lines.map(l => ctx.measureText(l).width)); if (widest > 930) size = Math.floor(size * 930 / widest);
  ctx.font = `600 ${size}px Fredoka`;
  lines.forEach((ln, li) => {
    const ws = ln.split(' '), gap = 20, wd = ws.map(w => ctx.measureText(w).width); let x = 540 - (wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
    const y = PL_Y + 135 + (li - (lines.length - 1) / 2) * (size + 6);
    ws.forEach((w, i) => { ctx.fillStyle = stress.some(s => w.replace(/^[“…"]/, '').startsWith(s)) ? '#ffd84a' : '#fff'; ctx.fillText(w, x, y); x += wd[i] + gap; });
  });
  ctx.restore();
}
const CAPS = {   // id: [speaker, lines, stress, hold after voice end]
  s1: ['steve', ['Two MINUTES.'], ['MINUTES'], 0.3], s2: ['snuggles', ['He said that an HOUR ago.'], ['HOUR'], 0.3],
  s3: ['steve', ['Why is he going LEFT?'], ['LEFT'], 0.3], s4: ['steve', ['Fine. I’ll WAIT.'], ['WAIT'], 0.3],
  s5: ['steve', ['It’s STILL two.'], ['STILL'], 0.0], s7: ['steve', ['FOOD!'], ['FOOD'], 0.25],
  s8: ['nana', ['It’s still WARM, dear.'], ['WARM'], 0.3], s9: ['steve', ['…Enjoy.'], ['Enjoy'], 1.2],
  s10: ['snuggles', ['So he ordered AGAIN.'], ['AGAIN'], 1.9],
};
function captions(t) {
  for (const l of TL.lines) {
    const c = CAPS[l.id]; if (!c) continue;
    const a = l.id === 's1' ? -1 : l.start - 0.03;
    if (t >= a && t <= l.end + c[3]) { plate(c[0], c[1], c[2]); return { id: l.id, text: c[1].join(' '), x0: 40, y0: PL_Y, x1: 1040, y1: PL_Y + 240 }; }
  }
  return null;
}

// ---------- extra props ----------
function scooter(x, y, k = 1, flip = 1, col = INK) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k * flip, k); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const wx of [-62, 62]) { ctx.beginPath(); ctx.arc(wx, 30, 24, 0, 7); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-62, 30); ctx.lineTo(-30, 30); ctx.lineTo(0, -4); ctx.lineTo(40, -4); ctx.lineTo(62, 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40, -4); ctx.lineTo(28, -40); ctx.lineTo(50, -40); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-92, -34, 62, 40, 8); ctx.fill(); ctx.restore();
}
function badge(t, pulse = true, size = 1) {   // the red "2 MIN" slab, centred on (0,45) in the caller's frame
  const pk = pulse ? 1 + 0.05 * Math.sin(2 * Math.PI * t / 0.55) : 1; ctx.save(); ctx.translate(0, 45); ctx.scale(pk * size, pk * size); ctx.translate(0, -45);
  ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(-310, -75, 620, 240, 52); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.font = '600 225px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeText('2 MIN', 0, 48); ctx.fillStyle = '#fff6dc'; ctx.fillText('2 MIN', 0, 48); ctx.restore();
}
function star(x, y, r, fill, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * 0.46 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
}
function thumb(tx, ty, press = 0, rot = -0.45) {   // pointing hand (ep19 v2): index tip at (tx,ty), short forearm entering from the bottom-right edge
  ctx.save(); ctx.translate(tx, ty); ctx.rotate(rot); const k = 1 - 0.06 * press; ctx.scale(k, k); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = SKIN; ctx.beginPath(); ctx.roundRect(-58, 290, 116, 700, 40); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2b630'; ctx.beginPath(); ctx.roundRect(-66, 400, 132, 70, 18); ctx.fill(); ctx.stroke();
  ctx.fillStyle = SKIN; ctx.beginPath(); ctx.ellipse(6, 255, 80, 92, 0, 0, 7); ctx.fill(); ctx.stroke();
  for (const [cx, cy] of [[-58, 215], [-62, 262], [-52, 309]]) { ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7); ctx.fill(); ctx.stroke(); }
  ctx.save(); ctx.translate(70, 232); ctx.rotate(-0.5); ctx.beginPath(); ctx.ellipse(0, 0, 28, 50, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.beginPath(); ctx.roundRect(-22, 0, 44, 200, 22); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(0, 26, 10, 16, 0, 0, 7); ctx.fill(); ctx.restore();
}
function phoneBody(x, y, w, h, rot, screen) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const q = spen(0.1, 9);
  q.part(roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], 56), '#1b1f33', { shade: 0.08, lw: 7 });
  ctx.fillStyle = '#f6f7fc'; ctx.beginPath(); ctx.roundRect(-w / 2 + 32, -h / 2 + 26, w - 64, h - 52, 30); ctx.fill();
  ctx.fillStyle = '#1b1f33'; ctx.beginPath(); ctx.roundRect(-w / 2 + 32, -30, 18, 60, 9); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2 + 32, -h / 2 + 26, w - 64, h - 52, 30); ctx.clip(); screen && screen(w, h); ctx.restore(); ctx.restore();
}
function wobbleCandle(x, y, h, t) {   // approved candle + flame flicker
  glowBlob(x, y - h - 40, 260 + 12 * Math.sin(t * 17), 'rgba(255,190,90,0.55)');
  outline(() => { ctx.ellipse(x, y + 6, 58, 16, 0, 0, 7); }, '#c9a463', 5);
  outline(() => { ctx.moveTo(x - 24, y); ctx.lineTo(x - 22, y - h); ctx.quadraticCurveTo(x, y - h - 12, x + 22, y - h); ctx.lineTo(x + 24, y); ctx.closePath(); }, '#fff2cf', 5);
  ctx.fillStyle = '#fff2cf'; ctx.beginPath(); ctx.moveTo(x - 22, y - h + 2); ctx.quadraticCurveTo(x - 16, y - h + 40, x - 12, y - h + 12); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y - h - 4); ctx.lineTo(x, y - h - 16); ctx.stroke();
  const fx = 5 * Math.sin(t * 21) + 3 * Math.sin(t * 37), fk = 1 + 0.08 * Math.sin(t * 29);
  ctx.save(); ctx.translate(x, y - h - 14); ctx.scale(1, fk); ctx.translate(-x, -(y - h - 14));
  outline(() => { ctx.moveTo(x + fx, y - h - 74); ctx.bezierCurveTo(x + 24, y - h - 40, x + 18, y - h - 14, x, y - h - 14); ctx.bezierCurveTo(x - 18, y - h - 14, x - 22, y - h - 42, x + fx, y - h - 74); }, '#ffb52e', 4);
  outline(() => { ctx.ellipse(x + fx * 0.4, y - h - 34, 7, 14, 0, 0, 7); }, '#fff6b0', 0.1); ctx.restore();
}
function stubbleDots(k, hx, hy) {
  ctx.save(); ctx.strokeStyle = 'rgba(30,22,34,0.9)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; const n = Math.floor(120 * k);
  for (let i = 0, c = 0; i < 400 && c < n; i++) {
    const a = 0.12 * Math.PI + hsh(i * 3.1) * 0.76 * Math.PI, rr = 285 * (0.6 + 0.36 * hsh(i * 7.7)), x = hx + Math.cos(a) * rr, y = hy + Math.sin(a) * rr;
    if (y < hy + 125 || (Math.abs(x - hx) < 95 && y < hy + 205)) continue; c++;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3, y + 11); ctx.stroke();
  }
  ctx.restore();
}
function cobweb(k) {
  const ax = 960, ay = 575; ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.88)'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const tips = [[-165, -190], [-90, -255], [10, -270], [105, -225], [160, -130]].map(([dx, dy]) => [dx * k, dy * k]);
  for (const [dx, dy] of tips) { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + dx, ay + dy); ctx.stroke(); }
  for (const rr of [0.36, 0.64, 0.92]) { ctx.beginPath(); tips.forEach(([dx, dy], i) => { const x = ax + dx * rr, y = ay + dy * rr; i ? ctx.quadraticCurveTo(ax + (tips[i - 1][0] + dx) * rr * 0.5 * 0.93, ay + (tips[i - 1][1] + dy) * rr * 0.5 * 0.93 + 8, x, y) : ctx.moveTo(x, y); }); ctx.stroke(); }
  ctx.restore();
}
function spider(t, k) {   // hangs on a thread in the web, waves one big leg
  const x = 1010, y = 380 + 150 * eo(k) + 5 * Math.sin(t * 3.4); if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 230); ctx.lineTo(x, y - 20); ctx.stroke();
  ctx.translate(x, y); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const sy of [-1, 1]) for (const [a, b] of [[-0.3, 1], [0.3, 1.1], [0.9, 1]]) { ctx.beginPath(); ctx.moveTo(-sy * 8, a * 12); ctx.lineTo(-sy * 40 * b, a * 12 + 20); ctx.lineTo(-sy * 56 * b, a * 12 + 6 + 28); ctx.stroke(); }
  const w = 0.9 * Math.sin(t * 9);   // the waving leg: hand-sized arc
  ctx.beginPath(); ctx.moveTo(8, -6); ctx.lineTo(8 + 44 * Math.cos(-1.0 + w), -6 + 44 * Math.sin(-1.0 + w)); ctx.lineTo(8 + 44 * Math.cos(-1.0 + w) + 40 * Math.cos(-1.9 + w * 1.4), -6 + 44 * Math.sin(-1.0 + w) + 40 * Math.sin(-1.9 + w * 1.4)); ctx.stroke();
  ctx.fillStyle = '#3a2f48'; ctx.beginPath(); ctx.ellipse(0, 6, 28, 24, 0, 0, 7); ctx.fill(); ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#fff'; for (const ex of [-9, 9]) { ctx.beginPath(); ctx.arc(ex, 0, 6.5, 0, 7); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + 1.5, 1, 3, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; }
  ctx.restore();
}

// ---------- TABLE world (frame 1 / hook / decay) ----------
function tableW(t, o = {}) {
  SEED = 5; const m = onTwos(t); bgFill('#2b2036', '#4a2f3a');
  const s = 19, X = 540, hc0 = 625, Y = hc0 + 80 * s, shY = Y - 60 * s, hdy = o.headDy || 0, hcy = hc0 - hdy * s;
  glowBlob(540, 700, 600, 'rgba(255,170,90,0.18)');
  const bang = o.bang ? Math.abs(Math.sin(Math.PI * seg(t, o.bang[0], o.bang[1]) * 2)) * (t > o.bang[0] && t < o.bang[1] ? 1 : 0) : 0;   // two table thumps
  const wig = (o.jig ?? 1), fyL = 800 + 14 * Math.sin(t * 9) * wig + 150 * bang, fyR = 800 + 14 * Math.sin(t * 9 + 2) * wig + 150 * bang;
  const lid = (t > 0.3 && t < 0.44 ? 0.66 : 0.45) + (blink(t + 0.6, 0) > 0 && t > 1.2 ? 0.5 : 0);
  const face = { eyes: 'dot', lid: o.lid ?? lid, brow: 'worried', mouth: 'small', fx: ['gloom', 'sweat'], look: 0, hair: 0, bags: 1, ...(o.face || {}) };
  drawCharacter(ctx, 'steve', X, Y, s, { ...face, headDy: hdy + 0.35 * Math.sin(m * 1.9), tilt: o.tilt || 0, lean: o.lean || 0,
    armL: armTo(X, shY, s, 120, fyL, [0, 5]), armR: armTo(X, shY, s, 960, fyR, [0, 5]) }, { frame: boilFrame(m) });
  const hc = [X, hcy, 15 * s]; faceGlow(hc, 'rgba(255,120,90,0.4)', 0, 260);
  ctx.save(); ctx.strokeStyle = 'rgba(60,30,50,0.55)'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  for (const ex of [-1, 1]) { ctx.beginPath(); ctx.arc(X + ex * 7.2 * s, hcy + 6 * s, 58, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); } ctx.restore();
  if (o.stubble) stubbleDots(o.stubble, X, hcy);
  drool(X + 20, hcy + 6.8 * s, 62 + 12 * Math.sin(t * 2.3));
  const flap = (o.flap || 0) * Math.sin(t * 21);
  napkin(X, hcy + 15 * s - 6 + (o.napDy || 0), 250, 1.25, flap + (o.napRot || 0));
  if (o.knot) { const kx = X, ky = hcy + 15 * s + 10; ctx.save(); ctx.translate(kx, ky + (o.napDy || 0) * 0.3); ctx.rotate(o.knotRot || 0); outline(() => ctx.ellipse(0, 0, 38, 30, 0, 0, 7), '#fffaf0', 6); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-14, -6); ctx.lineTo(14, 8); ctx.moveTo(14, -6); ctx.lineTo(-14, 8); ctx.stroke(); ctx.restore(); }
  if (o.tug) { ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = 'round'; for (const [dx, dy, a] of [[-120, -10, 2.6], [120, -10, 0.55], [-90, 50, 2.0], [90, 50, 1.1]]) { ctx.beginPath(); ctx.moveTo(X + dx, hcy + 15 * s + dy); ctx.lineTo(X + dx + 50 * Math.cos(a), hcy + 15 * s + dy + 50 * Math.sin(a) * 0.6); ctx.stroke(); } ctx.restore(); }
  const tp = spen(m, 3);
  tp.part(roundPoly([[-1300, 1250], [2400, 1250], [2400, 3300], [-1300, 3300]], 12), '#8e3b46', { shade: 0.1, lw: 6 });
  ctx.save(); ctx.fillStyle = 'rgba(255,240,220,0.13)'; for (let i = -9; i < 18; i++) ctx.fillRect(i * 140 - 20, 1262, 70, 2000); ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-1300, 1250, W + 2600, 16);
  wobbleCandle(985, 1245, o.candleH ?? 90, t);
  const sq = 8 * Math.sin(t * 7);
  squiggle(280, 1110 + sq, 80, -1); squiggle(800, 1110 - sq, 80, 1); squiggle(300, 1170 - sq, 70, -1); squiggle(780, 1170 + sq, 70, 1);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; outline(() => { ctx.ellipse(540, 1520, 520, 175, 0, 0, 7); }, '#fbfaf5', 8); ctx.restore();
  outline(() => { ctx.ellipse(540, 1530, 420, 130, 0, 0, 7); }, '#e8e5db', 4);
  knife(120, fyL + 50, 160); fist(120, fyL); fork(960, fyR + 50, 160); fist(960, fyR);
  if (o.web) cobweb(o.web);
  spider(t, o.spider || 0);
  glowBlob(540, 1385, 600, 'rgba(255,90,70,0.25)');
  ctx.save(); ctx.translate(540, 1385 + (bang ? 6 * bang : 0)); ctx.rotate(-0.045);
  phoneBody(0, 0, 800, 520, 0, () => {
    ctx.save(); ctx.translate(0, -160); ctx.scale(0.8, 0.8); scooter(0, 0, 1); ctx.restore(); badge(t, true);
  }); ctx.restore();
  { const dp = spen(m, 31); drop(dp, 150, 520 + 6 * Math.sin(t * 3), 26, 0.3); drop(dp, 905, 440 + 8 * Math.sin(t * 2.6 + 1), 22, -0.2); }
  return hc;
}

// ---------- beat 2: wall clock whirl + candle melt ----------
function clockW(t) {
  bgFill('#3a2a44', '#2b2036'); const p = spen(onTwos(t), 3);
  ctx.save(); ctx.fillStyle = 'rgba(255,240,220,0.07)'; for (let i = -3; i < 10; i++) ctx.fillRect(i * 150, 0, 70, H); ctx.restore();
  const cx = 540, cy = 860, R = 360, k = seg(t, 2.78, 3.8), spin = eio(k), ang = 2 * Math.PI * spin * 1.0 - 0.0;   // one full turn = one hour
  glowBlob(cx, cy, 700, 'rgba(255,200,120,0.18)');
  ctx.save(); ctx.translate(cx + 5 * Math.sin(t * 30) * k * (1 - k) * 4, cy); ctx.rotate(0.03 * Math.sin(t * 24) * (k > 0 && k < 1 ? 1 : 0));
  outline(() => ctx.arc(0, 0, R + 34, 0, 7), '#c9772e', 9); outline(() => ctx.arc(0, 0, R, 0, 7), '#fff6e2', 7);
  ctx.strokeStyle = INK; ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.lineWidth = i % 3 ? 8 : 15; ctx.beginPath(); ctx.moveTo(Math.sin(a) * (R - 22), -Math.cos(a) * (R - 22)); ctx.lineTo(Math.sin(a) * (R - (i % 3 ? 52 : 70)), -Math.cos(a) * (R - (i % 3 ? 52 : 70))); ctx.stroke(); }
  const hand = (a, len, w) => { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-Math.sin(a) * 40, Math.cos(a) * 40); ctx.lineTo(Math.sin(a) * len, -Math.cos(a) * len); ctx.stroke(); };
  hand(2 * Math.PI * (1 / 12) * spin + 4.1, R * 0.5, 22); hand(ang + 2.5, R * 0.8, 13);
  if (k > 0 && k < 1) { ctx.save(); ctx.strokeStyle = 'rgba(42,34,48,0.18)'; ctx.lineWidth = 60; ctx.beginPath(); ctx.arc(0, 0, R * 0.5, -Math.PI / 2 + ang + 2.5 - 1.6, -Math.PI / 2 + ang + 2.5); ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 24, 0, 7); ctx.fill(); ctx.restore();
  // little bells on top shake while it spins
  for (const bx of [-1, 1]) { ctx.save(); ctx.translate(cx + bx * 230, cy - R - 20); ctx.rotate(bx * (0.5 + 0.18 * Math.sin(t * 46) * (k > 0 && k < 1 ? 1 : 0.2))); outline(() => ctx.ellipse(0, 0, 64, 40, 0, Math.PI, 0), '#e8b230', 6); ctx.restore(); }
  // "1 hour" tag drops after the whirl
  const tk = seg(t, 3.7, 3.95); if (tk > 0) { ctx.save(); ctx.translate(540, 1370); ctx.scale(0.6 + 0.4 * eb(tk), 0.6 + 0.4 * eb(tk)); outline(() => ctx.roundRect(-260, -66, 520, 132, 60), '#fff6dc', 7); text('1 HOUR LATER', 0, 4, 66, INK); ctx.restore(); }
}
function candleMeltW(t) {
  bgFill('#2b2036', '#4a2f3a'); const k = seg(t, 3.95, 4.75), h = lerp(330, 70, eio(k));
  const hc = [540, 640, 190]; drawCharacter(ctx, 'steve', 540, 640 + 80 * 12.7, 12.7, { eyes: 'dot', lid: 0.55, brow: 'worried', mouth: 'small', fx: ['gloom', 'sweat'], look: 0.1, hair: 0, bags: 1, headDy: 0.35 * Math.sin(t * 1.9) }, { frame: boilFrame(onTwos(t)) });
  napkin(540, 640 + 15 * 12.7 - 4, 250, 0.85);
  ctx.save(); ctx.translate(0, 0); ctx.fillStyle = '#8e3b46'; ctx.fillRect(-1300, 1330, W + 2600, 1000); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-1300, 1330, W + 2600, 14); ctx.restore();
  ctx.save(); ctx.translate(540, 1480); ctx.scale(2.3, 2.3); ctx.translate(-540, -1480);
  wobbleCandle(540, 1480, h, t);
  // wax drips running down the candle + puddle
  ctx.fillStyle = '#fff2cf'; ctx.strokeStyle = INK; ctx.lineWidth = 5;
  for (const [dx, d0] of [[-24, 0], [8, 0.25], [22, 0.45]]) { const dk = seg(k, d0, d0 + 0.5), len = 90 * dk; if (len > 0) { ctx.beginPath(); ctx.roundRect(540 + dx - 6, 1480 - h, 12, len, 6); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(540 + dx, 1480 - h + len + 4, 8, 0, 7); ctx.fill(); ctx.stroke(); } }
  ctx.beginPath(); ctx.ellipse(540, 1486, 58 + 34 * k, 16 + 6 * k, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
  return hc;
}

// ---------- beat 3: map close-up, Steve leans in ----------
function mapW(t) {
  bgFill('#2b2036', '#4a2f3a'); const k = seg(t, 4.8, 6.7), lean = kf(t, [[4.8, 0], [5.5, 14], [5.9, 4], [6.7, 20]]);
  const rx = t < 5.45 ? lerp(-230, 60, eio(seg(t, 4.8, 5.45))) : lerp(60, -420, eio(seg(t, 5.85, 6.7))), flip = t < 5.65 ? 1 : -1;   // toward the house, stop, U-turn, away (left)
  ctx.save(); ctx.translate(540, 880); ctx.rotate(-0.03); phoneBody(0, 0, 940, 700, 0, (w, h) => {
    ctx.fillStyle = '#cfe8c8'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = '#9fd0e8'; ctx.beginPath(); ctx.ellipse(-250, 170, 170, 90, 0.3, 0, 7); ctx.fill();
    ctx.strokeStyle = '#fffdf4'; ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-w / 2, 70); ctx.lineTo(w / 2, 70); ctx.moveTo(-60, -h / 2); ctx.lineTo(-60, h / 2); ctx.moveTo(190, -h / 2); ctx.lineTo(190, 70); ctx.stroke();
    ctx.strokeStyle = '#e8d9a8'; ctx.lineWidth = 6; ctx.setLineDash([22, 18]); ctx.beginPath(); ctx.moveTo(-w / 2, 70); ctx.lineTo(300, 70); ctx.stroke(); ctx.setLineDash([]);
    // house with a pin
    ctx.save(); ctx.translate(300, 70); ctx.fillStyle = '#ffd8a0'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.rect(-46, -34, 92, 74); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c8554a'; ctx.beginPath(); ctx.moveTo(-62, -34); ctx.lineTo(0, -86); ctx.lineTo(62, -34); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(rx, 70); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -10, 78, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke(); scooter(0, -6, 0.9, flip); ctx.restore();
    ctx.save(); ctx.translate(0, -h / 2 + 60); ctx.scale(0.55, 0.55); badge(t, true); ctx.restore();
  }); ctx.restore();
  const hx = lerp(300, 380, eio(k)) + 6 * Math.sin(t * 13) * (t > 5.65 ? 1 : 0);
  const face = t < 5.5 ? { eyes: 'dot', lid: 0.3, brow: 'raised', mouth: 'small', look: 0.9 } : t < 5.85 ? { eyes: 'wide', lid: 0, brow: 'raised', mouth: 'O', look: 1 } : { eyes: 'dot', lid: 0.15, brow: 'worried', mouth: 'wobble', look: 0.2 + 0.7 * Math.sin(t * 5) * 0 };
  drawCharacter(ctx, 'steve', hx, 1440 + 80 * 11.5, 11.5, { ...face, fx: ['sweat'], hair: 0, bags: 1, lean, tilt: lean * 0.5, headDy: 0.35 * Math.sin(t * 1.9) }, { frame: boilFrame(onTwos(t)) });
}

// ---------- beat 5b: asleep in the bread basket, the cat steals a roll ----------
function roll(x, y, k = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); outline(() => ctx.ellipse(0, 0, 62, 40, 0, 0, 7), '#d9a05b', 6); ctx.strokeStyle = INK; ctx.lineWidth = 4; for (const dx of [-24, 0, 24]) { ctx.beginPath(); ctx.moveTo(dx - 6, -22); ctx.lineTo(dx + 6, 22); ctx.stroke(); } ctx.restore(); }
function sleepW(t, o = {}) {
  const m = onTwos(t); bgFill('#2b2036', '#4a2f3a'); glowBlob(540, 900, 700, 'rgba(255,90,70,0.16)');
  const wake = o.wake || 0, br = Math.sin(t * 2.6) * (1 - wake);
  const s = 15, X = 290, hc0 = 650 - 140 * wake, Y = hc0 + 80 * s;
  const lift = eo(wake);   // head leaves the basket
  drawCharacter(ctx, 'steve', X + 30 * (1 - lift), Y + 100 * (1 - lift), s, { eyes: lift > 0.5 ? 'wide' : 'closed', lid: 0, brow: lift > 0.5 ? 'raised' : undefined, mouth: lift > 0.5 ? 'O' : 'wobble', hair: 0, bags: 1, fx: ['sweat'], lean: 14 * (1 - lift) + 6, tilt: 62 * (1 - lift) - 6, headDy: br * 0.6 - 2 * (1 - lift) }, { frame: boilFrame(m) });
  const hx = X + 30 * (1 - lift) + 6 * Math.sin(0) , hy = hc0 + 100 * (1 - lift);
  // phone glow on his cheek
  if (!lift) glowBlob(X + 255, hc0 + 130, 330, 'rgba(255,70,60,0.42)');
  // table + basket in front of the body
  const tp = spen(m, 3); tp.part(roundPoly([[-1300, 1110], [2400, 1110], [2400, 3300], [-1300, 3300]], 12), '#8e3b46', { shade: 0.1, lw: 6 });
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-1300, 1110, W + 2600, 14);
  outline(() => { ctx.moveTo(110, 1080); ctx.lineTo(830, 1080); ctx.lineTo(790, 1430); ctx.lineTo(150, 1430); ctx.closePath(); }, '#c99a62', 7);
  ctx.save(); ctx.beginPath(); ctx.moveTo(110, 1080); ctx.lineTo(830, 1080); ctx.lineTo(790, 1430); ctx.lineTo(150, 1430); ctx.closePath(); ctx.clip(); ctx.strokeStyle = 'rgba(90,60,30,0.55)'; ctx.lineWidth = 6;
  for (let i = -8; i < 16; i++) { ctx.beginPath(); ctx.moveTo(i * 60, 1060); ctx.lineTo(i * 60 + 340, 1440); ctx.moveTo(i * 60 + 340, 1060); ctx.lineTo(i * 60, 1440); ctx.stroke(); } ctx.restore();
  // rolls piled in the basket
  const stolen = t > 12.02, ph = seg(t, 11.45, 12.02);
  roll(250, 1090, 1, -0.3); roll(560, 1080, 0.95, 0.1); roll(720, 1096, 1, 0.35); if (!stolen) roll(400, 1070, 1, 0.2);
  // phone propped on the table, glowing "2 MIN"
  ctx.save(); ctx.translate(870, 1330); ctx.rotate(-0.12); ctx.scale(0.5, 0.5); phoneBody(0, 0, 800, 520, 0, () => { ctx.save(); ctx.translate(0, -160); ctx.scale(0.8, 0.8); scooter(0, 0, 1); ctx.restore(); badge(t, true); }); ctx.restore();
  // crumbs puff + Z z z
  if (!lift) { const ck = (t * 0.38) % 1; for (let i = 0; i < 5; i++) { const q = (ck + i * 0.2) % 1; ctx.fillStyle = `rgba(233,190,120,${1 - q})`; ctx.beginPath(); ctx.arc(250 + 70 * i + 30 * Math.sin(q * 6 + i), 1020 - 150 * q, 6 + 3 * (i % 2), 0, 7); ctx.fill(); }
    for (let i = 0; i < 3; i++) { const q = (t * 0.55 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(Math.PI * q); text('Z', 680 + 60 * q + 20 * i, 560 - 220 * q, 70 + 36 * q + 10 * i, '#e8e4ff', 'Fredoka', 0.2 * Math.sin(q * 5)); ctx.restore(); } }
  // the cat
  if (t > 11.3 && t < 12.9) {
    const cxp = t < 11.9 ? lerp(1300, 900, eo(seg(t, 11.3, 11.9))) : t < 12.1 ? 900 : lerp(900, 1400, eio(seg(t, 12.1, 12.85)));
    const grab = seg(t, 11.9, 12.05), bob = 8 * Math.abs(Math.sin(t * 16)) * (t < 11.9 || t > 12.1 ? 1 : 0);
    drawCharacter(ctx, 'snuggles', cxp, 1430 - bob, 8.5, { eyes: 'dot', lid: 0.3, mouth: 'line', look: -0.6, lean: -6 * grab, arm: 'hold', tail: Math.sin(t * 9) }, { frame: boilFrame(m) });
    if (t > 12.02) roll(cxp - 110, 1330 - bob, 0.8, -0.2 + 0.1 * Math.sin(t * 12));
  }
}

// ---------- beat 6: notification card ----------
function notif(t) {
  const t0 = 12.75, t1 = 13.85; if (t < t0 || t >= t1) return;
  const k = seg(t, t0, t0 + 0.4), y = lerp(-420, 700, eb(k)), sq = 1 + 0.04 * Math.sin((t - t0) * 30) * (1 - seg(t, t0 + 0.4, t0 + 0.9));
  ctx.save(); ctx.fillStyle = `rgba(20,14,28,${0.45 * clamp01((t - t0) * 6)})`; ctx.fillRect(0, 0, W, H);
  ctx.translate(540, y); ctx.scale(sq, 2 - sq); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
  ctx.fillStyle = '#f7f8fd'; ctx.beginPath(); ctx.roundRect(-450, -290, 900, 580, 54); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(-450, -290, 900, 130, [54, 54, 0, 0]); ctx.fill(); ctx.stroke();
  scooter(-330, -222, 0.62, 1, '#fff6dc'); text('Delivery', 40, -222, 58, '#fff6dc'); text('now', 370, -222, 46, '#ffd9d9');
  text('Your order', 0, -50, 120, INK); text('has arrived!', 0, 100, 120, INK);
  ctx.restore();
}

// ---------- beat 7: the sprint (living room) ----------
function runW(t) {
  const m = onTwos(t); bgFill('#3a2a44', '#2b2036'); const p = spen(m, 3);
  ctx.save(); ctx.fillStyle = 'rgba(255,240,220,0.07)'; for (let i = -3; i < 10; i++) ctx.fillRect(i * 150, 0, 70, H); ctx.restore();
  p.part(roundPoly([[-1300, 1520], [2400, 1520], [2400, 3300], [-1300, 3300]], 4), '#6b4a40', { shade: 0.1, lw: 6 });
  // door at the right, leaf yanks open at 14.85
  const dk = seg(t, 14.82, 15.05), L0 = 770, R0 = 1010, top = 420, fl = 1520;
  ctx.fillStyle = '#ffe2a0'; ctx.fillRect(L0, top, R0 - L0, fl - top);
  p.part([[L0 - 24, top - 24], [R0 + 24, top - 24], [R0 + 24, fl], [L0 - 24, fl], [L0 - 24, top - 24]], null, { lw: 8 });
  const xf = lerp(L0, R0 + 200, eio(dk)), yt = lerp(top, top + 80, dk), yb = lerp(fl, fl - 70, dk);
  p.part([[R0, top + 8], [xf, yt], [xf, yb], [R0, fl - 8]], '#8a5a44', { shade: 0.1, lw: 6 }); if (dk < 0.7) { ctx.fillStyle = '#e8c84a'; ctx.beginPath(); ctx.arc(xf + 26, 1000, 14, 0, 7); ctx.fill(); }
  // rug (bunches up on the skid)
  const skid = seg(t, 14.55, 14.85), rugX = 520 + 120 * eo(skid);
  p.part(roundPoly([[rugX - 330, 1600], [rugX + 330, 1600], [rugX + 380, 1720], [rugX - 380, 1720]], 4), '#b84a4a', { shade: false, lw: 5 });
  // Steve: crouch -> jump -> land + sprint -> skid
  const s = 11, G = 1520; let x, y, lean, sy = 1, arm = 'up', face = { eyes: 'wide', lid: 0, mouth: 'wide', brow: 'raised' };
  const cyc = Math.floor(t * 12) % 3, ARM = ['up', 'wide', 'surrender'];
  if (t < 14.0) { const k = seg(t, 13.85, 14.0); x = 200; y = G; lean = -10 * k; sy = 0.9; arm = 'down'; }
  else if (t < 14.25) { const k = seg(t, 14.0, 14.25); x = lerp(200, 400, eio(k)); y = G - 230 * Math.sin(Math.PI * k); lean = 14; sy = 1.08; arm = 'up'; }
  else if (t < 14.6) { const k = seg(t, 14.25, 14.6); x = lerp(400, 650, k); y = G - 60 * (cyc === 1 ? 1 : cyc === 2 ? 0.3 : 0); lean = 18 + 3 * cyc; arm = ARM[cyc]; sy = cyc === 1 ? 1.05 : 0.97; }
  else { const k = seg(t, 14.6, 14.85); x = lerp(650, 770, eo(k)); y = G; lean = lerp(18, -14, eo(k)); arm = 'surrender'; face = { eyes: 'wide', lid: 0, mouth: 'O', brow: 'raised' }; }
  if (t >= 14.85) { x = 770; y = G; lean = -6; arm = 'down'; face = { eyes: 'wide', lid: 0, mouth: 'grin', brow: 'raised' }; }
  if (t > 14.25 && t < 14.6) { ctx.save(); ctx.strokeStyle = 'rgba(255,240,220,0.8)'; ctx.lineWidth = 8; ctx.lineCap = 'round'; for (let i = 0; i < 5; i++) { const ly = 700 + i * 170, o = (t * 9 + i * 0.37) % 1; ctx.beginPath(); ctx.moveTo(x - 160 - 200 * o, ly); ctx.lineTo(x - 360 - 200 * o, ly); ctx.stroke(); } ctx.restore(); }
  const mm = m; ctx.save(); ctx.translate(x, y); ctx.scale(1 / sy, sy); ctx.translate(-x, -y);
  drawCharacter(ctx, 'steve', x, y, s, { ...face, hair: 1, bags: 1, fx: [], lean, tilt: lean * 0.4, arm }, { frame: boilFrame(mm) }); ctx.restore();
  // napkin bib flies off at the launch
  const nk = seg(t, 14.0, 14.8); if (t < 14.0) napkin(x, y - 80 * s + 15 * s - 4, 250, 0.74, 0);
  else if (nk < 1) { ctx.save(); ctx.translate(lerp(240, 120, nk), lerp(700, 320, nk) + 700 * nk * nk * 0.35); ctx.rotate(nk * 12); ctx.scale(0.52, 0.52); napkin(0, 0, 250, 1, 0); ctx.restore(); }
  // dust puffs on landing and skid
  for (const [t0, px] of [[14.3, 470], [14.55, 640], [14.75, 740]]) { const q = seg(t, t0, t0 + 0.4); if (q > 0 && q < 1) for (let i = 0; i < 4; i++) { ctx.fillStyle = `rgba(255,240,220,${0.8 * (1 - q)})`; ctx.beginPath(); ctx.arc(px - 40 + i * 36 - 50 * q, 1520 - 30 * q * (i + 1) * 0.5, 22 + 16 * q, 0, 7); ctx.fill(); } }
}

// ---------- hall (empty / Nana) ----------
function hallW(t, o = {}) {   // o.door: Nana's door openness 0..1; Nana + Steve drawn by the callers
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#d9b98f'); g.addColorStop(1, '#c79c70'); ctx.fillStyle = g; ctx.fillRect(-1300, -1300, W + 2600, H + 2600);
  hall(t, o.doorX ?? 770, o.doorW ?? 330, o.doorTop ?? 650, 1400, o.lx, o.ly, o.door ?? 1, o.sconceY ?? 470);
}

// Nana animation: lift -> bite -> chew -> (punch) wave. Returns after drawing her at (NX,NY).
function nanaAct(t, NX, NY, ns, o = {}) {
  const nshY = NY - 52 * 0.9 * ns, lift = o.lift ?? 0, wave = o.wave ?? 0, chew = o.chew ?? 0;
  const handX = lerp(NX + 100, NX + 70, lift) + wave * 70 * Math.sin(t * 8.5), handY = lerp(nshY - 25, nshY - 125, lift) - wave * 50 + wave * 18 * Math.sin(t * 8.5 * 2);
  const rot = lerp(0.28, 0.1, lift) + wave * 0.65 * Math.sin(t * 8.5);
  const bob = chew * 3 * Math.abs(Math.sin(t * 11));
  nanaScene(onTwos(t), NX, NY - bob, ns, o.rot ?? 0.07, { mouth: chew > 0 && Math.sin(t * 11) > 0.2 ? 'small' : 'smile', armL: armTo(NX, nshY, ns * 0.9, NX - 150, nshY + 150, [0, -2]), armR: armTo(NX, nshY, ns * 0.9, handX, handY, [3, -3]) }, () => {
    bag(NX - 150, nshY + 150, 0.95); fist(NX - 150, nshY + 154, 0.42);
    if (wave > 0) {   // big wave arcs: thick motion swooshes + afterimage drumstick
      ctx.save(); ctx.strokeStyle = 'rgba(42,34,48,0.85)'; ctx.lineWidth = 9; ctx.lineCap = 'round';
      const ph = Math.sin(t * 8.5), dir = Math.cos(t * 8.5) > 0 ? 1 : -1;
      for (let i = 0; i < 3; i++) { const r0 = 150 + i * 46; ctx.beginPath(); ctx.arc(handX - dir * 80, handY + 60, r0, -1.5 - dir * 0.2 - 0.25 * i, -1.5 + dir * 1.1 + 0.15 * i, dir < 0); ctx.stroke(); }
      ctx.restore(); ctx.save(); ctx.globalAlpha = 0.28; drumstick(handX - dir * 60, handY + 50, rot - dir * 0.6, 0.86 * 1.12); ctx.restore();
    }
    drumstick(handX, handY + 62, rot, 0.86 * (wave ? 1.12 : 1)); fist(handX, handY + 18, 0.4);
    if (lift > 0.2 || wave) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; const sp = (t * 0.9) % 1; for (const dx of [-14, 8, 30]) { ctx.beginPath(); ctx.moveTo(NX + 125 + dx, nshY - 165 - 20 * sp); ctx.bezierCurveTo(NX + 145 + dx, nshY - 195 - 20 * sp, NX + 107 + dx, nshY - 220 - 20 * sp, NX + 129 + dx, nshY - 255 - 20 * sp); ctx.stroke(); } ctx.restore(); }
  });
}
function steveHall(t, hx, hy, s, th, o = {}) {   // Steve half out of his own door: weight shift + counter-sway so the body is not a stiff block
  const m = onTwos(t), sway = 0.035 * Math.sin(t * 2.1), P = placeSteve(hx, hy, s, th + sway), knob = [84, 1170];
  const face = { eyes: 'dot', lid: 0.1, brow: 'raised', mouth: 'small', fx: ['sweat'], look: 0.9, hair: 0, bags: 1, ...(o.face || {}) };
  drawCharacter(ctx, 'steve', P.X + 6 * Math.sin(t * 2.1), P.Y, s, { ...face, lean: (th + sway) * 180 / Math.PI, tilt: o.tilt ?? -5, headDy: 0.35 * Math.sin(t * 1.9) + (o.headDy || 0),
    armL: handLocal(P, knob), armR: { hand: [6 + 2 * Math.sin(t * 2.1), -14], bend: [0, 2] } }, { frame: boilFrame(m) });
  const nk = neckOf(P); napkin(nk[0], nk[1] - 4, 250, s / 15.5, th + sway + (o.flap || 0) * Math.sin(t * 17)); fist(knob[0] + 6, knob[1] - 4, 0.42);
}
function sideDoor(t, sw = 1) { const sd = spen(onTwos(t), 5); const q = 1 - 0.0; if (sw < 1) { ctx.fillStyle = '#ffe2a0'; ctx.fillRect(-30, 40, 135, 1680); } sd.part([[-30 - 100 * (1 - sw), 40], [105 - 100 * (1 - sw) * 0, 130], [105, 1490], [-30 - 100 * (1 - sw), 1720]], '#8a5a44', { shade: 0.1, lw: 6 }); ctx.fillStyle = '#e8c84a'; ctx.beginPath(); ctx.arc(80, 1170, 16, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); }

// 7b: empty hall, Nana's door closed
function emptyHallW(t) {
  hallW(t, { door: 0 }); sideDoor(t, seg(t, 15.09, 15.3));
  const k1 = seg(t, 15.09, 15.5), face = t < 15.55 ? { eyes: 'wide', lid: 0, mouth: 'grin', brow: 'raised' } : t < 15.95 ? { eyes: 'dot', lid: 0.1, mouth: 'smile', brow: 'raised' } : t < 16.3 ? { eyes: 'dot', lid: 0.3, mouth: 'line', brow: 'worried' } : { eyes: 'dot', lid: 0.45, mouth: 'flat_down', brow: 'worried' };
  const look = t < 15.45 ? lerp(0.9, -0.9, eio(k1)) : kf(t, [[15.45, -0.9], [15.85, 0.9], [16.2, 0.9]]);
  steveHall(t, 330, 1000, 15, 0.12, { face: { ...face, look }, tilt: kf(t, [[15.09, -2], [15.45, -9], [15.85, 4], [16.3, -2]]) });
  // a tumbleweed-ish crumpled receipt rolling past in the empty hall
  const q = seg(t, 15.2, 16.4); ctx.save(); ctx.translate(lerp(960, 560, q), 1330 + 6 * Math.abs(Math.sin(q * 12))); ctx.rotate(q * -9); outline(() => ctx.ellipse(0, 0, 26, 22, 0, 0, 7), '#fffdf3', 4); ctx.restore();
}
function nanaHallW(t, o = {}) {   // S2 composition, animated; o.dx = whip-pan offset
  hallW(t, { door: o.door ?? 1 }); const NX = 770, NY = 1410, ns = 8.4;
  glowBlob(NX, 1000, 420, 'rgba(255,220,150,0.5)'); nanaAct(t, NX, NY, ns, { lift: seg(t, 16.75, 17.2), chew: seg(t, 17.3, 17.5), rot: 0.07 + 0.015 * Math.sin(t * 2.4) });
  sideDoor(t); steveHall(t, 330, 1000, 15, 0.12, { face: { eyes: 'dot', lid: 0.15, mouth: 'small', brow: 'raised', look: 0.9 }, tilt: -5 });
}
function punchW(t, o = {}) {   // S3 composition: Steve close, Nana behind waves (fully in frame)
  hallW(t, { doorX: 800, doorW: 280, doorTop: 640, lx: 800, ly: 330, sconceY: 140 });
  const NX = 800, NY = 1420, ns = 7.4; glowBlob(NX, 1000, 420, 'rgba(255,220,150,0.5)');
  nanaAct(t, NX, NY, ns, { rot: -0.05, wave: seg(t, 20.5, 20.8), chew: 1 - seg(t, 20.5, 20.7) });
  const s = 19, th = 0.1, P = placeSteve(300, 860, s, th), nod = seg(t, 20.5, 20.62) * (1 - seg(t, 20.62, 20.95)), flutter = Math.sin(t * 14) * 0.03;
  const lid = blink(t, 0.72, 100) + (t > 21.9 && t < 22.02 ? 0.28 : 0);
  drawCharacter(ctx, 'steve', P.X, P.Y, s, { expr: 'dead_inside', lid, brow: undefined, mouth: 'line', fx: ['gloom'], look: 0, hair: 0, bags: 1, lean: th * 180 / Math.PI, tilt: -9 + 4 * nod, headDy: -1.5 - 0.9 * nod + 0.35 * Math.sin(t * 1.9) }, { frame: boilFrame(onTwos(t)) });
  const nk = neckOf(P); napkin(nk[0], nk[1] - 4, 250, s / 15.5, th + flutter);
  { const dp = spen(onTwos(t), 31), dy = 18 * ((t * 0.7) % 1); drop(dp, 530, 790 + dy, 24, 0.3); }
}

// ---------- button: phone + Steve's hostage smile ----------
function rateW(t, o = {}) {
  bgFill('#2b2036', '#4a2f3a'); const stars = o.stars ?? 0, again = o.again ?? 0, tapAt = o.tapAt, red = o.red ?? 0;
  ctx.save(); ctx.translate(570, 650); phoneBody(0, 0, 900, 700, -0.02, (w, h) => {
    if (red > 0) { ctx.fillStyle = '#f6f7fc'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.save(); ctx.translate(0, -160); ctx.scale(0.8, 0.8); scooter(0, 0, 1); ctx.restore(); badge(t, true); return; }
    scooter(0, -250, 0.5, 1); text('Rate your rider', 0, -150, 70, INK);
    for (let i = 0; i < 5; i++) { const on = t >= (o.starT?.[i] ?? 1e9), q = on ? seg(t, o.starT[i], o.starT[i] + 0.25) : 0; star(-300 + i * 150, -20, 58 * (on ? 1 + 0.3 * Math.sin(Math.PI * q) : 1), on ? '#ffc61a' : '#e3e3ea'); }
    const ak = seg(t, o.againT ?? 1e9, (o.againT ?? 1e9) + 0.3); if (ak > 0) { ctx.save(); ctx.translate(0, 190); ctx.scale(0.5 + 0.5 * eb(ak), 0.5 + 0.5 * eb(ak)); ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(-330, -70, 660, 140, 44); ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); text('Order again', 0, 4, 80, '#fff6dc'); ctx.restore(); }
  }); ctx.restore();
  const hostage = { eyes: 'dot', lid: 0, brow: 'worried', mouth: 'grin', fx: ['sweat'], look: 0.2 }, hollow = { eyes: 'dot', lid: 0.45, brow: 'worried', mouth: 'small', fx: ['gloom', 'sweat'], look: 0 };
  drawCharacter(ctx, 'steve', 400, 1360 + 80 * 14, 14, { ...(red > 0 ? hollow : hostage), hair: 0, bags: 1, headDy: 0.35 * Math.sin(t * 1.9) + (red > 0 ? 0 : 0.5 * Math.sin(t * 14)), tilt: -3 }, { frame: boilFrame(onTwos(t)) });
  if (tapAt) { const [tx, ty, t0] = tapAt; const q = t - t0; if (q > -0.3 && q < 0.5) { thumb(lerp(1160, tx, eo(seg(t, t0 - 0.3, t0 - 0.03))), lerp(2100, ty, eo(seg(t, t0 - 0.3, t0 - 0.03))), q > 0 && q < 0.15 ? 1 : 0, -0.5); if (q > 0 && q < 0.35) { ctx.save(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.globalAlpha = 1 - q / 0.35; ctx.beginPath(); ctx.arc(tx, ty, 30 + 120 * q, 0, 7); ctx.stroke(); ctx.restore(); } } }
}

// ---------- SHOTS ----------
let SHOTS = [];
function build() {
  const s = LN;
  SHOTS = [
    // 1 · HOOK: frame 1 = approved S1, badge pulses, flame flickers, eye twitch at 0.3, fork/knife jiggle
    [0, t => { cam(kf(t, [[0, 1.0], [0.5, 1.06], [1.0, 1.06]]), 540, 960, () => tableW(t)); }],
    // 2 · push-out to the whole table (picture change by 1.0 s)
    [1.0, t => { cam(kf(t, [[1.0, 1.06], [1.55, 0.8], [2.6, 0.74]], eo), 540, 960, () => tableW(t), 0, 0, kf(t, [[1.0, 0], [1.55, -30]])); }],
    // 3 · s2: clock whirl
    [2.6, t => { cam(kf(t, [[2.6, 1.1], [3.9, 1.0]]), 540, 860, () => clockW(t)); }],
    // 4 · candle melts
    [3.9, t => { cam(kf(t, [[3.9, 1.0], [4.8, 1.08]]), 540, 1100, () => candleMeltW(t)); }],
    // 5 · s3: map, rider U-turn
    [4.8, t => { cam(kf(t, [[4.8, 1.0], [5.5, 1.04], [5.7, 1.1], [6.7, 1.02]]), 540, 980, () => mapW(t), 0, ...shake(t, t > 5.62 && t < 5.8 ? 7 : 0, 40)); }],
    // 6 · s4: he TIES the napkin bib (knot tug), sits up straight, chin up, cutlery thumps
    [6.7, t => { const k = seg(t, 7.2, 7.5), tk = seg(t, 6.85, 7.35), wob = Math.sin(t * 38) * (1 - tk) * 0.08;
      cam(kf(t, [[6.7, 1.0], [7.3, 1.12], [8.95, 1.22]]), 540, kf(t, [[6.7, 940], [8.95, 820]]), () => tableW(t, { headDy: 1.6 * eo(k) + 0.8 * Math.sin(Math.PI * tk), tilt: -4 * eo(k), napDy: 60 * (1 - eo(tk)), napRot: 0.35 * (1 - eo(tk)) + wob, knot: tk > 0.85, knotRot: wob * 3, tug: t > 6.9 && t < 7.3 && Math.floor(t * 20) % 2 === 0,
        flap: t > 7.5 && t < 8.4 ? 0.05 * (1 - seg(t, 7.5, 8.4)) : 0, bang: [7.5, 8.2], jig: 0.4, lid: 0.28, face: { brow: 'angry', mouth: 'line' }, candleH: 78 }), 0, ...shake(t, 4 * Math.max(0, Math.sin(Math.PI * seg(t, 7.5, 8.2) * 2)), 40)); }],
    // 7 · s5: stubble pops, cobweb on the fork, the spider waves
    [8.95, t => { const sk = seg(t, 9.2, 9.5); cam(kf(t, [[8.95, 1.05], [10.9, 1.35]]), kf(t, [[8.95, 620], [10.9, 800]]), kf(t, [[8.95, 900], [10.9, 800]]), () => tableW(t, { knot: true, tilt: 2, stubble: eo(sk), web: seg(t, 9.0, 9.9), spider: seg(t, 9.4, 10.1), lid: 0.62, face: { brow: 'worried', mouth: 'wobble' }, candleH: 44 })); }],
    // 8 · 5b: asleep in the bread basket, the cat steals a roll (silent)
    [10.9, t => { cam(kf(t, [[10.9, 1.0], [12.75, 1.1]]), 600, 1000, () => sleepW(t, { wake: seg(t, 13.2, 13.6) })); }],
    // 9 · beat 6: "Your order has arrived!" (ping) over the sleeper; head lifts under the card
    [12.75, t => { const [dx, dy] = shake(t, 5 * Math.exp(-(t - 12.75) * 5), 45); cam(1.1, 600, 1000, () => sleepW(t, { wake: seg(t, 13.05, 13.5) }), 0, dx, dy); }],
    // 10 · s7 FOOD!: crouch, jump, sprint, skid, door yank
    [13.85, t => { const [dx, dy] = shake(t, t > 14.28 && t < 14.4 ? 6 : t > 14.82 && t < 14.95 ? 8 : 0, 38); cam(kf(t, [[13.85, 1.0], [14.5, 1.04], [15.09, 1.1]]), 540, 960, () => runW(t), 0, dx, dy); }],
    // 11 · 7b: empty hall, head turns, smile drops in two steps (silent)
    [15.09, t => { cam(kf(t, [[15.09, 1.0], [16.45, 1.08]]), 540, 1000, () => emptyHallW(t)); }],
    // 12 · whip-pan to Nana (door swings open) + s8
    [16.45, t => { const k = seg(t, 16.45, 16.8), dx = 900 * (1 - eo(k)); ctx.save(); if (k < 1) ctx.filter = `blur(${Math.round(14 * (1 - k))}px)`; cam(kf(t, [[16.45, 1.0], [18.0, 1.06]]), 540, 1000, () => nanaHallW(t, { door: eio(seg(t, 16.4, 16.75)) }), 0, dx, 0); ctx.restore(); }],
    // 13 · push-in on Nana (bag, drumstick, steam)
    [18.0, t => { cam(kf(t, [[18.0, 1.06], [19.3, 1.3]]), kf(t, [[18.0, 600], [19.3, 700]]), kf(t, [[18.0, 1000], [19.3, 1000]]), () => nanaHallW(t, { door: 1 })); }],
    // 14 · hold on Steve, then s9 punch: "...Enjoy." (Nana behind waves)
    [19.3, t => { cam(kf(t, [[19.3, 1.0], [20.5, 1.06], [23.0, 1.2]], t2 => t2), 480, 900, () => punchW(t), 0, 2.2 * Math.sin(t * 2.2), 0); }],
    // 15 · button a: rate your rider, stars pop one by one, big hostage smile
    [23.0, t => { cam(kf(t, [[23.0, 1.0], [24.65, 1.04]]), 540, 960, () => rateW(t, { starT: [23.4, 23.62, 23.84, 24.06, 24.28], againT: 24.4, tapAt: [890, 700, 24.28] })); }],
    // 16 · finger taps the EDGE of "Order again" -> phone shows 2 MIN
    [24.65, t => { cam(kf(t, [[24.65, 1.04], [25.8, 1.2]]), 560, 900, () => rateW(t, { starT: [-1, -1, -1, -1, -1], againT: -1, tapAt: t < 25.2 ? [885, 905, 24.8] : undefined, red: t > 25.0 ? 1 : 0 })); }],
    // 17 · loop: back at the table, push-in settles exactly on frame 1
    [25.8, t => { cam(kf(t, [[25.8, 0.84], [27.0, 1.0]], eio), 540, 960, () => tableW(t - 25.9, {})); }],
  ];
}

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1;
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
  notif(t);
  ctx.restore();
  title();
  panel(ctx, 6, 6, W - 12, H - 12, 5, null, boilFrame(t));
  const cap = captions(t); window.__texts = cap ? [cap] : [];
}
window.render = render; window.TEXTS = t => { render(t); return window.__texts; };
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  TL = await (await fetch('voice/timeline.json')).json(); EVT = await (await fetch('events.json')).json();
  LN = Object.fromEntries(TL.lines.map(l => [l.id, l]));
  window.DUR = DUR = TL.total; window.EV = EV = EVT.ev;
  build(); render(0); window.READY = true;
})();
