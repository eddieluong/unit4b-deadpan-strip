// UNIT 4B · 22 "Perfect" (Tập 13) — 3 KEY STILLS, full-bleed 9:16 panel. render(0|1|2).
// 0 = frame-1 hook (giant ICE/LAVA dial), 1 = PEAK "Ohhh... PERFECT.", 2 = PUNCH (wordless). Shoulders up only; frosted screen from the chest down.
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
function title(T) {   // inside the panel, top; clears y 170 (iPhone safe area)
  ctx.save(); ctx.font = '600 56px Fredoka'; const w = ctx.measureText(T).width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 52, w, 104, 52); ctx.fill();
  text(T, 540, TITLE_Y + 3, 56, '#fff6dc'); ctx.restore();
}
function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---------- props ----------
// tiled bathroom wall (+ floor), light aqua tiles with grout
function wall(t, y1, floorTop, tint = 0) {
  const tw = 120, th = 120;
  for (let r = 0; r * th < y1 + th; r++) for (let c = -1; c * tw < W + tw; c++) {
    const x = c * tw + (r % 2 ? 0 : 0), y = r * th, k = hash(r * 31 + c * 7);
    ctx.fillStyle = ['#c3e6e8', '#b6dde2', '#cdeaea', '#bde2e4'][Math.floor(k * 4)]; ctx.fillRect(x, y, tw, th);
    ctx.fillStyle = 'rgba(255,255,255,0.32)'; ctx.fillRect(x + 12, y + 12, tw * 0.42, 9); ctx.fillRect(x + 12, y + 12, 9, th * 0.34);
  }
  const p = spen(t, 40, 5);
  for (let y = th; y < y1; y += th) p.line([[-10, y], [W + 10, y]], 6, '#7fa8b2');
  for (let x = tw; x < W; x += tw) p.line([[x, -10], [x, y1]], 6, '#7fa8b2');
  // floor
  ctx.fillStyle = '#7f9fae'; ctx.fillRect(0, floorTop, W, H - floorTop);
  for (let x = -60; x < W + 60; x += 180) for (let y = floorTop, r = 0; y < H; y += 90, r++) { ctx.fillStyle = (Math.floor(x / 180) + r) % 2 ? '#8eadba' : '#6f90a0'; ctx.fillRect(x + (r % 2 ? 90 : 0), y, 180, 90); }
  const q = spen(t, 44, 6); q.line([[-10, floorTop], [W + 10, floorTop]], 9, INK);
  ctx.save(); ctx.fillStyle = 'rgba(40,60,80,0.12)'; ctx.fillRect(0, floorTop, W, 26); ctx.restore();
}
// soft white steam cloud: outline union first, then white fill
function cloud(x, y, r, a = 0.9, k = 1) {
  const parts = [[0, 0, r], [r * 0.9, r * 0.15, r * 0.75], [-r * 0.9, r * 0.2, r * 0.7], [r * 0.35, -r * 0.6, r * 0.7], [-r * 0.4, -r * 0.5, r * 0.6]].map(([dx, dy, rr]) => [x + dx * k, y + dy, rr]);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(42,34,48,0.55)'; ctx.lineWidth = 5;
  parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke(); });
  ctx.fillStyle = '#ffffff'; parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr - 2, 0, 7); ctx.fill(); });
  ctx.restore();
}
function snowflake(cx, cy, r, lw) {
  for (const [col, w] of [[INK, lw * 1.8], ['#ffffff', lw]]) {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3 - Math.PI / 2, ex = cx + Math.cos(a) * r, ey = cy + Math.sin(a) * r;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey);
      for (const f of [0.55, 0.8]) { const bx = cx + Math.cos(a) * r * f, by = cy + Math.sin(a) * r * f; for (const d of [-1, 1]) { ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(a + d * 0.9) * r * 0.28, by + Math.sin(a + d * 0.9) * r * 0.28); } }
      ctx.stroke();
    }
    ctx.restore();
  }
}
function flame(cx, cy, h, seed = 7) {
  const u = (x, y) => [cx + x * h * 0.6, cy + y * h * 0.5];
  const outer = roundPoly([u(0, -1), u(0.42, -0.45), u(0.62, 0.05), u(0.55, 0.6), u(0, 1), u(-0.55, 0.6), u(-0.62, 0.0), u(-0.4, -0.25), u(-0.22, -0.05), u(-0.12, -0.55)], 8, 5);
  const p = spen(0.1, seed, Math.max(3, h * 0.045));
  ctx.beginPath(); outer.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = '#ffc928'; ctx.fill();
  p.outline(outer, true, Math.max(4, h * 0.05));
  const inner = roundPoly([u(0.04, -0.2), u(0.3, 0.2), u(0.34, 0.6), u(0, 0.88), u(-0.34, 0.6), u(-0.28, 0.2)], 6, 4);
  ctx.beginPath(); inner.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = '#fff3a8'; ctx.fill();
}
// big round ICE / LAVA dial. ang: pointer rotation (rad, 0 = straight up on the dividing line, + = toward LAVA)
function dial(cx, cy, R, ang, { words = true, seed = 3 } = {}) {
  const lw = Math.max(5, R * 0.022), p = spen(0.1, seed, lw);
  ctx.fillStyle = 'rgba(42,34,48,0.2)'; ctx.beginPath(); ctx.ellipse(cx + R * 0.04, cy + R * 0.05, R, R, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#9aa1b6'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();       // steel rim
  p.outline(ellipsePts(cx, cy, R, R, 80), true, lw * 1.2);
  const F = R * 0.88;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, F, 0, 7); ctx.clip();
  let g = ctx.createLinearGradient(0, cy - F, 0, cy + F); g.addColorStop(0, '#e2f7ff'); g.addColorStop(1, '#5fb4f0'); ctx.fillStyle = g; ctx.fillRect(cx - F - 2, cy - F - 2, F + 2, 2 * F + 4);
  g = ctx.createLinearGradient(0, cy - F, 0, cy + F); g.addColorStop(0, '#ffb23a'); g.addColorStop(1, '#ff3a1c'); ctx.fillStyle = g; ctx.fillRect(cx, cy - F - 2, F + 2, 2 * F + 4);
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (const [dx, dy, r] of [[-0.62, -0.62, 0.035], [-0.3, -0.76, 0.025], [-0.75, 0.2, 0.03], [-0.2, 0.7, 0.03]]) { ctx.beginPath(); ctx.arc(cx + dx * F, cy + dy * F, r * F, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,230,120,0.75)'; for (const [dx, dy, r] of [[0.64, -0.6, 0.05], [0.3, -0.74, 0.03], [0.78, 0.15, 0.04], [0.22, 0.72, 0.045]]) { ctx.beginPath(); ctx.arc(cx + dx * F, cy + dy * F, r * F, 0, 7); ctx.fill(); }
  ctx.restore();
  p.outline(ellipsePts(cx, cy, F, F, 80), true, lw);
  p.line([[cx, cy - F], [cx, cy + F]], lw * 1.7);                                          // the dividing line
  snowflake(cx - 0.47 * R, cy - 0.12 * R, R * 0.27, R * 0.04);
  flame(cx + 0.47 * R, cy - 0.12 * R, R * 0.62);
  if (words) { strokedText('ICE', cx - 0.47 * R, cy + 0.5 * R, R * 0.23, '#ffffff', R * 0.05); strokedText('LAVA', cx + 0.47 * R, cy + 0.5 * R, R * 0.23, '#fff3a8', R * 0.05); }
  // pointer
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
  const pp = spen(0.1, seed + 9, lw);
  const poly2 = [[0, -F * 0.93], [R * 0.075, -R * 0.1], [R * 0.065, R * 0.2], [-R * 0.065, R * 0.2], [-R * 0.075, -R * 0.1]];
  ctx.beginPath(); poly2.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = '#f6f2ea'; ctx.fill();
  pp.outline(poly2, true, lw * 1.1);
  ctx.fillStyle = '#d9382c'; ctx.beginPath(); ctx.moveTo(0, -F * 0.93); ctx.lineTo(R * 0.045, -F * 0.6); ctx.lineTo(-R * 0.045, -F * 0.6); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#3a3548'; ctx.beginPath(); ctx.arc(cx, cy, R * 0.12, 0, 7); ctx.fill(); pp.outline(ellipsePts(cx, cy, R * 0.12, R * 0.12, 30), true, lw);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(cx - R * 0.035, cy - R * 0.04, R * 0.03, 0, 7); ctx.fill();
}
function icicle(x, y, len, wd) {
  const p = spen(0.1, 17, 4), pts = [[x - wd / 2, y], [x + wd / 2, y], [x + wd * 0.3, y + len * 0.55], [x + 1, y + len], [x - wd * 0.22, y + len * 0.5]];
  poly(pts, '#c8efff'); p.outline(pts, true, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(x - wd * 0.28, y + 4, wd * 0.14, len * 0.38);
}
// a finger-pointing hand (skin) from a wrist point to a fingertip
function pointingHand(wx, wy, tx, ty, skin, k = 1) {
  const p = spen(0.1, 23, 5 * k), dx = tx - wx, dy = ty - wy, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const palm = ellipsePts(wx, wy, 44 * k, 36 * k, 24);
  ctx.save(); ctx.fillStyle = skin; ctx.beginPath(); palm.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); ctx.restore(); p.outline(palm, true, 5 * k);
  p.tube([[wx + nx * 6, wy + ny * 6], [tx, ty]], 26 * k, skin);
}
// two fingers pinching a point
function pinchHand(wx, wy, tx, ty, skin) {   // palm at the wrist, index finger and thumb meeting on the knob (tx, ty)
  const p = spen(0.1, 27, 5), palm = roundPoly([[wx - 30, wy - 8], [wx + 30, wy - 8], [wx + 26, wy + 34], [wx - 26, wy + 34]], 16, 4);
  ctx.save(); ctx.fillStyle = skin; ctx.beginPath(); palm.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); ctx.restore(); p.outline(palm, true, 5);
  p.tube([[wx - 16, wy - 4], [wx - 22, wy - 50], [tx - 4, ty + 10]], 20, skin);    // index finger
  p.tube([[wx + 20, wy - 2], [wx + 24, wy - 40], [tx + 12, ty + 12]], 20, skin);   // thumb
  p.tube([[wx - 6, wy + 30], [wx - 6, wy + 40]], 1, skin);
}
function armTube(pts, w, skin, seed = 31) { spen(0.1, seed, 5).tube(pts, w, skin); }

// ---------- Steve (bare shoulders, shower cap) ----------
const SK = { n: '#e2ac84', hot: '#e8412f' };
function steve(X, Y, s, pose, skin, melt = false) {
  window.STEVE_SKIN = skin;
  if (!melt) drawCharacter(ctx, 'steve', X, Y, s, { hair: 0, arm: 'down', noShadow: true, ...pose }, { frame: boilFrame(0.1) });
  else {   // hair hidden under the melted cap: erase the spikes, repaint the crown in skin
    const oc = document.createElement('canvas'); oc.width = W; oc.height = H; const o = oc.getContext('2d');
    drawCharacter(o, 'steve', X, Y, s, { hair: 0, arm: 'down', noShadow: true, ...pose }, { frame: boilFrame(0.1) });
    const cx = X, cy = Y - 80 * s, r = 15 * s;
    o.save(); o.beginPath(); o.rect(0, 0, W, H); o.ellipse(cx, cy, r + 1.4 * s * 0.1 + 1.5, r + 1.4 * s * 0.1 + 1.5, 0, 0, 7); o.clip('evenodd'); o.clearRect(0, 0, W, cy + 2); o.restore();
    o.save(); o.beginPath(); o.rect(0, 0, W, cy - 4 * s); o.clip(); o.fillStyle = skin; o.beginPath(); o.arc(cx, cy, r - 2, 0, 7); o.fill(); o.restore();
    o.strokeStyle = INK; o.lineWidth = Math.max(5, s * 0.9); o.lineCap = 'round'; o.beginPath(); o.arc(cx, cy, r, Math.PI * 1.04, Math.PI * 1.96); o.stroke();
    ctx.drawImage(oc, 0, 0);
  }
  // bare shoulders: solid skin over the hoodie (local units; the lower part is always hidden by the dial/screen)
  const p = lpen(X, Y, s, 8);
  const sh = roundPoly([[-5.5, 66], [5.5, 66], [10, 62], [14.5, 58], [15, 48], [14, 36], [-14, 36], [-15, 48], [-14.5, 58], [-10, 62]], 5, 4);
  ctx.save(); ctx.fillStyle = skin; ctx.beginPath(); sh.map(q => p.T(q)).forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill(); ctx.restore();
  p.outline(sh, true, Math.max(5, s * 0.8));
  return sh.map(q => p.T(q));
}
function headCircle(X, Y, s) { return [X, Y - 80 * s, 15 * s]; }
function cap(X, Y, s, melted = false, col = '#bfe8f0') {
  const p = lpen(X, Y, s, 12), hy = 80;
  if (!melted) {
    const pts = [];
    for (let i = 0; i <= 26; i++) { const a = Math.PI * (0.07 + 0.86 * i / 26); pts.push([Math.cos(a) * 18.4, hy + 1 + Math.sin(a) * 19.4]); }
    pts.push([-17.5, hy + 7.5], [-14, hy + 6.4], [-9, hy + 7.2], [-4, hy + 6.2], [1, hy + 7.2], [6, hy + 6.2], [11, hy + 7.2], [15, hy + 6.4], [17.5, hy + 7.5]);
    pts.splice(27, 0, [17.8, hy + 7.5]);
    const dome = roundPoly(pts, 2, 3);
    p.part(dome, col, { shade: 0.14 });
    p.line([[-17, hy + 7.4], [-9, hy + 6.7], [0, hy + 7.4], [9, hy + 6.7], [17, hy + 7.4]], p.lw * 0.9, '#7ab4c0');   // elastic band
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = Math.max(5, s * 0.8); ctx.lineCap = 'round'; const a = p.T([-8, hy + 17]), b = p.T([-3, hy + 19.4]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
  } else {   // melted flat: a limp pancake slumped over the crown, sagging past the temples
    const pts = [[-23, hy + 1], [-21, hy + 9], [-15, hy + 14], [-6, hy + 15.6], [2, hy + 16], [10, hy + 15], [18, hy + 11], [23, hy + 4], [25, hy - 6], [25.6, hy - 17], [22.6, hy - 21], [20, hy - 12], [17.4, hy - 4], [13.6, hy + 2], [9, hy + 5.4], [4, hy + 3.6], [-1, hy + 6.6], [-6.4, hy + 4.4], [-9.4, hy + 1.2], [-12.4, hy - 5.4], [-15.6, hy - 12], [-19, hy - 9], [-21.4, hy - 3]];
    p.part(roundPoly(pts, 2.5, 3), col, { shade: 0.12 });
    p.line([[-10, hy + 13], [-2, hy + 14.6]], p.lw * 0.6, '#7ab4c0');
    const drip = (x, y, len) => { const q = [[x - 1.7, y + 1], [x + 1.7, y + 1], [x + 1.4, y - len * 0.7], [x, y - len], [x - 1.4, y - len * 0.7]]; ctx.fillStyle = col; ctx.beginPath(); q.map(v => p.T(v)).forEach((v, i) => i ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1])); ctx.fill(); p.outline(q, true, p.lw * 0.7); };
    drip(-15.6, hy - 11, 11); drip(-19.2, hy - 8.4, 7); drip(-22, hy - 1.4, 5); drip(23, hy - 19.6, 11); drip(25, hy - 8, 6.5);
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = Math.max(5, s * 0.8); ctx.lineCap = 'round'; for (const [x0, y0, x1, y1] of [[-12, hy + 11.6, -4, hy + 13.6], [8, hy + 12.4, 14, hy + 10], [23, hy - 4, 24, hy - 12]]) { const A = p.T([x0, y0]), B = p.T([x1, y1]); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); } ctx.restore();
  }
}

// ---------- Snuggles (grey cat), optionally with flat ears ----------
function snuggles(X, Y, s, pose, flatEars = false) {
  const opt = { frame: boilFrame(0.1) };
  if (!flatEars) { drawCharacter(ctx, 'snuggles', X, Y, s, { noShadow: true, ...pose }, opt); return; }
  const oc = document.createElement('canvas'); oc.width = W; oc.height = H; const o = oc.getContext('2d');
  drawCharacter(o, 'snuggles', X, Y, s, { noShadow: true, ...pose, tilt: 0 }, opt);
  const hy = 34, T = ([lx, ly]) => [X + lx * s, Y - ly * s];
  o.save(); o.beginPath(); o.rect(0, 0, W, H); o.ellipse(X, Y - hy * s, 16.6 * s, 15.4 * s, 0, 0, 7); o.clip('evenodd');
  o.globalCompositeOperation = 'destination-out';
  for (const sx of [-1, 1]) for (const R of [[[10.6, hy + 2], [17, hy + 2], [17, hy + 24], [10.6, hy + 24]], [[6.4, hy + 15.6], [10.7, hy + 15.6], [10.7, hy + 24], [6.4, hy + 24]]]) {
    o.beginPath(); R.map(([a, b]) => T([sx * a, b])).forEach((q, i) => i ? o.lineTo(q[0], q[1]) : o.moveTo(q[0], q[1])); o.closePath(); o.fill();
  }
  o.restore();
  ctx.drawImage(oc, 0, 0);
  const p = lpen(X, Y, s, 61);
  for (const sx of [-1, 1]) {   // airplane ears: pressed flat and out to the sides
    p.part(roundPoly([[sx * 11, hy + 8.4], [sx * 22.5, hy + 5.4], [sx * 23, hy + 2.6], [sx * 12.5, hy + 1.2]], 1.2), '#4a4c60', { shade: 0.12 });
    p.fill(roundPoly([[sx * 13, hy + 6.8], [sx * 21, hy + 4.8], [sx * 20.8, hy + 3.4], [sx * 13.6, hy + 3]], 0.8), '#c58ea0');
  }
}

// ---------- bathroom pieces ----------
function showerHead(t, x, y) {
  const p = spen(t, 50, 6);
  p.part([[x - 16, -20], [x + 16, -20], [x + 16, y - 40], [x - 16, y - 40]], '#aeb6c8', { shade: 0.2, lw: 6 });
  p.part(roundPoly([[x - 130, y + 20], [x - 70, y - 40], [x + 70, y - 40], [x + 130, y + 20], [x + 100, y + 38], [x - 100, y + 38]], 18), '#c9d0e0', { shade: 0.16, lw: 7 });
  ctx.fillStyle = INK; for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.arc(x + i * 22, y + 30 - Math.abs(i) * 1.5, 5, 0, 7); ctx.fill(); }
}
function waterStreaks(x, y, wet = 'rgba(190,225,245,0.8)') {
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const side = i % 2 ? 1 : -1, k = Math.floor(i / 2), x0 = x + side * (50 + k * 12), x1 = x + side * (330 + k * 70);
    ctx.strokeStyle = wet; ctx.lineWidth = 7; ctx.setLineDash([60, 36]); ctx.beginPath(); ctx.moveTo(x0, y + 50); ctx.lineTo(x1, 1110); ctx.stroke();
  }
  ctx.restore();
}
// frosted glass screen: covers from the chest down
function screen(t, x0, top, x1, bot) {
  const p = spen(t, 60, 8);
  ctx.fillStyle = '#d6e9f0'; ctx.fillRect(x0, top, x1 - x0, bot - top);
  const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(0.5, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(255,255,255,0.4)'); ctx.fillStyle = g; ctx.fillRect(x0, top, x1 - x0, bot - top);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, top, x1 - x0, bot - top); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 24; ctx.lineCap = 'round'; for (const [a, b] of [[160, 1500], [260, 1380], [560, 1580]]) { ctx.beginPath(); ctx.moveTo(x0 + a * 0.9, top + 40); ctx.lineTo(x0 + a * 0.9 - 130, top + (b - 1120)); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(120,170,190,0.55)'; ctx.lineWidth = 6;
  for (let i = 0; i < 9; i++) { const dx = x0 + 60 + hash(i * 3 + 1) * (x1 - x0 - 120), dy = top + 40 + hash(i * 5 + 2) * 160; ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + 2, dy + 120 + hash(i) * 160); ctx.stroke(); ctx.fillStyle = 'rgba(150,200,220,0.8)'; ctx.beginPath(); ctx.ellipse(dx + 2, dy + 130 + hash(i) * 160, 9, 14, 0, 0, 7); ctx.fill(); }
  ctx.restore();
  p.outline([[x0, top], [x1, top], [x1, bot], [x0, bot]], true, 10);
  p.part([[x0 - 10, top - 26], [x1 + 10, top - 26], [x1 + 10, top + 8], [x0 - 10, top + 8]], '#aeb6c8', { shade: 0.2, lw: 7 });   // top rail
  p.part([[x0 - 10, bot - 6], [x1 + 10, bot - 6], [x1 + 10, bot + 24], [x0 - 10, bot + 24]], '#aeb6c8', { shade: 0.2, lw: 7 });
  p.part(roundPoly([[x1 - 70, top + 220], [x1 - 40, top + 220], [x1 - 40, top + 380], [x1 - 70, top + 380]], 10), '#aeb6c8', { shade: 0.2, lw: 6 });   // handle
}
function toilet(t, x0, x1, lidY, floorY) {
  const p = spen(t, 70, 7);
  p.part(roundPoly([[x0 + 50, lidY - 270], [x1 + 20, lidY - 270], [x1 + 20, lidY + 4], [x0 + 50, lidY + 4]], 24), '#f4f6f8', { shade: 0.12, lw: 8 });                 // tank
  p.part(roundPoly([[x0 + 110, lidY - 300], [x1 - 40, lidY - 300], [x1 - 40, lidY - 262], [x0 + 110, lidY - 262]], 12), '#e4e8ee', { shade: 0.12, lw: 7 });        // tank lid
  p.part(roundPoly([[x0 + 20, lidY + 10], [x1 - 10, lidY + 10], [x1 - 40, floorY - 60], [x0 + 70, floorY - 60], [x0 + 20, lidY + 90]], 40), '#f4f6f8', { shade: 0.14, lw: 8 }); // bowl
  p.part(roundPoly([[x0 + 60, floorY - 70], [x1 - 60, floorY - 70], [x1 - 40, floorY], [x0 + 40, floorY]], 14), '#e4e8ee', { shade: 0.12, lw: 7 });
  p.part(roundPoly([[x0 - 10, lidY - 22], [x1 + 8, lidY - 22], [x1 + 18, lidY + 16], [x0 - 20, lidY + 16]], 18), '#fbfcfd', { shade: 0.1, lw: 8 });                  // closed lid
  ctx.fillStyle = '#9aa1b6'; ctx.beginPath(); ctx.arc(x1 - 10, lidY - 250, 18, 0, 7); ctx.fill(); p.outline(ellipsePts(x1 - 10, lidY - 250, 18, 18, 20), true, 5);     // flush button
}
function pipeAndSign(t, x, y) {   // a pipe running into the tiled wall + a small arrow sign "NEXT DOOR"
  const p = spen(t, 80, 6);
  p.part([[x + 40, y - 36], [W + 20, y - 36], [W + 20, y + 36], [x + 40, y + 36]], '#b8764a', { shade: 0.22, lw: 7 });
  for (const sx of [x + 280, x + 190]) { ctx.fillStyle = '#9a6038'; ctx.fillRect(sx, y - 42, 22, 84); p.outline([[sx, y - 42], [sx + 22, y - 42], [sx + 22, y + 42], [sx, y + 42]], true, 5); }
  ctx.fillStyle = '#3a3040'; ctx.beginPath(); ctx.arc(x, y, 64, 0, 7); ctx.fill(); p.outline(ellipsePts(x, y, 64, 64, 36), true, 7);   // flange ring with the hole
  ctx.fillStyle = '#15111a'; ctx.beginPath(); ctx.arc(x, y, 40, 0, 7); ctx.fill();
  ctx.fillStyle = '#c9ced9'; for (const a of [0.8, 2.4, 3.9, 5.5]) { ctx.beginPath(); ctx.arc(x + Math.cos(a) * 54, y + Math.sin(a) * 54, 5, 0, 7); ctx.fill(); }
  // sign hanging from two chains
  const sx0 = x + 20, sy0 = y + 110;
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 150, y + 36); ctx.lineTo(x + 150, sy0 + 6); ctx.moveTo(x + 300, y + 36); ctx.lineTo(x + 300, sy0 + 6); ctx.stroke();
  const board = [[sx0, sy0 + 44], [sx0 + 56, sy0], [sx0 + 330, sy0], [sx0 + 330, sy0 + 88], [sx0 + 56, sy0 + 88]];
  poly(board, '#ffd23f'); p.outline(board, true, 7);
  text('NEXT DOOR', sx0 + 196, sy0 + 46, 46, INK);
}
function duck(x, y, k, deflated = false, rot = 0) {
  const p = spen(0.1, 90, 5 * k);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  const q = spen(0.1, 91, 5);
  if (!deflated) {
    q.part(ellipsePts(0, 0, 70, 52, 40), '#ffd92e', { shade: false, lw: 5 });
    q.part([[48, -30], [78, -22], [62, -2], [46, -14]], '#ffd92e', { shade: false, lw: 5 });           // tail
    q.part(ellipsePts(-38, -50, 34, 32, 30), '#ffd92e', { shade: false, lw: 5 });
    q.part([[-62, -50], [-92, -46], [-92, -38], [-62, -38]], '#ff8f1f', { shade: false, lw: 5 });         // beak
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-44, -58, 5, 0, 7); ctx.fill();
    q.part(ellipsePts(6, 4, 28, 18, 24), '#f2bd12', { shade: false, lw: 4 });                          // wing
  } else {   // deflated: flat, wrinkled, head slumped over the side
    q.part([[-76, 18], [-50, -6], [0, -14], [56, -4], [84, 16], [60, 30], [0, 34], [-50, 32]], '#ffd92e', { shade: false, lw: 5 });
    for (const [a, b, c, d] of [[-30, 8, -4, 4], [8, 14, 34, 6], [-4, 24, 28, 22]]) q.line([[a, b], [c, d]], 4);
    q.part(roundPoly([[-52, 8], [-84, 30], [-82, 64], [-52, 66], [-40, 36]], 8), '#ffd92e', { shade: false, lw: 5 });   // limp head
    q.part([[-82, 56], [-112, 80], [-84, 82]], '#ff8f1f', { shade: false, lw: 5 });                       // beak droops
    q.line([[-72, 50], [-60, 56]], 5); q.line([[-72, 58], [-60, 50]], 5);                                    // x'd-out eye
  }
  ctx.restore(); void p;
}
function halo(x, y, rx, ry) {
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = 34; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.stroke();
  ctx.strokeStyle = '#fff2b0'; ctx.lineWidth = 22; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.stroke(); ctx.restore();
}

// ---------- STILL 1 · HOOK (glance): giant ICE/LAVA dial ----------
function still1(t) {
  wall(t, 1920, 3000);
  // vignette-free flat lighting; a faint cold/hot split on the wall behind
  ctx.fillStyle = 'rgba(120,190,255,0.16)'; ctx.fillRect(0, 0, 540, 1920); ctx.fillStyle = 'rgba(255,110,60,0.14)'; ctx.fillRect(540, 0, 540, 1920);
  const s = 14, X = 540, hcY = 560, Y = hcY + 80 * s;
  const sh = steve(X, Y, s, { eyes: 'dot', lid: 0.15, brow: 'worried', mouth: 'teeth', look: 0.2, fx: [], arm: 'down' }, SK.n);
  // halves: left blue, right red (head + shoulders)
  const [hx, hy, hr] = headCircle(X, Y, s);
  const tint = (shape) => {
    ctx.save(); shape(); ctx.clip();
    ctx.fillStyle = 'rgba(70,150,255,0.5)'; ctx.fillRect(0, 0, 540, H);
    ctx.fillStyle = 'rgba(255,50,30,0.46)'; ctx.fillRect(540, 0, 540, H); ctx.restore();
  };
  tint(() => { ctx.beginPath(); ctx.arc(hx, hy, hr - 3, 0, 7); });
  tint(() => { ctx.beginPath(); sh.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); });
  cap(X, Y, s);
  { const np = spen(t, 19, 5); const nose = ellipsePts(538, 578, 16, 12, 20); ctx.fillStyle = '#d99a8a'; ctx.beginPath(); nose.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); np.outline(nose, true, 5); }
  icicle(530, 588, 30, 24);
  // frost on the left cheek, steam on the right
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (const [dx, dy, r] of [[-120, 40, 9], [-90, 90, 7], [-150, 90, 6], [-60, -40, 5]]) { ctx.beginPath(); ctx.arc(hx + dx, hy + dy, r, 0, 7); ctx.fill(); }
  cloud(838, 470, 52, 0.95); cloud(895, 345, 40, 0.9); cloud(870, 600, 36, 0.9);
  // shivering marks on the blue side
  { const p = spen(t, 95, 7); for (const dy of [-60, 0, 60]) { p.line([[300, hy + dy], [270, hy + dy - 14], [296, hy + dy - 28]], 7, '#2d6fd0'); p.line([[240, hy + dy + 30], [216, hy + dy + 16], [238, hy + dy + 4]], 7, '#2d6fd0'); } }
  // left arm hangs behind the dial, right arm reaches for the pointer
  armTube([[388, 868], [320, 940], [352, 1010]], 56, SK.n, 33);
  dial(540, 1450, 520, 0);
  armTube([[696, 872], [770, 930], [720, 950]], 56, SK.n, 34);
  pointingHand(668, 950, 556, 985, SK.n, 1.05);
  title('POV: the shower has 2 settings');
}

// ---------- shared bathroom framing for stills 2 + 3 ----------
function room(t, hot) {
  wall(t, 1700, 1700);
  showerHead(t, 440, 215);
  pipeAndSign(t, 700, 390);
}

// ---------- STILL 2 · PEAK "Ohhh... PERFECT." ----------
function still2(t) {
  room(t, false);
  const s = 12, X = 440, hcY = 800, Y = hcY + 80 * s;
  waterStreaks(440, 215);
  // dial on the wall (left), pointer on the line; he is not touching it
  dial(140, 880, 150, 0, { words: false, seed: 4 });
  // Steve: eyes closed, soft smile, arms slightly out
  armTube([[290, 1060], [200, 1085], [120, 1140]], 40, SK.n, 35);
  armTube([[590, 1060], [680, 1085], [760, 1140]], 40, SK.n, 36);
  steve(X, Y, s, { eyes: 'happy', brow: undefined, mouth: 'smile', fx: ['blush'], arm: 'down' }, SK.n);
  cap(X, Y, s);
  halo(440, 540, 150, 36);
  cloud(280, 450, 34, 0.9); cloud(610, 470, 26, 0.85); cloud(440, 370, 24, 0.8);
  duck(705, 955, 0.9, false, -0.18);
  { const p = spen(t, 96, 5); for (const [x, y, r] of [[610, 880, 14], [650, 850, 9], [750, 880, 10]]) { ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); } void p; }
  screen(t, 20, 1120, 770, 1700);
  toilet(t, 790, 1070, 1390, 1700);
  snuggles(925, 1385, 7.6, { eyes: 'dot', lid: 0.15, look: -0.9, mouth: 'line', tilt: -9, tail: 0.4 });
  // warm golden light
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,210,130,0.37)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  glowBlob(440, 760, 760, 'rgba(255,214,120,0.37)');
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.translate(440, 215);
  for (let i = 0; i < 14; i++) { ctx.rotate(Math.PI * 2 / 14); ctx.fillStyle = 'rgba(255,236,170,0.12)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1500, -80); ctx.lineTo(1500, 80); ctx.closePath(); ctx.fill(); } ctx.restore();
  // caption strip
  const T = 'Ohhh… PERFECT.'; ctx.save(); ctx.font = '600 84px Fredoka'; const w = ctx.measureText(T).width + 90;
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, 1760, w, 130, 65); ctx.fill(); text(T, 540, 1828, 84, '#fff2b0'); ctx.restore();
}

// ---------- STILL 3 · PUNCH (wordless) ----------
function still3(t) {
  room(t, true);
  const s = 12, X = 440, hcY = 800, Y = hcY + 80 * s;
  waterStreaks(440, 215, 'rgba(255,200,190,0.75)');
  dial(140, 880, 150, 1.0, { words: false, seed: 4 });                    // pointer on the flame
  armTube([[270, 1068], [256, 1010], [282, 930]], 44, SK.hot, 35);        // reaches to the dial
  armTube([[590, 1060], [640, 1100], [660, 1150]], 40, SK.hot, 36);
  steve(X, Y, s, { eyes: 'pinpoint', brow: undefined, mouth: 'line', look: 0, fx: [], arm: 'down' }, SK.hot, true);
  cap(X, Y, s, true);
  pinchHand(282, 930, 243, 808, SK.hot);
  // heat: darker blush patches on the red face and steam pouring off
  ctx.save(); ctx.fillStyle = 'rgba(160,20,20,0.18)'; for (const [dx, dy] of [[-92, 40], [92, 40]]) { ctx.beginPath(); ctx.ellipse(440 + dx, 800 + dy, 52, 30, 0, 0, 7); ctx.fill(); } ctx.restore();
  for (const [x, y, r, a] of [[210, 760, 44, 0.9], [150, 640, 52, 0.85], [230, 520, 46, 0.8], [690, 770, 44, 0.9], [780, 700, 48, 0.85], [650, 500, 40, 0.8], [320, 1000, 40, 0.9], [590, 1010, 40, 0.9], [440, 380, 40, 0.75]]) cloud(x, y, r, a);
  duck(705, 1088, 0.9, true, 0.1);
  screen(t, 20, 1120, 770, 1700);
  toilet(t, 790, 1070, 1390, 1700);
  snuggles(925, 1385, 7.6, { eyes: 'pinpoint', lid: 0, look: -0.9, mouth: 'line', tail: 0.2 }, true);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,170,150,0.23)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  glowBlob(440, 800, 700, 'rgba(255,120,80,0.19)');
  for (const [x, y, r, a] of [[330, 1090, 50, 0.9], [560, 1100, 56, 0.9], [440, 1060, 44, 0.8]]) cloud(x, y, r, a);   // steam rolling over the screen top
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
