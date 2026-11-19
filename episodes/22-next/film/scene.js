// UNIT 4B · 22 "Perfect" (Tập 13) — FULL FILM, 28 s. Worlds = the approved key stills (bath.js, lifted from stills.js) + animation.
// Timings: voice/film_timeline.json (retime.py). Flush 1 at 20.0, punch hard cut at 22.0, flush 2 at 24.2. Shots are listed in build().
import { paper, panel, nameTab } from './lib/cast_stick.js';
import { roundPoly, ellipsePts } from './lib/cast_v2.js';
import { onTwos, boilFrame, ease } from './lib/motion.js';
import { W, H, ctx, INK, spen, text, title, glowBlob, wall, cloud, snowflake, dial, icicle, pointingHand, pinchHand, armTube, SK, steve, headCircle, cap,
  snuggles, showerHead, screen, toilet, pipeAndSign, duck, halo, hash } from './bath.js';

const PL_Y = 1640, XS = 440, YS = 1760;   // caption plate top; Steve's room position (head centre y = 800)
let TL = null, DUR = 28, LN = {};
const lerp = (a, b, k) => a + (b - a) * k;
const clamp01 = k => Math.max(0, Math.min(1, k)), seg = (t, a, b) => clamp01((t - a) / (b - a));
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
function cam(zoom, fx, fy, fn, rot = 0, dx = 0, dy = 0) { ctx.save(); ctx.translate(540 + dx, 960 + dy); if (rot) ctx.rotate(rot); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const talking = (id, t) => { const l = LN[id]; return !!l && t >= l.start && t <= l.end; };
const chat = (t, hz = 10) => Math.floor(t * hz) % 2 === 0;
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, k) => '#' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], clamp01(k))).toString(16).padStart(2, '0')).join('');
const tintAll = (rgba) => { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba; ctx.fillRect(-2400, -2400, 6400, 6800); ctx.restore(); };
const bell = (t, a, b) => Math.sin(Math.PI * seg(t, a, b));   // 0 → 1 → 0

// ---------- captions (bottom plate; never over the faces; none during the punch and the button) ----------
function plate(spk, lines, stress = []) {
  ctx.save(); ctx.fillStyle = 'rgb(30,24,40)'; ctx.beginPath(); ctx.roundRect(40, PL_Y, 1000, 240, 36); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  if (spk) nameTab(ctx, 70, PL_Y - 30, spk, 34);
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
const CAPS = {   // id: [speaker tab, lines, stress, hold after voice end]
  s1: ['steve', ['Okay. Just a', 'LITTLE warmer.'], ['LITTLE'], 0.2], s2: ['snuggles', ['Two settings.', 'ICE… and lava.'], ['ICE'], 0.25],
  s3: ['steve', ['That’s LAVA.'], ['LAVA'], 0.2], s4: ['steve', ['…And that’s', 'the ARCTIC.'], ['ARCTIC'], 0.25],
  s5: ['steve', ['Just. One. HAIR.'], ['HAIR'], 0.2], s5b: ['steve', ['Easy… easy…'], ['easy'], 0.3],
  s6: ['steve', ['Ohhh… PERFECT.'], ['PERFECT'], 0.3], s7: ['snuggles', ['Nobody MOVE.'], ['MOVE'], 0.3],
};
function captions(t) {
  for (const l of TL.lines) {
    const c = CAPS[l.id]; if (!c) continue;
    if (t >= l.start - 0.03 && t <= l.end + c[3]) { plate(c[0], c[1], c[2]); return { id: l.id, text: c[1].join(' '), x0: 40, y0: PL_Y, x1: 1040, y1: PL_Y + 240 }; }
  }
  return null;
}

// ---------- small shared pieces ----------
function drop(x, y, r = 11, col = '#bfe6ff') {
  ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y - r * 2); ctx.quadraticCurveTo(x + r * 1.1, y - r * 0.3, x + r, y + r * 0.2); ctx.arc(x, y + r * 0.2, r, 0, Math.PI); ctx.quadraticCurveTo(x - r * 1.1, y - r * 0.3, x, y - r * 2); ctx.fill(); ctx.stroke(); ctx.restore();
}
function steamField(t, n, x0, x1, y0, a, rise = 420, sp = 0.35, seed = 0) {   // clouds that drift up and fade
  for (let i = 0; i < n; i++) {
    const ph = (t * sp + hash(i + seed)) % 1, x = x0 + (x1 - x0) * hash(i * 3 + 1 + seed) + 22 * Math.sin(t * 3 + i), y = y0 - rise * ph, r = 30 + 26 * hash(i * 5 + seed) + 20 * ph;
    cloud(x, y, r, a * Math.sin(Math.PI * ph), 1);
  }
}
function showerWater(t, col, amt = 1, width = 7) {   // falling dashed streaks from the shower head, scrolling
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = width; ctx.globalAlpha = clamp01(amt);
  for (let i = 0; i < 17; i++) {
    const k = i - 8, x0 = 440 + k * 12, x1 = 440 + k * 46; ctx.setLineDash([60, 44 + (i % 3) * 8]); ctx.lineDashOffset = -(t * 1300 + i * 41);
    ctx.beginPath(); ctx.moveTo(x0, 260); ctx.lineTo(x1, 1120); ctx.stroke();
  }
  ctx.restore();
}
function iceBlock(x0, y0, x1, y1, p, t, alpha = 1) {   // translucent ice creeping down from the top; red inside shows through
  if (p <= 0 || alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; const hh = (y1 - y0) * clamp01(p);
  ctx.beginPath(); ctx.rect(x0 - 40, y0 - 60, x1 - x0 + 80, hh + 60); ctx.clip();
  const sh = roundPoly([[x0 + 40, y0], [x1 - 40, y0], [x1, y0 + 50], [x1 + 10, y1], [x0 - 10, y1], [x0, y0 + 50]], 26, 4);
  ctx.beginPath(); sh.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath();
  const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, 'rgba(225,248,255,0.78)'); g.addColorStop(0.5, 'rgba(160,215,245,0.6)'); g.addColorStop(1, 'rgba(205,240,255,0.7)'); ctx.fillStyle = g; ctx.fill();
  ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.stroke();
  const pn = spen(t, 120, 4);
  for (const [a, b, c, d] of [[x0 + 90, y0 + 30, x0 + 150, y0 + 150], [x1 - 90, y0 + 40, x1 - 150, y0 + 190], [x0 + 60, y0 + 250, x0 + 170, y0 + 330], [x1 - 60, y0 + 300, x1 - 170, y0 + 380], [x0 + 200, y0 + 420, x0 + 260, y0 + 520]])
    pn.line([[a, b], [(a + c) / 2 + 14, (b + d) / 2 - 10], [c, d]], 5, 'rgba(255,255,255,0.85)');
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (const [dx, dy, r] of [[0.16, 0.08, 14], [0.2, 0.2, 9], [0.82, 0.16, 12], [0.78, 0.5, 9], [0.22, 0.62, 10]]) { ctx.beginPath(); ctx.arc(x0 + dx * (x1 - x0), y0 + dy * (y1 - y0), r, 0, 7); ctx.fill(); }
  ctx.restore();
  if (p > 0.15 && p < 1) { ctx.save(); ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { const ex = x0 + 40 + (x1 - x0 - 80) * hash(i * 7), ey = y0 + hh + 6; ctx.beginPath(); ctx.moveTo(ex - 14, ey); ctx.lineTo(ex, ey + 20 + 14 * hash(i)); ctx.lineTo(ex + 14, ey); ctx.closePath(); ctx.fill(); ctx.stroke(); } ctx.restore(); }
}

// =====================================================================================
// WORLD A · the HOOK (frame 1 of the loop): the giant ICE/LAVA dial, Steve's two-tone face above it.
// o: ang (pointer), shiver (px), mouth, ice (0..1 alpha), shards (t since ice shattered or -1)
// =====================================================================================
function hookWorld(t, o = {}) {
  ctx.save(); ctx.translate(540, 960); ctx.scale(1.3, 1.3); ctx.translate(-540, -960); wall(t, 1920, 3000); ctx.restore();   // oversize wall so the loop push-in has margin
  ctx.fillStyle = 'rgba(120,190,255,0.16)'; ctx.fillRect(-300, -300, 840 + 300, 2600); ctx.fillStyle = 'rgba(255,110,60,0.14)'; ctx.fillRect(540, -300, 840, 2600);
  const s = 14, X = 540, hcY = 560, Y = hcY + 80 * s, sh = o.shiver ?? 0, dy = o.dy ?? 0;
  ctx.save(); ctx.translate(sh, dy);
  const body = steve(X, Y, s, { eyes: 'dot', lid: 0.15, brow: 'worried', mouth: o.mouth ?? 'teeth', look: 0.2, fx: [], arm: 'down' }, SK.n);
  const [hx, hy, hr] = headCircle(X, Y, s);
  const tint = (shape) => { ctx.save(); shape(); ctx.clip(); ctx.fillStyle = 'rgba(70,150,255,0.5)'; ctx.fillRect(-sh, -dy, 540 + sh, H); ctx.fillStyle = 'rgba(255,50,30,0.46)'; ctx.fillRect(540, -dy, 540, H); ctx.restore(); };
  tint(() => { ctx.beginPath(); ctx.arc(hx, hy, hr - 3, 0, 7); });
  tint(() => { ctx.beginPath(); body.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); });
  cap(X, Y, s);
  { const np = spen(t, 19, 5); const nose = ellipsePts(538, 578, 16, 12, 20); ctx.fillStyle = '#d99a8a'; ctx.beginPath(); nose.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); np.outline(nose, true, 5); }
  icicle(530, 588, 30, 24);
  const dq = (t % 0.7) / 0.7; if (dq > 0.3) drop(530, 620 + 120 * (dq - 0.3) * (dq - 0.3) * 6, 8);   // icicle drip
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (const [ddx, ddy, r] of [[-120, 40, 9], [-90, 90, 7], [-150, 90, 6], [-60, -40, 5]]) { ctx.beginPath(); ctx.arc(hx + ddx, hy + ddy, r, 0, 7); ctx.fill(); }
  for (let i = 0; i < 3; i++) { const ph = (t * 0.9 + i / 3) % 1; cloud(838 + 14 * Math.sin(t * 5 + i), 600 - 300 * ph + i * 20, 36 + 18 * ph, 0.95 * Math.sin(Math.PI * Math.min(1, ph * 1.15)), 1); }   // steam puffs
  { const p = spen(t, 95, 7), j = Math.sin(t * 45) * 7; for (const d of [-60, 0, 60]) { p.line([[300 + j, hy + d], [270 + j, hy + d - 14], [296 + j, hy + d - 28]], 7, '#2d6fd0'); p.line([[240 - j, hy + d + 30], [216 - j, hy + d + 16], [238 - j, hy + d + 4]], 7, '#2d6fd0'); } }
  ctx.restore();
  armTube([[388 + sh, 868], [320, 940], [352, 1010]], 56, SK.n, 33);
  dial(540, 1450, 520, o.ang ?? 0, { seed: 3 });
  armTube([[696 + sh, 872], [770, 930], [720, 950]], 56, SK.n, 34);
  pointingHand(668, 950, 556 + Math.sin(t * 40) * 3, 985, SK.n, 1.05);
  // the frozen block (loop end): ice over head + shoulders
  if (o.ice) iceBlock(290, 330, 790, 930, 1, t, o.ice);
  if (o.shards >= 0) { ctx.save(); ctx.fillStyle = 'rgba(225,248,255,0.95)'; ctx.strokeStyle = INK; ctx.lineWidth = 4; for (let i = 0; i < 14; i++) { const x = 300 + 480 * hash(i * 3), y = 400 + 480 * hash(i * 5) + 2200 * o.shards * o.shards * (0.7 + hash(i)), r = 16 + 14 * hash(i * 9);
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.shards * 6 * (hash(i) - 0.5)); ctx.beginPath(); ctx.moveTo(-r, r); ctx.lineTo(0, -r * 1.2); ctx.lineTo(r, r * 0.8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); } ctx.restore(); }
}

// =====================================================================================
// WORLD B · the bathroom (stills 2 + 3). One continuous state function; shots are just cameras.
// =====================================================================================
function pose(t) {   // Steve's face by time → [steve pose, skin colour, extra info]
  let p = { eyes: 'dot', lid: 0.15, brow: 'worried', mouth: 'line', look: 0.2, fx: [] }, skin = SK.n;
  if (t < 5.6) { p.mouth = chat(t, t < 2.5 ? 10 : 6) ? 'teeth' : 'line'; p.look = t > 2.5 ? -0.6 : 0.2; }
  else if (t < 7.6) { p = { eyes: 'dot', lid: 0.3, brow: 'worried', mouth: talking('s3', t) ? (chat(t, 9) ? 'strain' : 'small') : 'strain', look: 0, fx: ['sweat'] }; skin = mix(SK.n, '#f06a4a', 0.55 * seg(t, 5.6, 5.8)); }
  else if (t < 9.5) { p = { eyes: 'dot', lid: 0.5, brow: 'worried', mouth: talking('s4', t) ? (chat(t, 9) ? 'small' : 'line') : (chat(t, 16) ? 'teeth' : 'line'), look: 0, fx: [] }; skin = mix(SK.n, '#8fb8e8', 0.6 * seg(t, 7.6, 7.9)); }
  else if (t < 14.7) { p = { eyes: 'dot', lid: t < 12.3 ? 0.1 : 0.0, brow: undefined, mouth: (talking('s5', t) || talking('s5b', t)) ? (chat(t, 7) ? 'small' : 'line') : 'line', look: -0.9, fx: [] }; }
  else if (t < 20.0) { p = { eyes: 'happy', brow: undefined, mouth: talking('s6', t) ? (chat(t, 7) ? 'smile' : 'small') : 'smile', look: 0, fx: ['blush'] }; }
  else if (t < 22.0) { p = { eyes: t < 20.06 ? 'happy' : 'wide', lid: 0, brow: 'raised', mouth: 'smile', look: 0, fx: [] }; }
  else { const blink = (t > 23.05 && t < 23.2); p = { eyes: blink ? 'closed' : 'pinpoint', brow: undefined, mouth: 'line', look: t > 23.5 ? -0.6 : 0, fx: [] }; skin = SK.hot; }
  return [p, skin];
}
const angAt = t => {
  if (t < 5.6) return 0.0;
  if (t < 7.2) return lerp(0, 1.0, eb(seg(t, 5.6, 5.8)));
  if (t < 7.75) return lerp(1.0, 0.1, eio(seg(t, 7.2, 7.75)));
  if (t < 9.9) return lerp(0.1, -1.0, eb(seg(t, 7.75, 7.95)));
  if (t < 12.3) return lerp(-1.0, -0.3, eio(seg(t, 9.9, 11.2))) + (t > 11.2 ? lerp(0, 0.18, eio(seg(t, 11.2, 12.3))) : 0);   // lands near -0.12
  if (t < 14.6) { const q = Math.floor(seg(t, 12.45, 14.4) * 6) / 6; return lerp(-0.12, 0, q); }   // creeps a hair on ones
  if (t < 22.0) return 0;
  if (t < 24.4) return 1.0 + 0.012 * Math.sin(t * 30);
  return lerp(1.0, -1.0, eb(seg(t, 24.4, 24.52)));
};

function room(t, o = {}) {
  const [p, skin] = pose(t), melt = t >= 22.0, hot = melt && t < 24.4, gold = t >= 14.9 && t < 22.0;
  const phase = t < 5.6 ? 'cold' : t < 7.6 ? 'lava' : t < 9.5 ? 'arctic' : t < 14.9 ? 'calm' : t < 20.0 ? 'gold' : t < 22.0 ? 'flush' : t < 24.4 ? 'punch' : 'ice';
  wall(t, 1700, 1700);
  ctx.save(); ctx.beginPath(); ctx.rect(1100, 0, 1400, 2000); ctx.clip(); ctx.translate(1080, 0); wall(t, 1700, 1700); ctx.restore();   // wall continues past the frame (close shots on the right)
  for (const dx of [0, 1080]) { ctx.save(); ctx.beginPath(); ctx.rect(0, -1800, 2500, 1800); ctx.clip(); ctx.translate(dx, -1800); wall(t, 1700, H); ctx.restore(); }   // wall continues above the frame (pipe shot)
  { const p = spen(t, 81, 6); p.part([[1080, 354], [2400, 354], [2400, 426], [1080, 426]], '#b8764a', { shade: 0.22, lw: 7 }); }
  showerHead(t, 440, 215);
  // pipe: ticks (4.3), rattles (17.9→20), jumps on both flushes; the NEXT DOOR sign swings with it
  const pk = (t > 4.28 && t < 4.5 ? 4 * Math.sin((t - 4.28) * 90) : 0) + (t > 17.95 && t < 20 ? (1.5 + 3.5 * seg(t, 17.95, 20)) * Math.sin(t * 60) : 0) +
    (t >= 20 && t < 21.4 ? 20 * Math.exp(-(t - 20) * 3) * Math.sin(t * 55) : 0) + (t >= 24.2 && t < 25.4 ? 18 * Math.exp(-(t - 24.2) * 3) * Math.sin(t * 55) : 0);
  ctx.save(); ctx.translate(Math.abs(pk) * 0.2, pk); ctx.translate(700, 390); ctx.rotate(pk * 0.0035); ctx.translate(-700, -390); pipeAndSign(t, 700, 390); ctx.restore();
  // water
  if (t < 14.9 || t >= 14.9) {
    const col = phase === 'lava' ? 'rgba(255,205,190,0.85)' : phase === 'arctic' ? 'rgba(190,225,255,0.9)' : gold ? 'rgba(255,240,190,0.85)' : phase === 'punch' ? 'rgba(255,200,190,0.75)' : phase === 'ice' ? 'rgba(200,235,255,0.9)' : 'rgba(190,225,245,0.8)';
    showerWater(t, col, phase === 'lava' ? 1 : 0.9, phase === 'lava' ? 12 : 7);
  }
  // dial on the wall + the arm that works it
  const ang = angAt(t); dial(140, 880, 150, ang, { words: false, seed: 4 });
  const tip = [140 + 123 * Math.sin(ang), 880 - 123 * Math.cos(ang)];
  const working = t < 14.75 || (t >= 22 && t < 24.4);
  // modesty: shower screen covers the chest down (drawn below); sway pivot for the bliss beat
  const sway = gold && t < 20 ? 0.035 * Math.sin(t * 3.2) : 0;
  ctx.save(); ctx.translate(XS, 1300); ctx.rotate(sway); ctx.translate(-XS, -1300);
  if (working) {
    const hs = melt ? 0 : 0;
    armTube([[290, 1060], [240, 1000], [214 + hs, 940]], melt ? 44 : 40, skin, 35);
    if (melt || (t > 10.3 && t < 14.75)) pinchHand(250, 950, tip[0] + 2, tip[1] + 4, skin); else pointingHand(228, 940, tip[0] + 8, tip[1] + 6, skin, 1.0);
    armTube([[590, 1060], [640, 1100], [660, 1150]], 40, skin, 36);
  } else if (gold) {
    const sw = 14 * Math.sin(t * 3.2);
    armTube([[290, 1060], [200, 1085 + sw * 0.4], [120, 1140 + sw]], 40, skin, 35); armTube([[590, 1060], [680, 1085 - sw * 0.4], [760, 1140 - sw]], 40, skin, 36);
  } else {
    armTube([[290, 1060], [260, 1100], [250, 1150]], 40, skin, 35); armTube([[590, 1060], [620, 1100], [630, 1150]], 40, skin, 36);
  }
  const shiver = (phase === 'cold' || phase === 'arctic') ? (phase === 'arctic' && t > 8.0 ? 5 : 3) * Math.sin(t * 58) : (phase === 'lava' && t < 6.3 ? 5 * Math.sin(t * 50) : 0);
  const hdy = (phase === 'punch' ? 0.35 * Math.sin(t * 7) : 0);
  ctx.save(); ctx.translate(shiver, 0);
  steve(XS, YS, 12, { ...p, headDy: hdy, tilt: (phase === 'flush' ? 0 : gold ? 2.5 * Math.sin(t * 3.2) : phase === 'punch' ? 1.2 * Math.sin(t * 5) : 0) }, skin, melt);
  // the cap: balloons on the lava blast, melts at the punch
  const bal = phase === 'lava' ? bell(t, 5.6, 7.4) * 1 : 0;
  ctx.save(); if (bal) { ctx.translate(XS, 830); ctx.scale(1 + 0.12 * bal, 1 + 0.32 * bal); ctx.translate(-XS, -830); }
  cap(XS, YS, 12, melt); ctx.restore();
  // face extras
  if (phase === 'cold' || phase === 'arctic') {
    const g = phase === 'arctic' ? seg(t, 7.7, 8.4) : (t < 2.5 ? 0.6 : 0.4);
    const np = spen(t, 19, 5), nose = ellipsePts(440, 826, 15, 11, 16); void np;
    const nk = phase === 'arctic' ? eb(seg(t, 7.9, 8.07)) : g; icicle(432, 836, 14 + 56 * nk, 18); icicle(468, 836, 10 + 30 * nk, 14);
    if (phase === 'arctic') {
      icicle(372, 748, 78 * eb(seg(t, 8.1, 8.25)), 20); icicle(400, 748, 52 * eb(seg(t, 8.12, 8.27)), 15); icicle(508, 748, 86 * eb(seg(t, 8.3, 8.45)), 20); icicle(480, 748, 54 * eb(seg(t, 8.32, 8.47)), 15);   // eyebrows
      const sd = eb(seg(t, 8.5, 8.7)); ctx.save(); ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(440, 572, 120 * sd, 46 * sd, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      const sf = seg(t, 8.3, 8.9); if (sf > 0 && sf < 1) snowflake(448, 700 + 110 * sf, 22, 4);
      if (t > 8.8) snowflake(448, 812, 20, 4);
    }
    void nose;
  }
  if (phase === 'lava') { const a = 0.95 * Math.min(1, seg(t, 5.6, 5.9)); steamField(t, 4, 110, 270, 900, a, 520, 0.9, 3); steamField(t, 4, 610, 780, 900, a, 520, 0.9, 7); }
  ctx.restore();   // shiver
  // loupe (a jeweller's loupe in his right eye) + tweezers
  if (t > 9.6 && t < 14.7) {
    const k = eb(seg(t, 9.6, 9.85)), ex = 510, ey = 790 + (p.lid > 0 ? 0 : 0);
    ctx.save(); ctx.translate(ex, ey); ctx.scale(k, k);
    ctx.strokeStyle = INK; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(40, 52); ctx.lineTo(96, 120); ctx.stroke(); ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = 'rgba(210,240,255,0.5)'; ctx.beginPath(); ctx.arc(0, 0, 66, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.clip(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 44, 0, 7); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-14 + 4 * Math.sin(t * 6), 0, 20, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = '#6d6a7c'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 66, 0, 7); ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 72, 0, 7); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 0, 50, 3.6, 4.4); ctx.stroke(); ctx.restore();
  }
  if (t > 10.2 && t < 14.7) {   // tweezers pinching the pointer tip
    const kk = eb(seg(t, 10.2, 10.45)); ctx.save(); ctx.strokeStyle = INK; ctx.lineCap = 'round';
    for (const [dx, dy2, w] of [[96, 118, 10], [124, 98, 10]]) { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(tip[0] + dx * kk + 20, tip[1] + dy2 * kk + 10); ctx.lineTo(tip[0] + 3, tip[1] + 3); ctx.stroke(); }
    ctx.strokeStyle = '#c9ced9'; for (const [dx, dy2] of [[96, 118], [124, 98]]) { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(tip[0] + dx * kk + 20, tip[1] + dy2 * kk + 10); ctx.lineTo(tip[0] + 3, tip[1] + 3); ctx.stroke(); } ctx.restore();
  }
  // temple drop (5b), sweat beads
  if (t > 12.7 && t < 14.6) { const q = ((t - 12.7) % 1.1) / 1.1; drop(496, 740 + 150 * q * q, 9); }
  // bliss: halo, clouds, duck
  if (gold) {
    ctx.save(); ctx.translate(0, 0);
    const hk = eb(seg(t, 15.4, 15.9)) * (t < 20 ? 1 : 0); if (hk > 0) halo(440 + sway * 40, 540 + 6 * Math.sin(t * 4), 150 * hk, 36 * hk);
    cloud(280, 450 - 8 * Math.sin(t * 2), 34, 0.9); cloud(610, 470 + 8 * Math.sin(t * 2.4), 26, 0.85); cloud(440, 370, 24, 0.8);
    ctx.restore();
  }
  ctx.restore();   // sway
  // duck: floats up at 15.0, squeaks at 15.9, jolts on the flush, deflates at the punch
  if (t >= 15.0 && t < 22.0) {
    const rise = eo(seg(t, 15.0, 15.8)), sq = t > 15.9 && t < 16.1 ? 1 + 0.18 * Math.sin((t - 15.9) * 31) : 1;
    ctx.save(); ctx.translate(705, lerp(1140, 955, rise) + (1100 - 955) * eio(seg(t, 17.0, 18.9)) * (t >= 17.0 ? 1 : 0) + 8 * Math.sin(t * 3.5) * (1 - seg(t, 17.0, 18.9))); ctx.scale(sq, 1 / sq); duck(0, 0, 0.9, false, -0.18 + 0.06 * Math.sin(t * 3)); ctx.restore();
  } else if (t >= 22) { const sag = seg(t, 22, 24.2); duck(705, 1088 + 10 * sag, 0.9, true, 0.1 + 0.12 * sag + 0.02 * Math.sin(t * 9)); }
  screen(t, 20, 1120, 770, 1700);
  toilet(t, 790, 1070, 1390, 1700);
  // Snuggles
  const sx = 925, sy = 1385; let sp = { eyes: 'dot', lid: 0.15, look: -0.9, mouth: 'line', tilt: -9, tail: 0.5 * Math.sin(t * 3) }, flat = false, snx = 0;
  if (t >= 2.5 && t < 5.3) {
    const fl = (a) => Math.sin(Math.PI * seg(t, a, a + 0.3)) * Math.sin((t - a) * 26);   // quick tail flick
    sp.tail = 0.25 * Math.sin(t * 3) + 1.5 * fl(2.8) + 1.5 * fl(3.55);
    const turn = eio(seg(t, 3.0, 3.6)) - eio(seg(t, 4.3, 4.8));   // small head turn toward the shower, then back
    sp.tilt = -9 - 7 * turn + 1.5 * Math.sin(t * 4); sp.look = -0.9 - 0.1 * turn;
    const bl = Math.sin(Math.PI * seg(t, 3.15, 3.85)); sp.lid = 0.15 + 0.8 * Math.pow(bl, 0.7); }
  if (t >= 13.4 && t < 14.9) { sp = { eyes: 'wide', lid: 0, look: -0.9, mouth: 'line', tilt: -9 - 6 * eo(seg(t, 13.4, 13.9)), tail: 0.2 + 0.4 * Math.sin(t * 9) }; snx = -22 * eo(seg(t, 13.4, 13.9)); }
  if (t >= 17.87 && t < 22.0) { flat = true; sp = { eyes: 'wide', lid: 0, look: -0.9, mouth: 'line', tilt: -4, tail: 0.15 * Math.sin(t * 30) }; }
  if (t >= 22) { flat = true; sp = { eyes: 'pinpoint', lid: 0, look: -0.9, mouth: 'line', tail: 0.2 + 0.15 * Math.sin(t * 14), tilt: t > 23.2 ? -3 : 0 }; }
  const hideSn = (t >= 1.0 && t < 2.5) || (t >= 4.0 && t < 5.5) || (t >= 17.0 && t < 19.0) || (t >= 7.7 && t < 10.8) || (t >= 20.0 && t < 22.0) || (t >= 25.0 && t < 26.0);   // out of shot where the camera would cut him in half
  if (!hideSn) snuggles(sx + snx, sy, 7.6, sp, flat);
  // paw tap on the ice
  if (t >= 25.9) { const tp = seg(t, 25.9, 26.25), hit = t > 26.2 ? Math.exp(-(t - 26.2) * 12) : 0, ext = tp < 1 ? eio(tp) : 1;
    const tipx = lerp(800, 650, ext) - 18 * hit, tipy = lerp(1270, 1120, ext); ctx.save(); const pw = spen(t, 130, 5); pw.tube([[870, 1330], [lerp(840, 740, ext), lerp(1300, 1190, ext)], [tipx, tipy]], 34, '#6a6c80');
    ctx.fillStyle = '#6a6c80'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(tipx - 4, tipy - 2, 24, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
  // light / mood
  if (phase === 'cold') tintAll('rgba(170,200,255,0.9)');
  if (phase === 'lava') { tintAll(`rgba(255,${Math.round(lerp(255, 190, seg(t, 5.6, 5.9)))},${Math.round(lerp(255, 170, seg(t, 5.6, 5.9)))},1)`); }
  if (phase === 'arctic') tintAll('rgba(170,205,255,1)');
  if (gold) {
    const g = seg(t, 14.9, 15.4) * (t > 20 ? 1 - seg(t, 20.0, 22.0) : 1); ctx.save(); ctx.globalAlpha = g; tintAll('rgba(255,210,130,0.37)'); glowBlob(440, 760, 760, 'rgba(255,214,120,0.37)');
    ctx.globalCompositeOperation = 'screen'; ctx.translate(440, 215); for (let i = 0; i < 14; i++) { ctx.rotate(Math.PI * 2 / 14 + (i === 0 ? t * 0.02 : 0)); ctx.fillStyle = 'rgba(255,236,170,0.12)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1500, -80); ctx.lineTo(1500, 80); ctx.closePath(); ctx.fill(); } ctx.restore();
  }
  if (t >= 20 && t < 22) { const k = seg(t, 20.8, 22); if (k > 0) { steamField(t, 3, 110, 270, 1000, 0.8 * k, 460, 0.8, 5); steamField(t, 3, 610, 780, 1000, 0.8 * k, 460, 0.8, 9); } }
  if (phase === 'punch') {
    tintAll('rgba(255,170,150,0.23)'); glowBlob(440, 800, 700, 'rgba(255,120,80,0.19)');
    ctx.save(); ctx.fillStyle = 'rgba(160,20,20,0.18)'; for (const [dx, dy] of [[-92, 40], [92, 40]]) { ctx.beginPath(); ctx.ellipse(440 + dx, 800 + dy, 52, 30, 0, 0, 7); ctx.fill(); } ctx.restore();
    const k = 0.85; for (const [x, y, r, a] of [[120, 700, 44, 0.75], [800, 700, 44, 0.75]]) cloud(x + 10 * Math.sin(t * 2.5 + x), y - 26 * ((t * 0.9 + hash(x)) % 1) , r, a * k);
    steamField(t, 1, 80, 230, 1100, 0.7, 640, 0.7, 11); steamField(t, 1, 650, 800, 1100, 0.7, 640, 0.7, 15);
    for (const [x, y, r, a] of [[330, 1090, 50, 0.9], [560, 1100, 56, 0.9], [440, 1060, 44, 0.8]]) cloud(x, y + 8 * Math.sin(t * 4 + x), r, a);
  }
  if (phase === 'ice') {
    const ip = seg(t, 24.5, 25.9); tintAll('rgba(200,220,255,0.35)');
    if (t < 25.0) { steamField(t, 3, 100, 270, 1100, 0.7 * (1 - seg(t, 24.4, 25.0)), 500, 0.7, 11); steamField(t, 3, 610, 790, 1100, 0.7 * (1 - seg(t, 24.4, 25.0)), 500, 0.7, 15); }
    iceBlock(250, 520, 650, 1126, ip, t);
    if (ip > 0 && ip < 1) { ctx.save(); ctx.fillStyle = '#fff'; for (let i = 0; i < 10; i++) { const x = 250 + 400 * hash(i + 3 + Math.floor(t * 10)), y = 520 + 600 * hash(i * 2 + Math.floor(t * 10)); ctx.beginPath(); ctx.arc(x, y, 5 + 5 * hash(i), 0, 7); ctx.fill(); } ctx.restore(); }
    if (t > 26.2 && t < 26.5) { ctx.save(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 0; i < 6; i++) { const a = -0.9 + i * 0.35, r0 = 40, r1 = 70 + 40 * (t - 26.2) * 6; ctx.beginPath(); ctx.moveTo(646 + Math.cos(a + 3.14) * r0, 1120 + Math.sin(a + 3.14) * r0); ctx.lineTo(646 + Math.cos(a + 3.14) * r1, 1120 + Math.sin(a + 3.14) * r1); ctx.stroke(); } ctx.restore(); }
  }
}

// ---------- the last shot: hook world again; the ice drops off and the pointer snaps back to 0 → frame 1 ----------
function loopEnd(t) {
  const k = seg(t, 26.6, 28.0), z = lerp(0.88, 1.0, eo(k));
  const iceA = 1 - seg(t, 26.9, 27.35), pg = t > 26.9 ? seg(t, 26.9, 27.9) : -1;
  const snap = t > 27.3 ? Math.exp(-(t - 27.3) * 9) * Math.cos((t - 27.3) * 40) * -1.0 : -1.0;   // from ICE back to the line (overshoots, settles at 0 by ~27.8)
  const ang = t > 27.3 ? snap : -1.0;
  const x = ((t - 26.6) < 0.9 ? 0 : 0);
  cam(z, 540, 960, () => hookWorld(t, { ang: Math.abs(ang) < 0.003 || t > 27.9 ? 0 : ang, shiver: t > 27.3 ? 3 * Math.sin(t * 55) : 0, mouth: 'teeth', ice: iceA > 0 ? iceA : 0, shards: pg }));
  void x;
}

// ---------- shot list ----------
let SHOTS = [];
function build() {
  const R = f => t => f(t);
  SHOTS = [
    // 1 · HOOK 0–1.0: frame 1 is the giant dial + two-tone face; teeth chatter, icicle drip, steam puff, shake
    [0, t => { cam(kf(t, [[0, 1.0], [1.0, 1.04]]), 540, 1000, () => hookWorld(t, { ang: 0.012 * Math.sin(t * 30), shiver: 4 * Math.sin(t * 52), mouth: chat(t, 10) ? 'teeth' : 'line' }), 0, ...shake(t, 2.5, 33)); }],
    // 2 · pull back to the whole shower, Steve shivering under the cold stream
    [1.0, t => { cam(kf(t, [[1.0, 1.6], [2.5, 1.04]], eo), 440, kf(t, [[1.0, 840], [2.5, 960]], eo), () => room(t)); }],
    // 3 · Snuggles on the toilet lid, tail flick (s2)
    [2.5, t => { cam(kf(t, [[2.5, 1.85], [4.0, 2.0]]), 945, 1200, () => room(t)); }],
    // 4 · the pipe + NEXT DOOR sign ticks once
    [4.0, t => { cam(kf(t, [[4.0, 1.4], [5.5, 1.5]]), kf(t, [[4.0, 1010], [5.5, 1020]]), 625, () => room(t)); }],
    // 5 · LAVA blast (s3): flat on the tiles, steam burst, cap balloons
    [5.5, t => { cam(kf(t, [[5.5, 1.0], [7.7, 1.06]]), kf(t, [[5.5, 562], [7.7, 596]]), 900, () => room(t), 0, ...shake(t, t < 6.4 ? 7 : 0, 41)); }],
    // 6 · ARCTIC (s4): icicles pop in, snowdrift, snowflake
    [7.7, t => { cam(kf(t, [[7.7, 1.25], [9.5, 1.0]]), 440, 850, () => room(t)); }],
    // 7 · loupe pops into his eye (s5), push to the face
    [9.5, t => { cam(kf(t, [[9.5, 1.0], [10.8, 2.0]]), 450, kf(t, [[9.5, 900], [10.8, 800]]), () => room(t)); }],
    // 8 · macro: tweezers on the pointer, it creeps a hair (s5 + s5b)
    [10.8, t => { cam(kf(t, [[10.8, 2.7], [13.4, 3.5]]), 185, 840, () => room(t)); }],
    // 9 · Snuggles leans in too, eyes wide
    [13.4, t => { cam(kf(t, [[13.4, 1.55], [14.9, 1.9]]), 1020, kf(t, [[13.4, 1235], [14.9, 1215]]), () => room(t)); }],
    // 10 · PEAK (s6): golden light, halo, the duck pops up
    [14.9, t => { cam(kf(t, [[14.9, 1.0], [17.0, 1.06]]), kf(t, [[14.9, 562], [17.0, 596]]), 900, () => room(t)); }],
    // 11 · push-in on the pipe (s7): the rattle shakes the sign
    [17.0, t => { cam(kf(t, [[17.0, 1.4], [19.0, 1.8]]), kf(t, [[17.0, 1010], [19.0, 990]]), kf(t, [[17.0, 625], [19.0, 640]]), () => room(t)); }],
    // 12 · Snuggles' ears go flat
    [19.0, t => { cam(kf(t, [[19.0, 1.5], [20.0, 1.75]]), 990, kf(t, [[19.0, 1255], [20.0, 1235]]), () => room(t)); }],
    // 13 · FLUSH (20.0): eyes snap open, smile frozen, the pipe bounces, camera kick
    [20.0, t => { cam(kf(t, [[20.0, 1.0], [20.12, 1.35], [22.0, 1.5]], eo), 480, 830, () => room(t), 0, ...shake(t, 6 * Math.exp(-(t - 20) * 2), 45)); }],
    // 14 · PUNCH 22.0–24.0: hard cut to red; steam plumes, one blink, duck sags (no caption)
    [22.0, t => { cam(kf(t, [[22.0, 1.0], [24.0, 1.06]], t2 => t2), kf(t, [[22.0, 562], [24.0, 596]], t2 => t2), 850, () => room(t)); }],
    // 15 · second FLUSH: pointer snaps to ICE, the pipe jumps
    [24.0, t => { cam(kf(t, [[24.0, 1.0], [25.0, 1.06]]), kf(t, [[24.0, 562], [25.0, 590]]), 800, () => room(t), 0, ...shake(t, t > 24.2 ? 6 * Math.exp(-(t - 24.2) * 2) : 0, 45)); }],
    // 16 · ice crackles over him until he is a block
    [25.0, t => { cam(kf(t, [[25.0, 1.0], [26.0, 1.5]]), 440, 850, () => room(t)); }],
    // 17 · Snuggles taps the block: tink
    [26.0, t => { cam(kf(t, [[26.0, 1.1], [26.6, 1.3]]), 640, 1120, () => room(t)); }],
    // 18 · LOOP: push-in on the dial/hook; ice falls off; ends on frame 1
    [26.6, t => { loopEnd(t); }],
  ];
}

function render(t) {
  window.T_NOW = t;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1;
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
  ctx.restore();
  if (t < 2.5 || t >= 27.0) title('POV: the shower has 2 settings');
  panel(ctx, 6, 6, W - 12, H - 12, 5, null, boilFrame(t));
  const cap = captions(t); window.__texts = cap ? [cap] : [];
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
