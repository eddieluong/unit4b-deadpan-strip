// UNIT 4B · 13 "Storm Stock-Up" (Tập 4) — 9:16 film page (lemo-opuscar contract: READY, DUR, render(t), EV, TEXTS).
// PREPRODUCTION.md: voice-led (Steve VO, no lip-sync) + in-scene lines at the climax (lip-sync); frame 1 = the absurd result
// with his face (#19); beat-based pauses (#16); silent beats (#17); one peak (4); the cat only meows (#18). No real storm.
import { drawCharacter, paper, panel, CAST } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts } from './lib/cast_v2.js';
import { track, idle, sum, wordChunk, ease, onTwos, boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 150, PW = 1000, PH = 1420, FLOOR = 1400, K = 7, INK = '#2a2230';
CAST.shopper1 = { ...CAST.steve, short: 'Shopper', color: '#c46a5a', hair: '#3a2b20' };
CAST.shopper2 = { ...CAST.steve, short: 'Shopper', color: '#5a7fc4', hair: '#c8a060' };
CAST.shopper3 = { ...CAST.steve, short: 'Shopper', color: '#7a9a4a', hair: '#2b2220' };

const LINE_DEFS = [   // id, char, caption, gap after (beat: after a joke 0.7, list 0.35, before the peak 0.6, silent beat 0.9)
  ['13_s01', 'steve', 'The weather app said "strong winds."', 0.4],
  ['13_s02', 'steve', 'Somehow, everyone heard "TOILET PAPER."', 0.7],
  ['13_s03', 'steve', 'I went out for bread and batteries. Normal storm stuff.', 0.5],
  ['13_s04', 'steve', 'Every single cart. Toilet paper.', 0.35],
  ['13_s05', 'steve', 'Forty rolls. Sixty rolls. One man had a FRIDGE box full of it.', 0.7],
  ['13_s06', 'steve', "It's WIND. What is the wind going to DO?", 0.7],
  ['13_s07', 'steve', "I said I wasn't going to buy any.", 0.4],
  ['13_s08', 'steve', 'Then I saw the shelf.', 0.6],
  ['13_s09', 'steve', 'One pack left.', 1.5],                                   // + the silent standoff
  ['13_n11', 'nana', 'Let go, dear.', 0.3],                                       // in the scene
  ['13_s12', 'steve', 'YOU let go!', 1.4],                                        // in the scene: the peak, then the tug
  ['13_s13', 'steve', 'She was eighty. She WON.', 0.4],
  ['13_s12b', 'steve', 'Sorry!', 0.8],                                            // in the scene, from the floor
  ['13_s14', 'steve', 'So I bought paper towels. Forty-eight packs.', 0.7],
  ['13_s15', 'steve', 'The storm was a light breeze.', 0.7],
  ['13_s16', 'steve', 'The only disaster was the cat.', 0.6],
  ['13_meow', 'cat', 'Meow.', 1.2],
];
const IN_SCENE = new Set(['13_n11', '13_s12', '13_s12b']);
const TITLE = ['POV: the weather app', 'says "strong winds"'];
let LINES = [], DUR = 0, T = {}, EV = [], SHOTS = [], STEVE = [], NANA = [], VOICE = {}, WORDS = {};
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
function speakingEnv(id, t) {
  const v = VOICE[id], L = L_(id); if (!v || !L) return -1;
  const ts = Math.floor(t * 8) / 8 - L.t; if (ts < 0 || ts > v.dur) return -1;
  return v.env[Math.min(v.env.length - 1, Math.floor(ts * 24))] || 0;
}
function mouthFor(char, t) {
  for (const L of LINES) {
    if (L.char !== char || !IN_SCENE.has(L.id)) continue;
    const e = speakingEnv(L.id, t);
    if (e >= 0) return L.id === '13_s12' ? (e > 0.5 ? 'scream' : 'wide') : (e > 0.55 ? 'wide' : e > 0.18 ? 'small' : 'line');
  }
  return null;
}
// props
function roll(x, y, r, t, seed) { const p = spen(t, seed); p.part(ellipsePts(x, y, r, r * 1.15, 18), '#ffffff', { shade: 0.08, lw: 2.5 }); p.dot(x, y, r * 0.3, r * 0.35, '#e8e2d6'); }
function pack(x, y, w, h, t, seed, label = '', col = '#dfe9f3') {   // a plastic multipack of rolls
  const p = spen(t, seed);
  p.part(roundPoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], 8), col, { shade: 0.1, lw: 3 });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) p.part(ellipsePts(x + w * (0.2 + 0.3 * i), y + h * (0.3 + 0.4 * j), w * 0.12, h * 0.16, 14), '#ffffff', { shade: false, lw: 2 });
  if (label) { ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(x + 6, y + h * 0.36, w - 12, h * 0.28); ctx.restore(); hand(label, x + w / 2, y + h * 0.5, Math.min(30, w / 4.2), 0, '#3d5a96', 'Fredoka', '600'); }
}
function cart(x, t, load = 1, seed = 41) {   // a shopping cart piled with toilet paper (load 1..3)
  const p = spen(t, seed), y = FLOOR - 40;
  for (let i = 0; i < 4 + load * 3; i++) roll(x + 30 + (i % 4) * 50, y - 230 - Math.floor(i / 4) * 55, 24, t, seed + i);
  p.part([[x, y - 220], [x + 230, y - 220], [x + 210, y - 60], [x + 20, y - 60]], null, { shade: false, lw: 5 });
  for (let i = 1; i < 5; i++) p.line([[x + i * 46, y - 220], [x + 4 + i * 42, y - 60]], 2.5, 'rgba(42,34,48,0.5)');
  p.line([[x + 230, y - 220], [x + 280, y - 270]], 6); p.dot(x + 40, y - 20, 18, 18, INK); p.dot(x + 190, y - 20, 18, 18, INK);
}
function fridgeBox(x, t) {
  const p = spen(t, 47);
  p.part(roundPoly([[x, FLOOR - 560], [x + 260, FLOOR - 560], [x + 260, FLOOR - 40], [x, FLOOR - 40]], 6), '#c9a46a', { shade: 0.15, lw: 4 });
  hand('FRIDGE', x + 130, FLOOR - 300, 52, -0.05, '#6b4a2e', 'Fredoka', '600');
  for (let i = 0; i < 8; i++) roll(x + 30 + (i % 4) * 66, FLOOR - 590 - Math.floor(i / 4) * 60, 30, t, 48 + i);
  p.dot(x + 40, FLOOR - 20, 18, 18, INK); p.dot(x + 220, FLOOR - 20, 18, 18, INK);
}

// ---------- sets ----------
function shop(t, { aisle = false, bare = false } = {}) {
  ctx.fillStyle = '#e8e1d2'; ctx.fillRect(PX - 800, PY - 800, PW + 1600, FLOOR - PY + 800);
  ctx.fillStyle = '#d6d2c4'; ctx.fillRect(PX - 800, FLOOR, PW + 1600, 900);
  const p = spen(t, 3);
  p.line([[PX - 800, FLOOR], [PX + PW + 800, FLOOR]], 4);
  for (let r = 0; r < 3; r++) {
    const y = 560 + r * 200; p.line([[PX - 800, y], [PX + PW + 800, y]], 5, '#9a8f7a');
    if (aisle && bare) continue;
    for (let i = 0; i < 16; i++) {
      const x = -300 + i * 95, hh = 80 + ((i * 37 + r * 13) % 40);
      if (aisle) pack(x, y - hh, 80, hh, t, 100 + i + r * 20);
      else p.part(roundPoly([[x, y - hh], [x + 70, y - hh], [x + 70, y], [x, y]], 4), ['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ba68c8'][(i + r) % 5], { shade: 0.12, lw: 2.5 });
    }
  }
  if (aisle) { p.part(roundPoly([[330, 190], [750, 190], [750, 290], [330, 290]], 10), '#3d5a96', { shade: false }); hand('TOILET PAPER', 540, 241, 50, 0, '#ffffff', 'Fredoka', '600'); }
}
function flat(t, { night = false } = {}) {
  ctx.fillStyle = '#e6dcc8'; ctx.fillRect(PX - 800, PY - 800, PW + 1600, FLOOR - PY + 800);
  ctx.fillStyle = '#cdb894'; ctx.fillRect(PX - 800, FLOOR, PW + 1600, 900);
  const p = spen(t, 5); p.line([[PX - 800, FLOOR], [PX + PW + 800, FLOOR]], 4);
  p.part([[640, 420], [940, 420], [940, 760], [640, 760]], night ? '#2d3c6b' : '#bfe0f2', { shade: false, lw: 5 });
  p.line([[790, 420], [790, 760]], 5); p.line([[640, 590], [940, 590]], 5);
}
function tower(t, n = 1) {   // walls of paper-towel packs up to the ceiling
  for (let c = 0; c < 9; c++) {
    if (c === 3 || c === 4) continue;   // the gap where Steve sits
    for (let r = 0; r < 4; r++) pack(60 + c * 110, FLOOR - 140 - r * 140, 104, 132, t, 200 + c * 10 + r, (r + c) % 2 ? '' : 'TOWELS', '#f3ead8');
  }
}
function sea(t) {   // the flat after the cat: unrolled paper everywhere
  const p = spen(t, 71);
  for (let i = 0; i < 14; i++) { const pts = []; for (let k = 0; k <= 20; k++) pts.push([60 + k * 50, FLOOR - 80 - i * 55 + Math.sin(k * 0.9 + i) * 26]); p.line(pts, 28, '#ffffff'); p.line(pts, 3, 'rgba(42,34,48,0.25)'); }
}

// ---------- characters ----------
function who(id, x, t, keys, extra = {}, scale = K, y = FLOOR) {
  const tq = onTwos(t), base = keys ? track(keys, tq) : {}, pose = sum({ expr: 'neutral', ...base }, idle(tq, x), extra);
  const m = mouthFor(id, tq); if (m) pose.mouth = m;
  drawCharacter(ctx, id, base.x ?? x, base.y ?? y, base.scale ?? scale, pose, { frame: frameOf(t) });
  return base;
}
function lying(t, x = 520, y = FLOOR - 40) {   // Steve flat on his back on the shop floor, head to the left
  ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2); ctx.translate(-x, -y);
  who('steve', x, t, STEVE, {}, K, y + 0);
  ctx.restore();
}
function basket(x, y, t) {   // Steve's tiny basket: a loaf and two batteries
  const p = spen(t, 61);
  p.part(roundPoly([[x - 50, y], [x + 50, y], [x + 40, y + 60], [x - 40, y + 60]], 6), '#e74c3c', { shade: 0.1 });
  p.part(ellipsePts(x - 15, y - 6, 30, 16, 16), '#d9a35b', { shade: 0.15, lw: 2.5 });
  p.part(roundPoly([[x + 18, y - 26], [x + 30, y - 26], [x + 30, y + 4], [x + 18, y + 4]], 2), '#2f2b36', { shade: false, lw: 2 });
}

// ---------- the timeline, computed from the voice take ----------
function buildTimeline() {
  let t = 0.1;
  LINES = LINE_DEFS.map(([id, char, text, gap]) => { const L = { id, char, text, t }; t += VOICE[id].dur + gap; return L; });
  DUR = +t.toFixed(2);
  T = {
    phone: L_('13_s02').t - 0.1, rush: wt('13_s02', 2), shopIn: L_('13_s03').t, carts: L_('13_s04').t, c1: wt('13_s05', 0), c2: wt('13_s05', 2),
    fridge: wt('13_s05', 4), wind: L_('13_s06').t, strut: L_('13_s07').t, shelf: L_('13_s08').t, reach: L_('13_s09').t,
    grab: end('13_s09') + 0.3, nana: L_('13_n11').t, peak: L_('13_s12').t, tug: end('13_s12'), lost: L_('13_s13').t, sorry: L_('13_s12b').t,
    till: L_('13_s14').t, breeze: L_('13_s15').t, cat: L_('13_s16').t, meow: L_('13_meow').t,
  };
  STEVE = [
    { t: 0, expr: 'dead_inside', sit: 1, arm: 'down' },
    { t: T.shopIn, dur: 0.2, expr: 'neutral', arm: 'hold', look: 0.6 },
    { t: T.carts, dur: 0.2, expr: 'confused', arm: 'hold', look: 0.9 },
    { t: T.fridge, dur: 0.15, expr: 'shocked', arm: 'hold', look: 0.9 },
    { t: T.wind, dur: 0.2, expr: 'deadpan', arm: 'hold', look: 0 },
    { t: T.strut, dur: 0.25, expr: 'smug', arm: 'hold', look: -0.4, tilt: -6 },
    { t: T.shelf, dur: 0.2, expr: 'horrified', arm: 'hold', look: 0.6, tilt: 0 },
    { t: T.reach, dur: 0.3, expr: 'nervous', armR: 'reach', armL: 'down', look: 0.9 },
    { t: T.grab, dur: 0.1, expr: 'shocked', armR: 'reach', look: 0.9 },
    { t: T.peak, dur: 0.1, expr: 'furious', armR: 'reach', armL: 'reach', look: 0.9, fx: ['vein', 'sweat'] },
    { t: T.lost, dur: 0.2, expr: 'knocked_out', arm: 'down', look: 0 },
    { t: T.sorry, dur: 0.15, expr: 'embarrassed', armL: 'wave', armR: 'down', look: 0.8 },
    { t: T.till, dur: 0.2, expr: 'dead_inside', arm: 'hold', look: 0.4 },
    { t: T.breeze, dur: 0.2, expr: 'deadpan', look: 0.9 },
    { t: T.cat, dur: 0.2, expr: 'dead_inside', look: 0 },
  ];
  NANA = [
    { t: 0, expr: 'happy', armR: 'reach', look: -0.9 },
    { t: T.nana, dur: 0.2, expr: 'happy', armR: 'reach', look: -0.9 },
    { t: T.peak + 0.4, dur: 0.15, expr: 'evil', armR: 'reach', armL: 'reach', look: -0.9 },
    { t: T.lost, dur: 0.3, expr: 'proud', armR: 'hold', look: 0.6 },
  ];
  const push = (a, b, z0, z1) => t => z0 + (z1 - z0) * ease.inOut(seg(t, a, b));
  const steveSit = (t, x = 540) => who('steve', x, t, STEVE, {}, K, FLOOR + 105);   // sitting on the floor between the towers
  SHOTS = [
    [0, t => withCamera(push(0, T.phone, 1.3, 1.4)(t), 560, 1000, () => {   // frame 1: a fortress of paper towels, the cat on top
      flat(t); tower(t); steveSit(t);
      who('snuggles', 610, t, null, { expr: 'smug', look: -0.4, tail: Math.sin(t * 3) }, 4.4, FLOOR - 140 - 3 * 140 + 2);
    })],
    [T.phone, t => withCamera(1, 540, 900, () => {   // the warning
      ctx.fillStyle = '#e9dcc3'; ctx.fillRect(PX, PY, PW, PH);
      const p = spen(t, 81); p.part(roundPoly([[250, 330], [830, 330], [830, 1450], [250, 1450]], 50), '#2f2b36', { shade: false });
      p.part(roundPoly([[278, 380], [802, 380], [802, 1400], [278, 1400]], 30), '#fbfaf6', { shade: false, lw: 3 });
      const k = ease.out(seg(t, T.phone, T.phone + 0.3));
      p.part(roundPoly([[300, 420 - 60 * (1 - k)], [780, 420 - 60 * (1 - k)], [780, 640], [300, 640]], 20), '#f7e27a', { shade: false, lw: 3 });
      hand('⚠ STORM WARNING', 540, 490, 46, 0, INK, 'Fredoka', '600'); hand('Strong winds tonight', 540, 570, 42, 0, INK);
    })],
    [T.rush, t => withCamera(1.05, 540, 950, () => {   // everyone rushes into the shop
      shop(t);
      const k = seg(t, T.rush, T.shopIn);
      [['shopper1', 1200], ['shopper2', 1380], ['shopper3', 1560], ['nana', 1740]].forEach(([id, x0], i) => who(id, x0 - 1500 * k, t, null, { expr: 'nervous', look: -0.9, arm: 'up' }, 5.6));
      cart(1300 - 1500 * k, t, 2);
    })],
    [T.shopIn, t => withCamera(1.25, 450, 980, () => { shop(t); const b = who('steve', 380, t, STEVE); basket(380 - 1 * K, FLOOR - 50 * K, t); })],
    [T.carts, t => withCamera(1.15, 520, 980, () => {   // carts roll past, each worse
      shop(t); who('steve', 300, t, STEVE); basket(300 - K, FLOOR - 50 * K, t);
      const pass = (t0, fn) => { const k = seg(t, t0, t0 + 1.6); if (k > 0 && k < 1) fn(1150 - 1300 * k); };
      pass(T.carts + 0.1, x => { cart(x, t, 1); who('shopper1', x + 300, t, null, { expr: 'nervous', look: -0.9, arm: 'reach' }, 6); });
      pass(T.c1, x => { cart(x, t, 2); who('shopper2', x + 300, t, null, { expr: 'smug', look: -0.9, arm: 'reach' }, 6); });
      pass(T.c2, x => { cart(x, t, 3); who('shopper3', x + 300, t, null, { expr: 'grin', look: -0.9, arm: 'reach' }, 6); });
      const kf = seg(t, T.fridge, T.fridge + 2.2); if (kf > 0) { fridgeBox(1150 - 1100 * kf, t); who('shopper1', 1150 - 1100 * kf + 310, t, null, { expr: 'proud', look: -0.9, arm: 'reach' }, 6); }
    })],
    [T.wind, t => withCamera(push(T.wind, T.strut, 2.0, 2.15)(t), 300, 860, () => { shop(t); who('steve', 300, t, STEVE); basket(300 - K, FLOOR - 50 * K, t); })],   // Kuleshov: his flat stare
    [T.strut, t => withCamera(1.15, 540, 980, () => { shop(t, { aisle: true }); const x = 150 + 500 * seg(t, T.strut, T.shelf); who('steve', x, t, STEVE); basket(x - K, FLOOR - 50 * K, t); })],
    [T.shelf, t => withCamera(push(T.shelf, T.reach, 1.1, 1.3)(t), 540, 760, () => {   // the bare aisle, one pack under a spotlight
      shop(t, { aisle: true, bare: true });
      ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#fff4c0'; ctx.beginPath(); ctx.moveTo(480, PY); ctx.lineTo(600, PY); ctx.lineTo(680, 760); ctx.lineTo(400, 760); ctx.closePath(); ctx.fill(); ctx.restore();
      pack(470, 660, 140, 100, t, 300, 'LAST ONE');
    })],
    [T.reach, t => withCamera(1.35, 540, 880, () => {   // two hands on the last pack; the old lady; a silent standoff
      shop(t, { aisle: true, bare: true });
      pack(470, 660, 140, 100, t, 300);
      who('steve', 300, t, STEVE);
      if (t >= T.grab) who('nana', 760, t, NANA, {}, 6.4);
    })],
    [T.nana, t => withCamera(2.0, 760, 900, () => { shop(t, { aisle: true, bare: true }); pack(470, 660, 140, 100, t, 300); who('nana', 760, t, NANA, {}, 6.4); })],
    [T.peak, t => withCamera(push(T.peak, T.lost, 1.35, 1.45)(t), 540, 900, () => {   // tug-of-war, the pack stretching
      shop(t, { aisle: true, bare: true });
      const tq = onTwos(t), sway = Math.sin(tq * 9) * 30, stretch = 1 + 0.25 * Math.abs(Math.sin(tq * 9));
      who('steve', 300 + sway, t, STEVE); who('nana', 760 + sway, t, NANA, {}, 6.4);
      ctx.save(); ctx.translate(540 + sway, 860); ctx.scale(stretch, 1 / stretch); ctx.translate(-540, -860); pack(470, 810, 140, 100, t, 300); ctx.restore();
    }, 540 + (t < T.peak + 0.3 ? (Math.floor(t * 24) % 2 ? 10 : -10) : 0))],
    [T.lost, t => withCamera(1.15, 540, 980, () => {   // flat on the floor; she strolls off with it
      shop(t, { aisle: true, bare: true });
      lying(t, 840, FLOOR - 45);
      const x = 760 + 500 * seg(t, T.lost + 0.4, T.till); who('nana', x, t, NANA, {}, 6.4); pack(x + 90, 1010, 110, 80, t, 300);
    })],
    [T.till, t => withCamera(1.15, 540, 980, () => {   // 48 packs of paper towels at the till
      shop(t);
      for (let i = 0; i < 12; i++) pack(520 + (i % 4) * 110, FLOOR - 140 - Math.floor(i / 4) * 130, 104, 124, t, 400 + i, 'PAPER TOWELS', '#f3ead8');
      who('steve', 330, t, STEVE);
    })],
    [T.breeze, t => withCamera(1.6, 790, 640, () => {   // the "storm": one leaf drifts past the window
      flat(t, { night: true }); const k = seg(t, T.breeze, T.cat), p = spen(t, 91);
      ctx.save(); ctx.beginPath(); ctx.rect(640, 420, 300, 340); ctx.clip();
      const lx = 600 + 380 * k, ly = 560 + Math.sin(k * 7) * 50; p.part(ellipsePts(lx, ly, 44, 22, 18), '#e0a830', { shade: 0.1, lw: 3 }); p.line([[lx - 44, ly], [lx + 44, ly]], 3, '#8a5a2b'); ctx.restore();
    })],
    [T.cat, t => withCamera(push(T.cat, DUR, 1.1, 1.2)(t), 540, 900, () => {   // the cat did this
      flat(t); sea(t); who('steve', 540, t, STEVE, {}, K, FLOOR + 105);
      const tq = onTwos(t), meow = tq >= T.meow && tq < T.meow + 0.8;
      who('snuggles', 800, t, null, meow ? { expr: 'neutral', mouth: 'O', look: -0.6 } : { expr: 'smug', look: -0.6 }, 5, FLOOR - 120);
    })],
  ];
  EV = [
    ...LINES.map(L => ({ t: L.t, type: 'voice', id: L.id })),
    { t: 0.0, type: 'wind' }, { t: T.phone, type: 'buzz' }, { t: T.rush, type: 'rush' }, { t: T.shopIn, type: 'murmur' },
    ...[T.carts + 0.1, T.c1, T.c2].map(x => ({ t: x, type: 'cart' })), { t: T.fridge, type: 'cart' }, { t: T.shelf, type: 'choir' },
    { t: T.grab, type: 'stop' }, { t: T.peak, type: 'tug' }, { t: T.lost - 0.2, type: 'thud' }, { t: T.till, type: 'murmur' },
    { t: T.breeze, type: 'breeze' }, { t: T.cat, type: 'sting' },
  ].sort((a, b) => a.t - b.t);
}

// ---------- kinetic captions ----------
function captions(t) {
  const c = wordChunk(LINES, WORDS, t); if (!c) return null;
  ctx.save(); ctx.translate(540, 1480);
  ctx.font = '600 80px Fredoka'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const parts = c.words.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), gap = 22;
  let x = -(parts.reduce((a, p) => a + p.wd, 0) + gap * (parts.length - 1)) / 2;
  const col = { nana: '#f2d9ff', cat: '#d9e6ff' }[c.char] || '#ffffff';
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
  buildTimeline(); window.DUR = DUR; window.EV = EV;
  render(0); window.READY = true;
})();
