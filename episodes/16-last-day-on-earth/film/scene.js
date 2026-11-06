// UNIT 4B · 16 "Last Day on Earth" (Tập 7) — 9:16 film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// Script: ../script.md (approved). Sets: bed (night) · kitchen (night→morning) · desk (night) · hallway. Frame 1 = Steve's face in the phone glow;
// last 0.55 s smash-cuts back to it (loop). Silent rows 3b / 9 / 12b; row 8 has a 0.6 s bleep after the voice.
// Layout: PREPRODUCTION #21 safe area (title y 230/290, panel PY 320 PH 1300, captions y 1500).
import { drawCharacter, paper, panel, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { sum, idle, wordChunk, ease, onTwos, boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 320, PW = 1000, PH = 1300, INK = '#2a2230', TITLE_Y = [230, 290], CAP_Y = 1500, CAM_Y = PY + PH / 2 - 70;
const TITLE = ['The news said: World War 3.', 'So nothing matters.'];
const SLEEVE = CAST.steve.color;

const LINE_DEFS = [   // id, char, caption, gap after
  ['16_s01', 'steve', 'Two A.M. The news said World War THREE could start any day.', 0.45],
  ['16_s02', 'steve', 'Experts said: be PREPARED.', 0.3],
  ['16_s03', 'steve', 'Prepared for WHAT?', 1.4],                                  // 0.6 + silent 3b 0.8
  ['16_s04', 'steve', 'If the world ends tomorrow... nothing MATTERS.', 0.6],
  ['16_s05', 'steve', 'Gym? CANCELLED.', 0.35],
  ['16_s06', 'steve', 'Diet? GONE.', 0.35],
  ['16_s07', 'steve', 'Credit card? MAXED!', 0.45],
  ['16_s08', 'steve', 'And ANOTHER thing, #@$%&!', 1.6],                          // bleep 0.6 + silent row 9 1.0
  ['16_s10', 'steve', 'Morning. Birds. SUNSHINE.', 0.35],
  ['16_s11', 'steve', 'No... WAR?', 0.45],
  ['16_s12', 'steve', '...Oh NO.', 1.7],                                          // 0.8 + silent 12b 0.9
  ['16_s13', 'steve', "The world didn't end. My JOB did.", 0.7],
  ['16_p14', 'penny', 'Rent is due Friday. That still MATTERS.', 0.0],
];
const IN_SCENE = new Set(['16_s03', '16_s08', '16_s12', '16_p14']);
let LINES = [], DUR = 0, T = {}, EV = [], SHOTS = [], VOICE = {}, WORDS = {};
const L_ = id => LINES.find(l => l.id === id);
const end = id => L_(id).t + VOICE[id].dur;

// ---------- helpers ----------
const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const lerp = (a, b, k) => a + (b - a) * k;
const spen = (t, seed) => { const p = new VPen(ctx, 0, 0, 1, { lw: 2.6, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
function withCamera(zoom, fx, fy, fn, rot = 0) {
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.translate(540, CAM_Y); if (rot) ctx.rotate(rot); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore();
}
function hand(text, x, y, size, rot = 0, color = INK) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px "Fredoka"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore();
}
function sfxText(text, x, y, size, rot = 0, fill = '#ffd84a') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.22; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0); ctx.restore();
}
const pop = (t, t0, d = 0.18) => ease.outBack(seg(t, t0, t0 + d));
const armTo = (X, shY, sc, hx, hy, bend = [0, -4]) => ({ hand: [(hx - X) / sc, (shY - hy) / sc], bend });
const headC = (x, y, s, sitU = 0, dy = 0) => [x, y - (80 - sitU + dy) * s, 15 * s];   // head centre + radius in screen px
function teardrop(p, x, y, sz, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 });
  ctx.restore();
}
function speakingEnv(id, t) {
  const v = VOICE[id], L = L_(id); if (!v || !L) return -1;
  const ts = Math.floor(t * 8) / 8 - L.t; if (ts < 0 || ts > v.dur) return -1;
  return v.env[Math.min(v.env.length - 1, Math.floor(ts * 24))] || 0;
}
function mouthFor(char, t) {
  for (const L of LINES) {
    if (L.char !== char || !IN_SCENE.has(L.id)) continue;
    const e = speakingEnv(L.id, t);
    if (e >= 0) return char === 'steve' ? (e > 0.5 ? 'scream' : 'wide') : (e > 0.5 ? 'wide' : 'small');
  }
  return null;
}
// a character with breathing, a slow sway and a blink; lip-sync only on in-scene lines
function who(id, x, y, s, t, pose = {}, opts = {}) {
  const tq = onTwos(t), n = Math.floor(tq * 12), ph = Math.round(x) % 17;
  const base = { expr: 'neutral', ...pose };
  const sway = { lean: 0.9 * Math.sin(tq * 2.1 + ph), tilt: 1.1 * Math.sin(tq * 1.6 + ph * 0.7) };
  const p = sum(base, idle(tq, x), opts.noSway ? {} : sway);
  const m = mouthFor(id, tq); if (m) p.mouth = m;
  if ((n + ph) % 31 < 1 && !opts.noBlink && !['closed'].includes(p.eyes) && p.eyes !== 'pinpoint') p.eyes = 'closed';
  drawCharacter(ctx, id, x, y, s, p, { frame: boilFrame(t) });
  return p;
}
function crumbs(t, t0, x, y, n = 14, spread = 260, col = ['#fffefc', '#7a4a2a', '#e8b6c8']) {
  const a = t - t0; if (a < 0 || a > 0.7) return;
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI * (0.1 + 0.8 * ((i * 37) % 13) / 13), v = spread * (0.5 + ((i * 53) % 7) / 7);
    const px = x + Math.cos(ang) * v * a, py = y + Math.sin(ang) * v * a + 900 * a * a;
    ctx.fillStyle = col[i % col.length]; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, py, 9 + (i % 3) * 3, 0, 7); ctx.fill(); ctx.stroke();
  }
}
function frosting(t, hc, k = 1) {   // cake frosting on the face (same as the approved still 3)
  if (k <= 0) return;
  const Fr = spen(t, 77), [hx, hy, hr] = hc;
  for (const [dx, dy, rx, ry] of [[-0.62, 0.7, 24, 14], [0.0, 0.92, 38, 16], [-0.15, -0.72, 34, 16]]) Fr.part(ellipsePts(hx + dx * hr, hy + dy * hr, rx, ry, 16), '#fffefc', { shade: 0.06, lw: 3.5 });
  const drip = 1 + 0.25 * Math.sin(t * 5);
  for (const [dx, dy, len] of [[-0.15, -0.65, 44], [-0.15, 0.95, 46]]) Fr.part(roundPoly([[hx + dx * hr - 9, hy + dy * hr], [hx + dx * hr + 9, hy + dy * hr], [hx + dx * hr + 8, hy + dy * hr + len * drip], [hx + dx * hr - 8, hy + dy * hr + len * drip]], 8), '#fffefc', { shade: 0.06, lw: 3.5 });
  for (const [dx, dy] of [[0.25, 0.3], [-0.3, 0.2], [0.7, 0.2], [0.1, 0.75]]) Fr.dot(hx + dx * hr, hy + dy * hr, 6, 5, '#7a4a2a');
}

// ---------- phone screens (local coords, 310 x 520) ----------
function phone(t, mode, cx, cy, sc = 1, rot = 0, o = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sc, sc);
  const pw = 310, ph = 520, flick = 0.42 + 0.06 * Math.sin(t * 17);
  if (o.glow !== false) { ctx.save(); const gl = ctx.createRadialGradient(0, 0, 40, 0, 0, 640); gl.addColorStop(0, `rgba(120,200,255,${flick})`); gl.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = gl; ctx.fillRect(-900, -900, 1800, 1800); ctx.restore(); }
  const q = spen(t, 9);
  q.part(roundPoly([[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [pw / 2, ph / 2], [-pw / 2, ph / 2]], 36), '#1a1e32', { shade: false, lw: 6 });
  q.part(roundPoly([[-pw / 2 + 16, -ph / 2 + 22], [pw / 2 - 16, -ph / 2 + 22], [pw / 2 - 16, ph / 2 - 22], [-pw / 2 + 16, ph / 2 - 22]], 20), '#e8f4ff', { shade: false, lw: 2 });
  ctx.save(); ctx.beginPath(); ctx.rect(-pw / 2 + 16, -ph / 2 + 22, pw - 32, ph - 44); ctx.clip();
  const sy = o.scroll || 0;
  if (mode === 'war' || mode === 'maybe') {
    const words = mode === 'war' ? ['WORLD', 'WAR 3:', 'ANY DAY', 'NOW?'] : ['EXPERTS:', 'MAYBE', 'NEXT', 'YEAR'];
    if (mode === 'war') { hand('Local cat', 0, -420 + sy, 40, 0, '#8a8f9a'); hand('stuck in tree', 0, -380 + sy, 36, 0, '#8a8f9a'); hand('Weather: mild', 0, -300 + sy, 40, 0, '#8a8f9a'); hand('Stocks: meh', 0, -260 + sy, 36, 0, '#8a8f9a'); }
    const k = mode === 'maybe' ? pop(t, o.t0 || 0, 0.2) : 1;
    ctx.save(); ctx.translate(0, sy * 0.0); ctx.scale(k, k);
    const y0 = mode === 'war' ? -80 + sy : -80;
    q.part(roundPoly([[-pw / 2 + 16, -ph / 2 + 22], [pw / 2 - 16, -ph / 2 + 22], [pw / 2 - 16, -ph / 2 + 92], [-pw / 2 + 16, -ph / 2 + 92]], 12), '#d9382c', { shade: false, lw: 2 });
    hand('BREAKING', 0, -ph / 2 + 58, 38, 0, '#fff');
    words.forEach((w, i) => hand(w, 0, y0 + i * 74, mode === 'maybe' ? 54 : 58, 0, i === 3 ? '#d9382c' : INK));
    ctx.restore();
  } else if (mode === 'expert') {
    q.part([[-140, -240], [140, -240], [140, 240], [-140, 240]], '#c9d4e0', { shade: false, lw: 2 });
    q.part(roundPoly([[-120, -150], [120, -150], [120, 180], [-120, 180]], 20), '#8f99a8', { shade: 0.1, lw: 4 });
    hand('BUNKER', 0, -110, 44, 0, '#fff');
    q.part(roundPoly([[-70, 60], [70, 60], [60, 250], [-60, 250]], 30), '#2f3a55', { shade: 0.1, lw: 5 });
    const bob = Math.sin(t * 9) * 5;
    q.part(ellipsePts(0, -10 + bob, 52, 52, 28), '#f3d3b4', { shade: 0.08, lw: 4 });
    q.part(ellipsePts(-20, -14 + bob, 15, 11, 14), '#ffffff', { shade: false, lw: 3 }); q.part(ellipsePts(20, -14 + bob, 15, 11, 14), '#ffffff', { shade: false, lw: 3 });
    q.line([[-26, 14 + bob], [0, 28 + bob], [26, 14 + bob]], 5);
    q.line([[60, 100], [100, 40 + bob * 2]], 16, '#2f3a55'); q.part(roundPoly([[84, 20 + bob * 2], [114, 20 + bob * 2], [114, 52 + bob * 2], [84, 52 + bob * 2]], 8), '#f3d3b4', { shade: false, lw: 3 });
    q.part(roundPoly([[90, -2 + bob * 2], [102, -2 + bob * 2], [102, 24 + bob * 2], [90, 24 + bob * 2]], 5), '#f3d3b4', { shade: false, lw: 3 });
    hand('BE PREPARED!', 0, -196, 36, 0, '#d9382c');
  } else if (mode === 'inbox') {
    q.part([[-140, -240], [140, -240], [140, -170], [-140, -170]], '#2f6ac8', { shade: false, lw: 2 }); hand('INBOX (1)', 0, -204, 40, 0, '#fff');
    for (const [i, nm, sb] of [[0, 'Gary', 'RE: And ANOTHER thing'], [1, 'Mom', 'Dinner Sunday?'], [2, 'Gym', 'We miss you :('], [3, 'Bank', 'Your balance']]) {
      const yy = -110 + i * 120 + (i === 0 ? 0 : 0);
      if (i === 0) q.part([[-140, yy - 52], [140, yy - 52], [140, yy + 58], [-140, yy + 58]], '#ffe3de', { shade: false, lw: 2 });
      hand(nm, -70, yy - 10, 40, 0, i === 0 ? '#d9382c' : INK); hand(sb, 0, yy + 30, i === 0 ? 25 : 28, 0, i === 0 ? '#d9382c' : '#6b6470');
    }
    q.dot(-128, -128, 8, 8, '#d9382c');
  }
  ctx.restore(); ctx.restore();
}
function thumb(t, x, y, rot = -0.4) {   // a sleeved forearm with a hand dot, poking up into the phone
  const p = spen(t, 12), bob = 10 * Math.sin(t * 7);
  ctx.save(); ctx.translate(x, y + bob); ctx.rotate(rot);
  p.line([[0, 700], [0, 0]], 78, INK); p.line([[0, 700], [0, 0]], 66, SLEEVE); p.dot(0, -10, 44, 40, '#fffdf8');
  ctx.restore();
}

// ---------- BED (night) ----------
function bedSet(t, o = {}) {
  ctx.fillStyle = '#26305a'; ctx.fillRect(PX - 100, PY - 400, PW + 200, 1500);
  ctx.fillStyle = '#1b2244'; ctx.fillRect(PX - 100, 1400, PW + 200, 600);
  const p = spen(t, 3);
  p.part(roundPoly([[640, 400], [960, 400], [960, 760], [640, 760]], 10), '#14193a', { shade: false, lw: 5 });
  p.line([[800, 400], [800, 760]], 5); p.line([[640, 580], [960, 580]], 5);
  ctx.fillStyle = '#f4efd0'; ctx.beginPath(); ctx.arc(720, 480, 34, 0, 7); ctx.fill(); ctx.fillStyle = '#14193a'; ctx.beginPath(); ctx.arc(734, 472, 30, 0, 7); ctx.fill();
  p.part(roundPoly([[70, 1180], [330, 1180], [330, 1400], [70, 1400]], 10), '#3a4378', { shade: 0.1, lw: 5 });
  p.part(roundPoly([[84, 1090], [316, 1090], [316, 1180], [84, 1180]], 8), '#0d1126', { shade: false, lw: 5 });
  { const m = ctx.getTransform(), sx = m.a * 200 + m.e; if (sx - 85 * m.a > PX + 10 && sx + 85 * m.a < PX + PW - 10) hand('2:00 AM', 200, 1136, 46, 0, '#ff5a4a'); }
  p.part(roundPoly([[300, 560], [1040, 560], [1040, 1400], [300, 1400]], 30), '#6b4a3a', { shade: 0.12, lw: 6 });
  p.part(roundPoly([[320, 1380], [1060, 1380], [1060, 1520], [320, 1520]], 18), '#c8d0ea', { shade: 0.1, lw: 5 });
  p.part(roundPoly([[320, 1520], [1060, 1520], [1060, 1700], [320, 1700]], 8), '#6b4a3a', { shade: 0.12, lw: 5 });
  p.part(roundPoly([[330, 800], [560, 800], [570, 1180], [330, 1180]], 60), '#e6e8f6', { shade: 0.12, lw: 5 });
}
// Steve sitting up in bed with the phone (still 1 composition). pose: extra pose fields; phoneMode: screen
function bedSit(t, o = {}) {
  bedSet(t);
  const s = 11, X = 440 + (o.dx || 0), Y = 1400, shY = Y - 45 * s;
  phone(t, o.screen || 'war', 800, 900, 1, -0.05, { scroll: o.scroll, t0: o.t0 });
  const wob = Math.sin(t * 11) * (o.thumb === false ? 0 : 6);
  const pose = { expr: 'dead_inside', eyes: 'pinpoint', brow: 'worried', mouth: 'line', fx: [], look: 0.95, sit: 1, hair: 0, bags: 1,
    armL: armTo(X, shY, s, 680, 1050 + wob, [0, -4]), armR: armTo(X, shY, s, 790, 1100 - wob, [0, -5]), ...(o.pose || {}) };
  who('steve', X, Y, s, t, pose, { noBlink: true });
  const p = spen(t, 5);
  p.part(roundPoly([[X - 300, Y - 120], [X + 40, Y - 160], [X + 330, Y - 190], [X + 560, Y - 140], [X + 600, Y - 20], [X - 300, Y - 20]], 90), '#8a5fb0', { shade: 0.14, lw: 6 });
  p.line([[X + 120, Y - 170], [X + 140, Y - 40]], 4, 'rgba(255,255,255,0.35)');
  const hc = headC(X, Y, s, 15, pose.headDy || 0); ctx.save(); ctx.globalCompositeOperation = 'screen';
  const fg = ctx.createRadialGradient(hc[0] + 120, hc[1] + 40, 20, hc[0] + 60, hc[1], 330); fg.addColorStop(0, 'rgba(110,190,255,0.5)'); fg.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 7, 0, 7); ctx.clip(); ctx.fillStyle = fg; ctx.fillRect(hc[0] - 400, hc[1] - 400, 800, 800); ctx.restore();
  return hc;
}
// Steve standing on the mattress (row 4, 5)
function bedStand(t, o = {}) {
  bedSet(t);
  const s = 9.5, X = 470, Y = 1388 - (o.jump || 0), shY = Y - 60 * s, p = spen(t, 8);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.7 + 0.1 * Math.sin(t * 13);   // phone-light spotlight from the foot of the bed
  const sg = ctx.createLinearGradient(0, 1340, 0, 420); sg.addColorStop(0, 'rgba(150,215,255,0.8)'); sg.addColorStop(1, 'rgba(150,215,255,0)');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(760, 1340); ctx.lineTo(880, 1340); ctx.lineTo(1100, 400); ctx.lineTo(260, 400); ctx.closePath(); ctx.fill(); ctx.restore();
  p.part(roundPoly([[730, 1300], [900, 1300], [900, 1384], [730, 1384]], 10), '#1a1e32', { shade: false, lw: 5 }); p.part(roundPoly([[742, 1312], [888, 1312], [888, 1372], [742, 1372]], 6), '#e8f4ff', { shade: false, lw: 2 });
  p.part(roundPoly([[X - 330, 1340], [X - 40, 1320], [X - 30, 1394], [X - 330, 1394]], 50), '#8a5fb0', { shade: 0.14, lw: 6 });
  const pose = { expr: 'happy', eyes: 'happy', mouth: 'grin', look: 0.2, hair: 1, bags: 0.6, armL: 'wide', armR: 'wide', fx: ['sparkle'], ...(o.pose || {}) };
  who('steve', X, Y, s, t, pose, { noBlink: true });
  return headC(X, Y, s, 0, pose.headDy || 0);
}
// ---------- KITCHEN (night → morning) ----------
function kitchenSet(t, o = {}) {   // o.sky 0..1
  const sky = o.sky || 0, mix = (a, b) => a.map((v, i) => Math.round(lerp(v, b[i], sky)));
  ctx.fillStyle = '#e9dfc9'; ctx.fillRect(PX - 100, PY - 400, PW + 200, 1500);
  ctx.fillStyle = 'rgba(24,30,70,0.38)'; ctx.globalAlpha = 1 - sky; ctx.fillRect(PX - 100, PY - 400, PW + 200, 1500); ctx.globalAlpha = 1;
  ctx.fillStyle = '#b09a78'; ctx.fillRect(PX - 100, 1560, PW + 200, 400);
  const p = spen(t, 3); p.line([[PX - 100, 1560], [PX + PW + 100, 1560]], 4);
  const [r, g, b] = mix([20, 26, 62], [150, 214, 255]);
  p.part(roundPoly([[640, 380], [980, 380], [980, 800], [640, 800]], 10), `rgb(${r},${g},${b})`, { shade: false, lw: 6 });
  ctx.save(); ctx.beginPath(); ctx.rect(646, 386, 328, 408); ctx.clip();
  const sunY = lerp(980, 560, ease.out(sky)); ctx.fillStyle = sky > 0.05 ? '#ffd84a' : '#f4efd0'; ctx.beginPath(); ctx.arc(lerp(720, 800, sky), sunY, 54, 0, 7); ctx.fill();
  if (sky > 0.3) for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t * 1.2; p.line([[800 + Math.cos(a) * 80, sunY + Math.cos(0) * 0 + Math.sin(a) * 80], [800 + Math.cos(a) * 118, sunY + Math.sin(a) * 118]], 6, '#ffd84a'); }
  ctx.restore();
  p.part(roundPoly([[640, 380], [980, 380], [980, 800], [640, 800]], 10), null, { shade: false, lw: 6 }); p.line([[810, 380], [810, 800]], 5); p.line([[640, 590], [980, 590]], 5);
  p.part(roundPoly([[80, 520], [330, 520], [330, 1560], [80, 1560]], 14), '#d8dde4', { shade: 0.1, lw: 6 }); p.line([[80, 900], [330, 900]], 5);   // fridge
  p.line([[300, 640], [300, 800]], 9, '#8a8f9a');
  if (sky < 0.5) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(PX, PY, PW, PH); ctx.restore(); }
  if (sky > 0.1) { ctx.save(); ctx.globalAlpha = 0.18 * sky; ctx.fillStyle = '#fff6c8'; ctx.beginPath(); ctx.moveTo(660, 800); ctx.lineTo(980, 800); ctx.lineTo(760, 1560); ctx.lineTo(180, 1560); ctx.closePath(); ctx.fill(); ctx.restore(); }
}
function kitchenFront(t, o = {}) {   // table + cake, drawn OVER Steve. cake: 0..1 amount left (1 whole)
  const p = spen(t, 14);
  p.part(roundPoly([[150, 1330], [1010, 1330], [1010, 1362], [150, 1362]], 6), '#9a7a58', { shade: 0.14, lw: 5 });
  p.part(roundPoly([[190, 1362], [970, 1362], [970, 1700], [190, 1700]], 6), '#8a6a48', { shade: 0.1, lw: 5 });
  p.line([[190, 1430], [970, 1430]], 3, 'rgba(42,34,48,0.35)');
  const cx = o.cx ?? 420, k = o.cake ?? 1, hh = 170 * k + 20;
  p.part(ellipsePts(cx, 1326, 250, 26, 28), '#f4f0e8', { shade: 0.06, lw: 4 });
  if (k > 0.04) {
    p.part(roundPoly([[cx - 190, 1326 - hh], [cx + 190, 1326 - hh], [cx + 190, 1326], [cx - 190, 1326]], 14), '#e8b6c8', { shade: 0.1, lw: 5 });
    p.part(roundPoly([[cx - 190, 1326 - hh], [cx + 190, 1326 - hh], [cx + 196, 1326 - hh + 50], [cx - 196, 1326 - hh + 50]], 14), '#fffefc', { shade: 0.06, lw: 4 });
    for (const dx of [-110, -10, 90, 150]) p.dot(cx + dx, 1326 - hh - 6, 12, 14, '#d9382c');
  }
}
// ---------- DESK (night) ----------
function deskSet(t, o = {}) {   // o.screen 'mail'|'cart'
  ctx.fillStyle = '#d8cfba'; ctx.fillRect(PX - 100, PY - 400, PW + 200, 1500); ctx.fillStyle = '#a89a80'; ctx.fillRect(PX - 100, 1580, PW + 200, 400);
  const p = spen(t, 3); p.line([[PX - 100, 1580], [PX + PW + 100, 1580]], 4);
  ctx.fillStyle = 'rgba(24,30,70,0.38)'; ctx.fillRect(PX - 100, PY - 400, PW + 200, 1500);
  p.part(roundPoly([[640, 400], [900, 400], [900, 740], [640, 740]], 8), '#12173a', { shade: false, lw: 5 }); p.line([[770, 400], [770, 740]], 4);
  const dy = 1060, D = spen(t, 33);
  D.part(roundPoly([[480, dy], [1070, dy], [1070, dy + 36], [480, dy + 36]], 6), '#9a7a58', { shade: 0.14, lw: 5 });
  D.part(roundPoly([[1000, dy + 36], [1040, dy + 36], [1040, 1580], [1000, 1580]], 4), '#8a6a48', { shade: 0.14, lw: 5 });
  D.part(roundPoly([[520, dy + 36], [560, dy + 36], [560, 1580], [520, 1580]], 4), '#8a6a48', { shade: 0.14, lw: 5 });
  const lx0 = 510, lx1 = 960, sy0 = 700, sy1 = dy - 8;
  D.part(roundPoly([[lx0 - 10, sy1], [lx1 + 10, sy1], [lx1 + 30, sy1 + 8], [lx0 - 30, sy1 + 8]], 4), '#8a93a8', { shade: 0.12, lw: 5 });
  D.part(roundPoly([[lx0, sy0], [lx1, sy0], [lx1, sy1], [lx0, sy1]], 18), '#2a2f44', { shade: false, lw: 6 });
  D.part(roundPoly([[lx0 + 14, sy0 + 14], [lx1 - 14, sy0 + 14], [lx1 - 14, sy1 - 40], [lx0 + 14, sy1 - 40]], 8), '#f6f8fc', { shade: false, lw: 2 });
  if (o.screen === 'cart') {
    D.part([[lx0 + 14, sy0 + 14], [lx1 - 14, sy0 + 14], [lx1 - 14, sy0 + 66], [lx0 + 14, sy0 + 66]], '#2f6ac8', { shade: false, lw: 2 });
    hand('MY CART', lx0 + 110, sy0 + 40, 34, 0, '#fff');
    D.part(roundPoly([[lx0 + 40, sy0 + 100], [lx0 + 190, sy0 + 100], [lx0 + 190, sy0 + 200], [lx0 + 40, sy0 + 200]], 14), '#2fa6c8', { shade: 0.1, lw: 4 });
    hand('HOT TUB', lx0 + 330, sy0 + 130, 54, 0, INK); hand('$8,400', lx0 + 330, sy0 + 195, 64, 0, '#d9382c');
  } else {
    D.part([[lx0 + 14, sy0 + 14], [lx1 - 14, sy0 + 14], [lx1 - 14, sy0 + 66], [lx0 + 14, sy0 + 66]], '#d9e4f4', { shade: false, lw: 2 });
    hand('To: Gary', lx0 + 160, sy0 + 40, 32, 0, INK); hand('Subject: URGENT', lx0 + 350, sy0 + 40, 22, 0, '#7a6a8a');
    hand('— And', 745, sy0 + 112, 50, 0, INK); hand('ANOTHER thing', 745, sy0 + 172, 46, 0, '#d9382c');
  }
  const bx = lx1 - 97, by = sy1 - 79, press = o.press || 0;
  D.part(roundPoly([[bx - 63, by - 21 + press * 8], [bx + 63, by - 21 + press * 8], [bx + 63, by + 21 + press * 8], [bx - 63, by + 21 + press * 8]], 12), press ? '#1f4a9a' : '#2f6ac8', { shade: false, lw: 3 });
  hand(o.screen === 'cart' ? 'BUY NOW' : 'SEND', bx, by + press * 8, o.screen === 'cart' ? 24 : 28, 0, '#fff');
}
function chair(t, ox = 0) {
  const seat = 1400, c = spen(t, 21);
  c.part(roundPoly([[80, seat - 340], [124, seat - 340], [124, seat], [80, seat]], 6), '#e8a53a', { shade: 0.12, lw: 5 });
  for (const lx of [120, 470]) c.part(roundPoly([[lx - 14, seat], [lx + 14, seat], [lx + 22, 1580], [lx - 22, 1580]], 4), '#c8862a', { shade: 0.12, lw: 5 });
  c.part(roundPoly([[70, seat - 4], [520, seat - 4], [520, seat + 44], [70, seat + 44]], 8), '#f2c14e', { shade: 0.12, lw: 5 });
}
// ---------- HALLWAY ----------
function hallSet(t, o = {}) {   // o.tub: 0..1 slide in, o.shake px, o.plant 0..1 droop
  ctx.fillStyle = '#e4dcc6'; ctx.fillRect(PX - 100, PY - 400, PW + 200, 1500); ctx.fillStyle = '#b9a98a'; ctx.fillRect(PX - 100, 1560, PW + 200, 400);
  const p = spen(t, 3); p.line([[PX - 100, 1560], [PX + PW + 100, 1560]], 4);
  for (let x = PX - 60; x < PX + PW + 100; x += 90) p.line([[x, PY - 400], [x, 1560]], 2, 'rgba(150,130,100,0.28)');
  const fx0 = 600, fx1 = 980, ftop = 440, sh = o.shake ? (Math.floor(t * 24) % 2 ? o.shake : -o.shake) : 0;
  ctx.save(); ctx.translate(sh, 0);
  p.part(roundPoly([[fx0, ftop], [fx1, ftop], [fx1, 1560], [fx0, 1560]], 4), '#4a3f55', { shade: false, lw: 6 });
  const k = o.tub ?? 1, slide = (1 - ease.out(k)) * 760;
  ctx.save(); ctx.translate(790 + slide, 1010); ctx.rotate(-0.38 * Math.min(1, 0.3 + k)); ctx.translate(-790, -1010);
  const Tt = spen(t, 55);
  Tt.part(roundPoly([[420, 800], [1160, 800], [1160, 1260], [420, 1260]], 120), '#2fa6c8', { shade: 0.16, lw: 7 });
  Tt.part(roundPoly([[420, 800], [1160, 800], [1160, 900], [420, 900]], 50), '#f2f6fa', { shade: 0.1, lw: 6 });
  for (const [jx, jy] of [[540, 1010], [680, 1060], [820, 1010], [960, 1060], [1090, 1010], [610, 1170], [760, 1190], [900, 1170], [1040, 1190]]) Tt.part(ellipsePts(jx, jy, 20, 20, 16), '#1d7f9c', { shade: false, lw: 4 });
  Tt.part(roundPoly([[640, 930], [950, 930], [950, 1000], [640, 1000]], 10), '#fff1a8', { shade: 0.08, lw: 4 }); hand('HOT TUB $8,400', 795, 966, 36, 0, INK);
  ctx.restore();
  const F = spen(t, 56);
  F.part(roundPoly([[fx0 - 34, ftop - 30], [fx0 + 8, ftop - 30], [fx0 + 8, 1560], [fx0 - 34, 1560]], 4), '#8a5a3a', { shade: 0.14, lw: 6 });
  F.part(roundPoly([[fx1 - 8, ftop - 30], [fx1 + 34, ftop - 30], [fx1 + 34, 1560], [fx1 - 8, 1560]], 4), '#8a5a3a', { shade: 0.14, lw: 6 });
  F.part(roundPoly([[fx0 - 34, ftop - 40], [fx1 + 34, ftop - 40], [fx1 + 34, ftop + 8], [fx0 - 34, ftop + 8]], 4), '#8a5a3a', { shade: 0.14, lw: 6 });
  F.part(roundPoly([[750, 350], [850, 350], [850, 392], [750, 392]], 8), '#e0b04a', { shade: 0.1, lw: 4 }); hand('4B', 800, 372, 34, 0, INK);
  ctx.restore();
}
function boxSteve(t, o = {}) {   // Steve holding the desk-things box (approved still 3), with frosting; o.droop 0..1 the plant
  const X = 290, s = 10.6, Y = 1560, shY = Y - 60 * s, bx0 = 110, bx1 = 480, by0 = 1070, by1 = 1380, bob = 5 * Math.sin(t * 3.2);
  const pose = { expr: 'dead_inside', mouth: 'line', fx: ['gloom'], look: 0.3, hair: 0, bags: 1, armL: armTo(X, shY, s, bx0 + 8, 1180 + bob, [-3, -2]), armR: armTo(X, shY, s, bx1 - 8, 1180 + bob, [3, -2]), ...(o.pose || {}) };
  who('steve', X, Y, s, t, pose);
  const hc = headC(X, Y, s), B = spen(t, 66), dr = o.droop ?? 0, dy = bob;
  B.part(roundPoly([[bx0 + 20, by0 - 10 + dy], [bx0 + 80, by0 - 10 + dy], [bx0 + 70, by0 + 40 + dy], [bx0 + 30, by0 + 40 + dy]], 4), '#b5673a', { shade: 0.12, lw: 4 });
  const lp = 1 - 0.55 * dr;   // droop: stalk leaves fall
  B.line([[bx0 + 50, by0 - 8 + dy], [bx0 + 52, by0 - 130 * lp + dy], [bx0 + 130, by0 - 120 * lp + 40 * dr + dy], [bx0 + 175, by0 - 60 + 20 * dr + dy]], 7, '#7a5a38');
  B.line([[bx0 + 50, by0 - 8 + dy], [bx0 + 20, by0 - 90 * lp + dy], [bx0 - 40, by0 - 70 * lp + 30 * dr + dy], [bx0 - 60, by0 - 10 + dy]], 7, '#7a5a38');
  B.part(ellipsePts(bx0 + 176, by0 - 52 + 20 * dr + dy, 20, 11, 10), '#a88a52', { shade: false, lw: 3 }); B.part(ellipsePts(bx0 - 58, by0 - 6 + dy, 20, 11, 10), '#a88a52', { shade: false, lw: 3 });
  B.part(roundPoly([[bx0 + 230, by0 - 50 + dy], [bx0 + 296, by0 - 50 + dy], [bx0 + 296, by0 + 20 + dy], [bx0 + 230, by0 + 20 + dy]], 6), '#d9382c', { shade: 0.1, lw: 4 });
  B.line([[bx0 + 296, by0 - 30 + dy], [bx0 + 320, by0 - 22 + dy], [bx0 + 296, by0 - 6 + dy]], 5);
  B.part(roundPoly([[bx0, by0 + dy], [bx1, by0 + dy], [bx1 - 24, by1 + dy], [bx0 + 24, by1 + dy]], 10), '#c9a46a', { shade: 0.14, lw: 6 });
  B.part(roundPoly([[bx0 + 110, by0 + 40 + dy], [bx1 - 110, by0 + 40 + dy], [bx1 - 120, by0 + 100 + dy], [bx0 + 120, by0 + 100 + dy]], 6), '#e9d8b4', { shade: 0.08, lw: 4 });
  if (!o.noLabel) hand('DESK', (bx0 + bx1) / 2, by0 + 180 + dy, 56, 0, INK);
  if (o.slap) {   // invoice slapped on the box side
    const k = pop(t, o.slap, 0.1);
    ctx.save(); ctx.translate(430, 1250 + dy); ctx.rotate(0.12); ctx.scale(k, k);
    B.part(roundPoly([[-110, -110], [110, -110], [110, 110], [-110, 110]], 6), '#ffffff', { shade: 0.04, lw: 5 });
    hand('INVOICE', 0, -70, 36, 0, '#d9382c'); hand('RENT', 0, -10, 64, 0, INK); hand('DUE FRI', 0, 55, 42, 0, '#d9382c'); ctx.restore();
  }
  frosting(t, hc);
  return hc;
}

// ---------- timeline ----------
function buildTimeline() {
  let t = 0.1;
  LINES = LINE_DEFS.map(([id, char, text, gap]) => { const L = { id, char, text, t }; t += VOICE[id].dur + gap; return L; });
  T = {
    r2: L_('16_s02').t, r3: L_('16_s03').t, r3b: end('16_s03') + 0.6, r4: L_('16_s04').t, r5: L_('16_s05').t, r6: L_('16_s06').t, r7: L_('16_s07').t, r8: L_('16_s08').t,
    bleep: end('16_s08'), r9: end('16_s08') + 0.6, r10: L_('16_s10').t, r11: L_('16_s11').t, r12: L_('16_s12').t, r12b: end('16_s12') + 0.8, r13: L_('16_s13').t, r14: L_('16_p14').t,
  };
  T.loop = end('16_p14') + 0.2; DUR = +(T.loop + 0.4).toFixed(2); T.slap = T.r14 + 1.05;
  const R = (t0, a, b) => seg(t, t0 + a, t0 + b);   // (never used directly; shots take their own t)
  const camPush = (t, t0, d, z0, z1) => lerp(z0, z1, seg(t, t0, t0 + d));
  const sit = (t, extra = {}, o = {}) => bedSit(t, { ...o, pose: extra });
  SHOTS = [
    // ---- row 1 · 2 A.M. (4.7 s): push in on the face (hook) → phone close-up → eyes
    [0, t => withCamera(camPush(t, 0, 1.9, 1.0, 1.7), 520, lerp(900, 760, seg(t, 0, 1.9)), () => sit(t, {}, { screen: 'war', scroll: Math.max(0, 1 - t / 1.0) * 330 }))],
    [1.9, t => withCamera(camPush(t, 1.9, 1.5, 1.7, 2.2), 800, 900, () => sit(t, { eyes: 'pinpoint' }, { screen: 'war' }), 0.02 * Math.sin(t * 8))],
    [3.4, t => withCamera(camPush(t, 3.4, 1.8, 2.2, 2.7), 480, 700, () => sit(t, { fx: ['sweat'], expr: 'dead_inside' }, { screen: 'war' }))],
    // ---- row 2 · expert on phone → thumbs-up → Steve's brow
    [T.r2, t => withCamera(camPush(t, T.r2, 1.3, 1.6, 2.3), 800, 900, () => sit(t, { expr: 'deadpan' }, { screen: 'expert' }))],
    [T.r2 + 1.3, t => withCamera(camPush(t, T.r2 + 1.3, 1.1, 1.8, 2.1), 460, 740, () => sit(t, { expr: 'deadpan', brow: 'up', fx: ['sweat'] }, { screen: 'expert' }))],
    // ---- row 3 · "Prepared for WHAT?" jolt + sweat drop
    [T.r3, t => withCamera(1.35 + 0.1 * (1 - seg(t, T.r3, T.r3 + 0.3)), 470, 860, () => {
      const j = ease.out(seg(t, T.r3, T.r3 + 0.25)), hc = sit(t - 0, { expr: 'shocked', eyes: 'wide', brow: 'up', mouth: 'wide', fx: ['sweat'], hair: 1, lean: -6 * (1 - j), headDy: 2 * (1 - j) }, { screen: 'war', dx: 0 });
      const a = t - T.r3 - 0.1; if (a > 0 && a < 0.8) teardrop(spen(t, 31), hc[0] - 140 - 280 * a, hc[1] - 60 - 250 * a + 700 * a * a, 20, -0.6 - a * 4);
      if (a > -0.1 && a < 0.7) sfxText('!?', hc[0] + 190, hc[1] - 210, 110, 0.15, '#ffd84a');
    })],
    [T.r3 + 1.0, t => withCamera(1.75, 470, 780, () => sit(t, { expr: 'confused', eyes: 'dot', brow: 'worried', mouth: 'wide', hair: 1, fx: ['sweat'], tilt: -5 * Math.sin((t - T.r3) * 2) }, { screen: 'war', thumb: false }))],
    // ---- row 3b · stares at the ceiling, grin spreads (0.8 s)
    [T.r3b, t => withCamera(1.9 + 0.2 * seg(t, T.r3b, T.r3b + 0.8), 470, 760, () => {
      const g = seg(t, T.r3b + 0.15, T.r3b + 0.75);
      sit(t, { expr: g > 0.6 ? 'grin' : g > 0.2 ? 'smug' : 'deadpan', eyes: 'dot', brow: g > 0.1 ? 'up' : 'worried', hair: 1, tilt: -8 * ease.inOut(seg(t, T.r3b, T.r3b + 0.4)), mouth: g > 0.6 ? 'grin' : 'line', look: 0, fx: [], armL: 'down', armR: 'down' }, { screen: 'none' });
    })],
    // ---- row 4 · stands on the bed, arms wide, heroic tilt-up
    [T.r4, t => withCamera(1.15, 540, lerp(990, 835, ease.inOut(seg(t, T.r4, T.r4 + 2.3))), () => bedStand(t, { jump: 140 * Math.sin(Math.PI * seg(t, T.r4, T.r4 + 0.35)) }))],
    [T.r4 + 2.4, t => withCamera(1.55, 480, lerp(820, 740, seg(t, T.r4 + 2.4, T.r4 + 4.4)), () => bedStand(t, { pose: { armL: 'surrender', armR: 'surrender', expr: 'grin', mouth: 'grin' }, jump: 40 * Math.max(0, Math.sin((t - T.r4 - 2.4) * 6)) }))],
    // ---- row 5 · scissors cut the gym card
    [T.r5, t => withCamera(1.0, 540, CAM_Y, () => {
      ctx.fillStyle = '#26305a'; ctx.fillRect(PX, PY, PW, PH); ctx.save(); ctx.globalAlpha = 0.5; const g = ctx.createRadialGradient(540, 900, 20, 540, 900, 700); g.addColorStop(0, '#8fd0ff'); g.addColorStop(1, '#26305a'); ctx.fillStyle = g; ctx.fillRect(PX, PY, PW, PH); ctx.restore();
      const cut = T.r5 + 0.8, a = t - cut, k = pop(t, T.r5, 0.15), p = spen(t, 41);
      const half = (dx, dy, rot, left) => {
        ctx.save(); ctx.translate(540 + dx, 900 + dy); ctx.rotate(rot);
        p.part(roundPoly(left ? [[-300, -190], [10, -190], [-10, 190], [-300, 190]] : [[0, -190], [300, -190], [300, 190], [10, 190]], 18), '#ffd84a', { shade: 0.08, lw: 6 });
        ctx.save(); ctx.beginPath(); ctx.rect(left ? -300 : 0, -190, 300, 380); ctx.clip();
        hand('GYM', -0, -90, 120, 0, INK); hand('MEMBER', 0, 30, 70, 0, '#d9382c'); hand('24/7', 0, 120, 70, 0, INK); ctx.restore(); ctx.restore();
      };
      ctx.save(); ctx.translate(540, 900); ctx.scale(k, k); ctx.translate(-540, -900);
      if (a < 0) half(0, 0, 0.02 * Math.sin(t * 20), true), half(0, 0, 0.02 * Math.sin(t * 20), false);
      else { const e = ease.out(Math.min(1, a / 0.7)); half(-300 * e, 260 * a * a * 3, -1.4 * e, true); half(300 * e, 260 * a * a * 3, 1.4 * e, false); }
      ctx.restore();
      // scissors from the right, closing on the snip
      const op = a < 0 ? Math.max(0.05, 0.55 - 0.5 * seg(t, cut - 0.35, cut)) : 0.05 + 0.5 * seg(t, cut + 0.15, cut + 0.5);
      const sx = 540 + lerp(520, 20, ease.out(seg(t, T.r5, T.r5 + 0.45))) + (a > 0 ? 400 * seg(t, cut + 0.4, cut + 1) : 0);
      ctx.save(); ctx.translate(sx, 900); ctx.rotate(-0.1);
      for (const sg of [-1, 1]) { ctx.save(); ctx.rotate(sg * op); p.part(roundPoly([[-420, -22], [0, -22], [0, 22], [-420, 22]], 8), '#d4dbe6', { shade: 0.15, lw: 5 }); p.part(ellipsePts(60, sg * 28, 40, 28, 18), '#d9382c', { shade: 0.1, lw: 5 }); ctx.restore(); }
      ctx.restore();
      if (a > 0 && a < 0.5) sfxText('SNIP!', 540, 560, 120, -0.08, '#ffd84a');
    })],
    [T.r5 + 1.25, t => withCamera(1.3, 480, 900, () => {
      bedStand(t, { pose: { armL: 'up', armR: 'up', expr: 'smug', mouth: 'grin' } });
      const a = t - T.r5 - 1.25, p = spen(t, 42); for (const [dx, dy, r] of [[-1, 1, 1], [1, 0.4, -1]]) { ctx.save(); ctx.translate(500 + dx * 360 * a * 0.8, 900 + dy * 300 * a + 500 * a * a); ctx.rotate(r * a * 7); p.part(roundPoly([[-110, -80], [110, -80], [110, 80], [-110, 80]], 10), '#ffd84a', { shade: 0.08, lw: 5 }); hand('GYM', 0, 0, 60, 0, INK); ctx.restore(); }
    })],
    // ---- row 6 · cake: both hands, then the face dive
    [T.r6, t => withCamera(1.0 + 0.2 * seg(t, T.r6 + 0.5, T.r6 + 0.9), 460, lerp(980, 1060, seg(t, T.r6 + 0.5, T.r6 + 0.9)), () => {
      kitchenSet(t); const X = 420, Y = 1560, s = 10, dive = ease.inOut(seg(t, T.r6 + 0.65, T.r6 + 0.95)), eat = (Math.floor(t * 6) % 2);
      const pose = { expr: 'happy', eyes: 'happy', mouth: 'grin', look: 0.1, hair: 1, bags: 0.6, headDy: -19 * dive, tilt: -12 * dive, armL: armTo(X, Y - 45 * s, s, 280, 1290 - eat * 40 * (1 - dive), [0, -4]), armR: armTo(X, Y - 45 * s, s, 560, 1290 - (1 - eat) * 40 * (1 - dive), [0, -4]), sit: 1 };
      who('steve', X, Y, s, t, pose, { noBlink: true }); kitchenFront(t, { cake: lerp(1, 0.65, seg(t, T.r6, T.r6 + 0.65)) });
      const hc = headC(X, Y, s, 15, -19 * dive); frosting(t, hc, seg(t, T.r6 + 0.3, T.r6 + 0.7)); crumbs(t, T.r6 + 0.75, 420, 1250, 16, 330);
      if (t > T.r6 + 0.75 && t < T.r6 + 1.1) sfxText('SPLAT!', 700, 900, 100, 0.1);
    })],
    [T.r6 + 1.0, t => withCamera(2.0, 420, 1090, () => {
      kitchenSet(t); const X = 420, Y = 1560, s = 10, tw = 0.5 * Math.sin((t - T.r6) * 20);
      who('steve', X, Y, s, t, { expr: 'happy', eyes: 'happy', mouth: 'grin', hair: 1, bags: 0.6, headDy: -19 + 0.8 * tw, tilt: -12 + tw, armL: 'wide', armR: 'wide', sit: 1 }, { noBlink: true }); kitchenFront(t, { cake: 0.65 });
      frosting(t, headC(X, Y, s, 15, -19)); crumbs(t, T.r6 + 1.0, 380, 1230, 14, 380);
    })],
    // ---- row 7 · credit card: Steve at the desk, then the BUY NOW click
    [T.r7, t => withCamera(1.1, 560, 1100, () => {
      deskSet(t, { screen: 'cart' }); chair(t); const X = 300, Y = 1625, s = 10.2, shY = Y - 45 * s, k = Math.sin(t * 14) * 14;
      who('steve', X, Y, s, t, { expr: 'happy', eyes: 'dot', mouth: 'grin', look: 0.8, hair: 1, bags: 1, sit: 1, armL: armTo(X, shY, s, 590, 1042 + k, [0, -4]), armR: armTo(X, shY, s, 700, 1042 - k, [0, -5]) });
    })],
    [T.r7 + 0.95, t => withCamera(1.9, 740, 900, () => {
      const a = t - T.r7 - 1.2, press = a > 0 && a < 0.25 ? 1 : 0;
      deskSet(t, { screen: 'cart', press });
      const cx = lerp(560, 862, ease.inOut(seg(t, T.r7 + 0.95, T.r7 + 1.2))), cy = lerp(780, 960, ease.inOut(seg(t, T.r7 + 0.95, T.r7 + 1.2)));
      const p = spen(t, 50); p.part([[cx, cy], [cx + 36, cy + 56], [cx + 14, cy + 52], [cx + 4, cy + 80], [cx - 6, cy + 76], [cx + 4, cy + 50], [cx - 14, cy + 60]], '#ffffff', { shade: false, lw: 4 });
      if (a > 0) { sfxText('CHA-CHING!', 740, 640, 76, -0.06, '#7bd88f'); ctx.save(); for (let i = 0; i < 4; i++) { const u = a * 1.2 + i * 0.15; ctx.globalAlpha = Math.max(0, 1 - u); p.dot(930 + i * 14 + Math.sin(u * 6 + i) * 18, 1010 - u * 260, 30 + u * 30, 26 + u * 26, '#9a9fa8'); } ctx.restore(); }
      p.part(roundPoly([[560, 1010], [720, 1010], [720, 1050], [560, 1050]], 8), '#e8a53a', { shade: 0.1, lw: 4 });
    })],
    // ---- row 8 · standing on the chair, typing blur; bleep punch-in; SEND slam
    [T.r8, t => withCamera(1.0, 540, CAM_Y, () => {
      deskSet(t, { screen: 'mail' }); const wob = 0.045 + 0.02 * Math.sin(t * 22);
      ctx.save(); ctx.translate(500, 1580); ctx.rotate(wob); ctx.translate(-500, -1580); chair(t);
      const X = 300, hy = 1396, s = 10.2, ty = Math.sin(t * 40) * 26;
      who('steve', X, hy, s, t, { expr: 'furious', look: 0.9, mouth: 'scream', fx: ['vein', 'sweat'], hair: 1, bags: 1, armL: armTo(X, hy - 60 * s, s, 600, 1020 + ty, [0, -4]), armR: armTo(X, hy - 60 * s, s, 700, 1024 - ty, [0, -5]) }, { noBlink: true });
      ctx.restore();
    })],
    [T.r8 + 0.95, t => withCamera(1.55, 330, 800, () => {
      deskSet(t, { screen: 'mail' }); const wob = 0.05 + 0.02 * Math.sin(t * 22);
      ctx.save(); ctx.translate(500, 1580); ctx.rotate(wob); ctx.translate(-500, -1580); chair(t);
      const X = 300, hy = 1396, s = 10.2, ty = Math.sin(t * 40) * 26;
      who('steve', X, hy, s, t, { expr: 'furious', look: 0.9, mouth: 'scream', fx: ['vein', 'sweat'], hair: 1, puff: 0.7, bags: 1, armL: armTo(X, hy - 60 * s, s, 600, 1020 + ty, [0, -4]), armR: armTo(X, hy - 60 * s, s, 700, 1024 - ty, [0, -5]) }, { noBlink: true });
      ctx.restore();
    })],
    [T.bleep, t => withCamera(2.0 + 0.4 * seg(t, T.bleep, T.bleep + 0.35), 300 + 8 * Math.sin(t * 60), 760, () => {
      deskSet(t, { screen: 'mail' });
      ctx.save(); ctx.translate(500, 1580); ctx.rotate(0.07 * Math.sin(t * 25)); ctx.translate(-500, -1580); chair(t);
      const X = 300, hy = 1396, s = 10.2;
      who('steve', X, hy, s, t, { expr: 'furious', look: 0.9, mouth: 'scream', fx: ['vein', 'sweat'], hair: 1, puff: 1, bags: 1, armL: 'up', armR: 'up' }, { noBlink: true });
      ctx.restore();
      const k = pop(t, T.bleep, 0.1); ctx.save(); ctx.translate(560, 600); ctx.scale(k, k); sfxText('#@$%&!', 0, 0, 150, -0.08, '#ff5a4a'); ctx.restore();
    })],
    [T.bleep + 0.35, t => withCamera(2.0, 820, 960, () => {
      const a = t - T.bleep - 0.35, press = a > 0.08 ? 1 : 0;
      deskSet(t, { screen: 'mail', press });
      const p = spen(t, 52), fy = lerp(1320, 985, Math.pow(seg(t, T.bleep + 0.35, T.bleep + 0.46), 2));
      ctx.save(); ctx.translate(865, fy); p.line([[30, 250], [0, 70]], 50, INK); p.line([[30, 250], [0, 70]], 40, SLEEVE); p.dot(0, 50, 30, 28, '#fffdf8'); p.line([[0, 50], [-6, 10]], 14, INK); p.line([[0, 50], [-6, 10]], 8, '#fffdf8'); ctx.restore();
      if (a > 0.08) sfxText('SENT', 800, 640, 96, 0.08, '#7bd88f');
    })],
    // ---- row 9 · sunrise, face-down in the cake, a bird lands (1.0 s)
    [T.r9, t => withCamera(1.0 + 0.1 * seg(t, T.r9, T.r9 + 1.0), 430, 1000, () => {
      const sk = seg(t, T.r9, T.r9 + 0.85); kitchenSet(t, { sky: sk }); const X = 420, Y = 1560, s = 10;
      who('steve', X, Y, s, t, { expr: 'dead_inside', eyes: 'closed', mouth: 'line', hair: 3, bags: 1, headDy: -20.5, tilt: -14, armL: 'down', armR: 'down', sit: 1, fx: ['zzz'] }, { noBlink: true });
      kitchenFront(t, { cake: 0.6 }); const hc = headC(X, Y, s, 15, -20.5); frosting(t, hc);
      const b = seg(t, T.r9 + 0.15, T.r9 + 0.65), bx = lerp(980, hc[0] + 10, ease.out(b)), by = lerp(420, hc[1] - hc[2] - 8, b) + (b < 1 ? -60 * Math.sin(Math.PI * b) : 0), fl = b < 1 ? Math.sin(t * 40) : Math.sin(t * 4) * 0.2;
      const bp = spen(t, 61); bp.part(ellipsePts(bx, by, 36, 28, 18), '#4aa8e8', { shade: 0.1, lw: 4 }); bp.part([[bx + 30, by - 4], [bx + 52, by - 10], [bx + 32, by + 10]], '#ffb43a', { shade: false, lw: 3 }); bp.dot(bx + 14, by - 8, 5, 5, INK);
      bp.part([[bx - 8, by - 4], [bx - 36, by - 40 * fl - 14], [bx + 8, by - 22]], '#2f88c8', { shade: false, lw: 3 });
    })],
    // ---- row 10 · the head lifts, one eye opens, frosting drips; then he stretches in the sun
    [T.r10, t => withCamera(1.6, 430, 960, () => {
      kitchenSet(t, { sky: 1 }); const X = 420, Y = 1560, s = 10, up = ease.inOut(seg(t, T.r10 + 0.2, T.r10 + 1.2)), op = seg(t, T.r10 + 0.9, T.r10 + 1.1);
      who('steve', X, Y, s, t, { expr: 'dead_inside', eyes: op > 0.3 ? 'dot' : 'closed', brow: 'worried', mouth: op > 0.5 ? 'smile' : 'line', hair: 3, bags: 1, headDy: lerp(-20.5, 0, up), tilt: lerp(-14, 3, up), armL: 'down', armR: 'down', sit: 1 }, { noBlink: true });
      kitchenFront(t, { cake: 0.3 }); const hc = headC(X, Y, s, 15, lerp(-20.5, 0, up)); frosting(t, hc);
      const bp = spen(t, 61), bx = hc[0] + 10, by = hc[1] - hc[2] - 8 - 120 * up * 0 + 0; bp.part(ellipsePts(bx, by, 36, 28, 18), '#4aa8e8', { shade: 0.1, lw: 4 }); bp.part([[bx + 30, by - 4], [bx + 52, by - 10], [bx + 32, by + 10]], '#ffb43a', { shade: false, lw: 3 }); bp.dot(bx + 14, by - 8, 5, 5, INK);
    })],
    [T.r10 + 1.7, t => withCamera(1.15 + 0.05 * seg(t, T.r10 + 1.7, T.r10 + 3.4), 470, 1050, () => {
      kitchenSet(t, { sky: 1 }); const X = 420, Y = 1560, s = 10, a = t - T.r10 - 1.7;
      who('steve', X, Y, s, t, { expr: 'happy', eyes: 'happy', mouth: 'smile', hair: 3, bags: 0.6, armL: 'wide', armR: 'wide', sit: 1, lean: 2 * Math.sin(a * 3), headDy: 0.5 * Math.sin(a * 4) });
      kitchenFront(t, { cake: 0.6, cx: 780 }); frosting(t, headC(X, Y, s, 15));
      const p = spen(t, 65); for (const [dx, dy, ph] of [[620, 520, 0], [760, 470, 1.3], [880, 560, 2.4]]) { const by = dy + 14 * Math.sin(t * 5 + ph), bx = dx + 30 * Math.sin(t * 2 + ph); p.line([[bx - 24, by + 4], [bx - 10, by - 12 * Math.sin(t * 22 + ph)], [bx, by + 4], [bx + 10, by - 12 * Math.sin(t * 22 + ph)], [bx + 24, by + 4]], 5, INK); }
      sfxText('tweet!', 790, 700 + 8 * Math.sin(t * 8), 66, -0.1, '#ffffff');
    })],
    // ---- row 11 · "No WAR?" the phone slides in, then the dawning face
    [T.r11, t => withCamera(1.0, 540, CAM_Y, () => {
      ctx.fillStyle = '#bfe6ff'; ctx.fillRect(PX, PY, PW, PH);
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + t * 0.4; ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.moveTo(540, 900); ctx.arc(540, 900, 1200, a, a + 0.28); ctx.closePath(); ctx.fill(); }
      const k = ease.out(seg(t, T.r11, T.r11 + 0.3));
      phone(t, 'maybe', lerp(1300, 540, k), 900 + 6 * Math.sin(t * 5), 2.0, lerp(0.5, -0.04, k), { glow: false, t0: T.r11 + 0.05 }); thumb(t, lerp(1500, 470, k) + 0, 1750, 0.3);
    })],
    [T.r11 + 1.35, t => withCamera(1.8, 440, 800, () => {
      kitchenSet(t, { sky: 1 }); const X = 420, Y = 1560, s = 10;
      who('steve', X, Y, s, t, { expr: 'confused', eyes: 'dot', brow: 'worried', mouth: 'line', look: 0.6, hair: 3, bags: 0.6, sit: 1, armL: 'down', armR: 'down', tilt: 6 * ease.inOut(seg(t, T.r11 + 1.35, T.r11 + 1.8)), fx: [] });
      kitchenFront(t, { cake: 0 }); frosting(t, headC(X, Y, s, 15));
    })],
    // ---- row 12 · inbox, then the pupils shrink
    [T.r12, t => withCamera(1.0, 540, CAM_Y, () => {
      ctx.fillStyle = '#e9dfc9'; ctx.fillRect(PX, PY, PW, PH);
      const k = pop(t, T.r12, 0.2); phone(t, 'inbox', 540, 900 + 5 * Math.sin(t * 4), 2.0 * k, 0.03 * Math.sin(t * 30) * Math.exp(-(t - T.r12) * 2), { glow: false });
      thumb(t, 470, 1780, 0.25);
    })],
    [T.r12 + 1.25, t => withCamera(1.85, 440, 790, () => {
      kitchenSet(t, { sky: 1 }); const X = 420, Y = 1560, s = 10, a = seg(t, T.r12 + 1.25, T.r12 + 1.7);
      who('steve', X, Y, s, t, { expr: 'horrified', eyes: a > 0.3 ? 'pinpoint' : 'wide', brow: 'worried', mouth: 'wide', look: 0.4, hair: 3, bags: 1, sit: 1, armL: 'down', armR: 'down', fx: ['sweat'] }, { noBlink: true });
      kitchenFront(t, { cake: 0 }); frosting(t, headC(X, Y, s, 15));
    })],
    // ---- row 12b · doorbell, the hot tub jams the door (0.9 s)
    [T.r12b, t => withCamera(1.0 + 0.05 * seg(t, T.r12b, T.r12b + 0.5), 760, 1000, () => {
      const k = seg(t, T.r12b + 0.05, T.r12b + 0.4), jam = seg(t, T.r12b + 0.4, T.r12b + 0.5);
      hallSet(t, { tub: k, shake: jam > 0 ? 7 * Math.exp(-(t - T.r12b - 0.4) * 5) : 0 });
      if (t < T.r12b + 0.4) sfxText('DING-DONG!', 560, 600, 90, -0.1, '#ffd84a');
      if (jam > 0) sfxText('THUD!', 560, 1250, 120, 0.08, '#ff5a4a');
    })],
    [T.r12b + 0.55, t => withCamera(1.9, 440, 790, () => {
      kitchenSet(t, { sky: 1 }); const X = 420, Y = 1560, s = 10;
      who('steve', X, Y, s, t, { expr: 'horrified', eyes: 'pinpoint', mouth: 'wide', look: 0.9, hair: 3, bags: 1, sit: 1, armL: 'down', armR: 'down', fx: ['sweat'], tilt: 6 * Math.sin(t * 40) }, { noBlink: true });
      kitchenFront(t, { cake: 0 }); frosting(t, headC(X, Y, s, 15));
    })],
    // ---- row 13 · the punch: close on the face, then a slow pull-back to the box and the jammed tub
    [T.r13, t => withCamera(lerp(1.7, 1.45, seg(t, T.r13, T.r13 + 1.9)), 330, 760, () => { hallSet(t, { tub: 1 }); boxSteve(t, { droop: 0, noLabel: true }); })],
    [T.r13 + 1.9, t => withCamera(lerp(1.3, 1.0, ease.inOut(seg(t, T.r13 + 1.9, T.r13 + 3.9))), lerp(430, 540, ease.inOut(seg(t, T.r13 + 1.9, T.r13 + 3.9))), lerp(1000, CAM_Y, ease.inOut(seg(t, T.r13 + 1.9, T.r13 + 3.9))), () => {
      hallSet(t, { tub: 1 }); boxSteve(t, { droop: ease.inOut(seg(t, T.r13 + 2.3, T.r13 + 3.5)) });
    })],
    // ---- row 14 · Penny walks in and slaps the invoice on the box
    [T.r14, t => withCamera(lerp(1.15, 1.0, seg(t, T.r14, T.r14 + 1.0)), 540, CAM_Y, () => {
      hallSet(t, { tub: 1 }); const inx = lerp(1250, 700, ease.out(seg(t, T.r14 - 0.05, T.r14 + 0.7)));
      boxSteve(t, { slap: T.slap, pose: { expr: 'dead_inside', look: 0.9 } });
      who('penny', inx, 1560, 10.5, t, { expr: 'deadpan', armL: 'down', armR: t > T.slap - 0.25 && t < T.slap + 0.2 ? 'point' : 'down', brow: undefined });
      if (t > T.slap && t < T.slap + 0.5) sfxText('SLAP!', 560, 1010, 80, -0.1);
    })],
    // ---- loop · smash cut back to the 2 A.M. phone glow
    [T.loop, t => withCamera(1.0 + 0.04 * seg(t, T.loop, T.loop + 0.55), 520, 900, () => sit(t, {}, { screen: 'war' }), 0.012 * Math.sin((t - T.loop) * 50) * Math.exp(-(t - T.loop) * 6))],
  ];
  EV = [
    ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
    { t: 0, type: 'music' }, { t: T.r12, type: 'musicStop' }, { t: T.r3 + 0.05, type: 'whoosh' }, { t: T.r4, type: 'whoosh' },
    { t: T.r5 + 0.8, type: 'snip' }, { t: T.r6 + 0.75, type: 'splat' }, { t: T.r7 + 1.2, type: 'click' }, { t: T.r7 + 1.28, type: 'chaching' },
    { t: T.r8, type: 'typing', d: T.bleep - T.r8 }, { t: T.bleep, type: 'bleep' }, { t: T.bleep + 0.43, type: 'slam' },
    { t: T.r9 + 0.1, type: 'birds' }, { t: T.r9 + 0.5, type: 'birds' }, { t: T.r10 + 1.8, type: 'birds' }, { t: T.r11, type: 'whoosh' }, { t: T.r12b, type: 'doorbell' }, { t: T.r12b + 0.4, type: 'thud' },
    { t: T.slap, type: 'slap' }, { t: T.loop, type: 'smash' },
  ].sort((a, b) => a.t - b.t);
}

// ---------- kinetic captions ----------
function captions(t) {
  const c = wordChunk(LINES, WORDS, t); if (!c) return null;
  ctx.save(); ctx.translate(540, CAP_Y);
  ctx.font = '600 80px Fredoka'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const parts = c.words.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), gap = 22;
  let x = -(parts.reduce((a, p) => a + p.wd, 0) + gap * (parts.length - 1)) / 2;
  for (const p of parts) { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(p.w, x, 0); ctx.fillStyle = p.stress ? '#ffd84a' : '#ffffff'; ctx.fillText(p.w, x, 0); x += p.wd + gap; }
  ctx.restore();
  return { id: c.id, text: c.words.map(w => w.w).join(' '), x0: 80, y0: CAP_Y - 60, x1: 1000, y1: CAP_Y + 60 };
}

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = '600 50px Fredoka';
  ctx.fillText(TITLE[0], 540, TITLE_Y[0]); ctx.fillText(TITLE[1], 540, TITLE_Y[1]); ctx.textAlign = 'start';
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
  panel(ctx, PX, PY, PW, PH, 5, null, boilFrame(t));
  ctx.font = '600 30px Fredoka'; ctx.fillStyle = 'rgba(42,34,48,0.55)'; ctx.textAlign = 'right'; ctx.fillText('UNIT 4B', PX + PW - 24, PY + PH - 22); ctx.textAlign = 'start';
  const cap = captions(t); window.__texts = cap ? [cap] : [];
}

window.render = render; window.TEXTS = t => { render(t); return window.__texts; };
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  VOICE = await (await fetch('voice/voice.json')).json();
  WORDS = await (await fetch('voice/words.json')).json();
  buildTimeline(); window.DUR = DUR; window.EV = EV; window.T = T;
  render(0); window.READY = true;
})();
