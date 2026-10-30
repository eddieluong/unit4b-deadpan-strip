// UNIT 4B · 12 "Self-Checkout" (Tập 3) — 9:16 film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// Built to PREPRODUCTION.md (script table in ../script.md): voice-led (Steve VO, no lip-sync) + in-scene lines (lip-sync);
// frame 1 = the climax image with his face (#19); beat-based pauses (#16); silent reaction beats (#17); one peak (4).
// Timeline is computed from the voice take: each line starts after the previous one + its beat gap.
import { drawCharacter, paper, panel, CAST } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts } from './lib/cast_v2.js';
import { track, idle, speech, sum, wordChunk, ease, onTwos, boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 150, PW = 1000, PH = 1420, FLOOR = 1400, K = 7, INK = '#2a2230';
const WALLC = '#e8e1d2', FLOORC = '#d6d2c4';
const STEVE_X = 400, MACH = { x0: 560, x1: 800 }, LIGHT = { x: 820, y: 600 };
// background cast: the bored teenage employee and two shoppers (simple stick people; no lore)
CAST.teen = { ...CAST.steve, short: 'Teen', color: '#4f9d69', hair: '#6b4a2e' };
CAST.shopper1 = { ...CAST.steve, short: 'Shopper', color: '#c46a5a', hair: '#3a2b20' };
CAST.shopper2 = { ...CAST.steve, short: 'Shopper', color: '#5a7fc4', hair: '#c8a060' };

const LINE_DEFS = [   // id, char, caption text, gap after (beat: after a joke 0.7, list 0.35, before the peak 0.8, silent beat 1.0)
  ['12_s01', 'steve', "The self-checkout machine thinks I'm a CRIMINAL.", 0.7],
  ['12_s02', 'steve', 'All I wanted was ONE banana.', 0.5],
  ['12_m03', 'machine', 'Unexpected item in the bagging area.', 0.6],
  ['12_s04', 'steve', "It's the banana. You just SAW it.", 0.7],
  ['12_m05', 'machine', 'Please place the item in the bagging area.', 0.35],
  ['12_m06', 'machine', 'Unexpected item in the bagging area.', 0.5],
  ['12_s07', 'steve', "Sorry! Sorry. It's a banana.", 0.4],                         // in the scene
  ['12_s08', 'steve', 'I apologized. To a MACHINE.', 0.7],
  ['12_s09', 'steve', 'Then the light started FLASHING.', 0.6],
  ['12_s10', 'steve', 'A sixteen-year-old came over to type the SECRET code.', 0.4],
  ['12_s11', 'steve', 'It was one, two, three, four.', 0.7],
  ['12_s12', 'steve', 'And the whole line watched me like I tried to steal a banana.', 0.6],
  ['12_t13', 'teen', "It's the banana.", 0.8],                                      // in the scene
  ['12_s14', 'steve', "I KNOW it's the banana!", 1.0],                                // in the scene: the peak, then the shop stops
  ['12_s15', 'steve', 'Paid. Twenty-five cents. Most expensive banana of my LIFE.', 0.8],
  ['12_s16', 'steve', 'Next week, I went to a REAL cashier.', 0.5],
  ['12_t17', 'teen', 'Unexpected item in the bagging area.', 1.4],                  // in the scene: the button
];
const IN_SCENE = new Set(['12_s07', '12_s14', '12_t13', '12_t17']);
const TITLE = ['POV: you buy', 'one banana'];
let LINES = [], DUR = 0, T = {}, EV = [], SHOTS = [], STEVE = [], TEEN = [], VOICE = {}, WORDS = {};
const L_ = id => LINES.find(l => l.id === id);
const end = id => L_(id).t + VOICE[id].dur;
const wt = (id, i) => L_(id).t + Math.max(0, (WORDS[id] || [])[i]?.[1] ?? 0);

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
function tag(text, t) {
  const p = spen(t, 91), w = text.length * 30 + 60;
  p.part(roundPoly([[80, 196], [80 + w, 192], [84 + w, 280], [84, 284]], 8), '#f7e27a', { shade: false, lw: 3.5 });
  hand(text, 82 + w / 2, 240, 50, -0.02, INK, 'Fredoka', '600');
}
function speakingEnv(id, t) {
  const v = VOICE[id], L = L_(id); if (!v || !L) return -1;
  const ts = Math.floor(t * 8) / 8 - L.t; if (ts < 0 || ts > v.dur) return -1;
  return v.env[Math.min(v.env.length - 1, Math.floor(ts * 24))] || 0;
}
function mouthFor(char, t) {   // lip-sync only for lines said inside the scene
  for (const L of LINES) {
    if (L.char !== char || !IN_SCENE.has(L.id)) continue;
    const e = speakingEnv(L.id, t);
    if (e >= 0) return L.id === '12_s14' ? (e > 0.5 ? 'scream' : e > 0.15 ? 'wide' : 'teeth') : (e > 0.55 ? 'wide' : e > 0.18 ? 'small' : 'line');
  }
  return null;
}
function banana(x, y, s, t, rot = 0, sticker = true) {   // a single banana with its price sticker
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.translate(-x, -y);
  const p = pen(x, y, s, t, 61);
  const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.15 + 0.7 * i / 12); pts.push([Math.cos(a) * 9, Math.sin(a) * 9 - 6]); }
  for (let i = 12; i >= 0; i--) { const a = Math.PI * (0.15 + 0.7 * i / 12); pts.push([Math.cos(a) * 6, Math.sin(a) * 5.2 - 6]); }
  p.part(pts, '#f4d03f', { shade: 0.15 });
  p.line([[-7.6, -1.5], [-9, -0.5]], p.lw * 1.2, '#6b4a2e');
  if (sticker) p.dot(1, 2.4, 1.6, 1.0, '#e74c3c');
  ctx.restore();
}

// ---------- sets ----------
function store(t) {   // the supermarket wall: shelves with boxes, a sign
  ctx.fillStyle = WALLC; ctx.fillRect(PX - 800, PY - 800, PW + 1600, FLOOR - PY + 800);
  ctx.fillStyle = FLOORC; ctx.fillRect(PX - 800, FLOOR, PW + 1600, 900);
  const p = spen(t, 3);
  p.line([[PX - 800, FLOOR], [PX + PW + 800, FLOOR]], 4);
  for (let r = 0; r < 3; r++) {
    const y = 560 + r * 170; p.line([[PX - 800, y], [PX + PW + 800, y]], 5, '#9a8f7a');
    for (let i = 0; i < 16; i++) { const x = -300 + i * 95, hh = 70 + ((i * 37 + r * 13) % 40); p.part(roundPoly([[x, y - hh], [x + 70, y - hh], [x + 70, y], [x, y]], 4), ['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ba68c8'][(i + r) % 5], { shade: 0.12, lw: 2.5 }); }
  }
  p.part(roundPoly([[360, 190], [720, 190], [720, 290], [360, 290]], 10), '#2f6f4e', { shade: false });
  hand('SELF CHECKOUT', 540, 241, 52, 0, '#ffffff', 'Fredoka', '600');
}
function machineState(t) {
  if (t < T.intro) return ['WAIT FOR|HELP', '#e74c3c'];
  if (t < T.scan) return ['WELCOME', '#5fbf7a'];
  if (t < T.alarm) return (t >= L_('12_m05').t - 0.2 && t < L_('12_m06').t - 0.2) ? ['PLACE ITEM|IN BAG', '#64b5f6'] : ['UNEXPECTED|ITEM', '#f7c948'];
  if (t < T.code + 2.6) return ['WAIT FOR|HELP', '#e74c3c'];
  return ['THANK|YOU', '#5fbf7a'];
}
function machine(t, { alarm = false } = {}) {
  const p = spen(t, 11), [txt, col] = machineState(t);
  p.line([[LIGHT.x, LIGHT.y + 40], [LIGHT.x, FLOOR]], 9, '#7a7f87');                                     // light pole
  const on = alarm && Math.floor(t * 4) % 2 === 0;
  p.part(ellipsePts(LIGHT.x, LIGHT.y, 42, 46, 30), on ? '#ff3b30' : '#8a2b26', { shade: false, lw: 4 });
  if (on) { ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#ff3b30'; ctx.beginPath(); ctx.arc(LIGHT.x, LIGHT.y, 150, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  p.part(roundPoly([[MACH.x0, 960], [MACH.x1, 960], [MACH.x1, FLOOR], [MACH.x0, FLOOR]], 10), '#c9ced6', { shade: 0.12 });     // kiosk
  p.part(roundPoly([[MACH.x0 + 10, 700], [MACH.x1 - 10, 700], [MACH.x1 - 20, 940], [MACH.x0 + 20, 940]], 12), '#2f2b36', { shade: false });
  p.part(roundPoly([[MACH.x0 + 26, 716], [MACH.x1 - 26, 716], [MACH.x1 - 34, 924], [MACH.x0 + 34, 924]], 8), col, { shade: false, lw: 3 });
  txt.split('|').forEach((ln, i, a) => hand(ln, (MACH.x0 + MACH.x1) / 2, 820 + (i - (a.length - 1) / 2) * 44, 31, 0, INK, 'Fredoka', '600'));
  p.part(ellipsePts(680, 676, 16, 16, 18), '#1d1b22', { shade: false, lw: 3 }); p.dot(684, 672, 5, 5, '#9ad7f5');   // the camera lens
  p.part(roundPoly([[400, 1050], [550, 1050], [550, 1070], [400, 1070]], 4), '#9aa1aa', { shade: false });      // bagging scale
  p.part([[420, 1050], [530, 1050], [520, 930], [430, 930]], '#f1efe9', { shade: 0.08, lw: 3 });                // the bag
}
function queue(t, { look = 0.0, stare = false } = {}) {   // the line of shoppers to the left, further back
  const tq = onTwos(t);
  const ppl = [['shopper1', 40, 4.5], ['nana', 105, 4.7], ['shopper2', 170, 4.4], ['penny', 232, 4.5]];
  for (const [id, x, s] of ppl) {
    const pose = { expr: stare ? (id === 'nana' ? 'skeptical' : 'deadpan') : 'neutral', look: stare ? 0.9 : look, ...idle(tq, x) };
    if (id === 'nana' && stare) pose.armR = 'hold';
    drawCharacter(ctx, id, x, FLOOR - 170, s, pose, { frame: frameOf(t) });
  }
}

// ---------- characters in the scene ----------
function steve(t, extra = {}, x = STEVE_X) {
  const tq = onTwos(t), base = track(STEVE, tq), pose = sum(base, idle(tq, 1), extra);
  const m = mouthFor('steve', tq); if (m) pose.mouth = m;
  if (!m && (tq + 0.7) % 4.2 < 0.17 && (!pose.eyes || pose.eyes === 'dot') && pose.lid === undefined) pose.eyes = 'closed';
  const bx = base.x ?? x;
  drawCharacter(ctx, 'steve', bx, FLOOR, K, pose, { frame: frameOf(t) });
  // the banana in his hand (follows the arm pose)
  const arm = typeof pose.armR === 'string' ? pose.armR : (pose.armR?.b ?? pose.arm);
  const hp = { surrender: [bx + 21 * K, FLOOR - 92 * K, -0.5], wave: [bx + 14 * K, FLOOR - 88 * K, -0.4], up: [bx + 6 * K, FLOOR - 82 * K, -0.3], reach: [bx + 22 * K, FLOOR - 74 * K, 0.2], hold: [bx - 1 * K, FLOOR - 50 * K, 0.4], point: [bx + 23 * K, FLOOR - 64 * K, 0] }[arm];
  if (base.banana && hp) banana(hp[0], hp[1], 5, t, hp[2]);
  return bx;
}
function teen(t, x, extra = {}) {
  const tq = onTwos(t), base = track(TEEN, tq), pose = sum(base, idle(tq, 3), extra);
  const m = mouthFor('teen', tq); pose.mouth = m || (Math.floor(tq * 3) % 2 ? 'small' : 'line');   // chewing gum between lines
  const bx = base.x ?? x;
  drawCharacter(ctx, 'teen', bx, FLOOR, K, pose, { frame: frameOf(t) });
  const p = pen(bx, FLOOR, K, t, 71), hy = 80 + (pose.headDy || 0);   // cap + lanyard
  p.part([[-15, hy + 6], [15, hy + 6], [12, hy + 16], [-12, hy + 16]], '#2e6b4a', { shade: 0.15 });
  p.part([[10, hy + 6], [24, hy + 4], [24, hy + 8], [10, hy + 9]], '#2e6b4a', { shade: false });
  p.line([[-4, 63], [0, 50], [4, 63]], p.lw * 0.5, '#e74c3c'); p.part(roundPoly([[-3, 44], [3, 44], [3, 50], [-3, 50]], 0.5), '#ffffff', { shade: false, lw: 2 });
  if (base.banana) banana(bx + 22 * K, FLOOR - 74 * K, 5, t, -0.2);
}

// ---------- shots ----------
function shotCheckout(t, { alarm = false, stare = false, teenX = null } = {}) {
  store(t); queue(t, { stare }); machine(t, { alarm });
  const tq = onTwos(t), base = track(STEVE, tq);
  if (base.bananaOnScale) banana(475, 1040, 5, t, 0);
  steve(t);
  if (teenX !== null) teen(t, teenX);
}
function shotScreen(t) {   // close on the screen and the scale: the banana goes down, the screen turns yellow
  store(t); machine(t);
  const k = ease.inOut(seg(onTwos(t), T.scan - 0.4, T.scan));
  banana(475, 1040 - (1 - k) * 160, 5, t, 0);
  if (k < 1) { const p = spen(t, 73); p.line([[470, 1040 - (1 - k) * 160 + 30], [400, 1300]], 12); }
}
function shotLens(t) {   // Kuleshov: the camera lens stares back
  ctx.fillStyle = '#c9ced6'; ctx.fillRect(PX, PY, PW, PH);
  const p = spen(t, 15);
  p.part(ellipsePts(540, 860, 260, 260, 60), '#1d1b22', { shade: false, lw: 6 });
  p.part(ellipsePts(540, 860, 150, 150, 50), '#2f4f74', { shade: false, lw: 4 });
  p.dot(590, 810, 40, 40, '#9ad7f5'); p.dot(500, 900, 14, 14, '#9ad7f5');
}
function shotKeypad(t) {   // "one, two, three, four": the keys light up on the words
  ctx.fillStyle = '#c9ced6'; ctx.fillRect(PX, PY, PW, PH);
  const p = spen(t, 17), lit = [2, 3, 4, 5].map(i => wt('12_s11', i));
  p.part(roundPoly([[240, 470], [840, 470], [840, 1330], [240, 1330]], 30), '#3a3f47', { shade: false });
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  keys.forEach((k, i) => {
    const cx = 340 + (i % 3) * 200, cy = 580 + Math.floor(i / 3) * 190, n = '1234'.indexOf(k);
    const on = n >= 0 && t >= lit[n] && t < lit[n] + 0.35;
    p.part(roundPoly([[cx - 75, cy - 70], [cx + 75, cy - 70], [cx + 75, cy + 70], [cx - 75, cy + 70]], 16), on ? '#f7e27a' : '#e9ecef', { shade: 0.1 });
    hand(k, cx, cy, 70, 0, INK, 'Fredoka', '600');
  });
  const n = lit.filter(x => t >= x).length;   // the teen's one finger
  if (n > 0) { const i = n - 1, cx = 340 + (i % 3) * 200, cy = 580 + Math.floor(i / 3) * 190; p.line([[cx + 30, cy + 40], [cx + 160, cy + 420]], 30, '#c98f68'); p.dot(cx + 22, cy + 22, 26, 26, '#c98f68'); }
}
function shotQueue(t) {   // the line staring: close on the shoppers
  store(t); queue(t, { stare: true });
}
function shotReceipt(t) {
  ctx.fillStyle = '#c9ced6'; ctx.fillRect(PX, PY, PW, PH);
  const k = ease.out(seg(onTwos(t), L_('12_s15').t, L_('12_s15').t + 1.6)), p = spen(t, 19);
  p.part(roundPoly([[300, 330], [780, 330], [780, 470], [300, 470]], 16), '#3a3f47', { shade: false });
  const y1 = 460 + 1000 * k;
  p.part([[380, 450], [700, 450], [700, y1], [690, y1 + 14], [670, y1], [650, y1 + 14], [630, y1], [610, y1 + 14], [590, y1], [570, y1 + 14], [550, y1], [530, y1 + 14], [510, y1], [490, y1 + 14], [470, y1], [450, y1 + 14], [430, y1], [410, y1 + 14], [390, y1], [380, y1 + 14]], '#ffffff', { shade: 0.06, lw: 3 });
  ctx.save(); ctx.beginPath(); ctx.rect(380, 450, 320, y1 - 450); ctx.clip();
  for (let i = 0; i < 20; i++) p.line([[410, 520 + i * 48], [600 - (i * 37) % 140, 520 + i * 48]], 3, 'rgba(42,34,48,0.35)');
  hand('BANANA x1', 540, 560, 40, 0, INK, 'Fredoka', '600'); hand('TOTAL  $0.25', 540, Math.max(640, y1 - 60), 48, 0, INK, 'Fredoka', '600');
  ctx.restore();
}
function shotMuseum(t) {   // the most expensive banana of his life
  ctx.fillStyle = '#1d1b22'; ctx.fillRect(PX, PY, PW, PH);
  ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = '#fff4c0'; ctx.beginPath(); ctx.moveTo(470, PY); ctx.lineTo(610, PY); ctx.lineTo(820, 1150); ctx.lineTo(260, 1150); ctx.closePath(); ctx.fill(); ctx.restore();
  const p = spen(t, 23);
  p.part(roundPoly([[330, 1150], [750, 1150], [750, 1400], [330, 1400]], 8), '#5b4a3a', { shade: 0.15 });
  p.part(roundPoly([[360, 1080], [720, 1080], [740, 1150], [340, 1150]], 30), '#8e2b3b', { shade: 0.2 });
  banana(540, 1060, 9, t, 0);
  p.part([[330, 700], [750, 700], [750, 1150], [330, 1150]], null, { shade: false, lw: 4 });
  ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#bfe3ff'; ctx.fillRect(330, 700, 420, 450); ctx.restore();
  p.part(roundPoly([[420, 1230], [660, 1230], [660, 1300], [420, 1300]], 6), '#d9c27a', { shade: false });
  hand('$0.25', 540, 1266, 44, 0, INK, 'Fredoka', '600');
}
function shotTill(t) {   // next week: a staffed checkout; the cashier turns out to be the same teen
  store(t);
  const p = spen(t, 29);
  p.part(roundPoly([[100, 1080], [700, 1080], [700, FLOOR], [100, FLOOR]], 8), '#b98a5e', { shade: 0.12 });
  p.part(roundPoly([[100, 1040], [700, 1040], [700, 1090], [100, 1090]], 10), '#3a3f47', { shade: false });     // the belt
  const k = seg(onTwos(t), L_('12_s16').t, L_('12_s16').t + 2.0);
  banana(330 + 280 * k, 1022, 6, t, 0);
  p.part(roundPoly([[720, 960], [900, 960], [900, FLOOR], [720, FLOOR]], 8), '#9aa1aa', { shade: 0.12 });         // till
  hand('OPEN', 810, 1010, 40, 0, '#2e8b57', 'Fredoka', '600');
}

function shotTillFront(t) {   // the belt drawn over Steve's legs (he stands behind the counter end)
  const p = spen(t, 31), k = seg(onTwos(t), L_('12_s16').t, L_('12_s16').t + 2.0);
  p.part(roundPoly([[300, 1080], [700, 1080], [700, FLOOR], [300, FLOOR]], 8), '#b98a5e', { shade: 0.12 });
  p.part(roundPoly([[300, 1040], [700, 1040], [700, 1090], [300, 1090]], 10), '#3a3f47', { shade: false });
  p.part(roundPoly([[720, 960], [900, 960], [900, FLOOR], [720, FLOOR]], 8), '#9aa1aa', { shade: 0.12 });
  hand('OPEN', 810, 1010, 40, 0, '#2e8b57', 'Fredoka', '600');
  banana(330 + 280 * k, 1022, 6, t, 0);
}
// ---------- the timeline, computed from the voice take ----------
function buildTimeline() {
  let t = 0.1;
  LINES = LINE_DEFS.map(([id, char, text, gap]) => { const L = { id, char, text, t }; t += VOICE[id].dur + gap; return L; });
  DUR = +t.toFixed(2);
  T = {
    intro: L_('12_s02').t - 0.1, scan: L_('12_m03').t - 0.1, show: L_('12_s04').t, lens: wt('12_s04', 6),
    out: L_('12_m05').t - 0.2, back: L_('12_m06').t - 0.2, sorry: L_('12_s07').t, judge: L_('12_s08').t,
    alarm: L_('12_s09').t, teenIn: L_('12_s10').t, code: L_('12_s11').t, stare: L_('12_s12').t, back2: wt('12_s12', 7),
    teenLine: L_('12_t13').t, peak: L_('12_s14').t, silence: end('12_s14'), receipt: L_('12_s15').t, museum: wt('12_s15', 4),
    till: L_('12_s16').t, reveal: L_('12_t17').t - 0.25, stareEnd: end('12_t17'),
  };
  STEVE = [
    { t: 0, expr: 'nervous', arm: 'surrender', banana: 1, look: 0.2, fx: ['sweat'] },                              // frame 1: hands up, like an arrest
    { t: T.intro, dur: 0.2, expr: 'happy', arm: 'hold', banana: 1, look: 0.6, x: STEVE_X, fx: [] },       // ten minutes earlier: one banana, happy
    { t: T.scan, dur: 0.25, expr: 'neutral', armR: 'reach', armL: 'down', banana: 0, bananaOnScale: 1, look: 0.9 },
    { t: T.show, dur: 0.25, expr: 'skeptical', armR: 'reach', armL: 'down', banana: 1, bananaOnScale: 0, look: 0.9, tilt: 6 },  // holds it up to the camera
    { t: T.out, dur: 0.2, expr: 'deadpan', armR: 'hold', banana: 1, look: 0.9, tilt: 0 },
    { t: T.back, dur: 0.2, expr: 'dead_inside', armR: 'reach', banana: 0, bananaOnScale: 1, look: 0.9 },
    { t: T.sorry, dur: 0.25, expr: 'nervous', arm: 'hold', banana: 1, bananaOnScale: 0, lean: 14, look: 0.9, fx: ['sweat'] },   // bows to the machine
    { t: T.alarm, dur: 0.15, expr: 'shocked', arm: 'hold', banana: 1, lean: 0, look: 0.9 },
    { t: T.teenIn, dur: 0.3, expr: 'embarrassed', arm: 'hold', banana: 1, look: 0.9 },
    { t: T.stare, dur: 0.2, expr: 'cringe', arm: 'hold', banana: 1, look: -0.9, fx: ['sweat'] },
    { t: T.teenLine, dur: 0.2, expr: 'dead_inside', arm: 'down', banana: 0, look: 0.9 },
    { t: T.peak, dur: 0.12, expr: 'furious', arm: 'wide', banana: 0, look: 0.9, fx: ['vein', 'steam'] },  // the peak
    { t: T.silence + 0.4, dur: 0.3, expr: 'embarrassed', arm: 'down', look: -0.6, fx: ['sweat'] },        // the whole shop is staring
    { t: T.till, dur: 0.2, expr: 'happy', arm: 'down', look: 0.9, fx: [] },
    { t: T.reveal + 0.6, dur: 0.15, expr: 'dead_inside', look: 0.9 },
  ];
  TEEN = [
    { t: 0, expr: 'deadpan', lid: 0.7, look: -0.9, x: 1100 },
    { t: T.teenIn, dur: 1.6, expr: 'deadpan', lid: 0.7, look: -0.9, x: 760 },                              // strolls over
    { t: T.teenLine - 0.3, dur: 0.3, expr: 'deadpan', lid: 0.7, armR: 'reach', banana: 1, look: -0.9, x: 640 },
    { t: T.peak + 0.3, dur: 0.15, expr: 'neutral', armR: 'reach', banana: 1, look: -0.9, x: 640, lid: 0.4 },
    { t: T.till, expr: 'deadpan', lid: 0.75, look: -0.6, x: 810, banana: 0, arm: 'down' },
  ];
  const push = (a, b, z0, z1) => t => z0 + (z1 - z0) * ease.inOut(seg(t, a, b));
  SHOTS = [
    [0, t => withCamera(push(0, T.intro, 1.25, 1.35)(t), 480, 960, () => shotCheckout(t, { alarm: true, stare: true }))],
    [T.intro, t => { withCamera(1.15, 470, 1000, () => shotCheckout(t)); tag('10 MINUTES EARLIER', t); }],
    [T.scan, t => withCamera(push(T.scan, T.show, 1.9, 2.0)(t), 600, 900, () => shotScreen(t))],
    [T.show, t => withCamera(1.4, 500, 960, () => shotCheckout(t))],
    [T.lens, t => withCamera(1, 540, 900, () => shotLens(t))],
    [T.out, t => withCamera(1.4, 500, 960, () => shotCheckout(t))],
    [T.sorry, t => withCamera(push(T.sorry, T.alarm, 1.45, 1.6)(t), 470, 950, () => shotCheckout(t))],
    [T.alarm, t => withCamera(1.15, 470, 1000, () => shotCheckout(t, { alarm: true, stare: t > T.alarm + 0.6, teenX: t >= T.teenIn ? 760 : null }))],
    [T.code, t => withCamera(1, 540, 900, () => shotKeypad(t))],
    [T.stare, t => withCamera(1.7, 180, 1080, () => shotQueue(t))],
    [T.back2, t => withCamera(1.6, STEVE_X + 60, 920, () => shotCheckout(t, { alarm: true, stare: true, teenX: 760 }))],
    [T.teenLine - 0.3, t => withCamera(1.35, 500, 960, () => shotCheckout(t, { alarm: true, stare: true, teenX: 640 }))],
    [T.peak, t => withCamera(push(T.peak, T.silence, 1.45, 1.5)(t) + (t < T.peak + 0.3 ? 0.05 : 0), 480, 960, () => shotCheckout(t, { alarm: true, stare: true, teenX: 640 }), 540 + (t < T.peak + 0.3 ? (Math.floor(t * 24) % 2 ? 10 : -10) : 0))],
    [T.silence, t => withCamera(1.1, 450, 1000, () => shotCheckout(t, { alarm: true, stare: true, teenX: 640 }))],   // silent beat: everyone stares
    [T.receipt, t => withCamera(1, 540, 900, () => shotReceipt(t))],
    [T.museum, t => withCamera(push(T.museum, T.till, 1.0, 1.12)(t), 540, 1000, () => shotMuseum(t))],
    [T.till, t => { withCamera(1.2, 450, 1000, () => { store(t); steve(t, {}, 200); shotTillFront(t); }); tag('NEXT WEEK', t); }],
    [T.reveal, t => withCamera(push(T.reveal, T.reveal + 1.2, 1.9, 2.05)(t), 810, 860, () => { shotTill(t); teen(t, 810); })],
    [T.stareEnd + 0.1, t => withCamera(2.0, 200, 850, () => { shotTill(t); steve(t, {}, 200); })],
  ];
  EV = [
    ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
    { t: 0.0, type: 'alarm' }, { t: T.intro, type: 'murmur' }, { t: T.scan + 0.35, type: 'beep' }, { t: L_('12_m03').t - 0.05, type: 'error' },
    { t: T.lens, type: 'zoom' }, { t: L_('12_m06').t - 0.05, type: 'error' }, { t: T.alarm, type: 'alarm' },
    ...[2, 3, 4, 5].map(i => ({ t: wt('12_s11', i), type: 'key' })), { t: T.teenIn, type: 'steps' },
    { t: T.peak, type: 'stop' }, { t: T.receipt, type: 'printer' }, { t: T.museum, type: 'choir' }, { t: T.till, type: 'murmur' },
    { t: T.till + 0.1, type: 'belt' }, { t: T.reveal, type: 'beep' }, { t: T.stareEnd + 0.1, type: 'sting' },
  ].sort((a, b) => a.t - b.t);
}

// ---------- kinetic captions ----------
function captions(t) {
  const c = wordChunk(LINES, WORDS, t); if (!c) return null;
  ctx.save(); ctx.translate(540, 1480);
  ctx.font = '600 80px Fredoka'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const parts = c.words.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), gap = 22;
  let x = -(parts.reduce((a, p) => a + p.wd, 0) + gap * (parts.length - 1)) / 2;
  const col = { machine: '#bfe8ff', teen: '#c9f5c9' }[c.char] || '#ffffff';
  for (const p of parts) { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(p.w, x, 0); ctx.fillStyle = p.stress ? '#ffd84a' : col; ctx.fillText(p.w, x, 0); x += p.wd + gap; }
  ctx.restore();
  return { id: c.id, text: c.words.map(w => w.w).join(' '), x0: 80, y0: 1420, x1: 1000, y1: 1540 };
}

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
