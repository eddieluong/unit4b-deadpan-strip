// UNIT 4B · 23 "Every Floor" (Tập 14) — FULL FILM, ~26 s. Worlds = the approved key stills (lift.js, lifted from stills.js) + animation.
// Timings: voice/film_timeline.json (retime.py). Punch s8 at ~20.7 (79 %). Beats are listed in build().
import { paper, panel, nameTab, drawCharacter, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts } from './lib/cast_v2.js';
import { boilFrame, ease } from './lib/motion.js';
import { W, H, ctx, INK, spen, text, strokedText, title, glowBlob, cloud, armTube, MUSTARD, SK, steve, liftWall, lbtn, glowOn, plate, floorDisplay, bag, neighbour, hash, NOARM } from './lift.js';

const PL_Y = 1500;
let TL = null, DUR = 26, LN = {};
const lerp = (a, b, k) => a + (b - a) * k;
const clamp01 = k => Math.max(0, Math.min(1, k)), seg = (t, a, b) => clamp01((t - a) / (b - a));
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
function cam(zoom, fx, fy, fn, dx = 0, dy = 0) { ctx.save(); ctx.translate(540 + dx, 960 + dy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const talking = (id, t) => { const l = LN[id]; return !!l && t >= l.start && t <= l.end; };
const chat = (t, hz = 10) => Math.floor(t * hz) % 2 === 0;

// ---------- key times ----------
const DING = [4.70, 8.20, 10.40, 11.03, 11.66, 12.29, 12.92, 13.55, 14.18];   // montage slots start on a DING (9 → 3)
const SLOT = 0.63, M0 = 10.40, PEAK0 = 14.82, POP = 16.52, CALM = 17.6, OFF0 = 18.30, PUNCH = 20.697, SHUF = 23.5, LOOP0 = 24.4;
const flo = t => t < 4.45 ? 12 : t < 7.55 ? 11 : t < 10.4 ? 10 : t < M0 + 7 * SLOT ? 9 - Math.min(6, Math.floor((t - M0) / SLOT)) : t < PUNCH ? 2 : 'G';
const decay = t => seg(t, M0, 14.8);

// ---------- captions (stroked, y ~1500, never over a face) ----------
function capText(spk, lines, stress) {
  ctx.save(); let size = lines.length > 1 ? 86 : 100; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.font = `600 ${size}px Fredoka`; const widest = Math.max(...lines.map(l => ctx.measureText(l).width)); if (widest > 960) size = Math.floor(size * 960 / widest);
  ctx.font = `600 ${size}px Fredoka`;
  lines.forEach((ln, li) => {
    const ws = ln.split(' '), gap = 22, wd = ws.map(w => ctx.measureText(w).width); let x = 540 - (wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
    const y = PL_Y + 40 + (li - (lines.length - 1) / 2) * (size + 8);
    ws.forEach((w, i) => { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(w, x, y); ctx.fillStyle = stress.some(s => w.startsWith(s)) ? '#ffd84a' : '#fff'; ctx.fillText(w, x, y); x += wd[i] + gap; });
  });
  ctx.restore();
  if (spk !== 'nana') nameTab(ctx, 70, PL_Y - 95, spk, 34);
}
const CAPS = {   // id: [speaker tab, lines, stress, hold after voice end]
  s1: ['steve', ['Come on. I’m LATE.'], ['LATE'], 0.15], s2: ['snuggles', ['Twelve floors.', 'ONE lift.'], ['ONE'], 0.25],
  s3: ['steve', ['…NOBODY.'], ['…NOBODY'], 0.2], s4: ['steve', ['NOBODY.'], ['NOBODY'], 0.2],
  s6: ['steve', ['CLOSE! Close! CLOSE!'], ['CLOSE!'], 0.15], s8: ['nana', ['Every MORNING,', 'young man.'], ['MORNING'], 0.4],
};
function captions(t) {
  for (const l of TL.lines) {
    const c = CAPS[l.id]; if (!c) continue;
    if (t >= l.start - 0.03 && t <= l.end + c[3]) { capText(c[0], c[1], c[2]); return { id: l.id, text: c[1].join(' '), x0: 40, y0: PL_Y - 60, x1: 1040, y1: PL_Y + 130 }; }
  }
  return null;
}

// ---------- shared bits ----------
function coffee(cx, cy, t, tilt = 0, steam = 1) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(tilt); ctx.translate(-cx, -cy); const p = spen(t, 66, 6);
  p.part(roundPoly([[cx - 52, cy - 62], [cx + 52, cy - 62], [cx + 40, cy + 62], [cx - 40, cy + 62]], 10), '#f4efe6', { shade: 0.15, lw: 7 });
  ctx.fillStyle = '#8a5a3a'; ctx.fillRect(cx - 47, cy - 30, 94, 38); p.line([[cx - 47, cy - 30], [cx + 47, cy - 30]], 5); p.line([[cx - 47, cy + 8], [cx + 47, cy + 8]], 5);
  if (steam > 0) { for (let i = 0; i < 2; i++) { const ph = (t * 0.8 + i * 0.5) % 1; cloud(cx - 4 + 12 * i + 8 * Math.sin(t * 4 + i), cy - 100 - 90 * ph - 40 * i, 20 + 6 * ph, 0.9 * steam * Math.sin(Math.PI * ph)); } }
  ctx.restore();
}
function drop(x, y, r = 11, col = '#bfe6ff') {
  ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y - r * 2); ctx.quadraticCurveTo(x + r * 1.1, y - r * 0.3, x + r, y + r * 0.2); ctx.arc(x, y + r * 0.2, r, 0, Math.PI); ctx.quadraticCurveTo(x - r * 1.1, y - r * 0.3, x, y - r * 2); ctx.fill(); ctx.stroke(); ctx.restore();
}
const LABELS = [['close', 'open'], ['12', '11'], ['10', '9'], ['8', '7'], ['6', '5'], ['4', '3'], ['G', 'bell']];

// =====================================================================================
// WORLD A · HOOK (frame 1 and the loop end): giant lit panel + Steve's sweaty face, tie, coffee.  o: noSteve, lit (fn idx → bool), bagX, glow
// =====================================================================================
function hookWorld(t, o = {}) {
  ctx.save(); ctx.translate(540, 960); ctx.scale(1.25, 1.25); ctx.translate(-540, -960); liftWall(t, -300, 2300); ctx.restore();
  const s = 15, X = 400, hcY = 610, Y = hcY + 80 * s;
  if (!o.noSteve) {
    const slosh = 0.06 * Math.sin(t * 17), sw = 3 * Math.sin(t * 40);
    steve(X + sw, Y, s, { eyes: 'dot', lid: 0.1, brow: 'worried', mouth: o.mouth ?? 'teeth', look: 0.5, fx: ['sweat'], tilt: -3 + 1.2 * Math.sin(t * 9) }, 0, 0, false);
    armTube([[X - 8 * s, Y - 60 * s], [X - 190, Y - 52 * s + 40], [X - 175, Y - 38 * s]], 56, MUSTARD, 33);
    armTube([[X + 8 * s, Y - 60 * s], [X + 230, Y - 56 * s + 20], [X + 300, Y - 48 * s - 60]], 56, MUSTARD, 34);
    coffee(X + 318, Y - 48 * s - 70, t, slosh, 1);
    spen(t, 67, 5).tube([[X + 294, Y - 48 * s - 50], [X + 318, Y - 48 * s - 36], [X + 344, Y - 48 * s - 50]], 36, SK);
    const dq = (t % 0.8) / 0.8; drop(X + 52, 640 + 190 * dq * dq, 10);   // sweat drip
  }
  floorDisplay(880, 430, 250, 130, o.disp ?? '12', o.disp ? false : true);
  const px0 = 20, py0 = 1040, px1 = 1060, py1 = 1885; plate(px0, py0, px1, py1);
  const labels = ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'G', 'open', 'close', 'bell'];
  const bx = [150, 410, 670, 930], by = [1135, 1325, 1515, 1705], r = 80, pos = [];
  const pulse = 0.5 + 0.22 * Math.sin(t * 9);
  labels.forEach((l, i) => { const cx = bx[i % 4], cy = by[Math.floor(i / 4)], lit = o.lit ? o.lit(i) : true; pos.push([cx, cy, lit]); lbtn(cx, cy, r, l, lit ? 'lit' : 'off', 100 + i); });
  pos.forEach(([cx, cy, lit]) => { if (lit) glowOn(cx, cy, r, pulse * (o.glow ?? 1)); });
  if (o.glow !== 0) glowBlob(540, 1460, 900, 'rgba(255,170,50,0.18)');
  if (o.bagX !== undefined) bag(o.bagX, 1090, o.bagX + 820, 1880, o.bagSq ?? 60, 21);
}

// =====================================================================================
// WORLD B · lift interior, panel strip at the right (still 2). One state function; shots are cameras.
// o: sag, rage, bagX, offAt(idx), closeMissing, pose{}, hair, bags, loose, cup, watch(0..1), stab(0..1), flyT
// =====================================================================================
function worldB(t, o = {}) {
  liftWall(t);
  const s = 15, X = 330 + (o.dx ?? 0), Y = 640 + 1200 + (o.sag ?? 0) * 70;
  const rows = LABELS, cols = [760, 940], r = 58, pos = [];
  plate(640, 690, 1060, 1860);
  rows.forEach((row, j) => row.forEach((l, k) => {
    const idx = j * 2 + k, cx = cols[k], cy = 800 + j * 170; const off = o.offAt ? t >= o.offAt(idx) : false;
    const st = (l === 'close' && o.closeMissing) ? 'missing' : off ? 'off' : 'lit'; pos.push([cx, cy, st, l]); lbtn(cx, cy, r, l, st, 200 + idx);
  }));
  pos.forEach(([cx, cy, st]) => { if (st === 'lit') glowOn(cx, cy, r, 0.5 + 0.12 * Math.sin(t * 8)); });
  floorDisplay(850, 520, 250, 130, String(o.disp ?? flo(t)), true);
  const P = { eyes: 'dot', lid: 0.2, brow: 'worried', mouth: 'line', look: 0.3, fx: ['sweat'], tilt: 0, ...(o.pose || {}) };
  const sw = o.shiver ? o.shiver * Math.sin(t * 50) : 0;
  steve(X + sw, Y, s, P, o.hair ?? 0, o.bags ?? 0, o.loose ?? false);
  const sh = [X - 8 * s, Y - 60 * s], shR = [X + 8 * s, Y - 60 * s];
  if (o.stab !== undefined) {   // rage: stabbing arm to the CLOSE socket
    const k = o.stab, hx = lerp(560, 716, k), hy = lerp(900, 812, k);
    armTube([shR, [X + 250, Y - 60 * s - 30 + 30 * (1 - k)], [hx, hy]], 54, MUSTARD, 35);
    const f = ellipsePts(hx + 26, hy - 6, 44, 40, 24); ctx.fillStyle = SK; ctx.beginPath(); f.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.fill(); spen(t, 68, 6).outline(f, true, 6);
    armTube([sh, [X - 190, Y - 52 * s + 40], [X - 175, Y - 38 * s]], 56, MUSTARD, 33);
  } else {
    // left arm up with the coffee, right arm checks the watch
    if (o.cup !== false) { armTube([sh, [150, 1010], [120, 900]], 54, MUSTARD, 33); coffee(120, 790, t, 0.08 * Math.sin(t * 16) * (o.slosh ?? 1), o.steam ?? 1); spen(t, 69, 5).tube([[96, 880], [120, 896], [146, 880]], 34, SK); }
    else armTube([sh, [X - 190, Y - 52 * s + 40], [X - 175, Y - 38 * s]], 56, MUSTARD, 33);
    const w = o.watch ?? 0, hx = lerp(470, 540, w), hy = lerp(1060, 905, w);
    if (o.rub === undefined) armTube([shR, [lerp(500, 570, w), lerp(980, 1010, w)], [hx, hy]], 54, MUSTARD, 34);
    if (o.rub !== undefined) { const rx = X + 70 + 26 * Math.cos(t * 26), ry = Y - 80 * s + 70 + 20 * Math.sin(t * 26); armTube([shR, [X + 230, Y - 60 * s + 60], [rx + 20, ry + 30]], 54, MUSTARD, 34); ctx.fillStyle = SK; ctx.beginPath(); ctx.arc(rx, ry, 40, 0, 7); ctx.fill(); spen(t, 70, 5).outline(ellipsePts(rx, ry, 40, 40, 20), true, 5); }
    else { ctx.fillStyle = SK; ctx.beginPath(); ctx.arc(hx + 6, hy - 14, 34, 0, 7); ctx.fill(); spen(t, 70, 5).outline(ellipsePts(hx + 6, hy - 14, 34, 34, 20), true, 5); }
    if (w > 0.5 && o.rub === undefined) { ctx.fillStyle = '#f4efe6'; ctx.beginPath(); ctx.arc(hx - 18, hy + 8, 22, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.moveTo(hx - 18, hy + 8); ctx.lineTo(hx - 18, hy - 6); ctx.moveTo(hx - 18, hy + 8); ctx.lineTo(hx - 8, hy + 12); ctx.stroke(); }
  }
  // backpack (the plant): huge, squashed against the lower panel; glow shows round it
  const bx = o.bagX ?? 0, by = o.bagY ?? 0; bag(120 + bx, 1190 + by, 790 + bx, 1790 + by, bx < -20 ? 0 : 70, 9);
  if (bx > -20) { const q = spen(t, 72, 7); for (const y of [1380, 1500, 1620]) q.line([[826, y - 24], [850, y], [826, y + 24]], 8, '#5a4a32'); }
  { const q = spen(t, 73, 9); q.line([[X + sw - 140, Y - 58 * s + 10], [X + sw - 150, 1210 + bx * 0.3 + by]], 26, '#3f5a34'); q.line([[X + sw + 140, Y - 58 * s + 10], [X + sw + 150, 1210 + bx * 0.3 + by]], 26, '#3f5a34'); }
  // the flying CLOSE button
  if (o.flyT !== undefined && o.flyT >= 0) {   // pops off big toward camera, bonks Steve's forehead, bounces out of frame
    const d = o.flyT, hit = 0.25; let x, y, r;
    if (d < hit) { const k = d / hit; x = lerp(760, 360, k); y = lerp(800, 560, k) - 150 * Math.sin(k * Math.PI); r = lerp(52, 105, Math.sin(k * Math.PI / 2)); }
    else { const d2 = d - hit; x = 360 + 330 * d2; y = 560 - 1300 * d2 + 1200 * d2 * d2; r = 105; }
    ctx.save(); ctx.translate(x, y); ctx.rotate(d * 14); lbtn(0, 0, r, 'close', 'lit', 300); ctx.restore(); glowOn(x, y, r, 0.4);
    if (d >= hit && d < hit + 0.32) { strokedText('BONK', X + 20, Y - 80 * s - 190, 64, '#fff6dc', 12); }
  }
  if (o.hint) { const q = spen(t, 74, 7); for (const [x, y, a] of [[120, 380, 0.5], [60, 520, 0.2], [980, 360, -0.5]]) q.line([[x, y], [x + Math.cos(a) * 60, y + Math.sin(a) * 60]], 9, '#2a2230'); }
}

// =====================================================================================
// WORLD C · the doors (still 3): looking out of the lift. o: floor, open(0..1), hall('empty'|'crowd'), twT, steveX, hcY, pose, ding, crowd{...}, nose
// =====================================================================================
function tumble(x, y, rot, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(rot); ctx.strokeStyle = '#8a6a3e'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const a = i * 0.7, rr = 40 + 14 * hash(i); ctx.beginPath(); ctx.arc(0, 0, rr, a, a + 3.6); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-50, -10); ctx.lineTo(50, 14); ctx.moveTo(-20, -50); ctx.lineTo(24, 48); ctx.stroke(); ctx.restore();
}
function worldC(t, o = {}) {
  const open = o.open ?? 1, xl = lerp(540, 130, open), xr = lerp(540, 950, open);
  ctx.fillStyle = '#d6c9ad'; ctx.fillRect(0, 0, W, H);
  // hall (clipped to the doorway)
  ctx.save(); ctx.beginPath(); ctx.rect(xl - 2, 300, xr - xl + 4, 1460); ctx.clip();
  ctx.fillStyle = '#bfd1c0'; ctx.fillRect(0, 0, W, H);
  const lp = spen(t, 40, 5); for (let x = 200; x < W; x += 260) lp.line([[x, 330], [x, 1600]], 5, '#9bb09c');
  ctx.fillStyle = '#8fa592'; ctx.fillRect(0, 1450, W, 470);
  if (o.hall === 'empty') {
    const fp = spen(t, 90, 6);
    for (const x of [330, 760]) { fp.part(roundPoly([[x - 80, 900], [x + 80, 900], [x + 80, 1450], [x - 80, 1450]], 8), '#a9bdac', { shade: 0.12, lw: 6 }); ctx.fillStyle = '#6a7a6c'; ctx.beginPath(); ctx.arc(x + 52, 1190, 9, 0, 7); ctx.fill(); }
    text(String(o.floor), 540, 640, 230, 'rgba(110,135,115,0.8)', 'Fredoka');
    if (o.twT !== undefined) { const k = seg(t, o.twT, o.twT + 1.7); if (k > 0 && k < 1) tumble(lerp(-100, 1180, k), 1540 - Math.abs(Math.sin(k * 14)) * 55, k * 30); }
  } else if (o.hall === 'crowd') {
    const c = o.crowd || {}, lk = c.look ?? 0, sq = c.squeeze ?? 0;   // squeeze: crowd presses toward the doorway centre
    const P = (x, sc) => lerp(x, 540 + (x < 540 ? -150 : 150), sq * sc);
    neighbour(P(130, 1), 800 + 120 * sq, 62 * (1 + 0.4 * sq), '#d9a07a', '#3a2a2a', '#7a4a4a', 1, 10, lk * 1);
    neighbour(P(520, 0.3), 690 + 150 * sq, 70 * (1 + 0.5 * sq), '#f0c7a0', '#7a7a82', '#4a6a8a', 2, 11, lk * 0.2);
    neighbour(P(900, 1), 760 + 120 * sq, 66 * (1 + 0.4 * sq), '#b9805a', '#2a2230', '#6a5a8a', 0, 12, -lk * 1);
    neighbour(P(1000, 1), 960 + 100 * sq, 52 * (1 + 0.4 * sq), '#e4b690', '#5a3a2a', '#4a7a5a', 1, 13, -lk * 1);
    const NX = lerp(320, 420, sq), NY = 1735, ns = 12; window.STEVE_SKIN = SK;
    drawCharacter(ctx, 'nana', NX, NY, ns, { eyes: 'dot', lid: 0.42, brow: 'angry', mouth: (o.nanaTalk && chat(t, 8)) ? 'small' : 'line', arm: 'cross', fx: [], noShadow: true }, { frame: boilFrame(t) });
    for (const [x0, y0, x1, y1] of [[NX - 90, 1165, NX + 90, 1210], [NX + 90, 1160, NX - 90, 1213]]) { armTube([[x0, y0], [x1, y1]], 40, (CAST.nana && CAST.nana.color) || '#9a7ac8', 41); ctx.fillStyle = '#fffdf8'; ctx.beginPath(); ctx.arc(x1, y1, 19, 0, 7); ctx.fill(); }
  }
  ctx.restore();
  // steve (behind the leaves while he leans out)
  const s = 14, hcY = o.hcY ?? 1190, SX = o.steveX ?? 745, Y = hcY + 80 * s;
  const drawSteve = () => {
    const q = o.squash ?? 0; ctx.save(); ctx.translate(SX, hcY); ctx.scale(1 - 0.3 * q, 1 + 0.12 * q); ctx.translate(-SX, -hcY);
    steve(SX, Y, s, o.pose, o.hair ?? 2, o.bags ?? 1, o.loose ?? true);
    armTube([[SX - 8 * s, Y - 60 * s], [SX - 200, Y - 56 * s + 100], [SX - 190, Y - 40 * s]], 54, MUSTARD, 36);
    armTube([[SX + 8 * s, Y - 60 * s], [SX + 200, Y - 56 * s + 100], [SX + 190, Y - 40 * s]], 54, MUSTARD, 37);
    ctx.restore();
  };
  if (o.behind) drawSteve();
  // ceiling, display, leaves
  { const p = spen(t, 80, 7);
    p.part(roundPoly([[-20, -20], [W + 20, -20], [W + 20, 340], [-20, 340]], 10), '#d6c9ad', { shade: 0.1, lw: 8 });
    floorDisplay(540, 250, 260, 130, String(o.floor), false);
    for (const [x0, x1] of [[-20, xl], [xr, 1100]]) { p.part(roundPoly([[x0, 300], [x1, 300], [x1, 1760], [x0, 1760]], 6), '#aeb4bf', { shade: 0.18, lw: 8 }); p.line([[(x0 + x1) / 2, 360], [(x0 + x1) / 2, 1700]], 4, '#8f95a3'); } }
  if (!o.behind) drawSteve();
  ctx.fillStyle = '#8d8574'; ctx.fillRect(0, 1755, W, 165); spen(t, 81, 8).line([[0, 1755], [W, 1755]], 8);
  if (o.nose) { const np = ellipsePts(540, hcY + 30, 52, 40, 20); ctx.fillStyle = '#d99a8a'; ctx.beginPath(); np.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); spen(t, 84, 6).outline(np, true, 6); }
  if (o.twF !== undefined) { const k = seg(t, o.twF, o.twF + 0.95); if (k > 0 && k < 1) tumble(lerp(-260, 1340, k), 1620 - Math.abs(Math.sin(k * 9)) * 120, k * 22, 2.6); }
  if (o.ding !== undefined && o.ding >= 0 && o.ding < 0.4) strokedText('DING', 860, 470, 70, '#fff6dc', 12);
}
const doorOpen = (t, td) => seg(t, td + 0.03, td + 0.28) - seg(t, td + 0.38, td + 0.6);
function steveC(t, extra = {}) {   // Steve's face in the doorway world
  const L = decay(t), tw = (t > 9.0 && t < 10.3 && chat(t, 16)) ? 0.62 : 0.2 + 0.4 * L;
  const talk = (talking('s3', t) || talking('s4', t)) ? (chat(t, 9) ? 'small' : 'line') : 'line';
  return { eyes: 'dot', lid: tw, brow: 'worried', mouth: talk, look: -0.4, fx: ['sweat'], tilt: 3 + 2 * Math.sin(t * 6), ...extra };
}

const STABS = [14.93, 15.68, 16.50];
function peak(t, zoom, fx, fy) {
  // each stab: 0 -> 1 in 0.07 s, hold 0.08, retract over 0.2; between stabs the fist hovers back
  const pulse = ts => seg(t, ts - 0.07, ts) * (1 - seg(t, ts + 0.08, ts + 0.28));
  const stab = 0.15 + 0.85 * Math.max(...STABS.map(pulse));
  const sk = Math.max(...STABS.map(ts => (t >= ts && t < ts + 0.1) ? 1 : 0));   // 3 frames of shake
  const closeGone = t >= POP, bonk = t >= POP + 0.25 && t < POP + 0.45;
  const sx = sk * 16 * Math.sin(t * 190), sy = sk * 16 * Math.cos(t * 170);
  const pz = zoom * (1 + 0.05 * sk);
  const pose = { ...{ expr: 'furious', eyes: 'angry', brow: 'angry', mouth: 'scream', fx: ['vein', 'sweat'], puff: 1, tilt: 4 }, ...(bonk ? { eyes: 'closed', tilt: -10, mouth: 'teeth' } : {}) };
  cam(pz, fx, fy, () => worldB(t, { hair: 2, bags: 1, loose: true, sag: 2.4 - 1.2 * seg(t, 16.6, 17.6), closeMissing: closeGone, disp: 3, pose, stab, cup: false, flyT: closeGone ? t - POP : -1, hint: t < 16.4 }), sx, sy);
}
// ---------- shot list ----------
let SHOTS = [];
function build() {
  const stRage = { expr: 'furious', eyes: 'angry', brow: 'angry', mouth: 'teeth', fx: ['vein', 'sweat'], puff: 1, tilt: 4 };
  // B states by time
  const bCommon = t => {
    const L = decay(t), loose = t > 11.6, hair = t < 11.5 ? 0 : t < 13.3 ? 1 : 2;
    return { hair: t < M0 ? 0 : hair, bags: t > 12.6 ? 1 : 0, loose, sag: kf(t, [[1.0, 0], [1.7, 1], [M0, 1], [14.8, 2.4]]), steam: t < M0 ? 1 : 1 - seg(t, M0, 11.5), cup: t < PEAK0, hint: false,
      pose: { lid: 0.2 + 0.4 * L, look: 0.3, mouth: talking('s1', t) ? (chat(t, 10) ? 'teeth' : 'line') : 'line' } };
  };
  const dispShake = [];
  void dispShake;
  SHOTS = [
    // A · HOOK 0–1.0 (frame 1)
    [0, t => { cam(kf(t, [[0, 1.0], [1.0, 1.05]]), 540, 1000, () => hookWorld(t, { mouth: chat(t, 10) ? 'teeth' : 'line' }), ...shake(t, 2.2, 33)); }],
    // B1 · pull-back into the lift: he sags into the corner, the bag squashes the panel
    [1.0, t => { cam(kf(t, [[1.0, 1.55], [2.45, 1.0]], eo), kf(t, [[1.0, 700], [2.45, 540]], eo), kf(t, [[1.0, 1100], [2.45, 960]], eo), () => worldB(t, { ...bCommon(t), shiver: 2 })); }],
    // B2 · s2: watch check, foot tap (head bob), coffee sloshes
    [2.45, t => { const w = eio(seg(t, 2.6, 3.0)); cam(kf(t, [[2.45, 1.35], [3.6, 1.5]]), 400, 820, () => worldB(t, { ...bCommon(t), watch: w * (t < 3.5 ? 1 : 1 - seg(t, 3.5, 3.7)), dx: 4 * Math.sin(t * 22) * (t > 3.0 && t < 3.7 ? 1 : 0.3), slosh: 1.6, pose: { ...bCommon(t).pose, look: t < 3.0 ? 0.3 : -0.5 } })); }],
    // B3 · the display ticks 12 → 11
    [3.6, t => { cam(kf(t, [[3.6, 1.5], [4.7, 1.9]]), 800, 760, () => worldB(t, { ...bCommon(t), disp: t < 3.95 ? 12 : 11 })); }],
    // C1a · DING 4.70: doors open on an empty hall at 11; Steve leans out (wide)
    [4.70, t => {
      const lean = eio(seg(t, 5.0, 5.6)), op = seg(t, 4.73, 5.0);
      cam(kf(t, [[4.7, 1.0], [5.8, 1.12]]), 540, 1050, () => worldC(t, { floor: 11, open: op, hall: 'empty', steveX: lerp(745, 540, lean), behind: lean > 0.3, pose: steveC(t, { tilt: 3 + 6 * lean }), hair: 0, bags: 0, loose: false, ding: t - 4.7, hcY: 1190 }));
    }],
    // C1b · s3 "…Nobody": tight on his head, he looks left, then right, down the corridor
    [5.80, t => {
      const lk = t < 6.3 ? -1.0 * eio(seg(t, 5.85, 6.1)) : -1.0 + 2.0 * eio(seg(t, 6.3, 6.6));
      cam(kf(t, [[5.8, 1.5], [6.95, 1.62]], t2 => t2), 540, 1160, () => worldC(t, { floor: 11, open: 1, hall: 'empty', steveX: 540, behind: true, pose: steveC(t, { look: lk, tilt: 8 * lk, lid: 0.18 }), hair: 0, bags: 0, loose: false, hcY: 1190 }));
    }],
    // C1c · the doors close on his nose: squash, boop
    [6.95, t => {
      const op = 1 - seg(t, 6.95, 7.3), q = seg(t, 7.0, 7.28) * (1 - seg(t, 7.4, 7.5)), nose = t > 7.22 && t < 7.5;
      cam(1.4, 540, 1170, () => worldC(t, { floor: 11, open: op, hall: 'empty', steveX: 540, behind: true, squash: q, nose, pose: steveC(t, { eyes: q > 0.5 ? 'closed' : 'dot', mouth: q > 0.5 ? 'small' : 'line', lid: 0.2 }), hair: 0, bags: 0, loose: false, hcY: 1190 }), ...shake(t, t > 7.28 && t < 7.45 ? 12 : 0, 45));
    }],
    // B4 · back inside, rubbing his nose: display ticks 11 → 10
    [7.50, t => { cam(1.3, 600, 700, () => worldB(t, { ...bCommon(t), disp: t < 7.7 ? 11 : 10, rub: 1, cup: true, pose: { ...bCommon(t).pose, eyes: t < 7.9 ? 'closed' : 'dot', look: 0.2, lid: 0.35, tilt: -4 } })); }],
    // C2a · DING 8.20: floor 10, doors open (wide, he sags)
    [8.20, t => {
      const op = seg(t, 8.23, 8.5);
      cam(kf(t, [[8.2, 1.0], [8.8, 1.08]]), 540, 1080, () => worldC(t, { floor: 10, open: op, hall: 'empty', pose: steveC(t), hair: 0, bags: 0, loose: false, ding: t - 8.2 }));
    }],
    // C2b · s4 "NOBODY": close-up, eye twitch
    [8.80, t => {
      const tw = (Math.floor(t * 14) % 3 === 0 && t > 8.95) ? 0.75 : 0.18;
      cam(kf(t, [[8.8, 1.9], [9.55, 2.1]], t2 => t2), 560, 1130, () => worldC(t, { floor: 10, open: 1, hall: 'empty', pose: steveC(t, { lid: tw, brow: tw > 0.5 ? 'angry' : 'worried', tilt: 2 }), hair: 0, bags: 0, loose: false }), ...shake(t, tw > 0.5 ? 3 : 0, 50));
    }],
    // C2c · cut wide: a big tumbleweed rolls across the foreground; doors close
    [9.55, t => {
      const op = 1 - seg(t, 10.0, 10.38);
      cam(kf(t, [[9.55, 1.0], [10.4, 1.06]], t2 => t2), 540, 1100, () => worldC(t, { floor: 10, open: op, hall: 'empty', twF: 9.55, pose: steveC(t), hair: 0, bags: 0, loose: false }));
    }],
  ];
  // montage 9 → 3: a cut on every DING
  for (let k = 0; k < 7; k++) {
    const td = M0 + k * SLOT, fl = 9 - k;
    SHOTS.push([td, t => {
      const L = decay(t), loose = L > 0.22, hair = L < 0.3 ? 0 : L < 0.65 ? 1 : 2, bg = L > 0.55 ? 1 : 0;
      if (k === 0) {   // floor 9: low angle from the floor, tilted, looking up at him
        const u = seg(t, td, td + SLOT);
        ctx.save(); ctx.translate(540, 960); ctx.rotate(-0.09 + 0.03 * u); ctx.translate(-540, -960);
        cam(lerp(1.45, 1.55, u), 600, 1330, () => worldC(t, { floor: fl, open: doorOpen(t, td), hall: 'empty', hcY: 1190 + 340 * L, pose: steveC(t, { lid: 0.2 + 0.55 * L, mouth: 'line' }), hair, bags: bg, loose, ding: t - td }), ...shake(t, 2, 40));
        ctx.restore();
      } else if (k % 2 === 0) {   // doors open on the empty hall
        const zoom = [1.0, 1.0, 1.5, 1.0, 1.15, 1.0, 1.7][k], fy = [1100, 1100, 1250, 1100, 1350, 1100, 1500][k];
        cam(zoom, k === 6 ? 700 : 540, fy, () => worldC(t, { floor: fl, open: doorOpen(t, td), hall: 'empty', twT: k === 2 ? td + 0.1 : undefined, hcY: 1190 + 340 * L, pose: steveC(t, { lid: 0.2 + 0.55 * L, mouth: 'line' }), hair, bags: bg, loose, ding: t - td }), ...shake(t, 2, 40));
      } else {            // inside: face / display / panel close-ups
        const cc = { 1: [1.7, 400, 800], 3: [2.0, 800, 760], 5: [1.35, 380, 1000] }[k];
        const sag = 1 + 1.4 * L;
        cam(cc[0], cc[1], cc[2], () => worldB(t, { ...bCommon(t), disp: fl, hair, loose, bags: bg, sag, pose: { ...bCommon(t).pose, lid: 0.2 + 0.5 * L, mouth: 'line' } }), ...shake(t, 1.5, 37));
      }
    }]);
  }
  SHOTS.push(
    // B5 · PEAK (s6): three hard stabs (CLOSE! Close! CLOSE!), a 3-frame shake on each; the last pops the button off
    [PEAK0, t => peak(t, 1.1, 560, 940)],
    [15.58, t => peak(t, 1.32, 520, 840)],
    [16.40, t => peak(t, 1.0, 540, 960)],
    // R7 · calm: he stands up, the bag lifts OFF the panel, then the lights click off bottom-up (one wide shot)
    [CALM, t => {
      const up = eio(seg(t, 17.6, 18.2)), lift = eio(seg(t, 17.85, 18.3));
      cam(kf(t, [[CALM, 1.0], [19.3, 1.1]], t2 => t2), 540, 1000, () => worldB(t, { hair: 2, bags: 1, loose: true, sag: lerp(1.2, 0, up), closeMissing: true, disp: 'G', bagX: lerp(0, -220, lift), bagY: lerp(0, -110, lift), offAt: i => OFF0 + 0.05 + (13 - i) * 0.075, pose: { eyes: 'dot', lid: 0.5, brow: undefined, mouth: 'line', look: -0.9, fx: [], tilt: 0 }, cup: false }));
    }],
    // R7c · he looks at the bag, then at the camera; slow push-in on his face
    [19.3, t => {
      const look = t < 19.8 ? -1.0 : 0.0;
      cam(kf(t, [[19.3, 1.5], [PUNCH, 2.1]], t2 => t2), 380, kf(t, [[19.3, 800], [PUNCH, 780]], t2 => t2), () => worldB(t, { hair: 2, bags: 1, loose: true, sag: 0, closeMissing: true, disp: 'G', bagX: -220, bagY: -110, offAt: () => 0, pose: { eyes: 'dot', lid: 0.45, brow: 'worried', mouth: 'line', look, fx: [], tilt: look < 0 ? -3 : 0 }, cup: false }));
    }],
    // PUNCH · DING at G: doors open on the waiting crowd; heads turn in sync; hold on Steve's face
    [PUNCH, t => {
      const turn = eio(seg(t, 21.55, 21.95)), blink = (t > 22.6 && t < 22.72);
      const z = kf(t, [[PUNCH, 1.0], [SHUF, 1.16]], t2 => t2);
      cam(z, 560, 1000, () => worldC(t, { floor: 'G', open: 1, hall: 'crowd', steveX: 800, nanaTalk: talking('s8', t), crowd: { look: turn * 1.6 }, ding: t - PUNCH,
        pose: { eyes: blink ? 'closed' : 'dot', lid: 0.55, brow: 'worried', mouth: 'line', look: -0.9 + 0.9 * turn * 0.6, fx: ['sweat'], tilt: 5 } }));
    }],
    // BUTTON · he shuffles out; the crowd squeezes in (cut on motion)
    [SHUF, t => {
      const walk = eio(seg(t, 23.5, 24.15)), sq = eio(seg(t, 23.7, 24.3));
      cam(1.16 - 0.16 * walk, 560 - 20 * walk, 1000 - 40 * walk, () => worldC(t, { floor: 'G', open: 1, hall: 'crowd', steveX: lerp(800, 1500, walk * walk), hcY: 1190 + 12 * Math.sin(t * 20) * walk, crowd: { look: 1.0, squeeze: sq },
        pose: { eyes: 'dot', lid: 0.55, brow: 'worried', mouth: 'line', look: 0.9, fx: [], tilt: 5 - 8 * walk } }));
    }],
    // LOOP · a big man's backpack presses the panel; every button lights; push-in lands on frame 1
    [LOOP0, t => {
      const hit = eo(seg(t, 24.55, 24.8)), lit = t >= 24.88, rip = (i) => t >= 24.88 + i * 0.012;
      cam(kf(t, [[LOOP0, 0.86], [DUR, 1.0]], eo), 540, 960, () => hookWorld(t, { noSteve: true, lit: i => rip(i) && lit, disp: '12', bagX: lerp(-900, -330, hit), bagSq: 60, glow: lit ? 1.4 : 0 }), ...shake(t, t > 24.78 && t < 25.1 ? 7 : 0, 45));
    }],
  );
}

function render(t) {
  window.T_NOW = t;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1;
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  let k = 0; while (k + 1 < SHOTS.length && SHOTS[k + 1][0] <= t) k++;
  SHOTS[k][1](t);
  ctx.restore();
  if (t < 2.5 || t >= 25.1) title(['POV: you’re late and', 'the lift stops at every floor']);
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
