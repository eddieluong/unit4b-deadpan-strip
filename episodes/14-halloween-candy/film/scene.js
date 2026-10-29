// UNIT 4B · 14 "Halloween Candy" (Tập 5) — 9:16 film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// PREPRODUCTION.md: voice-led (Steve VO, no lip-sync) + in-scene lines at the climax (lip-sync); frame 1 = the absurd result
// with his face (#19); beat-based pauses (#16); silent beats (#17); one peak (4); the cat only meows (#18); the custom
// (trick-or-treating at 6 PM) is on screen before the joke needs it (#12). Owner notes: the bag empties over 4 held frames
// while he watches TV, then he finds it empty and freezes.
import { drawCharacter, paper, panel, CAST } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts } from './lib/cast_v2.js';
import { track, idle, sum, wordChunk, ease, onTwos, boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 150, PW = 1000, PH = 1420, FLOOR = 1400, K = 7, INK = '#2a2230';

const LINE_DEFS = [   // id, char, caption, gap after (beat: after a joke 0.7, list 0.35, turn 0.6, silent beat 0.8–1.0)
  ['14_s01', 'steve', 'I bought the Halloween candy a week early.', 0.4],
  ['14_s02', 'steve', 'Responsible. Organized. For the KIDS.', 0.7],
  ['14_s03', 'steve', 'Monday, I had one. Quality control.', 0.35],
  ['14_s04', 'steve', "Wednesday, a few. Small ones don't count.", 0.35],
  ['14_s05', 'steve', "Friday… I don't remember Friday.", 2.6],                 // + the empty bag and the stare (5b)
  ['14_s06', 'steve', 'Saturday. Halloween. Six p.m.', 1.8],                     // + ding-dong and the frozen face
  ['14_s08', 'steve', 'So I did what every adult does.', 0.6],
  ['14_s09', 'steve', 'Lights off. On the floor. Not home.', 2.6],              // + ding-dong ×2, knocks, held breath
  ['14_meow', 'cat', 'Meow.', 0.6],
  ['14_p12', 'ghost', "He's on the FLOOR.", 0.3],                                // in the scene (face hidden by the sheet)
  ['14_s13', 'steve', "NOBODY'S HOME!", 1.6],                                    // in the scene: the peak, then the ghost leaves
  ['14_s15', 'steve', 'Ten minutes later, the ghost left something on the mat.', 1.4],
  ['14_s16', 'steve', '…I ate it.', 1.2],
];
const IN_SCENE = new Set(['14_s13']);
const TITLE = ['POV: you bought the', 'Halloween candy early'];
let LINES = [], DUR = 0, T = {}, EV = [], SHOTS = [], STEVE = [], VOICE = {}, WORDS = {};
const L_ = id => LINES.find(l => l.id === id);
const end = id => L_(id).t + VOICE[id].dur;
const wt = (id, i) => L_(id).t + Math.max(0, (WORDS[id] || [])[i]?.[1] ?? 0);

// ---------- helpers ----------
const frameOf = boilFrame;
const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const pen = (x, y, s, t, seed = 1) => new VPen(ctx, x, y, s, { lw: Math.max(2.4, s * 0.85), hand: true, frame: frameOf(t), seed });
const spen = (t, seed) => { const p = pen(0, 0, 1, t, seed); p.T = q => q; return p; };
const rnd = s => { const x = Math.sin(s * 127.1) * 43758.5453; return x - Math.floor(x); };
function withCamera(zoom, fx, fy, fn, sx = 540, sy = 900) {
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.translate(sx, sy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore();
}
function hand(text, x, y, size, rot = 0, color = INK, font = 'Patrick Hand', weight = '') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore();
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
    if (e >= 0) return e > 0.5 ? 'scream' : 'wide';
  }
  return null;
}

function sfxText(text, x, y, size, rot = 0) {   // a sound word: white with a thick ink outline, readable on any set
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.22; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 0); ctx.fillStyle = '#ffd84a'; ctx.fillText(text, 0, 0); ctx.restore();
}

// ---------- props ----------
const CANDY = ['#e74c3c', '#f39c12', '#8e44ad', '#27ae60', '#3498db', '#f1c40f'];
function candy(x, y, s, t, seed, rot = 0) {   // a wrapped sweet: a body with two twisted ends
  const p = spen(t, seed), c = CANDY[Math.floor(rnd(seed) * CANDY.length)], co = Math.cos(rot), si = Math.sin(rot);
  const R = ([a, b]) => [x + a * co - b * si, y + a * si + b * co];
  p.part([[-s * 1.9, -s * 0.7], [-s, 0], [-s * 1.9, s * 0.7]].map(R), c, { shade: false, lw: 2 });
  p.part([[s * 1.9, -s * 0.7], [s, 0], [s * 1.9, s * 0.7]].map(R), c, { shade: false, lw: 2 });
  p.part(ellipsePts(0, 0, s, s * 0.75, 14).map(R), c, { shade: 0.15, lw: 2.5 });
}
function wrapper(x, y, s, t, seed) {   // an empty, flattened wrapper
  const p = spen(t, seed), c = CANDY[Math.floor(rnd(seed) * CANDY.length)], r = rnd(seed + 3) * 3;
  const co = Math.cos(r), si = Math.sin(r), R = ([a, b]) => [x + a * co - b * si, y + a * si + b * co];
  p.part([[-s * 1.6, -s * 0.5], [-s * 0.3, -s * 0.15], [s * 0.3, -s * 0.35], [s * 1.6, -s * 0.6], [s * 1.4, s * 0.4], [s * 0.2, s * 0.2], [-s * 0.4, s * 0.35], [-s * 1.5, s * 0.5]].map(R), c, { shade: false, lw: 2 });
}
function wrapperPile(cx, cy, n, spread, t, seed = 500) {
  for (let i = 0; i < n; i++) {
    const a = rnd(seed + i) * Math.PI, r = Math.sqrt(rnd(seed + i * 7 + 1)) * spread;
    wrapper(cx + Math.cos(a) * r * 1.6 - spread * 0.1, cy - Math.sin(a) * r * 0.45, 17, t, seed + i);
  }
}
// The big candy bag. fill 1 = full and round … 0 = flat and crumpled. (x, y) = bottom centre.
function bag(x, y, fill, t, s = 1) {
  const p = spen(t, 61), w = 170 * s * (0.85 + 0.15 * fill), h = (70 + 190 * fill) * s, bulge = 26 * s * fill, sag = 18 * s * (1 - fill);
  const body = roundPoly([[x - w / 2 + 6, y], [x + w / 2 - 6, y], [x + w / 2 + bulge, y - h * 0.45], [x + w / 2 - 10 * s + sag * 0.4, y - h], [x + 14 * s, y - h - 12 * s + sag],
    [x - 14 * s, y - h + 4 * s + sag], [x - w / 2 + 10 * s - sag * 0.3, y - h + sag * 0.6], [x - w / 2 - bulge, y - h * 0.45]], 14 * s);
  p.part(body, '#f07c1e', { shade: 0.16, lw: 3.5 });
  if (fill > 0.15) {   // label: a band with "100 PIECES"
    const ly = y - h * 0.5;
    ctx.save(); ctx.fillStyle = 'rgba(255,248,230,0.92)'; ctx.fillRect(x - w * 0.36, ly - 30 * s, w * 0.72, 60 * s); ctx.restore();
    hand('100', x, ly - 8 * s, 36 * s, 0, '#7a3a0a', 'Fredoka', '600'); hand('PIECES', x, ly + 18 * s, 20 * s, 0, '#7a3a0a', 'Fredoka', '600');
  } else {   // crumpled: fold lines
    p.line([[x - w * 0.3, y - h * 0.3], [x - w * 0.05, y - h * 0.55], [x + w * 0.2, y - h * 0.35]], 2.5, 'rgba(42,34,48,0.55)');
    p.line([[x + w * 0.05, y - h * 0.15], [x + w * 0.3, y - h * 0.6]], 2.5, 'rgba(42,34,48,0.55)');
  }
}
function bowl(x, y, fill, t, sc = 1) {   // a pumpkin bowl; fill 0..1 of sweets on top; (x, y) = bottom centre
  if (sc !== 1) { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y); bowl(x, y, fill, t); ctx.restore(); return; }
  const p = spen(t, 71);
  for (let i = 0; i < Math.round(9 * fill); i++) candy(x - 80 + (i % 5) * 40 + (Math.floor(i / 5) % 2) * 20, y - 78 - Math.floor(i / 5) * 22, 15, t, 700 + i, rnd(i) - 0.5);
  p.part(roundPoly([[x - 120, y - 80], [x + 120, y - 80], [x + 95, y], [x - 95, y]], 30), '#f07c1e', { shade: 0.15, lw: 4 });
  p.line([[x - 40, y - 78], [x - 34, y - 4]], 2.5, 'rgba(42,34,48,0.45)'); p.line([[x + 40, y - 78], [x + 34, y - 4]], 2.5, 'rgba(42,34,48,0.45)');
  p.part([[x - 46, y - 52], [x - 22, y - 52], [x - 34, y - 34]], INK, { shade: false, lw: 2 }); p.part([[x + 22, y - 52], [x + 46, y - 52], [x + 34, y - 34]], INK, { shade: false, lw: 2 });
  p.line([[x - 40, y - 24], [x - 20, y - 16], [x, y - 24], [x + 20, y - 16], [x + 40, y - 24]], 3);
}
function dayTag(day, left, t) {   // a sticky note in the corner: the day and how many sweets are left
  const p = spen(t, 90), x = PX + 40, y = PY + 40;
  p.part(roundPoly([[x, y], [x + 240, y + 6], [x + 236, y + 170], [x - 4, y + 164]], 6), '#fff3a6', { shade: 0.1, lw: 3 });
  hand(day, x + 118, y + 58, 64, -0.03, INK, 'Fredoka', '600');
  hand(`${left} left`, x + 118, y + 124, 42, -0.03, left === 0 ? '#c0392b' : INK, 'Patrick Hand');
}
// The trick-or-treater: a kid under a white sheet with two eye holes and sneakers. (x, y) = feet; look -1..1 tilts the head.
function ghost(x, y, s, t, { look = 0, down = 0 } = {}) {
  const p = spen(t, 81), hh = 190 * s, w = 70 * s, ex = look * 10 * s, ey = down * 14 * s;
  const hem = []; for (let i = 0; i <= 8; i++) hem.push([x + w - (2 * w * i) / 8, y - 26 * s + (i % 2 ? 10 : -4) * s]);
  const dome = []; for (let i = 0; i <= 20; i++) { const a = Math.PI * i / 20; dome.push([x - Math.cos(a) * w * 0.82, y - hh + 40 * s - Math.sin(a) * 52 * s]); }
  p.part([[x - w, y - 26 * s], ...dome.map(([a, b], i) => i === 0 ? [x - w * 0.86, b + 20 * s] : i === 20 ? [x + w * 0.86, b + 20 * s] : [a, b]), [x + w, y - 26 * s], ...hem], '#fbfbf7', { shade: 0.1, lw: 4 });
  for (const sx of [-1, 1]) p.dot(x + sx * 22 * s + ex, y - hh + 34 * s + ey, 9 * s, 13 * s, INK);
  for (const sx of [-1, 1]) p.part(roundPoly([[x + sx * 18 * s - 16 * s, y - 14 * s], [x + sx * 18 * s + 16 * s, y - 14 * s], [x + sx * 18 * s + 18 * s, y], [x + sx * 18 * s - 16 * s, y]], 6 * s), '#d94f6a', { shade: false, lw: 3 });
}

// ---------- sets ----------
const WIN = [600, 460, 940, 860];   // the window above the floor where he hides
function room(t, { dark = false, porch = true, win = true } = {}) {
  ctx.fillStyle = '#e6dcc8'; ctx.fillRect(PX - 800, PY - 800, PW + 1600, FLOOR - PY + 800);
  ctx.fillStyle = '#b89c74'; ctx.fillRect(PX - 800, FLOOR, PW + 1600, 900);
  const p = spen(t, 5); p.line([[PX - 800, FLOOR], [PX + PW + 800, FLOOR]], 4);
  const [a, b, c, d] = WIN;
  if (win) {
  p.part([[a, b], [c, b], [c, d], [a, d]], '#26325e', { shade: false, lw: 6 });
  if (porch) { ctx.save(); const g = ctx.createLinearGradient(0, b, 0, d); g.addColorStop(0, 'rgba(255,179,71,0)'); g.addColorStop(1, 'rgba(255,179,71,0.45)'); ctx.fillStyle = g; ctx.fillRect(a, b, c - a, d - b); ctx.restore(); }   // the porch light outside
  p.dot(a + 70, b + 70, 26, 26, '#f4efd2');
  p.line([[(a + c) / 2, b], [(a + c) / 2, d]], 5); p.line([[a, (b + d) / 2], [c, (b + d) / 2]], 5);
  p.part([[a - 20, d], [c + 20, d], [c + 20, d + 22], [a - 20, d + 22]], '#d8c8a8', { shade: false, lw: 4 });
  }
  p.part(roundPoly([[-330, 560], [-60, 560], [-60, FLOOR], [-330, FLOOR]], 6), '#9c6b45', { shade: 0.1, lw: 5 });   // the front door (left, off the main frame)
  p.part(roundPoly([[260, 900], [310, 900], [310, 980], [260, 980]], 6), '#f7f3ea', { shade: false, lw: 3 });       // light switch
  p.line([[285, 925], [285, 955]], 6);
}
function darkness(alpha = 0.6) {   // lights off: the room goes navy; the porch light through the window stays warm
  ctx.save(); ctx.fillStyle = `rgba(16,20,48,${alpha})`; ctx.fillRect(PX - 800, PY - 800, PW + 1600, H + 1600);
  const [a, b, c, d] = WIN; ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.16; ctx.fillStyle = '#ffb347';
  ctx.beginPath(); ctx.moveTo(a, d); ctx.lineTo(c, d); ctx.lineTo(c + 160, FLOOR + 120); ctx.lineTo(a - 260, FLOOR + 120); ctx.closePath(); ctx.fill(); ctx.restore();
}
function shop(t) {
  ctx.fillStyle = '#e8e1d2'; ctx.fillRect(PX - 800, PY - 800, PW + 1600, FLOOR - PY + 800);
  ctx.fillStyle = '#d6d2c4'; ctx.fillRect(PX - 800, FLOOR, PW + 1600, 900);
  const p = spen(t, 3); p.line([[PX - 800, FLOOR], [PX + PW + 800, FLOOR]], 4);
  for (let r = 0; r < 3; r++) {
    const y = 560 + r * 200; p.line([[PX - 800, y], [PX + PW + 800, y]], 5, '#9a8f7a');
    for (let i = 0; i < 16; i++) { const x = -300 + i * 95, hh = 80 + ((i * 37 + r * 13) % 40); p.part(roundPoly([[x, y - hh], [x + 70, y - hh], [x + 70, y], [x, y]], 4), ['#f07c1e', '#8e44ad', '#2a2230', '#f39c12', '#27ae60'][(i + r) % 5], { shade: 0.12, lw: 2.5 }); }
  }
  p.part(roundPoly([[300, 200], [780, 200], [780, 300], [300, 300]], 10), '#f07c1e', { shade: false }); hand('HALLOWEEN', 540, 251, 56, 0, '#ffffff', 'Fredoka', '600');
}
function kitchen(t) {   // the cupboard with the bowl and the note
  room(t, { porch: false });
  const p = spen(t, 7);
  p.part(roundPoly([[420, 1060], [1000, 1060], [1000, FLOOR], [420, FLOOR]], 6), '#c9a46a', { shade: 0.12, lw: 4 });
  p.part([[400, 1040], [1020, 1040], [1020, 1070], [400, 1070]], '#e9d8b4', { shade: false, lw: 4 });
  p.line([[710, 1080], [710, FLOOR - 10]], 3);
}
function note(x, y, t, text, rot = -0.05, w = 300) {
  const p = spen(t, 95);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.translate(-x, -y);
  p.part(roundPoly([[x - w / 2, y - 70], [x + w / 2, y - 66], [x + w / 2 - 4, y + 70], [x - w / 2 + 2, y + 66]], 6), '#fffdf6', { shade: 0.06, lw: 3 });
  ctx.restore(); return p;
}
function sofaTV(t, glow) {   // night, the sofa, the TV glow from the left
  room(t, { porch: false });
  const p = spen(t, 9);
  p.part(roundPoly([[280, 880], [1000, 880], [1000, 1250], [280, 1250]], 40), '#6b7fa8', { shade: 0.15, lw: 5 });   // back
  p.part(roundPoly([[250, 1150], [1030, 1150], [1030, FLOOR - 60], [250, FLOOR - 60]], 30), '#7b8fb8', { shade: 0.12, lw: 5 });   // seat
  p.part(roundPoly([[210, 1040], [330, 1040], [330, FLOOR - 40], [210, FLOOR - 40]], 30), '#5d7098', { shade: 0.1, lw: 5 });    // arms
  p.part(roundPoly([[950, 1040], [1070, 1040], [1070, FLOOR - 40], [950, FLOOR - 40]], 30), '#5d7098', { shade: 0.1, lw: 5 });
  darkness(0.55);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.22; ctx.fillStyle = glow;
  ctx.beginPath(); ctx.moveTo(PX - 100, 700); ctx.lineTo(PX - 100, 1500); ctx.lineTo(1100, FLOOR + 200); ctx.lineTo(1100, 600); ctx.closePath(); ctx.fill(); ctx.restore();
}

// ---------- characters ----------
function who(id, x, t, keys, extra = {}, scale = K, y = FLOOR) {
  const tq = onTwos(t), base = keys ? track(keys, tq) : {}, pose = sum({ expr: 'neutral', ...base }, idle(tq, x), extra);
  const m = mouthFor(id, tq); if (m) pose.mouth = m;
  drawCharacter(ctx, id, base.x ?? x, base.y ?? y, base.scale ?? scale, pose, { frame: frameOf(t) });
  return base;
}
function lying(t, x, y, extra = {}) {   // Steve flat on his back on the floor, head to the left
  ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2); ctx.translate(-x, -y);
  who('steve', x, t, STEVE, extra, K, y);
  ctx.restore();
}
// Hiding = sitting on the floor right under the window, back to the wall, hugging the empty bowl, a finger on his lips.
// (Self-review: lying flat read as "passed out", the face was sideways and small; sitting keeps the face upright and readable.)
const HIDE_X = 760;
function hiding(t, { bowlOn = true, extra = {}, cat = {}, catX = 520 } = {}) {   // the frame-1 composition
  wrapperPile(640, FLOOR + 60, 26, 300, t);
  who('snuggles', catX, t, null, { expr: 'deadpan', look: 0.6, ...cat }, 4.4, FLOOR + 10);
  who('steve', HIDE_X, t, STEVE, extra, K, FLOOR + 105);
  if (bowlOn) bowl(HIDE_X, FLOOR - 120, 0, t, 0.6);   // the empty bowl hugged in his lap
}

// ---------- the timeline, computed from the voice take ----------
function buildTimeline() {
  let t = 0.1;
  LINES = LINE_DEFS.map(([id, char, text, gap]) => { const L = { id, char, text, t }; t += VOICE[id].dur + gap; return L; });
  DUR = +t.toFixed(2);
  T = {
    shop: L_('14_s02').t, kids: wt('14_s02', 3), mon: L_('14_s03').t, wed: L_('14_s04').t, fri: L_('14_s05').t,
    empty: end('14_s05') + 0.3, down: end('14_s05') + 0.9, cam: end('14_s05') + 1.5,
    sat: L_('14_s06').t, ding1: end('14_s06') + 0.5, adult: L_('14_s08').t, dark: L_('14_s09').t + 0.05, drop: wt('14_s09', 2),
    ding2: end('14_s09') + 0.4, ding3: end('14_s09') + 0.9, knock: end('14_s09') + 1.5, meow: L_('14_meow').t,
    ghost: L_('14_p12').t, peak: L_('14_s13').t, slide: end('14_s13') + 0.3, mat: L_('14_s15').t, eat: L_('14_s16').t,
  };
  T.six = wt('14_s06', 2); T.face = end('14_s15') + 0.3;   // the note holds through the whole line, then his face
  // the bag empties over 4 held frames during line 5 (owner note): full → half → saggy → flat
  T.bagSteps = [0, 1, 2, 3].map(i => T.fri + i * Math.max(0.5, (end('14_s05') - T.fri) / 4));
  const chew = []; for (let k = T.fri; k < T.empty - 0.1; k += 0.5) chew.push({ t: k, dur: 0.18, armR: 'chin' }, { t: k + 0.25, dur: 0.18, armR: 'hold' });
  STEVE = [
    { t: 0, expr: 'nervous', sit: 1, armL: 'hold', armR: 'chin', look: -0.5, fx: ['sweat'] },
    { t: 1.3, dur: 0.15, expr: 'horrified', sit: 1, armL: 'hold', armR: 'chin', look: 0.5, tilt: -8, fx: ['sweat'] },   // eyes dart up to the window
    { t: 2.5, dur: 0.15, expr: 'nervous', sit: 1, armL: 'hold', armR: 'chin', look: -0.5, tilt: 0, fx: ['sweat'] },
    { t: T.shop, dur: 0.2, expr: 'proud', armR: 'point', armL: 'hips', look: 0.3 },
    { t: T.kids, dur: 0.2, expr: 'happy', armR: 'point', armL: 'down', look: 0.8 },
    { t: T.mon, dur: 0.2, expr: 'smug', armR: 'chin', armL: 'down', look: -0.6 },
    { t: T.wed, dur: 0.2, expr: 'awkward', arm: 'down', look: 0.4, fx: ['sweat'] },
    ...chew.map(k => ({ expr: 'dead_inside', sit: 1, armL: 'down', look: -0.9, ...k })),
    { t: T.empty, dur: 0.2, expr: 'neutral', sit: 1, armR: 'hold', armL: 'down', look: -0.9 },
    { t: T.down, dur: 0.25, expr: 'confused', sit: 1, armR: 'hold', armL: 'down', look: 0.3, tilt: 12 },
    { t: T.cam, dur: 0.2, expr: 'shocked', sit: 1, armR: 'hold', armL: 'down', look: 0, tilt: 0 },
    { t: T.sat, dur: 0.2, expr: 'nervous', arm: 'down', look: 0.5 },
    { t: T.ding1, dur: 0.1, expr: 'horrified', arm: 'down', look: 0.9 },
    { t: T.adult, dur: 0.2, expr: 'deadpan', armL: 'reach', armR: 'down', look: -0.8 },
    { t: T.dark, dur: 0.2, expr: 'nervous', arm: 'down', look: 0 },
    { t: T.drop, dur: 0.2, expr: 'nervous', sit: 1, armL: 'hold', armR: 'chin', look: -0.5 },
    { t: T.drop + 1.7, dur: 0.15, expr: 'nervous', sit: 1, armL: 'hold', armR: 'chin', look: 0.6, tilt: -6 },   // glances at the door
    { t: T.ding2, dur: 0.1, expr: 'nervous', sit: 1, armL: 'hold', armR: 'chin', look: 0, tilt: 0, fx: ['sweat'] },
    { t: T.meow + 0.3, dur: 0.15, expr: 'horrified', sit: 1, armL: 'hold', armR: 'chin', look: -0.9, fx: ['sweat'] },
    { t: T.ghost, dur: 0.15, expr: 'horrified', sit: 1, armL: 'hold', armR: 'down', look: 0.3 },
    { t: T.peak, dur: 0.1, expr: 'furious', sit: 1, armL: 'hold', armR: 'down', look: 0, fx: ['sweat', 'vein'] },
    { t: T.slide, dur: 0.2, expr: 'embarrassed', sit: 1, armL: 'hold', armR: 'down', look: 0.6 },
    { t: T.face, dur: 0.2, expr: 'sad', sit: 1, armL: 'hold', armR: 'down', look: 0 },
    { t: T.eat, dur: 0.2, expr: 'dead_inside', sit: 1, armL: 'hold', armR: 'chin', look: 0 },
  ].sort((a, b) => a.t - b.t);
  const push = (a, b, z0, z1) => t => z0 + (z1 - z0) * ease.inOut(seg(t, a, b));
  const glows = ['#7fb3ff', '#ff9f6b', '#9dff9a', '#c79bff'];
  const bagStep = t => { let i = 0; while (i + 1 < 4 && T.bagSteps[i + 1] <= t) i++; return i; };
  SHOTS = [
    [0, t => withCamera(1.35, 720, 900, () => {   // frame 1: flat on the dark floor, empty bowl, wrappers, a ghost at the window
      room(t, { dark: true }); darkness(0.55); ghostAtWindow(t, { look: Math.sin(onTwos(t) * 2.2), down: 1, peer: 50 * Math.sin(onTwos(t) * 2.2) }); hiding(t);
    })],
    [T.shop, t => withCamera(1.2, 470, 950, () => {   // the shop: a huge bag, so responsible
      shop(t); who('steve', 400, t, STEVE); bag(400 + 25 * K, FLOOR - 64 * K + 215, 1, t, 0.85);   // hanging from his outstretched hand
    })],
    [T.kids, t => withCamera(1.15, 640, 1000, () => {   // home: the bowl full, a note on the cupboard
      kitchen(t); bowl(820, 1040, 1, t); note(560, 1220, t, ''); hand('FOR THE', 560, 1192, 46, -0.05, '#c0392b', 'Patrick Hand'); hand('KIDS!', 560, 1250, 62, -0.05, '#c0392b', 'Patrick Hand');
      who('steve', 300, t, STEVE);
    })],
    [T.mon, t => withCamera(1.15, 640, 1000, () => {   // MON: one. Quality control.
      kitchen(t); bowl(820, 1040, 0.9, t); who('steve', 560, t, STEVE); candy(560 + 2 * K, FLOOR - 82 * K, 14, t, 701); dayTag('MON', 99, t);
    })],
    [T.wed, t => withCamera(1.15, 640, 1000, () => {   // WED: half gone, wrappers falling out of his pocket
      kitchen(t); bowl(820, 1040, 0.45, t); who('steve', 560, t, STEVE);
      const k = seg(t, T.wed + 0.4, T.wed + 1.4); wrapper(560 + 4 * K, FLOOR - 38 * K + 260 * ease.out(k), 16, t, 520);
      wrapperPile(560, FLOOR + 40, 5, 90, t, 540); dayTag('WED', 41, t);
    })],
    [T.fri, t => {   // FRI: TV night, the bag on his lap empties in 4 held frames, then he finds it empty
      const i = t < T.empty ? bagStep(t) : 3, fills = [1, 0.62, 0.3, 0.04], piles = [3, 12, 22, 34];
      const z = t < T.cam ? 1.1 : push(T.cam, T.cam + 0.6, 1.1, 1.5)(t);
      withCamera(z, 640, 1000, () => {
        sofaTV(t, glows[i]);
        wrapperPile(640, FLOOR + 60, piles[i], 260, t, 600);
        who('steve', 640, t, STEVE, {}, K, FLOOR - 60);
        bag(640, FLOOR - 175, fills[i], t, 0.7);   // on his lap
        who('snuggles', 990, t, null, { expr: 'deadpan', look: -0.8 }, 3.6, 1050);
      });
      dayTag('FRI', [62, 35, 11, 0][i], t);
    }],
    [T.sat, t => withCamera(t < T.six ? 1.45 : 1, t < T.six ? 300 : 540, t < T.six ? 560 : 900, () => {   // SAT 6 PM: the calendar, the clock, the rule, the empty bowl
      room(t, { win: false });
      const p = spen(t, 30);
      p.part(roundPoly([[120, 300], [480, 300], [480, 700], [120, 700]], 8), '#fffdf6', { shade: 0.06, lw: 4 });
      p.part([[120, 300], [480, 300], [480, 400], [120, 400]], '#c0392b', { shade: false, lw: 4 });
      hand('OCTOBER', 300, 352, 48, 0, '#ffffff', 'Fredoka', '600'); hand('31', 300, 530, 170, 0, INK, 'Fredoka', '600'); hand('SATURDAY', 300, 650, 40, 0, INK, 'Fredoka', '600');
      const kf = ease.inOut(seg(t, T.sat + 0.15, T.sat + 0.75));   // yesterday's page falls away
      if (kf < 1) { ctx.save(); ctx.translate(300 - 60 * kf, 400 + 700 * kf * kf); ctx.rotate(-0.5 * kf); ctx.translate(-300, -400);
        p.part(roundPoly([[120, 400], [480, 400], [480, 700], [120, 700]], 8), '#fffdf6', { shade: 0.06, lw: 4 }); hand('30', 300, 530, 170, 0, INK, 'Fredoka', '600'); hand('FRIDAY', 300, 650, 40, 0, INK, 'Fredoka', '600'); ctx.restore(); }
      p.part(ellipsePts(780, 600, 150, 150, 48), '#fffdf6', { shade: 0.06, lw: 5 });
      const k = Math.min(1, Math.floor(seg(t, T.six, T.six + 0.9) * 3 + 1e-6) / 3), mn = (-0.05 + 0.05 * k) * Math.PI * 2;   // three ticks up to 12
      p.line([[780, 600], [780, 690]], 9);                                                       // hour hand on 6
      p.line([[780, 600], [780 + Math.sin(mn) * 120, 600 - Math.cos(mn) * 120]], 6);
      p.dot(780, 600, 10, 10, INK);
      hand('6:00 PM', 780, 800, 50, 0, INK, 'Fredoka', '600');
      const kb = ease.out(seg(t, T.six + 1.0, T.six + 1.4));
      if (kb > 0) {   // the rule pops in only after the clock hits six
        p.part(roundPoly([[90, 900 - 40 * (1 - kb)], [990, 900 - 40 * (1 - kb)], [990, 1040], [90, 1040]], 18), '#ffd84a', { shade: false, lw: 4 });
        hand('6 PM: kids start ringing', 540, 948, 50, 0, INK, 'Fredoka', '600'); hand('doorbells for candy', 540, 1004, 50, 0, INK, 'Fredoka', '600');
      }
      bowl(540, 1330, 0, t);
    })],
    [T.ding1, t => withCamera(push(T.ding1, T.adult, 2.0, 2.2)(t), 600, 800, () => {   // ding-dong: his face freezes, eyes to the empty bowl
      room(t); who('steve', 600, t, STEVE); bowl(860, FLOOR, 0, t);
      if (t < T.ding1 + 0.9) { sfxText('DING', 470, 560, 64, -0.15); sfxText('DONG!', 720, 600, 64, 0.1); }
    })],
    [T.adult, t => withCamera(1.6, 380, 950, () => { room(t); who('steve', 470, t, STEVE); })],   // his hand on the switch
    [T.dark, t => withCamera(1.08, 580, 1000, () => {   // click: dark; he drops to the floor; the cat lies down next to him
      room(t, { dark: true });
      if (t < T.drop) { darkness(0.55); who('steve', HIDE_X, t, STEVE); }
      else { darkness(0.55); hiding(t, { catX: 1200 - 680 * ease.inOut(seg(t, T.drop + 0.3, T.drop + 1.5)) }); }
    })],
    [T.ding2, t => withCamera(push(T.ding2, T.meow, 1.6, 1.8)(t), 680, 1150, () => {   // ding-dong ×2, knocks; he holds his breath
      room(t, { dark: true }); darkness(0.55); hiding(t);
      if (t > T.ding2 && t < T.ding2 + 0.5) sfxText('DING DONG', 640, 900, 56, -0.1);
      if (t > T.ding3 && t < T.ding3 + 0.5) sfxText('DING DONG', 720, 960, 56, 0.08);
      if (t > T.knock && t < T.knock + 0.8) sfxText('KNOCK KNOCK', 680, 930, 50, -0.05);
    })],
    [T.meow, t => withCamera(2.0, 640, 1180, () => {   // the cat, right by his ear: MEOW
      room(t, { dark: true }); darkness(0.55);
      const open = t >= T.meow && t < T.meow + 0.7;
      hiding(t, { cat: open ? { expr: 'neutral', mouth: 'O', look: 0.6 } : { expr: 'deadpan', look: 0.6 } });
      if (open) sfxText('MEOW!', 520, 1040, 64, -0.1);
    })],
    [T.ghost, t => withCamera(1.5, 770, 760, () => {   // the ghost at the window looks straight down at him
      room(t, { dark: true }); darkness(0.5); ghostAtWindow(t, { look: 0, down: 1 });
    })],
    [T.peak, t => withCamera(push(T.peak, T.slide, 1.35, 1.45)(t), 720, 900, () => {   // NOBODY'S HOME! — still flat on the floor
      room(t, { dark: true }); darkness(0.5); ghostAtWindow(t, { look: 0, down: 1, slide: seg(t, T.slide, T.slide + 0.8) }); hiding(t);
    }, 540 + (t < T.peak + 0.3 ? (Math.floor(t * 24) % 2 ? 10 : -10) : 0))],
    [T.mat, t => withCamera(push(T.mat, T.face, 1.0, 1.3)(t), 540, push(T.mat, T.face, 900, 1150)(t), () => {   // the doorstep: one sweet and a crayon note
      ctx.fillStyle = '#3a3550'; ctx.fillRect(PX - 800, PY - 800, PW + 1600, FLOOR - PY + 800);
      ctx.fillStyle = '#7b6a5a'; ctx.fillRect(PX - 800, 1000, PW + 1600, 1200);
      const p = spen(t, 40);
      p.part(roundPoly([[260, 240], [820, 240], [820, 1000], [260, 1000]], 6), '#9c6b45', { shade: 0.1, lw: 5 });
      ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#ffd890'; ctx.beginPath(); ctx.ellipse(540, 1250, 520, 260, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      p.part(roundPoly([[220, 1080], [860, 1080], [900, 1440], [180, 1440]], 16), '#8b5a3c', { shade: 0.1, lw: 4 });
      note(540, 1200, t, '', -0.06, 440);
      hand('FOR THE', 540, 1168, 64, -0.06, '#e67e22', 'Patrick Hand'); hand('SAD MAN', 540, 1240, 80, -0.06, '#e67e22', 'Patrick Hand');
      candy(560, 1360, 34, t, 777, 0.2);
    })],
    [T.face, t => withCamera(2.3, HIDE_X, 900, () => { room(t, { dark: true }); darkness(0.55); hiding(t); })],   // his face: the sad man
    [T.eat, t => withCamera(1.35, 720, 900, () => {   // back to frame 1: chewing on the floor in the dark
      room(t, { dark: true }); darkness(0.55);
      const chewing = Math.floor(t * 4) % 2 ? 'small' : 'line';
      hiding(t, { extra: { mouth: chewing } });
    })],
  ];
  EV = [
    ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
    { t: 0.0, type: 'night' }, { t: T.shop, type: 'murmur' }, { t: T.kids, type: 'slap' }, { t: T.mon, type: 'crinkle' }, { t: T.wed + 0.5, type: 'crinkle' },
    ...T.bagSteps.map(x => ({ t: x, type: 'crinkle' })), { t: T.empty, type: 'rustle' }, { t: T.cam, type: 'sting' },
    { t: T.sat + 0.15, type: 'crinkle' }, { t: T.six, type: 'tick' }, { t: T.ding1, type: 'ding' }, { t: T.dark, type: 'click' }, { t: T.drop, type: 'thud' },
    { t: T.ding2, type: 'ding' }, { t: T.ding3, type: 'ding' }, { t: T.knock, type: 'knock' }, { t: T.peak, type: 'stop' },
    { t: T.mat, type: 'sting' }, { t: T.eat, type: 'chew' },
  ].sort((a, b) => a.t - b.t);
}
function ghostAtWindow(t, { look = 0, down = 0, slide = 0, peer = 0 } = {}) {   // the ghost pressed to the glass, clipped by the window
  const [a, b, c, d] = WIN;
  ctx.save(); ctx.beginPath(); ctx.rect(a, b, c - a, d - b); ctx.clip();
  const gx = 770 + peer + 420 * ease.inOut(slide), gy = d + 120;
  ghost(gx, gy, 1.9, t, { look, down });
  const hp = spen(t, 83); for (const sx of [-1, 1]) hp.part(ellipsePts(gx + sx * 120, gy - 250, 26, 20, 16), '#fbfbf7', { shade: 0.08, lw: 3 });   // hands on the glass
  ctx.restore();
  const p = spen(t, 5); p.line([[(a + c) / 2, b], [(a + c) / 2, d]], 5); p.line([[a, (b + d) / 2], [c, (b + d) / 2]], 5);
}

// ---------- kinetic captions ----------
function captions(t) {
  const c = wordChunk(LINES, WORDS, t); if (!c) return null;
  ctx.save(); ctx.translate(540, 1480);
  ctx.font = '600 80px Fredoka'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const parts = c.words.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), gap = 22;
  let x = -(parts.reduce((a, p) => a + p.wd, 0) + gap * (parts.length - 1)) / 2;
  const col = { ghost: '#e8f0ff', cat: '#d9e6ff' }[c.char] || '#ffffff';
  for (const p of parts) { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(p.w, x, 0); ctx.fillStyle = p.stress ? '#ffd84a' : col; ctx.fillText(p.w, x, 0); x += p.wd + gap; }
  ctx.restore();
  return { id: c.id, text: c.words.map(w => w.w).join(' '), x0: 80, y0: 1420, x1: 1000, y1: 1540 };
}

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = '600 50px Fredoka';
  ctx.fillText(TITLE[0], 540, 72); ctx.fillText(TITLE[1], 540, 132); ctx.textAlign = 'start';
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
  panel(ctx, PX, PY, PW, PH, 5, null, frameOf(t));
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
