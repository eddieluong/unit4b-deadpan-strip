// lift.js — drawing helpers lifted from stills.js (approved key-still look) + live boil time. Generated; edit scene.js instead.
// UNIT 4B · 23 "Every Floor" (Tập 14) — 3 KEY STILLS, full-bleed 9:16 panel. render(0|1|2).
// 0 = frame-1 hook (giant lit lift panel + Steve), 1 = PEAK (row 6: CLOSE button pops off), 2 = PUNCH (row 8: doors open at G on the neighbours).
import { drawCharacter, paper, panel } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';

export const W = 1080, H = 1920, cv = document.getElementById("c"), ctx = cv.getContext("2d");
export const INK = '#2a2230', TITLE_Y = 232;
export const SKIN = '#e2ac84';
export const NOW = () => (typeof window !== 'undefined' && window.T_NOW !== undefined) ? window.T_NOW : 0.1;
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
export function title(T) {   // 1-2 lines inside the panel, top; clears y 170 (iPhone safe area)
  const L = Array.isArray(T) ? T : [T]; ctx.save(); ctx.font = '600 56px Fredoka';
  const w = Math.max(...L.map(l => ctx.measureText(l).width)) + 70, h = 104 + (L.length - 1) * 68, top = TITLE_Y - 52 + (L.length > 1 ? -4 : 0);
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, top, w, h, 52); ctx.fill();
  L.forEach((l, i) => text(l, 540, top + 55 + i * 68, 56, '#fff6dc')); ctx.restore();
}
export function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
export const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
export const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---------- props ----------
import { CAST } from './lib/cast_stick.js';
export function cloud(x, y, r, a = 0.9) {
  const parts = [[0, 0, r], [r * 0.9, r * 0.15, r * 0.75], [-r * 0.9, r * 0.2, r * 0.7], [r * 0.35, -r * 0.6, r * 0.7]].map(([dx, dy, rr]) => [x + dx, y + dy, rr]);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(42,34,48,0.55)'; ctx.lineWidth = 5;
  parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke(); });
  ctx.fillStyle = '#ffffff'; parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr - 2, 0, 7); ctx.fill(); });
  ctx.restore();
}
export const SK = '#e2ac84'; export const MUSTARD = (CAST.steve && CAST.steve.color) || '#e3a82b';
export const RED = '#c8312b';
export const armTube = (pts, w, col, seed = 31) => spen(NOW(), seed, 5).tube(pts, w, col);
export const NOARM = { hand: [0, 0], bend: [0, 0] };

export function liftWall(t, y0 = 0, y1 = H) {
  ctx.fillStyle = '#d6c9ad'; ctx.fillRect(0, y0, W, y1 - y0);
  const p = spen(t, 40, 5);
  for (let x = 0; x < W + 270; x += 270) { ctx.fillStyle = (Math.floor(x / 270) % 2) ? 'rgba(255,255,255,0.14)' : 'rgba(120,100,60,0.10)'; ctx.fillRect(x, y0, 270, y1 - y0); p.line([[x, y0], [x, y1]], 5, '#a89a78'); }
}
export function tie(X, Y, s, loose = false) {   // red tie on Steve's chest (local units)
  const p = lpen(X, Y, s, 77), rot = loose ? 14 : 0;
  ctx.save(); const c = p.T([0, 59]); ctx.translate(c[0], c[1]); ctx.rotate(rot * Math.PI / 180); ctx.translate(-c[0], -c[1] + (loose ? 6 * s : 0));
  const blade = loose ? [[-1.7, 56], [1.7, 56], [3, 46], [0, 41], [-3, 46]] : [[-1.7, 58], [1.7, 58], [3.2, 46], [0, 41], [-3.2, 46]];
  p.part(blade, RED, { shade: 0.2, lw: Math.max(4, s * 0.5) });
  p.part(roundPoly([[-2.6, 60.4], [2.6, 60.4], [2, 56.6], [-2, 56.6]], 1), '#a62620', { shade: false, lw: Math.max(4, s * 0.5) });
  ctx.restore();
  if (!loose) for (const sx of [-1, 1]) p.part([[sx * 1.2, 61.6], [sx * 5.6, 62.4], [sx * 3, 58.6]], '#ffffff', { shade: false, lw: Math.max(3.4, s * 0.4) });
}
export function steve(X, Y, s, pose, hairStage, bags, loose) {
  window.STEVE_SKIN = SK;
  drawCharacter(ctx, 'steve', X, Y, s, { hair: hairStage, bags, arm: 'down', armL: NOARM, armR: NOARM, noShadow: true, ...pose }, { frame: boilFrame(NOW()) });
  tie(X, Y, s, loose);
}
// ---- lift buttons ----
export function glyph(kind, x, y, r) {
  ctx.save(); ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineWidth = r * 0.12; ctx.lineJoin = 'round';
  const tri = (cx, dir) => { ctx.beginPath(); ctx.moveTo(cx - dir * r * 0.34, y - r * 0.34); ctx.lineTo(cx + dir * r * 0.04, y); ctx.lineTo(cx - dir * r * 0.34, y + r * 0.34); ctx.closePath(); ctx.fill(); };
  if (kind === 'open') { tri(x - r * 0.2, -1); tri(x + r * 0.2, 1); ctx.fillRect(x - r * 0.04, y - r * 0.4, r * 0.08, r * 0.8); }
  if (kind === 'close') { tri(x - r * 0.28, 1); tri(x + r * 0.28, -1); }
  if (kind === 'bell') { ctx.beginPath(); ctx.arc(x, y - r * 0.05, r * 0.38, Math.PI, 0); ctx.lineTo(x + r * 0.5, y + r * 0.3); ctx.lineTo(x - r * 0.5, y + r * 0.3); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(x, y + r * 0.45, r * 0.12, 0, 7); ctx.fill(); }
  ctx.restore();
}
export function lbtn(cx, cy, r, label, state = 'lit', seed = 1) {
  const p = spen(NOW(), seed, Math.max(4, r * 0.07));
  ctx.fillStyle = 'rgba(42,34,48,0.35)'; ctx.beginPath(); ctx.arc(cx + r * 0.06, cy + r * 0.08, r * 1.16, 0, 7); ctx.fill();
  ctx.fillStyle = '#7d8493'; ctx.beginPath(); ctx.arc(cx, cy, r * 1.14, 0, 7); ctx.fill(); p.outline(ellipsePts(cx, cy, r * 1.14, r * 1.14, 40), true, Math.max(4, r * 0.08));
  if (state === 'missing') { ctx.fillStyle = '#1a1620'; ctx.beginPath(); ctx.arc(cx, cy, r * 0.82, 0, 7); ctx.fill(); return; }
  ctx.fillStyle = state === 'lit' ? '#ffd45a' : '#4a4452'; ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, 7); ctx.fill();
  if (state === 'lit') { ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(cx - r * 0.1, cy - r * 0.12, r * 0.62, 0, 7); ctx.fill(); }
  p.outline(ellipsePts(cx, cy, r * 0.9, r * 0.9, 40), true, Math.max(3, r * 0.06));
  if (['open', 'close', 'bell'].includes(label)) glyph(label, cx, cy, r); else text(label, cx, cy + r * 0.04, label.length > 1 ? r * 0.98 : r * 1.12, INK, 'Fredoka');
}
export function glowOn(cx, cy, r, a = 0.55) { glowBlob(cx, cy, r * 2.1, `rgba(255,170,40,${a})`); }
export function plate(x0, y0, x1, y1) {
  const p = spen(NOW(), 55, 8);
  p.part(roundPoly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 36), '#b4bac6', { shade: 0.16, lw: 9 });
  ctx.fillStyle = '#8f95a3'; for (const [x, y] of [[x0 + 28, y0 + 28], [x1 - 28, y0 + 28], [x0 + 28, y1 - 28], [x1 - 28, y1 - 28]]) { ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill(); }
}
export function floorDisplay(x, y, w, h, num, arrow) {
  const p = spen(NOW(), 61, 6);
  p.part(roundPoly([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]], 14), '#1a1620', { shade: false, lw: 7 });
  text(num, x + (arrow ? 22 : 0), y + 4, h * 0.78, '#ff5a3a', 'Fredoka');
  if (arrow) { ctx.fillStyle = '#ff5a3a'; ctx.beginPath(); ctx.moveTo(x - w * 0.36, y - h * 0.16); ctx.lineTo(x - w * 0.14, y - h * 0.16); ctx.lineTo(x - w * 0.25, y + h * 0.2); ctx.closePath(); ctx.fill(); }
}
export function bag(x0, y0, x1, y1, squash = 0, seed = 5) {   // olive backpack; squash pushes a dent into the right edge
  const p = spen(NOW(), seed, 8), r = 70;
  const body = roundPoly([[x0, y0 + 30], [x1 - 60, y0], [x1 - squash * 0.3, y0 + (y1 - y0) * 0.25], [x1 + squash * 0.1, (y0 + y1) / 2], [x1 - squash * 0.3, y0 + (y1 - y0) * 0.75], [x1 - 40, y1 - 10], [x0 + 20, y1]], r, 8);
  p.part(body, '#6d8f58', { shade: 0.2, lw: 9 });
  const pk = roundPoly([[x0 + 60, y0 + (y1 - y0) * 0.5], [x1 - 160, y0 + (y1 - y0) * 0.5], [x1 - 150, y1 - 40], [x0 + 60, y1 - 30]], 40, 6);
  p.part(pk, '#587a46', { shade: 0.2, lw: 7 });
  p.line([[x0 + 80, y0 + (y1 - y0) * 0.62], [x1 - 180, y0 + (y1 - y0) * 0.62]], 6, '#2a2230');
  ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(x0 + 130, y0 + (y1 - y0) * 0.62, 14, 0, 7); ctx.fill();
  p.line([[x0 + 90, y0 + 70], [x1 - 140, y0 + 56]], 6, '#3f5a34');
}
export function neighbour(x, hy, r, skin, hair, shirt, kind, seed, look = 0) {
  const p = spen(NOW(), seed, 6);
  p.part(roundPoly([[x - r * 1.5, hy + r * 0.95], [x + r * 1.5, hy + r * 0.95], [x + r * 1.7, 1700], [x - r * 1.7, 1700]], r * 0.6), shirt, { shade: 0.15, lw: 7 });
  p.line([[x - r * 1.35, hy + r * 1.9], [x + r * 1.1, hy + r * 2.3]], r * 0.34, shirt === '#4a6a8a' ? '#3a5a7a' : '#3a3a4a'); p.line([[x + r * 1.35, hy + r * 1.9], [x - r * 1.1, hy + r * 2.3]], r * 0.34, shirt === '#4a6a8a' ? '#3a5a7a' : '#3a3a4a');
  const head = ellipsePts(x, hy, r, r * 1.06, 40);
  if (kind === 1) p.part(ellipsePts(x, hy - r * 0.55, r * 0.86, r * 0.6, 24), hair, { shade: false, lw: 6 });
  if (kind === 2) { p.part(ellipsePts(x, hy - r * 1.2, r * 0.5, r * 0.4, 20), hair, { shade: false, lw: 6 }); }
  p.part(head, skin, { shade: false, lw: 6 });
  if (kind === 1) p.part(roundPoly([[x - r, hy - r * 0.2], [x + r, hy - r * 0.2], [x + r * 0.8, hy - r * 0.9], [x, hy - r * 1.1], [x - r * 0.8, hy - r * 0.9]], r * 0.3), hair, { shade: false, lw: 6 });
  if (kind === 2) p.part(roundPoly([[x - r * 0.95, hy - r * 0.35], [x + r * 0.95, hy - r * 0.35], [x + r * 0.75, hy - r * 0.95], [x - r * 0.75, hy - r * 0.95]], r * 0.3), hair, { shade: false, lw: 6 });
  for (const sx of [-1, 1]) { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + sx * r * 0.38 + look * r * 0.2, hy + r * 0.05, r * 0.1, 0, 7); ctx.fill(); p.line([[x + sx * r * 0.7, hy - r * 0.32], [x + sx * r * 0.12, hy - r * 0.14]], 7); }
  p.line([[x - r * 0.4, hy + r * 0.6], [x, hy + r * 0.45], [x + r * 0.4, hy + r * 0.6]], 7);
}
