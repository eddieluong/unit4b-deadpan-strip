// UNIT 4B · 25 "One Bulb" (Tập 16) — FULL FILM, ~25.6 s. Worlds = the approved key stills (lift.js, lifted from stills.js) + animation.
// Timings: voice/film_timeline.json (retime.py). CLUNK 19.4, punch s8b 20.8 (81 %). Shots are listed in build().
import { W, H, ctx, INK, spen, text, strokedText, title, glowBlob, poly, hash, armTube, steve, snuggles, bulb, wireStroke, star, knotBall, litAt, plug,
  livingWall, blackout, SKIN, BULB_LIT, BULB_DIM, WIRE, paper, panel, roundPoly, ellipsePts, boilFrame, drawCharacter } from './lift.js';
import { ease } from './lib/motion.js';

const PL_Y = 1440, MUSTARD = '#e2b23c';
let TL = null, DUR = 25.6, LN = {};
const lerp = (a, b, k) => a + (b - a) * k;
const clamp01 = k => Math.max(0, Math.min(1, k)), seg = (t, a, b) => clamp01((t - a) / (b - a));
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
function cam(zoom, fx, fy, fn, dx = 0, dy = 0, rot = 0) { zoom = Math.max(1, zoom); const hw = 540 / zoom, hh = 960 / zoom; fx = Math.max(hw, Math.min(W - hw, fx)); fy = Math.max(hh, Math.min(H - hh, fy)); ctx.save(); ctx.translate(540 + dx, 960 + dy); if (rot) ctx.rotate(rot); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const talking = (id, t) => { const l = LN[id]; return !!l && t >= l.start && t <= l.end; };
const chat = (t, hz = 10) => Math.floor(t * hz) % 2 === 0;
const mouthFor = (id, t, open = 'small') => talking(id, t) ? (chat(t, 9) ? open : 'line') : 'line';
const BLINK_IDX = (() => { for (let i = 0; i < 30; i++) for (let j = 0; j < 3; j++) if (litAt(i, j)) return i * 3 + j; return 0; })();

// ---------- key times ----------
const T_CLUNK = 19.4, T_PUNCH = 20.8, T_BUT = 22.82;

// ---------- captions ----------
function capText(lines, stress, y = PL_Y) {
  ctx.save(); let size = lines.length > 1 ? 86 : 100; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.font = `600 ${size}px Fredoka`; const widest = Math.max(...lines.map(l => ctx.measureText(l).width)); if (widest > 960) size = Math.floor(size * 960 / widest);
  ctx.font = `600 ${size}px Fredoka`;
  lines.forEach((ln, li) => {
    const ws = ln.split(' '), gap = 22, wd = ws.map(w => ctx.measureText(w).width); let x = 540 - (wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
    const yy = y + 40 + (li - (lines.length - 1) / 2) * (size + 8);
    ws.forEach((w, i) => { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(w, x, yy); ctx.fillStyle = stress.some(s => w.startsWith(s)) ? '#ffd84a' : '#fff'; ctx.fillText(w, x, yy); x += wd[i] + gap; });
  });
  ctx.restore();
}
const CAPS = {   // id: [lines, stress, hold after voice end, y]
  s1: [['I put them away', 'NEATLY.'], ['NEATLY'], 0.15], s2: [['He did NOT.'], ['NOT'], 0.2],
  s3: [['Okay. Other END.'], ['END'], 0.2], s4: [['…Of COURSE.'], ['…Of', 'COURSE'], 0.25],
  s6: [['YES! YES!'], ['YES'], 0.2], s7: [['Then he plugged in…', 'the REST.'], ['REST'], 0.25],
  s8b: [['…Merry Christmas,', 'everybody.'], ['everybody'], 0.4, 500],
};
function captions(t) {
  for (const l of TL.lines) {
    const c = CAPS[l.id]; if (!c) continue;
    if (t >= l.start - 0.03 && t <= l.end + c[2]) { const y = c[3] ?? PL_Y; capText(c[0], c[1], y); return { id: l.id, text: c[0].join(' '), x0: 40, y0: y - 60, x1: 1040, y1: y + 130 }; }
  }
  if (t >= T_CLUNK + 0.05 && t < T_CLUNK + 0.95) { strokedText('CLUNK', 540, 880, 150, '#fff2b0', 18); return { id: 'clunk', text: 'CLUNK', x0: 140, y0: 780, x1: 940, y1: 980 }; }
  return null;
}

// ---------- shared drawing ----------
const DARK = '#3a2d3c';
function curve(a, b, sag, n = 40, ex = 0) { const p = []; for (let i = 0; i <= n; i++) { const u = i / n; p.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + sag * 4 * u * (1 - u) + ex * Math.sin(u * Math.PI * 3)]); } return p; }
function polyPath(pts) { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); }
// a string of lights along a polyline; lit: (i)->bool|0..1 ; frac 0..1 draws only the first part
function strand(pts, o = {}) {
  const frac = o.frac ?? 1, last = Math.max(2, Math.floor(pts.length * frac)), P = pts.slice(0, last);
  wireStroke(() => polyPath(P), o.w ?? 12, o.col ?? WIRE);
  const gap = o.gap ?? 5, r = o.r ?? 24; let k = o.k0 ?? 0;
  for (let i = 2; i < P.length - 1; i += gap) {
    const a = P[i - 1], b = P[i + 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2 * (o.up ? -1 : 1);
    const lit = o.lit ? o.lit(i, k) : false; bulb(P[i][0], P[i][1], o.up ? ang : ang, k++, r, !!lit, o.glow ?? 1);
  }
}
function fist(x, y, r = 40, seed = 70) { const f = ellipsePts(x, y, r, r * 0.92, 24); ctx.fillStyle = SKIN; ctx.beginPath(); f.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); spen(0, seed, 6).outline(f, true, 6); }
function xmasBox(x0, y0, x1, y1, t, open = 0) {
  const p = spen(t, 44, 7); p.part([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], '#c79a5a', { shade: 0.18, lw: 8 });
  ctx.fillStyle = 'rgba(80,50,20,0.25)'; ctx.fillRect(x0 + 8, y0 + 8, x1 - x0 - 16, 26);
  text('XMAS', (x0 + x1) / 2, (y0 + y1) / 2 + 20, Math.min(90, (x1 - x0) * 0.3), INK, 'Fredoka', -0.04);
}
function heap(cx, cy, w, h, t, seed = 5, lit = false) {   // wire mess bulging out of a box
  for (let i = 0; i < 16; i++) {
    const rx = w * (0.35 + 0.35 * hash(i + seed)), ry = h * (0.3 + 0.7 * hash(i + seed + 20)), ox = (hash(i + seed + 40) - 0.5) * w * 0.5, rot = hash(i + seed + 60) * 3;
    wireStroke(() => { ctx.beginPath(); ctx.ellipse(cx + ox, cy, rx, ry, rot, 0, Math.PI); }, 12, i % 3 ? WIRE : '#3aa055');
  }
  for (let i = 0; i < 7; i++) bulb(cx + (hash(i + seed + 80) - 0.5) * w * 1.0, cy - h * (0.1 + 0.6 * hash(i + seed + 90)), (hash(i + seed) - 0.5) * 3 + Math.PI / 2, i, 22, lit || i === 3);
}
const wallSocket = (x, y, k = 1, on = false) => { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = '#f4f1e6'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-55, -75, 110, 150, 16); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#2a2230'; for (const dy of [-32, 32]) { ctx.beginPath(); ctx.roundRect(-8 - 14, dy - 16, 12, 32, 3); ctx.roundRect(8 + 2, dy - 16, 12, 32, 3); ctx.fill(); } ctx.restore(); };
const armTo = (sh, hand, bend, w = 64, seed = 32) => armTube([sh, bend, hand], w, MUSTARD, seed);
const stv = (X, Y, s, pose) => steve(X, Y, s, { hair: 1, eyes: 'dot', lid: 0.15, brow: 'worried', mouth: 'line', look: 0.3, fx: ['sweat'], arm: 'down', ...pose }, SKIN);
const sweatDrop = (X, Y, s, t) => { /* sweat is part of the character */ };

// =====================================================================================
// WORLD A · HOOK (frame 1 and the loop end)
// =====================================================================================
function hook(t, o = {}) {
  livingWall(t, 1600); glowBlob(540, 640, 800, 'rgba(255,225,160,0.35)');
  const s = 15, X = 540, hcY = 640, Y = hcY + 80 * s, dy = o.still ? 0 : 10 * Math.sin(t * 6), wob = o.still ? 0 : 0.025 * Math.sin(t * 4.5);
  const brow = o.still ? 'worried' : (Math.sin(t * 3.4) > 0.55 ? 'raised' : 'worried');
  armTube([[700, 1000], [870, 920], [850 + dy * 0.3, 700 + dy]], 64, MUSTARD, 32);
  steve(X, Y, s, { hair: 1, eyes: 'dot', lid: 0.1, brow, mouth: o.talk ? (chat(t, 9) ? 'small' : 'line') : 'line', look: 0.35, fx: ['sweat'], arm: 'down', tilt: o.still ? 0 : 1.5 * Math.sin(t * 3) }, SKIN);
  ctx.save(); ctx.translate(540, 1320); ctx.rotate(wob); const ks = 1 + (o.still ? 0 : 0.014 * Math.sin(t * 7)); ctx.scale(ks, ks); ctx.translate(-540, -1320);
  knotBall(540, 1320, 540, (!o.still && (t % 1.3) < 0.4) ? BLINK_IDX : -1); ctx.restore();
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(300, 860); ctx.quadraticCurveTo(540, 960, 780, 850); }, 14);
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(330, 820); ctx.quadraticCurveTo(520, 905, 740, 800); }, 12, '#3aa055');
  bulb(420, 905, 1.7, 1, 26, true); bulb(660, 892, 1.5, 3, 26, false);
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(830, 1090); ctx.bezierCurveTo(1010, 1000, 1010, 800 + dy, 872, 700 + dy); }, 13);
  plug(852, 630 + dy, 0.18 + wob * 2, 1.5); fist(852, 690 + dy, 46, 33);
  bulb(960, 930, 0.2, 2, 26, true);
}

// =====================================================================================
// WORLD R · living room: wall, XMAS box + Snuggles, Steve. o: sx, sy, s, pose, armL/armR {sh,hand,bend}, ball {k,cx,cy}, boxX
// =====================================================================================
function roomBG(t, o = {}) {
  livingWall(t, 1240);
  const bx = o.boxX ?? 790;
  xmasBox(bx, 1400, bx + 260, 1610, t);
  snuggles(bx + 130, 1400, 5.8, { eyes: 'dot', lid: o.slit ?? 0.35, look: o.slook ?? -0.8, mouth: 'line', tilt: o.stilt ?? -6, tail: 0.3 + 0.4 * Math.sin(t * 3) * (o.tailGo ? 1 : 0.2) });
}
function ball(cx, cy, k, t, o = {}) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.rot ?? 0); ctx.scale(k, k); knotBall(0, 0, 540, o.blink ?? -1, !!o.litAll); ctx.restore(); }

// =====================================================================================
// WORLD F · flashback "last January": Steve stomps the lights into the box, then sits on it (sepia)
// =====================================================================================
function flashback(t) {
  const t0 = 2.45;
  ctx.save(); ctx.filter = 'sepia(0.95) contrast(0.92) brightness(1.02)';
  livingWall(t, 1240);
  const boxX0 = 560, boxX1 = 1000, top = 1440, bot = 1640;
  const sitK = eio(seg(t, 3.12, 3.32)), bounce = t > 3.32 ? 0.04 * Math.sin((t - 3.32) * 22) * Math.exp(-(t - 3.32) * 5) : 0;
  const stomp = kf(t, [[2.45, 0], [2.58, 1], [2.68, 0.15], [2.86, 1], [2.97, 0.15], [3.1, 0.6], [3.12, 0.6]], x => x);
  const lidUp = 1 - sitK;
  // box + lights heap (bulges more with each stomp, sticks out the sides after sitting)
  xmasBox(boxX0, top, boxX1, bot, t);
  heap(780, top + 10, 380, 150 + 60 * (1 - stomp * 0.4) * lidUp + 30 * sitK, t, 5);
  if (sitK > 0.5) for (const [x, y, a] of [[boxX0 - 10, top + 40, -0.5], [boxX1 + 10, top + 60, 0.5], [boxX1 + 10, top + 120, 0.8]]) wireStroke(() => { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 90 * Math.sign(a), y - 30, x + 150 * Math.sign(a), y + 70); }, 12);
  // Steve: stomping at left, then hops onto the lid and sits
  const hopX = lerp(380, 780, eio(seg(t, 3.0, 3.12))), s = 7.5;
  if (sitK < 0.02) {
    const up = stomp, legs = [[[-4, 38], [-5, 19], [-5, 0]], [[4, 38], [16, 32 + 4 * up], [30, 20 + 14 * up]]];
    stv(hopX, 1640, s, { legPts: legs, brow: 'angry', mouth: 'teeth', lid: 0.1, look: 0.7, tilt: -3 * stomp, armL: 'wide', armR: 'wide', fx: ['sweat'], lean: 4 - 5 * stomp });
  } else {
    stv(780, lerp(1640, top + 10, 1) + 0 + bounce * 30, s, { sit: true, brow: 'worried', mouth: 'line', lid: 0.35, look: -0.3, armL: 'hips', armR: 'hips', fx: ['sweat'], legPts: [] });
    ctx.fillStyle = 'rgba(0,0,0,0)';
  }
  if (t > 3.35) { ctx.save(); ctx.translate(0, 0); strokedText('creak', 760, 1090, 56, '#fff6dc', 10); ctx.restore(); }
  ctx.restore(); ctx.filter = 'none';
  // label (outside the sepia)
  ctx.save(); ctx.font = '600 64px Fredoka'; const T = 'LAST JANUARY', w = ctx.measureText(T).width + 80; ctx.fillStyle = 'rgba(42,34,48,0.9)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, 330, w, 100, 50); ctx.fill(); text(T, 540, 383, 64, '#f2d9a8'); ctx.restore();
}

// =====================================================================================
// WORLD U · untangling: string pulled out of the ball (A), jump rope (B), cocoon spin (C), topple (D)
// =====================================================================================
function untangleA(t) {   // close-up: finds the end, pulls the long string out
  const t0 = 3.66; roomBG(t, {});
  const X = 380, Y = 1640, s = 8.5, pull = seg(t, 3.98, 4.5);
  const endX = lerp(560, 1500, eo(pull)), endY = lerp(1190, 1330, pull);
  // the string unspools from the ball to the right
  const a = [520, 1250], b = [endX, endY];
  stv(X, Y, s, { brow: 'angry', mouth: mouthFor('s3', t, 'small'), lid: 0.1, look: 0.8, tilt: 3, armL: 'down', fx: ['sweat'] });
  ball(X + 30, 1290, 0.42, t, {});
  if (pull > 0) strand(curve(a, b, 90 * pull, 50), { lit: null, gap: 6, r: 22, col: WIRE });
  // right hand holds the end; before the pull, it picks at the knot
  const hx = t < 3.98 ? 520 + 12 * Math.sin(t * 40) : Math.min(endX, 1000), hy = t < 3.98 ? 1200 : endY - 20;
  armTube([[X + 8 * s, 1640 - 60 * s], [X + 180, 1150], [hx, hy]], 62, MUSTARD, 35); fist(hx, hy, 40);
  if (t > 3.97 && t < 4.2) strokedText('POP', 640, 1020, 60, '#fff6dc', 10);
}
function jumprope(t) {
  roomBG(t, {});
  const q = t - 4.55, th = q * Math.PI * 2 * 2.4, X = 540, hop = Math.abs(Math.sin(th / 2 + 0.2)) * 70, Y = 1640 - hop;
  const L = [X - 270, 1210 - hop], R = [X + 270, 1210 - hop], c = Math.cos(th), mid = 1160 - 800 * (-c) * 1.0;   // rope mid-point y: over the head (c=-1) to under the feet (c=1)
  const cy = lerp(520, 1720, (c + 1) / 2);
  const rope = []; for (let i = 0; i <= 44; i++) { const u = i / 44; const x = lerp(L[0], R[0], u), yb = lerp(L[1], R[1], u); rope.push([x - 40 * Math.sin(u * Math.PI) * 0, yb + (cy - yb) * 4 * u * (1 - u) * 1.05 + 30 * Math.sin(u * Math.PI * 5 + th) * (1 - Math.abs(c))]); }
  stv(X, Y, 8.5, { brow: 'worried', mouth: 'teeth', lid: 0.05, look: 0, tilt: 2 * Math.sin(th), armL: 'down', armR: 'down', fx: ['sweat'], legPts: undefined });
  armTube([[X - 8 * 8.5, Y - 60 * 8.5], [X - 210, Y - 330], L], 58, MUSTARD, 33); armTube([[X + 8 * 8.5, Y - 60 * 8.5], [X + 210, Y - 330], R], 58, MUSTARD, 34);
  strand(rope, { gap: 4, r: 22 }); fist(L[0], L[1], 36); fist(R[0], R[1], 36);
  ball(150, 1540, 0.3, t, {});
}
function wraps(X, Y, s, n, t, ph = 0) {   // wire bands across the torso + legs, bulbs on top
  const k = Math.min(1, n);
  for (let i = 0; i < Math.floor(k * 18); i++) {
    const y = Y - 62 * s + i * (60 * s / 18) * 1.0, w = 15 * s + 18 * (hash(i) - 0.5) * 3;
    wireStroke(() => { ctx.beginPath(); ctx.moveTo(X - w, y + 8); ctx.quadraticCurveTo(X, y + 24 + 6 * Math.sin(ph + i), X + w, y - 8); }, 12, i % 3 ? WIRE : '#3aa055');
    if (i % 2 === 0) bulb(X + (i % 4 ? -1 : 1) * w * 0.8, y + 6, Math.PI / 2, i, 20, false);
  }
}
function cocoon(t, o = {}) {
  roomBG(t, {});
  const q = t - 5.45, a = o.a ?? (q * q * 11 + q * 6), sx = 0.45 + 0.55 * Math.abs(Math.cos(a)), X = 540, Y = o.Y ?? 1640, s = 8.5, n = o.n ?? seg(t, 5.45, 6.3);
  ctx.save(); ctx.translate(X, Y); if (o.rot) ctx.rotate(o.rot); ctx.scale(sx, 1); ctx.translate(-X, -Y);
  stv(X, Y, s, { brow: 'worried', mouth: 'O', lid: 0.05, look: 0.0, armL: 'down', armR: 'down', fx: ['sweat'], tilt: 4 * Math.sin(a * 2) });
  wraps(X, Y, s, n, t, a);
  // loose end of the string whipping
  ctx.restore();
  ball(150 + 30 * Math.sin(a), 1540, 0.3 * (1 - 0.5 * n), t, {});
  if (!o.rot) for (let i = 0; i < 3; i++) { const ang = a * 1.5 + i * 2.1; star(X + 190 * Math.cos(ang) * sx + 0, Y - 700 * 1 + 40 * Math.sin(ang), 26, '#ffe14a'); }
}

// =====================================================================================
// WORLD H · plugged in: dark (wall socket, strand, Steve flat)
// =====================================================================================
function plugged(t) {
  const q = t - 7.0; livingWall(t, 1240);
  const px = lerp(260, 138, eo(seg(t, 7.0, 7.1)));
  wallSocket(100, 1470, 1.0);
  // strand from the plug across the floor to Steve's feet, all dark; a lone bulb blinks at 7.82
  const pts = curve([px + 20, 1470], [980, 1600], 160, 50);
  plug(px + 50, 1470, Math.PI / 2, 0.9);
  strand(pts, { lit: (i, k) => (k === 2 && t > 7.82 && t < 7.92), gap: 6, r: 22 });
  const X = 740, Y = 1700;
  stv(X, Y, 8.5, { hair: 2, bags: 1, brow: 'worried', mouth: mouthFor('s4', t, 'small'), lid: 0.5, look: -0.9, tilt: 5, fx: ['sweat'], armL: 'down', armR: 'down' });
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(X - 120, Y - 8.5 * 56); ctx.quadraticCurveTo(X, Y - 8.5 * 46, X + 130, Y - 8.5 * 58); }, 12);
  bulb(X - 60, Y - 8.5 * 50, Math.PI / 2, 1, 22, false); bulb(X + 70, Y - 8.5 * 52, Math.PI / 2, 2, 22, false);
  ctx.fillStyle = 'rgba(30,20,50,0.28)'; ctx.fillRect(0, 0, W, H);
}
function strandCU(t) {   // extreme CU on one bulb: the lone blink
  ctx.fillStyle = '#d9c19b'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(30,20,50,0.3)'; ctx.fillRect(0, 0, W, H);
  const pts = curve([-100, 1050], [1180, 1000], 120, 30);
  strand(pts, { gap: 7, r: 80, w: 30, lit: (i, k) => k === 2 && t > 8.0 && t < 8.1 });
  if (t > 8.0 && t < 8.1) glowBlob(540, 1060, 600, 'rgba(255,240,200,0.5)');
  ctx.save(); ctx.font = '600 70px Fredoka'; ctx.restore();
}

// =====================================================================================
// WORLD M · montage: loupe over the bulbs, counter rolls, night falls
// =====================================================================================
const count = t => Math.round(kf(t, [[8.6, 1], [9.4, 22], [10.4, 88], [11.4, 140], [11.9, 147]], x => x));
function nightSky(t, x, y, w, h) {
  const k = seg(t, 8.6, 11.6), top = [lerp(240, 8, k) | 0, lerp(150, 12, k) | 0, lerp(100, 34, k) | 0], bot = [lerp(255, 26, k) | 0, lerp(190, 32, k) | 0, lerp(120, 70, k) | 0];
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, `rgb(${top})`); g.addColorStop(1, `rgb(${bot})`); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = `rgba(255,255,255,${k})`; for (let i = 0; i < 8; i++) ctx.fillRect(x + hash(i) * w, y + hash(i + 9) * h * 0.7, 6, 6);
}
function counterCard(t, y = 400) {
  const n = count(t), T = `${n}/200`; ctx.save(); ctx.font = '600 110px Fredoka'; const w = ctx.measureText(T).width + 80;
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, y - 70, w, 140, 36); ctx.fill(); text(T, 540, y + 6, 110, n >= 147 ? '#ffd84a' : '#fff6dc'); ctx.restore();
}
function loupe(x, y, r, t, inner) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); inner && inner(); ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.strokeStyle = '#b0a080'; ctx.lineWidth = 7; ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + r * 0.72, y + r * 0.72); ctx.lineTo(x + r * 1.5, y + r * 1.5); ctx.stroke(); ctx.strokeStyle = '#7a4a2a'; ctx.lineWidth = 20; ctx.stroke(); }
function montageSit(t) {
  ctx.fillStyle = '#e6c9a0'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#9a6a45'; ctx.fillRect(0, 1260, W, 700); spen(t, 40, 8).line([[-10, 1260], [W + 10, 1260]], 9, INK);
  nightSky(t, 90, 400, 300, 440); { const p = spen(t, 41, 7); p.outline([[90, 400], [390, 400], [390, 840], [90, 840]], true, 9); p.line([[240, 400], [240, 840]], 7); p.line([[90, 620], [390, 620]], 7); }
  glowBlob(540, 1000, 700, `rgba(255,225,160,${0.28 * (1 - seg(t, 8.6, 11.8))})`);
  const X = 600, Y = 1640, s = 8.5, hop = (t * 3.3) % 1;
  stv(X, Y, s, { sit: true, hair: 2, bags: seg(t, 8.6, 12) > 0.5 ? 1 : 0, brow: 'worried', mouth: 'line', lid: 0.45, look: -0.4, tilt: 5, fx: ['sweat'], armL: 'down', armR: 'down', legPts: [] });
  const sag = curve([140, 1480], [1000, 1470], 220, 50);
  strand(sag, { gap: 6, r: 24 });
  const bi = Math.floor(lerp(8, 40, seg(t, 8.6, 9.8))), hp = sag[Math.min(sag.length - 1, bi)] || sag[8];
  armTube([[X + 8 * s, Y - 60 * s + 80], [X + 230, 1250], [hp[0] + 80, hp[1] - 120]], 60, MUSTARD, 34);
  loupe(hp[0], hp[1] - 40, 90, t, () => { const [x, y] = [hp[0], hp[1] - 40]; ctx.save(); ctx.translate(x, y); ctx.scale(1.8, 1.8); ctx.translate(-hp[0], -hp[1]); bulb(hp[0], hp[1], Math.PI / 2, 1, 24, false); ctx.restore(); });
}
function montageCU(t) {
  ctx.fillStyle = '#d9c19b'; ctx.fillRect(0, 0, W, H); nightSky(t, 0, 0, W, 560);
  ctx.fillStyle = '#8a6a48'; ctx.fillRect(0, 1000, W, 920); spen(t, 40, 8).line([[-10, 1000], [W + 10, 1000]], 9, INK);
  const slot = (t - 9.8) / 0.28, sc = slot * 230;   // the strand scrolls left, one bulb per slot
  const pts = curve([-400 - sc % 230, 1300], [1500 - sc % 230, 1300], 0, 40);
  for (let i = -2; i < 7; i++) { const x = 130 + i * 230 - ((sc) % 230); bulb(x, 1290, Math.PI / 2, i + Math.floor(sc / 230), 54, false); }
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(-100, 1280); ctx.lineTo(1180, 1280); }, 22);
  for (let i = -2; i < 7; i++) { const x = 130 + i * 230 - (sc % 230); bulb(x, 1290, Math.PI / 2, i + Math.floor(sc / 230), 54, false); }
  const lx = 400 + 30 * Math.sin(t * 6), ly = 1250;
  loupe(lx, ly, 190, t, () => { ctx.save(); ctx.translate(lx, ly); ctx.scale(1.6, 1.6); ctx.translate(-lx, -ly); const x = 130 + 2 * 230 - (sc % 230) + 40; bulb(x, 1290, Math.PI / 2, 2, 54, false); ctx.restore(); });
  const tick = (t - 9.8) % 0.28 < 0.05; if (tick) glowBlob(lx, ly, 260, 'rgba(255,255,255,0.35)');
}
function montageFace(t) {
  ctx.fillStyle = '#e6c9a0'; ctx.fillRect(0, 0, W, H); nightSky(t, 0, 0, W, 760);
  { const p = spen(t, 41, 8); p.line([[0, 760], [W, 760]], 9, INK); }
  const k = seg(t, 10.9, 12.0);
  const s = 15, X = 540, hcY = 1090 + 8 * Math.sin(t * 9), Y = hcY + 80 * s;
  stv(X, Y, s, { hair: 2, bags: 1, brow: 'worried', mouth: 'line', lid: 0.55 - 0.3 * seg(t, 11.8, 12.0), look: 0.8, tilt: 3, fx: ['sweat'] });
  // loupe over his right eye (screen left), with a huge eye
  const ex = 540 + 15 * s * 0.38 * 1.0 + 0, ey = hcY + 15 * 0.0;
  loupe(380, hcY - 20, 190, t, () => { ctx.fillStyle = '#f4efe6'; ctx.beginPath(); ctx.ellipse(380, hcY - 20, 150, 120, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#7a4a2a'; ctx.beginPath(); ctx.arc(380 + 40 * Math.sin(t * 5), hcY - 20, 70, 0, 7); ctx.fill(); ctx.fillStyle = '#05060d'; ctx.beginPath(); ctx.arc(380 + 40 * Math.sin(t * 5), hcY - 20, 34, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(200,40,40,0.5)'; ctx.lineWidth = 4; for (let i = 0; i < 8; i++) { const a = i * 0.8; ctx.beginPath(); ctx.moveTo(380 + 140 * Math.cos(a), hcY - 20 + 110 * Math.sin(a)); ctx.lineTo(380 + 80 * Math.cos(a), hcY - 20 + 62 * Math.sin(a)); ctx.stroke(); } });
  // the bad bulb in his fingers at the end (black, burnt)
  if (t > 11.5) { const bx = 780, by = 1480 - 140 * eo(seg(t, 11.5, 11.9)); bulb(bx, by, Math.PI / 2, 3, 70, false); ctx.save(); ctx.strokeStyle = '#05060d'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(bx - 20, by + 60); ctx.lineTo(bx + 20, by + 90); ctx.stroke(); ctx.restore(); fist(bx, by + 180, 52, 73); }
}

// =====================================================================================
// WORLD P · peak: wrapped in lights, bloom
// =====================================================================================
function peakWorld(t, o = {}) {
  const T0 = 12.42, lit = t >= T0 ? 1 : 0, since = t - T0;
  livingWall(t, 1560);
  { const p = spen(t, 41, 7); ctx.fillStyle = '#1b2447'; ctx.fillRect(40, 420, 250, 420); ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (const [x, y] of [[90, 480], [220, 540], [150, 640], [240, 740], [80, 770]]) ctx.fillRect(x, y, 7, 7);
    p.outline([[40, 420], [290, 420], [290, 840], [40, 840]], true, 9); p.line([[165, 420], [165, 840]], 7); p.line([[40, 630], [290, 630]], 7); }
  { const p = spen(t, 42, 7); p.part(roundPoly([[800, 1150], [1090, 1150], [1090, 1560], [800, 1560]], 40), '#b4503f', { shade: 0.15, lw: 8 }); }
  const s = 10.5, X = 540, hcY = 690, Y = hcY + 80 * s + (o.hop ?? 0);
  const ry0 = Y - 61 * s, wAt = y => 140 + (y - ry0) * 0.2;
  ctx.save(); ctx.translate(X, Y); ctx.scale(o.sx ?? 1, 1); ctx.translate(-X, -Y);
  const up = o.pump ?? 0;
  steve(X, Y, s, { hair: 2, eyes: lit ? 'happy' : 'dot', lid: lit ? undefined : 0.3, brow: lit ? 'raised' : 'worried', mouth: lit ? 'grin' : 'line', fx: lit ? ['blush'] : ['sweat'], arm: up > 0.3 ? 'surrender' : 'down', tilt: lit ? 3 * Math.sin(t * 30) * up : 0, bags: 1 }, SKIN);
  const path = []; for (let i = 0, y = ry0 - 10; y < Y - 30; i++, y += 62) path.push([X + (i % 2 ? 1 : -1) * wAt(y), y]);
  const pc = [[path[0][0], path[0][1]]]; path.forEach((q, i) => { if (i) pc.push(q); });
  const smooth = []; for (let i = 1; i < path.length; i++) for (let j = 0; j <= 10; j++) { const u = j / 10; smooth.push([lerp(path[i - 1][0], path[i][0], u), lerp(path[i - 1][1], path[i][1], u) + Math.sin(u * Math.PI) * 17]); }
  strand(smooth, { gap: 4, r: 22, lit: (i, k) => lit && (0.5 + 0.5 * Math.sin(t * 12 + k)) > 0.15 ? 1 : 0, glow: 1.2 });
  star(X, hcY - 292, 58, lit ? '#ffe14a' : '#8a7a40');
  ctx.restore();
  // cord to the wall socket
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(X - wAt(Y - 90), Y - 90); ctx.bezierCurveTo(300, Y + 20, 200, Y + 60, 90, 1500); }, 11);
  { ctx.fillStyle = '#f4f1e6'; ctx.beginPath(); ctx.roundRect(40, 1450, 90, 110, 10); ctx.fill(); spen(t, 43, 5).outline([[40, 1450], [130, 1450], [130, 1560], [40, 1560]], true, 6); plug(86, 1480, 0, 0.8); }
  { const p = spen(t, 44, 7); p.part([[800, 1560], [1060, 1560], [1060, 1760], [800, 1760]], '#c79a5a', { shade: 0.18, lw: 8 }); text('XMAS', 930, 1660, 70, INK, 'Fredoka', -0.04); }
  snuggles(930, 1560, 5.8, { eyes: 'dot', lid: 0.35, look: -0.8, mouth: 'line', tilt: -6, tail: 0.3 });
  if (lit) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,215,150,0.28)'; ctx.fillRect(0, 0, W, H); ctx.restore(); glowBlob(540, 1150, 820 * (1 + 0.15 * Math.sin(t * 14)), 'rgba(255,200,110,0.42)');
    const rr = 200 + 2400 * eo(seg(t, T0, T0 + 0.35)); if (since < 0.4) { ctx.save(); ctx.globalAlpha = 0.7 * (1 - since / 0.4); ctx.strokeStyle = '#fff6c8'; ctx.lineWidth = 60; ctx.beginPath(); ctx.arc(540, 1000, rr, 0, 7); ctx.stroke(); ctx.restore(); } if (since < 0.1) { ctx.fillStyle = `rgba(255,250,220,${0.8 * (1 - since / 0.1)})`; ctx.fillRect(0, 0, W, H); } }
  else { ctx.fillStyle = 'rgba(25,20,60,0.35)'; ctx.fillRect(0, 0, W, H); }
}
function bloomCU(t) {   // 12.26–12.85: the bulb swap and the plug-in, then ALL light
  const T0 = 12.42, lit = t >= T0;
  ctx.fillStyle = lit ? '#f1d9a4' : '#6a5a6a'; ctx.fillRect(0, 0, W, H);
  wallSocket(540, 1000, 2.6);
  const px = lerp(540, 540, 1), pk = seg(t, 12.28, 12.4);
  plug(540, lerp(560, 1010, pk) , 0, 2.4); fist(540, lerp(560, 1010, pk) + 250, 90, 77);
  armTube([[1100, 1800], [880, 1500], [560, lerp(560, 1010, pk) + 330]], 120, MUSTARD, 36);
  if (lit) { glowBlob(540, 1000, 1100, 'rgba(255,230,140,0.9)'); const since = t - T0; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, rr = 100 + 1200 * eo(Math.min(1, since / 0.3)); ctx.strokeStyle = BULB_LIT[i % 5]; ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(540 + Math.cos(a) * (rr * 0.4), 1000 + Math.sin(a) * (rr * 0.4)); ctx.lineTo(540 + Math.cos(a) * rr, 1000 + Math.sin(a) * rr); ctx.stroke(); } }
}

// =====================================================================================
// WORLD D · dread: the power strip, the house, the street
// =====================================================================================
function powerStrip(t, o = {}) {
  ctx.fillStyle = '#d9c19b'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#9a6a45'; ctx.fillRect(0, 1180, W, 740); spen(t, 40, 8).line([[-10, 1180], [W + 10, 1180]], 9, INK);
  const sx = (o.shake ? shake(t, o.shake)[0] : 0), sy = (o.shake ? shake(t, o.shake)[1] : 0);
  ctx.save(); ctx.translate(sx, sy);
  // cords: 30 strings in a fan
  const N = 15, bx0 = 90, bw = 900, by = 1100;
  for (let i = 0; i < N; i++) {
    const x = bx0 + 40 + i * (bw - 80) / (N - 1), top = i % 2 === 0, tx = x + (i - N / 2) * 70 + (top ? -80 : 80), ty = top ? 160 - (i % 4) * 60 : 1960;
    wireStroke(() => { ctx.beginPath(); ctx.moveTo(x, by); ctx.bezierCurveTo(x, by + (top ? -300 : 200), tx, ty + (top ? 500 : -400), tx, ty); }, 11, i % 3 ? WIRE : '#3aa055');
    if (i % 3 === 0) bulb(lerp(x, tx, 0.55), lerp(by, ty, 0.55) + (top ? 0 : 0), Math.PI / 2, i, 24, true, 0.9);
  }
  // the strip body
  const p = spen(t, 90, 8); p.part(roundPoly([[bx0, by], [bx0 + bw, by], [bx0 + bw, by + 150], [bx0, by + 150]], 26), '#ece7da', { shade: 0.15, lw: 9 });
  for (let i = 0; i < N; i++) { const x = bx0 + 40 + i * (bw - 80) / (N - 1); ctx.fillStyle = '#2a2230'; ctx.fillRect(x - 14, by + 50, 10, 40); ctx.fillRect(x + 4, by + 50, 10, 40); }
  // sticker: the plant
  ctx.save(); ctx.translate(540, by + 215); ctx.fillStyle = '#ffd84a'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-330, -52, 660, 104, 16); ctx.fill(); ctx.stroke();
  text('MAX 3 STRINGS', 0, 4, 66, INK, 'Fredoka'); ctx.restore();
  // power LED + smoke/sparks
  const heat = o.heat ?? 0; ctx.fillStyle = heat > 0.5 ? '#ff3a2a' : '#4cff7a'; ctx.beginPath(); ctx.arc(bx0 + bw - 50, by + 120, 14, 0, 7); ctx.fill();
  if (heat > 0.2) for (let i = 0; i < 5; i++) { const ph = (t * 1.4 + i * 0.37) % 1; ctx.fillStyle = `rgba(80,70,80,${0.5 * (1 - ph)})`; ctx.beginPath(); ctx.arc(540 + (i - 2) * 160 + 30 * Math.sin(t * 4 + i), by - 40 - 380 * ph, 40 + 70 * ph, 0, 7); ctx.fill(); }
  if (heat > 0.3) for (let i = 0; i < 6; i++) { if (((t * 18 + i * 3.1) % 6) < 1.2) { const x = 160 + hash(Math.floor(t * 9) + i) * 760; ctx.strokeStyle = '#fff0a0'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x + 30, by - 70); ctx.lineTo(x - 10, by - 100); ctx.lineTo(x + 40, by - 170); ctx.stroke(); glowBlob(x + 20, by - 90, 130, 'rgba(255,230,120,0.5)'); } }
  ctx.restore();
  // the last plug goes in (hand)
  if (o.hand !== undefined) { const k = o.hand; plug(bx0 + 40 + 7 * (bw - 80) / (N - 1), lerp(by - 300, by + 20, eo(k)), 0, 1.4); armTube([[1100, 400], [900, lerp(560, 760, k)], [bx0 + 40 + 7 * (bw - 80) / (N - 1) + 30, lerp(by - 170, by - 40, eo(k))]], 80, MUSTARD, 36); }
}
function houseNight(t, o = {}) {   // exterior: his house covered in lights, reindeer inflating. o.flick (0..1), o.deer (0..1)
  const g = ctx.createLinearGradient(0, 0, 0, 1300); g.addColorStop(0, '#080b1c'); g.addColorStop(1, '#1a2146'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 30; i++) ctx.fillRect(hash(i) * W, 100 + hash(i + 40) * 600, 5, 5);
  ctx.fillStyle = '#10142e'; ctx.fillRect(0, 1380, W, 540); spen(t, 56, 5).line([[0, 1380], [W, 1380]], 6, '#34407a');
  const fl = o.flick ? (Math.sin(t * 60) > -0.2 ? 1 : 0.15) : 1;
  const hx0 = 150, hx1 = 930, top = 840, base = 1380, roofTop = 560;
  glowBlob(540, 1000, 1000 * fl, 'rgba(255,200,110,0.30)');
  poly([[hx0, base], [hx0, top], [540, roofTop], [hx1, top], [hx1, base]], '#6d4a3a'); spen(t, 31, 9).outline([[hx0, base], [hx0, top], [540, roofTop], [hx1, top], [hx1, base]], false, 10);
  for (const x of [330, 750]) { ctx.fillStyle = '#ffd98a'; ctx.fillRect(x - 70, 960, 140, 160); spen(t, 33, 6).outline([[x - 70, 960], [x + 70, 960], [x + 70, 1120], [x - 70, 1120]], true, 7); }
  ctx.fillStyle = '#5a3a2a'; ctx.fillRect(480, 1130, 120, 250);
  // lights everywhere: roof edges, eaves, windows, door, ground
  const lit = (i, k) => (0.5 + 0.5 * Math.sin(t * 9 + k * 1.3)) > 0.1 && fl > 0.5;
  strand(curve([hx0, top], [540, roofTop], 0, 14), { gap: 3, r: 22, lit });
  strand(curve([540, roofTop], [hx1, top], 0, 14), { gap: 3, r: 22, lit, k0: 5 });
  strand(curve([hx0 - 10, top], [hx1 + 10, top], 70, 30), { gap: 4, r: 22, lit, k0: 2 });
  for (const x of [330, 750]) strand(curve([x - 90, 940], [x + 90, 940], 40, 12), { gap: 3, r: 18, lit, k0: x });
  strand(curve([hx0, 1370], [hx1, 1370], 0, 30), { gap: 4, r: 22, lit, k0: 9 });
  // tree + shrubs
  for (const [x, w] of [[90, 90], [990, 90]]) { poly([[x - w, 1380], [x, 1060], [x + w, 1380]], '#1f5a35'); strand(curve([x - w * 0.6, 1330], [x + w * 0.6, 1330], 30, 10), { gap: 3, r: 16, lit, k0: x }); }
  // reindeer inflating
  const d = o.deer ?? 0, k = 0.15 + 0.85 * d, wob = d < 1 ? 0.05 * Math.sin(t * 20) : 0;
  ctx.save(); ctx.translate(760, 1400); ctx.scale(k * (1 + wob), k * (1 - wob)); const rp = [[-150, -140], [-150, -300], [150, -300], [150, -140]];
  ctx.fillStyle = '#c28a52'; ctx.strokeStyle = INK; ctx.lineWidth = 8 / k;
  ctx.beginPath(); ctx.ellipse(0, -220, 190, 120, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(170, -340, 80, 70, 0, 0, 7); ctx.fill(); ctx.stroke();
  for (const lx of [-110, -40, 60, 130]) { ctx.beginPath(); ctx.roundRect(lx - 22, -140, 44, 140, 18); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#e83a3a'; ctx.beginPath(); ctx.arc(235, -330, 30, 0, 7); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 10 / k; ctx.beginPath(); ctx.moveTo(150, -400); ctx.lineTo(130, -520); ctx.lineTo(90, -600); ctx.moveTo(130, -520); ctx.lineTo(190, -590); ctx.moveTo(190, -400); ctx.lineTo(210, -520); ctx.lineTo(250, -600); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(190, -350, 14, 0, 7); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(196, -350, 6, 0, 7); ctx.fill(); ctx.restore();
  // extension cord running to the window, sparking strip on the lawn
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(540, 1260); ctx.bezierCurveTo(600, 1400, 460, 1500, 330, 1560); }, 10, '#f09a2a');
}
function street(t, o = {}) {
  const k = o.k ?? 1; const g = ctx.createLinearGradient(0, 0, 0, 1300); g.addColorStop(0, '#080b1c'); g.addColorStop(1, '#1a2146'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 40; i++) ctx.fillRect(hash(i) * W, 100 + hash(i + 40) * 700, 5, 5);
  ctx.fillStyle = '#0a0c18'; ctx.fillRect(0, 1230, W, 700); spen(t, 56, 5).line([[0, 1230], [W, 1230]], 6, '#34407a');
  const fl = Math.sin(t * 55) > -0.1 ? 1 : 0.2;
  // neighbours: small dim houses either side
  const hs = (x0, x1, top, roof, col) => { poly([[x0, 1230], [x0, top], [(x0 + x1) / 2, top - roof], [x1, top], [x1, 1230]], col); ctx.fillStyle = '#c9a252'; ctx.fillRect(x0 + 40, top + 80, 50, 70); ctx.fillRect(x1 - 90, top + 80, 50, 70); };
  hs(-60, 200, 880, 90, '#161a38'); hs(220, 420, 920, 80, '#1b2040'); hs(660, 880, 920, 80, '#161a38'); hs(900, 1140, 880, 90, '#1b2040');
  // his house, small + blazing
  glowBlob(540, 880, 900 * fl, 'rgba(255,200,110,0.5)'); glowBlob(540, 760, 600, 'rgba(255,230,160,0.35)');
  const hx0 = 430, hx1 = 650, top = 940, roofTop = 800; poly([[hx0, 1230], [hx0, top], [540, roofTop], [hx1, top], [hx1, 1230]], '#6d4a3a');
  const lit = (i, kk) => fl > 0.5;
  strand(curve([hx0, top], [540, roofTop], 0, 10), { gap: 2, r: 14, lit, w: 7 }); strand(curve([540, roofTop], [hx1, top], 0, 10), { gap: 2, r: 14, lit, w: 7 });
  strand(curve([hx0, 1220], [hx1, 1220], 0, 10), { gap: 2, r: 14, lit, w: 7 }); strand(curve([hx0, 1070], [hx1, 1070], 20, 10), { gap: 2, r: 14, lit, w: 7 });
  // reindeer, big
  ctx.fillStyle = '#c28a52'; ctx.beginPath(); ctx.ellipse(740, 1170, 110, 62, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(840, 1100, 40, 0, 7); ctx.fill(); ctx.fillStyle = '#e83a3a'; ctx.beginPath(); ctx.arc(880, 1105, 16, 0, 7); ctx.fill();
  // power pole + sparks crawling
  ctx.fillStyle = '#2a2230'; ctx.fillRect(150, 560, 24, 670); ctx.fillRect(100, 600, 120, 16); const sp = o.spark ?? 0;
  if (sp > 0 && ((t * 20) % 3) < 1.4) { ctx.strokeStyle = '#fff0a0'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(160, 604); ctx.lineTo(210, 650); ctx.lineTo(190, 680); ctx.lineTo(240, 740); ctx.stroke(); glowBlob(200, 660, 200, 'rgba(255,230,120,0.6)'); }
  ctx.strokeStyle = '#2a2230'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(100, 608); ctx.quadraticCurveTo(300, 700, 540, 790); ctx.stroke();
}

// =====================================================================================
// WORLD B · button: torchlight stomp, knot swells, loop to frame 1
// =====================================================================================
function torchRoom(t, o = {}) {
  ctx.fillStyle = '#06070f'; ctx.fillRect(0, 0, W, H);
  ctx.save(); const tx = 540, ty = 1250, tr = o.tr ?? 560; ctx.beginPath(); ctx.arc(tx, ty, tr, 0, 7); ctx.clip();
  livingWall(t, 1240);
  const bx = 520; xmasBox(bx - 150, 1420, bx + 250, 1640, t);
  const st = o.stomp ?? 0, lidK = o.lid ?? 0;
  heap(bx + 50, 1430, 340, 120 + 90 * (1 - st * 0.5) * (1 - lidK), t, 5);
  // lid
  if (lidK > 0) { const p = spen(t, 46, 7); p.part([[bx - 160, 1420 - 90 * (1 - lidK)], [bx + 260, 1420 - 90 * (1 - lidK)], [bx + 260, 1450], [bx - 160, 1450]], '#b88a4a', { shade: 0.2, lw: 8 }); }
  const sk = o.foot ?? 0, legs = [[[-4, 38], [-5, 19], [-5, 0]], [[4, 38], [14, 32 + 4 * sk], [24, 20 + 16 * sk]]];
  stv(220, 1640, 7.5, { legPts: legs, brow: 'angry', mouth: 'line', lid: 0.2, look: 0.9, tilt: 3, armL: 'hips', armR: 'down', fx: ['sweat'], lean: 3 });
  ctx.restore();
  // torch beam edge
  ctx.save(); const gr = ctx.createRadialGradient(tx, ty, tr * 0.55, tx, ty, tr); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.9)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function swell(t) {   // lid slams, wires burst, the knot balloons
  const k = eo(seg(t, 23.95, 24.6)); torchRoom(t, { lid: 1, stomp: 1, foot: 0, tr: 560 + 400 * k });
  ctx.save(); ctx.translate(...shake(t, 10 * (1 - k), 38)); ball(540, 1300, 0.12 + 1.0 * k, t, { rot: k * 1.2 }); ctx.restore();
}

// =====================================================================================
const SHOTS = [];
function build() {
  const bC = t => ({});
  SHOTS.push(
    // A · HOOK (s1): frame 1 = glance hook; knot shifts, a bulb blinks off, eyebrow
    [0, t => cam(kf(t, [[0, 1.0], [1.1, 1.05]], x => x), 540, 960, () => hook(t, { talk: talking('s1', t) }))],
    // B · pull-back into the living room: XMAS box, Snuggles on it; Steve points at the box
    [1.1, t => {
      const z = kf(t, [[1.1, 2.4], [2.05, 1.0]], eio), fx = kf(t, [[1.1, 390], [2.05, 540]], eio), fy = kf(t, [[1.1, 1150], [2.05, 960]], eio), X = 380, s = 8.5, Y = 1640, pt = seg(t, 1.8, 2.1);
      cam(z, fx, fy, () => {
        roomBG(t, { tailGo: t > 1.9, stilt: -6 + 4 * Math.sin(t * 8) * (t > 1.9 ? 1 : 0) });
        stv(X, Y, s, { brow: t > 1.8 ? 'angry' : 'worried', mouth: mouthFor('s1', t, 'small'), lid: 0.1, look: 0.9, tilt: 2 + 3 * pt, armL: 'down', fx: ['sweat'] });
        ball(X + 10, 1290, 0.42, t, { blink: (t % 1.3) < 0.4 ? BLINK_IDX : -1 });
        const hand = [lerp(X + 270, 790, pt), lerp(900, 1180, pt)];
        armTube([[X + 8 * s, Y - 60 * s], [X + 200, 1100], hand], 62, MUSTARD, 32); fist(hand[0], hand[1], 40, 32);
        wireStroke(() => { ctx.beginPath(); ctx.moveTo(X + 120, 1180); ctx.bezierCurveTo(X + 300, 1180, hand[0] - 40, hand[1] + 140, hand[0], hand[1] + 40); }, 12);
        plug(hand[0] + 10, hand[1] - 70, 0.15, 1.1);
      });
    }],
    // C · flashback (s2): last January, stomp stomp, sit on the lid
    [2.45, t => cam(kf(t, [[2.45, 1.0], [3.65, 1.12]], x => x), 640, 1250, () => flashback(t), ...shake(t, (t > 3.3 && t < 3.45) ? 6 : 0, 40))],
    // D · Other END (s3): finds the end, pulls the string out
    [3.65, t => cam(kf(t, [[3.65, 2.2], [4.55, 1.6]], x => x), kf(t, [[3.65, 480], [4.55, 760]], x => x), 1180, () => untangleA(t), ...shake(t, (t > 3.97 && t < 4.05) ? 5 : 0))],
    // E · jump rope
    [4.55, t => cam(1.0, 540, 1010, () => jumprope(t))],
    // F · spin into a cocoon
    [5.45, t => cam(kf(t, [[5.45, 1.15], [6.45, 1.4]], x => x), 540, 1100, () => cocoon(t), ...shake(t, 3, 44))],
    // G · topple
    [6.45, t => {
      const q = t - 6.45, fall = eio(seg(t, 6.45, 6.72)), rot = (Math.PI / 2) * fall - 0.12 * Math.sin(Math.max(0, t - 6.72) * 24) * Math.exp(-(t - 6.72) * 6) * (t > 6.72 ? 1 : 0);
      cam(1.0, 540, 1250, () => cocoon(t, { a: 0.0, n: 1, rot, Y: 1640 }), ...shake(t, (t > 6.72 && t < 6.9) ? 14 : 0, 41));
      if (t > 6.72 && t < 6.95) strokedText('THUD', 380, 1040, 90, '#fff6dc', 14);
    }],
    // H · plugged in, dark (s4)
    [7.0, t => cam(kf(t, [[7.0, 1.0], [7.9, 1.18]], x => x), 640, 1400, () => plugged(t))],
    // I · one bulb blinks and dies
    [7.9, t => cam(1.0, 540, 1000, () => strandCU(t))],
    // M1 · montage: the loupe, the counter, night falls
    [8.6, t => { cam(kf(t, [[8.6, 1.0], [9.8, 1.15]], x => x), 540, 1000, () => montageSit(t)); counterCard(t, 560); }],
    [9.8, t => { cam(1.0, 540, 1000, () => montageCU(t)); counterCard(t, 420); }],
    [10.9, t => { cam(kf(t, [[10.9, 1.0], [12.26, 1.1]], x => x), 540, 1000, () => montageFace(t)); counterCard(t, 330); }],
    // P · PEAK (s6): bulb swap + plug → ALL light; three hard fist pumps with a shake and an impact on each
    [12.26, t => bloomCU(t)],
    [12.5, t => { const P = [12.58, 13.1, 13.6], pulse = ts => seg(t, ts - 0.08, ts) * (1 - seg(t, ts + 0.1, ts + 0.3)), pump = Math.max(...P.map(pulse)), sk = Math.max(...P.map(ts => (t >= ts && t < ts + 0.12) ? 1 : 0));
      const hop = -40 * pump; cam(kf(t, [[12.5, 1.25], [14.23, 1.0]], x => x), 540, 880, () => peakWorld(t, { pump: 0.2 + 0.8 * pump, hop, sx: (t > 13.2 && t < 13.55) ? Math.cos((t - 13.2) * 22) * 0.9 + 0.05 : 1 }), sk * 16 * Math.sin(t * 190), sk * 16 * Math.cos(t * 170)); }],
    // D · dread (s7): the power strip, the house, the street, the strip fizzes
    [14.23, t => cam(kf(t, [[14.23, 1.0], [15.5, 1.12]], x => x), 540, 1100, () => powerStrip(t, { hand: seg(t, 14.4, 14.95), heat: seg(t, 14.95, 15.4) * 0.4, shake: t > 14.95 ? 3 : 0 }))],
    [15.5, t => cam(kf(t, [[15.5, 1.35], [17.0, 1.0]], x => x), 600, 1050, () => houseNight(t, { deer: seg(t, 15.55, 16.9), flick: t > 16.6 }), ...shake(t, 2, 45))],
    [17.0, t => cam(kf(t, [[17.0, 1.0], [18.2, 0.8]], x => x), 540, 960, () => street(t, { spark: t > 17.6 ? 1 : 0 }), ...shake(t, 3, 50))],
    [18.2, t => cam(kf(t, [[18.2, 1.0], [19.4, 1.25]], x => x), 540, 1000, () => powerStrip(t, { heat: 1, shake: 6 }))],
    // CLUNK · hard cut to black: only eyes and teeth; a dog barks
    [T_CLUNK, t => { const blink = (t > 20.3 && t < 20.4) ? 1 : 0, look = t < 19.95 ? 0 : t < 20.5 ? -1 : 1;
      cam(1.0, 540, 1300, () => blackout(t, { dim: 1, win: 0, look, blink, title: false })); }],
    // PUNCH (s8b): the moon-lit street, a window opens across the street, he blinks, it bangs shut
    [T_PUNCH, t => { const dim = lerp(1, 0.28, eio(seg(t, 20.8, 21.35))), win = t < 22.35 ? eo(seg(t, 21.35, 21.6)) : 0, blink = ((t > 21.95 && t < 22.08)) ? 1 : 0, look = t < 21.4 ? -1 : 1;
      cam(kf(t, [[T_PUNCH, 1.0], [T_BUT, 1.1]], x => x), 540, 1300, () => blackout(t, { dim, win, look, blink, title: false }), ...shake(t, (t > 22.35 && t < 22.5) ? 9 : 0, 40)); }],
    // BUTTON · torchlight: he "neatly" stomps them into the box, the lid slams, the knot swells; push-in on frame 1
    [T_BUT, t => { const S = [23.05, 23.4, 23.75], pul = ts => seg(t, ts - 0.1, ts) * (1 - seg(t, ts + 0.05, ts + 0.2)), up = Math.max(...S.map(pul));
      cam(kf(t, [[T_BUT, 1.0], [23.95, 1.12]], x => x), 540, 1300, () => torchRoom(t, { foot: up, stomp: up })); }],
    [23.95, t => cam(1.0, 540, 1300, () => swell(t))],
    [24.6, t => cam(kf(t, [[24.6, 0.84], [DUR, 1.0]], eo), 540, 960, () => hook(t, { still: true }))],
  );
}

function render(t) {
  window.T_NOW = t;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1;
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
  ctx.restore();
  if (!window.NO_TITLE && (t < 2.45 || t >= 24.6)) title('POV: getting the Christmas lights out');
  panel(ctx, 6, 6, W - 12, H - 12, 5, null, boilFrame(t));
  const cap = window.NO_CAP ? null : captions(t); window.__texts = cap ? [cap] : [];
}
window.render = render; window.TEXTS = t => { render(t); return window.__texts; };
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  TL = await (await fetch('voice/film_timeline.json')).json();
  LN = Object.fromEntries(TL.lines.map(l => [l.id, l]));
  window.DUR = DUR = TL.total;
  build(); render(0); window.READY = true;
})();
