// UNIT 4B · 19 "Good Morning" (Tập 10) — full film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// Script: ../script.md · timings: voice/timeline.json (timing option B) · sfx: events.json (read by mix.py too).
// Worlds reuse the approved v5 stills (stills.js): bed (hook), climax (pillow), punch (seated). Phone inserts in the same palette.
import { drawCharacter, paper, panel, nameTab, CAST } from './lib/cast_stick.js';
import { roundPoly, VPen } from './lib/cast_v2.js';
import { onTwos, boilFrame, ease } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const INK = '#2a2230', TITLE_Y = 232, PL_Y = 1640, SKIN = '#e2ac84', RED = '#e63946';
let TL = null, EVT = null, DUR = 27, EV = [], L = {};

const clamp01 = k => Math.max(0, Math.min(1, k)), seg = (t, a, b) => clamp01((t - a) / (b - a)), lerp = (a, b, k) => a + (b - a) * k;
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
const spen = (t, seed, lw = 3) => { const p = new VPen(ctx, 0, 0, 1, { lw, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600', align = 'center') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
function cam(zoom, fx, fy, fn, rot = 0, dx = 0, dy = 0) { ctx.save(); ctx.translate(540 + dx, 960 + dy); if (rot) ctx.rotate(rot); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const hsh = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const armTo = (X, shY, sc, hx, hy, bend) => ({ hand: [(hx - X) / sc, (shY - hy) / sc], bend });
const headOf = (x, y, s) => [x, y - 80 * s, 15 * s];

// ---------- title + caption plate ----------
const TITLE = 'POV: the family group chat at 6 A.M.';
function title() {
  ctx.save(); ctx.font = '600 50px Fredoka'; const w = ctx.measureText(TITLE).width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.9)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 48, w, 96, 48); ctx.fill();
  text(TITLE, 540, TITLE_Y + 3, 50, '#fff6dc'); ctx.restore();
}
function plate(id, lines, stress = []) {
  ctx.save(); ctx.fillStyle = 'rgba(30,24,40,0.88)'; ctx.beginPath(); ctx.roundRect(40, PL_Y, 1000, 240, 36); ctx.fill();
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
  s1: ['snuggles', ['Six A.M. The family', 'group chat woke UP.'], ['UP'], 0.25], s2: ['steve', ['Why are they all AWAKE?'], ['AWAKE'], 0.2],
  s3: ['steve', ['I deleted my PHOTOS for this.'], ['PHOTOS'], 0.2], s4: ["steve", ["That's it. I'm LEAVING."], ['LEAVING'], 0.2],
  s6: ['steve', ['No.'], ['No'], 0.2], s6b: ['steve', ['NO.'], ['NO'], 0.2],
  s7: ['snuggles', ['Nobody leaves.', 'They ADD you back.'], ['ADD'], 0.2], s8: ['steve', ['Stop BLOOMING!'], ['BLOOMING'], 0.3],
  s9: ['steve', ['…Good morning.'], ['morning'], 0.7], s10: ['snuggles', ['By Tuesday, he was', 'SENDING them.'], ['SENDING'], 1.9],
};
function captions(t) {
  for (const l of TL.lines) {
    const c = CAPS[l.id]; if (!c) continue;
    const a = l.id === 's1' ? -1 : l.start - 0.03;
    if (t >= a && t <= l.end + c[3]) { plate(c[0], c[1], c[2]); return { id: l.id, text: c[1].join(' '), x0: 40, y0: PL_Y, x1: 1040, y1: PL_Y + 240 }; }
  }
  return null;
}

// ---------- props (ported from the approved stills) ----------
let SEED = 1; const rnd = () => (SEED = (SEED * 16807) % 2147483647) / 2147483647;
const CARD = ['#ffc6d9', '#ffe29a', '#ffd0b0', '#f9b7d0', '#fff0c2', '#ffb8c6'];
function rose(x, y, r, col = '#e84a78') {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#4aa24a'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  for (const a of [-0.9, 2.4]) { ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(r * 1.15, 0, r * 0.6, r * 0.28, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
  for (let i = 0; i < 6; i++) { const a = i * 1.05; ctx.fillStyle = i % 2 ? col : '#f2658e'; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45, r * 0.62, 0, 7); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#c92e5c'; ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, r * 0.2, 0.3, 4.6); ctx.stroke(); ctx.restore();
}
function sun(x, y, r) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#f4a21c'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 1.25, Math.sin(a) * r * 1.25); ctx.lineTo(Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7); ctx.stroke(); }
  ctx.fillStyle = '#ffd23c'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
}
function sparkle(x, y, r, col = '#fff', rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = col; ctx.strokeStyle = '#d99a2b'; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * 0.28 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}
function heart(x, y, r, col = '#ff4f7b', rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath();
  ctx.moveTo(0, r * 0.9); ctx.bezierCurveTo(-r * 1.7, -r * 0.1, -r * 0.9, -r * 1.4, 0, -r * 0.55); ctx.bezierCurveTo(r * 0.9, -r * 1.4, r * 1.7, -r * 0.1, 0, r * 0.9); ctx.fill(); ctx.stroke(); ctx.restore();
}
function card(x, y, w, rot, kind, label = true) {
  const h = w * 1.25; ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.shadowColor = 'rgba(60,30,40,0.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = CARD[kind * 2 % 6]; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * 0.08); ctx.fill(); ctx.shadowColor = 'transparent';
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, kind === 1 ? '#ffe9a0' : '#ffd6e4'); g.addColorStop(1, kind === 1 ? '#ffb27a' : '#ff9fc0');
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = Math.max(3, w * 0.025); ctx.strokeStyle = INK; ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(2, w * 0.02); ctx.setLineDash([w * 0.05, w * 0.05]); ctx.beginPath(); ctx.roundRect(-w / 2 + w * 0.06, -h / 2 + w * 0.06, w * 0.88, h - w * 0.12, w * 0.05); ctx.stroke(); ctx.setLineDash([]);
  if (kind === 1) { sun(0, -h * 0.12, w * 0.2); } else { rose(-w * 0.1, -h * 0.1, w * 0.2); rose(w * 0.18, -h * 0.02, w * 0.13, '#ff7a9c'); if (kind === 2) rose(-w * 0.2, h * 0.04, w * 0.1, '#ffb347'); }
  sparkle(w * 0.3, -h * 0.35, w * 0.12); sparkle(-w * 0.32, -h * 0.05, w * 0.08, '#fff7a8'); sparkle(w * 0.22, h * 0.14, w * 0.07);
  if (label) text('Good Morning', 0, h * 0.34, w * 0.15, '#a02a58', 'Fredoka');
  ctx.restore();
}
function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
function faceGlow(hc, rgba = 'rgba(110,190,255,0.5)', dx = 0, dy = 160) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 8, 0, 7); ctx.clip();
  const g = ctx.createRadialGradient(hc[0] + dx, hc[1] + dy, 20, hc[0] + dx, hc[1] + dy, hc[2] * 1.5); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.fillStyle = g; ctx.fillRect(hc[0] - 400, hc[1] - 400, 800, 800); ctx.restore();
}
function drop(p, x, y, sz, rot = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot);
  p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 }); ctx.restore();
}
function room(t, beam, bright = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, bright ? '#ffefc0' : '#ffe3b0'); g.addColorStop(1, '#f6b985'); ctx.fillStyle = g; ctx.fillRect(-900, -900, W + 1800, H + 1800);
  const p = spen(t, 3);
  p.part(roundPoly([[600, 330], [1010, 330], [1010, 700], [600, 700]], 8), '#9fd8f7', { shade: false, lw: 6 });
  ctx.fillStyle = '#ffeaa0'; ctx.beginPath(); ctx.arc(900, 420, 44, 0, 7); ctx.fill(); ctx.fillStyle = '#ffb36a'; ctx.fillRect(606, 600, 398, 94);
  p.line([[805, 330], [805, 700]], 5); p.line([[600, 515], [1010, 515]], 5);
  if (beam) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,236,160,0.22)'; ctx.beginPath(); ctx.moveTo(600, 700); ctx.lineTo(1010, 700); ctx.lineTo(560, 1500); ctx.lineTo(60, 1500); ctx.fill(); ctx.restore(); }
}
function pileRow(cx0, cx1, y0, y1, n, wmin, wmax) { for (let i = 0; i < n; i++) card(cx0 + rnd() * (cx1 - cx0), y0 + rnd() * (y1 - y0), wmin + rnd() * (wmax - wmin), (rnd() - 0.5) * 1.6, Math.floor(rnd() * 3)); }
function phoneAt(x, y, w, h, rot, screen) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const q = spen(0.1, 9);
  q.part(roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], w * 0.12), '#2a3050', { shade: 0.1, lw: 6 });
  ctx.fillStyle = '#fff4f8'; ctx.beginPath(); ctx.roundRect(-w / 2 + 12, -h / 2 + 16, w - 24, h - 32, 16); ctx.fill();
  screen && screen(w, h); ctx.restore();
}
function gripHand(x, y, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.ellipse(0, 0, 46, 34, 0, 0, 7); ctx.fill(); ctx.stroke();
  for (const [fy, len] of [[-18, 34], [-2, 38], [14, 34]]) { ctx.beginPath(); ctx.roundRect(14, fy - 8, len, 16, 8); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-8, 26); ctx.quadraticCurveTo(18, 38, 40, 22); ctx.quadraticCurveTo(22, 30, -4, 14); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function handAt(x, y, r) { ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.8, 0, 0, 7); ctx.fill(); ctx.stroke(); }
function thumb(tx, ty, press = 0, rot = -0.45) {   // tip at (tx,ty), arm coming in from the bottom right
  ctx.save(); ctx.translate(tx, ty); ctx.rotate(rot); const k = 1 - 0.06 * press; ctx.scale(k, k); ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.roundRect(-62, -20, 124, 900, 62); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(0, 36, 30, 22, 0, 0, 7); ctx.fill(); ctx.restore();
}
// Steve, with the approved still-2 shirt shape on every draw
function steve(t, X, Y, s, pose) {
  const _part = VPen.prototype.part; let done = false;
  VPen.prototype.part = function (pts, color, o) {
    if (!done && color === CAST.steve.color) {
      done = true;
      _part.call(this, roundPoly([[-6.8, 63], [6.8, 63], [10.5, 59], [8.6, 46], [9.6, 37], [-9.6, 37], [-8.6, 46], [-10.5, 59]], 2.2), color, o);
      this.line([[-6, 55], [-4.6, 47], [-5.2, 40]], this.lw * 0.45); this.line([[6.2, 54], [5, 46], [5.6, 40]], this.lw * 0.45);
      this.line([[-9, 39.5], [0, 38.6], [9, 39.5]], this.lw * 0.4);
      return;
    }
    return _part.call(this, pts, color, o);
  };
  drawCharacter(ctx, 'steve', X, Y, s, { hair: 2, bags: 1, ...pose, headDy: (pose.headDy || 0) + 0.35 * Math.sin(t * 1.9) }, { frame: boilFrame(t) });
  VPen.prototype.part = _part;
}
const lidB = (b, t) => Math.min(1, b + ((t % 3.3) < 0.14 ? 0.5 : 0));   // periodic blink

// cards fountain out of a point toward the camera (deterministic in t). o.freeze: time the flood stops mid-air; o.drop: time they fall
function pour(t, ox, oy, o = {}) {
  const n = o.n ?? 12, rate = o.rate ?? 0.9, life = o.life ?? 1.2, vx = o.vx ?? 380, vup = o.vup ?? 1300, g = o.g ?? 1500, sz = o.sz ?? 120, kinds = o.kinds;
  const te = o.freeze !== undefined ? Math.min(t, o.freeze) : t, td = o.drop !== undefined && t > o.drop ? t - o.drop : 0;
  for (let k = 0; k < n; k++) {
    const u = te * rate + k / n + (o.ph || 0), cyc = Math.floor(u), age = (u - cyc) * life, id = k * 31 + cyc * 7 + (o.seed || 0);
    const x = ox + (hsh(id + 1) - 0.5) * 2 * vx * age + (o.cx || 0) * age, y = oy - vup * (0.45 + 0.55 * hsh(id + 2)) * age + 0.5 * g * age * age + 0.5 * 2600 * td * td;
    if (y > 1700 || td > 0.9) continue;
    const w = sz * (0.55 + 0.6 * Math.min(1, age / (life * 0.6))), rot = (hsh(id + 3) - 0.5) * 3 + (hsh(id + 4) - 0.5) * 4 * age, kind = kinds ? kinds[Math.floor(hsh(id + 5) * kinds.length)] : Math.floor(hsh(id + 5) * 3);
    ctx.save(); ctx.globalAlpha = td ? Math.max(0, 1 - td * 1.1) : age > life * 0.85 ? 1 - (age - life * 0.85) / (life * 0.15) : 1; card(x, y, w, rot, kind, w > 150); ctx.restore();
  }
}

// ---------- BED world (hook / flood / sit-up / peace / escalation) ----------
function bedW(t, o = {}) {
  SEED = 7; const m = onTwos(t); room(t, !o.noBeam, o.bright);
  const s = 17, X = 330, dy = o.dy || 0, hc0 = 900 + dy, Y = hc0 + 80 * s, shY = Y - 60 * s, phx = 810 + (o.phx || 0), phy = 1070 + (o.phy || 0) + dy * 0.4;
  const pl = spen(t, 14); pl.part(roundPoly([[-40, 560], [650, 540], [680, 1250], [-40, 1270]], 120), '#f4f1ff', { shade: 0.1, lw: 6 }); pl.line([[40, 700], [90, 1100]], 4, 'rgba(42,34,48,0.18)');
  const P = { eyes: 'dot', lid: lidB(0.5, t), brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.5, ...(o.face || {}) }; if (o.face && o.face.lid !== undefined) P.lid = lidB(o.face.lid, t);
  steve(m, X, Y, s, { ...P, lean: o.lean || 0, tilt: o.tilt || 0, armL: armTo(X, shY, s, phx - 120, phy + 90, [0, -3]), armR: armTo(X, shY, s, phx - 120, phy + 90, [0, -3]) });
  const hc = headOf(X, Y, s); if (!o.peace) faceGlow(hc, o.glowCol || 'rgba(255,170,215,0.65)', 200, 20);
  if (o.sparkleHit !== undefined) { const a = o.sparkleHit; if (a >= 0 && a < 1) { const px = lerp(520, 330, Math.min(1, a / 0.35)), py = a < 0.35 ? lerp(300, 720, eo(a / 0.35) ) : 720 - 380 * Math.sin(Math.PI * (a - 0.35) / 0.65) , bx = a < 0.35 ? px : 330 + 520 * (a - 0.35);
      ctx.save(); ctx.translate(bx, py); ctx.rotate(a * 9); ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-70, -70, 140, 140, 18); ctx.fill(); ctx.stroke(); sparkle(0, -10, 54, '#ffe66a'); text('GIF', 0, 46, 30, '#a02a58'); ctx.restore(); if (a > 0.3 && a < 0.5) for (let i = 0; i < 6; i++) sparkle(330 + 90 * Math.cos(i * 1.05) * (a - 0.3) * 8, 730 - 90 * Math.sin(i * 1.05) * (a - 0.3) * 8, 20, '#fff7a8', i); } }
  const bp = spen(t, 15); bp.part(roundPoly([[-60, 1290], [200, 1260], [520, 1280], [760, 1310], [1140, 1290], [1140, 1930], [-60, 1930]], 60), '#7fa7d9', { shade: 0.12, lw: 6 });
  for (const x of [140, 420, 700]) bp.line([[x, 1380], [x + 30, 1600]], 4, 'rgba(42,34,48,0.35)');
  // cat
  const c = o.cat || {}; ctx.save(); ctx.translate(215, 1575); ctx.scale(c.sx || 1, c.sy || 1); ctx.translate(-215, -1575);
  drawCharacter(ctx, 'snuggles', 215, 1575, 8, { eyes: 'dot', lid: 0.35, mouth: 'line', look: 0.4, ...(c.pose || {}) }, { frame: boilFrame(m) }); ctx.restore();
  // phone
  const screen = o.screen || ((w, h) => {
    ctx.fillStyle = '#ff9fc0'; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, -h / 2 + 40, w - 44, 150, 14); ctx.fill(); rose(0, -h / 2 + 115, 46);
    text('Good Morning', 0, -h / 2 + 235, 30, '#a02a58'); ctx.fillStyle = '#ffe29a'; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, 20, w - 44, 120, 14); ctx.fill(); sun(0, 80, 34); });
  const jig = o.jig ? shake(t, o.jig, 40) : [0, 0];
  phoneAt(phx + jig[0], phy + jig[1], 260, 400, 0.08, screen);
  if (!o.peace && !o.nopour) glowBlob(phx - 20, phy - 120, 380, 'rgba(255,170,215,0.4)');
  if (!o.nopour) pour(t, phx, phy - 120, { vx: 230, cx: 150, ...(o.pourO || {}) });
  // pile on the blanket
  const lvl = o.pile ?? 1, pa = o.pileAlpha ?? 1; ctx.save(); ctx.globalAlpha = pa;
  if (lvl >= 1) { card(700, 1380, 150, -0.3, 0); card(330, 1440, 160, 0.25, 1); pileRow(600, 1060, 1400, 1560, 8, 170, 250); pileRow(20, 330, 1470, 1560, 3, 160, 220); }
  if (lvl >= 2) { pileRow(-40, 1120, 1180, 1460, 14, 180, 260); }
  if (lvl >= 3) { pileRow(-40, 1120, 1020 - (o.pileUp || 0), 1260, 16, 190, 270); }
  ctx.restore();
  if (!o.peace) { ctx.save(); const k = o.badgeK ?? 1; ctx.translate(955, 880); ctx.scale(k, k); ctx.fillStyle = RED; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 56, 0, 7); ctx.fill(); ctx.stroke(); text(o.counter || '47', 0, 4, 54, '#fff'); ctx.restore(); }
  gripHand(phx + jig[0] - 120, phy + jig[1] + 90, 0.3);
  if (o.peace) { // sunbeam, motes, birds
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,240,170,0.3)'; ctx.beginPath(); ctx.moveTo(600, 700); ctx.lineTo(1010, 700); ctx.lineTo(620, 1500); ctx.lineTo(0, 1500); ctx.fill(); ctx.restore();
    for (let i = 0; i < 14; i++) { const px = 120 + 800 * hsh(i) + 30 * Math.sin(t * 0.9 + i), py = 700 + 650 * ((hsh(i + 9) + t * 0.05 * (0.5 + hsh(i + 3))) % 1); ctx.fillStyle = 'rgba(255,255,230,0.85)'; ctx.beginPath(); ctx.arc(px, py, 5 + 4 * hsh(i + 5), 0, 7); ctx.fill(); }
    for (const [bx, by, ph] of [[720, 440, 0], [800, 380, 1.3]]) { const fx = bx + 40 * Math.sin(t * 1.2 + ph), fy = by + 14 * Math.sin(t * 2.4 + ph), fl = Math.sin(t * 18 + ph) * 10; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(fx - 28, fy - fl); ctx.quadraticCurveTo(fx - 12, fy - 14, fx, fy); ctx.quadraticCurveTo(fx + 12, fy - 14, fx + 28, fy - fl); ctx.stroke(); }
  }
  if (!o.peace) { const dp = spen(t, 31); drop(dp, 140, 700, 22, 0.3); drop(dp, 90, 860, 18, -0.2); drop(dp, 520, 1010, 20, 0.2); }
  ctx.fillStyle = '#7fa7d9'; ctx.fillRect(-60, 1625, W + 120, 400);
}

// ---------- CLIMAX world (pillow) ----------
function pillow(t, cx, cy, rot, k, bulge = 0) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(k * (1 + 0.03 * bulge), k * (1 + 0.06 * bulge)); const pp = spen(t, 17);
  pp.part(roundPoly([[-340, -110], [340, -110], [370, 110], [-370, 110]], 80), '#ffc2dc', { shade: 0.1, lw: 7 }); pp.line([[-280, 70], [-120, 50], [60, 80], [280, 60]], 4, 'rgba(42,34,48,0.35)'); ctx.restore();
}
function climaxW(t, o = {}) {
  SEED = 21; const m = onTwos(t); room(t, false);
  pileRow(-40, 330, 20, 1200, 22, 190, 300); pileRow(760, 1120, 20, 1200, 22, 190, 300); pileRow(300, 780, 20, 220, 8, 170, 240);
  const s = 12, X = 540, hc0 = 860, Y = hc0 + 80 * s, shY = Y - 60 * s, ph = o.pose ?? 2;
  const pcx = o.pcx ?? 540, pcy = o.pcy ?? 1470, glow = o.glow ?? 1, bul = o.bulge ?? 1;
  glowBlob(540, 1470, 700 * glow, 'rgba(255,120,190,0.6)');
  const HT = [[[430, 1150], [650, 1150]], [[390, 1300], [690, 1300]], [[pcx - 200, pcy - 60], [pcx + 200, pcy - 60]]][ph];
  const f = o.face || {};
  steve(m, X, Y + (o.dy || 0), s, { eyes: 'pinpoint', brow: 'worried', mouth: 'O', fx: ['sweat', 'gloom'], look: 0, lean: o.lean ?? 0, ...f, armL: armTo(X, shY + (o.dy || 0), s, HT[0][0], HT[0][1], [-8, 0]), armR: armTo(X, shY + (o.dy || 0), s, HT[1][0], HT[1][1], [8, 0]) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,140,200,0.4)', 0, 150);
  const bp = spen(t, 16); bp.part(roundPoly([[-60, 1420], [540, 1400], [1140, 1420], [1140, 1930], [-60, 1930]], 50), '#7fa7d9', { shade: 0.12, lw: 6 });
  for (const [x, y, w, r, k] of [[210, 1330, 130, -0.9, 0], [880, 1320, 130, 0.9, 2], [140, 1560, 140, -0.4, 1], [930, 1560, 140, 0.5, 0]]) card(x, y, w, r, k);
  if (ph < 2) phoneAt(HT[0][0] + 110, HT[0][1] + (ph ? 20 : 0), ph ? 230 : 210, ph ? 340 : 320, 0.05, (w, h) => { ctx.fillStyle = '#ff9fc0'; ctx.beginPath(); ctx.roundRect(-w / 2 + 16, -h / 2 + 30, w - 32, 130, 12); ctx.fill(); rose(0, -h / 2 + 95, 38); });
  if (o.revealPhone) phoneAt(540, 1470, 330, 250, 0.03, (w, h) => { ctx.fillStyle = '#e8eaf4'; ctx.beginPath(); ctx.roundRect(-w / 2 + 20, -h / 2 + 24, w - 40, 90, 14); ctx.fill(); text('Grandma', -w / 2 + 90, -h / 2 + 46, 22, '#6a3b8a'); text('Steve? Are you okay?', 0, -h / 2 + 84, 24); });
  if (o.revealPhone) glowBlob(540, 1470, 420, 'rgba(255,235,245,0.5)');
  if (!o.noPillow) {
    pillow(t, pcx, pcy, o.prot || 0, 1, bul * Math.sin(t * 28));
    if (ph === 2 && glow > 0) {
      glowBlob(pcx, pcy, 440 * glow, 'rgba(255,90,170,0.7)'); glowBlob(pcx, pcy, 240 * glow, 'rgba(255,255,255,0.55)');
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      for (const [x, y, dx, dy] of [[-370, 0, -60, -10], [370, 0, 60, -10], [-250, 110, -30, 50], [250, 110, 30, 50], [-200, -110, -20, -50], [200, -110, 20, -50]]) { ctx.beginPath(); ctx.moveTo(pcx + x, pcy + y); ctx.lineTo(pcx + x + dx, pcy + y + dy); ctx.stroke(); } ctx.restore();
      for (const [x, y, r] of [[-376, -10, 44], [380, 0, 44], [-160, 118, 36], [190, 116, 36], [-330, 90, 30], [20, -118, 34]]) rose(pcx + x + 4 * Math.sin(t * 25 + x), pcy + y, r);
      for (let i = 0; i < 8; i++) { const u = (t * 1.6 + i / 8) % 1, sx = pcx + (hsh(i) - 0.5) * 700, a = u * 0.8; rose(sx + (hsh(i + 4) - 0.5) * 300 * u, pcy - 90 - 520 * Math.sin(Math.PI * a * 0.9) , 24 + 6 * hsh(i + 2), '#ff7a9c'); }
    }
  }
  if (ph === 2 && !o.noHands) for (const sx of [-1, 1]) handAt(HT[sx < 0 ? 0 : 1][0], HT[sx < 0 ? 0 : 1][1], 44);
  else if (ph < 2) for (const q of HT) handAt(q[0], q[1], 44);
  { const dp = spen(t, 32); drop(dp, 300, 900, 24, 0.4); drop(dp, 250, 1020, 18, 0.2); drop(dp, 800, 1000, 22, -0.3); }
  ctx.fillStyle = '#7fa7d9'; ctx.fillRect(-60, 1625, W + 120, 400);
}

// ---------- PUNCH world (seated, phone with Grandma + draft rose) ----------
function punchW(t, o = {}) {
  SEED = 33; const m = onTwos(t); room(t, true);
  const s = 17, X = 320, hc0 = 920, Y = hc0 + 80 * s, shY = Y - 60 * s, phx = 770, phy = 1390, pw = 330, ph = 490;
  steve(m, X, Y, s, { expr: 'deadpan', lid: lidB(o.lid ?? 0.55, t), mouth: 'line', look: 0.7, fx: ['gloom', 'sweat'], tilt: o.tilt || 0,
    armL: armTo(X, shY, s, phx - pw / 2 + 5, phy + 40, [0, -3]), armR: armTo(X, shY, s, phx - pw / 2 + 5, phy + 40, [0, -3]) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(255,225,235,0.35)', 200, 40);
  const bp = spen(t, 15); bp.part(roundPoly([[-60, 1530], [300, 1520], [640, 1540], [1140, 1530], [1140, 1930], [-60, 1930]], 60), '#7fa7d9', { shade: 0.12, lw: 6 });
  glowBlob(phx, phy - 60, 480, 'rgba(255,215,235,0.4)');
  const sendK = o.send ?? -1, sent = sendK >= 0.3;
  phoneAt(phx, phy, pw, ph, 0.05, (w, h) => {
    ctx.fillStyle = '#e8eaf4'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, -h / 2 + 36, w - 70, 190, 26); ctx.fill(); ctx.stroke();
    text('Grandma', -w / 2 + 100, -h / 2 + 66, 26, '#6a3b8a'); text('Steve? Are you', -12, -h / 2 + 122, 32); text('okay? \u{1F64F}', -12, -h / 2 + 166, 32);
    if (sendK < 0.3) card(w / 2 - 125, 62 + (sendK < 0 ? 0 : -sendK * 600), 150, 0.06, 0, false);
    else card(w / 2 - 125, 62, 150, 0.06, 0, false);
    if (sent) text('Sent ✓', w / 2 - 100, h / 2 - 50, 34, '#3a8a4a');
  });
  if (sendK > 0 && sendK < 1) { const a = sendK; card(phx + 150 - 80 * a, phy + 50 - 1500 * a * a - 200 * a, 150 + 160 * a, 0.06 + a * 2, 0, a > 0.4); }
  if (o.tap !== undefined) thumb(phx + 60, phy + 150, o.tap, -0.55);
  else gripHand(phx - pw / 2 + 5, phy + 40, 0.3);
  if (o.tap !== undefined) gripHand(phx - pw / 2 + 5, phy + 40, 0.3);
  ctx.fillStyle = '#7fa7d9'; ctx.fillRect(-60, 1625, W + 120, 400);
}

// ---------- PILE world: the cat pops out of the pile at the ceiling ----------
function pileW(t, o = {}) {
  SEED = 41; const m = onTwos(t); room(t, false);
  const pop = o.pop ?? 1, cy = lerp(2250, 1450, eb(pop)), cx = 540;
  ctx.save(); ctx.translate(cx, 1400); ctx.rotate(o.rot || 0); ctx.translate(-cx, -1400);
  pileRow(-60, 1140, 0, 1100, 40, 220, 320);
  drawCharacter(ctx, 'snuggles', cx, cy, 15, { eyes: o.eyes || 'dot', lid: o.lid ?? 0.3, mouth: 'line', look: o.look ?? 0.4, tilt: o.tilt || 0, tail: 0.3 }, { frame: boilFrame(m) });
  pileRow(-60, 1140, 1300, 1900, 26, 240, 340); pileRow(-60, 380, 900, 1500, 8, 220, 300); pileRow(700, 1140, 900, 1500, 8, 220, 300);
  ctx.restore();
  if (o.petal !== undefined) { const a = o.petal; ctx.save(); ctx.translate(540 + 90 * Math.sin(a * 5) + a * 60, 940 + 560 * a * a + 200 * a); ctx.rotate(a * 7); ctx.fillStyle = '#e84a78'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 0, 34, 20, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
  for (let i = 0; i < 6; i++) sparkle(100 + 880 * hsh(i + 2), 300 + 700 * hsh(i + 8), 20 + 14 * Math.sin(t * 5 + i), '#fff7a8', t + i);
}

// ---------- PHONE insert world ----------
function phoneBig(t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffe3b0'); g.addColorStop(1, '#f6b985'); ctx.fillStyle = g; ctx.fillRect(-900, -900, W + 1800, H + 1800);
  glowBlob(540, 960, 900, 'rgba(255,170,215,0.35)');
  const w = 780, h = 1380; ctx.save(); ctx.translate(540 + (o.dx || 0), 980); ctx.rotate(o.rot ?? 0.03); const q = spen(0.1, 9);
  q.part(roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], 90), '#2a3050', { shade: 0.1, lw: 8 });
  ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2 + 16, -h / 2 + 22, w - 32, h - 44, 70); ctx.clip(); ctx.fillStyle = o.bg || '#fff4f8'; ctx.fillRect(-w / 2, -h / 2, w, h);
  o.screen(w, h); ctx.restore();
  if (o.badge) { ctx.save(); ctx.translate(w / 2 - 40, -h / 2 + 10); const k = o.badgeK ?? 1; ctx.scale(k, k); ctx.fillStyle = RED; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 0, 80, 0, 7); ctx.fill(); ctx.stroke(); text(o.badge, 0, 5, 76, '#fff'); ctx.restore(); }
  ctx.restore();
}
function header(w, h, name = 'Family Group', sub = 'Mom, Auntie, Grandma +9') {
  ctx.fillStyle = '#ff9fc0'; ctx.fillRect(-w / 2, -h / 2, w, 190); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 190); ctx.lineTo(w / 2, -h / 2 + 190); ctx.stroke();
  text(name, 0, -h / 2 + 110, 60, '#fff'); text(sub, 0, -h / 2 + 160, 30, '#7a2a52');
}
function selfie(x, y, sz, k = 0) { // album tile with a tiny Steve selfie
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = ['#cfe6ff', '#ffe0c8', '#d9f2d0', '#f4d4f2'][k % 4]; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-sz / 2, -sz / 2, sz, sz, sz * 0.1); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * sz * 0.1 - sz * 0.05, -sz * 0.12); ctx.lineTo(i * sz * 0.1, -sz * 0.38 - Math.abs(i) * -sz * 0.02 - sz * 0.05); ctx.lineTo(i * sz * 0.1 + sz * 0.05, -sz * 0.12); ctx.fill(); }
  ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(0, sz * 0.02, sz * 0.26, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = INK; for (const ex of [-1, 1]) { ctx.beginPath(); ctx.arc(ex * sz * 0.09, -sz * 0.02, sz * 0.03, 0, 7); ctx.fill(); }
  ctx.beginPath(); ctx.arc(0, sz * 0.08, sz * 0.09, 0.2, Math.PI - 0.2); ctx.stroke(); ctx.restore();
}
function chatScreen(t, w, h) {
  header(w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2 + 192, w, h - 192); ctx.clip();
  for (let i = 0; i < 6; i++) { const y = -h / 2 + 192 + ((i * 400 - t * 520) % 2400 + 2400) % 2400 - 200; const left = i % 2 === 0; card(left ? -150 : 150, y, 300, (left ? -1 : 1) * 0.05, i % 3, true); text(left ? ['Mom', 'Auntie', 'Grandma'][(i / 2) | 0] : '', -260, y - 200, 26, '#6a3b8a'); }
  ctx.restore();
}
function storageScreen(t, w, h) {
  header(w, h, 'Photos', 'Storage');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) selfie(-240 + c * 240, -h / 2 + 330 + r * 250, 200, r + c);
  const k = seg(t, 5.78, 6.0), gone = seg(t, 6.62, 6.8); if (gone >= 1) return;
  const sc = lerp(2.4, 1, eb(k)) * (1 - gone), [sx, sy] = t > 6.0 && t < 6.25 ? shake(t, 8 * (1 - seg(t, 6.0, 6.25)), 60) : [0, 0];
  ctx.fillStyle = 'rgba(30,24,40,0.45)'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 3); ctx.translate(sx, 40 + sy); ctx.scale(sc, sc);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-310, -250, 620, 500, 40); ctx.fill(); ctx.stroke();
  ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -150, 56, 0, 7); ctx.fill(); ctx.stroke(); text('!', 0, -146, 80, '#fff');
  text('Storage full', 0, -40, 78, INK); text('Delete photos to', 0, 40, 36, '#6a5a72'); text('save new ones', 0, 80, 36, '#6a5a72');
  ctx.fillStyle = '#4a9be0'; ctx.beginPath(); ctx.roundRect(-150, 130, 300, 80, 40); ctx.fill(); ctx.stroke(); text('Manage', 0, 172, 44, '#fff'); ctx.restore();
}
function binAt(x, y, lid = 0) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#c8ccd4'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-100, -90); ctx.lineTo(100, -90); ctx.lineTo(80, 100); ctx.lineTo(-80, 100); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 5; for (const x2 of [-40, 0, 40]) { ctx.beginPath(); ctx.moveTo(x2, -60); ctx.lineTo(x2 * 0.85, 70); ctx.stroke(); }
  ctx.save(); ctx.translate(-100, -90); ctx.rotate(-lid); ctx.fillStyle = '#b4b9c4'; ctx.beginPath(); ctx.roundRect(-20, -30, 240, 34, 12); ctx.fill(); ctx.stroke(); ctx.restore(); ctx.restore();
}
function albumScreen(t, w, h) {
  header(w, h, 'Photos', 'Albums');
  const d = seg(t, 7.0, 7.5), fx = lerp(-120, 120, eio(d)), fy = lerp(-150, 330, eio(d)), fs = lerp(1, 0.35, d);
  binAt(150, 330 + 60, t > 7.45 && t < 7.9 ? 0.9 * Math.sin(Math.PI * seg(t, 7.45, 7.9)) : 0);
  if (d < 1) { ctx.save(); ctx.translate(fx, fy); ctx.scale(fs, fs); ctx.fillStyle = '#ffd98a'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-190, -140, 380, 290, 30); ctx.fill(); ctx.stroke(); selfie(0, -10, 200, 1); text('My Selfies', 0, 100, 44, INK); ctx.restore(); }
  else { // empty slot, then the rose card drops in
    ctx.save(); ctx.strokeStyle = '#b9a79c'; ctx.lineWidth = 6; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.roundRect(-310, -290, 380, 290, 30); ctx.stroke(); ctx.restore();
    const wv = seg(t, 7.5, 8.05); if (wv < 1) { const hy = lerp(160, 40, eo(wv)) , sc = 1 - 0.6 * seg(t, 7.8, 8.05); ctx.save(); ctx.translate(150, 330 - 120 * Math.sin(Math.PI * wv) + 0 * hy); ctx.scale(sc, sc); selfie(0, 0, 200, 2); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(100, 20); ctx.lineTo(160, -20 + 30 * Math.sin(t * 24)); ctx.stroke(); ctx.restore(); }
    const rk = seg(t, 8.05, 8.3); if (rk > 0) { card(-120, lerp(-700, -145, eb(rk)), 250, 0.05, 0, true); if (rk < 1) sparkle(60, -150, 60 * rk, '#fff7a8', rk * 4); }
  }
}
function leaveScreen(t, w, h) {
  header(w, h, 'Family Group', 'Group info');
  const rows = [['Mute notifications', '#fff'], ['Media & files', '#fff'], ['Search', '#fff'], ['Leave group', '#ffd6d6']], tap = seg(t, 9.72, 9.8);
  rows.forEach(([lbl, col], i) => { const y = -h / 2 + 330 + i * 150; ctx.fillStyle = i === 3 && tap > 0 ? '#ff8a8a' : col; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-330, y - 56, 660, 112, 28); ctx.fill(); ctx.stroke(); text(lbl, i === 3 ? 10 : 0, y + 3, 50, i === 3 ? '#b3202e' : INK); });
}
function grandmaScreen(t, w, h) {
  header(w, h, 'Family Group', 'Grandma is typing…');
  const k = seg(t, 20.3, 20.45); ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 40);
  ctx.fillStyle = '#e8eaf4'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-340, -160, 680, 400, 50); ctx.fill(); ctx.stroke();
  text('Grandma', -170, -110, 40, '#6a3b8a'); text('Steve?', 0, -20, 96); text('Are you okay? \u{1F64F}', 0, 110, 64); ctx.restore();
}
function tueScreen(t, w, h) {
  header(w, h, '\u{1F338} STEVE IS BACK \u{1F338}', 'Mom, Auntie, Grandma +9');
  const k = seg(t, 24.0, 24.2); const rn = t > 24.05; if (rn) { /* outgoing card */ card(170, -170, 330, 0.04, 1, false); text('HAPPY', 170, -170, 62, '#a02a58', 'Fredoka', 0.04); text('TUESDAY', 170, -100, 62, '#a02a58', 'Fredoka', 0.04); }
  for (let i = 0; i < 14; i++) { const u = ((t - 24.2) * 0.9 + hsh(i)) % 1; if (t < 24.2) break; heart(-300 + 600 * hsh(i + 3) + 30 * Math.sin(t * 4 + i), 640 - 1300 * u, 36 + 22 * hsh(i + 7), ['#ff4f7b', '#ff8fb0', '#e63946'][i % 3], Math.sin(t * 3 + i) * 0.4); }
  ctx.fillStyle = '#ffd98a'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-320, 440, 640, 120, 30); ctx.fill(); ctx.stroke(); text(t > 24.0 ? '\u{1F338} STEVE IS BACK \u{1F338}' : '', 0, 504, 46, INK);
}

// ---------- overlays: notifications ----------
const NOTIFS = [[11.0, 12.1, 'Mom added you.', 'full'], [13.0, 14.45, 'Auntie added you.', 'banner'], [14.55, 15.7, 'Grandma added you.', 'banner']];
function notif(t) {
  for (const [a, b, msg, kind] of NOTIFS) {
    if (t < a || t > b) continue; const k = seg(t, a, a + 0.22), s = eb(k);
    if (kind === 'full') {
      ctx.fillStyle = 'rgba(30,24,40,0.4)'; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.translate(540, 900); ctx.scale(0.4 + 0.6 * s, 0.4 + 0.6 * s); ctx.rotate((1 - s) * -0.2);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-460, -260, 920, 520, 56); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff9fc0'; ctx.beginPath(); ctx.arc(-370, -170, 56, 0, 7); ctx.fill(); ctx.stroke(); rose(-370, -170, 26); text('Family Group  · now', -90, -170, 46, '#6a5a72', 'Fredoka', 0, '600', 'left'); text(msg, 0, 40, 100, INK); ctx.restore();
    } else {
      ctx.save(); ctx.translate(540, 470 - (1 - eo(k)) * 300); ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-470, -90, 940, 180, 44); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff9fc0'; ctx.beginPath(); ctx.arc(-390, 0, 46, 0, 7); ctx.fill(); ctx.stroke(); rose(-390, 0, 22); text('Family Group', -310, -40, 32, '#6a5a72', 'Fredoka', 0, '600', 'left'); text(msg, -310, 22, 66, INK, 'Fredoka', 0, '600', 'left'); ctx.restore();
    }
  }
}
function tueChip(t) {
  if (t < 22.96 || t > 24.0) return; const k = seg(t, 22.96, 23.2);
  ctx.save(); ctx.translate(540, 400); ctx.scale(0.5 + 0.5 * eb(k), 0.5 + 0.5 * eb(k)); ctx.fillStyle = '#fff6dc'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-330, -70, 660, 140, 40); ctx.fill(); ctx.stroke(); text('TUESDAY  6:00 A.M.', 0, 4, 66, INK); ctx.restore();
}

// ---------- shots ----------
let SHOTS = [];
function build() {
  const s = L;
  const sit = m => kf(m, [[3.52, 0], [3.9, -28], [4.25, -58]], eo);
  SHOTS = [
    // 1 · hook: frame 1 = approved still; cards pour, counter ticks 47 -> 52
    [0, t => cam(kf(t, [[0, 1.0], [1.0, 1.04]], eo), 540, 960, () => bedW(t, { counter: String(47 + Math.min(5, Math.floor(t * 5.5))), badgeK: 1 + 0.18 * Math.sin(Math.PI * ((t * 5.5) % 1)) }))],
    // 2 · close-up: one big glitter rose card spins in front of Steve's face
    [1.0, t => cam(kf(t, [[1.0, 1.7], [1.9, 1.9]]), 330, 900, () => { bedW(t, { counter: '53', nopour: false, pourO: { sz: 90 } }); const a = (t - 1) * 6; ctx.save(); ctx.translate(300 + 150 * Math.sin(a * 0.35), 840 + 40 * Math.sin(a)); ctx.scale(Math.cos(a), 1); card(0, 0, 230, 0.25, 0, false); ctx.restore(); })],
    // 3 · phone: the counter ticks, the chat scrolls
    [1.9, t => { const n = 53 + Math.floor((t - 1.9) * 7); cam(kf(t, [[1.9, 1.0], [3.52, 1.07]]), 540, 960, () => phoneBig(t, { screen: (w, h) => chatScreen(t, w, h), badge: String(n), badgeK: 1 + 0.2 * Math.sin(Math.PI * (((t - 1.9) * 7) % 1)) })); }],
    // 4 · s2: sit-up in three poses
    [3.52, t => { const m = onTwos(t); cam(kf(t, [[3.52, 1.0], [4.6, 1.1]]), 400, 900, () => bedW(t, { dy: sit(m), lean: kf(m, [[3.52, 0], [4.2, 7]]), counter: '64', face: { eyes: m < 3.9 ? 'dot' : 'wide', lid: m < 3.9 ? 0.5 : 0, mouth: m < 3.9 ? 'small' : 'O', look: 0.2 } })); }],
    // 5 · sparkle GIF bounces off his forehead, spikes jiggle
    [4.6, t => { const a = (t - 4.6) / 1.1, m = onTwos(t), jig = t > 4.95 ? 4 * Math.exp(-(t - 4.95) * 5) * Math.cos((t - 4.95) * 40) : 0; cam(kf(t, [[4.6, 1.8], [5.72, 1.6]]), 360, 820, () => bedW(t, { dy: -58, lean: 7 + jig, tilt: jig * 1.5, counter: '66', sparkleHit: a, face: { eyes: 'wide', lid: 0, mouth: t > 4.95 ? 'line' : 'O', look: t > 5.3 ? 0.9 : 0.2, brow: 'worried' } })); }],
    // 6 · s3 popup "Storage full"
    [5.72, t => cam(kf(t, [[5.72, 1.0], [6.9, 1.08]]), 540, 960, () => { phoneBig(t, { screen: (w, h) => storageScreen(t, w, h) }); if (t > 6.3 && t < 6.8) thumb(540, 1330 + 0 * t, t > 6.55 ? 1 : 0); })],
    // 7 · drag the album to the bin, one selfie waves goodbye, a rose takes its place
    [6.9, t => cam(kf(t, [[6.9, 1.15], [8.51, 1.28]]), 540, 960 - 60, () => { phoneBig(t, { screen: (w, h) => albumScreen(t, w, h) }); const d = seg(t, 7.0, 7.5); if (t < 7.6) thumb(lerp(420, 660, eio(d)) + 40, lerp(840, 1280, eio(d)), t > 7.4 ? 0 : 1); })],
    // 8 · s4 leave group: thumb taps on LEAVING, the flood freezes mid-air and drops
    [8.51, t => { cam(kf(t, [[8.51, 1.0], [10.3, 1.12]]), 540, 1040, () => { phoneBig(t, { screen: (w, h) => leaveScreen(t, w, h) });
      const k = seg(t, 8.9, 9.65); thumb(lerp(980, 560, eo(k)) + 30, lerp(1800, 1270, eo(k)), t > 9.68 && t < 9.85 ? 1 : 0);
      pour(t, 540, 1500, { freeze: 9.78, drop: 10.05, n: 14, vx: 480, vup: 1500, sz: 230 }); }); }],
    // 9 · 4b peace: birds, sunbeam, he sinks into the pillow, the cat stretches
    [s.s4.end, t => { const m = onTwos(t), k = seg(t, 10.32, 11.0); cam(kf(t, [[10.32, 1.0], [11.0, 1.06]]), 540, 960, () => bedW(t, { peace: true, nopour: true, pile: 0, noBeam: false, dy: lerp(-20, 30, eio(k)), tilt: lerp(0, -6, k), screen: () => {}, face: { eyes: 'dot', lid: lerp(0.5, 0.95, k), mouth: 'smile', brow: undefined, fx: [], look: 0 }, cat: { sx: 1 + 0.12 * Math.sin(Math.PI * k), sy: 1 + 0.18 * Math.sin(Math.PI * k), pose: { lid: 0.8, mouth: 'line' } } })); }],
    // 10 · Mom added you (full-frame card on top of the returning flood)
    [11.0, t => { const [dx, dy] = shake(t, 4 * Math.exp(-(t - 11.0) * 6), 50); cam(kf(t, [[11.0, 1.0], [12.1, 1.05]]), 540, 960, () => bedW(t, { counter: '1', pile: 1, pourO: { ph: 0 }, face: { eyes: 'wide', lid: 0, mouth: 'line', look: 0.3 } }), 0, dx, dy); }],
    // 11 · s6 "No." — face close-up, flood resumes, a tap
    [12.1, t => { cam(kf(t, [[12.1, 1.6], [13.0, 1.75]]), 340, 880, () => bedW(t, { counter: '2', pile: 1, nopour: t > 12.45 && t < 12.9, face: { eyes: 'dot', lid: 0.45, mouth: 'line', brow: 'worried', look: 0.7 } })); }],
    // 12 · Auntie ping: wide, pile up one level
    [13.0, t => { cam(kf(t, [[13.0, 1.0], [13.79, 1.08]]), 540, 960, () => bedW(t, { counter: '3', pile: 2, jig: 3, face: { eyes: 'wide', lid: 0.1, mouth: 'small', look: 0.3 } })); }],
    // 13 · s6b "NO." louder, shaking close-up
    [13.79, t => { const [dx, dy] = shake(t, 5, 45); cam(kf(t, [[13.79, 1.8], [14.5, 1.95]]), 340, 860, () => bedW(t, { counter: '4', pile: 2, jig: 4, lean: 3, face: { eyes: 'pinpoint', lid: 0, mouth: 'wide', brow: 'worried', look: 0.5 } }), 0, dx, dy); }],
    // 14 · Grandma ping: the pile jumps up in a step
    [14.5, t => { const u = t < 14.75 ? 0 : 120 * eb(seg(t, 14.75, 14.95)); cam(1.0, 540, 960, () => bedW(t, { counter: '5', pile: 3, pileUp: 120 - u, jig: 3, face: { eyes: 'wide', lid: 0, mouth: 'O', look: 0.3 } })); }],
    // 15 · s7 the cat pops out of the pile at the ceiling, unimpressed
    [s.s6b.end + 0.8, t => { const k = seg(t, 15.28, 15.75); cam(kf(t, [[15.28, 1.0], [16.5, 1.12]]), 540, 1100, () => pileW(t, { pop: k, rot: 0.02 * Math.sin(t * 20) * (1 - k), look: 0.4 })); }],
    // 16 · cat close-up: ears turn, a petal falls off the fedora
    [16.5, t => { cam(kf(t, [[16.5, 1.7], [17.6, 1.85]]), 540, 1280, () => pileW(t, { pop: 1, look: kf(t, [[16.5, 0.4], [16.9, -0.8], [17.3, 0.9]]), tilt: kf(t, [[16.5, 0], [16.9, -6], [17.3, 5]]), lid: 0.5, petal: seg(t, 16.65, 17.5) })); }],
    // 17 · s8 shove the phone under the pillow in three poses
    [17.6, t => { const m = onTwos(t), ph = m < 17.85 ? 0 : m < 18.1 ? 1 : 2, pc = [[1700, 1500, 0.2], [820, 1380, 0.12], [540, 1470, 0]][ph]; cam(kf(t, [[17.6, 1.0], [18.35, 1.06]]), 540, 960, () => climaxW(t, { pose: ph, pcx: pc[0], pcy: pc[1], prot: pc[2], glow: ph === 2 ? 0.5 : 0, bulge: ph === 2 ? 0.5 : 0, lean: ph * 3, face: { eyes: 'pinpoint', mouth: ph === 2 ? 'O' : 'wide' } })); }],
    // 18 · climax: pillow glows, roses squeeze out of the seams
    [18.35, t => { const [dx, dy] = shake(t, 3, 40); cam(kf(t, [[18.35, 1.0], [20.0, 1.1]]), 540, 1100, () => climaxW(t, { pose: 2, glow: 1 + 0.12 * Math.sin(t * 20), bulge: 1, lean: 2 * Math.sin(t * 22) }), 0, dx, dy); }],
    // 19 · 8b: quiet ping, he lifts the pillow, the phone glows on his face, lids soften
    [20.0, t => { const k = seg(t, 20.15, 20.45); cam(kf(t, [[20.0, 1.0], [20.45, 1.18]]), 540, 1250, () => climaxW(t, { pose: 2, glow: lerp(1, 0.2, k), bulge: 0.2 * (1 - k), pcx: lerp(540, 150, eio(k)), pcy: lerp(1470, 1600, k), prot: -0.5 * k, revealPhone: k > 0.3, noHands: false, face: { eyes: 'dot', lid: lerp(0, 0.5, k), mouth: 'line', brow: 'worried', fx: ['sweat'] } })); }],
    // 20 · Grandma's message, big
    [20.45, t => cam(kf(t, [[20.45, 1.0], [21.0, 1.05]]), 540, 960, () => phoneBig(t, { rot: 0.0, screen: (w, h) => grandmaScreen(t, w, h) }))],
    // 21 · s9 PUNCH: flat face, thumb taps send, the rose flies off
    [s.s9.start, t => { const sk = t < 21.65 ? -1 : seg(t, 21.65, 22.3), tap = t > 21.5 && t < 21.75 ? (t > 21.62 ? 1 : 0) : undefined; cam(kf(t, [[21.0, 1.0], [22.96, 1.06]]), 470, 1060, () => punchW(t, { send: sk, tap, lid: kf(t, [[21.0, 0.55], [22.3, 0.6]]), tilt: 0 })); }],
    // 22 · button a: Tuesday, wide awake, forwarding HAPPY TUESDAY
    [22.96, t => { cam(kf(t, [[22.96, 1.0], [24.05, 1.12]]), 400, 900, () => bedW(t, { bright: 1, dy: -50, lean: 6, counter: '', badgeK: 0, screen: (w, h) => { ctx.fillStyle = '#ffe29a'; ctx.beginPath(); ctx.roundRect(-w / 2 + 22, -h / 2 + 40, w - 44, 200, 14); ctx.fill(); sun(0, -h / 2 + 140, 50); text('HAPPY TUESDAY', 0, h / 2 - 80, 34, '#a02a58'); },
      pile: 1, pourO: { kinds: [1], rate: 1.2 }, face: { eyes: 'wide', lid: 0, mouth: 'grin', brow: undefined, fx: [], look: 0.4 }, cat: { pose: { lid: 0.3 } } })); }],
    // 23 · button b: the group is renamed, hearts flood in
    [24.05, t => cam(kf(t, [[24.05, 1.0], [25.2, 1.08]]), 540, 960, () => phoneBig(t, { screen: (w, h) => tueScreen(t, w, h), badge: t > 24.3 ? String(2 + Math.floor((t - 24.3) * 9)) : '', badgeK: 1 }))],
    // 24 · loop: push-in on the frame-1 composition (match cut to frame 1)
    [25.2, t => cam(kf(t, [[25.2, 0.9], [26.96, 1.0]], eio), 540, 960, () => bedW(t - 0 + 0 * 1, { counter: '47', badgeK: 1, face: { eyes: 'dot', lid: 0.5, mouth: 'small' } }))],
  ];
}

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1;
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
  notif(t); tueChip(t);
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
  L = Object.fromEntries(TL.lines.map(l => [l.id, l]));
  window.DUR = DUR = TL.total; window.EV = EV = EVT.ev;
  build(); render(0); window.READY = true;
})();
