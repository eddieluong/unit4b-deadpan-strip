// UNIT 4B · 18 "One Percent" thumbnails (1080x1920). render(0|1|2) = option A|B|C. Standalone; does not touch scene.js/stills.js.
import { drawCharacter } from './lib/cast_stick.js';
import { roundPoly, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';
const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d'), INK = '#2a2230', RED = '#e63946';
const spen = (t, seed) => { const p = new VPen(ctx, 0, 0, 1, { lw: 3.6, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
const armTo = (X, shY, sc, hx, hy, bend = [0, -4]) => ({ hand: [(hx - X) / sc, (shY - hy) / sc], bend });
function big(text, x, y, size, rot = 0, fill = '#fff', stroke = INK) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.2; ctx.strokeStyle = stroke; ctx.strokeText(text, 0, 8); ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0); ctx.restore();
}
function wall(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function blob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
function drop(x, y, sz, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); spen(0.1, 70 + x).part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 }); ctx.restore(); }
function handAt(x, y, r) { ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.85, 0, 0, 7); ctx.fill(); ctx.stroke(); }
function socketAt(x, y, k = 1) { const p = spen(0.1, 51); p.part(roundPoly([[x - 70 * k, y - 95 * k], [x + 70 * k, y - 95 * k], [x + 70 * k, y + 95 * k], [x - 70 * k, y + 95 * k]], 18 * k), '#f4f1ea', { shade: 0.1, lw: 6 }); ctx.fillStyle = INK; for (const dy of [-38, 38]) { ctx.beginPath(); ctx.roundRect(x - 34 * k, y + dy * k - 8 * k, 68 * k, 16 * k, 8 * k); ctx.fill(); } }
function plug(x, y, k = 1) { const p = spen(0.1, 61); for (const dy of [-32, 32]) p.part(roundPoly([[40 * k + x, dy * k - 8 * k + y], [110 * k + x, dy * k - 8 * k + y], [110 * k + x, dy * k + 8 * k + y], [40 * k + x, dy * k + 8 * k + y]], 3 * k), '#c8ccd4', { shade: 0.15, lw: 5 }); p.part(roundPoly([[x - 60 * k, y - 62 * k], [x + 40 * k, y - 62 * k], [x + 40 * k, y + 62 * k], [x - 60 * k, y + 62 * k]], 18 * k), '#e9ebf2', { shade: 0.12, lw: 6 }); }
function battery(cx, cy, w, h, label, col) {
  ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = col; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 28); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(cx + w / 2 + 6, cy - h * 0.2, 22, h * 0.4, 8); ctx.fill();
  ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 18, cy - h / 2 + 18, w * 0.1, h - 36, 12); ctx.fill(); ctx.restore();
  if (label) big(label, cx + w * 0.05, cy + 6, h * 0.7, 0, col, '#2b0d12');
}
function room(t, red) {
  wall(red ? '#8a3a3a' : '#ffe3b0', red ? '#4a1a22' : '#f6b985');
  if (false) { const p = spen(t, 3); p.part(roundPoly([[650, 330], [1030, 330], [1030, 640], [650, 640]], 8), '#9fd8f7', { shade: false, lw: 6 }); }
}
function cat(x, y, s, o) { drawCharacter(ctx, 'snuggles', x, y + 34 * s, s, o, { frame: boilFrame(0.1) }); }

// ---- A: Steve's giant red-lit panic face + the red battery, "1%" + ONE MESSAGE (hook frame, close-up) ----
function optA(t) {
  room(t, true); blob(540, 1000, 900, 'rgba(255,60,70,0.35)');
  const s = 23, X = 540, hcY = 1120, Y = hcY + 80 * s;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1920); ctx.clip();
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'wide', brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0, hair: 2, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
  ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,70,80,0.9)'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(540, hcY, 15 * s - 5, -0.9, 0.9); ctx.stroke(); ctx.restore();
  for (const [x, y, z, r] of [[90, 760, 34, -0.6], [980, 820, 32, 0.7], [110, 1250, 30, -1.1], [990, 1330, 30, 1.2]]) drop(x, y, z, r);
  big('1%', 540, 330, 520, -0.03, '#ff3b47', '#2b0d12');
  big('ONE MESSAGE', 540, 1730, 150, 0.01, '#fff');
}

// ---- B: "NOBODY MOVE": Steve frozen on tiptoe-stare, cat one paw up, battery 1% (beat 2, wide) ----
function optB(t) {
  room(t, false); ctx.fillStyle = 'rgba(120,20,30,0.2)'; ctx.fillRect(0, 0, W, H);
  big('1%', 540, 250, 440, 0.03, '#ff3b47', '#2b0d12');
  const s = 15, X = 330, hcY = 900, Y = hcY + 80 * s;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1560); ctx.clip();
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'pinpoint', brow: 'worried', mouth: 'line', fx: ['sweat'], look: 0.5, hair: 2, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
  ctx.restore();
  cat(800, 1420, 11, { eyes: 'wide', look: -0.6, mouth: 'line' });
  for (const [x, y, z, r] of [[110, 650, 30, -0.6], [560, 700, 26, 0.7], [120, 1100, 26, -1.1]]) drop(x, y, z, r);
  big('NOBODY MOVE', 540, 1730, 140, -0.01, '#ffd84a');
}

// ---- C: phone close-up, giant red battery 1%, plug a finger short of the socket; Steve peeks (beat 3: THIS CLOSE) ----
function optC(t) {
  wall('#2a1a40', '#12091f'); blob(540, 760, 1000, 'rgba(255,50,65,0.4)');
  ctx.save(); ctx.translate(540, 560); ctx.rotate(-0.04); ctx.scale(0.85,0.85); const q = spen(t, 9);
  q.part(roundPoly([[-390, -520], [390, -520], [390, 520], [-390, 520]], 80), '#2a3050', { shade: 0.1, lw: 8 });
  ctx.fillStyle = '#2b0d12'; ctx.beginPath(); ctx.roundRect(-366, -490, 732, 980, 56); ctx.fill(); ctx.restore();
  battery(540, 560, 600, 360, '1%', '#ff4a55');
  socketAt(900, 1130, 1.1); plug(560, 1130, 1.15); handAt(470, 1130, 70);
  for (const dy of [-38, 0, 38]) { ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(545, 1130 + dy, 36, 16, 0, 0, 7); ctx.fill(); ctx.stroke(); }
  big('THIS CLOSE', 540, 1390, 160, -0.015, '#ffd84a');
  const s = 11, X = 540, hcY = 1800; drawCharacter(ctx, 'steve', X, hcY + 80 * s, s, { eyes: 'wide', brow: 'worried', mouth: 'small', fx: ['sweat'], hair: 2, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
}
const OPTS = [optA, optB, optC];
function render(i) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.textBaseline = 'alphabetic'; OPTS[i](0.1); ctx.font = '600 34px Fredoka'; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.textAlign = 'right'; ctx.fillText('UNIT 4B', W - 30, H - 30); ctx.textAlign = 'start'; }
window.render = render; window.DUR = 3; window.TEXTS = () => [];
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) { const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f); }
  render(0); window.READY = true;
})();
