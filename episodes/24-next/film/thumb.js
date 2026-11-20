// UNIT 4B · 24 "The Lid" (Tập 15) — 3 KEY STILLS, full-bleed 9:16 panel. render(0|1|2).
// 0 = frame-1 hook (giant jar, red gingham lid, label all the way round), 1 = PEAK row 6 (floor twist, lid pops), 2 = PUNCH row 7/8 (pickles on chest, twin lid on the jam jar).
import { drawCharacter, paper, panel } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const INK = '#2a2230', TITLE_Y = 232;
const SKIN = '#e2ac84';
const spen = (t, seed, lw = 3) => { const p = new VPen(ctx, 0, 0, 1, { lw, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
// pen in Steve/Snuggles local units (same mapping drawCharacter uses)
const lpen = (X, Y, s, seed = 5) => new VPen(ctx, X, Y, s, { lw: Math.max(2.4, s * 0.95), hand: true, frame: boilFrame(0.1), seed });
function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
function strokedText(s, x, y, size, fill = '#fff', lw = 10) {
  ctx.save(); ctx.font = `600 ${size}px "Fredoka"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.strokeText(s, x, y); ctx.fillStyle = fill; ctx.fillText(s, x, y); ctx.restore();
}
function title(T) {   // inside the panel, top; clears y 170 (iPhone safe area)
  ctx.save(); ctx.font = '600 56px Fredoka'; const w = ctx.measureText(T).width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 52, w, 104, 52); ctx.fill();
  text(T, 540, TITLE_Y + 3, 56, '#fff6dc'); ctx.restore();
}
function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };


const RED = '#d6342b';
const SK = { n: SKIN, hot: '#e65a3c', flush: '#e98a62' };
function steve(X, Y, s, pose, skin) { window.STEVE_SKIN = skin; drawCharacter(ctx, 'steve', X, Y, s, { hair: 0, arm: 'down', noShadow: true, ...pose }, { frame: boilFrame(0.1) }); }
const NOARM = { hand: [0.01, 0.01] };
function armTube(pts, w, skin, seed = 31) { spen(0.1, seed, 5).tube(pts, w, skin); }
function poly2(pts, fill, lw = 5, seed = 3) { const p = spen(0.1, seed, lw); p.part(pts, fill, { shade: false, lw }); return p; }

// ---------- kitchen ----------
function kitchen(counterY, floorY, { fridge = false, cabinets = true } = {}) {
  ctx.fillStyle = '#f4e3ae'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (let y = 60; y < counterY; y += 120) for (let x = (y / 120 % 2 ? 40 : 100); x < W; x += 160) { ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill(); }
  const p = spen(0.1, 40, 6);
  if (counterY < H) {   // tiled backsplash
    const top = counterY - 250;
    for (let r = 0; top + r * 62 < counterY; r++) for (let c = -1; c * 100 < W + 100; c++) { ctx.fillStyle = (r + c) % 2 ? '#cfe7e3' : '#e3f2ef'; ctx.fillRect(c * 100 + (r % 2 ? 50 : 0), top + r * 62, 100, 62); }
    p.line([[-10, top], [W + 10, top]], 6, '#7fa8a2');
    for (let y = top + 62; y < counterY; y += 62) p.line([[-10, y], [W + 10, y]], 3, '#9fc3bd');
    // counter top + cabinets
    poly2([[-10, counterY], [W + 10, counterY], [W + 10, counterY + 46], [-10, counterY + 46]], '#d9c6a0', 7, 41);
    if (cabinets) {
      ctx.fillStyle = '#8fb39a'; ctx.fillRect(0, counterY + 46, W, floorY - counterY - 46);
      p.line([[-10, counterY + 46], [W + 10, counterY + 46]], 6);
      for (let x = 0; x < W; x += 360) { poly2([[x + 20, counterY + 76], [x + 340, counterY + 76], [x + 340, floorY - 30], [x + 20, floorY - 30]], '#a2c4ab', 5, 50 + x); ctx.fillStyle = '#6b5a45'; ctx.fillRect(x + 290, counterY + 100, 14, 70); }
    }
  }
  // wooden floor
  ctx.fillStyle = '#c99a63'; ctx.fillRect(0, floorY, W, H - floorY);
  for (let y = floorY, r = 0; y < H; y += 120, r++) { ctx.fillStyle = r % 2 ? '#bd8d57' : '#d3a46d'; ctx.fillRect(0, y, W, 120); for (let x = (r % 2 ? 120 : 380); x < W; x += 480) { ctx.fillStyle = 'rgba(80,50,20,0.25)'; ctx.fillRect(x, y, 5, 120); } }
  p.line([[-10, floorY], [W + 10, floorY]], 9);
  ctx.fillStyle = 'rgba(40,30,20,0.12)'; ctx.fillRect(0, floorY, W, 24);
  if (fridge) {
    poly2([[820, 180], [1100, 180], [1100, floorY + 10], [820, floorY + 10]], '#eef2f5', 8, 70);
    p.line([[820, 640], [1100, 640]], 8);
    ctx.fillStyle = '#9aa1b6'; ctx.fillRect(850, 400, 18, 170); ctx.fillRect(850, 700, 18, 200);
  }
}

// ---------- the jar ----------
function jarPoly(cx, top, w, h, nw, sh = 150) {
  return roundPoly([[cx - nw / 2, top], [cx + nw / 2, top], [cx + nw / 2, top + sh * 0.35], [cx + w / 2, top + sh], [cx + w / 2, top + h], [cx - w / 2, top + h], [cx - w / 2, top + sh], [cx - nw / 2, top + sh * 0.35]], Math.min(70, w * 0.15), 5);
}
function glassBody(cx, top, w, h, nw, sh, tint = '#cfe6df', lw = 8) {
  const pts = jarPoly(cx, top, w, h, nw, sh), p = spen(0.1, 101, lw);
  p.part(pts, tint, { shade: false, lw });
  ctx.save(); ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
  const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, 'rgba(40,80,70,0.22)'); g.addColorStop(0.18, 'rgba(255,255,255,0)'); g.addColorStop(0.8, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(40,80,70,0.25)'); ctx.fillStyle = g; ctx.fillRect(cx - w / 2, top, w, h);
  ctx.restore();
  return pts;
}
// paper label wrapped round the glass: curved top/bottom edges (we see the cylinder from slightly above), dark edge shading, no brand, plain sun doodle
function label(cx, y0, y1, w, sag = 40, doodle = true) {
  const n = 24, top = [], bot = [];
  for (let i = 0; i <= n; i++) { const u = i / n, x = cx - w / 2 + u * w, b = Math.sin(Math.PI * u) * sag; top.push([x, y0 + b]); bot.push([x, y1 + b]); }
  const pts = [...top, ...bot.reverse()], p = spen(0.1, 111, 6);
  p.part(pts, '#f3e4c0', { shade: false, lw: 6 });
  ctx.save(); ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
  const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, 'rgba(90,60,30,0.38)'); g.addColorStop(0.16, 'rgba(255,255,255,0)'); g.addColorStop(0.85, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(90,60,30,0.4)'); ctx.fillStyle = g; ctx.fillRect(cx - w / 2, y0 - 10, w, y1 - y0 + sag + 20);
  if (doodle) {   // plain doodle: sun-ish circle with rays and a wavy line under it
    const my = (y0 + y1) / 2 + sag * 0.9, d = spen(0.1, 112, 7), col = '#a9503a';
    d.outline(ellipsePts(cx, my - 20, 78, 78, 40), true, 8, col);
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; d.line([[cx + Math.cos(a) * 104, my - 20 + Math.sin(a) * 104], [cx + Math.cos(a) * 140, my - 20 + Math.sin(a) * 140]], 8, col); }
    d.line([[cx - 190, my + 150], [cx - 120, my + 120], [cx - 50, my + 150], [cx + 20, my + 120], [cx + 90, my + 150], [cx + 160, my + 120], [cx + 200, my + 140]], 8, col);
  }
  ctx.restore();
}
// red gingham lid (rounded slab with ridges). period = check size
function ginghamLid(cx, cy, w, h, period, rot = 0) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  const pts = roundPoly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], Math.min(h * 0.3, 34), 5), p = spen(0.1, 121, Math.max(4, h * 0.05));
  p.part(pts, '#fbf1e6', { shade: false, lw: Math.max(5, h * 0.055) });
  ctx.save(); ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
  ctx.fillStyle = 'rgba(214,52,43,0.62)';
  for (let x = -w / 2 + period * 0.25; x < w / 2; x += period * 2) ctx.fillRect(x, -h / 2, period, h);
  for (let y = -h / 2 + period * 0.25; y < h / 2; y += period * 2) ctx.fillRect(-w / 2, y, w, period);
  ctx.fillStyle = 'rgba(255,255,255,0.38)'; ctx.fillRect(-w / 2 + 14, -h / 2 + 8, w * 0.5, Math.max(4, h * 0.07));   // shine
  ctx.fillStyle = 'rgba(60,10,10,0.18)'; ctx.fillRect(-w / 2, h / 2 - h * 0.16, w, h * 0.16);
  ctx.restore();
  p.outline(pts, true, Math.max(5, h * 0.055));
  ctx.restore();
}
// a fist (white knuckles when gripping)
function fist(x, y, r, white = true, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const p = spen(0.1, 131, 5);
  p.part(ellipsePts(0, 0, r * 1.15, r * 0.9, 28), white ? '#f7ede2' : SKIN, { shade: false, lw: 6 });
  for (let i = -1.5; i <= 1.5; i++) { const kx = i * r * 0.5; p.line([[kx - r * 0.12, -r * 0.5], [kx, -r * 0.3], [kx + r * 0.12, -r * 0.5]], 4, '#a68d78'); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(kx, -r * 0.62, r * 0.13, 0, 7); ctx.fill(); }
  ctx.restore();
}
function vein(x, y, len, rot = 0, lw = 6) { const p = spen(0.1, 141 + Math.floor(x), lw); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); p.line([[0, 0], [len * 0.3, -len * 0.18], [len * 0.55, len * 0.1], [len * 0.8, -len * 0.12], [len, 0]], lw, '#c7283c'); p.line([[len * 0.3, -len * 0.18], [len * 0.45, -len * 0.4]], lw * 0.7, '#c7283c'); ctx.restore(); }
function motionLines(list, col = INK, lw = 8) { const p = spen(0.1, 151, lw); for (const [x0, y0, x1, y1] of list) p.line([[x0, y0], [x1, y1]], lw, col); }
function burst(x, y, r0, r1, n, fill, rot = 0) {
  const pts = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, r = i % 2 ? r0 : r1; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  poly2(pts, fill, 6, 161);
}
function pickle(x, y, len, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const p = spen(0.1, 171, 5); p.part(roundPoly([[-len / 2, -len * 0.17], [len / 2, -len * 0.17], [len / 2, len * 0.17], [-len / 2, len * 0.17]], len * 0.16, 4), '#86b23c', { shade: false, lw: 5 });
  ctx.fillStyle = '#5f8a2a'; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(i * len * 0.13, ((i * 7) % 3 - 1) * len * 0.06, len * 0.022, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(-len * 0.38, -len * 0.12, len * 0.5, len * 0.04);
  ctx.restore();
}
function cloud(x, y, r, a = 0.9) {
  const parts = [[0, 0, r], [r * 0.9, r * 0.15, r * 0.75], [-r * 0.9, r * 0.2, r * 0.7], [r * 0.35, -r * 0.6, r * 0.7]].map(([dx, dy, rr]) => [x + dx, y + dy, rr]);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(42,34,48,0.5)'; ctx.lineWidth = 5; parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke(); });
  ctx.fillStyle = '#fff'; parts.forEach(([cx, cy, rr]) => { ctx.beginPath(); ctx.arc(cx, cy, rr - 2, 0, 7); ctx.fill(); }); ctx.restore();
}

// ---------- Snuggles ----------
function snuggles(X, Y, s, pose) { drawCharacter(ctx, 'snuggles', X, Y, s, { noShadow: true, ...pose }, { frame: boilFrame(0.1) }); }

// ---------- STILL 1 · HOOK ----------
function still1(t) {
  kitchen(2200, 2200);
  glowBlob(540, 700, 800, 'rgba(255,120,90,0.18)');
  const s = 16, X = 540, hcY = 610, Y = hcY + 80 * s;
  steve(X, Y, s, { eyes: 'squint', brow: 'angry', mouth: 'teeth', look: 0, fx: ['vein', 'sweat'], arm: NOARM, armL: NOARM, armR: NOARM }, SK.hot);
  // strain: veins on the forehead + dark-red effort ticks round the head
  vein(430, 400, 70, -0.4); vein(590, 390, 80, 0.5, 7); vein(500, 372, 50, -0.1, 5);
  motionLines([[250, 470, 205, 440], [235, 560, 180, 560], [250, 650, 205, 680], [830, 470, 875, 440], [845, 560, 900, 560], [830, 650, 875, 680]], '#b3261e', 9);
  // arms up to the lid, jar, label, lid, white-knuckle fists
  armTube([[430, 930], [320, 900], [290, 985]], 58, SK.hot, 33);
  armTube([[650, 930], [760, 900], [790, 985]], 58, SK.hot, 34);
  vein(330, 905, 70, 0.3); vein(740, 905, 70, -0.3);
  glassBody(540, 1062, 930, 835, 600, 170);
  label(540, 1240, 1800, 930, 46, true);
  ginghamLid(540, 1010, 660, 140, 24);
  fist(270, 1000, 66); fist(810, 1000, 66);
  // the jar wobbles under the strain
  motionLines([[40, 1330, 16, 1290], [30, 1480, 0, 1480], [40, 1630, 14, 1670], [1040, 1330, 1064, 1290], [1050, 1480, 1080, 1480], [1040, 1630, 1066, 1670]], INK, 10);
}

// ---------- STILL 2 · PEAK (row 6): on the floor, full-body twist, the lid just pops ----------
function still2(t) {
  kitchen(560, 1090, { fridge: true });
  const s = 14, X = 420, F = 1500, Y = F + 34 * s, th = 20 * Math.PI / 180;
  const hip = [X, Y - 38 * s], rot = (lx, ly) => [hip[0] + (lx * Math.cos(th) + ly * Math.sin(th)) * s, hip[1] + (lx * Math.sin(th) - ly * Math.cos(th)) * s];
  const [hx, hy] = rot(0, 42), sh = rot(0, 22);
  glowBlob(hx, hy, 500, 'rgba(255,120,90,0.16)');
  steve(X, Y, s, { eyes: 'squint', brow: 'angry', mouth: 'scream', look: 0.4, fx: ['vein', 'sweat'], lean: 20, tilt: -14, armL: NOARM, armR: NOARM,
    legPts: [[[0, 38], [-19, 52], [-9, 34]], [[0, 38], [21, 50], [12, 34]]] }, SK.hot);
  const jx = 440, jtop = 1190, jh = 290, jw = 370;
  armTube([[sh[0] - 16, sh[1] + 8], [jx - 260, sh[1] + 60], [jx - jw / 2 - 10, jtop + 70]], 50, SK.hot, 33);
  vein(jx - 330, sh[1] + 40, 60, 0.3);
  ctx.save(); ctx.translate(jx, jtop + jh / 2); ctx.rotate(-0.1); ctx.translate(-jx, -(jtop + jh / 2));
  glassBody(jx, jtop, jw, jh, 250, 90, '#cfe6df', 7);
  label(jx, jtop + 110, jtop + jh - 22, jw, 20, false);
  ctx.restore();
  armTube([[sh[0] + 20, sh[1] + 4], [jx + 270, sh[1] + 10], [jx + jw / 2 + 10, jtop + 50]], 50, SK.hot, 34);
  fist(jx - jw / 2 - 12, jtop + 74, 48); fist(jx + jw / 2 + 12, jtop + 54, 48);
  // twist arrows around the jar
  { const p = spen(0.1, 90, 12); const arc = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * (0.1 + 0.85 * i / 14); arc.push([jx + Math.cos(a) * 250, jtop + jh + 22 + Math.sin(a) * 50]); }
    p.line(arc, 12, '#f2c14e'); p.line([[arc[14][0] + 4, arc[14][1] - 40], [arc[14][0], arc[14][1]], [arc[14][0] + 44, arc[14][1] - 8]], 12, '#f2c14e'); }
  // POP: lid flying off, star burst + motion lines + juice
  burst(790, 640, 62, 132, 9, '#ffe27a', 0.3);
  ginghamLid(790, 640, 220, 80, 17, 0.55);
  motionLines([[740, 860, 720, 770], [800, 880, 800, 790], [860, 860, 890, 780], [610, 700, 660, 660], [980, 520, 940, 560]], INK, 9);
  motionLines([[jx - 90, jtop - 30, jx - 120, jtop - 100], [jx + 20, jtop - 40, jx + 20, jtop - 120]], '#5b86c9', 8);
  vein(hx - 80, hy - 170, 70, -0.4); vein(hx + 60, hy - 180, 60, 0.4, 6);
  motionLines([[hx - 250, hy - 40, hx - 300, hy - 70], [hx - 260, hy + 50, hx - 315, hy + 60]], '#b3261e', 9);
}

// ---------- STILL 3 · PUNCH (row 7/8): on his back, open pickle jar on his chest, one pickle on the tie; twin lid on the jam jar ----------
function still3(t) {
  kitchen(520, 800);
  ctx.save(); ctx.translate(0, -140);
  // counter props: toast plate, toaster, JAM jar with the SAME gingham lid
  { const p = spen(0.1, 201, 6);
    p.part(ellipsePts(190, 640, 150, 34, 30), '#f6f3ee', { shade: false, lw: 6 });
    for (const [dx, dy, r] of [[-30, -34, 0.06], [38, -44, -0.1]]) { ctx.save(); ctx.translate(190 + dx, 640 + dy); ctx.rotate(r); p.part(roundPoly([[-52, -50], [52, -50], [52, 40], [-52, 40]], 24, 4), '#d9a15a', { shade: false, lw: 6 }); ctx.fillStyle = '#c47f35'; ctx.fillRect(-36, -34, 72, 54); ctx.restore(); }
    // toaster
    p.part(roundPoly([[290, 650], [500, 650], [500, 520], [290, 520]], 40, 4), '#b8bfcc', { shade: false, lw: 7 });
    p.line([[320, 540], [470, 540]], 6); ctx.fillStyle = '#3a3548'; ctx.fillRect(320, 565, 150, 12); ctx.fillStyle = '#c0392b'; ctx.fillRect(465, 604, 20, 18);
  }
  { const jx = 680, jt = 440;
    glassBody(jx, jt, 250, 220, 190, 50, '#dfe9e1', 6);
    ctx.save(); ctx.beginPath(); ctx.rect(jx - 125, jt + 70, 250, 160); ctx.clip(); ctx.fillStyle = '#9c2f5c'; ctx.fillRect(jx - 125, jt + 70, 250, 160); ctx.restore();
    glassBody(jx, jt, 250, 220, 190, 50, 'rgba(0,0,0,0)', 6);
    label(jx, jt + 100, jt + 195, 250, 14, false);
    text('JAM', jx, jt + 152, 50, '#8a1c2b', 'Fredoka');
    ginghamLid(jx, jt - 8, 210, 70, 17); }
  // Snuggles on the counter, looking down at Steve, deadpan
  snuggles(900, 660, 6.2, { eyes: 'dot', lid: 0.55, look: -0.9, mouth: 'line', tilt: -6, tail: 0.3 });
  ctx.restore();
  // Steve flat on his back across the frame: head left, face upright and big, feet off to the right
  const s = 11, px = 1066, py = 1180;
  ctx.fillStyle = 'rgba(40,30,20,0.14)'; ctx.beginPath(); ctx.ellipse(540, py + 100, 520, 26, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(px, py); ctx.rotate(-Math.PI / 2);
  steve(0, 0, s, { eyes: 'dot', lid: 0.45, brow: 'worried', mouth: 'line', look: 0.3, fx: ['sweat'], tilt: 90, armL: 'hold', armR: 'hold' }, SKIN);
  const p = lpen(0, 0, s, 9);
  const tie = roundPoly([[-2.6, 61], [2.6, 61], [3.4, 56], [3.8, 42.5], [0, 39], [-3.8, 42.5], [-3.4, 56]], 1, 3);
  p.part(tie, '#2f5fa8', { shade: false, lw: 5 }); p.part(roundPoly([[-2.8, 62.6], [2.8, 62.6], [2.2, 58.6], [-2.2, 58.6]], 1, 2), '#244a85', { shade: false, lw: 5 });
  p.line([[-2.4, 52], [2.4, 49]], 4, '#9fc0ea'); p.line([[-2.8, 46], [2.8, 43]], 4, '#9fc0ea');
  ctx.restore();
  // open jar lying tilted on his chest, mouth up-right, pickles inside and spilling
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
  // pickles that fell out: one on his belly by the mouth, one on the floor, and ONE on the tie
  pickle(930, py - 60, 170, 0.5);
  pickle(560, py + 120, 170, -0.25);
  pickle(448, py - 8, 118, -0.1);
  ctx.fillStyle = 'rgba(206,214,110,0.8)'; ctx.beginPath(); ctx.ellipse(880, py + 40, 12, 20, 0.3, 0, 7); ctx.fill();
  fist(640, py - 70, 44, false);
}

const STILLS = [still1, still2, still3], TXT = [['WON’T', 'OPEN'], ['COME… ON!'], ['WRONG JAR.']];
function render(i) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); STILLS[Math.round(i)](0.1); ctx.restore();
  panel(ctx, 6, 6, W - 12, H - 12, 5, null, boilFrame(0.1));
  const L = TXT[Math.round(i)]; L.forEach((l, k) => strokedText(l, 540, 215 + k * 150 - (L.length - 1) * 60, L.length > 1 ? 150 : (L[0].length > 9 ? 112 : 140), '#fff6dc', 22));
}
window.render = render; window.TEXTS = () => []; window.DUR = 3;
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  render(0); window.READY = true;
})();
