// Motion test (6 s): the same line as Tập 2 0:06, acted with the new motion layer — tweened poses with overshoot,
// idle breathing, head nods on words, squash/stretch on each new pose, camera push + punch-in on the stressed word,
// kinetic word captions. Compare with episodes/11-extra-hour (v1) at 6.4–10.6 s.
import { drawCharacter, paper, panel } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts } from './lib/cast_v2.js';
import { track, idle, speech, sum, wordChunk, ease, onTwos, boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 150, PW = 1000, PH = 1420, K = 7, INK = '#2a2230';
const WIN = { x0: 640, x1: 940, y0: 430, y1: 760 };
const LINES = [{ id: '11_02_steve', char: 'steve', t: 0.5, text: "Extra hour. I'm gonna sleep SO much." }];
const DUR = 5.6;
let VOICE = {}, WORDS = {};
const EV = [{ t: 0.5, type: 'voice', id: '11_02_steve' }];

const frameOf = boilFrame;
const spen = (t, seed) => { const p = new VPen(ctx, 0, 0, 1, { lw: 2.4, hand: true, frame: frameOf(t), seed }); p.T = q => q; return p; };

// Steve's acting: one pose per phrase, landing on the words (line starts at 0.5 s)
const STEVE = [
  { t: 0, expr: 'neutral', arm: 'hold', look: -0.3, lean: 0, tilt: 0 },
  { t: 0.45, expr: 'happy', arm: 'hold', lean: 0, tilt: -4 },                                   // "Extra hour." — delighted
  { t: 2.2, dur: 0.35, expr: 'smug', arm: 'up', lean: 6, tilt: 6, look: 0.2 },                 // "I'm gonna sleep SO much" — leans back, hands behind his head
];
const CAT = [
  { t: 0, expr: 'side_eye', look: -0.6, tilt: 0 },
  { t: 3.3, dur: 0.6, expr: 'deadpan', look: -0.9, tilt: 8 },                                   // one slow look at him: the only thing the cat does
];

function steveMouth(t) {
  const v = VOICE['11_02_steve'], ts = Math.floor(t * 8) / 8 - 0.5;
  if (!v || ts < 0 || ts > v.dur) return null;
  const e = v.env[Math.min(v.env.length - 1, Math.floor(ts * 24))] || 0;
  return e > 0.55 ? 'wide' : e > 0.18 ? 'small' : 'line';
}

function room(t) {
  ctx.fillStyle = '#e6dcc8'; ctx.fillRect(PX - 600, PY - 600, PW + 1200, 1150 - PY + 600);
  ctx.fillStyle = '#cdb894'; ctx.fillRect(PX - 600, 1150, PW + 1200, 1200);
  const p = spen(t, 3);
  p.line([[PX - 600, 1150], [PX + PW + 600, 1150]], 4);
  p.part([[WIN.x0, WIN.y0], [WIN.x1, WIN.y0], [WIN.x1, WIN.y1], [WIN.x0, WIN.y1]], '#2d3c6b', { shade: false, lw: 5 });
  p.part(ellipsePts(WIN.x1 - 70, WIN.y0 + 70, 40, 40, 30), '#f6efc8', { shade: false, lw: 3 });
  p.line([[(WIN.x0 + WIN.x1) / 2, WIN.y0], [(WIN.x0 + WIN.x1) / 2, WIN.y1]], 5);
  p.part([[WIN.x0 - 30, WIN.y1], [WIN.x1 + 30, WIN.y1], [WIN.x1 + 30, WIN.y1 + 26], [WIN.x0 - 30, WIN.y1 + 26]], '#efe7d6', { shade: false, lw: 4 });
  const b = spen(t, 21);
  b.part(roundPoly([[330, 800], [750, 800], [750, 1110], [330, 1110]], 40), '#9a6b4a', { shade: 0.15 });
  b.part([[300, 1060], [780, 1060], [840, 1330], [240, 1330]], '#f4f1ea', { shade: 0.08 });
  b.part(roundPoly([[240, 1330], [840, 1330], [840, 1420], [240, 1420]], 8), '#9a6b4a', { shade: 0.15 });
  b.part(roundPoly([[405, 900], [675, 900], [685, 1075], [395, 1075]], 34), '#ffffff', { shade: 0.12 });
  const n = spen(t, 25);
  n.part(roundPoly([[70, 1090], [255, 1090], [255, 1400], [70, 1400]], 6), '#b98a5e', { shade: 0.15 });
  n.part(roundPoly([[88, 1000], [238, 1000], [238, 1090], [88, 1090]], 10), '#2f2b36', { shade: false });
  ctx.save(); ctx.font = '600 54px Fredoka'; ctx.fillStyle = '#ff5a4a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('1:00', 163, 1046); ctx.restore();
}
function blanket(t, top, wiggle) {
  const p = spen(t, 33), pts = [];
  for (let x = 318; x <= 762; x += 37) pts.push([x, top + Math.sin(x * 0.03 + wiggle) * 6]);
  p.part([[300, top], ...pts, [780, top], [846, 1338], [234, 1338]], '#7fa7c9', { shade: 0.15 });
  p.part(roundPoly([[234, 1338], [846, 1338], [846, 1425], [234, 1425]], 10), '#6d95b8', { shade: false });
  for (const fx of [470, 610]) p.part(ellipsePts(fx, 1300 - Math.max(0, Math.sin(wiggle * 2 + fx)) * 10, 48, 26, 20), '#86aed0', { shade: 0.1, lw: 3 });
}

function steve(t) {
  const tq = onTwos(t), base = track(STEVE, tq);
  const L = LINES[0], talk = speech(WORDS[L.id], L.t, tq, L.text);
  const pose = sum(base, idle(tq, 1), talk);
  const m = steveMouth(t); if (m) pose.mouth = m;
  if ((t + 0.7) % 4.2 < 0.17 && pose.expr !== 'happy') pose.eyes = 'closed';
  const x = 540, y = 1410;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1140); ctx.clip();
  drawCharacter(ctx, 'steve', x, y, K, pose, { frame: frameOf(t) });
  ctx.restore();
  blanket(t, 1140, 0);
}
function cat(t) {
  const tq = onTwos(t), base = track(CAT, tq), pose = sum(base, idle(tq, 4));
  const x = (WIN.x0 + WIN.x1) / 2, y = WIN.y1 + 26;
  drawCharacter(ctx, 'snuggles', x, y, 4.2, pose, { frame: frameOf(t) });
}

function captions(t) {
  const c = wordChunk(LINES, WORDS, t); if (!c) return null;
  const age = t - c.start, s = age < 0.12 ? 0.85 + age * 1.6 : 1;   // each chunk pops in
  ctx.save(); ctx.translate(540, 1480); ctx.scale(s, s);
  ctx.font = '600 84px Fredoka'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const parts = c.words.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), gap = 22;
  let x = -(parts.reduce((a, p) => a + p.wd, 0) + gap * (parts.length - 1)) / 2;
  for (const p of parts) {
    ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(p.w, x, 0);
    ctx.fillStyle = p.stress ? '#ffd84a' : '#ffffff'; ctx.fillText(p.w, x, 0); x += p.wd + gap;
  }
  ctx.restore();
  return { id: c.id, text: c.words.map(w => w.w).join(' '), x0: 80, y0: 1420, x1: 1000, y1: 1540 };
}

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  paper(ctx, W, H, 11);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = '600 52px Fredoka';
  ctx.fillText('POV: you get an', 540, 72); ctx.fillText('extra hour of sleep', 540, 132); ctx.textAlign = 'start';
  const z = 1.15 + 0.12 * ease.inOut(Math.min(1, t / DUR)), fx = 560 - 30 * ease.inOut(Math.min(1, t / DUR)), fy = 960;   // one slow push-in, nothing else
  ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
  ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-fx, -fy);
  room(t); cat(t); steve(t);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.3; ctx.fillStyle = '#6f7fb4'; ctx.fillRect(-500, -500, 3000, 3000); ctx.restore();
  ctx.restore();
  panel(ctx, PX, PY, PW, PH, 5, null, frameOf(t));
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
