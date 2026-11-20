// UNIT 4B · 24 "The Lid" (Tap 15) — FULL FILM, ~25.5 s. Worlds = the approved key stills (lift.js, lifted from stills.js) + animation.
// Timings: voice/film_timeline.json (retime.py). Punch s8 at ~20.5 (80 %). Beats are listed in build().
import { paper, panel } from './lib/cast_stick.js';
import { roundPoly, ellipsePts } from './lib/cast_v2.js';
import { boilFrame, ease } from './lib/motion.js';
import { W, H, ctx, INK, lpen, spen, text, strokedText, title, glowBlob, armTube, poly2, steve, snuggles, NOARM, SK, kitchen, glassBody, jarPoly, label, ginghamLid, fist, vein, motionLines, burst, pickle, cloud } from './lift.js';

let TL = null, DUR = 25.5, LN = {};
const lerp = (a, b, k) => a + (b - a) * k;
const clamp01 = k => Math.max(0, Math.min(1, k)), seg = (t, a, b) => clamp01((t - a) / (b - a));
const eo = ease.out, eio = ease.inOut;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
const lin = t => t;
function cam(zoom, fx, fy, fn, dx = 0, dy = 0) { zoom = Math.max(zoom, 1); const mx = 540 / zoom + 24, my = 960 / zoom + 24; fx = Math.min(Math.max(fx, mx), 1080 - mx); fy = Math.min(Math.max(fy, my), 1920 - my); ctx.save(); ctx.translate(540 + dx, 960 + dy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const talking = (id, t) => { const l = LN[id]; return !!l && t >= l.start && t <= l.end; };
const chat = (t, hz = 10) => Math.floor(t * hz) % 2 === 0;
const pulse = (t, ts, a = 0.06, b = 0.1, c = 0.3) => seg(t, ts - a, ts) * (1 - seg(t, ts + b, ts + c));   // 0->1 fast, hold, release
const heatSkin = h => h < 0.25 ? SK.n : h < 0.6 ? SK.flush : SK.hot;

// ---------- key times ----------
const T_S2 = 2.19, T_TOAST = 3.3, T_TOWEL = 4.29, T_RAGS = 5.75, T_TAP = 6.47, T_TAPB = 8.95, T_KNIFE = 10.48, T_FACE = 12.2, T_PEAK = 13.38, T_SPIN = 14.1, T_POP = 14.95, T_TROPHY = 15.7, T_LOOK = 17.0, T_PAN = 17.9, T_PUNCH = 20.465, T_BTN = 22.95, T_LOOP = 24.3;
const T_RIP = 5.45;

// ---------- captions (stroked, y ~1500, never over a face) ----------
const PL_Y = 1500;
function capText(lines, stress) {
  ctx.save(); let size = lines.length > 1 ? 86 : 100; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.font = `600 ${size}px Fredoka`; const widest = Math.max(...lines.map(l => ctx.measureText(l).width)); if (widest > 960) size = Math.floor(size * 960 / widest);
  ctx.font = `600 ${size}px Fredoka`;
  lines.forEach((ln, li) => {
    const ws = ln.split(' '), gap = 22, wd = ws.map(w => ctx.measureText(w).width); let x = 540 - (wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
    const y = PL_Y + 40 + (li - (lines.length - 1) / 2) * (size + 8);
    ws.forEach((w, i) => { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(w, x, y); ctx.fillStyle = stress.some(s => w.startsWith(s)) ? '#ffd84a' : '#fff'; ctx.fillText(w, x, y); x += wd[i] + gap; });
  });
  ctx.restore();
}
const CAPS = {   // id: [lines, stress, hold after voice end]
  s1: [['Just. OPEN.'], ['OPEN.'], 0.15], s2: [['The toast is', 'getting COLD.'], ['COLD.'], 0.2],
  s3: [['Towel. Works', 'EVERY time.'], ['EVERY'], 0.2], s4: [['Hot water…', 'LOOSENS it.'], ['LOOSENS'], 0.25],
  s6: [['Come… ON!'], ['ON!'], 0.2], s8: [['He doesn’t even', 'LIKE pickles.'], ['LIKE'], 0.5],
};
function captions(t) {
  for (const l of TL.lines) {
    const c = CAPS[l.id]; if (!c) continue;
    if (t >= l.start - 0.03 && t <= l.end + c[2]) { capText(c[0], c[1]); return { id: l.id, text: c[0].join(' '), x0: 40, y0: PL_Y - 60, x1: 1040, y1: PL_Y + 130 }; }
  }
  return null;
}

// =====================================================================================
// shared props
// =====================================================================================
const tieAt = (X, Y, s) => {
  const p = lpen(X, Y, s, 9), tie = roundPoly([[-2.6, 61], [2.6, 61], [3.4, 56], [3.8, 42.5], [0, 39], [-3.8, 42.5], [-3.4, 56]], 1, 3);
  p.part(tie, '#2f5fa8', { shade: false, lw: 5 }); p.part(roundPoly([[-2.8, 62.6], [2.8, 62.6], [2.2, 58.6], [-2.2, 58.6]], 1, 2), '#244a85', { shade: false, lw: 5 });
  p.line([[-2.4, 52], [2.4, 49]], 4, '#9fc0ea'); p.line([[-2.8, 46], [2.8, 43]], 4, '#9fc0ea');
};
// the big sealed jar (hook jar scaled about its centre (540,1450)); o.open → lid off, brine + pickle spears
function jar(cx, cy, k, o = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.rot || 0); ctx.scale(k, k); ctx.translate(-540, -1450);
  glassBody(540, 1062, 930, 835, 600, 170);
  if (o.open) {
    const jp = jarPoly(540, 1062, 930, 835, 600, 170);
    ctx.save(); ctx.beginPath(); jp.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip(); ctx.fillStyle = 'rgba(206,214,110,0.75)'; ctx.fillRect(0, 1130, W, 800); ctx.restore();
    glassBody(540, 1062, 930, 835, 600, 170, 'rgba(0,0,0,0)', 8);
  }
  label(540, 1240, 1800, 930, 46, true);
  if (o.open) { pickle(470, 1010, 520, -1.35); pickle(590, 1000, 560, -1.62); pickle(540, 1040, 480, -1.5); }
  else ginghamLid(540 + (o.lidDx || 0), 1010 + (o.lidDy || 0), 660, 140, 24, o.lidRot || 0);
  ctx.restore();
}
function jamJar(jx, jt, k = 1, rot = 0) {
  ctx.save(); ctx.translate(jx, jt + 110); ctx.rotate(rot); ctx.scale(k, k); ctx.translate(-jx, -(jt + 110));
  glassBody(jx, jt, 250, 220, 190, 50, '#dfe9e1', 6);
  ctx.save(); ctx.beginPath(); ctx.rect(jx - 125, jt + 70, 250, 160); ctx.clip(); ctx.fillStyle = '#9c2f5c'; ctx.fillRect(jx - 125, jt + 70, 250, 160); ctx.restore();
  glassBody(jx, jt, 250, 220, 190, 50, 'rgba(0,0,0,0)', 6);
  label(jx, jt + 100, jt + 195, 250, 14, false);
  text('JAM', jx, jt + 152, 50, '#8a1c2b', 'Fredoka');
  ginghamLid(jx, jt - 8, 210, 70, 17);
  ctx.restore();
}
function steamPuffs(cx, cy, t, a = 1, n = 3, spread = 16) {
  for (let i = 0; i < n; i++) { const ph = (t * 0.9 + i / n) % 1; cloud(cx + spread * Math.sin(t * 4 + i * 2) + (i - 1) * 14, cy - 120 * ph - 30 * i, 22 + 10 * ph, 0.9 * a * Math.sin(Math.PI * ph)); }
}
function toast(cx, cy, rot = 0) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); const p = spen(0.1, 202, 6);
  p.part(roundPoly([[-52, -50], [52, -50], [52, 40], [-52, 40]], 24, 4), '#d9a15a', { shade: false, lw: 6 }); ctx.fillStyle = '#c47f35'; ctx.fillRect(-36, -34, 72, 54); ctx.restore();
}
function towel(x, y, w, h, rot = 0, tear = false) {   // tea towel with blue stripes
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const pts = tear ? [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2 - 6, -h * 0.2], [w / 2 + 8, h * 0.1], [w / 2 - 8, h * 0.35], [w / 2 + 4, h / 2], [-w / 2, h / 2]] : [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
  const p = spen(0.1, 203, 5); p.part(pts, '#f6f1e6', { shade: false, lw: 5 });
  ctx.save(); ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
  ctx.fillStyle = '#4a79c4'; for (let i = -3; i <= 3; i++) ctx.fillRect(i * w * 0.2 - 6, -h / 2, 12, h); ctx.fillRect(-w / 2, -h * 0.05, w, 12);
  ctx.restore(); ctx.restore();
}
function knife(x, y, rot, bend = 0) {   // butter knife, pivot at the handle end; bend folds the blade into an L
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const p = spen(0.1, 204, 5);
  p.part(roundPoly([[0, -17], [120, -17], [120, 17], [0, 17]], 12, 3), '#8a5a3a', { shade: false, lw: 6 });
  const b = bend * 1.35;
  p.part([[120, -13], [190, -13], [190, 13], [120, 13]], '#cfd4de', { shade: false, lw: 5 });
  ctx.save(); ctx.translate(190, 0); ctx.rotate(b);
  p.part(roundPoly([[0, -13], [140, -11], [150, 4], [0, 13]], 5, 3), '#dfe3ea', { shade: false, lw: 5 });
  ctx.restore(); ctx.restore();
}
function sweatDrop(x, y, r = 10) {
  ctx.save(); ctx.fillStyle = '#bfe6ff'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y - r * 2); ctx.quadraticCurveTo(x + r * 1.1, y - r * 0.3, x + r, y + r * 0.2); ctx.arc(x, y + r * 0.2, r, 0, Math.PI); ctx.quadraticCurveTo(x - r * 1.1, y - r * 0.3, x, y - r * 2); ctx.fill(); ctx.stroke(); ctx.restore();
}

// =====================================================================================
// WORLD A · HOOK (frame 1 and the loop end): giant jar + red straining face. o: red(0..1), wob, mouth
// =====================================================================================
function hookWorld(t, o = {}) {
  kitchen(2200, 2200);
  const heat = o.heat ?? 1;
  glowBlob(540, 700, 800, `rgba(255,120,90,${0.18 * heat})`);
  const s = 16, X = 540, hcY = 610, Y = hcY + 80 * s, wob = o.wob ?? 1;
  steve(X, Y, s, { eyes: 'squint', brow: 'angry', mouth: o.mouth ?? 'teeth', look: 0, fx: ['vein', 'sweat'], arm: NOARM, armL: NOARM, armR: NOARM, tilt: 1.5 * wob * Math.sin(t * 19) }, heatSkin(heat));
  const vp = 1 + 0.3 * Math.sin(t * 14);
  vein(430, 400, 70 * vp, -0.4); vein(590, 390, 80 * vp, 0.5, 7); vein(500, 372, 50 * vp, -0.1, 5);
  const j = Math.floor(t * 12) % 2 ? 6 : -6;
  motionLines([[250 - j, 470, 205 - j, 440], [235 - j, 560, 180 - j, 560], [250 - j, 650, 205 - j, 680], [830 + j, 470, 875 + j, 440], [845 + j, 560, 900 + j, 560], [830 + j, 650, 875 + j, 680]], '#b3261e', 9);
  ctx.save(); ctx.translate(540, 1450); ctx.rotate(0.012 * wob * Math.sin(t * 23)); ctx.translate(-540 + 5 * wob * Math.sin(t * 31), -1450 + 3 * wob * Math.cos(t * 27));
  armTube([[430, 930], [320, 900], [290, 985]], 58, heatSkin(heat), 33);
  armTube([[650, 930], [760, 900], [790, 985]], 58, heatSkin(heat), 34);
  vein(330, 905, 70, 0.3); vein(740, 905, 70, -0.3);
  glassBody(540, 1062, 930, 835, 600, 170);
  label(540, 1240, 1800, 930, 46, true);
  ginghamLid(540, 1010, 660, 140, 24);
  fist(270, 1000, 66); fist(810, 1000, 66);
  ctx.restore();
  motionLines([[40, 1330, 16, 1290], [30, 1480, 0, 1480], [40, 1630, 14, 1670], [1040, 1330, 1064, 1290], [1050, 1480, 1080, 1480], [1040, 1630, 1066, 1670]], INK, 10);
}

// =====================================================================================
// WORLD K · the kitchen (standing). o: steam, tail, sLook, sLid, props(false), jamFront, noSnug, noJam
// =====================================================================================
const XS = 850, YS = 1665, SS = 9.5, CY = 1190;
function kw(t, o = {}) {
  kitchen(CY, 1640);
  { const p = spen(0.1, 205, 7); poly2([[120, 330], [430, 330], [430, 700], [120, 700]], '#bfe6f5', 7, 206);
    p.line([[275, 330], [275, 700]], 6); p.line([[120, 515], [430, 515]], 6);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(140, 350, 60, 150);
    p.part(ellipsePts(870, 480, 80, 80, 28), '#fbf6ec', { shade: false, lw: 7 }); p.line([[870, 480], [870, 430]], 6); p.line([[870, 480], [905, 495]], 6); }
  if (o.props !== false) {
    if (!o.noJam) jamJar(o.jamFront ? 660 : 560, o.jamFront ? 975 : 975, 1);
    const p = spen(0.1, 201, 6);
    p.part(ellipsePts(280, CY + 4, 150, 34, 30), '#f6f3ee', { shade: false, lw: 6 });
    toast(250, CY - 34, 0.06 + (o.droop ?? 0) * 0.12); toast(318, CY - 44, -0.1 - (o.droop ?? 0) * 0.2);
    if ((o.steam ?? 0) > 0.02) steamPuffs(285, CY - 100, t, o.steam, 3, 18);
    // toaster
    p.part(roundPoly([[360, CY], [570, CY], [570, CY - 130], [360, CY - 130]], 40, 4), '#b8bfcc', { shade: false, lw: 7 });
    p.line([[390, CY - 110], [540, CY - 110]], 6); ctx.fillStyle = '#3a3548'; ctx.fillRect(390, CY - 85, 150, 12); ctx.fillStyle = '#c0392b'; ctx.fillRect(535, CY - 46, 20, 18);
    if (o.jamFront) jamJar(660, 975, 1);
  }
  if (!o.noSnug) snuggles(110, CY, 7, { eyes: 'dot', lid: o.sLid ?? 0.5, look: o.sLook ?? 0.8, mouth: 'line', tilt: -4, tail: o.tail ?? 0.3 });
}
// Steve standing in the kitchen. holds the arms himself. a: { L:[[x,y],[x,y]] mid/hand, R } hands; skin
function stK(t, X, pose, heat, arms) {
  steve(X, YS, SS, { armL: NOARM, armR: NOARM, ...pose }, heatSkin(heat));
  tieAt(X, YS, SS);
  if (arms) {
    const sk = arms.skin ?? heatSkin(heat), sh = [X - 8 * SS, YS - 60 * SS], shR = [X + 8 * SS, YS - 60 * SS];
    if (arms.L) { armTube([sh, arms.L[0], arms.L[1]], 36, sk, 33); if (!arms.noFist) fist(arms.L[1][0], arms.L[1][1], 40, arms.white !== false); }
    if (arms.R) { armTube([shR, arms.R[0], arms.R[1]], 36, sk, 34); if (!arms.noFist) fist(arms.R[1][0], arms.R[1][1], 40, arms.white !== false); }
  }
}
const strainPose = (t, extra = {}) => ({ eyes: 'squint', brow: 'angry', mouth: chat(t, 9) ? 'teeth' : 'line', look: 0.2, fx: ['vein', 'sweat'], tilt: 1.5 * Math.sin(t * 17), ...extra });

// =====================================================================================
// WORLD F · the floor (peak): ported from still 2. o: th (lean), spin, jarRot, lid(state), arrows, fx
// =====================================================================================
function floorWorld(t, o = {}) {
  kitchen(560, 1090, { fridge: true });
  const s = 14, X = 420, F = 1500, Y = F + 34 * s, spin = o.spin ?? 0;
  const th0 = (o.th ?? 20) * Math.PI / 180;
  ctx.save(); ctx.translate(X, 1450); ctx.rotate(spin); ctx.translate(-X, -1450);
  const hip = [X, Y - 38 * s], rot = (lx, ly) => [hip[0] + (lx * Math.cos(th0) + ly * Math.sin(th0)) * s, hip[1] + (lx * Math.sin(th0) - ly * Math.cos(th0)) * s];
  const [hx, hy] = rot(0, 42), sh = rot(0, 22);
  glowBlob(hx, hy, 500, 'rgba(255,120,90,0.16)');
  steve(X, Y, s, { eyes: 'squint', brow: 'angry', mouth: o.mouth ?? 'scream', look: 0.4, fx: ['vein', 'sweat'], lean: o.th ?? 20, tilt: -14, armL: NOARM, armR: NOARM, legPts: [[[0, 38], [-19, 52], [-9, 34]], [[0, 38], [21, 50], [12, 34]]] }, SK.hot);
  const jx = 440, jtop = 1190, jh = 290, jw = 370, jr = o.jarRot ?? -0.1;
  armTube([[sh[0] - 16, sh[1] + 8], [jx - 260, sh[1] + 60], [jx - jw / 2 - 10, jtop + 70]], 50, SK.hot, 33);
  vein(jx - 330, sh[1] + 40, 60, 0.3);
  ctx.save(); ctx.translate(jx, jtop + jh / 2); ctx.rotate(jr); ctx.translate(-jx, -(jtop + jh / 2));
  glassBody(jx, jtop, jw, jh, 250, 90, '#cfe6df', 7);
  if (o.popped) { const jp = jarPoly(jx, jtop, jw, jh, 250, 90); ctx.save(); ctx.beginPath(); jp.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip(); ctx.fillStyle = 'rgba(206,214,110,0.7)'; ctx.fillRect(jx - 200, jtop + 40, 400, 300); ctx.restore(); }
  label(jx, jtop + 110, jtop + jh - 22, jw, 20, false);
  if (o.popped) { pickle(jx - 40, jtop - 10, 220, -1.4); pickle(jx + 30, jtop - 20, 240, -1.65); }
  else ginghamLid(jx, jtop - 14, 290, 62, 14);
  ctx.restore();
  armTube([[sh[0] + 20, sh[1] + 4], [jx + 270, sh[1] + 10], [jx + jw / 2 + 10, jtop + 50]], 50, SK.hot, 34);
  fist(jx - jw / 2 - 12, jtop + 74, 48); fist(jx + jw / 2 + 12, jtop + 54, 48);
  if (o.arrows) { const p = spen(t, 90, 12); const arc = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * (0.1 + 0.85 * i / 14); arc.push([jx + Math.cos(a) * 250, jtop + jh + 22 + Math.sin(a) * 50]); }
    p.line(arc, 12, '#f2c14e'); p.line([[arc[14][0] + 4, arc[14][1] - 40], [arc[14][0], arc[14][1]], [arc[14][0] + 44, arc[14][1] - 8]], 12, '#f2c14e'); }
  vein(hx - 80, hy - 170, 70, -0.4); vein(hx + 60, hy - 180, 60, 0.4, 6);
  motionLines([[hx - 250, hy - 40, hx - 300, hy - 70], [hx - 260, hy + 50, hx - 315, hy + 60]], '#b3261e', 9);
  ctx.restore();
}

// =====================================================================================
// WORLD P · the punch world (still 3): Steve flat on his back. o: trophy(0..1), pickleK(0..1 roll), blink, jarOpen
// =====================================================================================
function punchWorld(t, o = {}) {
  kitchen(520, 800);
  ctx.save(); ctx.translate(0, -140);
  { const p = spen(0.1, 201, 6);
    p.part(ellipsePts(190, 640, 150, 34, 30), '#f6f3ee', { shade: false, lw: 6 });
    toast(160, 606, 0.06 + 0.12); toast(228, 596, -0.3);
    p.part(roundPoly([[290, 650], [500, 650], [500, 520], [290, 520]], 40, 4), '#b8bfcc', { shade: false, lw: 7 });
    p.line([[320, 540], [470, 540]], 6); ctx.fillStyle = '#3a3548'; ctx.fillRect(320, 565, 150, 12); ctx.fillStyle = '#c0392b'; ctx.fillRect(465, 604, 20, 18); }
  jamJar(680, 440, 1);
  snuggles(900, 660, 6.2, { eyes: 'dot', lid: 0.55, look: -0.9, mouth: 'line', tilt: -6, tail: 0.3 + 0.12 * Math.sin(t * 3) });
  ctx.restore();
  const s = 11, px = 1066, py = 1180;
  ctx.fillStyle = 'rgba(40,30,20,0.14)'; ctx.beginPath(); ctx.ellipse(540, py + 100, 520, 26, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(px, py + (o.bob ?? 0)); ctx.rotate(-Math.PI / 2);
  steve(0, 0, s, { eyes: o.blink ? 'closed' : 'dot', lid: o.lid ?? 0.45, brow: 'worried', mouth: o.mouth ?? 'line', look: o.look ?? 0.3, fx: ['sweat'], tilt: 90, armL: 'hold', armR: 'hold', ...(o.trophy ? { armL: NOARM, armR: NOARM } : {}) }, SK.n);
  const p = lpen(0, 0, s, 9), tie = roundPoly([[-2.6, 61], [2.6, 61], [3.4, 56], [3.8, 42.5], [0, 39], [-3.8, 42.5], [-3.4, 56]], 1, 3);
  p.part(tie, '#2f5fa8', { shade: false, lw: 5 }); p.part(roundPoly([[-2.8, 62.6], [2.8, 62.6], [2.2, 58.6], [-2.2, 58.6]], 1, 2), '#244a85', { shade: false, lw: 5 });
  p.line([[-2.4, 52], [2.4, 49]], 4, '#9fc0ea'); p.line([[-2.8, 46], [2.8, 43]], 4, '#9fc0ea');
  ctx.restore();
  const tro = o.trophy ?? 0;
  if (tro > 0) {   // jar held up high over his chest, both arms straight up
    const jx = 520, jy = py - 300 - 40 * Math.sin(t * 7) * 0.0, shT = [px - 60 * s, py - 88 + (o.bob ?? 0)], shB = [px - 60 * s, py + 88 + (o.bob ?? 0)];
    const lift = eio(tro);
    armTube([shT, [lerp(shT[0], jx - 120, 0.5), lerp(shT[1], jy - 20, 0.5)], [jx - 140, lerp(py - 120, jy, lift)]], 46, SK.n, 33);
    armTube([shB, [lerp(shB[0], jx - 120, 0.5), lerp(shB[1], jy + 20, 0.5)], [jx + 140, lerp(py + 60, jy, lift)]], 46, SK.n, 34);
    jar(jx, lerp(py - 30, jy, lift) + 5 * Math.sin(t * 9) * (tro > 0.9 ? 1 : 0), 0.34, { open: true, rot: 0.04 * Math.sin(t * 6) });
    fist(jx - 140, lerp(py - 120, jy, lift), 40, false); fist(jx + 140, lerp(py + 60, jy, lift), 40, false);
  } else {
    const jcx = 760, jcy = py - 135, jw = 300, jh = 400, rot = 1.15;
    ctx.save(); ctx.translate(jcx, jcy); ctx.rotate(rot);
    glassBody(0, -jh / 2, jw, jh, 220, 110, '#dcefe6', 7);
    const jp = jarPoly(0, -jh / 2, jw, jh, 220, 110);
    ctx.save(); ctx.beginPath(); jp.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
    ctx.rotate(-rot); ctx.translate(-jcx, -jcy); ctx.fillStyle = 'rgba(206,214,110,0.78)'; ctx.fillRect(0, jcy - 40, W, 400); ctx.restore();
    for (const [dx, dy, r] of [[-20, 70, 1.4], [30, 20, 1.7], [-50, 0, 1.55], [0, 120, 1.6]]) pickle(dx, dy, 200, r);
    glassBody(0, -jh / 2, jw, jh, 220, 110, 'rgba(0,0,0,0)', 7);
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(-jw / 2 + 18, -jh / 2 + 150, 14, 150);
    ctx.restore();
    pickle(930, py - 60, 170, 0.5);
    pickle(560, py + 120, 170, -0.25);
    // the pickle that rolls out of the jar mouth, down his chest, and lands on the tie
    const k = o.pickleK ?? 1;
    if (k >= 1) pickle(448, py - 8, 118, -0.1);
    else if (k > 0) { const e = eio(k); pickle(lerp(850, 448, e), lerp(py - 250, py - 8, e) - 40 * Math.sin(Math.PI * e), 118, -0.1 + 9 * e); }
    ctx.fillStyle = 'rgba(206,214,110,0.8)'; ctx.beginPath(); ctx.ellipse(880, py + 40, 12, 20, 0.3, 0, 7); ctx.fill();
    fist(640, py - 70, 44, false);
  }
}

// =====================================================================================
// shot list
// =====================================================================================
let SHOTS = [];
const SAGS = { jarCx: XS, jarCy: 1160 };
function build() {
  const heldJar = (t, o = {}) => { jar(o.cx ?? XS, o.cy ?? 1160, 0.3, { rot: o.rot || 0, lidRot: o.lidRot, lidDx: o.lidDx, lidDy: o.lidDy }); };
  const hold2 = (cx, cy, dx = 150) => ({ L: [[cx - dx - 60, cy - 70], [cx - dx, cy - 30]], R: [[cx + dx + 60, cy - 70], [cx + dx, cy - 30]] });
  SHOTS = [
    // A · HOOK 0–1.0: frame 1
    [0, t => { cam(kf(t, [[0, 1.0], [1.0, 1.06]], lin), 540, 1000, () => hookWorld(t, { mouth: chat(t, 10) ? 'teeth' : 'line', heat: 0.8 + 0.2 * Math.sin(t * 8) }), ...shake(t, 2.4, 33)); }],
    // B · pull-back (1.0 s): from the jar + face out to the kitchen: toast, toaster, the twin jam jar behind it, Snuggles
    [1.0, t => {
      const z = kf(t, [[1.0, 2.3], [2.0, 1.0]], eo), fx = kf(t, [[1.0, 855], [2.0, 540]], eo), fy = kf(t, [[1.0, 1030], [2.0, 960]], eo);
      cam(z, fx, fy, () => { kw(t, { steam: 1, sLook: 0.9, sLid: 0.5, tail: 0.3 + 0.4 * Math.sin(t * 5) }); stK(t, XS + 3 * Math.sin(t * 40), strainPose(t), 1, hold2(XS, 1160)); heldJar(t, { rot: 0.03 * Math.sin(t * 25) }); });
    }],
    // C · s2 Snuggles close: deadpan stare at the plate, tail flick, steam thins
    [T_S2, t => {
      const st = kf(t, [[T_S2, 1], [4.0, 0]], lin), lk = t < 2.75 ? 0.85 : -0.95 * eio(seg(t, 2.75, 3.0)) + 0.85 * (1 - eio(seg(t, 2.75, 3.0)));
      cam(kf(t, [[T_S2, 2.0], [T_TOAST, 2.3]], lin), 270, 1040, () => kw(t, { steam: st, sLook: t < 2.75 ? 0.85 : -0.2, sLid: 0.55 - 0.1 * pulse(t, 2.95, 0.05, 0.1, 0.2), tail: 0.2 + 0.7 * Math.abs(Math.sin(t * 3.2)) * (t > 2.9 ? 1 : 0.2), noJam: false, droop: 0 }), ...shake(t, 0.6, 20));
      void lk;
    }],
    // D · toast close: steam fades, the slice droops
    [T_TOAST, t => { cam(kf(t, [[T_TOAST, 2.5], [T_TOWEL, 2.8]], lin), kf(t, [[T_TOAST, 330], [T_TOWEL, 300]], lin), 1090, () => kw(t, { steam: kf(t, [[2.19, 1], [4.0, 0]], lin), droop: seg(t, 3.4, 4.2), noSnug: true, noJam: true })); }],
    // E · s3 towel: wrap, twist, RIP
    [T_TOWEL, t => {
      const wrap = seg(t, 4.35, 4.7), tw = seg(t, 4.7, T_RIP), rip = t >= T_RIP, ra = seg(t, T_RIP, T_RIP + 0.45);
      const twist = rip ? 0 : 0.14 * Math.sin(t * 22) * tw;
      cam(kf(t, [[T_TOWEL, 1.5], [T_RAGS, 1.7]], lin), 700, 1020, () => {
        kw(t, { steam: 0, droop: 1, sLook: 0.9, sLid: 0.4, tail: 0.1 });
        const pose = rip ? { eyes: 'dot', lid: 0.1, brow: 'worried', mouth: 'O', look: 0.3, fx: ['sweat'], tilt: -10 * eo(ra), lean: -8 * eo(ra) } : { eyes: 'dot', lid: 0.3, brow: 'worried', mouth: wrap < 1 || tw < 0.4 ? 'smirk' : 'teeth', look: 0.1, fx: tw > 0.5 ? ['sweat'] : [], tilt: 2 * Math.sin(t * 8) + 4 * tw * Math.sin(t * 22) };
        const X = XS + (rip ? 40 * eo(ra) : 0) + (tw > 0 && !rip ? 3 * Math.sin(t * 30) : 0);
        stK(t, X, pose, rip ? 0.4 : tw * 0.5, rip ? { L: [[X - 240, 1200], [X - 190, 1190]], R: [[X + 240, 1200], [X + 190, 1190]], white: false } : hold2(X, 1160, 150));
        if (!rip) { heldJar(t, { cx: X, rot: twist }); if (wrap > 0) { const k = eio(wrap); ctx.save(); ctx.translate(X, 1030 - 70 * (1 - k)); ctx.rotate(twist); ctx.globalAlpha = k; towel(0, 0, 300, 150, 0.1); ctx.restore(); } }
        else {   // rags: two halves swing down from his fists, the jar sits on the counter untouched
          heldJar(t, { cx: X - 20 + 30 * eo(ra), cy: lerp(1160, 1060, 0) });
          const sw = 0.25 * Math.sin(t * 14) * (1 - ra * 0.5);
          ctx.save(); ctx.translate(X - 190, 1215); ctx.rotate(sw); towel(0, 90, 110, 200, 0.1, true); ctx.restore();
          ctx.save(); ctx.translate(X + 190, 1215); ctx.rotate(-sw); towel(0, 90, 110, 200, -0.1, true); ctx.restore();
          if (t < T_RIP + 0.3) strokedText('RIIP', X, 780, 90, '#fff6dc', 14);
        }
      }, ...shake(t, rip && t < T_RIP + 0.2 ? 6 : 1.0, 35));
    }],
    // F · two rags: face close, deadpan
    [T_RAGS, t => {
      const bl = t > 6.15 && t < 6.27;
      cam(kf(t, [[T_RAGS, 2.2], [T_TAP, 2.5]], lin), 855, 990, () => {
        kw(t, { steam: 0, droop: 1, noSnug: true, props: false });
        const X = XS + 20, sw = 0.2 * Math.sin(t * 9);
        stK(t, X, { eyes: bl ? 'closed' : 'dot', lid: 0.55, brow: 'worried', mouth: 'line', look: -0.5 * eio(seg(t, 6.2, 6.4)), fx: ['sweat'], tilt: 4 * Math.sin(t * 3) }, 0.4, { L: [[X - 240, 1200], [X - 190, 1190]], R: [[X + 240, 1200], [X + 190, 1190]], white: false });
        ctx.save(); ctx.translate(X - 190, 1215); ctx.rotate(sw); towel(0, 90, 110, 200, 0.1, true); ctx.restore();
        ctx.save(); ctx.translate(X + 190, 1215); ctx.rotate(-sw * 0.8); towel(0, 90, 110, 200, -0.1, true); ctx.restore();
      });
    }],
    // G · s4 tap: walks in, jar upside down, lid under the hot stream; steam; hand goes red
    [T_TAP, t => {
      const walk = eo(seg(t, T_TAP, 7.3)), X = lerp(1250, 880, walk), hot = t >= 8.45, wince = t >= 8.45;
      const cx = X - 190, cy = 1010 - 8 * Math.sin(t * 30) * (t > 7.7 ? 1 : 0), rot = Math.PI - 0.25 + 0.05 * Math.sin(t * 24) * (t > 7.7 ? 1 : 0), run = t >= 7.35;
      cam(kf(t, [[T_TAP, 1.45], [T_TAPB, 1.7]], lin), 700, 1100, () => {
        kw(t, { props: false, noSnug: true });
        const nz = [cx + 30, 985];
        const pose = wince ? { eyes: 'closed', brow: 'worried', mouth: 'scream', look: 0, fx: ['sweat'], tilt: 6 * Math.sin(t * 40) } : { eyes: 'squint', brow: 'angry', mouth: 'teeth', look: -0.6, fx: ['sweat'], tilt: 2 * Math.sin(t * 20) };
        const hs = hot ? SK.hot : SK.n;
        stK(t, X + (wince ? 3 * Math.sin(t * 45) : 0), pose, wince ? 0.7 : 0.3, { L: [[X - 110, 1130], [cx + 110, cy + 40]], R: [[X - 40, 1190], [cx + 130, cy + 110]], skin: hs, white: !hot });
        jar(cx, cy, 0.3, { rot });
        { const p = spen(0.1, 207, 8); ctx.fillStyle = '#8c98a8'; ctx.fillRect(cx - 160, CY, 330, 60); p.line([[cx - 160, CY + 6], [cx + 170, CY + 6]], 6);
          p.line([[cx - 170, CY], [cx - 170, 880], [nz[0], 880], [nz[0], nz[1] - 10]], 26, '#c9d1dd'); p.line([[cx - 170, 880], [cx - 200, 855]], 16, '#c9d1dd'); }
        if (run) { ctx.save(); ctx.strokeStyle = '#8fd3f4'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.setLineDash([46, 26]); ctx.lineDashOffset = -t * 500; ctx.beginPath(); ctx.moveTo(nz[0], nz[1]); ctx.lineTo(nz[0], cy + 118); ctx.stroke(); ctx.restore(); }
        if (run) steamPuffs(cx + 30, 1120, t, t > 8.4 ? 1 : 0.7, 3, 22);
        if (t > 8.4 && t < 8.75) { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.5, r0 = 40 + 160 * seg(t, 8.4, 8.75); cloud(cx + 30 + Math.cos(a) * r0, 1100 + Math.sin(a) * r0, 34, 0.8 * (1 - seg(t, 8.4, 8.75))); } }
        if (t > 8.45) motionLines([[X - 60, 1060, X - 90, 1030], [X - 20, 1050, X - 30, 1010]], '#b3261e', 8);
      }, ...shake(t, wince && t < 8.7 ? 4 : 0.8, 40));
    }],
    // H · hand close: blows on his red fingers
    [T_TAPB, t => {
      const bl = t > 9.55 && t < 9.67, sh = 6 * Math.sin(t * 38);
      cam(kf(t, [[T_TAPB, 2.5], [T_KNIFE, 2.2]], lin), 835, 1010, () => {
        kw(t, { props: false, noSnug: true });
        const X = XS - 5, hx = X - 75 + sh * 0.4, hy = 1020 + sh;
        stK(t, X, { eyes: bl ? 'closed' : 'squint', brow: 'worried', mouth: chat(t, 7) ? 'O' : 'small', look: -0.4, fx: ['sweat'], tilt: -3 }, 0.6, { L: [[X - 160, 1070], [hx, hy]], R: [[X + 130, 1190], [X + 220, 1290]], skin: SK.hot, white: false });
        jar(X + 240, 1290, 0.3, { rot: 0.3 });
        const k = (t * 5) % 1; for (let i = 0; i < 3; i++) { const q = (k + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - q; motionLines([[X - 40 - 50 * q, 960 + 14 * i, X - 70 - 90 * q, 950 + 24 * i]], '#7fb8e8', 8); ctx.restore(); }
        motionLines([[hx - 60, hy - 50, hx - 90, hy - 80], [hx + 30, hy - 70, hx + 30, hy - 110]], '#b3261e', 8);
      });
    }],
    // I · s5 silent: knife tap-tap-tap round the lid; the blade folds into an L
    [T_KNIFE, t => {
      const hits = [10.85, 11.2, 11.55], bend = seg(t, 11.9, 12.05), jx = 690;
      const dip = Math.max(...hits.map(h => pulse(t, h, 0.08, 0.02, 0.12)));
      const bendHit = pulse(t, 11.9, 0.1, 0.04, 0.12);
      cam(kf(t, [[T_KNIFE, 1.5], [T_FACE, 1.9]], lin), 760, 1060, () => {
        kw(t, { props: false, noSnug: true });
        const X = XS, pose = { eyes: 'dot', lid: 0.55, brow: 'angry', mouth: 'line', look: -0.5, fx: ['sweat'], tilt: 1 };
        stK(t, X, pose, 0.5, { L: [[X - 130, 1180], [jx + 20, 1090]], noFist: false, white: false, R: [[X - 100 + (jx - X) * 0.3, 1090 - 60 * dip], [jx + 90, 1010 - 40 * dip + 30 * (1 - dip) - 14]] });
        jar(jx, 1190 - 125 - 0, 0.3, { rot: 0.02 * dip });
        knife(jx + 150, 1005 + 28 * dip - (t < 10.7 ? 40 * seg(t, 10.48, 10.7) : 0) + 10, Math.PI * 0.92 - 0.12 * dip, bend);
        for (const h of hits) if (t > h && t < h + 0.2) strokedText('tink', jx - 20 - 60 * (h - 10.85), 800 - 30 * (t - h) * 5, 52, '#fff6dc', 10);
        if (bendHit > 0) strokedText('BOING', jx + 60, 760, 60, '#fff6dc', 12);
      }, ...shake(t, bendHit > 0 ? 5 : 0, 45));
    }],
    // J · face close: he turns the bent knife, looks at it, at us
    [T_FACE, t => {
      const bl = t > 12.8 && t < 12.92, wob = Math.sin(t * 9);
      cam(kf(t, [[T_FACE, 2.1], [T_PEAK, 2.5]], lin), 820, 960, () => {
        kw(t, { props: false, noSnug: true });
        const X = XS - 10, kx = X - 110 + 6 * wob, ky = 1000;
        stK(t, X, { eyes: bl ? 'closed' : 'dot', lid: 0.5, brow: 'angry', mouth: 'line', look: t < 12.6 ? -0.8 : 0.0, fx: ['sweat'], tilt: 4 + 3 * wob }, 0.6, { L: [[X - 180, 1180], [kx, ky + 90]], R: [[X + 130, 1190], [X + 200, 1290]], white: false });
        knife(kx - 8, ky + 50 + 8 * wob, -Math.PI / 2 + 0.15 * wob, 1);
      });
    }],
    // K · s6 PEAK on the floor (three stabs + shake), spin, POP
    [T_PEAK, t => {
      const hard = Math.max(pulse(t, 13.52, 0.06, 0.1, 0.25), pulse(t, 13.95, 0.06, 0.1, 0.25));
      const sk = (t >= 13.52 && t < 13.62) || (t >= 13.95 && t < 14.05) ? 1 : 0;
      cam(1.1 * (1 + 0.06 * sk), 560, 1260, () => floorWorld(t, { th: 20 + 12 * Math.sin(t * 16) * 0.5 - 10 * hard, jarRot: -0.1 - 0.35 * hard + 0.05 * Math.sin(t * 40), arrows: true }), ...shake(t, sk * 16, 190));
    }],
    [T_SPIN, t => {
      const sp = seg(t, T_SPIN, 14.85), sk = (t >= 14.85 && t < 14.95) ? 1 : 0;
      cam(kf(t, [[T_SPIN, 0.95], [T_POP, 1.15]], lin), 540, 1200, () => floorWorld(t, { th: 20, spin: eio(sp) * Math.PI * 2, jarRot: -0.1 - 0.3 * seg(t, 14.7, 14.9), arrows: false }), ...shake(t, sk * 16, 190));
    }],
    [T_POP, t => {
      const d = t - T_POP, lidP = kf(t, [[T_POP, 0], [T_POP + 0.17, 1], [T_POP + 0.43, 2], [T_POP + 0.75, 3]], lin);
      const pts = [[440, 1170], [800, 640], [520, 330], [250, 1420]];
      const i = Math.min(2, Math.floor(lidP)), f = lidP - i, lx = lerp(pts[i][0], pts[i + 1][0], f), ly = lerp(pts[i][1], pts[i + 1][1], f);
      const sk = d < 0.12 ? 1 : (d > 0.17 && d < 0.27) ? 0.6 : 0;
      cam(kf(t, [[T_POP, 1.0], [T_TROPHY, 0.95]], lin), 540, 1000, () => {
        floorWorld(t, { th: kf(t, [[T_POP, 8], [T_POP + 0.5, -25], [T_TROPHY, -35]], eo), jarRot: -0.05, popped: true, spin: 0, mouth: 'O' });
        if (d < 0.2) burst(440, 1130, 60, 150, 9, '#ffe27a', d * 8);
        motionLines([[360, 1060, 330, 960], [440, 1050, 440, 940], [530, 1060, 570, 960]], '#5b86c9', 9);
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(d * 20); ginghamLid(0, 0, 220, 80, 17); ctx.restore();
        if (d > 0.15 && d < 0.35) strokedText('POP!', 700, 480, 110, '#fff6dc', 16);
        if (d > 0.17 && d < 0.4) burst(820, 650, 30, 80, 8, '#ffe27a', 0.3);
      }, ...shake(t, sk * 18, 190));
    }],
    // L · trophy: he lies flat and holds the open jar up; then slow look inside
    [T_TROPHY, t => {
      const tro = seg(t, T_TROPHY, T_TROPHY + 0.45);
      cam(kf(t, [[T_TROPHY, 1.0], [T_LOOK, 1.12]], lin), 540, 1000, () => punchWorld(t, { trophy: tro, lid: 0.3, mouth: t < 16.2 ? 'O' : 'line', bob: 5 * Math.sin(t * 7) * (t < 16.3 ? 1 : 0.2) }), ...shake(t, t < T_TROPHY + 0.2 ? 8 : 0, 150));
    }],
    [T_LOOK, t => {   // close: he peers into the jar
      const bl = t > 17.55 && t < 17.67;
      cam(kf(t, [[T_LOOK, 1.6], [T_PAN, 1.8]], lin), 380, 1150, () => punchWorld(t, { trophy: 1, blink: bl, lid: 0.5, look: t < 17.3 ? -0.6 : 0.6, mouth: 'line' }));
    }],
    // M · row 7 pan: pickles -> toast -> jam jar with the SAME lid; he blinks
    [T_PAN, t => {
      const fx = kf(t, [[T_PAN, 380], [18.55, 200], [19.0, 200], [19.75, 690]], eio), fy = kf(t, [[T_PAN, 1150], [18.55, 520], [19.0, 520], [19.75, 330]], eio), z = kf(t, [[T_PAN, 1.8], [18.55, 1.9], [19.75, 2.2]], eio);
      cam(z, fx, fy, () => punchWorld(t, { trophy: 1, lid: 0.5, look: -0.6, mouth: 'line' }));
    }],
    [19.75, t => {   // hold on the jam jar's lid, then snap back to Steve (cut at the punch)
      cam(kf(t, [[19.75, 2.2], [T_PUNCH, 2.5]], lin), 690, 330, () => punchWorld(t, { trophy: 1, look: 0.5 }), ...shake(t, 0.8, 21));
    }],
    // N · PUNCH: hold on Steve flat, jar on his chest; one pickle rolls onto the tie
    [T_PUNCH, t => {
      const k = seg(t, 21.0, 21.8), bl = t > 22.3 && t < 22.42;
      cam(kf(t, [[T_PUNCH, 1.0], [T_BTN, 1.05]], lin), 540, 960, () => punchWorld(t, { pickleK: k, blink: bl, bob: 1.5 * Math.sin(t * 2), lid: 0.5 }));
    }],
    // O · BUTTON: he grips the jam jar; it creaks; he goes red again
    [T_BTN, t => {
      const heat = seg(t, T_BTN + 0.4, T_LOOP), jc = 3 * Math.sin(t * 28) * seg(t, T_BTN + 0.5, T_LOOP), jx = 660;
      cam(kf(t, [[T_BTN, 1.5], [T_LOOP, 1.9]], lin), 760, 1020, () => {
        kw(t, { jamFront: true, noSnug: true, steam: 0, droop: 1 });
        const X = XS;
        stK(t, X, { eyes: t < T_BTN + 0.5 ? 'dot' : 'squint', lid: 0.3, brow: t < T_BTN + 0.5 ? 'worried' : 'angry', mouth: t < T_BTN + 0.5 ? 'line' : 'teeth', look: -0.5, fx: heat > 0.3 ? ['vein', 'sweat'] : ['sweat'], tilt: 1.5 * Math.sin(t * 17) * heat }, heat, { L: [[X - 150, 1090], [jx + 135 + jc, 1085]], R: [[X - 40, 1200], [jx - 135 + jc, 1105]], white: heat > 0.5 });
        jamJar(jx + jc, 975, 1.0, 0.012 * Math.sin(t * 31) * heat);
        if (t > T_BTN + 0.5 && t < T_BTN + 0.85) strokedText('creeak', jx + 20, 800, 60, '#fff6dc', 12);
      }, ...shake(t, 1.5 * heat, 33));
    }],
    // P · LOOP: push-in onto frame 1
    [T_LOOP, t => { cam(kf(t, [[T_LOOP, 0.9], [DUR, 1.0]], lin), 540, 1000, () => hookWorld(t, { mouth: chat(t, 10) ? 'teeth' : 'line', heat: 0.6 + 0.4 * seg(t, T_LOOP, DUR - 0.1) }), ...shake(t, 1.5, 33)); }],
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
  if (t < 2.2 || t >= T_LOOP) title("POV: the jar won't open");
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
