// UNIT 4B · 11 "The Extra Hour" (Tập 2) v2 — 9:16 film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// v2 after the user's notes: Steve lies on his back facing us (bed seen from its foot), the cat sits upright on his face;
// the middle is three specific attempts to sleep (cold side of the pillow, "just ONE video", counting sheep);
// the cat is planted asleep at the foot of the bed from frame 1 and wakes before he does (suspense).
// Motion rules (research/viral/2026-10-26-motion): every motion has a reason; characters on twos, boil at 8 fps,
// eased pose changes, one nod on the stressed word, one camera move per shot; kinetic word captions. v1: scene_v1.js.
import { drawCharacter, paper, panel } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts } from './lib/cast_v2.js';
import { track, idle, speech, sum, wordChunk, ease, onTwos, boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 150, PW = 1000, PH = 1420, FLOOR = 1400, K = 7, INK = '#2a2230';
const WALL = '#e6dcc8', FLOORC = '#cdb894', WALLB = 1150;
const WIN = { x0: 640, x1: 940, y0: 430, y1: 760 };
const LIE_Y = 1560, SIT_Y = 1410;                       // Steve's (hidden) feet line lying / sitting up
const CATBED = { x: 720, y: 1330 };                     // the cat asleep at the foot of the bed
const FACE = { x: 540, y: 1065 };                       // where the cat sits on his face

const LINES = [
  ['11_01_snuggles', 'snuggles', 1.7, 'Saturday night. One free hour. The human is very excited.'],
  ['11_02_steve', 'steve', 7.0, 'Free hour. FREE hour.'],
  ['11_03_snuggles', 'snuggles', 11.7, 'His body did not get the memo.'],
  ['11_04_steve', 'steve', 14.5, "Okay. Cold side. Let's go."],
  ['11_05_steve', 'steve', 17.9, 'Just ONE video.'],
  ['11_06_steve', 'steve', 24.0, 'Here it comes.'],
  ['11_07_snuggles', 'snuggles', 27.6, 'Breakfast is at six.'],
  ['11_08_snuggles', 'snuggles', 29.6, 'MY six.'],
  ['11_09_steve', 'steve', 32.3, 'Happy daylight saving.'],
].map(([id, char, t, text]) => ({ id, char, t, text }));
const DUR = 35.0;
const TITLE = ['POV: you get an', 'extra hour of sleep'];
const T = {
  cold: 1.6, flip: 3.1, flipEnd: 4.0, steve: 6.9, reach: 9.6, off: 10.1, snap: 10.8, memo: 11.5,
  sitUp: 14.0, pFlip: 14.4, down: 16.4, c520: 17.1, phone: 17.7, lapse: 20.0, c541: 20.8, sheep: 21.4,
  c558: 23.6, catEye: 25.3, hop: 26.1, land: 26.9, my: 29.5, kitchen: 31.2,
};
let VOICE = {}, WORDS = {};

const EV = [
  ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
  { t: 0.0, type: 'tick' }, { t: 0.3, type: 'purr' }, { t: T.cold, type: 'lullaby' }, { t: T.flip, type: 'choir' },
  { t: T.off, type: 'click' }, { t: T.snap, type: 'sting' }, { t: T.snap + 0.6, type: 'tick2' },
  { t: T.pFlip, type: 'whoosh' }, { t: T.pFlip + 0.35, type: 'pillow' }, { t: T.down, type: 'pillow' },
  { t: T.phone, type: 'buzz' }, { t: T.lapse, type: 'lapse' }, { t: T.sheep, type: 'pop' },
  { t: T.c558, type: 'hum' }, { t: T.catEye, type: 'ding' }, { t: T.hop, type: 'hops' }, { t: T.land - 0.05, type: 'stop' },
  { t: T.land, type: 'thump' }, { t: T.kitchen + 0.2, type: 'kibble' }, { t: T.kitchen + 0.9, type: 'plink' }, { t: T.kitchen + 0.2, type: 'outro' },
];

// ---------- helpers ----------
const frameOf = boilFrame;
const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const pen = (x, y, s, t, seed = 1) => new VPen(ctx, x, y, s, { lw: Math.max(2.4, s * 0.85), hand: true, frame: frameOf(t), seed });
const spen = (t, seed) => { const p = pen(0, 0, 1, t, seed); p.T = q => q; return p; };
function withCamera(zoom, fx, fy, fn, sx = 540, sy = 900) {
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.translate(sx, sy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore();
}
function hand(text, x, y, size, rot = 0, color = INK, font = 'Patrick Hand', weight = '') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore();
}
function timeTag(text, t) {
  const p = spen(t, 91);
  p.part(roundPoly([[80, 196], [380, 192], [384, 300], [84, 304]], 8), '#f7e27a', { shade: false, lw: 3.5 });
  hand(text, 232, 250, 76, -0.03, INK, 'Fredoka', '600');
}
function night(alpha = 1, glow = null) {
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = alpha; ctx.fillStyle = '#6f7fb4'; ctx.fillRect(-2000, -2000, 6000, 6000);
  ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 1;
  if (glow) { const g = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.r); g.addColorStop(0, glow.c); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 6000, 6000); }
  ctx.restore();
}
const warm = () => night(0.32, { x: 918, y: 980, r: 560, c: 'rgba(255,214,140,0.45)' });
function speakingEnv(id, t) {
  const v = VOICE[id], L = LINES.find(l => l.id === id); if (!v || !L) return -1;
  const ts = Math.floor(t * 8) / 8 - L.t; if (ts < 0 || ts > v.dur) return -1;
  return v.env[Math.min(v.env.length - 1, Math.floor(ts * 24))] || 0;
}
function talking(char, t) {   // mouth + stressed-word nod for whoever is speaking now
  for (const L of LINES) {
    if (L.char !== char) continue;
    const e = speakingEnv(L.id, t);
    if (e >= 0) return { mouth: char === 'snuggles' ? null : (e > 0.55 ? 'wide' : e > 0.18 ? 'small' : 'line'), nod: speech(WORDS[L.id], L.t, t, L.text) };
  }
  return null;
}

// ---------- set: bedroom, seen from the foot of the bed ----------
function bedroom(t) {
  ctx.fillStyle = WALL; ctx.fillRect(PX - 600, PY - 600, PW + 1200, WALLB - PY + 600);
  ctx.fillStyle = FLOORC; ctx.fillRect(PX - 600, WALLB, PW + 1200, 1200);
  const p = spen(t, 3);
  p.line([[PX - 600, WALLB], [PX + PW + 600, WALLB]], 4);
  p.part([[WIN.x0, WIN.y0], [WIN.x1, WIN.y0], [WIN.x1, WIN.y1], [WIN.x0, WIN.y1]], '#2d3c6b', { shade: false, lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); ctx.clip();
  p.part(ellipsePts(WIN.x1 - 70, WIN.y0 + 70, 40, 40, 30), '#f6efc8', { shade: false, lw: 3 });
  for (const [sx, sy] of [[WIN.x0 + 40, WIN.y0 + 60], [WIN.x0 + 120, WIN.y0 + 190], [WIN.x1 - 60, WIN.y1 - 70], [WIN.x0 + 50, WIN.y1 - 40]]) p.dot(sx, sy, 3, 3, '#f6efc8');
  ctx.restore();
  p.line([[(WIN.x0 + WIN.x1) / 2, WIN.y0], [(WIN.x0 + WIN.x1) / 2, WIN.y1]], 5);
  p.line([[WIN.x0, (WIN.y0 + WIN.y1) / 2], [WIN.x1, (WIN.y0 + WIN.y1) / 2]], 5);
  p.part([[WIN.x0 - 30, WIN.y1], [WIN.x1 + 30, WIN.y1], [WIN.x1 + 30, WIN.y1 + 26], [WIN.x0 - 30, WIN.y1 + 26]], '#efe7d6', { shade: false, lw: 4 });
  const b = spen(t, 21);
  b.part(roundPoly([[330, 800], [750, 800], [750, 1110], [330, 1110]], 40), '#9a6b4a', { shade: 0.15 });
  b.part([[300, 1060], [780, 1060], [840, 1330], [240, 1330]], '#f4f1ea', { shade: 0.08 });
  b.part(roundPoly([[240, 1330], [840, 1330], [840, 1420], [240, 1420]], 8), '#9a6b4a', { shade: 0.15 });
  for (const lx of [262, 818]) b.line([[lx, 1420], [lx, 1470]], 10, '#7a5238');
  const n = spen(t, 25);
  n.part(roundPoly([[70, 1090], [255, 1090], [255, 1400], [70, 1400]], 6), '#b98a5e', { shade: 0.15 }); n.line([[85, 1200], [240, 1200]], 3); n.dot(162, 1150, 6, 6, '#e8c35a');
  n.part(roundPoly([[825, 1090], [1010, 1090], [1010, 1400], [825, 1400]], 6), '#b98a5e', { shade: 0.15 }); n.line([[840, 1200], [995, 1200]], 3);
}
function pillow(t, { sitting = false, y = null, rot = 0, cold = false } = {}) {
  const p = spen(t, 31);
  if (y === null) y = sitting ? 985 : 1045;
  ctx.save(); ctx.translate(540, y); ctx.rotate(rot); ctx.translate(-540, -y);
  if (sitting) p.part(roundPoly([[405, y - 85], [675, y - 85], [685, y + 90], [395, y + 90]], 34), cold ? '#e6f4ff' : '#ffffff', { shade: 0.12 });
  else p.part(ellipsePts(540, y, 165, 55, 36), cold ? '#e6f4ff' : '#ffffff', { shade: 0.12 });
  ctx.restore();
}
function blanket(t, top = 1092) {
  const p = spen(t, 33), pts = [];
  for (let x = 318; x <= 762; x += 37) pts.push([x, top + Math.sin(x * 0.03) * 6]);
  const w = (top - 1060) * 0.22;
  p.part([[318 - w, top], ...pts, [762 + w, top], [846, 1338], [234, 1338]], '#7fa7c9', { shade: 0.15 });
  p.part(roundPoly([[234, 1338], [846, 1338], [846, 1425], [234, 1425]], 10), '#6d95b8', { shade: false });
  for (const fx of [470, 610]) p.part(ellipsePts(fx, 1300, 48, 26, 20), '#86aed0', { shade: 0.1, lw: 3 });
  for (const fx of [400, 540, 680]) p.line([[fx, top + 40], [fx + (fx - 540) * 0.3, 1320]], 2.5, 'rgba(42,34,48,0.25)');
}
function bedClock(t, text) {
  const p = spen(t, 27);
  p.part(roundPoly([[88, 1000], [238, 1000], [238, 1090], [88, 1090]], 10), '#2f2b36', { shade: false });
  hand(text, 163, 1046, 54, 0, '#ff5a4a', 'Fredoka', '600');
}
function lamp(t, on) {
  const p = spen(t, 29);
  p.line([[918, 1090], [918, 1010]], 6, '#6b625c');
  p.part([[870, 1010], [966, 1010], [948, 930], [888, 930]], on ? '#f7e09a' : '#c9bfa8', { shade: false, lw: 3.5 });
}

// ---------- acting tracks (t in seconds, poses eased between keys) ----------
const STEVE = [
  { t: 0, expr: 'shocked', eyes: 'wide', mouth: 'line', fx: [], sit: 0, arm: 'hold' },                // cold open: 5:02, wide awake
  { t: T.cold, expr: 'neutral', look: -0.8, sit: 1, arm: 'hold', tilt: 0 },                          // Saturday night, sitting up
  { t: T.flip + 0.3, expr: 'happy', look: -0.5, sit: 1, tilt: -5 },                                 // the clock goes back
  { t: T.steve, dur: 0.3, expr: 'grin', arm: 'wide', sit: 1, tilt: 4, look: 0 },                     // "Free hour."
  { t: 8.2, dur: 0.25, expr: 'happy', arm: 'wide', sit: 1, tilt: -6 },                               // "FREE hour."
  { t: T.reach, dur: 0.3, expr: 'smug', armL: 'hold', armR: 'reach', sit: 1, tilt: 6, look: 0.9 },  // reaches for the lamp
  { t: T.off + 0.2, dur: 0.3, expr: 'sleepy', arm: 'hold', sit: 0, tilt: 0, look: 0 },               // lies down, dark
  { t: T.snap, dur: 0.08, expr: 'shocked', eyes: 'wide', mouth: 'line', fx: [], sit: 0 },           // eyes snap open
  { t: T.sitUp, dur: 0.25, expr: 'angry', sit: 1, arm: 'hold', tilt: 0, fx: [] },                   // attempt 1: sits up, flips the pillow
  { t: T.pFlip + 0.5, dur: 0.2, expr: 'angry', sit: 1, tilt: -5 },
  { t: T.down, dur: 0.25, expr: 'angry', eyes: 'closed', sit: 0, tilt: 0, fx: ['sweat'] },           // slams back down, eyes squeezed
  { t: T.phone, dur: 0.2, expr: 'nervous', mouth: 'line', sit: 0, look: 0.6, fx: [] },              // attempt 2: the phone
  { t: T.c541 - 0.1, dur: 0.15, expr: 'dead_inside', sit: 0, look: 0.6 },                            // 21 minutes later
  { t: T.sheep, expr: 'dead_inside', sit: 0, look: 0 },                                             // attempt 3: sheep
  { t: T.c558, dur: 0.6, expr: 'sleepy', eyes: 'dot', lid: 0.55, mouth: 'smile', sit: 0, fx: [] },   // drifting off
  { t: T.catEye, dur: 1.2, expr: 'sleepy', eyes: 'dot', lid: 0.92, mouth: 'smile', sit: 0 },
  { t: T.land, dur: 0.06, expr: 'shocked', eyes: 'wide', sit: 0 },                                  // (hidden under the cat)
];
const CAT = [
  { t: 0, expr: 'sleepy', x: CATBED.x, y: CATBED.y, scale: 3.4, tilt: 0 },                           // asleep at the foot of the bed
  { t: T.catEye, dur: 0.08, expr: 'shocked', eyes: 'wide', x: CATBED.x, y: CATBED.y, scale: 3.4 },  // 5:59:59 — awake
  { t: T.catEye + 0.5, dur: 0.2, expr: 'deadpan', x: CATBED.x, y: CATBED.y, scale: 3.4, tilt: -8 },
  { t: T.hop, dur: 0.27, expr: 'deadpan', x: 660, y: 1250, scale: 3.9, tilt: 0 },                    // three hops up the blanket
  { t: T.hop + 0.27, dur: 0.27, expr: 'deadpan', x: 600, y: 1170, scale: 4.5 },
  { t: T.hop + 0.54, dur: 0.26, expr: 'deadpan', x: FACE.x, y: FACE.y, scale: 5.2 },
  { t: T.land + 0.5, dur: 0.3, expr: 'smug', x: FACE.x, y: FACE.y, scale: 5.2 },
  { t: T.my - 0.1, dur: 0.2, expr: 'deadpan', x: FACE.x, y: FACE.y, scale: 5.2, tilt: 6 },
];

function steveInBed(t, extra = {}) {
  const tq = onTwos(t), base = track(STEVE, tq), talk = talking('steve', tq);
  const pose = sum(base, idle(tq, 1), talk ? talk.nod : {}, extra);
  if (talk && talk.mouth) pose.mouth = talk.mouth;
  if ((tq + 0.7) % 4.2 < 0.17 && (!pose.eyes || pose.eyes === 'dot') && !['happy', 'sleepy'].includes(pose.expr) && pose.lid === undefined) pose.eyes = 'closed';
  const s = Math.max(0, Math.min(1, base.sit ?? 0)), y = LIE_Y + (SIT_Y - LIE_Y) * s, top = 1092 + 48 * s;
  delete pose.sit;
  const flying = t >= T.pFlip && t < T.pFlip + 0.35;
  if (flying) flyingPillow(t); else pillow(t, { sitting: s > 0.5, cold: t > T.pFlip + 0.35 && t < T.c520 });
  ctx.save(); ctx.beginPath(); ctx.rect(-2000, -2000, 6000, top + 2000); ctx.clip();
  drawCharacter(ctx, 'steve', 540, y, K, pose, { frame: frameOf(t) });
  ctx.restore();
  return { top, pose };
}
function cat(t) {
  const tq = onTwos(t), base = track(CAT, tq), pose = sum(base, idle(tq, 4));
  const x = base.x, y = base.y, sc = base.scale;
  delete pose.x; delete pose.y; delete pose.scale;
  drawCharacter(ctx, 'snuggles', x, y, sc, pose, { frame: frameOf(t) });
}

// ---------- shots ----------
function bedScene(t, { clock, lampOn = false, phone = false, pillowFlip = false } = {}) {
  bedroom(t); lamp(t, lampOn);
  const { top } = steveInBed(t);
  if (phone) phoneInHand(t);
  blanket(t, top);
  bedClock(t, clock);
  cat(t);
}
function flyingPillow(t) {   // the pillow goes up, flips over, lands: cold side
  const k = seg(onTwos(t), T.pFlip, T.pFlip + 0.35);
  if (k <= 0 || k >= 1) return;
  const y = 985 - Math.sin(Math.PI * k) * 430;
  pillow(t, { sitting: true, y, rot: Math.PI * k, cold: k > 0.5 });
}
function phoneInHand(t) {   // a glowing phone held up beside his face
  const p = spen(t, 71), x = 680, y = 1040;
  p.part(roundPoly([[x - 45, y - 80], [x + 45, y - 80], [x + 45, y + 80], [x - 45, y + 80]], 12), '#2f2b36', { shade: false });
  const lapse = t >= T.lapse && t < T.c541;
  p.part(roundPoly([[x - 36, y - 68], [x + 36, y - 68], [x + 36, y + 68], [x - 36, y + 68]], 8), lapse ? ['#f5a3c7', '#9ad7f5', '#f7e27a', '#b9f0a8'][Math.floor(t * 12) % 4] : '#cfe4ff', { shade: false, lw: 2 });
  if (!lapse) for (const dy of [-30, 0, 30]) p.line([[x - 22, y + dy], [x + 22, y + dy]], 3, 'rgba(42,34,48,0.35)');
  p.line([[x - 10, y + 150], [x - 4, y + 70]], 8); p.dot(x - 4, y + 66, 13, 13, INK);   // his hand, from under the blanket
}
function shotSaturday(t) {
  bedroom(t); lamp(t, true);
  const { top } = steveInBed(t); blanket(t, top);
  const flipping = t >= T.flip && t < T.flipEnd;
  bedClock(t, t < T.flip ? '1:59' : '1:00');
  cat(t);
  warm();
  if (flipping) {   // a beam of light on the clock: a gift from above
    const a = Math.sin(Math.PI * seg(t, T.flip, T.flipEnd));
    ctx.save(); ctx.globalAlpha = 0.45 * a; ctx.fillStyle = '#fff4c0';
    ctx.beginPath(); ctx.moveTo(130, 300); ctx.lineTo(200, 300); ctx.lineTo(260, 1100); ctx.lineTo(66, 1100); ctx.closePath(); ctx.fill(); ctx.restore();
    hand('+1 hour', 163, 940, 56, -0.05, '#2e8b57', 'Fredoka', '600');
  }
}
function shotDark(t) { bedScene(t, { clock: t < T.snap ? '1:00' : '5:02' }); night(1); if (t > T.off + 0.25 && t < T.snap) hand('z z z', 680, 900, 64, -0.1, '#d8dcf0'); }
function shotClock(t, text) {   // insert: the bedside clock, big
  bedroom(t); bedClock(t, text); night(0.85, { x: 163, y: 1046, r: 220, c: 'rgba(255,90,74,0.35)' });
}
function shotMemo(t) { bedScene(t, { clock: '5:02' }); night(0.9); }
function shotPillow(t) { bedScene(t, { clock: '5:05', pillowFlip: true }); night(0.85); if (t > T.pFlip + 0.35 && t < T.down + 0.6) hand('*', 700, 900, 80, 0, '#bfe3ff', 'Fredoka', '600'); }
function shotPhone(t) { bedScene(t, { clock: t < T.c541 ? '5:20' : '5:41', phone: true }); night(0.85, { x: 640, y: 1030, r: 300, c: 'rgba(170,200,255,0.5)' }); }
function sheepBubble(t, x, y) {   // the third sheep stops, looks at us, and walks off
  const p = spen(t, 61);
  for (const [dx, dy, r] of [[120, 230, 16], [150, 280, 10]]) p.part(ellipsePts(x + dx, y + dy, r, r, 18), '#fffdf6', { shade: false, lw: 3 });
  p.part(ellipsePts(x, y, 300, 185, 40), '#fffdf6', { shade: false, lw: 4 });
  for (const fx of [x - 40, x + 40]) p.line([[fx, y + 110], [fx, y + 30]], 6, '#9a6b4a');
  p.line([[x - 60, y + 55], [x + 60, y + 55]], 6, '#9a6b4a'); p.line([[x - 60, y + 85], [x + 60, y + 85]], 6, '#9a6b4a');
  const sheep = (sx, sy, face, seed) => {
    const q = spen(t, seed);
    q.part(ellipsePts(sx, sy, 50, 34, 24), '#ffffff', { shade: 0.1 });
    q.part(ellipsePts(sx + (face ? 0 : 42), sy - 14, 20, 16, 18), '#3a3440', { shade: false });
    if (face) { q.dot(sx - 7, sy - 16, 4, 4, '#ffffff'); q.dot(sx + 7, sy - 16, 4, 4, '#ffffff'); }
    for (const lx of [-25, 25]) q.line([[sx + lx, sy + 30], [sx + lx, sy + 52]], 4);
  };
  const tq = onTwos(t), jump = (t0, seed) => { const k = seg(tq, t0, t0 + 0.6); if (k > 0 && k < 1) sheep(x - 190 + 380 * k, y + 40 - Math.sin(Math.PI * k) * 110, false, seed); };
  jump(T.sheep, 63); jump(T.sheep + 0.5, 64);
  const s3 = T.sheep + 1.0;
  if (tq >= s3 && tq < s3 + 0.3) sheep(x - 190 + 120 * seg(tq, s3, s3 + 0.3), y + 40, false, 65);
  else if (tq >= s3 + 0.3 && tq < s3 + 1.2) sheep(x - 70, y + 40, true, 65);                          // stops, stares
  else if (tq >= s3 + 1.2) sheep(x - 70 - 260 * seg(tq, s3 + 1.2, s3 + 1.9), y + 40, false, 65);      // walks off
}
function shotSheep(t) { bedScene(t, { clock: '5:45' }); night(0.85); sheepBubble(t, 360, 600); }
function shotDroop(t) { bedScene(t, { clock: '5:58' }); night(0.85); }
function shotCatEye(t) { bedScene(t, { clock: '5:59' }); night(0.8); }
function shotHop(t) {
  bedroom(t); lamp(t, false);
  const { top } = steveInBed(t); blanket(t, top); bedClock(t, t < T.land ? '5:59' : '6:00');
  cat(t);
  if (t >= T.land && t < T.land + 0.3) hand('THUMP', 770, 820, 66, 0.08, INK, 'Fredoka', '600');
  night(0.8);
}
// ---------- kitchen (the button) ----------
function shotKitchen(t) {
  ctx.fillStyle = '#ddd2bd'; ctx.fillRect(PX - 600, PY - 600, PW + 1200, FLOOR - PY + 600);
  ctx.fillStyle = '#c4ad88'; ctx.fillRect(PX - 600, FLOOR, PW + 1200, 800);
  const s = spen(t, 43);
  s.line([[PX - 600, FLOOR], [PX + PW + 600, FLOOR]], 4);
  s.part([[110, 520], [380, 520], [380, 820], [110, 820]], '#1f2a4d', { shade: false, lw: 5 });
  s.line([[245, 520], [245, 820]], 5); s.line([[110, 670], [380, 670]], 5);
  s.part(roundPoly([[700, 880], [1010, 880], [1010, FLOOR], [700, FLOOR]], 8), '#e9e4da', { shade: 0.1 });
  s.part(roundPoly([[735, 1020], [975, 1020], [975, 1300], [735, 1300]], 10), '#3a3440', { shade: false });
  s.part(roundPoly([[790, 905], [930, 905], [930, 975], [790, 975]], 6), '#1d1b22', { shade: false });
  hand('6:01', 860, 942, 50, 0, '#5af07a', 'Fredoka', '600');
  s.part(ellipsePts(430, FLOOR - 14, 52, 16, 24), '#c0392b', { shade: false });                     // the bowl — the kibble misses it
  const tq = onTwos(t), pouring = tq < T.kitchen + 1.6, talk = talking('steve', tq);
  const pose = { expr: 'dead_inside', lid: 0.9, armR: pouring ? 'reach' : 'down', look: 0.3, tilt: pouring ? 4 : 0 };
  if (talk && talk.mouth) pose.mouth = talk.mouth;
  drawCharacter(ctx, 'steve', 330, FLOOR, K, sum(pose, idle(tq, 2)), { frame: frameOf(t) });
  if (pouring) {
    const b = pen(330 + 22 * K, FLOOR - 74 * K, K, t, 45);
    b.part(roundPoly([[-5, -8], [6, -8], [6, 8], [-5, 8]], 1), '#e7b85a', { shade: 0.15 });
    for (let i = 0; i < 7; i++) { const yy = FLOOR - 70 * K + ((tq * 900 + i * 60) % 330); spen(t, 47 + i).dot(560 + (i % 3) * 12, yy, 5, 5, '#8a5a2b'); }
  }
  drawCharacter(ctx, 'snuggles', 575, FLOOR, 4.6, { expr: 'deadpan', look: -0.3, tilt: pouring ? 0 : -4 }, { frame: frameOf(t) });
  if (!pouring) for (const [dx, dy] of [[-18, 0], [6, -8], [20, 4], [-4, 10]]) spen(t, 52).dot(575 + dx, FLOOR - 52 * 4.6 + dy, 5, 5, '#8a5a2b');   // kibble on his hat
  night(0.5, { x: 860, y: 940, r: 260, c: 'rgba(120,255,150,0.25)' });
}

// ---------- kinetic captions ----------
function captions(t) {
  const c = wordChunk(LINES, WORDS, t); if (!c) return null;
  ctx.save(); ctx.translate(540, 1480);
  ctx.font = '600 82px Fredoka'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const parts = c.words.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), gap = 22;
  let x = -(parts.reduce((a, p) => a + p.wd, 0) + gap * (parts.length - 1)) / 2;
  const col = c.char === 'snuggles' ? '#d9e6ff' : '#ffffff';
  for (const p of parts) { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(p.w, x, 0); ctx.fillStyle = p.stress ? '#ffd84a' : col; ctx.fillText(p.w, x, 0); x += p.wd + gap; }
  ctx.restore();
  return { id: c.id, text: c.words.map(w => w.w).join(' '), x0: 80, y0: 1420, x1: 1000, y1: 1540 };
}

// ---------- frame ----------
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = '600 52px Fredoka';
  ctx.fillText(TITLE[0], 540, 72); ctx.fillText(TITLE[1], 540, 132); ctx.textAlign = 'start';
  const push = (a, b, z0, z1) => z0 + (z1 - z0) * ease.inOut(seg(t, a, b));   // one slow camera move per shot
  let tag = null;
  if (t < T.cold) { withCamera(push(0, T.cold, 1.5, 1.6), 420, 1030, () => { bedScene(t, { clock: '5:02' }); night(1, { x: 540, y: 990, r: 280, c: 'rgba(170,200,255,0.5)' }); }); tag = '5:02 AM'; }
  else if (t < T.flip) withCamera(push(T.cold, T.flip, 1.15, 1.2), 540, 980, () => shotSaturday(t));
  else if (t < T.flipEnd) withCamera(2.4, 200, 1000, () => shotSaturday(t));
  else if (t < T.steve) withCamera(push(T.flipEnd, T.steve, 1.15, 1.22), 540, 980, () => shotSaturday(t));
  else if (t < T.off) withCamera(push(T.steve, T.off, 1.5, 1.6), 590, 960, () => shotSaturday(t));
  else if (t < T.snap) withCamera(1.2, 540, 1000, () => shotDark(t));
  else if (t < T.memo) { withCamera(2.6, 163, 1046, () => shotClock(t, '5:02')); tag = '5:02 AM'; }
  else if (t < T.sitUp) { withCamera(push(T.memo, T.sitUp, 1.9, 2.1), 540, 1000, () => shotMemo(t)); tag = '5:02 AM'; }
  else if (t < T.c520) { withCamera(1.4, 540, 960, () => shotPillow(t)); tag = '5:05 AM'; }
  else if (t < T.phone) { withCamera(2.6, 163, 1046, () => shotClock(t, '5:20')); tag = '5:20 AM'; }
  else if (t < T.c541) { withCamera(push(T.phone, T.c541, 1.8, 2.0), 600, 1010, () => shotPhone(t)); tag = t < T.lapse ? '5:20 AM' : null; }
  else if (t < T.sheep) { withCamera(2.6, 163, 1046, () => shotClock(t, '5:41')); tag = '5:41 AM'; }
  else if (t < T.c558) { withCamera(1.15, 520, 960, () => shotSheep(t)); tag = '5:45 AM'; }
  else if (t < T.catEye) { withCamera(push(T.c558, T.catEye, 1.8, 2.0), 540, 1010, () => shotDroop(t)); tag = '5:58 AM'; }
  else if (t < T.hop) { withCamera(2.8, CATBED.x + 30, CATBED.y - 90, () => shotCatEye(t)); }
  else if (t < T.my) { withCamera(push(T.hop, T.my, 1.25, 1.45), 560, 1080, () => shotHop(t), 540 + (t >= T.land && t < T.land + 0.25 ? (Math.floor(t * 24) % 2 ? 12 : -12) : 0)); tag = t >= T.land ? '6:00 AM' : '5:59 AM'; }
  else if (t < T.kitchen) withCamera(push(T.my, T.kitchen, 2.2, 2.3), FACE.x, FACE.y - 130, () => shotHop(t), 540, 860);
  else withCamera(push(T.kitchen, DUR, 1.3, 1.42), 560, 1080, () => shotKitchen(t), 540, 940);
  if (tag) timeTag(tag, t);
  panel(ctx, PX, PY, PW, PH, 5, null, frameOf(t));
  ctx.font = '600 30px Fredoka'; ctx.fillStyle = 'rgba(42,34,48,0.55)'; ctx.textAlign = 'right'; ctx.fillText('UNIT 4B', PX + PW - 24, PY + PH - 22); ctx.textAlign = 'start';
  const cap = captions(t); window.__texts = cap ? [cap] : [];
}

window.DUR = DUR; window.EV = EV; window.render = render; window.TEXTS = t => { render(t); return window.__texts; };
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  VOICE = await (await fetch('voice/voice.json')).json();
  WORDS = await (await fetch('voice/words.json')).json();
  render(0); window.READY = true;
})();
