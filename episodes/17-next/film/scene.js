// UNIT 4B · 17 "Typing..." (Tập 8) — full film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// Script: ../script.md v2 (approved) · timings: voice/timeline.json · sfx times: events.json (also read by mix.py).
// Full-bleed 9:16 panel, title pill inside, caption plate as in the key stills. World coordinates = the stills' coordinates.
import { drawCharacter, paper, panel, nameTab } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen, mix } from './lib/cast_v2.js';
import { track, idle, sum, ease, onTwos, boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const INK = '#2a2230', TITLE_Y = 232, PL_Y = 1640;
let TL = null, EVT = null, DUR = 30, EV = [];

// ---------- helpers ----------
const clamp01 = k => Math.max(0, Math.min(1, k));
const seg = (t, a, b) => clamp01((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const spen = (t, seed, lw = 3) => { const p = new VPen(ctx, 0, 0, 1, { lw, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600', align = 'center') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
const AT = (X, hc0, s) => (hx, hy, bend = [0, -3]) => { const shY = hc0 + 80 * s - 60 * s; return { hand: [(hx - X) / s, (shY - hy) / s], bend }; };
function cam(zoom, fx, fy, fn, rot = 0, dx = 0, dy = 0) {
  ctx.save(); ctx.translate(540 + dx, 960 + dy); if (rot) ctx.rotate(rot); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore();
}
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const POSE = (keys, t, seed = 0) => sum(track(keys, onTwos(t)), idle(onTwos(t), seed));

// ---------- title + caption plate ----------
function title() {
  ctx.save(); ctx.font = '600 56px Fredoka'; const w = ctx.measureText("POV: they're typing...").width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.9)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 50, w, 100, 50); ctx.fill();
  text("POV: they're typing...", 540, TITLE_Y + 3, 56, '#fff6dc'); ctx.restore();
}
function plate(id, lines, stress = []) {
  ctx.save(); ctx.fillStyle = 'rgba(30,24,40,0.88)'; ctx.beginPath(); ctx.roundRect(40, PL_Y, 1000, 240, 36); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  nameTab(ctx, 70, PL_Y - 30, id, 34);
  let size = lines.length > 1 ? 76 : 100; ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = `600 ${size}px Fredoka`; const widest = Math.max(...lines.map(l => ctx.measureText(l).width)); if (widest > 930) size = Math.floor(size * 930 / widest);
  ctx.font = `600 ${size}px Fredoka`;
  lines.forEach((ln, li) => {
    const ws = ln.split(' '), gap = 20, wd = ws.map(w => ctx.measureText(w).width); let x = 540 - (wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
    const y = PL_Y + 135 + (li - (lines.length - 1) / 2) * (size + 6);
    ws.forEach((w, i) => { ctx.fillStyle = stress.some(s => w.startsWith(s)) ? '#ffd84a' : '#fff'; ctx.fillText(w, x, y); x += wd[i] + gap; });
  });
  ctx.restore();
}
const CAPS = {   // id: [speaker, lines, stress, hold after voice end]
  s1: ['snuggles', ['Nine forty-one.', 'He asked ONE question.'], ['ONE'], 0.25], s2: ['steve', ["They're TYPING."], ['TYPING'], 0.25],
  s3: ['steve', ['No. Come BACK.'], ['BACK'], 0.25], s4: ['snuggles', ['They came back.', 'They left AGAIN.'], ['AGAIN'], 0.25],
  s5: ['steve', ["Okay. I'm FINE."], ['FINE'], 0.25], s6: ['snuggles', ['Someone was writing.', 'Someone was writing a LOT.'], ['LOT'], 0.2],
  s7: ['steve', ['Is that a paragraph?', "It's a PARAGRAPH."], ['PARAGRAPH'], 0.3], s9: ['steve', ['…k.'], [], 0.55],
  s10: ['snuggles', ['Nine hours.', 'One LETTER.'], ['LETTER'], 0.3], s11: ['snuggles', ['Revenge.', 'Served in LOWERCASE.'], ['LOWERCASE'], 0.3],
};
function captions(t) {
  for (const L of TL.lines) {
    const c = CAPS[L.id]; if (!c) continue;
    if (t >= L.start - 0.03 && t <= L.end + c[3]) { plate(c[0], c[1], c[2]); return { id: L.id, text: c[1].join(' '), x0: 40, y0: PL_Y, x1: 1040, y1: PL_Y + 240 }; }
  }
  return null;
}

// ---------- drawing parts ----------
function drop(p, x, y, sz, rot = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot);
  p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 }); ctx.restore();
}
// sweat drops thrown off the temple: parabolic arcs, one new drop every `period` s
function flyDrops(t, hc, o = {}) {
  const { period = 0.55, dir = -1, n = 2, sz = 20, vx = 300, vy = -330, g = 1500, life = 0.6 } = o;
  for (let k = 0; k < n; k++) {
    const ph = ((t / period) + k / n) % 1, age = ph * period; if (age > life) continue;
    const x = hc[0] + dir * (hc[2] * 0.86) + dir * vx * age, y = hc[1] - hc[2] * 0.45 + vy * age + 0.5 * g * age * age;
    drop(spen(t, 60 + k), x, y, sz * (1 - age / life * 0.3), dir * (0.4 + age * 2), 1 - age / life * 0.6);
  }
}
function faceGlow(hc, rgba = 'rgba(110,190,255,0.5)', dx = 0, dy = 160) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 8, 0, 7); ctx.clip();
  const g = ctx.createRadialGradient(hc[0] + dx, hc[1] + dy, 20, hc[0] + dx, hc[1] + dy, hc[2] * 1.5); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.fillStyle = g; ctx.fillRect(hc[0] - 400, hc[1] - 400, 800, 800); ctx.restore();
}
function STEVE(t, X, hc0, s, pose, glow) {
  const Y = hc0 + 80 * s, pz = { ...pose };
  if (pz.hair === undefined) pz.hair = 1;
  drawCharacter(ctx, 'steve', X, Y, s, pz, { frame: boilFrame(t) });
  const lean = (pz.lean || 0) * Math.PI / 180, dy = (pz.headDy || 0);
  const hc = [X + Math.sin(lean) * 42 * s, Y - (80 + dy) * s + (1 - Math.cos(lean)) * 42 * s, 15 * s];
  if (glow) faceGlow(hc, glow[0], glow[1] || 0, glow[2] ?? 150);
  return hc;
}
function CAT(t, cX, cY, cs, pose, beard = 0, bfall = 0) {   // beard 0..1 pop-on scale; bfall: 0..1 falling
  drawCharacter(ctx, 'snuggles', cX, cY, cs, { eyes: 'wide', look: 0.1, mouth: 'line', ...pose }, { frame: boilFrame(t) });
  if (beard > 0.01) {
    const hy = 34 + (pose.headDy || 0), pen = new VPen(ctx, cX, cY, cs, { lw: Math.max(2, cs * 0.5), hand: true, frame: boilFrame(t), seed: 5 });
    ctx.save();
    if (bfall > 0) { const fy = bfall * bfall * 520, fx = bfall * 40; ctx.translate(cX + fx, cY - 24 * cs + fy); ctx.rotate(bfall * 2.2); ctx.translate(-cX, -(cY - 24 * cs)); }
    const k = beard; pen.part([[-3.6, hy - 7 + 0.4], [3.6, hy - 7 + 0.4], [1.2, hy - 7 - 6.5 * k], [-1.2, hy - 7 - 6.5 * k]].map(([x, y]) => [x * k, y]), '#efe9df', { shade: false, lw: pen.lw * 0.8 });
    ctx.restore();
  }
}
function BUBBLE(t, cx, cy, w, h, o = {}) {   // origin (ox,oy) = the point the bubble grows from
  const sc = o.sc ?? 1; if (sc <= 0.01) return;
  const ox = o.ox ?? cx, oy = o.oy ?? cy, fill = o.fill ?? '#f2f4fb', tailX = o.tailX ?? 0;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.translate(ox, oy); ctx.scale(sc * (o.sx ?? 1), sc * (o.sy ?? 1)); ctx.translate(-ox, -oy);
  const p = spen(t, o.seed ?? 11);
  p.part(roundPoly([[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]], h * 0.42), fill, { shade: 0.1, lw: o.lw ?? 6 });
  const tx = cx + tailX; if (o.tail !== false) {
    p.part(roundPoly([[tx - w * 0.07, cy + h / 2 - 8], [tx + w * 0.07, cy + h / 2 - 8], [tx - w * 0.02, cy + h / 2 + h * 0.22]], 6), fill, { shade: 0.1, lw: o.lw ?? 6 });
    p.line([[tx - w * 0.06, cy + h / 2 - 6], [tx + w * 0.06, cy + h / 2 - 6]], 7, fill);
  }
  if (o.dots !== false && !o.k) {
    const sp = o.speed ?? 2.2;
    for (let i = -1; i <= 1; i++) {
      const b = o.still ? 0 : Math.abs(Math.sin((t * sp - (i + 1) * 0.2) * Math.PI)), pu = o.pulse ?? 0;
      const base = cy - (i === 0 ? h * 0.05 : -h * 0.03), r = h * 0.13 * (1 + pu * 0.35);
      p.dot(cx + i * w * 0.24, base - b * h * 0.17, r * (1 - 0.1 * b), r * (1 + 0.12 * b), '#5d6382');
    }
  }
  if (o.k) text('k', cx + 8, cy - 10, o.ksize ?? 520, INK, 'Fredoka', 0, '600');
  ctx.restore();
}
function popFX(t, t0, cx, cy, R) {   // soap-bubble burst: ring, droplets
  const a = t - t0; if (a < 0 || a > 0.45) return;
  const k = a / 0.45, p = spen(t, 71);
  ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#fff'; ctx.lineWidth = 14 * (1 - k) + 3; ctx.beginPath(); ctx.ellipse(cx, cy, R * (0.5 + k * 0.7), R * 0.5 * (0.5 + k * 0.7), 0, 0, 7); ctx.stroke();
  for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283 + 0.3, r0 = R * (0.5 + k * 0.9), r1 = r0 + 40 * (1 - k) + 12; p.line([[cx + Math.cos(an) * r0, cy + Math.sin(an) * r0 * 0.5], [cx + Math.cos(an) * r1, cy + Math.sin(an) * r1 * 0.5]], 7, '#dfe6ff'); }
  ctx.restore();
}
function pen2(t, seed, lw) { return spen(t, seed, lw); }

// ---------- sets ----------
const PAL = { top: ['#ffe6b0', '#ffb98a', '#2a2f56'], bot: ['#f4bf80', '#c9707a', '#171b38'], flo: ['#d9a066', '#a8605e', '#10142c'], sky: ['#7ec8f5', '#f2a272', '#1d2550'] };
const pal = (a, n) => n < 0.5 ? mix(a[0], a[1], n * 2) : mix(a[1], a[2], (n - 0.5) * 2);
function ROOM(t, n, o = {}) {   // n: 0 day · 0.5 sunset · 1 night
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, pal(PAL.top, n)); g.addColorStop(1, pal(PAL.bot, n)); ctx.fillStyle = g; ctx.fillRect(-1600, -1600, 4300, 5200);
  const p = spen(t, 3), fy = o.floorY ?? 1480;
  ctx.fillStyle = pal(PAL.flo, n); ctx.fillRect(-1600, fy, 4300, 2200); p.line([[-1000, fy], [2100, fy]], 5);
  if (o.window !== false) {
    p.part(roundPoly([[40, 330], [200, 330], [200, 700], [40, 700]], 8), pal(PAL.sky, n), { shade: false, lw: 5 });
    ctx.save(); ctx.beginPath(); ctx.rect(44, 334, 152, 362); ctx.clip();
    if (n < 0.75) { ctx.fillStyle = n < 0.3 ? '#fff3a0' : '#ffd0a0'; ctx.beginPath(); ctx.arc(150, lerp(410, 640, seg(n, 0, 0.55)), 30, 0, 7); ctx.fill(); }
    if (n < 0.4) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(90, 600, 40, 20, 0, 0, 7); ctx.ellipse(120, 586, 28, 20, 0, 0, 7); ctx.fill(); }
    if (n > 0.6) { ctx.fillStyle = '#f5f0d0'; ctx.beginPath(); ctx.arc(130, 430, 34, 0, 7); ctx.fill(); ctx.fillStyle = pal(PAL.sky, n); ctx.beginPath(); ctx.arc(146, 420, 30, 0, 7); ctx.fill();
      ctx.fillStyle = '#e8eaff'; for (const [x, y] of [[70, 380], [90, 540], [160, 600], [60, 640]]) ctx.fillRect(x, y, 5, 5); }
    ctx.restore();
    p.line([[120, 330], [120, 700]], 4); p.line([[40, 515], [200, 515]], 4);
  }
  if (n < 0.3) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,230,150,0.18)'; ctx.beginPath(); ctx.moveTo(40, 700); ctx.lineTo(200, 700); ctx.lineTo(760, 1480); ctx.lineTo(200, 1480); ctx.fill(); ctx.restore(); }
  if (n >= 0.3 && n < 0.8) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,150,100,0.16)'; ctx.beginPath(); ctx.moveTo(40, 700); ctx.lineTo(200, 700); ctx.lineTo(900, 1480); ctx.lineTo(300, 1480); ctx.fill(); ctx.restore(); }
}
function PHONE(t, cx, cy, k, o = {}) {   // units: body ±100 × ±150 (like the stills' phone), k = scale
  ctx.save(); ctx.translate(cx, cy); if (o.rot) ctx.rotate(o.rot); ctx.scale(k, k);
  const lw = Math.max(1.6, 7 / k), q = spen(t, 9, lw);
  q.part(roundPoly([[-100, -150], [100, -150], [100, 150], [-100, 150]], 24), '#2a3050', { shade: 0.1, lw: lw * 0.9 });
  if (o.glow) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const gg = ctx.createRadialGradient(0, 0, 40, 0, 0, 420); gg.addColorStop(0, 'rgba(150,210,255,0.3)'); gg.addColorStop(1, 'rgba(150,210,255,0)'); ctx.fillStyle = gg; ctx.fillRect(-500, -500, 1000, 1000); ctx.restore(); }
  ctx.fillStyle = '#eaf6ff'; ctx.beginPath(); ctx.roundRect(-88, -136, 176, 272, 14); ctx.fill();
  text('9:41', 0, -124, 9, '#8aa0b8', 'Fredoka');
  // my message (blue)
  ctx.fillStyle = '#4a90e2'; ctx.beginPath(); ctx.roundRect(-74, -108, 158, 60, 16); ctx.fill();
  text('Are we still on', 5, -90, 20, '#fff'); text('for tonight?', 5, -66, 20, '#fff');
  ctx.strokeStyle = '#5a6a7a'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(20, -35); ctx.lineTo(24, -31); ctx.lineTo(31, -40); ctx.stroke();
  text('Seen 9:41', 82, -35, 15, '#2a2230', 'Fredoka', 0, '600', 'right');
  if (o.dots) {   // their typing bubble (grey), dots bounce
    const sc = o.dots === true ? 1 : o.dots; ctx.save(); ctx.translate(-76, 28); ctx.scale(sc, sc);
    ctx.fillStyle = '#d6dbe8'; ctx.beginPath(); ctx.roundRect(0, -22, 66, 44, 20); ctx.fill();
    for (let i = 0; i < 3; i++) { const b = Math.abs(Math.sin((t * 2.6 - i * 0.2) * Math.PI)); ctx.fillStyle = '#5d6382'; ctx.beginPath(); ctx.arc(16 + i * 17, 3 - b * 7, 5.5, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  if (o.reply) {
    ctx.fillStyle = '#d6dbe8'; ctx.beginPath(); ctx.roundRect(-76, 6, 50, 44, 20); ctx.fill(); text('k', -51, 26, 34, INK);
    text('6:41 PM', -76, 62, 10, '#7a8aa0', 'Fredoka', 0, '600', 'left');
  }
  if (o.input !== undefined) {   // compose box
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#9ab0cc'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-82, 72, 126, 56, 16); ctx.fill(); ctx.stroke();
    const lines = o.input.split('|'), sz = lines.length > 1 ? 15.5 : 30;
    lines.forEach((ln, i) => text(ln, -74, lines.length > 1 ? 88 + i * 24 : 100, sz, INK, 'Fredoka', 0, '600', 'left'));
    if (Math.floor(t * 3) % 2 === 0 || o.caretOn) { const last = lines[lines.length - 1]; ctx.font = `600 ${sz}px Fredoka`; const cxp = -74 + ctx.measureText(last).width + 3, cyp = lines.length > 1 ? 88 + (lines.length - 1) * 24 : 100; ctx.fillStyle = '#4a90e2'; ctx.fillRect(cxp, cyp - sz * 0.5, 2.5, sz); }
    const pr = o.press || 0; ctx.save(); ctx.translate(66, 100); ctx.scale(1 - 0.22 * pr, 1 - 0.22 * pr); ctx.fillStyle = pr > 0 ? '#2c6cc0' : '#4a90e2'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, 7); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(0, 8); ctx.lineTo(0, -8); ctx.moveTo(-7, -1); ctx.lineTo(0, -9); ctx.lineTo(7, -1); ctx.stroke(); ctx.restore();
  }
  if (o.fly) { const f = o.fly; ctx.save(); ctx.globalAlpha = 1; ctx.translate(lerp(60, 30, f), lerp(100, -10, f)); ctx.scale(1 + f * 0.1, 1 + f * 0.1); ctx.fillStyle = '#4a90e2'; ctx.beginPath(); ctx.roundRect(-24, -22, 48, 44, 16); ctx.fill(); text('k', 0, 0, 34, '#fff'); ctx.restore(); }
  ctx.restore();
}
function phoneBg(t, n = 0.5) {   // blurred warm room behind a phone insert
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, pal(PAL.top, n)); g.addColorStop(1, pal(PAL.bot, n)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); const rg = ctx.createRadialGradient(540, 960, 200, 540, 960, 1100); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, 'rgba(20,10,30,0.35)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// ---------- scenes ----------
const T = () => EVT.T;
// A · frame 1 (day): giant bubble swells in, dots bounce
function roomDay(t, o) {
  const sc = o.sc ?? 1, X = 340, hc0 = 1090, s = 17, at = AT(X, hc0, s), phx = 730, phy = 1390, pw = 100;
  ROOM(t, o.n ?? 0);
  if (o.shadow !== false) { ctx.save(); const sg = ctx.createRadialGradient(560, 760, 40, 560, 760, 560); sg.addColorStop(0, 'rgba(120,80,60,0.28)'); sg.addColorStop(1, 'rgba(120,80,60,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 400, W, 700); ctx.restore(); }
  if (o.bubble !== false) BUBBLE(t, 610, 520, 780, 360, { sc: o.bsc ?? sc, ox: 400, oy: 800, tailX: -120, speed: o.speed ?? 2.4, alpha: o.balpha });
  const kA = o.keys, pose = POSE(kA, t, 2);
  pose.hair = 1 + (Math.floor(t * 8) % 2);
  const hc = STEVE(t, X, hc0, s, pose, [ 'rgba(110,190,255,0.35)', 0, 160 ]);
  if (o.drops !== false) flyDrops(t, hc, { dir: -1, period: 0.6 });
  PHONE(t, phx, phy, 1, { rot: 0.02 * Math.sin(t * 9) });
  CAT(t, 975, 1400 + 34 * 8, 8, { tail: 0.4 + 0.5 * Math.sin(t * 5), tilt: o.catTilt ?? 4 * Math.sin(t * 4.3) }, o.beard ?? 0, o.bfall ?? 0);
  return hc;
}
const keysA = [
  { t: 0, eyes: 'wide', brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.3, lean: 0, tilt: 0, headDy: 0, bags: 1, armL: AT(340, 1090, 17)(625, 1450), armR: AT(340, 1090, 17)(835, 1450) },
  { t: 0.12, tilt: -5, headDy: 4, look: 0, lean: -2, brow: 'raised' },
  { t: 0.5, tilt: 3, headDy: 0, look: 0.3, lean: 1, brow: 'worried', mouth: 'wobble' },
  { t: 0.9, tilt: -3, headDy: 2, look: 0.1, lean: 0, mouth: 'small' },
];

// D · the lean-in (s2) + pop (2b): same composition; bubble above, both heads rise toward it
function leanWorld(t, o) {
  ROOM(t, 0);
  const X = 300, hc0 = 1140, s = 15, at = AT(X, hc0, s);
  const bs = o.bsc ?? 1;
  if (bs > 0) BUBBLE(t, 540, 560, 840, 380, { sc: bs, ox: 540, oy: 760, tailX: -170, speed: o.speed ?? 2.4, alpha: o.balpha, sx: o.bsx, sy: o.bsy });
  const pose = POSE(o.keys, t, 4); pose.hair = 1 + (Math.floor(t * 8) % 2);
  const hc = STEVE(t, X, hc0, s, pose, ['rgba(110,190,255,0.3)', 0, 150]);
  flyDrops(t, hc, { dir: -1, period: 0.5 });
  const cp = o.cat || {};
  CAT(t, 800, 1430 + 34 * 10, 10, { tail: 0.8 * Math.sin(t * 6), tilt: cp.tilt ?? 0, headDy: cp.dy ?? 0, eyes: cp.eyes ?? 'wide', mouth: cp.mouth ?? 'line', look: -0.3, lid: cp.lid }, 0);
  return hc;
}
const LA = AT(300, 1140, 15);
const keysLean = [
  { t: 3.3, eyes: 'wide', brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.3, lean: 0, tilt: 0, headDy: 0, bags: 1, armL: LA(250, 1400, [0, -3]), armR: LA(380, 1400, [0, -3]) },
  { t: 3.45, lean: 6, tilt: -8, headDy: 3, look: 0.6, brow: 'raised', mouth: 'O' },
  { t: 3.85, lean: 11, tilt: -10, headDy: 9, look: 0.8, brow: 'raised', mouth: 'smile', dur: 0.3 },
  { t: 4.1, lean: 8, tilt: -8, headDy: 7, mouth: 'wide' },
  { t: 4.45, lean: 12, tilt: -11, headDy: 11, mouth: 'smile', dur: 0.2 },
  { t: 4.69, lean: 12, tilt: -11, headDy: 11 },
  { t: 4.78, lean: 2, tilt: 2, headDy: -3, eyes: 'wide', mouth: 'O', brow: 'worried', look: 0.1, dur: 0.12 },
  { t: 5.0, lean: -2, tilt: 5, headDy: -6, eyes: 'dot', lid: 0.55, mouth: 'frown', brow: 'worried', look: 0, dur: 0.4 },
  { t: 5.5, lean: -3, tilt: 6, headDy: -7, lid: 0.7, dur: 0.4 },
];

// F · knees: Steve hugging the phone
function kneelWorld(t, o) {
  ROOM(t, 0);
  const X = 470, hc0 = 1010 + (o.drop || 0), s = 15, at = AT(X, hc0, s);
  const bsc = o.bsc ?? 0; if (bsc > 0) BUBBLE(t, 560, 430, 640, 290, { sc: bsc, ox: 520, oy: 650, tailX: -90, speed: 3, alpha: o.balpha });
  const pose = POSE(o.keys, t, 6); pose.hair = 1 + (Math.floor(t * 8) % 2);
  const hc = STEVE(t, X, hc0, s, pose, ['rgba(110,190,255,0.45)', 0, 200]);
  flyDrops(t, hc, { dir: 1, period: 0.5 });
  const py = o.phoneY ?? 1500 + (o.drop || 0) * 0.7;
  PHONE(t, 520, py, 1.5, { rot: 0.05 * Math.sin(t * 11), glow: true });
  // arms again (in front of the phone): hug
  const p2 = POSE(o.keys, t, 6); const Y = hc0 + 80 * s;
  ctx.save(); ctx.beginPath(); ctx.rect(300, py - 30, 480, 400); ctx.clip();
  drawCharacter(ctx, 'steve', X, Y, s, { ...p2, hair: pose.hair, eyes: 'dot', mouth: 'line', fx: [] }, { frame: boilFrame(t) }); ctx.restore();
  return hc;
}

// table world (still2): Steve behind the table, bubble ceiling, scroll, lamp
function tableWorld(t, o) {
  ROOM(t, 1, { floorY: 1540, window: false });
  const X = 290, hc0 = 1180, s = 12, at = AT(X, hc0, s), ty = 1500, ft = o.freeze ?? t;
  const lampA = (o.lamp ?? 0) * Math.sin((t - 13.9) * 5) * Math.exp(-(t - 13.9) * 0.5);
  { // hanging lamp (right)
    const p = spen(ft, 33); ctx.save(); ctx.translate(900, -40); ctx.rotate(lampA); p.line([[0, 0], [0, 330]], 5); ctx.fillStyle = '#ffd770'; ctx.beginPath(); ctx.moveTo(-70, 410); ctx.lineTo(70, 410); ctx.lineTo(40, 330); ctx.lineTo(-40, 330); ctx.fill(); p.part(roundPoly([[-70, 410], [70, 410], [40, 330], [-40, 330]], 6), '#ffd770', { shade: 0.1, lw: 5 });
    ctx.globalCompositeOperation = 'screen'; const lg = ctx.createRadialGradient(0, 420, 10, 0, 420, 360); lg.addColorStop(0, 'rgba(255,215,120,0.4)'); lg.addColorStop(1, 'rgba(255,215,120,0)'); ctx.fillStyle = lg; ctx.fillRect(-400, 300, 800, 700); ctx.restore();
  }
  const bsc = o.bsc ?? 1; BUBBLE(ft, 540, 400, 1000, 520, { sc: bsc, ox: 540, oy: 1330, tailX: 120, speed: o.speed ?? 2.4, seed: 12, pulse: o.pulse, alpha: o.balpha });
  if (o.scroll) scroll(ft, o.scroll, o.scrollAlpha ?? 1);
  if (o.tiny) tinyBubble(t, o.tiny);
  // chair back behind Steve (rocks with him)
  const pose = POSE(o.keys, ft, 8); if (o.hairJ !== false) pose.hair = 1 + (Math.floor(ft * 8) % 2); else pose.hair = 2;
  { const p = spen(ft, 17); ctx.save(); ctx.translate(X, 1500); ctx.rotate((pose.lean || 0) * Math.PI / 180); p.part(roundPoly([[-135, -330], [135, -330], [135, 60], [-135, 60]], 40), '#5a3f6a', { shade: 0.12, lw: 5 }); ctx.restore(); }
  const hc = STEVE(ft, X, hc0, s, pose, ['rgba(110,190,255,0.3)', 0, 120]);
  if (o.drops !== false) flyDrops(o.freeze ?? t, hc, { dir: 1, period: 0.6, sz: 18 });
  const tp = spen(ft, 41), [sx, sy] = o.tshake || [0, 0];
  ctx.save(); ctx.translate(sx, sy);
  tp.part(roundPoly([[-30, ty], [640, ty], [640, 1920], [-30, 1920]], 6), '#8a6a48', { shade: 0.12, lw: 6 });
  tp.part(roundPoly([[-40, ty - 26], [660, ty - 26], [660, ty + 16], [-40, ty + 16]], 6), '#a98660', { shade: 0.12, lw: 6 });
  if (o.phone !== false) {   // phone face-up on the table, glowing
    ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(480, ty - 30, 10, 480, ty - 30, 260); g.addColorStop(0, 'rgba(150,210,255,0.5)'); g.addColorStop(1, 'rgba(150,210,255,0)'); ctx.fillStyle = g; ctx.fillRect(180, ty - 330, 600, 330); ctx.restore();
    tp.part(roundPoly([[390, ty - 34], [570, ty - 34], [592, ty - 12], [368, ty - 12]], 4), '#2a3050', { shade: false, lw: 4 });
    ctx.fillStyle = '#bfe4ff'; ctx.beginPath(); ctx.moveTo(402, ty - 30); ctx.lineTo(558, ty - 30); ctx.lineTo(574, ty - 16); ctx.lineTo(386, ty - 16); ctx.fill();
  }
  ctx.restore();
  if (o.tshake) { const e = spen(ft, 42); for (const [dx, dy] of [[-1, 0], [1, 0]]) e.line([[dx > 0 ? 680 : -60, ty - 40], [dx > 0 ? 700 : -80, ty - 60 - 10 * Math.sin(t * 40)]], 5); }
  return hc;
}
const TA = AT(290, 1180, 12), GRIP = { armL: TA(60, 1490, [-3, -3]), armR: TA(520, 1490, [3, -3]) };
function scroll(t, r, a = 1) {   // r 0..1: unrolls down from the bubble, then along the floor
  const sx0 = 700, sx1 = 1010, sy0 = 600, sy1 = 1500, sp = spen(t, 31), down = eio(seg(r, 0, 0.62)), across = eio(seg(r, 0.62, 1));
  ctx.save(); ctx.globalAlpha = a;
  const yEnd = lerp(sy0 + 30, sy1, down);
  sp.part(roundPoly([[sx0, sy0], [sx1, sy0], [sx1, yEnd], [sx0, yEnd]], 6), '#f7f0d8', { shade: 0.08, lw: 5 });
  const words = ['and another', 'thing is,', 'ALSO...', 'furthermore', 'as I said', 'in March,', 'honestly', 'listen,', 'and ANOTHER', 'thing...', 'so anyway', 'where was I', 'oh right,', 'and also...'];
  ctx.save(); ctx.beginPath(); ctx.rect(sx0, sy0, sx1 - sx0, yEnd - sy0); ctx.clip();
  words.forEach((w, i) => text(w, (sx0 + sx1) / 2, sy0 + 50 + i * 62, 40, /[A-Z]{3}/.test(w) ? '#d9382c' : '#5a4f66', 'Patrick Hand', (i % 2 ? 0.015 : -0.015), '400')); ctx.restore();
  if (across > 0) { const xL = lerp(sx1 - 30, sx0 - 260, across); sp.part(roundPoly([[xL, sy1 - 20], [sx1, sy1 - 20], [sx1, sy1 + 36], [xL, sy1 + 36]], 20), '#efe6c4', { shade: 0.1, lw: 5 }); sp.part(ellipsePts(xL - 2, sy1 + 8, 26, 30, 20), '#e2d6ac', { shade: 0.1, lw: 5 }); }
  // the roll at the leading edge
  if (down < 1) sp.part(ellipsePts((sx0 + sx1) / 2, yEnd, 160, 22, 24), '#e2d6ac', { shade: 0.1, lw: 5 });
  ctx.restore();
}
function tinyBubble(t, o) {   // feather bubble drifting down from the cloud: o = {t0, t1, size}
  const k = seg(t, o.t0, o.t1), x = 540 + 120 * Math.sin(k * 7) * (1 - k * 0.3), y = lerp(640, 1020, eio(k)), sz = lerp(150, 250, k * k);
  BUBBLE(t, x, y, sz, sz * 0.55, { dots: false, tailX: -sz * 0.1, lw: 5, seed: 14 });
  const sp = spen(t, 15); for (let i = 0; i < 3; i++) { const a = t * 3 + i * 2.1; sp.line([[x + Math.cos(a) * (sz * 0.7), y + Math.sin(a) * 40 - 20], [x + Math.cos(a) * (sz * 0.7) + 14, y + Math.sin(a) * 40 - 34]], 5, 'rgba(230,236,255,0.8)'); }
}

// punch world (still3)
function punchWorld(t, o) {
  ROOM(t, 0.97, { window: false, floorY: 1900 });
  const sp = spen(t, 7); sp.line([[640, 270], [700, 350], [600, 440], [690, 520]], 4, 'rgba(190,200,245,0.55)');
  const X = 700, hc0 = 1130, s = 11.5, Y = hc0 + 80 * s;
  if (o.bsc !== 0) BUBBLE(t, 540, 640, 880, 640, { sc: o.bsc ?? 1, ox: 700, oy: 1000, tailX: 160, k: o.k !== false, dots: o.k === false, fill: '#eef0f8', seed: 13, sx: o.bsx, sy: o.bsy, speed: 2.2 });
  ctx.save(); const lg = ctx.createRadialGradient(X, hc0 + 300, 40, X, hc0 + 300, 520); lg.addColorStop(0, 'rgba(255,214,140,0.55)'); lg.addColorStop(1, 'rgba(255,214,140,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 900, W, 800); ctx.restore();
  const pose = POSE(o.keys, t, 10); pose.hair = 0;
  const hc = STEVE(t, X, hc0, s, pose);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const g2 = ctx.createRadialGradient(X, hc0 + 350, 20, X, hc0 + 350, 260); g2.addColorStop(0, 'rgba(255,200,110,0.3)'); g2.addColorStop(1, 'rgba(255,200,110,0)'); ctx.fillStyle = g2; ctx.fillRect(X - 300, hc0 + 100, 600, 520); ctx.restore();
  faceGlow(hc, 'rgba(255,214,150,0.25)', -60, 40);
  return hc;
}
const PA = AT(700, 1130, 11.5);
const keysPunch = [
  { t: 23.3, eyes: 'dot', lid: 0.1, mouth: 'line', brow: 'worried', fx: ['gloom'], look: 0.6, bags: 1, lean: 0, tilt: 0, headDy: 0, arm: 'down' },
  { t: 23.55, lid: 0.55, brow: undefined, tilt: 2, headDy: -2, dur: 0.5 },
  { t: 24.2, lid: 0.6, tilt: -1, headDy: -2.5, dur: 0.5 },
];

// night room with the phone (s10): cloud deflates, beard falls
function nightRoom(t, o) {
  ROOM(t, 1);
  const X = 700, hc0 = 1130, s = 12, at = AT(X, hc0, s);
  const sc = o.bsc ?? 1; if (sc > 0.01) BUBBLE(t, 540, 520, 860, 400, { sc, ox: 560, oy: 1000, tailX: -140, speed: 1.2, alpha: 0.95, still: sc < 0.99, sx: 1 + 0.08 * Math.sin(t * 22) * (1 - sc), seed: 12 });
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const lg = ctx.createRadialGradient(X, hc0 + 300, 40, X, hc0 + 300, 520); lg.addColorStop(0, 'rgba(255,214,140,0.4)'); lg.addColorStop(1, 'rgba(255,214,140,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 900, W, 800); ctx.restore();
  const pose = POSE(o.keys, t, 12); pose.hair = 2;
  const hc = STEVE(t, X, hc0, s, pose, ['rgba(255,214,150,0.25)', -40, 40]);
  PHONE(t, 520, 1480, 1.1, { rot: -0.04, glow: true });
  const p2 = pose; ctx.save(); ctx.beginPath(); ctx.rect(300, 1320, 480, 300); ctx.clip(); drawCharacter(ctx, 'steve', X, hc0 + 80 * s, s, { ...p2, eyes: 'dot', mouth: 'line', fx: [] }, { frame: boilFrame(t) }); ctx.restore();
  CAT(t, 230, 1430 + 34 * 10, 10, { tail: 0.4 * Math.sin(t * 3), tilt: 2 * Math.sin(t * 2.2), eyes: 'dot', lid: 0.3 }, 1, o.bfall ?? 0);
  return hc;
}
const NA = AT(700, 1130, 12);
const keysNight = [
  { t: 24.9, eyes: 'dot', lid: 0.6, mouth: 'line', brow: undefined, fx: ['gloom'], look: -0.5, bags: 1, lean: 0, tilt: 2, headDy: -2, armL: NA(600, 1470, [0, -3]), armR: NA(820, 1470, [0, -3]) },
  { t: 25.5, tilt: -1, headDy: -3, look: -0.7, dur: 0.5 },
  { t: 26.0, tilt: 3, headDy: -2, lid: 0.45, look: -0.6, dur: 0.4 },
];

// silhouette across town (loop): a giant bubble blooms exactly like frame 1
function silhouette(t, u) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#6a4a88'); g.addColorStop(1, '#2c1f4a'); ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200);
  const p = spen(t, 3); ctx.fillStyle = '#1d1633'; ctx.fillRect(-100, 1500, W + 200, 500);
  // window with city lights
  p.part(roundPoly([[60, 300], [260, 300], [260, 760], [60, 760]], 8), '#3a2f66', { shade: false, lw: 5 });
  ctx.fillStyle = '#ffd770'; for (const [x, y] of [[100, 600], [150, 640], [200, 580], [120, 690], [210, 700]]) ctx.fillRect(x, y, 14, 18);
  // sofa + silhouette
  const sil = '#150f26', sx = 560;
  ctx.fillStyle = sil; ctx.beginPath(); ctx.roundRect(sx - 460, 1330, 920, 330, 60); ctx.fill(); ctx.beginPath(); ctx.roundRect(sx - 500, 1230, 330, 440, 60); ctx.fill(); ctx.beginPath(); ctx.roundRect(sx + 230, 1230, 330, 440, 60); ctx.fill();
  const bob = 4 * Math.sin(t * 5), hy = 1060 + bob, hr = 235;
  ctx.fillStyle = '#0c0818'; ctx.beginPath(); ctx.ellipse(sx, hy, hr, hr * 1.04, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.roundRect(sx - 190, hy + 190, 380, 330, 90); ctx.fill();
  // spiky hair-free: simple ear bumps
  ctx.beginPath(); ctx.arc(sx - hr + 6, hy + 10, 40, 0, 7); ctx.arc(sx + hr - 6, hy + 10, 40, 0, 7); ctx.fill();
  // phone glow on the lower face + bright eyes
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const gl = ctx.createRadialGradient(sx, hy + 260, 20, sx, hy + 260, 420); gl.addColorStop(0, 'rgba(120,190,255,0.35)'); gl.addColorStop(1, 'rgba(120,190,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, hy - 100, W, 900); ctx.restore();
  ctx.fillStyle = '#e8f4ff'; for (const dx of [-80, 80]) { ctx.beginPath(); ctx.ellipse(sx + dx, hy + 10, 22, 30, 0, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#0c0818'; for (const dx of [-80, 80]) { ctx.beginPath(); ctx.arc(sx + dx + 6, hy + 18, 12, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#e8f4ff'; ctx.fillRect(sx - 60, hy + 150, 120, 10);   // thin mouth line of light? subtle: a flat line
  // bubble swells
  const sc = lerp(0.3, 1, eb(seg(u, 0, 0.36)));
  BUBBLE(t, 640, 420, 780, 360, { sc, ox: 560, oy: hy - hr - 20, tailX: -120, speed: 2.4, seed: 18 });
}

// ---------- the timeline of shots ----------
let SHOTS = [];
function build() {
  const t = T(), L = Object.fromEntries(TL.lines.map(l => [l.id, l]));
  const jit = (tt, a) => shake(tt, a);
  const kBeard = (tt, t0) => eb(seg(tt, t0, t0 + 0.2));
  SHOTS = [
    // 1 · frame 1
    [0, tt => { const [dx, dy] = jit(tt, 3); cam(lerp(1.1, 1.18, seg(tt, 0, 1.0)), lerp(520, 560, seg(tt, 0, 1.0)), 1000, () => roomDay(tt, { sc: lerp(0.3, 1, eb(seg(tt, 0, 0.34))), keys: keysA }), 0.006 * Math.sin(tt * 7), dx, dy); }],
    // 2 · phone insert (picture change by 1.0 s): text BIG
    [1.0, tt => { const u = tt - 1.0; phoneBg(tt, 0.1); cam(lerp(1.0, 1.09, seg(u, 0, 1.6)), 540, 960, () => PHONE(tt, 540, 960, 4.4, { rot: 0.012 * Math.sin(tt * 6), dots: u > 0.95 ? eb(seg(u, 0.95, 1.2)) : 0, glow: false }), 0.004 * Math.sin(tt * 3)); }],
    // 3 · swing back to the cloud
    [2.45, tt => { const u = tt - 2.45, k = eio(seg(u, 0, 0.8)); cam(1.1, lerp(700, 560, k), lerp(1300, 760, k), () => roomDay(tt, { keys: [{ t: 2.4, eyes: 'wide', brow: 'raised', mouth: 'O', fx: ['sweat'], look: 0.8, lean: 0, tilt: -3, headDy: 3, bags: 1, armL: AT(340, 1090, 17)(625, 1450), armR: AT(340, 1090, 17)(835, 1450) }, { t: 2.8, tilt: 4, look: 0.9, headDy: 5 }] }), 0.01 * Math.sin(tt * 5)); }],
    // 4 · s2 lean-in, 2b pop, face falls
    [t.s2, tt => { const sh = jit(tt, 2), u = tt - t.s2; cam(lerp(1.02, 1.3, eio(seg(tt, t.s2, t.pop))), lerp(540, 480, seg(tt, t.s2, t.pop)), lerp(900, 800, seg(tt, t.s2, t.pop)), () => leanWorld(tt, { keys: keysLean, speed: lerp(2.4, 4.6, seg(tt, t.s2, t.pop)), bsc: tt < t.pop ? 1 : 0, bsx: undefined, cat: { dy: tt > 3.5 && tt < t.pop ? 4 : 0, tilt: tt > t.pop ? -8 : -3 * Math.sin(tt * 6), eyes: tt > t.pop ? 'dot' : 'wide', lid: tt > t.pop + 0.2 ? 0.5 : undefined, mouth: tt > t.pop ? 'line' : 'line' } }), 0, sh[0], sh[1]); }],
    [t.pop, tt => { const u = tt - t.pop; const z = lerp(1.3, 1.62, eio(seg(u, 0, 1.0))); cam(z, lerp(480, 330, seg(u, 0, 1)), lerp(800, 1000, seg(u, 0, 1)), () => { const pa = 1 - seg(u, 0.0, 0.05); leanWorld(tt, { keys: keysLean, bsc: u < 0.06 ? 1 + u * 3 : 0, bsx: 1.2, bsy: 0.8, balpha: pa, cat: { tilt: -8, eyes: 'dot', lid: 0.5 } }); popFX(tt, t.pop + 0.03, 540, 560, 420); }); }],
    // 5 · s3 on the knees
    [L.s3.start - 0.02, tt => { const u = tt - (L.s3.start - 0.02); const drop = 0 + 260 * eb(seg(u, 0.55, 0.85)); cam(lerp(1.0, 1.2, seg(u, 0, 1.7)), 520, 980, () => kneelWorld(tt, { drop, bsc: u > 1.12 ? eb(seg(u, 1.12, 1.4)) : 0, balpha: 1, keys: [
      { t: L.s3.start - 0.02, eyes: 'sad', brow: 'worried', mouth: 'frown', fx: ['sweat'], look: 0.2, lean: 0, tilt: 0, headDy: 0, bags: 1, armL: AT(470, 1010, 15)(320, 1250, [-4, -4]), armR: AT(470, 1010, 15)(620, 1250, [4, -4]) },
      { t: L.s3.start + 0.3, eyes: 'pinpoint', mouth: 'O', brow: 'worried', lean: 4, tilt: -4, headDy: 3, armL: AT(470, 1010, 15)(300, 1150, [-4, -4]), armR: AT(470, 1010, 15)(640, 1150, [4, -4]), dur: 0.18 },
      { t: L.s3.start + 0.6, eyes: 'pinpoint', mouth: 'wobble', lean: 12, tilt: -6, headDy: -4, armL: AT(470, 1010 + 260, 15)(440, 1540, [-4, -4]), armR: AT(470, 1010 + 260, 15)(600, 1540, [4, -4]), dur: 0.22 },
      { t: L.s3.start + 1.1, eyes: 'wide', brow: 'raised', mouth: 'small', lean: 6, tilt: 3, headDy: 1, dur: 0.2 },
      { t: L.s3.start + 1.4, eyes: 'wide', mouth: 'wobble', lean: 8, tilt: -3, headDy: 0 }] }), 0.008 * Math.sin(tt * 9)); }],
    // 6 · s4 montage: day → sunset → night, dots in/out, the cat's tiny beard
    [t.m1, tt => { const u = tt - t.m1, bs = u > 0.08 && u < 0.5 ? eb(seg(u, 0.08, 0.24)) : u >= 0.5 ? Math.max(0, 1 - seg(u, 0.5, 0.56)) : 0;
      cam(lerp(0.95, 1.05, seg(u, 0, 0.72)), 540, 1000, () => { roomDay(tt, { n: 0, bsc: bs, keys: [{ t: 7.6, eyes: 'dot', lid: 0.1, brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.3, lean: 0, tilt: 0, headDy: 0, bags: 1, armL: AT(340, 1090, 17)(625, 1450), armR: AT(340, 1090, 17)(835, 1450) }, { t: t.m1 + 0.12, eyes: 'wide', brow: 'raised', headDy: 3 }, { t: t.m1 + 0.5, eyes: 'dot', lid: 0.5, brow: 'worried', headDy: -2, tilt: 3 }] }); popFX(tt, t.m1 + 0.52, 520, 560, 360); }, 0.01 * Math.sin(tt * 6)); }],
    [t.m2, tt => { const u = tt - t.m2, bs = u > 0.1 && u < 0.5 ? eb(seg(u, 0.1, 0.26)) : u >= 0.5 ? Math.max(0, 1 - seg(u, 0.5, 0.56)) : 0;
      cam(lerp(1.35, 1.2, seg(u, 0, 0.72)), lerp(900, 800, seg(u, 0, 0.72)), 1300, () => { roomDay(tt, { n: 0.5, bsc: bs, drops: false, catTilt: -10 * Math.sin(u * 6), keys: [{ t: 8.3, eyes: 'dot', lid: 0.4, brow: 'worried', mouth: 'flat_down', fx: [], look: 0.3, lean: 3, tilt: 5, headDy: -3, bags: 1, armL: AT(340, 1090, 17)(625, 1450), armR: AT(340, 1090, 17)(835, 1450) }, { t: t.m2 + 0.15, eyes: 'wide', brow: 'raised', lid: 0, headDy: 1 }, { t: t.m2 + 0.5, eyes: 'dot', lid: 0.6, brow: 'worried', headDy: -4, tilt: 6 }] }); popFX(tt, t.m2 + 0.52, 520, 560, 360); }, 0, 0, 0); }],
    [t.m3, tt => { const u = tt - t.m3;
      cam(lerp(2.0, 2.3, seg(u, 0, 0.73)), 960, 1420, () => { roomDay(tt, { n: 1, bubble: false, drops: false, beard: kBeard(tt, t.beard), catTilt: 6 * Math.sin(u * 14), keys: [{ t: 9.1, eyes: 'dot', lid: 0.6, brow: 'worried', mouth: 'flat_down', fx: ['gloom'], look: 0.5, lean: 4, tilt: 6, headDy: -4, bags: 1, armL: AT(340, 1090, 17)(625, 1450), armR: AT(340, 1090, 17)(835, 1450) }] }); }, 0, 0, 0); }],
    // 7 · s5 rocking chair, eye twitch on FINE
    [L.s5.start - 0.03, tt => { const u = tt - (L.s5.start - 0.03), tw = u > 1.05 && u < 1.5 && Math.floor(u * 16) % 2 === 0;
      cam(lerp(1.28, 1.36, seg(u, 0, 1.9)), 400, 1130, () => tableWorld(tt, { bsc: 0, tiny: null, drops: true, keys: [
        { t: L.s5.start - 0.03, eyes: 'dot', lid: 0.3, brow: 'worried', mouth: 'flat_down', fx: ['sweat'], look: 0.5, lean: -6, tilt: 0, headDy: 0, bags: 1, ...GRIP },
        { t: L.s5.start + 0.25, lean: 6, tilt: 3, dur: 0.3 }, { t: L.s5.start + 0.55, lean: -6, tilt: -2, dur: 0.3 },
        { t: L.s5.start + 0.85, lean: 6, tilt: 2, eyes: tw ? 'squint' : 'pinpoint', mouth: 'smile', brow: 'worried', dur: 0.25 },
        { t: L.s5.start + 1.15, lean: -6, tilt: -2, eyes: tw ? 'squint' : 'pinpoint', dur: 0.25 }, { t: L.s5.start + 1.45, lean: 6, tilt: 2, eyes: tw ? 'squint' : 'pinpoint', dur: 0.25 }, { t: L.s5.start + 1.75, lean: -5, tilt: -2, dur: 0.25 }] }), 0.004 * Math.sin(tt * 8)); }],
    // 8 · s6 dots STAY: close on the phone (bubble grows in steps), then the wide shot (fills the ceiling, lamp swings, table shakes)
    [L.s6.start - 0.02, tt => { const u = tt - (L.s6.start - 0.02), st = [0.14, 0.2, 0.28, 0.4][Math.min(3, Math.floor(u / 0.4))];
      cam(lerp(1.7, 1.9, seg(u, 0, 1.55)), 520, 1330, () => tableWorld(tt, { bsc: st, speed: 3, keys: [{ t: 12.3, eyes: 'wide', lid: 0, brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.5, lean: 0, tilt: 0, headDy: 0, bags: 1, ...GRIP }, { t: 13.0, brow: 'raised', headDy: 2 }], tshake: shake(tt, 2, 40) }), 0.01 * Math.sin(tt * 12)); }],
    [13.9, tt => { const u = tt - 13.9, bs = lerp(0.4, 1, eo(seg(u, 0, 1.2))), sh = shake(tt, 5 * seg(u, 0, 1.2), 38);
      cam(lerp(1.0, 1.08, seg(u, 0, 1.78)), 540, 960, () => tableWorld(tt, { bsc: bs, lamp: 1, speed: 3.4, tshake: sh, keys: [{ t: 13.8, eyes: 'pinpoint', lid: 0, brow: 'worried', mouth: 'O', fx: ['sweat', 'gloom'], look: 0.3, lean: 0, tilt: 0, headDy: 0, bags: 1, ...GRIP }, { t: 14.4, headDy: 3, tilt: -3, dur: 0.2 }, { t: 15.0, headDy: -1, tilt: 3, dur: 0.2 }] }), 0, sh[0] * 0.6, sh[1] * 0.6); }],
    // 9 · s7 the paragraph: close, then the camera follows the scroll down and across
    [L.s7.start - 0.03, tt => { const u = tt - (L.s7.start - 0.03), r = seg(tt, T().scroll0, T().scroll1) * 0.5;
      cam(lerp(1.0, 1.04, seg(u, 0, 1.6)), 540, 960, () => tableWorld(tt, { bsc: 1, lamp: 0.2, scroll: r, speed: 3.6, keys: [{ t: 15.8, eyes: 'pinpoint', lid: 0, brow: 'worried', mouth: 'O', fx: ['sweat', 'gloom'], look: 0.3, lean: 0, tilt: 0, headDy: 0, bags: 1, ...GRIP }, { t: 16.5, headDy: 4, tilt: -4, mouth: 'wide', look: 0.9, dur: 0.2 }, { t: 17.0, headDy: -2, tilt: 5, mouth: 'O', dur: 0.2 }] }), 0.006 * Math.sin(tt * 9)); }],
    [17.55, tt => { const u = tt - 17.55, k = eio(seg(u, 0, 2.04)), r = seg(tt, T().scroll0, T().scroll1);
      cam(lerp(1.04, 1.0, k), 540, 960, () => tableWorld(tt, { bsc: 1, scroll: r, speed: 3.6, keys: [{ t: 17.5, eyes: 'pinpoint', lid: 0, brow: 'worried', mouth: 'wide', fx: ['sweat', 'gloom'], look: 0.9, lean: 0, tilt: 5, headDy: -1, bags: 1, ...GRIP }, { t: 18.1, headDy: 3, tilt: -6, look: 1, mouth: 'O', dur: 0.25 }, { t: 18.7, headDy: 0, tilt: 4, mouth: 'wide', dur: 0.25 }] }), 0.004 * Math.sin(tt * 6)); }],
    // 10 · 7b total stillness, only the dots pulse
    [t.still, tt => { const u = tt - t.still, pu = Math.max(0, Math.sin(Math.PI * seg(u, 0.18, 0.5))) + Math.max(0, Math.sin(Math.PI * seg(u, 0.62, 0.94)));
      cam(1.0, 540, 960, () => tableWorld(tt, { bsc: 1, scroll: 1, still: true, pulse: pu * 0.6, freeze: t.still, speed: 0, drops: false, keys: [{ t: 19.5, eyes: 'pinpoint', lid: 0, brow: 'worried', mouth: 'O', fx: ['sweat', 'gloom'], look: 0.6, lean: 0, tilt: 0, headDy: 0, bags: 1, ...GRIP }], hairJ: false, tiny: null })); }],
    // 11 · ping: the tiny bubble sways down, camera pushes in
    [t.ping, tt => { const u = tt - t.ping, k = seg(u, 0, 1.4); cam(lerp(1.0, 1.35, eio(k)), 540, lerp(960, 860, eio(k)), () => tableWorld(tt, { bsc: 1, balpha: 1 - seg(u, 0.6, 1.4), scroll: 1, scrollAlpha: 1 - seg(u, 0, 0.3), speed: 2.4, pulse: 0, drops: true, tiny: { t0: t.ping, t1: t.k }, keys: [{ t: 20.8, eyes: 'wide', lid: 0, brow: 'raised', mouth: 'small', fx: ['sweat'], look: 0.5, lean: 0, tilt: 0, headDy: 0, bags: 1, ...GRIP }, { t: 21.3, tilt: -5, look: 0.9, headDy: 2 }, { t: 21.8, tilt: 4, headDy: 0 }] }), 0.012 * Math.sin(tt * 3)); }],
    [t.ping + 1.45, tt => { const u = tt - (t.ping + 1.45), k = seg(u, 0, 1.05); cam(lerp(1.5, 1.7, eio(k)), 460, 1000, () => tableWorld(tt, { bsc: 0, scroll: 0, scrollAlpha: 0, speed: 2.4, drops: true, phone: false, tiny: { t0: t.ping, t1: t.k }, keys: [{ t: 22.3, eyes: 'wide', lid: 0, brow: 'raised', mouth: 'small', fx: ['sweat'], look: 0.7, lean: 0, tilt: -3, headDy: 0, bags: 1, ...GRIP }, { t: 22.8, tilt: 2, look: 0.9, headDy: 3, mouth: 'O' }] }), 0.01 * Math.sin(tt * 4)); }],
    // 12 · THE PUNCH: hard zoom lands on the "k", then Steve's reaction hold
    [t.k, tt => { const u = tt - t.k, z = lerp(2.2, 1.0, eo(seg(u, 0, 0.14))) + 0.05 * seg(u, 0.14, 0.88), fy = lerp(780, 960, eo(seg(u, 0, 0.14))); cam(z, 540, fy, () => punchWorld(tt, { keys: keysPunch, bsy: 1 + 0.02 * Math.sin(u * 30) * Math.exp(-u * 5) })); }],
    [L.s9.end, tt => { const u = tt - L.s9.end, z = lerp(1.04, 1.14, seg(u, 0, 0.7)); cam(z, 580, 1000, () => punchWorld(tt, { bsc: 1, keys: [{ t: 24.2, eyes: 'dot', lid: 0.6, mouth: 'line', brow: undefined, fx: ['gloom'], look: 0.6, bags: 1, lean: 0, tilt: -1, headDy: -2.5, arm: 'down' }, { t: 24.55, lid: 0.95, dur: 0.1 }, { t: 24.65, lid: 0.6, dur: 0.12 }, { t: 24.85, tilt: 1, dur: 0.4 }] })); }],
    // 13 · s10: the cloud deflates in silence, the beard falls off
    [L.s10.start - 0.03, tt => { const u = tt - (L.s10.start - 0.03), bs = 1 - eio(seg(tt, T().deflate, T().deflate + 1.2)), bf = seg(tt, T().beardfall, T().beardfall + 0.55); cam(lerp(1.3, 1.0, eio(seg(u, 0, 1.4))), lerp(600, 540, seg(u, 0, 1.4)), 1100, () => nightRoom(tt, { bsc: bs, bfall: bf, keys: keysNight }), 0.006 * Math.sin(tt * 5)); }],
    // 14 · the button: type, hold 1 s, delete, send "k"
    [T().type0 - 0.05, tt => { const u = tt - (T().type0 - 0.05); const tx = "Sounds great!!|Can't wait!!", full = tx.replace('|', ''), tp = T();
      let n = Math.round(full.length * seg(tt, tp.type0, tp.typed)); if (tt >= tp.del0) n = Math.round(full.length * (1 - seg(tt, tp.del0, tp.del1)));
      let inp = ''; if (tt >= tp.k1) inp = 'k'; else { const l1 = tx.split('|')[0]; inp = n <= l1.length ? full.slice(0, n) : l1 + '|' + full.slice(l1.length, n); }
      const press = tt >= tp.send && tt < tp.send + 0.18 ? 1 : 0, sent = tt >= tp.send + 0.12;
      phoneBg(tt, 1); const z = lerp(1.0, 1.1, seg(u, 0, 2.5)); cam(z, 540, 960, () => PHONE(tt, 540, 960, 4.4, { reply: sent && tt > tp.send + 0.3, input: sent ? '' : inp, press, caretOn: n > 0 && tt < tp.send, fly: sent && tt < tp.send + 0.3 ? seg(tt, tp.send + 0.12, tp.send + 0.3) : 0, rot: 0.01 * Math.sin(tt * 5), glow: false }), 0.003 * Math.sin(tt * 3)); }],
    // 15 · loop: smash cut across town, their bubble swells like frame 1
    [T().loop, tt => { const u = tt - T().loop, [dx, dy] = jit(tt, 5 * Math.exp(-u * 8)); cam(lerp(1.0, 1.05, seg(u, 0, 0.92)), 540, 960, () => silhouette(tt, u), 0.006 * Math.sin(tt * 7), dx, dy); }],
  ];
}

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1;
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
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
  TL.lines.forEach(l => { }); const lines = Object.fromEntries(TL.lines.map(l => [l.id, l])); TL.lines = TL.lines;
  EVT.T = { ...EVT.T, s2: lines.s2.start };
  window.DUR = DUR = TL.total; window.EV = EV = EVT.ev;
  build(); render(0); window.READY = true;
})();
