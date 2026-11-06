// UNIT 4B · 16 thumbnails (1080x1920, 9:16). render(0|1|2) = option A|B|C. Standalone: does not touch scene.js.
import { drawCharacter, paper, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';
const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d'), INK = '#2a2230';
const spen = (t, seed) => { const p = new VPen(ctx, 0, 0, 1, { lw: 3.4, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
const armTo = (X, shY, sc, hx, hy, bend = [0, -4]) => ({ hand: [(hx - X) / sc, (shY - hy) / sc], bend });
const headC = (x, y, s) => [x, y - 80 * s, 15 * s];
function hand(text, x, y, size, rot = 0, color = INK) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px Fredoka`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore(); }
function big(text, x, y, size, rot = 0, fill = '#fff') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.26; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 6); ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0); ctx.restore();
}
function frosting(t, hc) {
  const Fr = spen(t, 77), [hx, hy, hr] = hc, k = hr / 159;
  for (const [dx, dy, rx, ry] of [[-0.62, 0.7, 24, 14], [0.0, 0.92, 38, 16], [-0.15, -0.72, 34, 16]]) Fr.part(ellipsePts(hx + dx * hr, hy + dy * hr, rx * k, ry * k, 16), '#fffefc', { shade: 0.06, lw: 3.5 });
  for (const [dx, dy, len] of [[-0.15, -0.65, 44], [-0.15, 0.95, 46]]) Fr.part(roundPoly([[hx + dx * hr - 9 * k, hy + dy * hr], [hx + dx * hr + 9 * k, hy + dy * hr], [hx + dx * hr + 8 * k, hy + dy * hr + len * k], [hx + dx * hr - 8 * k, hy + dy * hr + len * k]], 8), '#fffefc', { shade: 0.06, lw: 3.5 });
  for (const [dx, dy] of [[0.25, 0.3], [-0.3, 0.2], [0.7, 0.2], [0.1, 0.75]]) Fr.dot(hx + dx * hr, hy + dy * hr, 6 * k, 5 * k, '#7a4a2a');
}
function plainBg(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function box(t, x0, y0, x1, y1, lbl, size, plant = true) {
  const B = spen(t, 66), w = x1 - x0;
  if (plant) {
    B.part(roundPoly([[x0 + w * .05, y0 - 10], [x0 + w * .25, y0 - 10], [x0 + w * .21, y0 + 50], [x0 + w * .09, y0 + 50]], 4), '#b5673a', { shade: 0.12, lw: 4 });
    B.line([[x0 + w * .15, y0 - 8], [x0 + w * .16, y0 - 170], [x0 + w * .38, y0 - 140], [x0 + w * .5, y0 - 70]], 9, '#7a5a38');
    B.line([[x0 + w * .15, y0 - 8], [x0 + w * .05, y0 - 110], [x0 - w * .12, y0 - 80], [x0 - w * .17, y0 - 10]], 9, '#7a5a38');
    B.part(ellipsePts(x0 + w * .5, y0 - 68, 24, 13, 10), '#a88a52', { shade: false, lw: 3 }); B.part(ellipsePts(x0 - w * .17, y0 - 8, 24, 13, 10), '#a88a52', { shade: false, lw: 3 });
    B.part(roundPoly([[x0 + w * .62, y0 - 60], [x0 + w * .8, y0 - 60], [x0 + w * .8, y0 + 24], [x0 + w * .62, y0 + 24]], 6), '#d9382c', { shade: 0.1, lw: 4 });
  }
  B.part(roundPoly([[x0, y0], [x1, y0], [x1 - w * .06, y1], [x0 + w * .06, y1]], 12), '#c9a46a', { shade: 0.14, lw: 7 });
  B.part(roundPoly([[x0 + w * .3, y0 + 50], [x1 - w * .3, y0 + 50], [x1 - w * .32, y0 + 120], [x0 + w * .32, y0 + 120]], 6), '#e9d8b4', { shade: 0.08, lw: 4 });
  hand('DESK', (x0 + x1) / 2, (y0 + y1) / 2 + 60, size, 0, INK);
}
function tub(t, cx, cy, sc, rot) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sc, sc);
  const T = spen(t, 55);
  T.part(roundPoly([[-370, -230], [370, -230], [370, 230], [-370, 230]], 120), '#2fa6c8', { shade: 0.16, lw: 7 });
  T.part(roundPoly([[-370, -230], [370, -230], [370, -130], [-370, -130]], 50), '#f2f6fa', { shade: 0.1, lw: 6 });
  for (const [jx, jy] of [[-250, -20], [-110, 30], [30, -20], [170, 30], [300, -20], [-180, 140], [-30, 160], [110, 140], [250, 160]]) T.part(ellipsePts(jx, jy, 22, 22, 16), '#1d7f9c', { shade: false, lw: 4 });
  T.part(roundPoly([[-150, -100], [160, -100], [160, -30], [-150, -30]], 10), '#fff1a8', { shade: 0.08, lw: 4 }); hand('HOT TUB $8,400', 5, -64, 40, 0, INK);
  ctx.restore();
}

// ---- A: 2 A.M. phone light ----
function optA(t) {
  plainBg('#141a3c', '#0c1030');
  const p = spen(t, 3);
  ctx.fillStyle = '#f4efd0'; ctx.beginPath(); ctx.arc(870, 190, 60, 0, 7); ctx.fill(); ctx.fillStyle = '#141a3c'; ctx.beginPath(); ctx.arc(895, 175, 54, 0, 7); ctx.fill();
  [[120, 150, 6], [330, 110, 5], [600, 80, 6], [210, 330, 5], [760, 330, 6], [980, 420, 5]].forEach(([x, y, r]) => { ctx.fillStyle = '#e8ecff'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); });
  const s = 13.5, X = 420, hcY = 980, Y = hcY + 80 * s, shY = Y - 60 * s;
  const pcx = 745, pcy = 1530, pw = 430, ph = 700;
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'dead_inside', eyes: 'pinpoint', brow: 'worried', mouth: 'line', fx: [], look: 0.9, hair: 0, bags: 1,
    armL: armTo(X, shY, s, pcx - pw / 2 - 5, pcy + 150, [0, -4]), armR: armTo(X, shY, s, pcx + pw / 2 + 5, pcy + 200, [0, -5]) }, { frame: boilFrame(t) });
  const hc = headC(X, Y, s);
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  const fg = ctx.createRadialGradient(hc[0] + 150, hc[1] + 120, 20, hc[0] + 80, hc[1] + 40, 420); fg.addColorStop(0, 'rgba(110,190,255,0.6)'); fg.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 8, 0, 7); ctx.clip(); ctx.fillStyle = fg; ctx.fillRect(hc[0] - 500, hc[1] - 500, 1000, 1000); ctx.restore();
  ctx.save(); ctx.translate(pcx, pcy); ctx.rotate(-0.05);
  const gl = ctx.createRadialGradient(0, 0, 60, 0, 0, 760); gl.addColorStop(0, 'rgba(120,200,255,0.45)'); gl.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = gl; ctx.fillRect(-900, -900, 1800, 1800);
  const q = spen(t, 9);
  q.part(roundPoly([[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [pw / 2, ph / 2], [-pw / 2, ph / 2]], 44), '#1a1e32', { shade: false, lw: 7 });
  q.part(roundPoly([[-pw / 2 + 20, -ph / 2 + 26], [pw / 2 - 20, -ph / 2 + 26], [pw / 2 - 20, ph / 2 - 26], [-pw / 2 + 20, ph / 2 - 26]], 24), '#e8f4ff', { shade: false, lw: 2 });
  q.part(roundPoly([[-pw / 2 + 20, -ph / 2 + 26], [pw / 2 - 20, -ph / 2 + 26], [pw / 2 - 20, -ph / 2 + 116], [-pw / 2 + 20, -ph / 2 + 116]], 14), '#d9382c', { shade: false, lw: 2 });
  hand('BREAKING', 0, -ph / 2 + 72, 50, 0, '#fff');
  hand('WORLD', 0, -110, 110, 0, INK); hand('WAR 3?', 0, 30, 110, 0, '#d9382c'); hand('ANY DAY', 0, 160, 70, 0, INK);
  ctx.restore();
  big('NOTHING', 540, 330, 190, -0.03, '#ffd84a'); big('MATTERS', 540, 520, 190, -0.03, '#fff');
  hand('2:00 AM', 190, 1760, 80, 0, '#ff5a4a');
}

// ---- B: morning after ----
function optB(t) {
  plainBg('#f0e6cc', '#d9cba8');
  const p = spen(t, 3);
  for (let x = 40; x < W; x += 110) p.line([[x, 0], [x, 1700]], 2, 'rgba(150,130,100,0.25)');
  const fx0 = 560, fx1 = 1040, ftop = 620;
  p.part(roundPoly([[fx0, ftop], [fx1, ftop], [fx1, 1700], [fx0, 1700]], 4), '#c9eaff', { shade: false, lw: 7 });
  tub(t, 800, 1180, 1.05, -0.4);
  const F = spen(t, 56);
  F.part(roundPoly([[fx0 - 40, ftop - 40], [fx0 + 10, ftop - 40], [fx0 + 10, 1700], [fx0 - 40, 1700]], 4), '#8a5a3a', { shade: 0.14, lw: 7 });
  F.part(roundPoly([[fx1 - 10, ftop - 40], [fx1 + 40, ftop - 40], [fx1 + 40, 1700], [fx1 - 10, 1700]], 4), '#8a5a3a', { shade: 0.14, lw: 7 });
  F.part(roundPoly([[fx0 - 40, ftop - 50], [fx1 + 40, ftop - 50], [fx1 + 40, ftop + 8], [fx0 - 40, ftop + 8]], 4), '#8a5a3a', { shade: 0.14, lw: 7 });
  ctx.fillStyle = '#a89a80'; ctx.fillRect(0, 1700, W, 220); p.line([[0, 1700], [W, 1700]], 5);
  const s = 12.5, X = 330, hcY = 1050, Y = hcY + 80 * s, shY = Y - 60 * s;
  const bx0 = 90, bx1 = 590, by0 = 1450, by1 = 1800;
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'dead_inside', mouth: 'line', fx: ['gloom'], look: 0.3, hair: 0, bags: 1,
    armL: armTo(X, shY, s, bx0 + 10, 1560, [-3, -2]), armR: armTo(X, shY, s, bx1 - 10, 1560, [3, -2]) }, { frame: boilFrame(t) });
  frosting(t, headC(X, Y, s));
  box(t, bx0, by0, bx1, by1, 'DESK', 84);
  big("WORLD DIDN'T", 540, 190, 132, -0.03, '#fff'); big('END', 540, 370, 190, -0.03, '#ffd84a');
}

// ---- C: split ----
function optC(t) {
  const s = 9.2, ph = 0;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 540, H); ctx.clip();
  plainBg('#141a3c', '#0c1030');
  [[80, 120, 5], [300, 90, 6], [470, 200, 5], [150, 330, 5]].forEach(([x, y, r]) => { ctx.fillStyle = '#e8ecff'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); });
  const X = 270, hcY = 960, Y = hcY + 80 * s, shY = Y - 60 * s;
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'happy', mouth: 'grin', fx: [], look: 0, hair: 1, bags: 1,
    armL: armTo(X, shY, s, -10, shY - 330, [-3, -4]), armR: armTo(X, shY, s, 550, shY - 330, [3, -4]) }, { frame: boilFrame(t) });
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(540, 0, 540, H); ctx.clip();
  plainBg('#f0e6cc', '#d9cba8');
  const X2 = 810, Y2 = hcY + 80 * s, shY2 = Y2 - 60 * s, bx0 = 600, bx1 = 1010, by0 = 1420, by1 = 1760;
  drawCharacter(ctx, 'steve', X2, Y2, s, { expr: 'dead_inside', mouth: 'line', fx: ['gloom'], look: 0.3, hair: 0, bags: 1,
    armL: armTo(X2, shY2, s, bx0 + 10, 1520, [-3, -2]), armR: armTo(X2, shY2, s, bx1 - 10, 1520, [3, -2]) }, { frame: boilFrame(t) });
  frosting(t, headC(X2, Y2, s));
  box(t, bx0, by0, bx1, by1, 'DESK', 64, false);
  ctx.restore();
  const D = spen(t, 5); D.line([[540, 0], [540, H]], 10, INK);
  big('NOTHING', 270, 250, 112, -0.04, '#ffd84a'); big('MATTERS', 270, 380, 112, -0.04, '#fff');
  big('...IT', 810, 250, 150, 0.04, '#fff'); big('DID', 810, 420, 190, 0.04, '#ffd84a');
}
const OPTS = [optA, optB, optC];
function render(i) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.textBaseline = 'alphabetic'; OPTS[i](0.1); ctx.font = '600 34px Fredoka'; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.textAlign = 'right'; ctx.fillText('UNIT 4B', W - 30, H - 30); ctx.textAlign = 'start'; }
window.render = render; window.DUR = 3; window.TEXTS = () => [];
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) { const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f); }
  render(0); window.READY = true;
})();
