// room.js — Tập 17 "Mosquito": bedroom props (night/lamp), giant mosquito, swarm, slipper, window. Uses base.js (Tập 14 helpers).
import { roundPoly, ellipsePts } from './lib/cast_v2.js';
import { W, H, ctx, INK, spen, text, strokedText, glowBlob, cloud, armTube, steve, MUSTARD, SK, hash, NOW, NOARM } from './base.js';
export { W, H, ctx, INK, spen, text, strokedText, glowBlob, cloud, armTube, steve, MUSTARD, SK, hash, NOW, NOARM };
const lerp = (a, b, k) => a + (b - a) * k;
export const poly = (pts, fill, alpha = 1) => { ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.restore(); };

// ---------- walls ----------
// lamp 0..1 (0 = night: blue room lit by the moon; 1 = warm lamp light). Faces stay bright because characters are drawn unshaded.
const mixc = (a, b, k) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
export function roomWall(t, lamp = 0, y0 = 0, y1 = H) {
  const wall = mixc('#4a5f9c', '#ecd9a6', lamp), stripe = mixc('#5a70b0', '#f5e6bb', lamp), floor = mixc('#2f3a6c', '#a98a5e', lamp);
  ctx.fillStyle = wall; ctx.fillRect(0, y0, W, y1 - y0);
  const p = spen(t, 40, 5);
  for (let x = 0; x < W + 270; x += 270) { ctx.fillStyle = stripe; if ((Math.floor(x / 270) % 2)) ctx.fillRect(x, y0, 270, y1 - y0); p.line([[x, y0], [x, y1]], 4, mixc('#34457a', '#c9b283', lamp)); }
  ctx.fillStyle = floor; ctx.fillRect(0, 1600, W, 400); p.line([[0, 1600], [W, 1600]], 7);
}
export const moonGlow = (x, y, r = 700, a = 0.35) => glowBlob(x, y, r, `rgba(190,215,255,${a})`);
export const lampGlow = (x, y, r = 900, a = 0.5) => glowBlob(x, y, r, `rgba(255,214,120,${a})`);

// ---------- window (night outside) ----------
// open 0..1 : sash swings toward the viewer; curtains billow with `bil` (px)
export function windowFrame(x0, y0, x1, y1, open = 0, t = 0, o = {}) {
  const p = spen(t, 120, 8), w = x1 - x0, h = y1 - y0;
  ctx.fillStyle = '#16204a'; ctx.fillRect(x0, y0, w, h);   // night
  if (o.moon !== false) { ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.arc(x0 + w * 0.72, y0 + h * 0.2, w * 0.1, 0, 7); ctx.fill(); ctx.fillStyle = '#16204a'; ctx.beginPath(); ctx.arc(x0 + w * 0.72 + w * 0.045, y0 + h * 0.2 - w * 0.02, w * 0.085, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#e9f0ff'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(x0 + w * (0.1 + 0.8 * hash(i + 3)), y0 + h * (0.1 + 0.5 * hash(i + 9)), 4, 0, 7); ctx.fill(); }
  if (o.under) o.under();
  // frame
  p.line([[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]], 14, '#e9e4d8');
  p.line([[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]], 4, INK);
  if (open < 0.05) { p.line([[(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1]], 10, '#e9e4d8'); p.line([[x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2]], 10, '#e9e4d8'); ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = '#fff'; poly([[x0 + 20, y0 + 20], [x0 + w * 0.5, y0 + 20], [x0 + 20, y0 + h * 0.5]], '#fff', 0.16); ctx.restore(); }
  else {   // sash flung wide: a slanted pane at the left edge
    const sw = w * 0.22 * open;
    poly([[x0, y0], [x0 + sw, y0 + h * 0.06], [x0 + sw, y1 - h * 0.06], [x0, y1]], 'rgba(200,225,255,0.55)');
    p.line([[x0, y0], [x0 + sw, y0 + h * 0.06], [x0 + sw, y1 - h * 0.06], [x0, y1]], 9, '#e9e4d8');
  }
}
export function curtains(x0, y0, x1, y1, t = 0, bil = 0) {   // two curtain panels at the window sides, blowing inward with bil
  const p = spen(t, 130, 6);
  for (const side of [-1, 1]) {
    const xe = side < 0 ? x0 : x1, wdt = (x1 - x0) * 0.2, sw = bil * (0.6 + 0.4 * Math.sin(t * 6 + side));
    const pts = [[xe - side * 20, y0 - 30], [xe + side * wdt + side * sw * 0.2, y0 - 30], [xe + side * (wdt * 0.8 + sw), y0 + (y1 - y0) * 0.5], [xe + side * (wdt * 0.5 + sw * 1.4), y1 + 40], [xe - side * 20, y1 + 40]];
    p.part(roundPoly(pts, 30, 6), '#c9667d', { shade: 0.22, lw: 7 });
    for (let k = 1; k < 3; k++) p.line([[xe + side * wdt * 0.28 * k, y0], [xe + side * (wdt * 0.2 * k + sw * 0.5 * k), y1]], 4, '#9a4458');
  }
  p.line([[x0 - 40, y0 - 30], [x1 + 40, y0 - 30]], 12, '#5a3a2a');
}

// ---------- lamp / clock / moths ----------
export function lamp(x, y, on = true, t = 0) {   // bedside lamp, y = shade centre
  const p = spen(t, 140, 7);
  p.part(roundPoly([[x - 16, y + 60], [x + 16, y + 60], [x + 22, y + 210], [x - 22, y + 210]], 6), '#8a6a4a', { shade: 0.2, lw: 6 });
  p.part(roundPoly([[x - 70, y + 205], [x + 70, y + 205], [x + 56, y + 232], [x - 56, y + 232]], 8), '#6a4e36', { shade: 0.2, lw: 6 });
  p.part(roundPoly([[x - 56, y - 70], [x + 56, y - 70], [x + 100, y + 70], [x - 100, y + 70]], 14), on ? '#ffe9a0' : '#9a8f78', { shade: on ? false : 0.25, lw: 8 });
  if (on) lampGlow(x, y, 520, 0.5);
}
export function clock(x, y, s = 1, t = 0, hhmm = '3:07') {
  const p = spen(t, 150, 6);
  p.part(roundPoly([[x - 100 * s, y - 70 * s], [x + 100 * s, y - 70 * s], [x + 100 * s, y + 70 * s], [x - 100 * s, y + 70 * s]], 16 * s), '#1a1620', { shade: false, lw: 7 });
  text(hhmm, x, y + 4 * s, 78 * s, '#ff5a3a', 'Fredoka');
}
export function moth(x, y, t, sz = 22, k = 0) {
  const fl = Math.sin(t * 40 + k * 3) * 0.6; ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#efe6cf'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  for (const sx of [-1, 1]) { ctx.save(); ctx.scale(sx, 1); ctx.rotate(-0.4 + fl); ctx.beginPath(); ctx.ellipse(sz * 0.7, -sz * 0.2, sz * 0.8, sz * 0.5, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, 0, sz * 0.18, sz * 0.5, 0, 0, 7); ctx.fill(); ctx.restore();
}

// ---------- mosquito ----------
// sz = body length in px (head to abdomen tip); faces left by default (head at -x). flip = -1 mirrors. o: flap (0|1), eyes (sly eyes for the giant), land (legs up), fill
export function mosquito(x, y, sz, rot = 0, t = 0, o = {}) {
  const u = sz / 4, fl = (o.flap ?? 1) * Math.sin(t * 70 + (o.k ?? 0)) * 0.28, flip = o.flip ?? 1, K = o.k ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(flip, 1); ctx.rotate(rot);
  const lw = Math.max(2.2, u * 0.1), p = spen(t, 160 + K, lw);
  const body = '#2f2f3a', pale = '#d9d9e4';
  // wings (behind)
  for (const [a, len] of [[-1.05 + fl, 1.9], [-0.55 - fl * 0.8, 1.7]]) {
    ctx.save(); ctx.translate(-0.1 * u, -0.45 * u); ctx.rotate(a); ctx.globalAlpha = 0.55; ctx.fillStyle = '#e6f2ff'; ctx.strokeStyle = INK; ctx.lineWidth = lw * 0.8;
    ctx.beginPath(); ctx.ellipse(len * u * 0.5 + 0.2 * u, 0, len * u * 0.5, 0.36 * u, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  // legs
  const legs = o.land ? [[-0.6, 0.45, -1.2, 1.6], [0.0, 0.5, 0.0, 1.7], [0.5, 0.5, 1.2, 1.6]] : [[-0.6, 0.45, -1.4, 1.4], [0.0, 0.5, -0.3, 1.7], [0.5, 0.5, 0.9, 1.5]];
  for (const [lx, ly, ex, ey] of legs) p.line([[lx * u, ly * u], [(lx + ex) / 2 * u + 0.25 * u, (ly + ey) / 2 * u + 0.1 * u], [ex * u, ey * u]], lw, INK);
  for (const [lx, ly, ex, ey] of legs) p.line([[(lx + 0.15) * u, ly * u], [((lx + ex) / 2 + 0.45) * u, (ly + ey) / 2 * u], [(ex + 0.4) * u, (ey - 0.1) * u]], lw * 0.9, INK);
  // abdomen, thorax, head
  p.part(ellipsePts(1.35 * u, 0.12 * u, 1.55 * u, 0.46 * u, 28), body, { shade: 0.2, lw });
  for (const sx of [0.75, 1.3, 1.85]) p.line([[sx * u, -0.32 * u], [(sx + 0.05) * u, 0.5 * u]], lw * 1.1, pale);
  p.part(ellipsePts(-0.2 * u, -0.02 * u, 0.82 * u, 0.62 * u, 28), '#3a3a48', { shade: 0.2, lw });
  p.part(ellipsePts(-1.05 * u, 0.0, 0.46 * u, 0.42 * u, 24), '#3a3a48', { shade: 0.2, lw });
  p.line([[-1.4 * u, 0.05 * u], [-2.1 * u, 0.28 * u], [-2.8 * u, 0.5 * u]], lw * 1.3, INK);   // proboscis
  p.line([[-1.0 * u, -0.38 * u], [-1.35 * u, -1.0 * u]], lw, INK); p.line([[-0.82 * u, -0.38 * u], [-0.9 * u, -1.05 * u]], lw, INK);   // antennae
  if (o.eyes) for (const [ex, ey] of [[-1.15, -0.1], [-0.88, -0.08]]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex * u, ey * u, 0.19 * u, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = lw * 0.7; ctx.stroke(); ctx.fillStyle = '#d02020'; ctx.beginPath(); ctx.arc((ex - 0.06) * u, (ey + 0.02) * u, 0.09 * u, 0, 7); ctx.fill(); }
  ctx.restore();
}
export function bzz(x, y, t, sz = 60, col = INK) {   // squiggle trail
  const p = spen(t, 170, Math.max(4, sz * 0.09)), pts = [];
  for (let i = 0; i < 16; i++) { const k = i / 15; pts.push([x + k * sz * 4, y + Math.sin(k * 12 + t * 25) * sz * 0.35 + (k * k) * sz * 0.4]); }
  p.line(pts, Math.max(4, sz * 0.09), col);
}
export function swarm(t, from, to, n = 70, o = {}) {   // dark cloud streaming from `from` to `to` through a curved path; k 0..1 progress
  const prog = o.prog ?? 1;
  for (let i = 0; i < n; i++) {
    const r = hash(i + 1), ph = (hash(i + 50) + t * (o.speed ?? 0.35)) % 1, k = Math.min(prog, 1) * ph;
    if (ph > prog) continue;
    const cx = lerp(from[0], to[0], k) + 120 * Math.sin(k * 3.1 + i) * (1 - k) + (r - 0.5) * (o.spread ?? 260) * (0.4 + k);
    const cy = lerp(from[1], to[1], k) - 190 * Math.sin(k * Math.PI) + (hash(i + 9) - 0.5) * (o.spread ?? 260) * (0.4 + k) * 0.8;
    const sz = (o.size ?? 56) * (0.6 + 0.8 * hash(i + 77)) * (0.7 + 0.5 * k);
    mosquito(cx, cy, sz, Math.atan2(to[1] - from[1], to[0] - from[0]) * 0.4 + 0.3 * Math.sin(i + t * 9), t, { flip: -1, k: i, flap: 1 });
  }
}
export function darkCloud(cx, cy, r, a = 0.5) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#10142e';
  for (let i = 0; i < 9; i++) { const ax = cx + (hash(i) - 0.5) * r * 2, ay = cy + (hash(i + 7) - 0.5) * r; ctx.beginPath(); ctx.arc(ax, ay, r * (0.35 + 0.35 * hash(i + 3)), 0, 7); ctx.fill(); } ctx.restore();
}

// ---------- slipper ----------
export function slipper(x, y, rot = 0, s = 1, t = 0, o = {}) {   // fluffy blue bedroom slipper, side view; x,y = centre; toe points +x before rot
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); const p = spen(t, 180, 7);
  p.part(roundPoly([[-175, 28], [185, 28], [200, 62], [-175, 70]], 30, 6), '#c9a56e', { shade: 0.2, lw: 7 });   // sole
  p.part(roundPoly([[-175, 28], [-170, -40], [-70, -60], [-20, 30]], 40, 6), '#3c78b0', { shade: 0.2, lw: 7 });   // heel cup
  p.part(ellipsePts(-40, -30, 46, 22, 20), '#2a2230', { shade: false, lw: 5 });   // foot opening
  p.part(roundPoly([[-10, 30], [0, -70], [110, -75], [200, -5], [200, 30]], 60, 8), o.col ?? '#4d93d6', { shade: 0.2, lw: 8 });   // toe dome
  ctx.fillStyle = '#fffdf8'; ctx.strokeStyle = INK; ctx.lineWidth = 5;
  for (const [cx, cy, r] of [[-6, 24, 17], [-4, -4, 19], [4, -34, 19], [20, -60, 17]]) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.stroke(); }
  p.line([[90, -30], [150, -8]], 6, '#a9d0f2'); p.line([[70, -52], [130, -32]], 6, '#a9d0f2');
  ctx.restore();
}
export function blanket(x0, y0, x1, y1, t = 0, col = '#d8705f') {
  const p = spen(t, 190, 8);
  p.part(roundPoly([[x0, y0], [x1, y0 + 6], [x1 + 30, y1], [x0 - 30, y1]], 60, 8), col, { shade: 0.22, lw: 9 });
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 16; for (let y = y0 + 110; y < y1; y += 120) { ctx.beginPath(); ctx.moveTo(x0 + 20, y); ctx.lineTo(x1 - 20, y + 4); ctx.stroke(); } ctx.restore();
}
export function pillow(x, y, w, h, t = 0) { const p = spen(t, 195, 7); p.part(roundPoly([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]], h * 0.4, 8), '#e9ebf8', { shade: 0.18, lw: 8 }); }
