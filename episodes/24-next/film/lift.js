// lift.js — helpers lifted from stills.js (approved look), boil follows live time. Generated; edit scene.js instead.
// UNIT 4B · 24 "The Lid" (Tập 15) — 3 KEY STILLS, full-bleed 9:16 panel. render(0|1|2).
// 0 = frame-1 hook (giant jar, red gingham lid, label all the way round), 1 = PEAK row 6 (floor twist, lid pops), 2 = PUNCH row 7/8 (pickles on chest, twin lid on the jam jar).
import { drawCharacter, paper, panel } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';

export const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
export const NOW = () => (typeof window !== 'undefined' && window.T_NOW !== undefined) ? window.T_NOW : 0.1;
export const INK = '#2a2230', TITLE_Y = 232;
export const SKIN = '#e2ac84';
export const spen = (t, seed, lw = 3) => { const p = new VPen(ctx, 0, 0, 1, { lw, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
// pen in Steve/Snuggles local units (same mapping drawCharacter uses)
export const lpen = (X, Y, s, seed = 5) => new VPen(ctx, X, Y, s, { lw: Math.max(2.4, s * 0.95), hand: true, frame: boilFrame(NOW()), seed });
export function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
export function strokedText(s, x, y, size, fill = '#fff', lw = 10) {
  ctx.save(); ctx.font = `600 ${size}px "Fredoka"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.strokeText(s, x, y); ctx.fillStyle = fill; ctx.fillText(s, x, y); ctx.restore();
}
export function title(T) {   // inside the panel, top; clears y 170 (iPhone safe area)
  ctx.save(); ctx.font = '600 56px Fredoka'; const w = ctx.measureText(T).width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 52, w, 104, 52); ctx.fill();
  text(T, 540, TITLE_Y + 3, 56, '#fff6dc'); ctx.restore();
}
export function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
export const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
export const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };


export const RED = '#d6342b';
export const SK = { n: SKIN, hot: '#e65a3c', flush: '#e98a62' };
export function steve(X, Y, s, pose, skin) { window.STEVE_SKIN = skin; drawCharacter(ctx, 'steve', X, Y, s, { hair: 0, arm: 'down', noShadow: true, ...pose }, { frame: boilFrame(NOW()) }); }
export const NOARM = { hand: [0.01, 0.01] };
export function armTube(pts, w, skin, seed = 31) { spen(NOW(), seed, 5).tube(pts, w, skin); }
export function poly2(pts, fill, lw = 5, seed = 3) { const p = spen(NOW(), seed, lw); p.part(pts, fill, { shade: false, lw }); return p; }

// ---------- kitchen ----------
export function kitchen(counterY, floorY, { fridge = false, cabinets = true } = {}) {
  ctx.fillStyle = '#f4e3ae'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (let y = 60; y < counterY; y += 120) for (let x = (y / 120 % 2 ? 40 : 100); x < W; x += 160) { ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill(); }
  const p = spen(NOW(), 40, 6);
  if (counterY < H) {   // tiled backsplash
    const top = counterY - 250;
    for (let r = 0; top + r * 62 < counterY; r++) for (let c = -1; c * 100 < W + 100; c++) { ctx.fillStyle = (r + c) % 2 ? '#cfe7e3' : '#e3f2ef'; ctx.fillRect(c * 100 + (r % 2 ? 50 : 0), top + r * 62, 100, 62); }
    p.line([[-10, top], [W + 10, top]], 6, '#7fa8a2');
    for (let y = top + 62; y < counterY; y += 62) p.line([[-10, y], [W + 10, y]], 3, '#9fc3bd');
    // counter top + cabinets
    poly2([[-10, counterY], [W + 10, counterY], [W + 10, counterY + 46], [-10, counterY + 46]], '#d9c6a0', 7, 41);
    if (cabinets) {
      ctx.fillStyle = '#8fb39a'; ctx.fillRect(0, counterY + 46, W, floorY - counterY - 46);
      p.line([[-10, counterY + 46], [W + 10, counterY + 46]], 6);
      for (let x = 0; x < W; x += 360) { poly2([[x + 20, counterY + 76], [x + 340, counterY + 76], [x + 340, floorY - 30], [x + 20, floorY - 30]], '#a2c4ab', 5, 50 + x); ctx.fillStyle = '#6b5a45'; ctx.fillRect(x + 290, counterY + 100, 14, 70); }
    }
  }
  // wooden floor
  ctx.fillStyle = '#c99a63'; ctx.fillRect(0, floorY, W, H - floorY);
  for (let y = floorY, r = 0; y < H; y += 120, r++) { ctx.fillStyle = r % 2 ? '#bd8d57' : '#d3a46d'; ctx.fillRect(0, y, W, 120); for (let x = (r % 2 ? 120 : 380); x < W; x += 480) { ctx.fillStyle = 'rgba(80,50,20,0.25)'; ctx.fillRect(x, y, 5, 120); } }
  p.line([[-10, floorY], [W + 10, floorY]], 9);
  ctx.fillStyle = 'rgba(40,30,20,0.12)'; ctx.fillRect(0, floorY, W, 24);
  if (fridge) {
    poly2([[820, 180], [1100, 180], [1100, floorY + 10], [820, floorY + 10]], '#eef2f5', 8, 70);
    p.line([[820, 640], [1100, 640]], 8);
    ctx.fillStyle = '#9aa1b6'; ctx.fillRect(850, 400, 18, 170); ctx.fillRect(850, 700, 18, 200);
  }
}

// ---------- the jar ----------
export function jarPoly(cx, top, w, h, nw, sh = 150) {
  return roundPoly([[cx - nw / 2, top], [cx + nw / 2, top], [cx + nw / 2, top + sh * 0.35], [cx + w / 2, top + sh], [cx + w / 2, top + h], [cx - w / 2, top + h], [cx - w / 2, top + sh], [cx - nw / 2, top + sh * 0.35]], Math.min(70, w * 0.15), 5);
}
export function glassBody(cx, top, w, h, nw, sh, tint = '#cfe6df', lw = 8) {
  const pts = jarPoly(cx, top, w, h, nw, sh), p = spen(NOW(), 101, lw);
  p.part(pts, tint, { shade: false, lw });
  ctx.save(); ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
  const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, 'rgba(40,80,70,0.22)'); g.addColorStop(0.18, 'rgba(255,255,255,0)'); g.addColorStop(0.8, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(40,80,70,0.25)'); ctx.fillStyle = g; ctx.fillRect(cx - w / 2, top, w, h);
  ctx.restore();
  return pts;
}
// paper label wrapped round the glass: curved top/bottom edges (we see the cylinder from slightly above), dark edge shading, no brand, plain sun doodle
export function label(cx, y0, y1, w, sag = 40, doodle = true) {
  const n = 24, top = [], bot = [];
  for (let i = 0; i <= n; i++) { const u = i / n, x = cx - w / 2 + u * w, b = Math.sin(Math.PI * u) * sag; top.push([x, y0 + b]); bot.push([x, y1 + b]); }
  const pts = [...top, ...bot.reverse()], p = spen(NOW(), 111, 6);
  p.part(pts, '#f3e4c0', { shade: false, lw: 6 });
  ctx.save(); ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
  const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, 'rgba(90,60,30,0.38)'); g.addColorStop(0.16, 'rgba(255,255,255,0)'); g.addColorStop(0.85, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(90,60,30,0.4)'); ctx.fillStyle = g; ctx.fillRect(cx - w / 2, y0 - 10, w, y1 - y0 + sag + 20);
  if (doodle) {   // plain doodle: sun-ish circle with rays and a wavy line under it
    const my = (y0 + y1) / 2 + sag * 0.9, d = spen(NOW(), 112, 7), col = '#a9503a';
    d.outline(ellipsePts(cx, my - 20, 78, 78, 40), true, 8, col);
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; d.line([[cx + Math.cos(a) * 104, my - 20 + Math.sin(a) * 104], [cx + Math.cos(a) * 140, my - 20 + Math.sin(a) * 140]], 8, col); }
    d.line([[cx - 190, my + 150], [cx - 120, my + 120], [cx - 50, my + 150], [cx + 20, my + 120], [cx + 90, my + 150], [cx + 160, my + 120], [cx + 200, my + 140]], 8, col);
  }
  ctx.restore();
}
// red gingham lid (rounded slab with ridges). period = check size
export function ginghamLid(cx, cy, w, h, period, rot = 0) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  const pts = roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], Math.min(h * 0.3, 34), 5), p = spen(NOW(), 121, Math.max(4, h * 0.05));
  p.part(pts, '#fbf1e6', { shade: false, lw: Math.max(5, h * 0.055) });
  ctx.save(); ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
  ctx.fillStyle = 'rgba(214,52,43,0.62)';
  for (let x = -w / 2 + period * 0.25; x < w / 2; x += period * 2) ctx.fillRect(x, -h / 2, period, h);
  for (let y = -h / 2 + period * 0.25; y < h / 2; y += period * 2) ctx.fillRect(-w / 2, y, w, period);
  ctx.fillStyle = 'rgba(255,255,255,0.38)'; ctx.fillRect(-w / 2 + 14, -h / 2 + 8, w * 0.5, Math.max(4, h * 0.07));   // shine
  ctx.fillStyle = 'rgba(60,10,10,0.18)'; ctx.fillRect(-w / 2, h / 2 - h * 0.16, w, h * 0.16);
  ctx.restore();
  p.outline(pts, true, Math.max(5, h * 0.055));
  ctx.restore();
}
// a fist (white knuckles when gripping)
export function fist(x, y, r, white = true, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const p = spen(NOW(), 131, 5);
  p.part(ellipsePts(0, 0, r * 1.15, r * 0.9, 28), white ? '#f7ede2' : SKIN, { shade: false, lw: 6 });
  for (let i = -1.5; i <= 1.5; i++) { const kx = i * r * 0.5; p.line([[kx - r * 0.12, -r * 0.5], [kx, -r * 0.3], [kx + r * 0.12, -r * 0.5]], 4, '#a68d78'); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(kx, -r * 0.62, r * 0.13, 0, 7); ctx.fill(); }
  ctx.restore();
}
export function vein(x, y, len, rot = 0, lw = 6) { const p = spen(NOW(), 141 + Math.floor(x), lw); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); p.line([[0, 0], [len * 0.3, -len * 0.18], [len * 0.55, len * 0.1], [len * 0.8, -len * 0.12], [len, 0]], lw, '#c7283c'); p.line([[len * 0.3, -len * 0.18], [len * 0.45, -len * 0.4]], lw * 0.7, '#c7283c'); ctx.restore(); }
export function motionLines(list, col = INK, lw = 8) { const p = spen(NOW(), 151, lw); for (const [x0, y0, x1, y1] of list) p.line([[x0, y0], [x1, y1]], lw, col); }
export function burst(x, y, r0, r1, n, fill, rot = 0) {
  const pts = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, r = i % 2 ? r0 : r1; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  poly2(pts, fill, 6, 161);
}
export function pickle(x, y, len, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const p = spen(NOW(), 171, 5); p.part(roundPoly([[-len / 2, -len * 0.17], [len / 2, -len * 0.17], [len / 2, len * 0.17], [-len / 2, len * 0.17]], len * 0.16, 4), '#86b23c', { shade: false, lw: 5 });
  ctx.fillStyle = '#5f8a2a'; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(i * len * 0.13, ((i * 7) % 3 - 1) * len * 0.06, len * 0.022, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(-len * 0.38, -len * 0.12, len * 0.5, len * 0.04);
  ctx.restore();
}
export function cloud(x, y, r, a = 0.9) {
  const parts = [[0, 0, r], [r * 0.9, r * 0.15, r * 0.75], [-r * 0.9, r * 0.2, r * 0.7], [r * 0.35, -r * 0.6, r * 0.7]].map(([dx, dy, rr]) => [x + dx, y + dy, rr]);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(42,34,48,0.5)'; ctx.lineWidth = 5; parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke(); });
  ctx.fillStyle = '#fff'; parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr - 2, 0, 7); ctx.fill(); }); ctx.restore();
}

// ---------- Snuggles ----------
export function snuggles(X, Y, s, pose) { drawCharacter(ctx, 'snuggles', X, Y, s, { noShadow: true, ...pose }, { frame: boilFrame(NOW()) }); }

