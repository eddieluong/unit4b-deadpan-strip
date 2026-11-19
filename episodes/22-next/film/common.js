// UNIT 4B · 21 "On Empty" (Tập 12) — 3 KEY STILLS, full-bleed 9:16 panel (title inside the panel, no captions). render(0|1|2).
import { drawCharacter, paper, panel } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';

export const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
export const INK = '#2a2230', TITLE_Y = 232;
export const ORANGE = '#ff8a1f', SKIN = '#e2ac84';
export const spen = (t, seed, lw = 3) => { const p = new VPen(ctx, 0, 0, 1, { lw, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
export function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
export const armTo = (X, shY, sc, hx, hy, bend) => ({ hand: [(hx - X) / sc, (shY - hy) / sc], bend });
export const headOf = (x, y, s) => [x, y - 80 * s, 15 * s];
export function title() {   // inside the panel, top; clears y 170 (iPhone safe area)
  const T = 'POV: your fuel light is on'; ctx.save(); ctx.font = '600 56px Fredoka'; const w = ctx.measureText(T).width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 52, w, 104, 52); ctx.fill();
  text(T, 540, TITLE_Y + 3, 56, '#fff6dc'); ctx.restore();
}
export function drop(p, x, y, sz, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 }); ctx.restore();
}
export function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
export function outline(fn, fill, lw = 6) { ctx.save(); ctx.fillStyle = fill; ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); fn(); ctx.fill(); if (lw > 0.2) ctx.stroke(); ctx.restore(); }
export function fist(x, y, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.ellipse(0, 0, 40, 36, 0, 0, 7); ctx.fill(); ctx.stroke();
  for (const fy of [-22, -7, 8, 23]) { ctx.beginPath(); ctx.roundRect(-22, fy - 7, 50, 14, 7); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
// Steve placement helpers (same as Tập 11)
export function placeSteve(hx, hy, sc, th) { return { X: hx - 42 * sc * Math.sin(th), Y: hy + 38 * sc + 42 * sc * Math.cos(th), sc, th }; }
export function neckOf(P) { const { X, Y, sc, th } = P; return [X + 27 * sc * Math.sin(th), Y - 38 * sc - 27 * sc * Math.cos(th)]; }
export function handLocal(P, T) {
  const { X, Y, sc, th } = P, px = X, py = Y - 38 * sc, vx = T[0] - px, vy = T[1] - py;
  const ux = vx * Math.cos(th) + vy * Math.sin(th), uy = -vx * Math.sin(th) + vy * Math.cos(th);
  const shY = Y - 60 * sc; return { hand: [ux / sc, (shY - (py + uy)) / sc], bend: [0, 4] };
}
// canvas point of a Steve-local point (lx, ly up) after the body lean about the hips
export function bodyPt(P, lx, ly) {
  const { X, Y, sc, th } = P, vx = lx * sc, vy = -(ly - 38) * sc;
  return [X + vx * Math.cos(th) - vy * Math.sin(th), Y - 38 * sc + vx * Math.sin(th) + vy * Math.cos(th)];
}
// opaque torso base: the hand-drawn fill slips off the ink at large scale, so lay a solid fill under the character first
export function torsoBase(P) {
  const pts = [[-6.5, 62], [6.5, 62], [8, 37], [-8, 37]].map(([a, b]) => bodyPt(P, a, b));
  ctx.save(); ctx.fillStyle = '#f2b632'; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill(); ctx.restore();
}
// soaked shirt: solid darker wet patches + drips on the torso, clipped to the torso
export function wetShirt(P, amt = 1) {
  const pts = [[-5.6, 61], [5.6, 61], [7, 38], [-7, 38]].map(([a, b]) => bodyPt(P, a, b));
  ctx.save(); ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
  ctx.fillStyle = '#d9a026';
  for (const [lx, ly, rx, ry] of [[-2, 52, 7, 9], [3, 44, 6, 7], [0, 60, 9, 4]]) { const c = bodyPt(P, lx, ly); ctx.beginPath(); ctx.ellipse(c[0], c[1], rx * P.sc * amt, ry * P.sc * amt, P.th, 0, 7); ctx.fill(); }
  ctx.restore();
}

// ---------- Steve's open-face helmet (visor up). Drawn over the head; the face stays free. hc = head centre, u = head radius / 15 ----------
export function helmet(hc, u, rot = 0) {
  ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(rot); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // chin straps (behind the dome), hugging the face edge
  ctx.strokeStyle = INK; ctx.lineWidth = 1.7 * u + 3;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 15.6 * u, 1 * u); ctx.quadraticCurveTo(sx * 15.4 * u, 9 * u, sx * 10.5 * u, 14.6 * u); ctx.stroke(); }
  ctx.strokeStyle = '#3b3346'; ctx.lineWidth = 1.7 * u;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 15.6 * u, 1 * u); ctx.quadraticCurveTo(sx * 15.4 * u, 9 * u, sx * 10.5 * u, 14.6 * u); ctx.stroke(); }
  ctx.fillStyle = '#e8c84a'; ctx.beginPath(); ctx.roundRect(-3.4 * u, 14.2 * u, 6.8 * u, 3.2 * u, 0.8 * u); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();  // buckle
  ctx.strokeStyle = '#3b3346'; ctx.lineWidth = 1.5 * u; ctx.beginPath(); ctx.moveTo(-10.5 * u, 14.7 * u); ctx.lineTo(-3.4 * u, 15.6 * u); ctx.moveTo(3.4 * u, 15.6 * u); ctx.lineTo(10.5 * u, 14.7 * u); ctx.stroke();
  // dome (open face: the brim sits above the brows)
  const dome = () => { ctx.beginPath(); ctx.moveTo(-18 * u, 2 * u); ctx.bezierCurveTo(-21 * u, -14 * u, -10 * u, -23 * u, 0, -23 * u); ctx.bezierCurveTo(10 * u, -23 * u, 21 * u, -14 * u, 18 * u, 2 * u);
    ctx.quadraticCurveTo(0, -17 * u, -18 * u, 2 * u); ctx.closePath(); };
  ctx.fillStyle = '#f4efe4'; dome(); ctx.fill();
  ctx.save(); dome(); ctx.clip(); ctx.fillStyle = '#d9423e'; ctx.fillRect(-2.4 * u, -30 * u, 4.8 * u, 30 * u);
  ctx.fillStyle = 'rgba(42,34,48,0.14)'; ctx.beginPath(); ctx.ellipse(-13 * u, -2 * u, 5 * u, 12 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.ellipse(-8 * u, -16 * u, 3.4 * u, 1.6 * u, -0.6, 0, 7); ctx.fill(); ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 6; dome(); ctx.stroke();
  // visor flipped up: a smoky-blue lens sitting on the front of the dome
  ctx.fillStyle = 'rgba(150,205,235,0.88)'; ctx.beginPath(); ctx.moveTo(-14.5 * u, -9.5 * u); ctx.bezierCurveTo(-13 * u, -22.5 * u, 13 * u, -22.5 * u, 14.5 * u, -9.5 * u);
  ctx.quadraticCurveTo(0, -15.5 * u, -14.5 * u, -9.5 * u); ctx.closePath(); ctx.fill(); ctx.lineWidth = 5; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 0.9 * u; ctx.beginPath(); ctx.moveTo(-9 * u, -15.6 * u); ctx.lineTo(-5 * u, -18.2 * u); ctx.stroke();
  for (const sx of [-1, 1]) { ctx.fillStyle = '#8b8795'; ctx.beginPath(); ctx.arc(sx * 15.2 * u, -8.6 * u, 1.3 * u, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); }   // visor hinge screws
  ctx.restore();
}

// ---------- fuel gauge (front view): bezel, dial with E ... F, needle, orange pump icon ----------
export function pumpIcon(x, y, k, color = ORANGE, glow = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (glow) { ctx.restore(); glowBlob(x, y, 300 * k, 'rgba(255,150,40,0.85)'); ctx.save(); ctx.translate(x, y); ctx.scale(k, k); }
  ctx.fillStyle = color; ctx.strokeStyle = INK; ctx.lineWidth = 6 / Math.max(k, 0.6); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.roundRect(-70, -90, 100, 180, 14); ctx.fill(); ctx.stroke();                              // body
  ctx.beginPath(); ctx.roundRect(-96, 76, 152, 26, 8); ctx.fill(); ctx.stroke();                                // base
  ctx.fillStyle = '#2a2230'; ctx.beginPath(); ctx.roundRect(-54, -74, 68, 56, 8); ctx.fill();                   // window
  ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineWidth = 15;                                           // hose + nozzle
  ctx.beginPath(); ctx.moveTo(30, -70); ctx.lineTo(62, -70); ctx.lineTo(80, -40); ctx.lineTo(80, 36); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(30, -78); ctx.lineTo(66, -78); ctx.lineTo(90, -38); ctx.lineTo(90, 40); ctx.stroke();
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(60, 24, 34, 30, 8); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
  ctx.restore();
}
export function gauge(cx, cy, R, needle, shake = 0, icon = true) {
  // bezel
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 16;
  outline(() => { ctx.arc(cx, cy, R, 0, 7); }, '#33333f', 8); ctx.restore();
  outline(() => { ctx.arc(cx, cy, R - 28, 0, 7); }, '#1d1c2b', 6);
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R - 12, 3.5, 4.4); ctx.stroke(); ctx.restore();
  const A0 = Math.PI * 1.1, A1 = Math.PI * 1.9, px = cx, py = cy + R * 0.18, rr = R * 0.72;   // sweep E (left) to F (right) over the top
  // red zone near E, ticks
  ctx.save(); ctx.lineCap = 'butt'; ctx.lineWidth = R * 0.075; ctx.strokeStyle = '#e8262f'; ctx.beginPath(); ctx.arc(px, py, rr, A0, A0 + (A1 - A0) * 0.17); ctx.stroke();
  ctx.strokeStyle = '#fff6dc'; ctx.lineWidth = Math.max(4, R * 0.016); ctx.lineCap = 'round';
  for (let i = 0; i <= 8; i++) { const a = A0 + (A1 - A0) * i / 8, r0 = rr - R * 0.06, r1 = rr + (i % 2 ? R * 0.05 : R * 0.09); ctx.beginPath(); ctx.moveTo(px + Math.cos(a) * r0, py + Math.sin(a) * r0); ctx.lineTo(px + Math.cos(a) * r1, py + Math.sin(a) * r1); ctx.stroke(); }
  ctx.restore();
  const eA = A0, fA = A1, lr = rr + R * 0.2;
  glowBlob(px + Math.cos(eA) * lr - R * 0.06, py + Math.sin(eA) * lr + R * 0.12, R * 0.4, 'rgba(255,60,60,0.55)'); text('E', px + Math.cos(eA) * lr - R * 0.06, py + Math.sin(eA) * lr + R * 0.12, R * 0.46, '#ff5148');
  text('F', px + Math.cos(fA) * lr - R * 0.02, py + Math.sin(fA) * lr + R * 0.06, R * 0.42, '#fff6dc');
  if (icon) { ctx.save(); ctx.strokeStyle = 'rgba(255,170,60,0.75)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (const [rad, a] of [[R * 0.3, 0.9], [R * 0.4, 0.55]]) { ctx.globalAlpha = a; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(px, py + R * 0.46, rad, sx > 0 ? -0.5 : Math.PI - 0.5 + 0.0, sx > 0 ? 0.5 : Math.PI + 0.5); ctx.stroke(); } } ctx.restore(); pumpIcon(px, py + R * 0.46, R / 400); }
  // needle
  const a = A0 + (A1 - A0) * needle + shake, nl = rr * 1.02;
  ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = '#fff6dc'; ctx.strokeStyle = INK; ctx.lineWidth = Math.max(4, R * 0.018);
  ctx.beginPath(); ctx.moveTo(-R * 0.1, -R * 0.03); ctx.lineTo(nl, -R * 0.012); ctx.lineTo(nl, R * 0.012); ctx.lineTo(-R * 0.1, R * 0.03); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff3b30'; ctx.beginPath(); ctx.moveTo(nl * 0.62, -R * 0.016); ctx.lineTo(nl, -R * 0.012); ctx.lineTo(nl, R * 0.012); ctx.lineTo(nl * 0.62, R * 0.016); ctx.closePath(); ctx.fill(); ctx.restore();
  outline(() => { ctx.arc(px, py, R * 0.07, 0, 7); }, '#5a5a6a', 5);
}

// ---------- scooter, side view, faces LEFT. (x,y) = ground under the middle, k = scale ----------
export function scooter(t, x, y, k, o = {}) {
  const BODY = '#6fa7d6', DARK = '#2a2230';
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); const p = spen(t, 71, 6);
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(0, 4, 470, 26, 0, 0, 7); ctx.fill();
  const wheel = wx => { p.part(ellipsePts(wx, -100, 100, 100, 36), DARK, { shade: false, lw: 6 }); p.part(ellipsePts(wx, -100, 58, 58, 28), '#d5d9e0', { shade: false, lw: 5 }); p.part(ellipsePts(wx, -100, 16, 16, 12), '#8b8795', { shade: false, lw: 4 });
    for (let i = 0; i < 5; i++) { const a = i * 1.2566 + (o.spin || 0); ctx.strokeStyle = '#8b8795'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(wx, -100); ctx.lineTo(wx + Math.cos(a) * 52, -100 + Math.sin(a) * 52); ctx.stroke(); } };
  wheel(330); wheel(-330);
  // rear cowling + underseat body
  p.part(roundPoly([[-30, -150], [230, -150], [340, -190], [372, -290], [346, -350], [-20, -345]], 24), BODY, { shade: 0.14, lw: 6 });
  p.part(roundPoly([[250, -250], [352, -250], [362, -300], [262, -300]], 8), '#e8262f', { shade: false, lw: 5 });   // tail lamp
  p.part([[ -30, -230], [250, -224]], null, { shade: false, lw: 4 });
  // seat (hinged at the front; o.seat = opening angle, radians)
  ctx.save(); ctx.translate(-26, -346); ctx.rotate(-(o.seat || 0));
  if (o.seat) { ctx.save(); ctx.restore(); }
  p.part(roundPoly([[4, 0], [346, 0], [352, -40], [300, -52], [10, -50]], 12), '#5a3b2e', { shade: 0.12, lw: 6 });
  ctx.restore();
  if (o.seat) {   // under-seat compartment: dark mouth, tank neck full to the brim
    p.part(roundPoly([[-10, -330], [330, -332], [320, -352], [-6, -352]], 4), DARK, { shade: false, lw: 5 });
    p.part(ellipsePts(120, -350, 100, 24, 24), '#f2b632', { shade: false, lw: 5 });
    p.part(ellipsePts(120, -354, 80, 14, 24), '#ffd980', { shade: false, lw: 3 });
  }
  // floorboard + leg shield + fender
  p.part(roundPoly([[-260, -150], [-20, -150], [-20, -215], [-260, -215]], 10), BODY, { shade: 0.14, lw: 6 });
  p.part(roundPoly([[-215, -120], [-120, -120], [-120, -152], [-215, -152]], 6), '#cfd3da', { shade: false, lw: 5 });   // footboard rail
  p.part(roundPoly([[-390, -170], [-250, -170], [-215, -480], [-300, -500]], 18), BODY, { shade: 0.14, lw: 6 });
  p.part(roundPoly([[-420, -150], [-250, -150], [-250, -190], [-410, -195]], 14), BODY, { shade: 0.14, lw: 6 });   // front fender
  p.line([[-330, -100], [-292, -440]], 14, DARK);
  // dash cowl + handlebar + headlamp
  p.part(roundPoly([[-330, -490], [-190, -480], [-178, -575], [-250, -625], [-322, -590]], 26), BODY, { shade: 0.14, lw: 6 });
  p.part(ellipsePts(-326, -548, 26, 34, 22), '#fff3b0', { shade: false, lw: 5 });
  p.line([[-225, -600], [-150, -625]], 14, DARK); p.part(roundPoly([[-170, -640], [-120, -628], [-122, -602], [-172, -610]], 8), DARK, { shade: false, lw: 4 });
  p.line([[-245, -690], [-205, -632]], 9, DARK); p.part(ellipsePts(-240, -690, 22, 11, 16), DARK, { shade: false, lw: 4 });   // mirror stem
  if (o.gauge) {   // dash gauge angled toward us, needle on F
    ctx.save(); ctx.translate(-225, -545); ctx.scale(0.6, 1);
    p.part(ellipsePts(0, 0, 56, 56, 32), '#33333f', { shade: false, lw: 5 }); p.part(ellipsePts(0, 0, 44, 44, 32), '#faf3df', { shade: false, lw: 3 });
    ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-4, 10); ctx.lineTo(34, -24); ctx.stroke();
    ctx.fillStyle = '#e8262f'; ctx.font = '600 22px Fredoka'; ctx.textAlign = 'center'; ctx.fillText('F', 30, -26 + 0); ctx.restore();
  }
  if (o.rider) o.rider();
  // front basket with Snuggles
  const bx0 = -500, bx1 = -320, by0 = -345, by1 = -215;
  p.line([[bx1 - 40, by1 - 8], [-285, -300]], 12, '#6b6f7a'); p.line([[bx1 - 6, by0 + 50], [-292, -400]], 10, '#6b6f7a');   // bracket clamps the basket to the steering column
  if (o.snug) {
    drawCharacter(ctx, 'snuggles', (bx0 + bx1) / 2 - 4, by1 + 8, 5.6, o.snug, { frame: boilFrame(t) });
  }
  p.part(roundPoly([[bx0, by0 + 40], [bx1, by0 + 40], [bx1 - 14, by1], [bx0 + 14, by1]], 10), '#b98a52', { shade: 0.12, lw: 6 });
  ctx.save(); ctx.strokeStyle = 'rgba(42,34,48,0.5)'; ctx.lineWidth = 4;
  for (let i = 1; i < 5; i++) { const xx = bx0 + (bx1 - bx0) * i / 5; ctx.beginPath(); ctx.moveTo(xx, by0 + 44); ctx.lineTo(xx + (i - 2.5) * -3, by1 - 4); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(bx0 + 4, (by0 + by1) / 2 + 20); ctx.lineTo(bx1 - 4, (by0 + by1) / 2 + 20); ctx.stroke(); ctx.restore();
  p.part(roundPoly([[bx0 - 6, by0 + 40], [bx1 + 6, by0 + 40], [bx1 + 6, by0 + 54], [bx0 - 6, by0 + 54]], 6), '#8f6234', { shade: false, lw: 5 });   // rim
  ctx.restore();
}

// ---------- generic fuel pump (no brand). (x, y) = top-left, w x h ----------
export function pump(t, x, y, w, h, digits, o = {}) {
  const p = spen(t, 91, 5), by = y + h;
  p.part(roundPoly([[x - 30, by], [x + w + 30, by], [x + w + 30, by - 44], [x - 30, by - 44]], 8), '#8e929c', { shade: 0.15, lw: 6 });
  p.part(roundPoly([[x, by - 40], [x + w, by - 40], [x + w, y + 10], [x, y + 10]], 16), '#eef1f5', { shade: 0.1, lw: 7 });
  p.part(roundPoly([[x - 12, y + 6], [x + w + 12, y + 6], [x + w + 12, y + 0.14 * h], [x - 12, y + 0.14 * h]], 12), ORANGE, { shade: 0.12, lw: 7 });
  // display window
  const dy = y + 0.17 * h, dh = 0.17 * h;
  p.part(roundPoly([[x + 26, dy], [x + w - 26, dy], [x + w - 26, dy + dh], [x + 26, dy + dh]], 10), '#1b2a22', { shade: false, lw: 6 });
  glowBlob(x + w / 2, dy + dh / 2, w * 0.7, 'rgba(120,255,150,0.28)');
  ctx.save(); ctx.font = `600 ${Math.min(dh * 0.86, (w - 80) / 2.6)}px Fredoka`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(125,255,154,0.10)'; ctx.fillText('8.88', x + w - 44, dy + dh * 0.52);
  ctx.shadowColor = '#7dff9a'; ctx.shadowBlur = 24; ctx.fillStyle = '#9bffb4'; ctx.fillText(digits, x + w - 44, dy + dh * 0.52); ctx.restore();
  // lower panel + buttons
  p.part(roundPoly([[x + 26, dy + dh + 40], [x + w - 26, dy + dh + 40], [x + w - 26, dy + dh + 40 + 0.12 * h], [x + 26, dy + dh + 40 + 0.12 * h]], 8), '#c9ced6', { shade: 0.1, lw: 5 });
  for (let i = 0; i < 3; i++) p.part(ellipsePts(x + w * (0.3 + 0.2 * i), dy + dh + 40 + 0.06 * h, 16, 16, 14), i === 1 ? ORANGE : '#6b6f7a', { shade: false, lw: 4 });
  // nozzle holster on the right side + hose looping down
  p.part(roundPoly([[x + w - 4, y + 0.55 * h], [x + w + 62, y + 0.55 * h], [x + w + 62, y + 0.7 * h], [x + w - 4, y + 0.7 * h]], 10), '#6b6f7a', { shade: 0.1, lw: 6 });
  p.part(roundPoly([[x + w + 4, y + 0.5 * h], [x + w + 120, y + 0.52 * h], [x + w + 122, y + 0.545 * h], [x + w + 4, y + 0.53 * h]], 8), '#2a2230', { shade: false, lw: 5 });
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + w + 100, y + 0.53 * h); ctx.bezierCurveTo(x + w + 190, y + 0.65 * h, x + w + 120, y + 0.88 * h, x + w - 10, y + 0.82 * h); ctx.stroke();
  ctx.strokeStyle = '#4b4f5b'; ctx.lineWidth = 10; ctx.stroke(); ctx.restore();
}

// forecourt backdrop: sky, canopy, ground
export function forecourt(t, hz) {
  const g = ctx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#8fc9e6'); g.addColorStop(1, '#f7e6c0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const p = spen(t, 3, 5);
  // far hills / generic low buildings
  p.part(roundPoly([[-20, hz], [-20, hz - 120], [160, hz - 150], [330, hz - 90], [520, hz - 170], [760, hz - 100], [1100, hz - 160], [1100, hz]], 20), '#a8c4a0', { shade: false, lw: 4 });
  // canopy
  p.part([[-20, 296], [1100, 296], [1100, 392], [-20, 392]], '#e9edf2', { shade: 0.1, lw: 6 });
  p.part([[-20, 392], [1100, 392], [1100, 430], [-20, 430]], ORANGE, { shade: 0.15, lw: 6 });
  for (let i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(255,255,230,0.85)'; ctx.beginPath(); ctx.roundRect(60 + i * 260, 440, 150, 16, 8); ctx.fill(); }
  p.part(roundPoly([[-20, hz], [1100, hz], [1100, 1950], [-20, 1950]], 2), '#b9b4aa', { shade: 0.1, lw: 5 });
  ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 6; i++) ctx.fillRect(40 + i * 190, hz + 140, 110, 12); ctx.restore();
}

// generic attendant: nameless adult in a plain cap and plain uniform. (x, y) = feet, s = unit
export function attendant(t, x, y, s, o = {}) {
  const p = spen(t, 55, 5), SK = '#a8714a', UNI = '#7e8794', CAP = '#3f5a78';
  const armsOnly = o.part === 'arms';
  if (!armsOnly) {
  ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.beginPath(); ctx.ellipse(x, y + 4, 22 * s, 4 * s, 0, 0, 7); ctx.fill();
  p.part(roundPoly([[x - 10 * s, y], [x - 3 * s, y], [x - 4 * s, y - 40 * s], [x - 12 * s, y - 40 * s]], 2), '#2f3340', { shade: 0.1, lw: 5 });
  p.part(roundPoly([[x + 3 * s, y], [x + 10 * s, y], [x + 12 * s, y - 40 * s], [x + 4 * s, y - 40 * s]], 2), '#2f3340', { shade: 0.1, lw: 5 });
  p.part(roundPoly([[x - 17 * s, y - 38 * s], [x + 17 * s, y - 38 * s], [x + 15 * s, y - 80 * s], [x - 15 * s, y - 80 * s]], 6), UNI, { shade: 0.15, lw: 6 });   // plain shirt
  p.part(roundPoly([[x - 15 * s, y - 80 * s], [x - 2 * s, y - 80 * s], [x, y - 73 * s], [x + 2 * s, y - 80 * s], [x + 15 * s, y - 80 * s], [x + 6 * s, y - 84 * s], [x - 6 * s, y - 84 * s]], 1.5), '#a3acb8', { shade: false, lw: 4 });   // collar
  }
  const hnd = o.hand || [x + 30 * s, y - 50 * s];
  if (o.part === 'arms') {
  p.line([[x - 14 * s, y - 76 * s], [x - 20 * s, y - 62 * s], [hnd[0] - 2 * s, hnd[1]]], 15, UNI);
  p.line([[x + 14 * s, y - 76 * s], [x + 22 * s, y - 62 * s], [hnd[0] + 3 * s, hnd[1] + 4 * s]], 15, UNI);
  p.dot(hnd[0] - 2 * s, hnd[1], 6.5 * s, 5 * s, SK); p.dot(hnd[0] + 3 * s, hnd[1] + 4 * s, 6.5 * s, 5 * s, SK);
  return; }
  // head
  const hx = x + (o.dx || 0), hy = y - 98 * s;
  p.part(ellipsePts(hx, hy, 13 * s, 14 * s, 36), SK, { shade: 0.14, lw: 6 });
  p.part(roundPoly([[hx - 14 * s, hy - 4 * s], [hx + 14 * s, hy - 4 * s], [hx + 12 * s, hy - 15 * s], [hx, hy - 20 * s], [hx - 12 * s, hy - 15 * s]], 5), CAP, { shade: 0.15, lw: 6 });   // cap
  p.part(roundPoly([[hx - 14 * s, hy - 4 * s], [hx + 24 * s, hy - 3 * s], [hx + 24 * s, hy + 1 * s], [hx - 14 * s, hy]], 3), '#2f4660', { shade: false, lw: 5 });   // bill
  for (const sx of [-1, 1]) p.dot(hx + sx * 5 * s + 2 * s, hy + 5 * s, 1.5 * s, 2 * s, INK);
  p.line([[hx - 3 * s, hy + 11 * s], [hx + 6 * s, hy + 11 * s]], 5, INK);
}

// fuel nozzle held in the attendant's hand (hx, hy), spout pointing down-left into the tank neck, short hose looping to the pump
export function nozzle(t, hx, hy) {
  const p = spen(t, 77, 5);
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx + 18, hy - 46); ctx.bezierCurveTo(hx + 80, hy - 90, hx + 90, hy - 200, hx + 40, hy - 260); ctx.stroke();
  ctx.strokeStyle = '#4b4f5b'; ctx.lineWidth = 17; ctx.stroke(); ctx.restore();   // hose up toward the pump (right of frame)
  p.part(roundPoly([[hx - 48, hy + 64], [hx - 44, hy + 20], [hx - 70, hy + 4], [hx - 66, hy - 4], [hx - 26, hy - 34], [hx + 40, hy - 52], [hx + 52, hy - 26], [hx + 28, hy - 8], [hx + 6, hy + 4], [hx + 4, hy + 62]], 8), '#d9423e', { shade: false, lw: 5 });   // body: grip + head
  p.part(roundPoly([[hx - 66, hy + 4], [hx - 96, hy + 72], [hx - 108, hy + 134], [hx - 98, hy + 138], [hx - 84, hy + 74], [hx - 52, hy + 12]], 4), '#c3c8d0', { shade: false, lw: 4 });   // spout
  p.part(roundPoly([[hx - 28, hy + 14], [hx - 6, hy + 14], [hx - 12, hy + 56], [hx - 28, hy + 58]], 4), '#2a2230', { shade: false, lw: 4 });   // trigger
}
