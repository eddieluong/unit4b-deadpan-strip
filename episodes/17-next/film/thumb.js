// UNIT 4B · 17 "Typing..." thumbnails (1080x1920). render(0|1|2) = option A|B|C. Standalone; does not touch scene.js/stills.js.
import { drawCharacter } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';
const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d'), INK = '#2a2230';
const spen = (t, seed) => { const p = new VPen(ctx, 0, 0, 1, { lw: 3.6, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
const armTo = (X, shY, sc, hx, hy, bend = [0, -4]) => ({ hand: [(hx - X) / sc, (shY - hy) / sc], bend });
const headC = (x, y, s) => [x, y - 80 * s, 15 * s];
function hand(text, x, y, size, rot = 0, color = INK, font = 'Fredoka') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px ${font}`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore(); }
function big(text, x, y, size, rot = 0, fill = '#fff') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.26; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 6); ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0); ctx.restore();
}
function bubble(p, cx, cy, w, h, dots = true, tailX = 0, fill = '#f2f4fb') {
  p.part(roundPoly([[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]], h * 0.42), fill, { shade: 0.1, lw: 7 });
  const tx = cx + tailX; p.part(roundPoly([[tx - w * 0.07, cy + h / 2 - 8], [tx + w * 0.07, cy + h / 2 - 8], [tx - w * 0.02, cy + h / 2 + h * 0.24]], 6), fill, { shade: 0.1, lw: 7 });
  p.line([[tx - w * 0.06, cy + h / 2 - 6], [tx + w * 0.06, cy + h / 2 - 6]], 8, fill);
  if (dots) for (let i = -1; i <= 1; i++) p.dot(cx + i * w * 0.24, cy - (i === 0 ? h * 0.07 : -h * 0.03), h * 0.15, h * 0.15, '#5d6382');
}
function wall(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function glow(hc, rgba, dx = 0, dy = 160) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 8, 0, 7); ctx.clip();
  const g = ctx.createRadialGradient(hc[0] + dx, hc[1] + dy, 20, hc[0] + dx, hc[1] + dy, hc[2] * 1.5); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.fillStyle = g; ctx.fillRect(hc[0] - 500, hc[1] - 500, 1000, 1000); ctx.restore();
}
function drop(p, x, y, sz, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 }); ctx.restore(); }

// ---- A: giant three-dot bubble over Steve's big worried face (day, hopeful panic) ----
function optA(t) {
  wall('#ffe6b0', '#f4bf80');
  const p = spen(t, 3);
  ctx.save(); const rg = ctx.createRadialGradient(540, 1100, 100, 540, 1100, 900); rg.addColorStop(0, 'rgba(255,250,200,0.55)'); rg.addColorStop(1, 'rgba(255,250,200,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); ctx.restore();
  big('TYPING...', 540, 190, 170, -0.02, '#ffd84a');
  bubble(spen(t, 11), 540, 590, 960, 520, true, -150);
  const s = 21, X = 540, hcY = 1330, Y = hcY + 80 * s;
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'wide', brow: 'worried', mouth: 'small', fx: ['sweat'], look: -0.2, hair: 1, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
  drop(spen(t, 21), 880, 1130, 30, 0.35);
}

// ---- B: the "k" bubble vs Steve's dead-eyed face (night, 9 hours later) ----
function optB(t) {
  wall('#3a3f72', '#1f2450');
  const p = spen(t, 7);
  big('9 HOURS', 540, 190, 190, 0.02, '#ffd84a');
  bubble(spen(t, 13), 540, 640, 900, 640, false, -140, '#eef0f8');
  hand('k', 540, 640, 600, 0, INK);
  const s = 21, X = 540, hcY = 1450, Y = hcY + 80 * s;
  ctx.save(); const lg = ctx.createRadialGradient(X, hcY, 80, X, hcY, 700); lg.addColorStop(0, 'rgba(255,214,140,0.5)'); lg.addColorStop(1, 'rgba(255,214,140,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 900, W, 1020); ctx.restore();
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'deadpan', lid: 0.55, mouth: 'line', fx: ['gloom'], look: 0.5, hair: 0, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
  glow(headC(X, Y, s), 'rgba(255,214,150,0.25)', -60, 40);
}

// ---- C: phone chat close-up (the whole joke in one screen) + Steve's dead stare ----
function optC(t) {
  wall('#1d2250', '#0e1233');
  [[120, 120, 6], [900, 150, 7], [980, 330, 5], [90, 380, 5]].forEach(([x, y, r]) => { ctx.fillStyle = '#e8ecff'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); });
  const pw = 760, ph = 1000, pcx = 540, pcy = 530, PS = 0.8;
  ctx.save(); const gl = ctx.createRadialGradient(pcx, pcy, 80, pcx, pcy, 900); gl.addColorStop(0, 'rgba(120,200,255,0.4)'); gl.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, 1500); ctx.restore();
  ctx.save(); ctx.translate(pcx, pcy); ctx.rotate(-0.03); ctx.scale(PS, PS);
  const q = spen(t, 9);
  q.part(roundPoly([[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [pw / 2, ph / 2], [-pw / 2, ph / 2]], 60), '#1a1e32', { shade: false, lw: 8 });
  q.part(roundPoly([[-pw / 2 + 24, -ph / 2 + 30], [pw / 2 - 24, -ph / 2 + 30], [pw / 2 - 24, ph / 2 - 30], [-pw / 2 + 24, ph / 2 - 30]], 34), '#f4f7ff', { shade: false, lw: 2 });
  // my message (blue, right), seen, their reply (grey, left): tiny "k"
  q.part(roundPoly([[-300, -400], [310, -400], [310, -250], [-300, -250]], 60), '#3b8cf0', { shade: 0.06, lw: 4 });
  hand('Are we still on', 5, -350, 54, 0, '#fff'); hand('for tonight?', 5, -290, 54, 0, '#fff');
  hand('Seen 9:41 AM', 160, -215, 36, 0, '#8a90a8');
  q.part(roundPoly([[-310, 20], [-120, 20], [-120, 170], [-310, 170]], 60), '#dde1ee', { shade: 0.06, lw: 4 });
  hand('k', -215, 92, 150, 0, INK);
  hand('9:41 PM', -210, 215, 36, 0, '#8a90a8');
  ctx.restore();
  big('JUST', 330, 1030, 130, -0.03, '#fff'); big("'k'", 650, 1030, 200, -0.03, '#ffd84a');
  const s = 17, X = 540, hcY = 1560, Y = hcY + 80 * s;
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'deadpan', lid: 0.55, mouth: 'line', fx: ['gloom'], look: -0.4, hair: 0, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
}
const OPTS = [optA, optB, optC];
function render(i) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.textBaseline = 'alphabetic'; OPTS[i](0.1); ctx.font = '600 34px Fredoka'; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.textAlign = 'right'; ctx.fillText('UNIT 4B', W - 30, H - 30); ctx.textAlign = 'start'; }
window.render = render; window.DUR = 3; window.TEXTS = () => [];
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) { const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f); }
  render(0); window.READY = true;
})();
