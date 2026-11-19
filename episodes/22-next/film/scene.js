// UNIT 4B · 21 "On Empty" (Tập 12) — FULL FILM. Worlds ported from the approved round-4 stills (common.js) + animation layer.
// Timings: voice/film_timeline.json (retime.py). Shots are listed in build().
import { drawCharacter, paper, panel, nameTab } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { onTwos, boilFrame, ease } from './lib/motion.js';
import { W, H, ctx, INK, ORANGE, SKIN, spen, text, armTo, headOf, title, drop, glowBlob, outline, fist, placeSteve, bodyPt, torsoBase, wetShirt,
  handLocal, helmet, gauge, scooter, pump, forecourt, attendant, nozzle } from './common.js';

const PL_Y = 1640;
let TL = null, DUR = 26.5, LN = {}, EVT = null;
const lerp = (a, b, k) => a + (b - a) * k;
const clamp01 = k => Math.max(0, Math.min(1, k)), seg = (t, a, b) => clamp01((t - a) / (b - a));
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
function cam(zoom, fx, fy, fn, rot = 0, dx = 0, dy = 0) { ctx.save(); ctx.translate(540 + dx, 960 + dy); if (rot) ctx.rotate(rot); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const talking = (id, t) => { const l = LN[id]; return !!l && t >= l.start && t <= l.end; };
const mouthFor = (id, t, open = 'small', shut = 'line') => talking(id, t) ? (Math.floor(t * 9) % 2 ? open : shut) : shut;
function sky(c0, c1) { const g = ctx.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(-1300, -1300, W + 2600, 2200); }
function sweatDrip(t, x, y0, per, off, sz, fall = 240) {   // a drop that swells, then falls and fades
  const q = ((t + off) % per) / per; if (q < 0.25) return; const k = (q - 0.25) / 0.75;
  ctx.save(); ctx.globalAlpha = 1 - 0.8 * k * k; drop(spen(onTwos(t), 31), x, y0 + fall * k * k, sz, 0.1); ctx.restore();
}

// ---------- captions (bottom plate; never over the faces) ----------
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
  s1: ['steve', ['It’s FINE.'], ['FINE'], 0.2], s2: ['snuggles', ['He’s been on E', 'since TUESDAY.'], ['TUESDAY'], 0.25],
  s3: ['steve', ['Too EXPENSIVE.'], ['EXPENSIVE'], 0.2], s4: ['steve', ['Too LONG.'], ['LONG'], 0.25],
  s5: ['steve', ['Downhill… FREE.'], ['FREE'], 0.25], s6: ['steve', ['I MADE IT!'], ['MADE', 'IT'], 0.2],
  s7: [null, ['It’s FULL, sir.'], ['FULL'], 0.3], s8a: ['steve', ['…Since TUESDAY?'], ['TUESDAY'], 0.6],
  s9: ['steve', ['It’s FINE.'], ['FINE'], 0.55],
};
function captions(t) {
  for (const l of TL.lines) {
    const c = CAPS[l.id]; if (!c) continue;
    if (t >= l.start - 0.03 && t <= l.end + c[3]) { plate(c[0], c[1], c[2]); return { id: l.id, text: c[1].join(' '), x0: 40, y0: PL_Y, x1: 1040, y1: PL_Y + 240 }; }
  }
  return null;
}

// =====================================================================================
// WORLD A · dash POV (frame 1 of the loop). Giant gauge, Steve's face above it, road ahead.
// o: needle, nshake, icon (blink), face{}, fistR [x,y], fistL, drips
// =====================================================================================
function dashWorld(t, o = {}) {
  const hz = 760, tt = onTwos(t);
  sky('#f2a96a', '#fbe2b0');
  const p = spen(tt, 3, 5);
  p.part(roundPoly([[-700, hz], [-700, hz - 90], [200, hz - 140], [400, hz - 70], [700, hz - 130], [1800, hz - 90], [1800, hz]], 20), '#b9a28e', { shade: false, lw: 4 });
  p.part([[-700, hz], [1800, hz], [1800, 2600], [-700, 2600]], '#8f8c93', { shade: 0.1, lw: 5 });
  p.part([[-700, 900], [540, hz], [-700, 1400]], '#c9c4b8', { shade: false, lw: 5 });
  p.part([[1800, 900], [540, hz], [1800, 1400]], '#c9c4b8', { shade: false, lw: 5 });
  const sc = (t * 260) % 106;   // lane dashes slide toward the viewer
  ctx.save(); ctx.strokeStyle = '#fff6dc'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.setLineDash([60, 46]); ctx.lineDashOffset = -sc; ctx.beginPath(); ctx.moveTo(540, hz + 10); ctx.lineTo(540, 1000); ctx.stroke(); ctx.restore();
  glowBlob(540, 640, 520, 'rgba(255,230,170,0.5)');
  const s = 13, X = 540, hc0 = 610, Y = hc0 + 80 * s, shY = Y - 60 * s, f = o.face || {};
  const fR = o.fistR || [962, 1010], fL = o.fistL || [118, 1010];
  const hdy = f.headDy || 0, tilt = f.tilt || 0;
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', eyeR: f.eyeR ?? 'squint', lid: f.lid ?? 0.3, brow: f.brow ?? 'raised', mouth: f.mouth ?? 'strain', fx: f.fx ?? ['sweat'], look: f.look ?? 0, hair: 0, bags: 1,
    headDy: hdy, tilt, armL: armTo(X, shY, s, fL[0], fL[1], [0, 5]), armR: armTo(X, shY, s, fR[0], fR[1], [0, 5]) }, { frame: boilFrame(tt) });
  const hc = headOf(X, Y, s);
  helmet([hc[0] + tilt * 0.4, hc[1] - hdy * s], s, tilt * Math.PI / 180);
  for (const d of (o.drips || [])) sweatDrip(t, d[0], d[1], d[2], d[3], d[4], d[5] ?? 240);
  const hp = spen(tt, 8, 6);
  for (const sx of [-1, 1]) { hp.line([[540 + sx * 360, 1010], [540 + sx * 420, 700]], 16, '#2a2230'); hp.part(ellipsePts(540 + sx * 430, 665, 62, 46, 24), '#33333f', { shade: false, lw: 6 }); ctx.fillStyle = 'rgba(190,225,245,0.9)'; ctx.beginPath(); ctx.ellipse(540 + sx * 430, 665, 46, 32, 0, 0, 7); ctx.fill(); }
  hp.line([[60, 1010], [1020, 1010]], 30, '#2a2230');
  hp.part(roundPoly([[110, 2600], [170, 1070], [330, 900], [750, 900], [910, 1070], [970, 2600]], 60), '#6fa7d6', { shade: 0.14, lw: 7 });
  gauge(540, 1185, 345, o.needle ?? 0.012, o.nshake ?? 0.02, o.icon ?? true);
  if (o.key) { ctx.save(); ctx.translate(...o.key); outline(() => { ctx.roundRect(-34, -34, 68, 68, 14); }, '#33333f', 6); outline(() => { ctx.roundRect(-8, -26, 16, 40, 4); }, '#e8c84a', 4); ctx.restore(); }
  fist(fL[0], fL[1], 1.15); fist(fR[0], fR[1], 1.15 * (o.fistK ?? 1));
}
// the pump-icon blink: on, on, off, on ... never off at t = 0 (the loop frame)
const blinkOn = t => ((t * 2.2) % 1) < 0.62;

// =====================================================================================
// WORLD B · side view: sky, hills, road with scrolling lane dashes (the world slides right while the scooter heads left)
// =====================================================================================
function sideBG(t, scroll, hz = 1180) {
  sky('#f2a96a', '#fbe2b0'); const p = spen(onTwos(t), 3, 5);
  for (const [par, base, col] of [[0.12, 170, '#b9a28e'], [0.3, 90, '#a8c4a0']]) {
    const off = (scroll * par) % 1100;
    for (let x0 = -1100 + off; x0 < 1700; x0 += 1100) p.part(roundPoly([[x0, hz], [x0, hz - base * 0.6], [x0 + 260, hz - base], [x0 + 560, hz - base * 0.5], [x0 + 820, hz - base * 1.1], [x0 + 1100, hz - base * 0.6], [x0 + 1100, hz]], 24), col, { shade: false, lw: 4 });
  }
  p.part([[-700, hz], [1800, hz], [1800, 2600], [-700, 2600]], '#8f8c93', { shade: 0.1, lw: 5 });
  p.part([[-700, hz], [1800, hz], [1800, hz + 70], [-700, hz + 70]], '#c9c4b8', { shade: false, lw: 4 });
  ctx.save(); ctx.fillStyle = 'rgba(255,246,220,0.85)'; const off = scroll % 360; for (let x = -720 + off; x < 1800; x += 360) { ctx.beginPath(); ctx.roundRect(x, 1790, 210, 16, 8); ctx.fill(); } ctx.restore();
}
// Steve seated on the scooter (scooter-local coordinates; called through scooter()'s rider hook)
function riderSteve(t, o = {}) {
  const s = 7, X = -10, Y = -126, P = { X, Y, sc: s, th: 0 }, shY = Y - 60 * s, f = o.face || {};
  const legsRide = [[[-3, 38], [-15, 33], [-20, 14], [-13, 13]], [[3, 38], [-7, 34], [-12, 14], [-5, 13]]];
  const legsUp = [[[-3, 38], [-18, 44], [-30, 41]], [[3, 38], [-12, 46], [-25, 46]]];
  const gripA = o.gripA || [-150, -612], gripB = o.gripB || [-132, -630];
  torsoBase(P);
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'dot', eyeR: f.eyeR ?? 'dot', lid: f.lid ?? 0.25, brow: f.brow, mouth: f.mouth ?? 'line', fx: f.fx ?? ['sweat'], look: f.look ?? 0, hair: 0, bags: 1, headDy: f.headDy || 0, tilt: f.tilt || 0,
    noShadow: true, legPts: o.legs === 'up' ? legsUp : legsRide, armL: o.armL || armTo(X, shY, s, gripA[0], gripA[1], [0, 5]), armR: o.armR || armTo(X, shY, s, gripB[0], gripB[1], [0, 5]) }, { frame: boilFrame(onTwos(t)) });
  wetShirt(P, 1);
  const hc = headOf(X, Y, s); helmet([hc[0] + (f.tilt || 0) * 0.5, hc[1] - (f.headDy || 0) * s], s, (f.tilt || 0) * Math.PI / 180);
}
// scooter + rider placed on the road. o.ride: {f(ace), legs, armL, armR}; o.snug; o.spin
function bike(t, x, y, k, o = {}) {
  const bob = o.still ? 0 : 5 * Math.sin(t * 17) * k;
  scooter(onTwos(t), x, y + bob, k, { spin: o.spin ?? 0, snug: o.snug, seat: o.seat, rider: () => riderSteve(t, o.ride || {}) });
}
const SNUG = { eyes: 'wide', lid: 0, mouth: 'line', look: 0.8, tail: 0.5, arm: 'down' };

// ---------- props ----------
function snail(t, x, y, k, o = {}) {   // shell + body + two eyestalks. o.wave: waving a stalk; o.look: eyes turn back
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 7;
  ctx.fillStyle = '#e8b98a'; ctx.beginPath(); ctx.moveTo(-110, 0); ctx.bezierCurveTo(-120, -26, 100, -24, 118, -6); ctx.bezierCurveTo(130, 6, 118, 12, 100, 12); ctx.lineTo(-100, 12); ctx.closePath(); ctx.fill(); ctx.stroke();   // foot/body
  ctx.fillStyle = '#c9772e'; ctx.beginPath(); ctx.arc(-20, -62, 62, 0, 7); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-20, -62, 36, 0.6, 5.2); ctx.stroke(); ctx.beginPath(); ctx.arc(-20, -62, 14, 1.2, 5.8); ctx.stroke();
  const w = o.wave ? 0.75 * Math.sin(t * 10) : 0;
  for (const [sx0, a] of [[92, -0.15], [112, 0.12 + w]]) { ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(sx0, -6); ctx.lineTo(sx0 + 22 * Math.sin(a) + 12, -60 - 14 * Math.cos(a)); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx0 + 22 * Math.sin(a) + 12, -66 - 14 * Math.cos(a), 12, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(sx0 + 22 * Math.sin(a) + 12 + (o.look ? -5 : 3), -66 - 14 * Math.cos(a), 4.5, 0, 7); ctx.fill(); }
  ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(122, -2, 7, 0.2, 2.6); ctx.stroke();   // little smile
  ctx.restore();
}
function miniBike(t, x, y, k, col, look, idx) {   // queue extra: a rider on a scooter, head turns (look -1..1 = pupils) in sync
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 8;
  for (const wx of [-95, 95]) { ctx.fillStyle = '#2a2230'; ctx.beginPath(); ctx.arc(wx, -50, 50, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#d5d9e0'; ctx.beginPath(); ctx.arc(wx, -50, 22, 0, 7); ctx.fill(); }
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-120, -140, 210, 80, 26); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5a3b2e'; ctx.beginPath(); ctx.roundRect(-20, -165, 130, 34, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7e8794'; ctx.beginPath(); ctx.roundRect(-20, -300, 70, 140, 24); ctx.fill(); ctx.stroke();   // torso
  const hy = -355; ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(15, hy, 55, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = ['#d9423e', '#3f5a78', '#e8c84a', '#6aa86a'][idx % 4]; ctx.beginPath(); ctx.arc(15, hy - 8, 58, Math.PI, 0); ctx.fill(); ctx.stroke();
  for (const ex of [-14, 44]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + 4, hy + 6, 15, 0, 7); ctx.fill(); ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + 4 + look * 8, hy + 8, 6, 0, 7); ctx.fill(); }
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, hy + 36); ctx.lineTo(32, hy + 36); ctx.stroke(); ctx.restore();
}
function priceSign(t, x, y, k, digits) {   // tall pole, big board, digits only (no currency)
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); const p = spen(onTwos(t), 21, 6);
  p.part(roundPoly([[-22, 0], [22, 0], [22, -900], [-22, -900]], 6), '#8e929c', { shade: 0.15, lw: 7 });
  p.part(roundPoly([[-280, -1150], [280, -1150], [280, -760], [-280, -760]], 34), '#eef1f5', { shade: 0.1, lw: 8 });
  p.part(roundPoly([[-280, -1150], [280, -1150], [280, -1090], [-280, -1090]], 20), ORANGE, { shade: 0.12, lw: 7 });
  p.part(roundPoly([[-230, -1060], [230, -1060], [230, -800], [-230, -800]], 20), '#1b2a22', { shade: false, lw: 7 });
  ctx.save(); ctx.font = '600 210px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = '#7dff9a'; ctx.shadowBlur = 26; ctx.fillStyle = '#9bffb4'; ctx.fillText(digits, 0, -925); ctx.restore();
  ctx.restore();
}

// ---------- shots ----------
// A · side wide ride (picture change at 1.2 s)
function rideWide(t, f = {}) {
  sideBG(t, t * 520); bike(t, 600, 1620, 0.98, { spin: -t * 9, snug: { ...SNUG, tail: 0.5 * Math.sin(t * 3) }, ride: { face: { mouth: mouthFor('s1', t) !== 'line' ? 'strain' : 'line', lid: 0.3, brow: 'raised', ...f } } });
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 8; ctx.lineCap = 'round'; for (let i = 0; i < 4; i++) { const x = ((t * 1400 + i * 380) % 1700) - 300; ctx.beginPath(); ctx.moveTo(x, 800 + i * 130); ctx.lineTo(x + 170, 800 + i * 130); ctx.stroke(); } ctx.restore();
}
// B · calendar page "TUE" flapping past + Snuggles close (VO narrates, no lip-sync)
function snugClose(t) {
  rideWide(t, { mouth: 'line' }); 
  const q = seg(t, 3.0, 4.0), x = lerp(-300, 1500, q), y = 760 + 70 * Math.sin(q * 9) + 50 * q, r = -0.5 + 1.3 * q + 0.35 * Math.sin(q * 20);
  if (q > 0 && q < 1) { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(1, 0.9 + 0.1 * Math.cos(q * 30)); outline(() => { ctx.roundRect(-150, -170, 300, 340, 22); }, '#fffaf0', 8); ctx.fillStyle = '#d9423e'; ctx.fillRect(-150, -170, 300, 90); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.strokeRect(-150, -170, 300, 90);
    text('TUE', 0, 30, 150, INK); ctx.restore(); }
}
// C · station 1: giant price sign, digits tick UP, Steve's head follows it
function station1(t) {
  const q = seg(t, 4.3, 6.4), sx = lerp(-300, 1500, eio(q) * 0.2 + q * 0.8);
  sideBG(t, t * 520 - 300 * 0); const dig = (1.89 + 0.01 * Math.floor((t - 4.3) * 14)).toFixed(2);
  priceSign(t, sx, 1620, 0.82, dig);
  const look = kf(t, [[4.3, -0.8], [5.1, -0.8], [5.5, 0.9]]);
  bike(t, 600, 1620, 0.98, { spin: -t * 9, snug: SNUG, ride: { face: { mouth: talking('s3', t) ? (Math.floor(t * 9) % 2 ? 'small' : 'line') : 'line', lid: 0.35, brow: 'skeptic', look, tilt: kf(t, [[4.3, 0], [5.0, -7], [6.4, -4]]), headDy: 0.8 * eo(seg(t, 4.5, 5.3)), fx: ['sweat'] } } });
}
// D · station 2: a queue of bikes out into the road; riders turn in sync, Steve waves them off
function station2(t) {
  sideBG(t, t * 380); const p = spen(onTwos(t), 33, 5);
  p.part(roundPoly([[-700, 880], [1800, 880], [1800, 960], [-700, 960]], 8), '#e9edf2', { shade: 0.1, lw: 6 });
  p.part(roundPoly([[-700, 960], [1800, 960], [1800, 990], [-700, 990]], 8), ORANGE, { shade: 0.1, lw: 6 });
  const lk = t > 7.2 ? kf(t, [[7.2, -1], [7.6, 1]]) : -1;
  const cols = ['#d9423e', '#6aa86a', '#e8c84a', '#9a6bd6', '#3f5a78'];
  for (let i = 0; i < 9; i++) { const x = 1250 - i * 170 + (Math.min(t - 6.5, 1.9) * 28), y = 1380 + (i % 2) * 12; miniBike(t, x, y, 0.42 + (i % 2) * 0.02, cols[i % 5], lk, i); }
  const waving = t > 7.35;
  bike(t, 600, 1700, 0.98, { spin: -t * 9, snug: SNUG, ride: { face: { mouth: mouthFor('s4', t), lid: 0.3, brow: 'raised', look: lk * 0.8, tilt: kf(t, [[6.5, -3], [7.2, -6], [7.6, 3]]) },
    armR: waving ? armTo(-10, -126 - 420, 7, -10 + 7 * 15, -126 - 420 - 7 * (12 + 6 * Math.sin(t * 16)), [0, 5]) : undefined } });
}
// E · key OFF (close, front view of the dash) then coasting downhill, feet up
function keyOff(t) {
  const q = seg(t, 8.6, 9.0), click = t > 9.0;
  dashWorld(t, { needle: 0.012, nshake: 0.02, icon: blinkOn(t) || t > 9.0 ? true : true, key: [850, 1440],
    fistR: [lerp(962, 852, eo(q)), lerp(1010, 1425, eo(q))], face: { mouth: mouthFor('s5', t, 'small', 'smirk'), eyeR: 'squint', lid: 0.3, brow: 'raised', tilt: kf(t, [[8.4, 0], [9.0, -4], [9.6, 3]]) },
    drips: [[330, 560, 1.0, 0, 20], [740, 470, 1.4, 0.3, 36]] });
  if (click) { ctx.save(); ctx.globalAlpha = 1 - seg(t, 9.0, 9.4); ctx.strokeStyle = '#fff6dc'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (const a of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.moveTo(852 + Math.sin(a) * 70, 1440 - Math.cos(a) * 70); ctx.lineTo(852 + Math.sin(a) * 120, 1440 - Math.cos(a) * 120); ctx.stroke(); } ctx.restore(); }
}
function coast(t) {
  ctx.save(); ctx.translate(540, 1500); ctx.rotate(-0.1); ctx.translate(-540, -1500);
  sideBG(t, t * 640);
  bike(t, 600, 1620, 0.98, { spin: -t * 6, still: true, snug: { ...SNUG, tail: 0.9, eyes: 'wide' }, ride: { legs: 'up', face: { eyes: 'happy', mouth: mouthFor('s5', t, 'grin', 'smirk'), lid: 0, brow: 'raised', tilt: 4 * Math.sin(t * 3) } } });
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (let i = 0; i < 6; i++) { const x = ((t * 1900 + i * 330) % 2000) - 400; const y = 700 + i * 110; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 240, y); ctx.stroke(); }
  ctx.restore();
}
// F · 5b: uphill; hand to the key, glance at E, shake head (dash POV)
function glanceE(t) {
  const hand = seg(t, 11.65, 11.95) * (1 - seg(t, 12.1, 12.35));
  dashWorld(t, { needle: 0.012, nshake: 0.015, icon: blinkOn(t), key: [850, 1440], fistR: [lerp(962, 852, eo(hand)), lerp(1010, 1425, eo(hand))],
    face: { mouth: 'wobble', eyeR: 'dot', lid: 0.45, brow: 'worried', look: kf(t, [[11.5, 0], [11.9, 0], [12.3, 0.0]]), tilt: kf(t, [[11.5, 0], [12.2, 0], [12.35, 7], [12.55, -7], [12.7, 0]]), headDy: kf(t, [[11.5, 0], [11.9, -1.2], [12.3, 0]]), fx: ['sweat', 'gloom'] },
    drips: [[330, 560, 0.8, 0, 22], [740, 470, 1.0, 0.2, 40], [330, 700, 1.1, 0.5, 18]] });
}
// G · pushing the scooter uphill, the snail overtakes (silent)
function pushUp(t) {
  ctx.save(); ctx.translate(540, 1500); ctx.rotate(0.13); ctx.translate(-540, -1500);
  sideBG(t, -t * 140 - 700 * 0);
  const stepT = onTwos(t) * 3.2, bob = 7 * Math.abs(Math.sin(stepT * 3));
  // scooter, empty seat; Snuggles stays in the basket
  scooter(onTwos(t), 760, 1640, 0.98, { spin: 0, snug: { ...SNUG, eyes: 'dot', lid: 0.2, mouth: 'line', tail: 0.2 } });
  // Steve pushes from behind (right): leaning into the seat, arms out to the scooter's rear
  const s = 11, hx = 1010 + 8 * Math.sin(stepT * 3), th = -0.5, P = placeSteve(hx, 1050 + bob, s, th), gx = 960, gy = 1250;
  const P2 = { ...P, Y: 1640 };
  const Y = 1640, X0 = 980, th2 = -0.42, P3 = { X: X0, Y, sc: s, th: th2 };
  torsoBase(P3);
  drawCharacter(ctx, 'steve', X0, Y - bob * 0, s, { eyes: 'dot', eyeR: 'dot', lid: 0.6, brow: 'worried', mouth: 'wobble', fx: ['sweat', 'gloom'], look: -0.5, hair: 0, bags: 1, lean: th2 * 180 / Math.PI, tilt: -6, noShadow: true, headDy: -bob * 0.05,
    legPts: [[[0, 38], [-8 + 9 * Math.sin(stepT * 3), 18], [-14 + 16 * Math.sin(stepT * 3), 1], [-8 + 16 * Math.sin(stepT * 3), 1]], [[0, 38], [8 - 9 * Math.sin(stepT * 3), 18], [14 - 16 * Math.sin(stepT * 3), 1], [20 - 16 * Math.sin(stepT * 3), 1]]],
    armL: handLocal(P3, [840, 1400]), armR: handLocal(P3, [900, 1360]) }, { frame: boilFrame(onTwos(t)) });
  wetShirt(P3, 1.4); const hc = bodyPt(P3, 0, 80); helmet([hc[0], hc[1]], s, th2 - 0.05);
  fist(840, 1400, 0.6); fist(900, 1360, 0.6);
  for (const [x0, per, off] of [[1000, 0.7, 0], [900, 0.9, 0.3], [1090, 0.6, 0.5]]) sweatDrip(t, x0 - 60, 700, per, off, 24, 380);
  // wet footprints / sweat trail dots behind him are on the road; the snail slides past in the foreground
  const sx = kf(t, [[12.7, -330], [13.1, 150], [14.0, 700]], x => x), sy = 1850;
  snail(t, sx, sy, 1.9, { look: t > 13.15, wave: false });
  ctx.restore();
}
// H · 6 peak: station 3, he collapses onto the pump and hugs it (still 2, animated)
function hug(t) {
  const q = seg(t, 14.0, 14.55), hold = t - 14.55;
  const hz = 1460;
  ctx.save(); ctx.translate(540, 960); ctx.rotate(-0.08 * eo(seg(t, 14.0, 14.5))); const z = kf(t, [[14.0, 1.0], [14.5, 1.14], [15.7, 1.2]]); ctx.scale(z, z); ctx.translate(-540, -960);
  forecourt(onTwos(t), hz);
  ctx.save(); ctx.translate(690, 1040); for (let i = 0; i < 18; i++) { ctx.rotate(Math.PI * 2 / 18); ctx.fillStyle = `rgba(255,245,200,${0.34 * eo(seg(t, 14.1, 14.6))})`; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1100, -60); ctx.lineTo(1100, 60); ctx.closePath(); ctx.fill(); } ctx.restore();
  scooter(onTwos(t), 470, 1385, 0.6, { snug: { eyes: 'wide', lid: 0, mouth: 'line', look: 0.8, tail: 0.5 + 0.4 * Math.sin(t * 9), arm: 'down' } });
  pump(onTwos(t), 600, 430, 360, 1010, '0.00');
  const s = 9.6, thE = 0.85, th = lerp(0.1, thE, eb(q)), GY = 1632, P = { X: 0, Y: GY, sc: s, th };
  const cx = lerp(230, 660, eo(q));
  P.X = cx - 42 * s * Math.sin(th);
  ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.beginPath(); ctx.ellipse(lerp(300, 520, eo(q)), 1436, 320, 24, 0, 0, 7); ctx.fill();
  torsoBase(P);
  const arms = q < 0.55 ? { armL: 'up', armR: 'up' } : { armL: handLocal(P, [912, 1012]), armR: handLocal(P, [916, 1186]) };
  drawCharacter(ctx, 'steve', P.X, P.Y, s, { eyes: 'happy', lid: 0, brow: 'raised', mouth: talking('s6', t) ? 'wide' : 'grin', fx: ['sweat', 'tears_small'], look: 0, hair: 0, bags: 0, lean: th * 180 / Math.PI, tilt: 8, noShadow: true,
    legPts: [[[0, 38], [17, 25], [-11, 22.6], [-15, 24.6]], [[0, 38], [23, 35], [21, 22.6], [28, 22.4]]], ...arms }, { frame: boilFrame(onTwos(t)) });
  wetShirt(P);
  const hc = bodyPt(P, 0, 80), pop = 22 * Math.sin(Math.PI * seg(t, 14.45, 14.85));
  helmet([hc[0] + 4, hc[1] - 2 - pop], s, th + 0.08 + 0.1 * Math.sin(Math.PI * seg(t, 14.45, 14.85)));
  if (q >= 0.55) { fist(912, 1012, 0.55); fist(916, 1186, 0.55); }
  { const dp = spen(onTwos(t), 31); drop(dp, 520, 800, 24, 0.3); drop(dp, 840, 800, 20, -0.3); drop(dp, 560, 1180, 22, 0); drop(dp, 400, 960, 20, 0.2); drop(dp, 840, 1280, 22, 0); }
  ctx.restore();
}
// I · 7: attendant opens the seat, nozzle in the tank, display ticks to 0.12 and the nozzle clicks off
function fillUp(t) {
  const hz = 1330, [sx, sy] = shake(t, t > 16.45 && t < 16.62 ? 7 : 0, 42);
  forecourt(onTwos(t), hz); glowBlob(800, 600, 520, 'rgba(255,240,190,0.5)');
  const v = t < 15.95 ? 0 : Math.min(12, Math.floor((t - 15.95) / 0.032)), dig = '0.' + String(v).padStart(2, '0');
  pump(onTwos(t), 700, 340, 340, 1000, dig);
  const open = eo(seg(t, 15.7, 16.0)), nod = talking('s7', t) ? 4 * Math.sin(t * 18) * 0 : 0;
  attendant(onTwos(t), 930, 1480, 6.4, { dx: -6, part: 'body' });
  scooter(onTwos(t), 800, 1480, 0.7, { seat: 0.65 * open });
  const nz = t > 16.45 ? 1 : 0, hy0 = 1110 - 14 * nz * (1 - seg(t, 16.45, 16.65)) * 0 - 18 * Math.sin(Math.PI * seg(t, 16.45, 16.7));
  attendant(onTwos(t), 930, 1480, 6.4, { hand: [962, hy0], dx: -6, part: 'arms' });
  if (open > 0.3) nozzle(onTwos(t), 962, hy0);
  // Steve at the left: stares at the display, then at the end shoulders drop
  const s = 7.2, P = { X: 250, Y: 1760, sc: s, th: 0 };
  torsoBase(P);
  drawCharacter(ctx, 'steve', P.X, P.Y, s, { eyes: 'dot', eyeR: 'dot', lid: 0.1, brow: 'raised', mouth: t > 16.9 ? 'small' : 'line', fx: ['sweat'], look: 0.9, hair: 0, bags: 1, noShadow: true, tilt: 5 * seg(t, 16.5, 17.2), arm: t > 16.9 ? 'shrug' : 'down' }, { frame: boilFrame(onTwos(t)) });
  wetShirt(P, 1); const hc = headOf(P.X, P.Y, s); helmet([hc[0], hc[1]], s, 0.087 * seg(t, 16.5, 17.2));
  if (t > 16.45 && t < 16.8) { ctx.save(); ctx.globalAlpha = 1 - seg(t, 16.45, 16.8); ctx.strokeStyle = '#fff6dc'; ctx.lineWidth = 10; ctx.lineCap = 'round'; for (const a of [-0.7, 0, 0.7]) { ctx.beginPath(); ctx.moveTo(900 + Math.sin(a) * 50, 1130 - Math.cos(a) * 50 - 60); ctx.lineTo(900 + Math.sin(a) * 110, 1130 - Math.cos(a) * 110 - 60); ctx.stroke(); } ctx.restore(); }
}
// J · 7b: the gauge, finger tap, needle swings E to F and bounces
function tapF(t) {
  const tapT = 18.12, poke = Math.sin(Math.PI * clamp01((t - 17.95) / 0.32)), q = t - tapT;
  const needle = q < 0 ? 0.012 : 0.96 - 0.96 * 0 + (0.012 - 0.96) * Math.exp(-q * 4.5) * Math.cos(q * 22) * 0 + 0.0, nd = q < 0.0 ? 0.012 : lerp(0.012, 0.96, eo(clamp01(q / 0.28))) + 0.05 * Math.exp(-Math.max(0, q - 0.28) * 6) * Math.sin(Math.max(0, q - 0.28) * 34);
  const [dx, dy] = shake(t, 5 * Math.exp(-Math.max(0, q) * 9) * (q > 0 ? 1 : 0), 40);
  ctx.save(); ctx.translate(dx, dy);
  dashWorld(t, { needle: nd, nshake: q > 0.5 ? 0.0 : 0.0, icon: false, fistR: [lerp(962, 800, poke), lerp(1010, 1230 - 0, poke)], fistK: 1 + 0.06 * poke,
    face: { eyeR: 'dot', lid: t > 18.55 && t < 18.65 ? 0.9 : 0.1, brow: 'raised', mouth: 'small', fx: ['sweat'], look: 0.3, headDy: -0.8 * poke } });
  ctx.restore();
}
// K · 7c: reverse shot, the road he pushed: a sweat trail, the snail far back waves; the back of his helmet in the corner
function roadBehind(t) {
  const hz = 800; sky('#f2a96a', '#fbe2b0'); const p = spen(onTwos(t), 3, 5);
  p.part(roundPoly([[-700, hz], [-700, hz - 120], [150, hz - 220], [450, hz - 120], [800, hz - 230], [1800, hz - 130], [1800, hz]], 20), '#b9a28e', { shade: false, lw: 4 });
  p.part([[-700, hz], [1800, hz], [1800, 2600], [-700, 2600]], '#8f8c93', { shade: 0.1, lw: 5 });
  p.part([[-700, 1100], [560, hz], [-700, 1700]], '#c9c4b8', { shade: false, lw: 5 }); p.part([[1800, 1100], [520, hz], [1800, 1700]], '#c9c4b8', { shade: false, lw: 5 });
  ctx.save(); ctx.strokeStyle = '#fff6dc'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.setLineDash([60, 46]); ctx.beginPath(); ctx.moveTo(540, hz + 10); ctx.lineTo(540, 1500); ctx.stroke(); ctx.restore();
  glowBlob(540, 640, 520, 'rgba(255,230,170,0.5)');
  for (let i = 0; i < 9; i++) { const k = 1 - i / 9, y = hz + 40 + (1 - k * k) * 900, r = 7 + 30 * (1 - k * k) * 1.0; ctx.fillStyle = 'rgba(70,110,150,0.75)'; ctx.beginPath(); ctx.ellipse(540 + (i % 2 ? 14 : -14) * (1 - k), y, r * 1.3, r * 0.55, 0, 0, 7); ctx.fill(); }
  snail(t, 520, hz + 520, 1.0, { wave: true, look: true });
  // back of the helmet, bottom-left
  ctx.save(); ctx.translate(330, 1930); const hs = 1.0; ctx.fillStyle = '#f4efe4'; ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(0, 0, 400 * hs, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.clip(); ctx.fillStyle = '#d9423e'; ctx.fillRect(-34, -440, 68, 440); ctx.fillStyle = 'rgba(42,34,48,0.14)'; ctx.beginPath(); ctx.ellipse(-180, -80, 90, 260, 0, 0, 7); ctx.fill(); ctx.restore(); ctx.restore();
  const wob = 0.12 * Math.sin(t * 9); ctx.fillStyle = '#e2ac84'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(330, 1930 - 240 * 0, 0, 0, 0, 0, 7);
  sweatDrip(t, 420, 1560, 0.8, 0.1, 22, 160);
}
// L · 8: punch close-up, 0.8 s face hold, attendant closes the seat behind
function punch(t) {
  const hz = 1330; forecourt(onTwos(t), hz); glowBlob(800, 600, 520, 'rgba(255,240,190,0.5)');
  pump(onTwos(t), 700, 340, 340, 1000, '0.12');
  const seatA = 0.65 * (1 - eio(seg(t, 20.9, 21.8)));
  attendant(onTwos(t), 930, 1480, 6.4, { dx: -6, part: 'body' });
  scooter(onTwos(t), 800, 1480, 0.7, { seat: seatA });
  attendant(onTwos(t), 930, 1480, 6.4, { hand: [962 - 100 * seg(t, 20.8, 21.4), 1110 + 60 * seg(t, 20.8, 21.4)], dx: -6, part: 'arms' });
  const s = 18, th = 0.04, P = placeSteve(400, 1150, s, th), bl = (t > 19.95 && t < 20.07) ? 0.95 : 0.62;
  torsoBase(P);
  const tilt = kf(t, [[19.7, -8], [20.35, -8], [20.6, -3], [22.0, -4]]);
  drawCharacter(ctx, 'steve', P.X, P.Y, s, { expr: 'dead_inside', lid: bl, brow: undefined, mouth: talking('s8a', t) ? (Math.floor(t * 7) % 2 ? 'small' : 'line') : 'line', fx: ['sweat'], look: 0, hair: 0, bags: 1, lean: th * 180 / Math.PI, tilt, headDy: -1, noShadow: true, legPts: [] }, { frame: boilFrame(onTwos(t)) });
  wetShirt(P, 1); const hc = bodyPt(P, 0, 79); helmet([hc[0] - 2, hc[1] - 2], s, th - 0.14 + (tilt + 8) * 0.012);
  sweatDrip(t, 160, 900, 1.1, 0.9, 28, 520);
  { const dp = spen(onTwos(t), 31); drop(dp, 600, 1330, 24, 0); drop(dp, 130, 1250, 22, 0.1); drop(dp, 640, 900, 22, 0); }
}
// M · button a: he rides off past the station, left
function rideOff(t) {
  forecourt(onTwos(t), 1180); const q = seg(t, 22.0, 23.0), x = lerp(640, -420, q * q);
  const p = spen(onTwos(t), 9, 5); p.part([[-20, 1180], [1100, 1180], [1100, 1950], [-20, 1950]], '#b9b4aa', { shade: 0.1, lw: 5 });
  pump(onTwos(t), 620, 330, 330, 880, '0.12');
  bike(t, x, 1640, 0.98, { spin: -t * 11 * q, snug: { ...SNUG, tail: 0.7 }, ride: { face: { mouth: 'line', lid: 0.35, brow: 'raised', look: -0.8 } } });
  const sm = seg(t, 22.1, 22.7); if (sm > 0 && sm < 1) { ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - sm)})`; ctx.beginPath(); ctx.arc(lerp(960, 1050, sm), 1560 - 40 * sm, 40 + 40 * sm, 0, 7); ctx.fill(); }
}
// N · button b + loop: gauge needle F drops back to E, he glances, "It's FINE."; push-in settles on frame 1
function loopDash(t) {
  const z = kf(t, [[23.0, 0.88], [26.5, 1.0]], eio);
  const q = seg(t, 23.3, 23.95), needle = lerp(0.96, 0.012, q * q * (3 - 2 * q)) + (q >= 1 ? 0.02 * Math.exp(-(t - 23.95) * 7) * Math.sin((t - 23.95) * 40) : 0);
  const glance = seg(t, 24.0, 24.35);
  const icon = t > 24.0 ? blinkOn(t - 24.0) : false;
  cam(z, 540, 960, () => dashWorld(t, { needle, nshake: t > 24.4 ? 0.02 : 0, icon: t > 24.0 ? (t > 26.2 ? true : blinkOn(t - 24.0)) : false,
    face: { mouth: talking('s9', t) ? 'strain' : (t > 25.9 ? 'strain' : 'line'), eyeR: 'squint', lid: lerp(0.15, 0.3, glance), brow: t > 24.2 ? 'raised' : 'worried', tilt: -3 * glance * (1 - seg(t, 26.0, 26.5)), headDy: 0 },
    drips: [[345, 560, 1.0, 0.2, 22], [738, 470, 1.4, 0.5, 36]] }));
}

// ---------- shot list ----------
let SHOTS = [];
function build() {
  SHOTS = [
    // 1 · HOOK: frame 1 = gauge on E + blinking pump icon + sweaty face (approved still 1); s1 at 0.3; sweat drop at 0.3
    [0, t => { cam(kf(t, [[0, 1.0], [1.2, 1.07]]), 540, 960, () => dashWorld(t, { needle: 0.012, nshake: 0.02 * Math.sin(t * 40), icon: blinkOn(t),
      face: { mouth: talking('s1', t) ? (Math.floor(t * 9) % 2 ? 'strain' : 'small') : 'strain', headDy: 0.5 * Math.sin(t * 25) * (t > 0.3 && t < 0.9 ? 1 : 0) },
      drips: [[345, 560, 1.1, 0.7, 22], [738, 520, 1.5, 0.3, 24], [705, 470, 1.4, 0.0, 46, 300]] }), 0, ...shake(t, 3, 33)); }],
    // 2 · pull back: Steve rides, Snuggles in the basket
    [1.2, t => { cam(kf(t, [[1.2, 1.25], [2.9, 1.0]], eo), kf(t, [[1.2, 360], [2.9, 540]], eo), 1050, () => rideWide(t)); }],
    // 3 · s2: the "TUE" page flaps past, Snuggles' ears flick
    [2.9, t => { cam(kf(t, [[2.9, 1.0], [4.3, 1.28]]), kf(t, [[2.9, 540], [4.3, 380]]), 1100, () => snugClose(t)); }],
    // 4 · s3: station 1, the price sign whooshes past, his head follows
    [4.3, t => { cam(kf(t, [[4.3, 1.0], [6.4, 1.12]]), 600, 1100, () => station1(t)); }],
    // 5 · s4: station 2, a queue of bikes, he waves them off
    [6.5, t => { cam(kf(t, [[6.5, 1.0], [8.4, 1.1]]), 600, 1150, () => station2(t)); }],
    // 6 · s5: key click (engine OFF)
    [8.4, t => { cam(kf(t, [[8.4, 1.0], [10.0, 1.1]]), 540, 1000, () => keyOff(t)); }],
    // 7 · coasting downhill, feet up, grin
    [10.0, t => { cam(kf(t, [[10.0, 1.05], [11.5, 1.18]]), 560, 1150, () => coast(t)); }],
    // 8 · 5b (silent): uphill, hand to the key, glance at E, head shake
    [11.5, t => { cam(kf(t, [[11.5, 1.0], [12.7, 1.06]]), 540, 980, () => glanceE(t), 0, ...shake(t, 0, 20)); }],
    // 9 · 5b: push, sweat, the snail overtakes
    [12.7, t => { cam(kf(t, [[12.7, 1.0], [14.0, 1.1]]), 700, 1300, () => pushUp(t)); }],
    // 10 · s6 PEAK
    [14.0, t => { hug(t); }],
    // 11 · s7 attendant + nozzle click + 0.12
    [15.7, t => { cam(kf(t, [[15.7, 1.0], [17.9, 1.1]]), 640, 1150, () => fillUp(t)); }],
    // 12 · 7b (silent): the gauge, tap, needle to F
    [17.9, t => { cam(kf(t, [[17.9, 1.0], [19.0, 1.05]]), 540, 980, () => tapF(t)); }],
    // 13 · 7c (silent): the road behind him, the snail waves
    [18.8, t => { cam(kf(t, [[18.8, 1.0], [19.7, 1.1]]), 540, 900, () => roadBehind(t)); }],
    // 14 · face hold 0.7 s (blink, drip), then s8a punch
    [19.7, t => { cam(kf(t, [[19.7, 1.0], [22.0, 1.07]], t2 => t2), 480, 1000, () => punch(t)); }],
    // 15 · button a: rides off
    [22.0, t => { rideOff(t); }],
    // 16 · button b + loop: needle drops back to E, glance, "It's FINE.", push-in = frame 1
    [22.7, t => { loopDash(t); }],
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
  TL = await (await fetch('voice/film_timeline.json')).json();
  LN = Object.fromEntries(TL.lines.map(l => [l.id, l]));
  window.DUR = DUR = TL.total;
  build(); render(0); window.READY = true;
})();
