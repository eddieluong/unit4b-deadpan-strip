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
const FACE = { x: 540, y: 1095 };                       // where the cat sits on his face

// v5 (voice-led, research/viral/2026-10-26-storytelling): Steve tells it in the first person at ~2.3 words/s; one picture
// per sentence; the timeline is computed from the voice take (each line starts after the previous one + its gap, and
// shots cut on the line's first word or on a named word), so nothing is timed by hand.
const LINE_DEFS = [   // id, char, caption text, gap after (s) — gaps follow the beat: setup→payoff 0.3, list 0.35, before a laugh line 0.45, after a joke 0.7 (room to laugh), time passing 0.6, before the punch 0.8
  ['11_s01', 'steve', 'The clocks just went back an hour.', 0.3],
  ['11_s02', 'steve', 'One FREE hour of sleep.', 0.7],
  ['11_s03', 'steve', 'So my body, being an idiot, woke me up at five a.m.', 0.4],
  ['11_s04', 'steve', 'Wide awake. Like I had a MEETING.', 0.7],
  ['11_s05', 'steve', 'I tried everything.', 0.3],
  ['11_s06', 'steve', 'Cold side of the pillow.', 0.35],
  ['11_s07', 'steve', 'Counting sheep.', 0.45],
  ['11_s08', 'steve', 'The sheep got bored.', 0.7],
  ['11_s09', 'steve', 'I watched ONE video.', 0.6],
  ['11_s10', 'steve', 'It was five forty-one.', 0.7],
  ['11_s11', 'steve', 'And at five fifty-eight, I was finally, FINALLY drifting off.', 1.35],
  ['11_meow', 'snuggles', 'Meow.', 0.35],                                 // the cat doesn't talk: one flat meow, sitting on his face
  ['11_s12a', 'steve', 'MMMPH!', 0.28],                                   // in the scene: under the cat
  ['11_s12b', 'steve', 'Are you KIDDING me?! Five more MINUTES, you little—', 1.6],   // in the scene: the explosion (+ bleep)
  ['11_s13', 'steve', "Cats don't do daylight saving.", 0.8],
];
const TITLE = ['POV: you get an', 'extra hour of sleep'];
const CUT_SHEEP = new URLSearchParams(location.search).get('cut') === 'sheep';   // variant without the sheep beat
let LINES = [], DUR = 0, T = {}, EV = [], SHOTS = [], STEVE = [], CAT = [];
let VOICE = {}, WORDS = {};
const L_ = id => LINES.find(l => l.id === id);
const end = id => L_(id).t + VOICE[id].dur;
const wt = (id, i) => L_(id).t + Math.max(0, (WORDS[id] || [])[i]?.[1] ?? 0);   // time the i-th word starts

function buildTimeline() {
  let t = 0.1;
  LINES = LINE_DEFS.filter(d => !(CUT_SHEEP && ['11_s07', '11_s08'].includes(d[0]))).map(([id, char, text, gap]) => { const L = { id, char, text, t }; t += VOICE[id].dur + gap; return L; });
  DUR = +t.toFixed(2);
  T = {
    flip: 0, rewind: wt('11_s01', 4), flipEnd: L_('11_s02').t,
    off: L_('11_s03').t, snap: wt('11_s03', 6), wide: L_('11_s04').t, tie: wt('11_s04', 2),
    tried: L_('11_s05').t, pFlip: L_('11_s06').t + 0.1, down: end('11_s06'), c520: L_(CUT_SHEEP ? '11_s09' : '11_s07').t,
    sheep: CUT_SHEEP ? -1 : L_('11_s07').t, sheep3: CUT_SHEEP ? -1 : L_('11_s08').t, phone: L_('11_s09').t, lapse: end('11_s09') - 0.25, c541: L_('11_s10').t,
    c558: L_('11_s11').t, catEye: end('11_s11') + 0.15, hop: end('11_s11') + 0.75, land: L_('11_meow').t - 0.3, burst: L_('11_s12b').t - 0.1, bleep: end('11_s12b') - 0.2,
    meow: L_('11_meow').t, my: end('11_s12b') + 0.3, kitchen: L_('11_s13').t - 0.6,
  };
  STEVE = [
    { t: 0, expr: 'happy', sit: 1, arm: 'wide', tilt: -4 },
    { t: T.flipEnd, dur: 0.3, expr: 'happy', mouth: 'smile', arm: 'wide', sit: 1, tilt: -6, fx: ['sparkle'] },        // "One FREE hour of sleep."
    { t: T.off, dur: 0.3, expr: 'sleepy', mouth: 'smile', arm: 'hold', sit: 0, tilt: 0, fx: [] },     // asleep, smiling
    { t: T.snap, dur: 0.08, expr: 'shocked', eyes: 'wide', mouth: 'line', sit: 0 },                    // 5:02, eyes snap open
    { t: T.tie, dur: 0.2, expr: 'shocked', eyes: 'wide', mouth: 'line', sit: 1, arm: 'hold' },        // "like I had a MEETING": sitting up in a tie
    { t: T.tried, dur: 0.25, expr: 'angry', eyes: 'closed', sit: 0, arm: 'hold', fx: ['sweat'] },      // "I tried everything."
    { t: T.pFlip - 0.25, dur: 0.2, expr: 'angry', sit: 1, fx: [] },                                    // cold side of the pillow
    { t: T.down, dur: 0.25, expr: 'angry', eyes: 'closed', sit: 0 },
    { t: T.phone, dur: 0.2, expr: 'nervous', mouth: 'line', look: 0.6, sit: 0, fx: [] },                       // one video
    { t: T.c541, dur: 0.15, expr: 'dead_inside', look: 0.6, sit: 0 },
    { t: T.c558, dur: 0.6, expr: 'sleepy', eyes: 'dot', lid: 0.8, mouth: 'smile', sit: 0, look: 0, fx: ['zzz'] },  // drifting off
    { t: L_('11_s11').t + 2.2, dur: 1.2, expr: 'sleepy', mouth: 'smile', sit: 0, fx: ['zzz'] },             // asleep (eyes closed)
    { t: T.land, dur: 0.06, expr: 'shocked', eyes: 'wide', sit: 0 },
    { t: T.burst, dur: 0.15, expr: 'furious', sit: 1, arm: 'wide', tilt: -4, fx: ['vein', 'steam'] },   // bursts up, furious
    { t: T.bleep, dur: 0.1, expr: 'furious', sit: 1, arm: 'hips', tilt: 6, fx: ['vein', 'steam'] },
    { t: T.my, dur: 0.3, expr: 'angry', sit: 1, arm: 'hips', tilt: 0, look: 0.6, fx: ['vein'] },
    { t: T.my + 0.2, dur: 0.3, expr: 'dead_inside', sit: 1, arm: 'hold', look: 0.6, fx: [] },   // the cat wins
  ];
  CAT = [
    { t: 0, expr: 'sleepy', x: CATBED.x, y: CATBED.y, scale: 3.4, tilt: 0 },
    { t: T.catEye, dur: 0.08, expr: 'shocked', eyes: 'wide', x: CATBED.x, y: CATBED.y, scale: 3.4 },
    { t: T.catEye + 0.35, dur: 0.15, expr: 'deadpan', x: CATBED.x, y: CATBED.y, scale: 3.4, tilt: -8 },
    { t: T.hop, dur: 0.27, expr: 'deadpan', x: 660, y: 1250, scale: 3.8, tilt: 0 },
    { t: T.hop + 0.27, dur: 0.27, expr: 'deadpan', x: 600, y: 1170, scale: 4.1 },
    { t: T.hop + 0.54, dur: 0.26, expr: 'deadpan', x: FACE.x, y: FACE.y, scale: 4.4 },
    { t: T.meow, dur: 0.1, expr: 'neutral', mouth: 'O', x: FACE.x, y: FACE.y, scale: 4.4, tilt: -4 },    // "Meow." on his face
    { t: T.meow + 0.9, dur: 0.2, expr: 'deadpan', x: FACE.x, y: FACE.y, scale: 4.4, tilt: 0 },
    { t: T.burst, dur: 0.2, expr: 'deadpan', x: 680, y: 1255, scale: 4.2 },                            // knocked onto his lap, unbothered
    { t: T.my, dur: 0.25, expr: 'smug', look: -0.6, x: 680, y: 1255, scale: 4.2, tilt: -6 },          // on his lap, satisfied
  ];
  const push = (a, b, z0, z1) => t => z0 + (z1 - z0) * ease.inOut(seg(t, a, b));
  if (!CUT_SHEEP) STEVE.push({ t: T.sheep, expr: 'dead_inside', sit: 0, look: 0 }); STEVE.sort((a, b) => a.t - b.t);
  SHOTS = [   // [start, draw(t)] — one picture per sentence
    [0, t => { withCamera(1, 540, 900, () => shotClockFlip(t)); }],
    [T.flipEnd, t => withCamera(push(T.flipEnd, T.off, 1.3, 1.4)(t), 540, 960, () => shotSaturday(t))],
    [T.off, t => withCamera(1.2, 540, 1000, () => shotDark(t))],
    [T.snap, t => { withCamera(1, 540, 900, () => shotClock(t, '5:02')); timeTag('5:02 AM', t); }],
    [T.wide, t => { withCamera(push(T.wide, T.tie, 2.0, 2.15)(t), 540, 1000, () => shotMemo(t)); timeTag('5:02 AM', t); }],
    [T.tie, t => { withCamera(1.45, 540, 960, () => shotTie(t)); timeTag('5:02 AM', t); }],
    [T.tried, t => { withCamera(1.6, 540, 1000, () => shotMemo(t, '5:04')); timeTag('5:04 AM', t); }],
    [T.pFlip - 0.25, t => { withCamera(1.4, 540, 960, () => shotPillow(t)); timeTag('5:05 AM', t); }],
    ...(CUT_SHEEP ? [] : [[T.sheep, t => { withCamera(1.15, 520, 960, () => shotSheep(t)); timeTag('5:12 AM', t); }]]),
    [T.phone, t => { withCamera(push(T.phone, T.c541, 1.8, 2.0)(t), 600, 1010, () => shotPhone(t)); timeTag(t < T.lapse ? '5:20 AM' : `5:${20 + Math.floor(21 * seg(onTwos(t), T.lapse, T.c541 - 0.05))} AM`, t); }],
    [T.c541, t => { withCamera(1, 540, 900, () => shotClock(t, '5:41')); timeTag('5:41 AM', t); }],
    [end('11_s10') + 0.05, t => { withCamera(push(end('11_s10'), T.c558, 2.0, 2.15)(t), 540, 1000, () => shotMemo(t, '5:41')); timeTag('5:41 AM', t); }],   // the silent beat: his face takes it in
    [T.c558, t => { withCamera(push(T.c558, T.catEye, 1.8, 2.0)(t), 540, 1010, () => shotDroop(t)); timeTag('5:58 AM', t); }],
    [T.catEye, t => withCamera(2.6, CATBED.x, CATBED.y - 110, () => shotCatEye(t))],
    [T.hop, t => { withCamera(push(T.hop, T.my, 1.25, 1.45)(t), 560, 1080, () => shotHop(t), 540 + (t >= T.land && t < T.land + 0.25 ? (Math.floor(t * 24) % 2 ? 12 : -12) : 0)); timeTag(t >= T.land ? '6:00 AM' : '5:59 AM', t); }],
    [T.burst, t => withCamera(push(T.burst, T.my, 1.45, 1.6)(t) + (t < T.burst + 0.3 ? 0.04 : 0), 580, 960, () => shotBurst(t), 540 + (t < T.burst + 0.25 ? (Math.floor(t * 24) % 2 ? 10 : -10) : 0))],
    [T.my, t => withCamera(push(T.my, T.kitchen, 1.75, 1.85)(t), 610, 1040, () => shotBurst(t), 540, 860)],
    [T.kitchen, t => withCamera(push(T.kitchen, DUR, 1.26, 1.32)(t), 610, 1080, () => shotKitchen(t), 540, 940)],
  ];
  EV = [
    ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
    { t: 0.05, type: 'buzz' }, { t: T.rewind, type: 'whoosh' }, { t: T.rewind + 0.5, type: 'choir' }, { t: T.flipEnd, type: 'lullaby' },
    { t: T.off, type: 'click' }, { t: T.off + 0.1, type: 'purr' }, { t: T.snap, type: 'sting' }, { t: T.snap + 0.6, type: 'tick2' },
    { t: T.tie, type: 'pop' }, { t: T.pFlip, type: 'whoosh' }, { t: T.pFlip + 0.6, type: 'pillow' }, { t: T.down, type: 'pillow' },
    ...(CUT_SHEEP ? [] : [{ t: T.sheep, type: 'pop' }]), { t: T.phone, type: 'buzz' }, { t: T.lapse, type: 'lapse' }, { t: T.c558, type: 'hum' },
    { t: T.catEye, type: 'ding' }, { t: T.hop, type: 'hops' }, { t: T.land - 0.05, type: 'stop' }, { t: T.land, type: 'thump' }, { t: T.burst, type: 'whoosh' }, { t: T.bleep, type: 'bleep' },
    { t: T.kitchen + 0.2, type: 'kibble' }, { t: T.kitchen + 0.9, type: 'plink' }, { t: T.kitchen + 0.2, type: 'outro' }, { t: 0.0, type: 'tick' },
  ].sort((a, b) => a.t - b.t);
}

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
function steveInBed(t, extra = {}) {
  // In bed it's a flashback: Steve narrates over it (voice-over), so no lip-sync — except the lines he says in the scene.
  const tq = onTwos(t), base = track(STEVE, tq);
  const pose = sum(base, idle(tq, 1), extra);
  for (const id of ['11_s12b']) { const e = speakingEnv(id, tq); if (e >= 0) pose.mouth = e > 0.55 ? 'scream' : e > 0.18 ? 'wide' : 'teeth'; }
  if ((tq + 0.7) % 4.2 < 0.17 && (!pose.eyes || pose.eyes === 'dot') && !['happy', 'sleepy'].includes(pose.expr) && pose.lid === undefined) pose.eyes = 'closed';
  const s = Math.max(0, Math.min(1, base.sit ?? 0)), y = LIE_Y + (SIT_Y - LIE_Y) * s, top = 1092 + 48 * s;
  delete pose.sit;
  const flying = t >= T.pFlip && t < T.pFlip + 0.6;
  if (!flying) pillow(t, { sitting: s > 0.5, cold: t > T.pFlip + 0.6 && t < T.c520 });
  ctx.save(); ctx.beginPath(); ctx.rect(-2000, -2000, 6000, top + 2000); ctx.clip();
  drawCharacter(ctx, 'steve', 540, y, K, pose, { frame: frameOf(t) });
  ctx.restore();
  if (flying) flyingPillow(t);   // in his hands, in front of his chest
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
  const k = ease.inOut(seg(onTwos(t), T.pFlip, T.pFlip + 0.6));
  const y = 1050 - Math.sin(Math.PI * k) * 60;
  pillow(t, { sitting: true, y, rot: Math.PI * k, cold: k > 0.5 });
  const p = spen(t, 37); for (const hx of [400, 680]) p.dot(hx, y + 10, 13, 13, INK);   // his hands on the pillow
}
function phoneInHand(t) {   // a glowing phone held up beside his face
  const p = spen(t, 71), x = 680, y = 1040;
  p.part(roundPoly([[x - 45, y - 80], [x + 45, y - 80], [x + 45, y + 80], [x - 45, y + 80]], 12), '#2f2b36', { shade: false });
  const lapse = t >= T.lapse && t < T.c541;
  p.part(roundPoly([[x - 36, y - 68], [x + 36, y - 68], [x + 36, y + 68], [x - 36, y + 68]], 8), lapse ? ['#f5a3c7', '#9ad7f5', '#f7e27a', '#b9f0a8'][Math.floor(t * 12) % 4] : '#cfe4ff', { shade: false, lw: 2 });
  p.part([[x - 12, y - 18], [x + 16, y], [x - 12, y + 18]], '#ffffff', { shade: false, lw: 2 });   // a play button: it's a video
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
function bigClock(t, text, { warmLight = false } = {}) {   // insert: the bedside clock filling the frame, easy to read
  ctx.fillStyle = warmLight ? '#cdbb9c' : '#3b4566'; ctx.fillRect(PX, PY, PW, PH);
  const p = spen(t, 27);
  p.part(roundPoly([[150, 1180], [930, 1180], [930, 1570], [150, 1570]], 10), warmLight ? '#b98a5e' : '#6e5a48', { shade: 0.15 });   // nightstand top
  p.part(roundPoly([[200, 700], [880, 700], [880, 1120], [200, 1120]], 40), '#2f2b36', { shade: false });
  p.part(roundPoly([[250, 750], [830, 750], [830, 1070], [250, 1070]], 24), '#1d1b22', { shade: false });
  const g = ctx.createRadialGradient(540, 910, 0, 540, 910, 420); g.addColorStop(0, 'rgba(255,90,74,0.25)'); g.addColorStop(1, 'rgba(255,90,74,0)'); ctx.fillStyle = g; ctx.fillRect(PX, PY, PW, PH);
  hand(text, 540, 915, 230, 0, '#ff5a4a', 'Fredoka', '600');
}
function shotClock(t, text) { bigClock(t, text); }
function shotClockFlip(t) {   // the phone says why; the clock rewinds 2:00 → 1:00; "+1 hour of sleep"
  const tq = onTwos(t), rew = seg(tq, T.rewind, T.rewind + 0.5), done = tq >= T.rewind + 0.5;
  bigClock(t, done ? '1:00' : '2:00', { warmLight: true });
  if (rew > 0 && rew < 1) {   // rewinding: a big counter-clockwise arrow spins round the clock
    ctx.save(); ctx.translate(540, 915); ctx.rotate(-rew * Math.PI * 2); ctx.strokeStyle = '#2e8b57'; ctx.lineWidth = 16; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, 330, -0.2, -Math.PI * 1.6, true); ctx.stroke();
    ctx.translate(330 * Math.cos(-Math.PI * 1.6), 330 * Math.sin(-Math.PI * 1.6)); ctx.rotate(-Math.PI * 1.6 - Math.PI / 2);
    ctx.fillStyle = '#2e8b57'; ctx.beginPath(); ctx.moveTo(0, -36); ctx.lineTo(30, 0); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  if (done) hand('+1 hour of sleep', 540, 1290, 84, -0.03, '#2e8b57', 'Fredoka', '600');
  // the phone notification that explains it
  const k = ease.out(seg(t, T.flip, T.flip + 0.3)), y0 = 240 - (1 - k) * 260;
  const p = spen(t, 93);
  p.part(roundPoly([[90, y0], [990, y0], [990, y0 + 250], [90, y0 + 250]], 30), '#fffdf8', { shade: false, lw: 4 });
  p.part(roundPoly([[120, y0 + 30], [200, y0 + 30], [200, y0 + 110], [120, y0 + 110]], 18), '#3d5a96', { shade: false, lw: 3 });
  hand('↺', 160, y0 + 72, 56, 0, '#ffffff', 'Fredoka', '600');
  ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = INK;
  ctx.font = '600 46px Fredoka'; ctx.fillText('Daylight saving time ends', 225, y0 + 70);
  ctx.font = '42px "Patrick Hand"'; ctx.fillStyle = '#4a4252'; ctx.fillText('Tonight at 2:00, clocks go back 1 hour', 225, y0 + 128);
  ctx.fillText('to 1:00. Enjoy the extra hour of sleep!', 225, y0 + 180);
  ctx.restore();
}
function shotMemo(t, clock = '5:02') { bedScene(t, { clock }); night(0.9); }
function shotPillow(t) { bedScene(t, { clock: '5:05', pillowFlip: true }); night(0.85); if (t > T.pFlip + 0.6 && t < T.down + 0.6) hand('cold side', 760, 860, 54, -0.06, '#bfe3ff', 'Fredoka', '600'); }
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
  const s3 = T.sheep3 - 0.3;
  if (tq >= s3 && tq < s3 + 0.3) sheep(x - 190 + 120 * seg(tq, s3, s3 + 0.3), y + 40, false, 65);
  else if (tq >= s3 + 0.3 && tq < s3 + 1.2) sheep(x - 70, y + 40, true, 65);                          // stops, stares
  else if (tq >= s3 + 1.2) sheep(x - 70 - 260 * seg(tq, s3 + 1.2, s3 + 1.9), y + 40, false, 65);      // walks off
}
function shotSheep(t) { bedScene(t, { clock: '5:12' }); night(0.85); ctx.save(); ctx.translate(540, 600); ctx.scale(1.25, 1.25); ctx.translate(-540, -600); sheepBubble(t, 540, 600); ctx.restore(); }
function shotDroop(t) { bedScene(t, { clock: '5:58' }); night(0.85); }
function shotCatEye(t) {
  bedroom(t); blanket(t, 1092); cat(t);
  if (onTwos(t) >= T.catEye && onTwos(t) < T.catEye + 0.5) hand('!', CATBED.x + 110, CATBED.y - 210, 110, 0.1, '#ffd84a', 'Fredoka', '600');
  night(0.8);
}
function shotHop(t) {
  bedroom(t); lamp(t, false);
  const { top } = steveInBed(t); blanket(t, top); bedClock(t, t < T.land ? '5:59' : '6:00');
  if (t >= L_('11_s12a').t) {   // muffled: his arms flail out from under the blanket
    const up = Math.floor(onTwos(t) * 6) % 2, p = spen(t, 39);
    p.line([[360, 1100], [300, up ? 1040 : 1075], [235, up ? 1010 : 1060]], 9); p.dot(232, up ? 1008 : 1058, 15, 15, INK);
    p.line([[720, 1100], [780, up ? 1075 : 1040], [845, up ? 1060 : 1010]], 9); p.dot(848, up ? 1058 : 1008, 15, 15, INK);
  }
  cat(t);
  if (t >= T.land && t < T.land + 0.3) hand('THUMP', 770, 820, 66, 0.08, INK, 'Fredoka', '600');
  night(0.8);
}
function shotTie(t) {   // "like I had a MEETING": sitting bolt upright in bed, in a tie, holding a briefcase
  bedroom(t); lamp(t, false);
  const { top } = steveInBed(t); blanket(t, top); bedClock(t, '5:02'); cat(t);
  const p = spen(t, 95);
  p.part([[528, 985], [552, 985], [560, 1100], [540, 1130], [520, 1100]], '#c0392b', { shade: 0.15, lw: 3 });       // the tie
  p.part(roundPoly([[600, 1040], [720, 1040], [720, 1120], [600, 1120]], 8), '#7a5238', { shade: 0.15 });          // the briefcase
  p.line([[640, 1040], [645, 1018], [675, 1018], [680, 1040]], 5);
  night(0.75);
}
function shotBurst(t) {   // he sits bolt upright, furious; the cat sits on his lap, unbothered; the swear is a grawlix + bleep
  bedroom(t); lamp(t, false);
  const { top } = steveInBed(t); blanket(t, top); bedClock(t, '6:00'); cat(t);
  if (t >= T.bleep && t < T.my) {
    const p = spen(t, 97), cx = 650, cy = 720, pts = [];
    for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, rr = i % 2 ? 130 : 175; pts.push([cx + Math.cos(a) * rr * 1.2, cy + Math.sin(a) * rr * 0.75]); }
    p.part(pts, '#fff4c0', { shade: false, lw: 5 });
    hand('#@$%&!', cx, cy, 92, -0.06, '#c0392b', 'Fredoka', '600');
  }
  night(0.75);
}
// ---------- kitchen (the button) ----------
function shotKitchen(t) {
  ctx.fillStyle = '#ddd2bd'; ctx.fillRect(PX - 600, PY - 600, PW + 1200, FLOOR - PY + 600);
  ctx.fillStyle = '#c4ad88'; ctx.fillRect(PX - 600, FLOOR, PW + 1200, 800);
  const s = spen(t, 43);
  s.line([[PX - 600, FLOOR], [PX + PW + 600, FLOOR]], 4);
  s.part([[110, 520], [380, 520], [380, 820], [110, 820]], '#1f2a4d', { shade: false, lw: 5 });
  s.line([[245, 520], [245, 820]], 5); s.line([[110, 670], [380, 670]], 5);
  s.part(roundPoly([[780, 880], [1040, 880], [1040, FLOOR], [780, FLOOR]], 8), '#e9e4da', { shade: 0.1 });
  s.part(roundPoly([[810, 1020], [1010, 1020], [1010, 1300], [810, 1300]], 10), '#3a3440', { shade: false });
  s.part(roundPoly([[840, 905], [980, 905], [980, 975], [840, 975]], 6), '#1d1b22', { shade: false });
  hand('6:01', 910, 942, 50, 0, '#5af07a', 'Fredoka', '600');                                      // the oven clock never changed
  s.part(ellipsePts(572, FLOOR - 14, 56, 18, 24), '#c0392b', { shade: false });                     // the bowl
  const tq = onTwos(t), pouring = tq < T.kitchen + 1.6, talk = talking('steve', tq);
  const pose = { expr: 'dead_inside', lid: 0.9, armR: pouring ? 'reach' : 'down', look: 0.3, tilt: pouring ? 4 : 0 };
  if (talk && talk.mouth) pose.mouth = talk.mouth;
  drawCharacter(ctx, 'steve', 330, FLOOR, K, sum(pose, idle(tq, 2)), { frame: frameOf(t) });
  if (pouring) {
    const b = pen(330 + 22 * K, FLOOR - 74 * K, K, t, 45);
    b.part(roundPoly([[-5, -8], [6, -8], [6, 8], [-5, 8]], 1), '#e7b85a', { shade: 0.15 });
    for (let i = 0; i < 7; i++) { const yy = FLOOR - 70 * K + ((tq * 900 + i * 70) % 460); spen(t, 47 + i).dot(562 + (i % 3) * 10, yy, 5, 5, '#8a5a2b'); }
  }
  for (const [dx, dy] of [[-20, -18], [0, -24], [18, -18], [-8, -30], [10, -32]]) if (tq > T.kitchen + 0.6) spen(t, 52).dot(572 + dx, FLOOR + dy, 6, 6, '#8a5a2b');   // kibble in the bowl
  const eating = !pouring;
  drawCharacter(ctx, 'snuggles', 660, FLOOR, 4.6, eating ? { expr: 'happy', look: -0.8, tilt: -18, headDy: -3 } : { expr: 'deadpan', look: -0.8 }, { frame: frameOf(t) });
  night(0.5, { x: 910, y: 940, r: 260, c: 'rgba(120,255,150,0.25)' });
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
  buildTimeline(); window.DUR = DUR; window.EV = EV;
  render(0); window.READY = true;
})();
