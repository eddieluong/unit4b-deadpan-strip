// flat.js — shared drawing helpers for UNIT 4B Tập 18 "One Screw" (flat-pack wardrobe). Used by stills.js and scene.js.
import { drawCharacter, paper, panel, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';
export { paper, panel, drawCharacter, CAST, roundPoly, ellipsePts, boilFrame };

export const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
export const INK = '#2a2230', TITLE_Y = 232, SK = '#e2ac84', RED = '#c8312b';
export const MUSTARD = (CAST.steve && CAST.steve.color) || '#e3a82b';
export const NOW = () => (typeof window !== 'undefined' && window.T_NOW !== undefined) ? window.T_NOW : 0.1;
export const spen = (t, seed, lw = 3) => { const p = new VPen(ctx, 0, 0, 1, { lw, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
export const lpen = (X, Y, s, seed = 5) => new VPen(ctx, X, Y, s, { lw: Math.max(2.4, s * 0.95), hand: true, frame: boilFrame(NOW()), seed });
export const lerp = (a, b, k) => a + (b - a) * k;
export const clamp01 = k => Math.max(0, Math.min(1, k));
export const seg = (t, a, b) => clamp01((t - a) / (b - a));
export const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
export function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
export function strokedText(s, x, y, size, fill = '#fff', lw = 10, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px "Fredoka"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.strokeText(s, 0, 0); ctx.fillStyle = fill; ctx.fillText(s, 0, 0); ctx.restore();
}
export function title(T) {
  const L = Array.isArray(T) ? T : [T]; ctx.save(); ctx.font = '600 56px Fredoka';
  const w = Math.max(...L.map(l => ctx.measureText(l).width)) + 70, h = 104 + (L.length - 1) * 68, top = TITLE_Y - 52 + (L.length > 1 ? -4 : 0);
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, top, w, h, 52); ctx.fill();
  L.forEach((l, i) => text(l, 540, top + 55 + i * 68, 56, '#fff6dc')); ctx.restore();
}
export function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
export const quad = (pts, fill, p, lw = 7) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); p.outline(pts, true, lw); };
export function cloud(x, y, r, a = 0.9, col = '#ffffff') {
  const parts = [[0, 0, r], [r * 0.9, r * 0.15, r * 0.75], [-r * 0.9, r * 0.2, r * 0.7], [r * 0.35, -r * 0.6, r * 0.7]].map(([dx, dy, rr]) => [x + dx, y + dy, rr]);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(42,34,48,0.45)'; ctx.lineWidth = 5;
  parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke(); });
  ctx.fillStyle = col; parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr - 2, 0, 7); ctx.fill(); });
  ctx.restore();
}
export function drop(x, y, r = 11, col = '#bfe6ff') {
  ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y - r * 2); ctx.quadraticCurveTo(x + r * 1.1, y - r * 0.3, x + r, y + r * 0.2); ctx.arc(x, y + r * 0.2, r, 0, Math.PI); ctx.quadraticCurveTo(x - r * 1.1, y - r * 0.3, x, y - r * 2); ctx.fill(); ctx.stroke(); ctx.restore();
}
export const armTube = (pts, w, col = MUSTARD, seed = 31) => spen(NOW(), seed, 5).tube(pts, w, col);
export const NOARM = { hand: [0, 0], bend: [0, 0] };
export function tie(X, Y, s, loose = false) {   // red tie on Steve's chest (Steve keeps the tie, owner gate 2)
  const p = lpen(X, Y, s, 77), rot = loose ? 14 : 0;
  ctx.save(); const c = p.T([0, 59]); ctx.translate(c[0], c[1]); ctx.rotate(rot * Math.PI / 180); ctx.translate(-c[0], -c[1] + (loose ? 6 * s : 0));
  const blade = loose ? [[-1.7, 56], [1.7, 56], [3, 46], [0, 41], [-3, 46]] : [[-1.7, 58], [1.7, 58], [3.2, 46], [0, 41], [-3.2, 46]];
  p.part(blade, RED, { shade: 0.2, lw: Math.max(4, s * 0.5) });
  p.part(roundPoly([[-2.6, 60.4], [2.6, 60.4], [2, 56.6], [-2, 56.6]], 1), '#a62620', { shade: false, lw: Math.max(4, s * 0.5) });
  ctx.restore();
  if (!loose) for (const sx of [-1, 1]) p.part([[sx * 1.2, 61.6], [sx * 5.6, 62.4], [sx * 3, 58.6]], '#ffffff', { shade: false, lw: Math.max(3.4, s * 0.4) });
}
export function steve(X, Y, s, pose, hairStage = 0, bags = 0, loose = false) {
  window.STEVE_SKIN = SK;
  drawCharacter(ctx, 'steve', X, Y, s, { hair: hairStage, bags, arm: 'down', armL: NOARM, armR: NOARM, noShadow: true, ...pose }, { frame: boilFrame(NOW()) });
  tie(X, Y, s, loose);
}
export function snug(X, Y, s, pose = {}) { drawCharacter(ctx, 'snuggles', X, Y, s, { eyes: 'dot', lid: 0.5, mouth: 'line', noShadow: true, ...pose }, { frame: boilFrame(NOW()) }); }
export function hand(x, y, r, ang = 0, col = SK, seed = 70) {   // a round fist/hand blob
  ctx.fillStyle = col; const e = ellipsePts(x, y, r, r * 0.92, 22); ctx.beginPath(); e.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); spen(NOW(), seed, 5).outline(e, true, 5);
}

// ---------- room ----------
export const FLOOR_Y = 1420;
export function room(t, o = {}) {
  const y0 = o.y0 ?? -300, y1 = o.y1 ?? 2300, fy = o.floorY ?? FLOOR_Y, p = spen(t, 40, 5);
  ctx.fillStyle = '#f0dcc0'; ctx.fillRect(-1500, y0, 4080, fy - y0);
  for (let x = -1530; x < 2600; x += 180) { ctx.fillStyle = 'rgba(190,140,100,0.10)'; ctx.fillRect(x, y0, 90, fy - y0); }
  ctx.fillStyle = o.floorCol ?? '#b8895e'; ctx.fillRect(-1500, fy, 4080, y1 - fy);
  for (let i = 0; i < 6; i++) { const y = fy + 40 + i * i * 14 + i * 30; p.line([[-1500, y], [2600, y]], 4 + i * 0.5, '#8f6a45'); }
  ctx.fillStyle = '#e4cba6'; ctx.fillRect(-1500, fy - 34, 4080, 34); p.line([[-1500, fy - 34], [2600, fy - 34]], 6, '#a98660'); p.line([[-1500, fy], [2600, fy]], 7, '#7a5636');
}
export function cardboard(x, y, w, h, rot = 0, seed = 3, folded = false) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const p = spen(NOW(), seed, 6);
  quad([[-w / 2, -h / 2], [w / 2, -h / 2 + 8], [w / 2 - 10, h / 2], [-w / 2 + 6, h / 2 - 6]], '#c9a26b', p, 6);
  if (folded) p.line([[-w / 2 + 14, 0], [w / 2 - 14, 4]], 5, '#9b7646');
  ctx.restore();
}
export function foam(x, y, w, h, rot = 0, seed = 4) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const p = spen(NOW(), seed, 6);
  quad(roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], 10), '#f4f1ea', p, 6);
  ctx.fillStyle = '#d9d4c8'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-w / 2 + 20 + hash(seed + i) * (w - 40), -h / 2 + 18 + hash(seed + 9 + i) * (h - 36), 6, 0, 7); ctx.fill(); }
  ctx.restore();
}
export function debris(t, o = {}) {   // cardboard and foam littered on the floor (hook, pull-back)
  const dy = o.dy ?? 0;
  cardboard(150, 1640 + dy, 330, 120, -0.1, 3, true); cardboard(900, 1560 + dy, 300, 110, 0.15, 5, true);
  foam(300, 1760 + dy, 260, 110, 0.08, 6); foam(820, 1740 + dy, 230, 100, -0.12, 7); cardboard(560, 1810 + dy, 260, 90, 0.04, 8);
}

// ---------- screw ----------
export function screw(x, y, L, ang = 0, seed = 90, glint = 0) {   // (x,y) = tip; draws up to the head
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); const p = spen(NOW(), seed, Math.max(4, L * 0.016)), hw = L * 0.19, sw = L * 0.085, hl = L * 0.2;
  const shaft = [[-sw, -L * 0.8], [sw, -L * 0.8], [sw, -L * 0.1], [0, 0], [-sw, -L * 0.1]];
  ctx.fillStyle = '#b8bec9'; ctx.beginPath(); shaft.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill(); p.outline(shaft, true, Math.max(4, L * 0.016));
  for (let i = 0; i < 9; i++) { const yy = -L * 0.08 - i * L * 0.078; p.line([[-sw, yy - L * 0.03], [sw, yy + L * 0.02]], Math.max(3, L * 0.013), '#6f7787'); }
  const head = roundPoly([[-hw, -L * 0.8], [hw, -L * 0.8], [hw * 0.92, -L * 0.8 - hl], [-hw * 0.92, -L * 0.8 - hl]], hl * 0.45, 6);
  ctx.fillStyle = '#d4d9e1'; ctx.beginPath(); head.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill(); p.outline(head, true, Math.max(4, L * 0.016));
  const cy = -L * 0.8 - hl / 2; p.line([[-hw * 0.6, cy], [hw * 0.6, cy]], Math.max(5, L * 0.024), '#4a4e5c'); p.line([[0, cy - hl * 0.34], [0, cy + hl * 0.34]], Math.max(5, L * 0.024), '#4a4e5c');
  p.line([[-sw * 0.45, -L * 0.74], [-sw * 0.45, -L * 0.2]], Math.max(4, L * 0.02), '#f4f7fb');
  if (glint > 0) { ctx.fillStyle = '#fffbe0'; for (const [dx, dy, r] of [[hw * 0.7, -L * 0.8 - hl * 0.8, L * 0.07], [-sw * 0.2, -L * 0.45, L * 0.05]]) { ctx.beginPath(); ctx.moveTo(dx, dy - r * 2 * glint); ctx.lineTo(dx + r * 0.5, dy - r * 0.5); ctx.lineTo(dx + r * 2 * glint, dy); ctx.lineTo(dx + r * 0.5, dy + r * 0.5); ctx.lineTo(dx, dy + r * 2 * glint); ctx.lineTo(dx - r * 0.5, dy + r * 0.5); ctx.lineTo(dx - r * 2 * glint, dy); ctx.lineTo(dx - r * 0.5, dy - r * 0.5); ctx.closePath(); ctx.fill(); } }
  ctx.restore();
}
export function palm(x, y, sc = 1, seed = 70, front = false) {   // open palm facing up, (x,y)=palm centre; front=true draws the fingers/thumb in front of the screw
  const p = spen(NOW(), seed, 6);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  if (!front) {
    quad(roundPoly([[-250, -50], [235, -70], [245, 80], [-235, 105]], 70, 10), SK, p, 7);
    p.line([[-120, 20], [20, 40], [130, 22]], 4, '#b8825c');
  } else {
    for (const [fx, fy, w, h, a] of [[195, -40, 70, 130, 0.5], [120, -62, 70, 150, 0.32], [-195, -30, 70, 140, -0.55]]) {
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(a); quad(roundPoly([[-w / 2, 0], [w / 2, 0], [w / 2, -h], [-w / 2, -h]], w * 0.45, 8), SK, p, 6); ctx.restore();
    }
  }
  ctx.restore();
}

// ---------- wardrobe ----------
const WOOD = '#c8935a', WOODD = '#9a6a3c', WOODL = '#dcab74';
function slab(pts, p, fill = WOOD, lw = 7) { quad(pts, fill, p, lw); }
// Wardrobe standing: centre x, bottom yb, width w, height h. o: lean(rad), doorOpen(0..1 right door swings), handle(false = no right handle), crooked(px), blur
export function wardrobe(t, x, yb, w, h, o = {}) {
  const p = spen(t, 60, 8), top = yb - h, hw = w / 2, L = x - hw, R = x + hw;
  ctx.save(); ctx.translate(x, yb); ctx.rotate(o.lean ?? 0); ctx.translate(-x, -yb);
  // feet + body
  for (const fx of [L + 40, R - 40]) quad([[fx - 28, yb - 36], [fx + 28, yb - 36], [fx + 22, yb], [fx - 22, yb]], WOODD, p, 6);
  const body = [[L, top + 40], [R, top + 40], [R, yb - 36], [L, yb - 36]];
  slab(body, p, '#6a4528', 7);                         // dark inside
  // crown
  quad([[L - 26, top], [R + 26, top], [R + 14, top + 56], [L - 14, top + 56]], WOODL, p, 8);
  // doors
  const mid = x, dw = hw - 14, dy0 = top + 62, dy1 = yb - 44;
  const door = (xl, xr, hinge, open) => {   // open: 0..1 -> door narrows toward its hinge (swings toward camera)
    const wd = (xr - xl) * (1 - 0.82 * open), x0 = hinge < 0 ? xl : xr - wd, x1 = x0 + wd, sk = open * 40 * (hinge < 0 ? -1 : 1);
    const pts = hinge < 0 ? [[x0, dy0], [x1, dy0 - sk], [x1, dy1 + sk], [x0, dy1]] : [[x0, dy0 - sk], [x1, dy0], [x1, dy1], [x0, dy1 + sk]];
    slab(pts, p, WOOD, 7);
    const ix0 = x0 + wd * 0.14, ix1 = x1 - wd * 0.14, yy0 = dy0 + 36, yy1 = dy1 - 36;
    if (wd > 120) { quad([[ix0, yy0], [ix1, yy0], [ix1, yy1], [ix0, yy1]], WOODL, p, 5); }
    return [x0, x1];
  };
  const [lx0, lx1] = door(L + 12, mid - 2, -1, 0);
  const [rx0, rx1] = door(mid + 2, R - 12, 1, o.doorOpen ?? 0);
  // handles (silver)
  const hdl = (hx, hy) => { ctx.fillStyle = '#cfd5de'; ctx.beginPath(); ctx.arc(hx, hy, 22, 0, 7); ctx.fill(); p.outline(ellipsePts(hx, hy, 22, 22, 24), true, 6); ctx.fillStyle = '#f4f7fb'; ctx.beginPath(); ctx.arc(hx - 6, hy - 6, 7, 0, 7); ctx.fill(); };
  const hy = (dy0 + dy1) / 2 + 40;
  hdl(lx1 - 36, hy); if (o.handle !== false) hdl(rx0 + 36 + (o.doorOpen ?? 0) * 0, hy);
  ctx.restore();
  return { handle: [rx0 + 36, hy], top, yb, L, R };
}
// ---- the collapse: parts of the wardrobe at (WX,WYB,WW,WH) fold flat onto the floor. k 0..1 (0 = standing, 1 = flat pile) ----
export const WARD = { x: 700, yb: 1300, w: 680, h: 1000 };
const mapQ = (A, B, u) => A.map((q, i) => [lerp(q[0], B[i][0], u), lerp(q[1], B[i][1], u)]);
export function pile(t, k, o = {}) {
  const p = spen(t, 61, 8), { x, yb, w, h } = WARD, L = x - w / 2, R = x + w / 2, top = yb - h, mid = x;
  const door = (xl, xr) => [[xl, top + 62], [xr, top + 62], [xr, yb - 44], [xl, yb - 44]];
  const inset = (q, m = 0.14) => { const [a, b, c, d] = q, wd = b[0] - a[0]; return [[a[0] + wd * m, a[1] + 40], [b[0] - wd * m, b[1] + 40], [c[0] - wd * m, c[1] - 40], [d[0] + wd * m, d[1] - 40]]; };
  const PARTS = [
    { s: [[L + 12, yb - 36], [L + 68, yb - 36], [L + 62, yb], [L + 18, yb]], f: [[300, 1790], [360, 1790], [366, 1830], [294, 1830]], c: '#9a6a3c', a: 0.3, b: 0.75 },
    { s: [[R - 68, yb - 36], [R - 12, yb - 36], [R - 18, yb], [R - 62, yb]], f: [[1000, 1800], [1060, 1800], [1066, 1840], [994, 1840]], c: '#9a6a3c', a: 0.3, b: 0.75 },
    { s: [[L, top + 40], [R, top + 40], [R, yb - 36], [L, yb - 36]], f: [[430, 1330], [1010, 1330], [1030, 1450], [410, 1450]], c: '#6a4528', a: 0.4, b: 1.0 },
    { s: [[L - 26, top], [R + 26, top], [R + 14, top + 56], [L - 14, top + 56]], f: [[380, 1296], [1040, 1296], [1050, 1346], [370, 1346]], c: WOODL, a: 0.0, b: 0.45 },
    { s: [[L, top + 56], [L + 52, top + 56], [L + 52, yb - 40], [L, yb - 40]], f: [[330, 1390], [400, 1390], [480, 1730], [300, 1730]], c: '#e6b982', a: 0.05, b: 0.55 },
    { s: [[R - 52, top + 56], [R, top + 56], [R, yb - 40], [R - 52, yb - 40]], f: [[990, 1390], [1050, 1390], [1120, 1730], [950, 1730]], c: '#e6b982', a: 0.1, b: 0.6 },
    { s: door(L + 12, mid - 2), f: [[410, 1470], [690, 1470], [745, 1760], [350, 1760]], c: WOOD, a: 0.25, b: 0.8, hd: true },
    { s: door(mid + 2, R - 12), f: [[720, 1480], [1000, 1480], [1070, 1770], [690, 1770]], c: WOOD, a: 0.3, b: 0.9, hd: false },
  ];
  for (const P of PARTS) {
    const u0 = clamp01((k - P.a) / (P.b - P.a)), land = u0 >= 1 ? clamp01((k - P.b) / 0.12) : 0, fall = u0 * u0, bounce = u0 >= 1 ? -16 * Math.sin(land * Math.PI * 2) * (1 - land) : 0;
    const q = mapQ(P.s, P.f, fall).map(c => [c[0], c[1] + bounce]);
    quad(q, P.c, p, 7);
    if (P.hd !== undefined) {
      quad(mapQ(inset(P.s), inset(P.f), fall).map(c => [c[0], c[1] + bounce]), WOODL, p, 5);
      if (P.hd) { const hx = lerp(P.s[1][0] - 36, (P.f[1][0] + P.f[0][0]) / 2 + 40, fall), hy = lerp((P.s[0][1] + P.s[3][1]) / 2 + 40, (P.f[0][1] + P.f[3][1]) / 2, fall) + bounce; ctx.fillStyle = '#cfd5de'; ctx.beginPath(); ctx.arc(hx, hy, lerp(22, 30, fall), 0, 7); ctx.fill(); p.outline(ellipsePts(hx, hy, lerp(22, 30, fall), lerp(22, 30, fall), 24), true, 6); }
    }
  }
}
export function ghost(t, alpha = 0.7) {   // clean pale rectangle on the wall where the wardrobe stood
  const { x, yb, w, h } = WARD; ctx.fillStyle = `rgba(255,248,232,${alpha})`; ctx.fillRect(x - w / 2 - 14, yb - h - 10, w + 28, h + 10);
  spen(t, 62, 6).outline([[x - w / 2 - 14, yb - h - 10], [x + w / 2 + 14, yb - h - 10], [x + w / 2 + 14, yb], [x - w / 2 - 14, yb]], true, 5);
}
export function dust(x, y, k, r = 150, n = 7, seed = 1) {   // dust puffs rising/spreading: k 0..1
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + seed, d = r * (0.3 + 0.7 * k) * (0.6 + 0.4 * hash(seed + i)); cloud(x + Math.cos(a) * d * 1.5, y + Math.sin(a) * d * 0.45 - 90 * k * hash(seed + 3 + i), 38 + 40 * hash(seed + 7 + i), 0.85 * (1 - 0.55 * k), '#f4efe6'); }
}
export function dust2(x, y, k, r, n, seed) { dust(x, y, k, r, n, seed); }
