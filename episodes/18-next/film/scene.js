// UNIT 4B · 18 "One Percent" (Tập 9) — full film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// Script: ../script.md (gate 3 OK) · timings: voice/timeline.json · sfx times: events.json (read by mix.py too).
// Worlds reuse the approved v4 stills (stills.js): hook, climax (under the table), punch (seated). Full-bleed panel, title pill inside.
import { drawCharacter, paper, panel, nameTab, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { onTwos, boilFrame, ease } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const INK = '#2a2230', TITLE_Y = 232, PL_Y = 1640, FL = 1330, RED = '#e63946', SKIN = '#e2ac84';
let TL = null, EVT = null, DUR = 27.3, EV = [], L = {};

// ---------- helpers ----------
const clamp01 = k => Math.max(0, Math.min(1, k)), seg = (t, a, b) => clamp01((t - a) / (b - a)), lerp = (a, b, k) => a + (b - a) * k;
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
const step = (t, ks) => { let v = ks[0][1]; for (const [a, b] of ks) if (t >= a) v = b; return v; };
const spen = (t, seed, lw = 3) => { const p = new VPen(ctx, 0, 0, 1, { lw, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600', align = 'center') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
function cam(zoom, fx, fy, fn, rot = 0, dx = 0, dy = 0) { ctx.save(); ctx.translate(540 + dx, 960 + dy); if (rot) ctx.rotate(rot); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const blink1 = t => Math.floor(t * 2) % 2 === 0;   // the 1% blinks twice a second

// ---------- title + caption plate ----------
function title() {
  ctx.save(); ctx.font = '600 50px Fredoka'; const w = ctx.measureText("POV: your phone is at 1%").width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.9)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 48, w, 96, 48); ctx.fill();
  text("POV: your phone is at 1%", 540, TITLE_Y + 3, 50, '#fff6dc'); ctx.restore();
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
  s1: ['snuggles', ['One percent. One message.', 'One MAN.'], ['MAN'], 0.25], s2: ['steve', ['Okay. Nobody MOVE.'], ['MOVE'], 0.2],
  s3: ['steve', ["It's THIS close."], ['THIS'], 0.2], s4: ['snuggles', ['The other socket was', 'behind the fridge. Of COURSE.'], ['COURSE'], 0.2],
  s5: ['steve', ['Come ON!'], ['ON'], 0.25], s6: ['snuggles', ['Two percent.', 'He felt RICH.'], ['RICH'], 0.25],
  s7: ['steve', ['“On my WAY.” Send.'], ['WAY'], 0.2], s9: ['steve', ['…Thank you.'], ['Thank'], 0.7], s10a: ['snuggles', ['Plan B ran in', 'the FAMILY.'], ['FAMILY'], 0.3],
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
function drop(p, x, y, sz, rot = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot);
  p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 }); ctx.restore();
}
function flyDrops(t, hc, o = {}) {   // sweat thrown off the temple on parabolic arcs
  const { period = 0.55, dir = -1, n = 2, sz = 20, vx = 300, vy = -330, g = 1500, life = 0.6, ph0 = 0 } = o;
  for (let k = 0; k < n; k++) {
    const ph = ((t / period) + k / n + ph0) % 1, age = ph * period; if (age > life) continue;
    const x = hc[0] + dir * (hc[2] * 0.86) + dir * vx * age, y = hc[1] - hc[2] * 0.45 + vy * age + 0.5 * g * age * age;
    drop(spen(t, 60 + k), x, y, sz * (1 - age / life * 0.3), dir * (0.4 + age * 2), 1 - age / life * 0.6);
  }
}
function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
function faceGlow(hc, rgba = 'rgba(110,190,255,0.5)', dx = 0, dy = 160) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 8, 0, 7); ctx.clip();
  const g = ctx.createRadialGradient(hc[0] + dx, hc[1] + dy, 20, hc[0] + dx, hc[1] + dy, hc[2] * 1.5); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.fillStyle = g; ctx.fillRect(hc[0] - 400, hc[1] - 400, 800, 800); ctx.restore();
}
function handAt(x, y, r) { ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.85, 0, 0, 7); ctx.fill(); ctx.stroke(); }
function socketAt(x, y, k = 1) {
  const p = spen(0.1, 51); p.part(roundPoly([[x - 70 * k, y - 95 * k], [x + 70 * k, y - 95 * k], [x + 70 * k, y + 95 * k], [x - 70 * k, y + 95 * k]], 18 * k), '#f4f1ea', { shade: 0.1, lw: 6 });
  ctx.fillStyle = INK; for (const dy of [-38, 38]) { ctx.beginPath(); ctx.roundRect(x - 34 * k, y + dy * k - 8 * k, 68 * k, 16 * k, 8 * k); ctx.fill(); }
}
function plug(x, y, k = 1, rot = 0, flip = 1) {   // body + two prongs; flip -1 points left
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(flip, 1); const p = spen(0.1, 61);
  for (const dy of [-32, 32]) p.part(roundPoly([[40 * k, dy * k - 8 * k], [110 * k, dy * k - 8 * k], [110 * k, dy * k + 8 * k], [40 * k, dy * k + 8 * k]], 3 * k), '#c8ccd4', { shade: 0.15, lw: 5 });
  p.part(roundPoly([[-60 * k, -62 * k], [40 * k, -62 * k], [40 * k, 62 * k], [-60 * k, 62 * k]], 18 * k), '#e9ebf2', { shade: 0.12, lw: 6 });
  ctx.restore();
}
function cable(pts, wd = 16) {   // white cable with ink outline through a polyline (quadratic smoothed)
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [c, w] of [[INK, wd], ['#f2f2f2', wd / 2]]) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
    ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); ctx.stroke();
  }
  ctx.restore();
}
const wob = (a, b, n, amp, ph) => { const out = []; for (let i = 0; i <= n; i++) { const u = i / n; out.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + amp * Math.sin(u * Math.PI * 3 + ph) * Math.sin(u * Math.PI)]); } return out; };   // vibrating straight cable
function batteryIcon(cx, cy, w, h, fill, label, col = '#fff') {
  ctx.save(); ctx.lineWidth = 9; ctx.strokeStyle = col; ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 22); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(cx + w / 2 + 4, cy - h * 0.2, 16, h * 0.4, 6); ctx.fill();
  ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 14, cy - h / 2 + 14, w * 0.12, h - 28, 10); ctx.fill(); ctx.restore();
  text(label, cx + w * 0.05, cy + 4, h * 0.62, col, 'Fredoka');
}
function bolt(x, y, k, col = '#ffd23c') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); [[8, -30], [-14, 4], [0, 4], [-8, 30], [16, -6], [2, -6]].forEach(([a, b], i) => i ? ctx.lineTo(a * k, b * k) : ctx.moveTo(a * k, b * k)); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function star(x, y, r1, r2, n = 8, col = '#ffd23c', rot = 0) { ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n, rr = i % 2 ? r2 : r1; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function phoneAt(x, y, w, h, rot, screen) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const q = spen(0.1, 9);
  q.part(roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], w * 0.12), '#2a3050', { shade: 0.1, lw: 6 });
  ctx.fillStyle = '#10161f'; ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 14, w - 20, h - 28, 14); ctx.fill();
  screen && screen(w, h); ctx.restore();
}
const redPhone = t => (w, h) => { ctx.fillStyle = '#2b0d12'; ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 14, w - 20, h - 28, 14); ctx.fill(); text('1%', 0, 4, w * 0.5, blink1(t) ? '#ff4a55' : '#7a2530'); };
const greenPhone = (w, h, big = 0.5) => { ctx.fillStyle = '#10261a'; ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 14, w - 20, h - 28, 14); ctx.fill(); text('2%', 0, h * 0.08, w * big, '#7dff9a'); bolt(0, -h * 0.28, w * 0.012); };

// ---------- characters ----------
// Steve with world-space hand targets (plug, phone…). th: whole-body rotation about the feet; pose.lean about the hips.
function SV(t, X, Y, s, p, o = {}) {
  const th = o.th || 0, lr = (p.lean || 0) * Math.PI / 180, tc = Math.cos(th), ts = Math.sin(th), pose = { hair: 2, bags: 1, ...p };
  const lx = 22 * s * Math.sin(lr), ly = -38 * s - 22 * s * Math.cos(lr), shx = X + lx * tc - ly * ts, shy = Y + lx * ts + ly * tc;
  const A = th + lr, ca = Math.cos(A), sa = Math.sin(A);
  const loc = (wx, wy) => { const dx = wx - shx, dy = wy - shy; return [(dx * ca + dy * sa) / s, (dx * sa - dy * ca) / s]; };
  for (const [k, a] of [['armL', o.L], ['armR', o.R]]) if (a) { const [hx, hy] = loc(a[0], a[1]); pose[k] = { hand: [hx, hy], bend: a[2] || [0, -3] }; }
  ctx.save(); if (th) { ctx.translate(X, Y); ctx.rotate(th); ctx.translate(-X, -Y); }
  drawCharacter(ctx, 'steve', X, Y, s, pose, { frame: boilFrame(t) }); ctx.restore();
  const hx0 = 42 * s * Math.sin(lr), hy0 = -38 * s - 42 * s * Math.cos(lr) - (p.headDy || 0) * s;
  return [X + hx0 * tc - hy0 * ts, Y + hx0 * ts + hy0 * tc, 15 * s];
}
function PAW(x1, y1, x2, y2, w) {
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = w + 10; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.strokeStyle = CAST.snuggles.color; ctx.lineWidth = w; ctx.stroke(); ctx.fillStyle = '#e89aac'; ctx.beginPath(); ctx.ellipse(x2, y2, w * 0.3, w * 0.22, Math.atan2(y2 - y1, x2 - x1), 0, 7); ctx.fill(); ctx.restore();
}
function CATD(t, x, y, s, pose, o = {}) {   // o: rot (about the feet), sx/sy squash-stretch
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(o.sx || 1, o.sy || 1); ctx.translate(-x, -y);
  drawCharacter(ctx, 'snuggles', x, y, s, { eyes: 'wide', look: 0.1, mouth: 'line', tail: 0.6 * Math.sin(t * 2.2), ...pose }, { frame: boilFrame(t) }); ctx.restore();
}

// ---------- the room (wide shots) ----------
function fridge(t, x0, fallT = null) {
  const p = spen(t, 21), w = 320, top = 470;
  p.part(roundPoly([[x0, top], [x0 + w, top], [x0 + w, FL], [x0, FL]], 22), '#dfe9ef', { shade: 0.14, lw: 6 });
  p.line([[x0 + 4, top + 250], [x0 + w - 4, top + 250]], 5);
  p.part(roundPoly([[x0 + w - 56, top + 40], [x0 + w - 36, top + 40], [x0 + w - 36, top + 200], [x0 + w - 56, top + 200]], 8), '#9aa4b0', { shade: false, lw: 4 });
  p.part(roundPoly([[x0 + w - 56, top + 290], [x0 + w - 36, top + 290], [x0 + w - 36, top + 560], [x0 + w - 56, top + 560]], 8), '#9aa4b0', { shade: false, lw: 4 });
  ctx.save(); ctx.translate(x0 + 120, top + 400); ctx.rotate(-0.06); ctx.fillStyle = '#fffdf0'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-52, -40, 104, 84, 6); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 3; for (const y of [-18, 0, 18]) { ctx.beginPath(); ctx.moveTo(-34, y); ctx.lineTo(30, y); ctx.stroke(); } ctx.restore();
  ctx.fillStyle = '#4a9be0'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x0 + 205, top + 330, 44, 44, 8); ctx.fill(); ctx.stroke();
  star(x0 + 72, top + 330, 24, 11, 5, '#ffd23c');
  // the red magnet: sits on the door, or falls (fallT = seconds since it let go)
  let mx = x0 + 80, my = top + 470;
  if (fallT !== null && fallT >= 0) { const g = 2600; my = Math.min(FL - 20, top + 470 + 0.5 * g * fallT * fallT); const b = fallT - Math.sqrt(2 * (FL - 20 - top - 470) / g); if (b > 0) my = FL - 20 - Math.abs(160 * Math.sin(b * 11)) * Math.exp(-b * 5); mx = x0 + 80 - 18 * Math.min(fallT, 0.6) - (b > 0 ? 26 * Math.min(b, 0.6) : 0); }
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(mx, my, 20, 0, 7); ctx.fill(); ctx.stroke();
}
function roomW(t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, FL); g.addColorStop(0, '#ffe3b0'); g.addColorStop(1, '#f6c996'); ctx.fillStyle = g; ctx.fillRect(-900, -900, W + 1800, FL + 900);
  ctx.fillStyle = '#c99a62'; ctx.fillRect(-900, FL, W + 1800, H + 1000 - FL);
  ctx.strokeStyle = 'rgba(90,60,40,0.22)'; ctx.lineWidth = 3; for (const y of [FL + 100, FL + 230, FL + 390]) { ctx.beginPath(); ctx.moveTo(-900, y); ctx.lineTo(W + 900, y); ctx.stroke(); }
  const p = spen(t, 3); p.line([[-900, FL], [W + 900, FL]], 5);
  p.part(roundPoly([[730, 330], [1030, 330], [1030, 700], [730, 700]], 8), '#9fd8f7', { shade: false, lw: 6 });
  ctx.fillStyle = '#ffeaa0'; ctx.beginPath(); ctx.arc(920, 430, 40, 0, 7); ctx.fill(); p.line([[880, 330], [880, 700]], 5); p.line([[730, 515], [1030, 515]], 5);
  if (!o.hideB) socketAt(170, 1100, 0.9);      // the other socket: behind the fridge
  if (!o.hideA) socketAt(985, 950, 0.9);       // the first socket, right wall
  fridge(t, o.fx ?? 20, o.fall ?? null);
}
const phoneHand = (t, x, y) => phoneAt(x, y, 120, 200, 0.1, redPhone(t));
// the stretch rig: Steve with the phone in one hand, the plug in the other, cable taut between
function stretchRig(t, m, o) {
  const { X, Y, lean, plugX, plugY = 950, ph = [330, 880], face = {} } = o;
  const hc = SV(m, X, Y, 10.4, { eyes: 'wide', brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.7, lean, ...face }, { L: ph, R: [plugX - 40, plugY] });
  cable(wob([ph[0] + 40, ph[1] + 70], [plugX - 54, plugY], 8, o.vib || 0, t * 40), 14);
  plug(plugX, plugY, 0.9); phoneHand(t, ph[0], ph[1]); handAt(plugX - 40, plugY, 34); handAt(ph[0] + 6, ph[1] + 40, 30);
  return hc;
}

// ---------- worlds ----------
// HOOK (frame 1 and the loop): extreme close-up, phone (or the power bank) up to camera, plug a finger from the socket
function bankFace(t, w, h) {
  ctx.fillStyle = '#15191f'; ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 14, w - 20, h - 28, 14); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i === 0 ? (blink1(t) ? '#ff4a55' : '#7a2530') : '#2a2f38'; ctx.beginPath(); ctx.arc(-w * 0.27 + i * w * 0.18, -h * 0.4, w * 0.045, 0, 7); ctx.fill(); }
  text('1%', 0, h * 0.04, w * 0.62, blink1(t) ? '#ff4a55' : '#7a2530');
}
function hookW(t, o = {}) {
  const m = onTwos(t), bank = !!o.bank;
  ctx.fillStyle = '#ffe3b0'; ctx.fillRect(-900, -900, W + 1800, H + 1800);
  const g = ctx.createLinearGradient(0, -900, 0, H + 900); g.addColorStop(0, '#ffe3b0'); g.addColorStop(1, '#f6b985'); ctx.fillStyle = g; ctx.fillRect(-900, -900, W + 1800, H + 1800);
  const p = spen(t, 3);
  p.part(roundPoly([[600, 330], [1010, 330], [1010, 700], [600, 700]], 8), '#9fd8f7', { shade: false, lw: 6 });
  ctx.fillStyle = '#ffeaa0'; ctx.beginPath(); ctx.arc(900, 420, 44, 0, 7); ctx.fill(); ctx.fillStyle = '#ffb36a'; ctx.fillRect(606, 600, 398, 94);
  p.line([[805, 330], [805, 700]], 5); p.line([[600, 515], [1010, 515]], 5);
  ctx.fillStyle = 'rgba(120,20,30,0.18)'; ctx.fillRect(-900, -900, W + 1800, H + 1800);
  const s = 20, X = 330, hc0 = 900, Y = hc0 + 80 * s, [jx, jy] = shake(m, 2.5, 23);
  const phx = 885 + jx, phy = 780 + jy, pw = 130, ph = 250;
  const q = spen(t, 9); q.part(roundPoly([[phx - pw, phy - ph], [phx + pw, phy - ph], [phx + pw, phy + ph], [phx - pw, phy + ph]], 36), bank ? '#4a5568' : '#2a3050', { shade: 0.1, lw: 7 });
  if (bank) { ctx.save(); ctx.translate(phx, phy); bankFace(t, 2 * pw, 2 * ph); ctx.restore(); }
  else { ctx.fillStyle = '#2b0d12'; ctx.beginPath(); ctx.roundRect(phx - pw + 14, phy - ph + 18, 2 * pw - 28, 2 * ph - 36, 24); ctx.fill(); batteryIcon(phx - 14, phy, 190, 150, '#2b0d12', '1%', blink1(t) ? '#ff4a55' : '#8a3038'); }
  const armL = { hand: [(phx - 40 - X) / s, (Y - 60 * s - (phy + 330)) / s], bend: [0, -3] };
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'wide', brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.5, hair: 2, bags: 1, armL, armR: { hand: [0, -4], bend: [0, 0] } }, { frame: boilFrame(m) });
  const hc = [X, hc0, 15 * s];
  glowBlob(X + 200, 1300, 330, 'rgba(255,40,55,0.18)');
  ctx.save(); ctx.strokeStyle = 'rgba(255,70,80,0.85)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 5, -0.75, 0.75); ctx.stroke(); ctx.restore();
  glowBlob(phx, phy, 520, 'rgba(255,40,55,0.35)'); handAt(phx - 20, phy + 265, 56);
  flyDrops(t, [X, hc0, 300], { dir: -1, n: 3, period: 0.7, sz: 26, vx: 380, vy: -300 }); flyDrops(t, [X, hc0, 300], { dir: 1, n: 2, period: 0.9, sz: 22, vx: 260, vy: -380, ph0: 0.3 });
  socketAt(880, 1400, 1.05);
  const strain = o.strain ?? kf(t, [[0, 0], [0.5, 10], [1.0, 22]]), px = 640 + strain + 3 * Math.sin(m * 37);
  cable([[865, 1030], [(865 + px) / 2 + 20, 1190], [px - 80, 1405]], 16);
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(740, 1300); ctx.lineTo(760, 1295); ctx.stroke(); ctx.restore();
  plug(px, 1405, 1.1); handAt(px - 80, 1405, 62);
  for (const dy of [-34, 0, 34]) { ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(px - 22, 1405 + dy, 34, 15, 0, 0, 7); ctx.fill(); ctx.stroke(); }
  CATD(m, 150, 1390 + 34 * 7, 7, { eyes: 'wide', look: 0.9 + 0.1 * Math.sin(t * 3), mouth: 'line', lid: kf(t % 2.2, [[0, 0], [1.9, 0], [2.0, 0.8], [2.1, 0]]) });
}

// GAP insert: giant plug and socket, a finger's width apart, cable twanging
function gapW(t, o = {}) {
  const m = onTwos(t), k = 2.3, sx = 790, sy = 960, kp = 2.1;
  ctx.fillStyle = '#f6d9a8'; ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(540, 900, 200, 540, 900, 1100); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(90,40,30,0.28)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const px = 330 + o.dx, py = sy;
  cable(wob([px - 60 * kp, py], [-80, py + 150], 14, o.vib || 0, t * 50), 30);
  socketAt(sx, sy, k); plug(px, py, kp); handAt(px - 60 * kp + 20, py, 120);
  for (const dy of [-70, 0, 70]) { ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(px + 22, py + dy, 74, 32, 0, 0, 7); ctx.fill(); ctx.stroke(); }
  if (o.fingers) {   // the other hand shows the gap with two fingers
    const a = o.fingers; ctx.save(); ctx.globalAlpha = clamp01(a * 1.5);
    for (const [fx, sgn] of [[560, -1], [650, 1]]) { ctx.save(); ctx.translate(fx + sgn * (1 - a) * 90 + sgn * 8, 560 - (1 - a) * 120); ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-30, -330, 60, 400, 30); ctx.fill(); ctx.stroke(); ctx.restore(); }
    ctx.restore();
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.setLineDash([14, 10]); ctx.globalAlpha = clamp01(a * 2) * (0.6 + 0.4 * Math.sin(t * 14)); ctx.beginPath(); ctx.moveTo(595, 800); ctx.lineTo(595, 1130); ctx.moveTo(640, 800); ctx.lineTo(640, 1130); ctx.stroke(); ctx.restore();
  }
  flyDrops(t, [540, 330, 260], { dir: 1, n: 2, period: 0.6, sz: 22, vx: 100, vy: -120, ph0: 0.1 });
}

// TABLE: low camera under the table (the approved climax still)
function tableW(t, o = {}) {
  const m = onTwos(t), tp = spen(t, 41);
  const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#ffe3b0'); gr.addColorStop(1, '#f6b985'); ctx.fillStyle = gr; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.fillStyle = '#c99a62'; ctx.fillRect(-300, 1520, W + 600, 900); spen(t, 5).line([[-300, 1520], [W + 300, 1520]], 5);
  for (const [x0, x1] of [[-30, 120], [960, 1110]]) tp.part(roundPoly([[x0, 280], [x1, 280], [x1, 1560], [x0, 1560]], 8), '#8a6a48', { shade: 0.12, lw: 6 });
  tp.part(roundPoly([[-40, -300], [1120, -300], [1120, 330], [-40, 330]], 8), '#a98660', { shade: 0.15, lw: 6 });
  ctx.fillStyle = 'rgba(60,40,30,0.25)'; ctx.fillRect(0, 300, W, 40);
  const s = 16, th = 0.5 + (o.thw || 0), X = -13, Y = 2123, sn = Math.sin(th), cs = Math.cos(th);
  const loc = (dx, dy) => [(dx * cs + dy * sn) / s, (dx * sn - dy * cs) / s], sh = [X + 60 * s * sn, Y - 60 * s * cs], hcx = X + 80 * s * sn, hcy = Y - 80 * s * cs;
  socketAt(985, 1400, 0.8);
  const plx = o.plugX, [hu, hv] = loc(plx + 10 - sh[0], 1405 - sh[1]), [lu, lv] = loc(330 - sh[0], 1470 - sh[1]);
  cable([[plx - 60, 1405], [plx - 20, 1500], [600, 1570], [300, 1580]], 16);
  ctx.save(); ctx.translate(X, Y); ctx.rotate(th); ctx.translate(-X, -Y); ctx.beginPath(); ctx.rect(X - 600, Y - 3000, 1200, 3000 - 36 * s); ctx.clip();
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'pinpoint', brow: 'worried', mouth: 'line', fx: ['sweat'], look: 0, hair: 2, bags: 1, ...o.face, armL: { hand: [lu, lv], bend: [2, -2] }, armR: { hand: [hu, hv], bend: [0, -2] } }, { frame: boilFrame(m) });
  ctx.restore();
  const mx = hcx - 48, my = hcy + 88;
  phoneAt(mx, my + 135, 170, 260, 0.12, o.charged ? (w, h) => greenPhone(w, h, 0.45) : redPhone(t));
  ctx.save(); ctx.fillStyle = '#fffdf8'; ctx.strokeStyle = INK; ctx.lineWidth = 3; for (const dx of [-46, -12, 22, 56]) { ctx.beginPath(); ctx.roundRect(mx + dx - 12, my - 4, 24, 22, 4); ctx.fill(); ctx.stroke(); } ctx.restore();
  faceGlow([hcx, hcy, 240], o.charged ? 'rgba(150,255,170,0.3)' : 'rgba(255,90,100,0.28)', 0, 140);
  if (!o.noDrops) for (const [x, y, z, rr] of [[880, 800, 28, 0.5], [320, 760, 26, -0.6], [860, 1010, 22, 1.0]]) drop(spen(t, 70 + x), x, y + 14 * Math.sin(t * 7 + x), z, rr);
  plug(plx, 1405, 0.8); handAt(plx - 60, 1405, 44);
  if (o.spark) { const a = o.spark; star(915, 1405, 22 + 44 * a, 14, 8, '#ffd23c', t * 4); glowBlob(915, 1405, 260, `rgba(255,230,120,${0.55 * a})`); }
  // the cat
  const c = o.cat; CATD(m, c.x, 1545, 7, { eyes: 'dot', lid: c.lid ?? 0.45, look: c.look ?? 0.3, mouth: 'line' }, { rot: c.rot || 0, sx: c.sx, sy: c.sy });
  return [hcx, hcy, 240];
}

// SIT: the approved punch still (seated Steve, hoodie, phone in lap, cat at the right)
function sitW(t, o = {}) {
  const m = onTwos(t), hood = CAST.steve.color;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffe3b0'); g.addColorStop(1, '#f6b985'); ctx.fillStyle = g; ctx.fillRect(-900, -900, W + 1800, H + 1800);
  const p = spen(t, 3);
  p.part(roundPoly([[600, 330], [1010, 330], [1010, 700], [600, 700]], 8), '#9fd8f7', { shade: false, lw: 6 });
  ctx.fillStyle = '#ffeaa0'; ctx.beginPath(); ctx.arc(900, 420, 44, 0, 7); ctx.fill(); ctx.fillStyle = '#ffb36a'; ctx.fillRect(606, 600, 398, 94); p.line([[805, 330], [805, 700]], 5); p.line([[600, 515], [1010, 515]], 5);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,236,160,0.22)'; ctx.beginPath(); ctx.moveTo(600, 700); ctx.lineTo(1010, 700); ctx.lineTo(560, 1500); ctx.lineTo(60, 1500); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#c99a62'; ctx.fillRect(-900, 1430, W + 1800, 1200); spen(t, 5).line([[-900, 1430], [W + 900, 1430]], 5);
  const s = 14, X = 330, Y = 2042, d = o.d || 0, phx = X + 40, phy = 1420 + (o.phoneDy || 0);
  const plugIn = o.plug !== 'out', ph = o.plug === 'out' ? 0 : 1;
  if (plugIn) plug(875 - (o.plugSlide || 0), 1330, 0.7);
  socketAt(985, 1330, 0.85);
  if (plugIn) cable([[875 - (o.plugSlide || 0) - 42, 1330], [820, 1470], [740, 1590], [560, 1590], [phx, phy + 110]], 16);
  else { cable([[900, 1585], [760, 1590], [560, 1590], [phx, phy + 110]], 16); plug(o.plugX ?? 960, o.plugY ?? 1590, 0.7, o.plugRot ?? 0.2); }
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 15; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(X + sx * 40, 1500); ctx.lineTo(X + sx * 250, 1535); ctx.lineTo(X + sx * 80, 1600); ctx.stroke(); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(X + sx * 62, 1604, 22, 12, 0, 0, 7); ctx.fill(); }
  ctx.restore();
  ctx.save(); ctx.translate(0, d);
  const hp = spen(t, 18);
  hp.part(roundPoly([[X - 120, 1190], [X + 120, 1190], [X + 185, 1540 - d], [X - 185, 1540 - d]], 40), hood, { shade: 0.18, lw: 6 });
  hp.line([[X, 1230], [X, 1300]], 5); hp.part(roundPoly([[X - 90, 1400], [X + 90, 1400], [X + 100, 1500 - d], [X - 100, 1500 - d]], 30), hood, { shade: 0.3, lw: 4 });
  ctx.save(); ctx.beginPath(); ctx.rect(-900, -900, 3000, 1185 + 900); ctx.clip();
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'deadpan', lid: 0.55, mouth: 'line', look: 1, tilt: 14, hair: 2, bags: 1, fx: ['gloom', 'sweat'], ...o.face }, { frame: boilFrame(m) });
  ctx.restore();
  hp.part(roundPoly([[X - 85, 1175], [X + 85, 1175], [X + 100, 1215], [X - 100, 1215]], 20), hood, { shade: 0.3, lw: 5 });
  // arms + phone (lap, or hugged to the chest like a baby)
  const hug = o.hug ?? 0, hpx = lerp(phx, X, hug), hpy = lerp(phy, 1330, hug), hhy = lerp(phy + 120, 1330, hug);
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 15; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [sx, hx] of [[-1, hpx - lerp(55, 70, hug)], [1, hpx + lerp(60, 70, hug)]]) { ctx.beginPath(); ctx.moveTo(X + sx * 118, 1250); ctx.lineTo(X + sx * 190, 1400); ctx.lineTo(hx, hhy); ctx.stroke(); } ctx.restore();
  if (o.halo) glowBlob(hpx, hpy, 520 + 40 * Math.sin(t * 5), `rgba(150,255,170,${o.halo})`);
  ctx.save(); ctx.translate(hpx, hpy); ctx.rotate(lerp(0.08, -0.1, hug)); const q = spen(t, 9);
  q.part(roundPoly([[-78, -125], [78, -125], [78, 125], [-78, 125]], 20), '#2a3050', { shade: 0.1, lw: 6 });
  if (o.screen === 'green') { ctx.fillStyle = '#10261a'; ctx.beginPath(); ctx.roundRect(-68, -113, 136, 226, 12); ctx.fill(); text('2%', 0, 14, 64, '#7dff9a'); bolt(0, -55, 1.4); }
  else { ctx.fillStyle = '#0b0b12'; ctx.beginPath(); ctx.roundRect(-68, -113, 136, 226, 12); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.ellipse(0, -10, 44, 52, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.2)'; for (const dx of [-16, 14]) { ctx.beginPath(); ctx.ellipse(dx, -22, 7, 4, 0, 0, 7); ctx.fill(); } }
  ctx.restore();
  handAt(hpx - lerp(55, 70, hug), hhy, 34); handAt(hpx + lerp(60, 70, hug), hhy, 34);
  ctx.restore();
  // cat
  const c = o.cat || {}, cx = c.x ?? 760, cy = 1590;
  CATD(m, cx, cy, 8, { eyes: 'dot', lid: 0.55, look: -0.6, mouth: 'line', tail: 0.3 + 0.4 * Math.sin(t * 2.4), ...c.pose }, { sx: c.sx, sy: c.sy, rot: c.rot });
  if (c.lick) { const a = Math.sin(m * 14) * 0.5 + 0.5; PAW(800, 1480, lerp(776, 768, a), lerp(1368, 1392, a), 34); }
  if (c.paws) PAW(cx - 120, cy - 22, cx - 330, cy - 6, 30);
  return [X, 922, 15 * s];
}

// PHONE INSERT: giant phone, chat screen, thumb. o: { typed (0..9), tap, sending, black (0..1), reflect (0..1) }
function phoneIns(t, o = {}) {
  const gx = ctx.createLinearGradient(0, 0, 0, H); gx.addColorStop(0, '#ffdca0'); gx.addColorStop(1, '#f0a977'); ctx.fillStyle = gx; ctx.fillRect(0, 0, W, H);
  glowBlob(540, 900, 800, 'rgba(255,255,255,0.35)');
  const cx = 540, cy = 930, w = 640, h = 1040;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.03); const q = spen(t, 9);
  q.part(roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], 70), '#2a3050', { shade: 0.1, lw: 8 });
  const sw = w - 48, shh = h - 56; ctx.fillStyle = o.black >= 1 ? '#05050a' : '#eaf1f6'; ctx.beginPath(); ctx.roundRect(-sw / 2, -shh / 2, sw, shh, 50); ctx.fill();
  if (o.black === undefined || o.black < 1) {
    const live = 1 - (o.black || 0);
    ctx.save(); ctx.beginPath(); ctx.roundRect(-sw / 2, -shh / 2, sw, shh, 50); ctx.clip();
    if (o.black > 0) { const k = eio(o.black); ctx.fillStyle = '#05050a'; ctx.fillRect(-sw / 2, -shh / 2, sw, shh); ctx.save(); ctx.scale(1, 1 - k * 0.995); ctx.translate(0, 0); }
    ctx.fillStyle = '#d9e6ef'; ctx.fillRect(-sw / 2, -shh / 2, sw, 90); text('2%', sw / 2 - 90, -shh / 2 + 46, 40, '#1d8f46'); bolt(sw / 2 - 160, -shh / 2 + 46, 0.8);
    // chat: a sent bubble appears once Send is tapped
    if (o.sending) { ctx.fillStyle = '#4aa3e8'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(sw / 2 - 360, -shh / 2 + 150, 330, 100, 40); ctx.fill(); ctx.stroke(); text('On my way', sw / 2 - 195, -shh / 2 + 200, 44, '#fff'); text('Sending…', sw / 2 - 150, -shh / 2 + 290, 34, '#5b6573', 'Patrick Hand', 0, '400');
      ctx.save(); ctx.translate(sw / 2 - 330, -shh / 2 + 290); ctx.strokeStyle = '#5b6573'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, 18, t * 8, t * 8 + 4.4); ctx.stroke(); ctx.restore(); }
    // input bar
    ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-sw / 2 + 24, shh / 2 - 190, sw - 160, 90, 45); ctx.fill(); ctx.stroke();
    const full = 'On my way', n = Math.round((o.typed ?? 0)), tx = full.slice(0, o.sending ? 0 : n); text(tx, -sw / 2 + 60, shh / 2 - 144, 46, INK, 'Fredoka', 0, '600', 'left');
    if (!o.sending && Math.floor(t * 4) % 2 === 0) { ctx.fillStyle = INK; const tw = (ctx.font = '600 46px Fredoka', ctx.measureText(tx).width); ctx.fillRect(-sw / 2 + 60 + tw + 4, shh / 2 - 175, 4, 62); }
    const bp = o.tap ? 0.9 : 1; ctx.fillStyle = '#4aa3e8'; ctx.beginPath(); ctx.arc(sw / 2 - 72, shh / 2 - 145, 52 * bp, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(sw / 2 - 90, shh / 2 - 170); ctx.lineTo(sw / 2 - 40, shh / 2 - 145); ctx.lineTo(sw / 2 - 90, shh / 2 - 120); ctx.closePath(); ctx.fill();
    if (o.black > 0) ctx.restore();
    ctx.restore();
  }
  if (o.reflect) { // Steve's flat face reflected in the black glass
    ctx.save(); ctx.globalAlpha = 0.65 * o.reflect; ctx.beginPath(); ctx.roundRect(-sw / 2, -shh / 2, sw, shh, 50); ctx.clip();
    drawCharacter(ctx, 'steve', 0, 840, 12, { eyes: 'wide', lid: 0.3, mouth: 'line', look: 0, hair: 2, bags: 1, fx: ['sweat'] }, { frame: boilFrame(t) }); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-sw / 2, -shh / 2 + 100); ctx.lineTo(sw / 2, -shh / 2 - 60); ctx.lineTo(sw / 2, -shh / 2 + 300); ctx.lineTo(-sw / 2, -shh / 2 + 480); ctx.fill(); ctx.restore();
  }
  ctx.restore();
  if (o.thumb !== undefined) {   // thumb coming in from the bottom right
    const k = o.thumb, tx = lerp(1000, 760, eo(Math.min(1, k * 1.3))), ty = lerp(1900, 1480 + 40 * (o.tap ? 1 : 0), eo(Math.min(1, k * 1.3)));
    ctx.save(); ctx.translate(tx, ty); ctx.rotate(-0.55); ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-70, -170, 140, 520, 70); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f6d3bb'; ctx.beginPath(); ctx.roundRect(-40, -150, 80, 80, 36); ctx.fill(); ctx.stroke(); ctx.restore();
  }
}

// PLUG INSERT: the plug sliding out of the socket (giant), cable running off to the left
function popW(t, o = {}) {
  ctx.fillStyle = '#f6d9a8'; ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(540, 900, 200, 540, 900, 1100); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(90,40,30,0.28)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const k = 2.3, sx = 800, sy = 950, kp = 2.1, px = 640 - o.out + (o.fly || 0) * 160, py = sy + (o.fly || 0) * (o.fly || 0) * 420, rot = (o.fly || 0) * 1.4;
  cable([[px - 60 * kp, py], [px - 260, py + 60], [-80, 1180 + 100 * (o.fly || 0)]], 30);
  plug(px, py, kp, rot); socketAt(sx, sy, k);
  if (o.popped) { const a = o.popped; star(sx - 150, sy, 40 + 90 * a, 20, 9, '#fff3a0', a * 3); }
}

// DRAWER: Steve yanks a drawer open, a power bank inside
function drawerW(t, o = {}) {
  const m = onTwos(t);
  const g = ctx.createLinearGradient(0, 0, 0, FL); g.addColorStop(0, '#ffe3b0'); g.addColorStop(1, '#f6c996'); ctx.fillStyle = g; ctx.fillRect(-900, -900, W + 1800, FL + 900);
  ctx.fillStyle = '#c99a62'; ctx.fillRect(-900, FL, W + 1800, H + 1000 - FL); const p = spen(t, 3); p.line([[-900, FL], [W + 900, FL]], 5);
  // cabinet
  p.part(roundPoly([[600, 880], [1130, 880], [1130, FL], [600, FL]], 14), '#b98a5a', { shade: 0.15, lw: 6 });
  p.part(roundPoly([[580, 840], [1150, 840], [1150, 890], [580, 890]], 10), '#d9d2c4', { shade: 0.1, lw: 6 });
  const dx = -o.open;
  p.part(roundPoly([[640 + dx, 930], [1090 + dx, 930], [1090 + dx, 1100], [640 + dx, 1100]], 12), '#c79a68', { shade: 0.12, lw: 6 });
  ctx.fillStyle = '#e8e2d4'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(790 + dx, 1000, 150, 26, 13); ctx.fill(); ctx.stroke();
  if (o.open > 40) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, FL); ctx.clip(); if (!o.holding) { phoneAt(900 + dx, 940, 90, 190, 1.4, bankFace.bind(null, t)); } ctx.restore(); }
  const Xs = o.X, bx = o.bank;
  const hc = SV(m, Xs, FL, 10.4, { eyes: o.eyes || 'dot', lid: o.lid ?? 0.4, brow: 'worried', mouth: o.mouth || 'line', fx: ['sweat'], look: 0.8, lean: o.lean || 0, ...o.face }, { L: o.L, R: o.R });
  if (o.holding) { phoneAt(o.hold[0], o.hold[1], 150, 300, 0.12, (w, h) => bankFace(t, w, h)); handAt(o.hold[0] - 10, o.hold[1] + 150, 36); }
  CATD(m, 190, 1560, 7, { eyes: 'dot', lid: 0.55, look: 0.5, mouth: 'line' });
  PAW(190 + 50, 1560 - 80, 190 + 40 + 10 * Math.sin(m * 14), 1560 - 150 - 14 * Math.sin(m * 14), 28);
}
// POWER BANK INSERT
function bankIns(t, o = {}) {
  const gx = ctx.createLinearGradient(0, 0, 0, H); gx.addColorStop(0, '#ffdca0'); gx.addColorStop(1, '#f0a977'); ctx.fillStyle = gx; ctx.fillRect(0, 0, W, H); glowBlob(540, 900, 800, 'rgba(255,255,255,0.35)');
  const cx = 540, cy = 900, w = 560, h = 860; ctx.save(); ctx.translate(cx + (o.sx || 0), cy + (o.sy || 0)); ctx.rotate(-0.04); const q = spen(t, 9);
  q.part(roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], 60), '#cdd5df', { shade: 0.12, lw: 8 });
  ctx.fillStyle = '#15191f'; ctx.beginPath(); ctx.roundRect(-w / 2 + 40, -h / 2 + 50, w - 80, 220, 30); ctx.fill();
  for (let i = 0; i < 4; i++) { const on = i < o.leds; ctx.fillStyle = on ? (o.leds === 1 ? '#ff4a55' : '#58e07a') : '#2a2f38'; ctx.beginPath(); ctx.arc(-w * 0.27 + i * w * 0.18, -h / 2 + 160, 34, 0, 7); ctx.fill(); if (on) { glowBlob(-w * 0.27 + i * w * 0.18, -h / 2 + 160, 120, o.leds === 1 ? 'rgba(255,60,70,0.4)' : 'rgba(80,230,120,0.35)'); } }
  if (o.txt) text('1%', 0, -h / 2 + 340, 90, '#d6232f');
  ctx.fillStyle = '#e8edf3'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, h * 0.25, o.press ? 74 : 84, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
  if (o.thumbK !== undefined) { const k = eo(o.thumbK), tx = lerp(900, 620, k), ty = lerp(1800, 1180 + (o.press ? 24 : 0), k); ctx.save(); ctx.translate(tx, ty); ctx.rotate(-0.5); ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-70, -170, 140, 520, 70); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#f6d3bb'; ctx.beginPath(); ctx.roundRect(-40, -150, 80, 80, 36); ctx.fill(); ctx.stroke(); ctx.restore(); }
}

// ---------- shots ----------
let SHOTS = [];
const T = () => EVT.T;
function build() {
  const s = L, D = 'dot';
  SHOTS = [
    // 1 · 0.0 hook: frame 1 = approved still; the 1% blinks, sweat flies, the plug strains
    [0, t => cam(kf(t, [[0, 1.0], [1.0, 1.05]], eo), 540, 960, () => hookW(t))],
    // 2 · wide: Steve stretched across the room on tiptoe
    [1.0, t => { const m = onTwos(t); cam(kf(t, [[1.0, 1.0], [2.45, 1.07]]), 540, 920, () => { roomW(t); const lean = kf(m, [[1.0, 9], [2.4, 17]]), up = kf(m, [[1.0, 0], [1.4, 0], [1.7, 16], [2.4, 18]]);
      stretchRig(t, m, { X: 440, Y: FL - up, lean, plugX: 790 + kf(m, [[1.0, 0], [2.4, 14]]) + 2 * Math.sin(m * 33), vib: 4 });
      CATD(m, 790, 1560, 7, { eyes: 'wide', look: -0.4 }); }); }],
    // 3 · insert: plug a finger's width short, strains, snaps back (cable twang)
    [2.45, t => { const u = t - 2.45, snap = 3.1, dx = t < snap ? kf(t, [[2.45, 0], [3.05, 36]], eo) + 2.5 * Math.sin(onTwos(t) * 40) : 36 * Math.exp(-(t - snap) * 9) * Math.cos((t - snap) * 40);
      cam(kf(t, [[2.45, 1.0], [3.6, 1.06]]), 540, 960, () => gapW(t, { dx, vib: t < snap ? 3 : 46 * Math.exp(-(t - snap) * 6) })); }],
    // 4 · s2 wide: inches, then freezes on MOVE; the cat freezes mid-step too
    [3.6, t => { const m = onTwos(Math.min(t, 5.25)); cam(kf(t, [[3.6, 1.0], [5.0, 1.06]]), 540, 920, () => { roomW(t); const wob2 = t < 5.25 ? 0.7 * Math.sin(m * 28) : 0;
      stretchRig(t, m, { X: 440, Y: FL - 18, lean: 17 + kf(m, [[3.6, 0], [4.4, 1.5], [5.0, 0.5]]), plugX: 804 + kf(m, [[3.6, 0], [5.0, 12]]) + wob2, vib: 3, face: { mouth: m > 4.8 ? 'O' : 'small' } });
      const cx = 790 - kf(t, [[3.6, 0], [4.6, 34]], eo); CATD(onTwos(t), cx, 1560, 7, { eyes: 'wide', look: -0.4 }); if (t > 4.5) PAW(cx - 40, 1560 - 80, cx - 80 + 6 * Math.sin(t * 22), 1560 - 150 - 6 * Math.cos(t * 22), 30); }); }],
    [5.0, t => { const m = onTwos(Math.min(t, 5.25)); cam(kf(t, [[5.0, 1.2], [6.4, 1.3]]), 600, 840, () => { roomW(t);
      stretchRig(t, m, { X: 440, Y: FL - 18, lean: 18, plugX: 816, vib: 0.8 * Math.sin(t * 50) * seg(t, 5.0, 5.3), face: { mouth: 'O', eyes: 'pinpoint' } });
      const cx = 756; CATD(onTwos(t), cx, 1560, 7, { eyes: 'wide', look: -0.4, tail: 0.2 }); PAW(cx - 40, 1560 - 80, cx - 82 + 7 * Math.sin(t * 24), 1560 - 152 - 7 * Math.cos(t * 24), 30);
      drop(spen(t, 8), 520 + 8 * Math.sin(t * 9), 520 + ((t * 700) % 700) * 0.28, 22, 0, 0.9); }); }],
    // 5 · s3 slide to the floor in three poses, plug stays the same finger short
    [6.4, t => { const m = onTwos(t), k = seg(m, 6.62, 7.05), e = eio(k), th = e * Math.PI / 2, Xs = lerp(440, -236, e), Ys = lerp(FL - 18, 1300, e), tl = -e * 90, PX = 806;
      cam(kf(t, [[6.4, 1.0], [7.3, 1.04]]), 540, 1000, () => { roomW(t);
        const flo = k > 0.5, ph = flo ? [200, 1400] : [lerp(330, 300, e), lerp(880, 1000, e)];
        if (flo) { cable([[PX - 54, 950], [800, 1180], [830, 1420], [500, 1450], [260, 1430]], 14); phoneAt(ph[0], ph[1], 120, 200, 1.45, redPhone(t)); }
        SV(m, Xs, Ys, 10.7, { eyes: 'wide', brow: 'worried', mouth: k > 0.2 ? 'small' : 'O', fx: ['sweat'], look: 0.7, lean: 17 * (1 - e), tilt: tl }, { th, R: [PX - 40, 950], L: [lerp(330, 900, e), lerp(880, 1090, e)] });
        if (!flo) { cable(wob([lerp(370, 330, e), lerp(950, 1290, e)], [PX - 54, 950], 8, 3, t * 40), 14); phoneAt(ph[0], ph[1], 120, 200, lerp(0.1, 0.6, e), redPhone(t)); }
        plug(PX, 950, 0.9); handAt(PX - 40, 950, 34);
        if (k > 0.6) { const a = seg(k, 0.6, 1); ctx.save(); ctx.globalAlpha = a; for (const fx of [882, 920]) { ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(fx - 13, 985, 26, 120, 13); ctx.fill(); ctx.stroke(); } handAt(901, 1100, 40); ctx.restore(); }
        CATD(m, 756, 1560, 7, { eyes: 'wide', look: -0.4 }); }); }],
    // 6 · insert: two fingers show the gap, cable twangs
    [7.3, t => { const u = t - 7.3, tw = t > 8.15 ? 40 * Math.exp(-(t - 8.15) * 8) * Math.cos((t - 8.15) * 42) : 0; cam(kf(t, [[7.3, 1.0], [8.6, 1.1]]), 600, 940, () => gapW(t, { dx: 36 + 2 * Math.sin(onTwos(t) * 30) + tw, fingers: seg(t, 7.3, 7.6), vib: Math.abs(tw) })); }],
    // 7 · s4 the fridge is dragged in scrapes; a magnet drops
    [8.6, t => { const m = onTwos(t), pull = kf(m, [[8.75, 0], [8.95, 48], [9.15, 48], [9.35, 96], [9.55, 96], [9.75, 144], [9.95, 144]], eo), fx = 20 + pull * 1.6, Xs = 560 + 0.9 * (fx - 20);
      const back = Math.max(0, Math.sin(Math.PI * ((m * 5) % 1))) * 0 + (pull % 48 > 0 && pull % 48 < 46 ? 8 : 0);
      cam(kf(t, [[8.6, 1.0], [10.0, 1.06]]), 500, 950, () => { roomW(t, { fx, fall: t > 9.3 ? t - 9.3 : null, hideB: false });
        SV(m, Xs, FL, 10.4, { eyes: 'pinpoint', brow: 'worried', mouth: 'wide', fx: ['sweat'], look: -0.6, lean: 12 + back }, { L: [fx + 330, 880, [0, -3]], R: [fx + 330, 980, [0, -3]] });
        CATD(m, 700, 1560, 7, { eyes: 'wide', look: -0.9 }); for (let i = 0; i < 3; i++) { const a = (t * 3 + i / 3) % 1; if (t > 8.75 && t < 10) ctx.fillStyle = 'rgba(120,90,60,0.5)', ctx.fillRect(fx + 330 + 8 + a * 40, FL - 6 - a * 24, 14, 6); } }); }],
    // 8 · reveal: socket behind the fridge, plug a hand short
    [10.0, t => { const m = onTwos(t), reach = kf(m, [[10.0, 0], [10.6, 10], [11.0, 14]]); cam(kf(t, [[10.0, 1.2], [11.6, 1.3]]), 470, 900, () => { roomW(t, { fx: 260, fall: 9 });
        const Xs = 740, hc = SV(m, Xs, FL, 10.4, { eyes: D, lid: 0.35, brow: 'worried', mouth: 'line', fx: ['sweat'], look: -0.7, lean: -16 }, { L: [412 + reach, 1100], R: [930, 900] });
        cable(wob([456 + reach, 1100], [930, 960], 8, 2, t * 30), 14); plug(392 + reach, 1100, 0.9, 0, -1); handAt(414 + reach, 1100, 32); phoneAt(950, 880, 120, 200, -0.1, redPhone(t)); handAt(930, 930, 30);
        CATD(m, 640, 1560, 7, { eyes: 'wide', look: -0.9 }); }); }],
    // 9 · 4b the silent third: contortion under the table; the cat watches, then lies on the cable
    [s.s4.end, t => { const m = onTwos(t), flop = seg(t, 12.45, 12.7); cam(kf(t, [[11.6, 1.0], [12.5, 1.07]]), 540, 960, () => tableW(t, { plugX: 690 + 14 * seg(t, 11.6, 12.4), thw: 0.012 * Math.sin(m * 26), face: { mouth: 'line' },
        cat: { x: lerp(720, 400, eio(flop)), rot: -1.4 * eb(flop), lid: 0.4 } })); }],
    [12.5, t => { const m = onTwos(t), flop = seg(t, 12.45, 12.75); cam(kf(t, [[12.5, 1.3], [13.3, 1.4]]), 560, 1250, () => tableW(t, { plugX: 704 + 8 * Math.sin(m * 30), thw: 0.012 * Math.sin(m * 26), noDrops: true,
        cat: { x: lerp(720, 400, eio(flop)), rot: -1.4 * eb(flop), lid: 0.4 } })); }],
    // 10 · s5 the jab: spark, ding, "2%"
    [13.3, t => { const j = seg(t, 13.62, 13.72), plx = 704 + 91 * eb(j), sp = t >= 13.72 && t < 13.95 ? 1 - seg(t, 13.72, 13.95) : 0, [dx, dy] = shake(t, 9 * sp, 45);
      cam(kf(t, [[13.3, 1.0], [13.7, 1.08], [14.5, 1.12]]), 560, 1050, () => tableW(t, { plugX: plx, spark: sp, charged: t >= 13.78, noDrops: false, face: { eyes: t < 13.7 ? 'pinpoint' : 'wide', mouth: t < 13.7 ? 'wide' : 'line' }, cat: { x: 400, rot: -1.4, lid: 0.4 } }), 0, dx, dy); }],
    // 11 · s6 relief push-in on his face, light pulses
    [14.5, t => { const m = onTwos(t); cam(kf(t, [[14.5, 1.05], [15.7, 1.4]]), 600, 1060, () => tableW(t, { plugX: 795, charged: true, thw: 0.01 * Math.sin(m * 6), face: { eyes: D, lid: kf(t, [[14.5, 0.3], [15.0, 0.75]]), brow: undefined, mouth: t > 14.9 ? 'smile' : 'O', fx: [], look: 0.2 }, noDrops: true, cat: { x: 400, rot: -1.4, lid: 0.5 } })); }],
    [15.7, t => { const m = onTwos(t); cam(kf(t, [[15.7, 1.0], [17.5, 1.08]]), 460, 1100, () => sitW(t, { plug: 'in', screen: 'green', hug: seg(t, 15.7, 16.0), halo: 0.35 + 0.15 * Math.sin(t * 6), phoneDy: 0,
        d: kf(t, [[15.7, 0], [16.0, -10], [16.9, 24], [17.5, 12]]), face: { eyes: D, lid: 0.75, mouth: 'smile', brow: undefined, tilt: 8, look: 0, fx: ['sweat'] }, cat: { lick: true } })); }],
    // 12 · s7 the message: type, tap Send, "Sending…"
    [17.5, t => { const n = kf(onTwos(t), [[17.55, 0], [18.15, 9]], x => x), tap = t > 18.25 && t < 18.42, sending = t >= 18.3; cam(kf(t, [[17.5, 1.0], [18.7, 1.05]]), 540, 960, () => phoneIns(t, { typed: Math.floor(n), tap, sending, thumb: seg(t, 17.5, 17.85) })); }],
    // 13 · 7b the cat stands and stretches ON the cable in 3 poses; the plug is dragged out of the socket
    [18.7, t => { const m = onTwos(t), ph = m < 18.95 ? 0 : m < 19.2 ? 1 : 2, slide = kf(m, [[19.0, 0], [19.25, 8], [19.5, 48]]);
      const C = [{ x: 790, sx: 1, sy: 1, rot: 0, lid: 0.3, hd: 0 }, { x: 785, sx: 0.95, sy: 1.2, rot: -0.08, lid: 0.15, hd: -8 }, { x: 740, sx: 1.35, sy: 0.82, rot: -0.42, lid: 0.95, hd: 6 }][ph];
      cam(kf(t, [[18.7, 1.0], [19.55, 1.06]]), 520, 1120, () => sitW(t, { plug: 'in', plugSlide: slide, screen: 'green', hug: 1, halo: 0.25, d: 8,
        face: { eyes: D, lid: 0.7, mouth: 'smile', brow: undefined, tilt: 8, look: 0.3 }, cat: { x: C.x, sx: C.sx, sy: C.sy, rot: C.rot, pose: { eyes: 'dot', lid: C.lid, look: -0.6, headDy: C.hd, tail: 1 }, paws: ph === 2 } })); }],
    [19.55, t => { const out = kf(onTwos(t), [[19.55, 0], [19.8, 18], [19.95, 70]], x => x), pop = t > 19.95 ? seg(t, 19.95, 20.1) : 0, fly = t > 19.95 ? seg(t, 19.95, 20.1) : 0;
      cam(kf(t, [[19.55, 1.0], [20.1, 1.06]]), 540, 960, () => { popW(t, { out, popped: pop > 0 ? pop : 0, fly }); const m = onTwos(t); CATD(m, 330, 2150 - 60 * fly, 12, { eyes: 'dot', lid: 0.9, look: -0.6, mouth: 'O' }, { rot: -0.3, sx: 1.2, sy: 0.85 }); }); }],
    // 14 · 8 power-down: the screen collapses to a dot, Steve's face fades in on the black glass
    [20.1, t => { const bl = seg(t, 20.2, 20.5), rf = seg(t, 20.75, 21.2); cam(kf(t, [[20.1, 1.0], [21.2, 1.07]]), 540, 960, () => phoneIns(t, { sending: true, black: bl, reflect: bl >= 1 ? rf : 0 })); }],
    // 15 · s9 THE PUNCH: head turn to the cat, flat; the cat licks its paw
    [s.s9.start, t => { const m = onTwos(t), turn = seg(m, 21.3, 21.7); cam(kf(t, [[21.2, 1.0], [23.1, 1.05]]), 470, 1060, () => sitW(t, { plug: 'out', screen: 'black', cat: { lick: true },
        face: { look: lerp(-0.7, 1, turn), tilt: lerp(-4, 14, turn), lid: lerp(0.35, 0.55, turn) } })); }],
    // 16 · s10a button: yank the drawer, the power bank
    [23.1, t => { const m = onTwos(t), open = kf(m, [[23.35, 0], [23.5, 150], [23.65, 128]], eo), grab = seg(t, 23.7, 24.1), X = 400; const hold = [lerp(1000, 520, eio(grab)), lerp(1000, 760, eio(grab))];
      cam(kf(t, [[23.1, 1.0], [24.3, 1.1]]), 600, 950, () => drawerW(t, { X, open: t < 23.65 ? open : 128 - 128 * 0 * grab, holding: grab > 0.8, hold: [520, 760], L: [t < 23.7 ? 640 - open + 30 : lerp(640, 540, grab), t < 23.7 ? 1010 : lerp(1010, 880, grab)], R: [t < 23.7 ? 640 - open + 30 : 600, 1010], lean: -8, eyes: D, lid: 0.35 })); }],
    [24.3, t => { const m = onTwos(t), k = seg(t, 24.35, 24.55), press = t > 24.55 && t < 24.7;
      const leds = t < 24.55 ? 0 : t < 24.8 ? 4 : t < 25.0 ? 3 : t < 25.2 ? 2 : 1; cam(kf(t, [[24.3, 1.0], [25.4, 1.08]]), 540, 960, () => bankIns(t, { leds: t < 24.6 ? 0 : leds, press, thumbK: k, txt: t > 25.25 })); }],
    // 17 · loop: push-in on the frame-1 composition, the power bank where the phone was
    [25.4, t => cam(kf(t, [[25.4, 0.9], [27.0, 1.0]], eio), 540, 960, () => hookW(t, { bank: true, strain: 0 }))],
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
  L = Object.fromEntries(TL.lines.map(l => [l.id, l]));
  window.DUR = DUR = TL.total; window.EV = EV = EVT.ev;
  build(); render(0); window.READY = true;
})();
