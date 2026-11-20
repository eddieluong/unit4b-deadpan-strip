// UNIT 4B · 27 "One Screw" (Tập 18) — FULL FILM, ~28.6 s. Worlds = the approved key stills (flat.js) + animation.
// Timings: voice/film_timeline.json (retime.py). Punch s8 at ~23.6 (83 %). Beats are listed in SHOTS.
import { paper, panel, drawCharacter, CAST, roundPoly, ellipsePts, boilFrame } from './flat.js';
import { ease } from './lib/motion.js';
import { W, H, ctx, INK, SK, MUSTARD, spen, lerp, clamp01, seg, hash, text, strokedText, title, glowBlob, quad, cloud, drop, armTube, steve, snug, hand, room, cardboard, foam, debris, screw, palm, wardrobe, pile, ghost, WARD, dust } from './flat.js';

const PL_Y = 1500;
let TL = null, DUR = 28.6, LN = {};
const eo = ease.out, eio = ease.inOut, eb = ease.outBack;
const kf = (t, ks, ez = eio) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) if (t < ks[i + 1][0]) return lerp(ks[i][1], ks[i + 1][1], ez(seg(t, ks[i][0], ks[i + 1][0]))); return ks[ks.length - 1][1]; };
function cam(zoom, fx, fy, fn, dx = 0, dy = 0) { ctx.save(); ctx.translate(540 + dx, 960 + dy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
const shake = (t, amp, hz = 31) => [amp * Math.sin(t * hz * 1.3), amp * Math.cos(t * hz)];
const talking = (id, t) => { const l = LN[id]; return !!l && t >= l.start && t <= l.end; };
const chat = (t, hz = 10) => Math.floor(t * hz) % 2 === 0;
const mouthT = (id, t, hz = 10, open = 'small') => talking(id, t) ? (chat(t, hz) ? open : 'line') : 'line';

// ---------- key times ----------
const T_BOX = 2.5, T_SHEET = 5.7, T_DRAWER = 8.4, T_E1 = 11.5, T_E2 = 12.5, T_E3 = 13.45, T_PEAK = 14.4, T_SCREW = 16.0, T_POST = 16.9,
  T_REACH = 20.2, T_OPEN = 21.0, T_FOLD = 21.75, FOLD_D = 1.0, T_PUNCH = 23.635, T_BTN = 26.0, T_HDL = 25.1;
const LAND = [1.0, 0.45, 0.55, 0.6, 0.8, 0.9].map(b => T_FOLD + FOLD_D * b);

// ---------- captions (stroked, y ~1500, never over a face) ----------
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
  s1: [['Where does THIS go?'], ['THIS'], 0.15], s2: [['The box said EASY.', 'One person.'], ['EASY'], 0.25],
  s3: [['Step one. EASY.'], ['EASY'], 0.2], s4: [['Why is it BACKWARDS?'], ['BACKWARDS'], 0.2],
  s6: [['DONE! I BUILT it!'], ['BUILT'], 0.2], s7: [['…It’s FINE. Spare.'], ['FINE'], 0.2], s8: [['…That one was IMPORTANT.'], ['IMPORTANT'], 0.6],
};
function captions(t) {
  for (const l of TL.lines) {
    const c = CAPS[l.id]; if (!c) continue;
    if (t >= l.start - 0.03 && t <= l.end + c[2]) { capText(c[0], c[1]); return { id: l.id, text: c[0].join(' '), x0: 40, y0: PL_Y - 60, x1: 1040, y1: PL_Y + 130 }; }
  }
  return null;
}

// ---------- shared bits ----------
const rel = (X, Y, s, dx, dy) => [X + dx * s, Y - 60 * s + dy * s];
function arms(X, Y, s, l, r, hands = true) {
  const sh = 60 * s, dx = 8 * s, w = 56 * s / 15;
  armTube([[X - dx, Y - sh], l[0], l[1]], w, MUSTARD, 33); armTube([[X + dx, Y - sh], r[0], r[1]], w, MUSTARD, 34);
  if (hands) { hand(l[1][0], l[1][1], 44 * s / 15, 0, SK, 71); hand(r[1][0], r[1][1], 44 * s / 15, 0, SK, 72); }
}
const restL = (X, Y, s) => [rel(X, Y, s, -14, 10), rel(X, Y, s, -15.7, 19.3)];
const restR = (X, Y, s) => [rel(X, Y, s, 14, 10), rel(X, Y, s, 15.7, 19.3)];
const lerpPts = (A, B, k) => A.map((p, i) => [lerp(p[0], B[i][0], k), lerp(p[1], B[i][1], k)]);
const knob = (x, y, r = 26) => { ctx.fillStyle = '#cfd5de'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); spen(0.1, 75, 6).outline(ellipsePts(x, y, r, r, 24), true, 6); ctx.fillStyle = '#f4f7fb'; ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.28, 0, 7); ctx.fill(); };
const hpos = o => { const xl = WARD.x + 2, xr = WARD.x + WARD.w / 2 - 12, wd = (xr - xl) * (1 - 0.82 * o); return [xr - wd + 36, (WARD.yb - WARD.h + 62 + WARD.yb - 44) / 2 + 40]; };
function litter(t) {   // wide-shot clutter (outside the 1080 frame at zoom 1)
  cardboard(-250, 1520, 360, 130, 0.1, 13, true); cardboard(1320, 1480, 340, 120, -0.1, 14, true); foam(-120, 1760, 260, 110, -0.05, 15); foam(1250, 1740, 250, 110, 0.1, 16);
  cardboard(60, 1330, 260, 100, 0.2, 17, true); cardboard(1040, 1380, 240, 90, -0.2, 18, true);
}

// =====================================================================================
// WORLD A · HOOK: giant screw in an open palm, Steve's worried face above, wardrobe blurred behind (pull-back reveals the clutter)
// =====================================================================================
function hookWorld(t, o = {}) {
  const bl = o.blur ?? 0;
  room(t, { floorY: 1250 });
  ctx.save(); if (bl > 0.5) ctx.filter = `blur(${bl}px)`; wardrobe(t, 540, 1250, 760, 1000); ctx.restore();
  ctx.save(); if (bl > 0.5) ctx.filter = `blur(${bl * 0.75}px)`; debris(t, { dy: -100 }); litter(t); ctx.restore();
  glowBlob(540, 1250, 800, 'rgba(255,230,170,0.16)');
  const s = 15, X = 540, hcY = 650, Y = hcY + 80 * s, sway = 0.03 * Math.sin(t * 3);
  steve(X, Y, s, { eyes: 'dot', lid: 0.0, brow: 'worried', mouth: o.mouth ?? 'wobble', look: 0, fx: ['sweat'], tilt: 0.8 * Math.sin(t * 5) }, 0, 0, false);
  armTube([[X - 8 * s, Y - 60 * s], [X - 230, Y - 52 * s + 120], [X - 250, Y - 38 * s + 250]], 56, MUSTARD, 33);
  armTube([[X + 8 * s, Y - 60 * s], [X + 300, Y - 56 * s + 150], [X + 70, 1640]], 58, MUSTARD, 34);
  palm(540, 1680, 1.0, 70, false);
  screw(560, 1640, 800, 0.04 + sway, 90, o.glint ?? (0.6 + 0.4 * Math.sin(t * 6)));
  palm(540, 1680, 1.0, 70, true);
}

// =====================================================================================
// WORLD B · BOX FLASHBACK: "EASY · 1 PERSON", smiling stick-man on the box, Snuggles' ears in the box
// =====================================================================================
function boxWorld(t) {
  room(t, { floorY: 1400 }); const p = spen(t, 120, 7);
  const cx = 540, by = 1480, bw = 840, bh = 700, top = by - bh, k = eb(seg(t, T_BOX + 0.2, T_BOX + 0.7));
  const L = cx - bw / 2, R = cx + bw / 2;
  // back flaps
  quad([[L, top], [R, top], [R - 30, top - 90 * k], [L + 30, top - 90 * k]], '#a8814f', p, 6);
  // Snuggles, only the ears show (rises with the flap pop)
  const rise = eo(seg(t, T_BOX + 0.3, T_BOX + 0.8)), sy = top + 260 - 250 * rise + 3 * Math.sin(t * 3);
  ctx.save(); ctx.beginPath(); ctx.rect(0, -400, W, top + 20 + 400); ctx.clip(); snug(cx - 70, sy + 330, 12, { eyes: 'dot', lid: 0.55, mouth: 'line', look: 0.5 }); ctx.restore();
  // front face
  quad([[L, top], [R, top], [R - 6, by], [L + 6, by - 4]], '#cfa56e', p, 8);
  p.line([[L + 6, top + 70], [R - 6, top + 70]], 5, '#9b7646');
  // top flaps (front, flopped open)
  quad([[L, top], [R, top], [R + 40, top - 30 - 50 * k], [L - 40, top - 30 - 50 * k]], '#dcb67c', p, 6);
  text('EASY · 1 PERSON', cx, top + 150, 84, INK, 'Fredoka', -0.02);
  // smiling stick-man drawing
  const mx = cx, my = top + 430, q = spen(t, 121, 8);
  q.outline(ellipsePts(mx, my - 100, 70, 70, 28), true, 8); q.line([[mx - 28, my - 112], [mx - 28, my - 104]], 10); q.line([[mx + 28, my - 112], [mx + 28, my - 104]], 10);
  q.line([[mx - 36, my - 80], [mx - 18, my - 62], [mx + 18, my - 62], [mx + 36, my - 80]], 8);
  q.line([[mx, my - 30], [mx, my + 110]], 8); q.line([[mx - 100, my - 100], [mx, my + 10], [mx + 100, my - 100]], 8); q.line([[mx, my + 110], [mx - 70, my + 200]], 8); q.line([[mx, my + 110], [mx + 70, my + 200]], 8);
}

// =====================================================================================
// WORLD C/D · INSTRUCTION SHEET (top) + Steve copying it (bottom).  o: step, item ('panel'|'drawer'), pose
// =====================================================================================
function man(cx, cy, sc, o = {}) {   // the wordless cartoon man (always smiling)
  const p = spen(0.1, 130, 7), s = sc;
  p.outline(ellipsePts(cx, cy - 100 * s, 66 * s, 66 * s, 28), true, 7); p.line([[cx - 26 * s, cy - 112 * s], [cx - 26 * s, cy - 104 * s]], 10); p.line([[cx + 26 * s, cy - 112 * s], [cx + 26 * s, cy - 104 * s]], 10);
  p.line([[cx - 34 * s, cy - 80 * s], [cx - 16 * s, cy - 60 * s], [cx + 16 * s, cy - 60 * s], [cx + 34 * s, cy - 80 * s]], 7);
  p.line([[cx, cy - 34 * s], [cx, cy + 120 * s]], 7); p.line([[cx, cy + 120 * s], [cx - 60 * s, cy + 220 * s]], 7); p.line([[cx, cy + 120 * s], [cx + 60 * s, cy + 220 * s]], 7);
  if (o.screw) { p.line([[cx, cy - 10 * s], [cx - 90 * s, cy + 70 * s]], 7); p.line([[cx, cy - 10 * s], [cx + 100 * s, cy - 70 * s]], 7); }
  else { p.line([[cx, cy - 10 * s], [cx - 90 * s, cy - 120 * s]], 7); p.line([[cx, cy - 10 * s], [cx + 90 * s, cy - 120 * s]], 7); }
}
function slabItem(cx, cy, w, h, rot, wrong = false, t = 0) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); const p = spen(t, 140, 6);
  quad([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], '#c8935a', p, 7);
  quad([[-w / 2 + 28, -h / 2 + 28], [w / 2 - 28, -h / 2 + 28], [w / 2 - 28, h / 2 - 28], [-w / 2 + 28, h / 2 - 28]], '#dcab74', p, 5);
  if (!wrong) knob(0, -h / 2 + 52, 20); else knob(0, h / 2 - 52, 20);
  ctx.restore();
}
function instrWorld(t, o = {}) {
  room(t, { floorY: 1650 });
  // the sheet
  const sx = 540, sy = 480, sw = 840, sh = 700, p = spen(t, 131, 7);
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(-0.015);
  quad([[-sw / 2, -sh / 2], [sw / 2, -sh / 2], [sw / 2, sh / 2], [-sw / 2, sh / 2]], '#fffaf0', p, 8);
  text(String(o.step), -sw / 2 + 80, -sh / 2 + 90, 120, INK, 'Fredoka');
  if (o.item === 'drawer') {
    man(40, 20, 1.2, {}); slabItem(40, -215, 300, 150, 0, false, t);   // man holds the drawer front above his head, knob out
  } else { man(60, 40, 1.15, {}); slabItem(60, -205, 280, 220, 0, false, t); }
  ctx.restore();
  // Steve below
  const s = 9, X = 540, hcY = 1290, Y = hcY + 80 * s, ps = o.pose || {};
  steve(X, Y, s, { eyes: 'dot', lid: 0.15, brow: 'worried', mouth: 'line', look: 0, fx: [], tilt: 0, ...ps }, 1, 0, false);
  const raise = o.raise ?? 1, hy = lerp(Y - 60 * s + 160, 1010, raise);
  arms(X, Y, s, [[X - 190, lerp(Y - 60 * s + 100, 1230, raise)], [X - 150, hy]], [[X + 190, lerp(Y - 60 * s + 100, 1230, raise)], [X + 150, hy]]);
  if (o.item === 'drawer') {
    const fl = o.flip ?? 0, sc = Math.cos(fl * Math.PI);   // flip squashes the drawer front: knob side vs bare side
    ctx.save(); ctx.translate(X, hy - 70); ctx.scale(Math.max(0.05, Math.abs(sc)), 1); slabItem(0, 0, 330, 160, 0.0, sc > 0 ? true : false, t); ctx.restore();
  } else slabItem(X, hy - 120, 300, 230, Math.PI + 0.04 * Math.sin(t * 6), false, t);
  hand(X - 150, hy, 40, 0, SK, 73); hand(X + 150, hy, 40, 0, SK, 74);
}

// =====================================================================================
// WORLD E · MONTAGE: window day→night, the worn Allen key, the cramped hand
// =====================================================================================
function winWorld(t) {
  const u = seg(t, T_E1, T_E2);
  room(t, { floorY: 1450 });
  // window
  const wx = 540, wy = 560, ww = 760, wh = 760, sky = u < 0.5 ? lerpCol('#9fd8ff', '#ff9a5a', u * 2) : lerpCol('#ff9a5a', '#1d2447', (u - 0.5) * 2);
  ctx.fillStyle = sky; ctx.fillRect(wx - ww / 2, wy - wh / 2, ww, wh);
  const a = lerp(-2.6, -0.5, u), sxx = wx + Math.cos(a) * 380, syy = wy + 300 - Math.sin(-a) * 520 + 100;
  ctx.fillStyle = u < 0.7 ? '#fff3b0' : '#f4f1e0'; ctx.beginPath(); ctx.arc(sxx, Math.min(syy, wy + 330), 70, 0, 7); ctx.fill();
  const p = spen(t, 150, 9); p.outline([[wx - ww / 2, wy - wh / 2], [wx + ww / 2, wy - wh / 2], [wx + ww / 2, wy + wh / 2], [wx - ww / 2, wy + wh / 2]], true, 14); p.line([[wx, wy - wh / 2], [wx, wy + wh / 2]], 12); p.line([[wx - ww / 2, wy], [wx + ww / 2, wy]], 12);
  // wardrobe panels on the floor + Steve hunched with the key
  for (const [x, y, w, h, r] of [[240, 1620, 320, 120, 0.1], [860, 1700, 360, 120, -0.08]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(r); quad([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], '#c8935a', spen(t, 151, 6), 6); ctx.restore(); }
  const s = 8, X = 540, hcY = 1480, Y = hcY + 80 * s, tk = 6 * Math.sin(t * 22);
  steve(X, Y, s, { eyes: 'dot', lid: 0.4 + 0.3 * u, brow: 'worried', mouth: 'line', look: 0.5, fx: u > 0.5 ? ['sweat'] : [], tilt: -6 + tk * 0.3 }, 1 + Math.round(u * 2), u > 0.5 ? 1 : 0, false);
  armTube([[X - 8 * s, Y - 60 * s], [X - 180, Y - 60 * s + 60], [X - 90, Y - 60 * s + 150]], 40, MUSTARD, 33); armTube([[X + 8 * s, Y - 60 * s], [X + 170, Y - 60 * s + 70], [X + 110 + tk, Y - 60 * s + 120]], 40, MUSTARD, 34);
  // night dims the whole room
  ctx.save(); ctx.globalAlpha = 0.5 * clamp01((u - 0.55) / 0.45); ctx.fillStyle = '#0d1236'; ctx.fillRect(-100, -100, W + 200, H + 200); ctx.restore();
}
function lerpCol(a, b, k) { const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], k)).toString(16).padStart(2, '0')).join(''); }
function keyWorld(t) {   // close-up: Allen key in a hex socket that wears round
  const u = seg(t, T_E2, T_E3);
  ctx.fillStyle = '#6d7482'; ctx.fillRect(-100, -100, W + 200, H + 200); const p = spen(t, 160, 8);
  const cx = 540, cy = 860, rad = 190, rr = lerp(10, 120, u);
  // socket head
  ctx.fillStyle = '#d4d9e1'; ctx.beginPath(); ctx.arc(cx, cy, 420, 0, 7); ctx.fill(); p.outline(ellipsePts(cx, cy, 420, 420, 40), true, 10);
  const hex = [...Array(6)].map((_, i) => [cx + Math.cos(i / 6 * 6.283 + 0.5) * rad, cy + Math.sin(i / 6 * 6.283 + 0.5) * rad]);
  ctx.fillStyle = '#4a4e5c'; const hp = roundPoly(hex, rr, 8); ctx.beginPath(); hp.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill(); p.outline(hp, true, 8);
  // the key rotates (wobbles) in the socket, handle sticks out down-right
  const ang = 0.35 + 0.1 * Math.sin(t * 14) * (1 - u * 0.5) + u * 0.2; ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
  const kh = roundPoly([...Array(6)].map((_, i) => [Math.cos(i / 6 * 6.283 + 0.5) * rad * 0.82, Math.sin(i / 6 * 6.283 + 0.5) * rad * 0.82]), rr * 0.8, 8);
  ctx.fillStyle = '#e8ecf2'; ctx.beginPath(); kh.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill(); p.outline(kh, true, 8);
  quad([[-34, 0], [34, 0], [34, 760], [-34, 760]], '#e8ecf2', p, 8); quad([[34, 700], [34, 760], [560, 760], [560, 700]], '#e8ecf2', p, 8); ctx.restore();
  for (let i = 0; i < 6; i++) { const ph = (t * 1.6 + i / 6) % 1; ctx.fillStyle = '#e8ecf2'; ctx.beginPath(); ctx.arc(cx + 240 + 140 * ph + 20 * i, cy + 280 + 160 * ph * ph, 8 + 4 * hash(i), 0, 7); ctx.fill(); }
}
function handWorld(t) {   // Steve's face above, his hand frozen into an L
  const u = eo(seg(t, T_E3, T_E3 + 0.5)); room(t, { floorY: 1350 });
  const s = 9, X = 540, hcY = 520, Y = hcY + 80 * s;
  steve(X, Y, s, { eyes: 'closed', lid: 0.3, brow: 'worried', mouth: 'teeth', look: 0, fx: ['sweat'], tilt: 3 * Math.sin(t * 20) }, 3, 1, false);
  const hx = 540, hy = 1180, p = spen(t, 170, 8), trem = 3 * Math.sin(t * 38);
  armTube([[X - 8 * s, Y - 60 * s], [X - 120, Y - 60 * s + 260], [hx - 20, hy + 220 + trem]], 60, MUSTARD, 33);
  ctx.save(); ctx.translate(hx, hy + trem);
  // palm
  quad(roundPoly([[-170, 30], [170, 30], [160, 230], [-160, 230]], 70, 8), SK, p, 8);
  // index (L vertical) and thumb (L horizontal) extend into rigid L; the other fingers stay curled
  const idx = lerp(0.0, 1, u);
  quad(roundPoly([[-60, 40], [10, 40], [10, 40 - 380 * idx], [-60, 40 - 380 * idx]], 30, 8), SK, p, 7);
  quad(roundPoly([[130, 150], [130, 90], [130 + 330 * idx, 90], [130 + 330 * idx, 150]], 28, 8), SK, p, 7);
  for (let i = 0; i < 3; i++) { quad(roundPoly([[20 + i * 52, 40], [64 + i * 52, 40], [64 + i * 52, 120], [20 + i * 52, 120]], 20, 8), '#e9b894', p, 6); }
  ctx.restore();
}

// =====================================================================================
// WORLD F-I · THE WARDROBE: peak, pocket + pat + creak, collapse, aftermath
// =====================================================================================
const SX = 330, SS = 15, SHY = 760, SY = SHY + 80 * SS;
function wardWorld(t, o = {}) {   // base: room + (standing wardrobe | ghost+pile) + Steve at left
  room(t, { floorY: WARD.yb, floorCol: o.floorCol ?? (o.fold ? '#7e6048' : undefined) });
  let hp = null;
  if (o.fold) { ghost(t); pile(t, o.k ?? 0); if (o.dust) { dust(560, 1330, o.dust, 90, 4, 5); dust(1010, 1320, o.dust, 70, 3, 8); dust(720, 1240, o.dust * 0.9, 150, 5, 2); } }
  else { const r = wardrobe(t, WARD.x, WARD.yb, WARD.w, WARD.h, { lean: o.lean ?? 0, doorOpen: o.open ?? 0 }); hp = r.handle; }
  return hp;
}
function sparkles(x, y, t, r) { for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283 + t * 2, d = r * (0.7 + 0.3 * Math.sin(t * 8 + i)); const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d; ctx.fillStyle = '#fffbe0'; ctx.beginPath(); ctx.moveTo(px, py - 22); ctx.lineTo(px + 7, py - 7); ctx.lineTo(px + 22, py); ctx.lineTo(px + 7, py + 7); ctx.lineTo(px, py + 22); ctx.lineTo(px - 7, py + 7); ctx.lineTo(px - 22, py); ctx.lineTo(px - 7, py - 7); ctx.closePath(); ctx.fill(); } }
function peakWorld(t) {
  room(t, { floorY: WARD.yb });
  glowBlob(540, 900, 1200, 'rgba(255,220,120,0.35)');
  for (let i = 0; i < 11; i++) { const a = -Math.PI / 2 + (i - 5) * 0.2 + 0.02 * Math.sin(t * 2); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,225,130,0.16)'; ctx.beginPath(); ctx.moveTo(400, 900); ctx.lineTo(400 + Math.cos(a - 0.05) * 1800, 900 + Math.sin(a - 0.05) * 1800); ctx.lineTo(400 + Math.cos(a + 0.05) * 1800, 900 + Math.sin(a + 0.05) * 1800); ctx.fill(); ctx.restore(); }
  wardrobe(t, WARD.x, WARD.yb, WARD.w, WARD.h, {});
  const up = eb(seg(t, T_PEAK, T_PEAK + 0.3)), cheer = 14 * Math.sin(t * 18) * up, s = SS, X = SX, Y = SY;
  const dn = seg(t, T_SCREW + 0.55, T_SCREW + 1.0);   // after the screw drops he sags
  steve(X, Y, s, { eyes: dn > 0.3 ? 'dot' : 'happy', brow: dn > 0.3 ? undefined : 'raised', mouth: dn > 0.3 ? 'line' : (talking('s6', t) ? (chat(t, 12) ? 'grin' : 'small') : 'grin'), look: dn > 0.3 ? 0.6 : 0, fx: dn > 0.3 ? ['sweat'] : ['sparkle'], tilt: -4 * (1 - dn), lid: 0.5 * dn }, 0, 0, false);
  const aL = lerpPts(restL(X, Y, s), [[X - 200, Y - 60 * s - 130], [X - 290, Y - 60 * s - 380 + cheer]], up), aR = lerpPts(restR(X, Y, s), [[X + 230, Y - 60 * s - 130], [X + 320, Y - 60 * s - 380 - cheer]], up);
  const dd = eio(dn), aL2 = lerpPts(aL, restL(X, Y, s), dd), aR2 = lerpPts(aR, restR(X, Y, s), dd);
  arms(X, Y, s, aL2, aR2);
  // the screw drops from his right sleeve: tink, bounces, lies on the floor
  if (t >= T_SCREW - 0.35) {
    const f = t - (T_SCREW - 0.35), fy = 700 + 9.8 * 120 * f * f, FL = 1330 + 20;
    let y = fy, x = X + 440, ang = 0.5 + f * 5, L = 230;
    if (y >= FL) { const b = t - (T_SCREW - 0.35 + Math.sqrt((FL - 700) / 1176)); y = FL - Math.abs(Math.sin(b * 9)) * 90 * Math.exp(-b * 4); x += b * 20; ang = lerp(ang, 1.5, clamp01(b * 4)); L = 200; }
    if (t < T_SCREW + 0.15) { const q = spen(t, 74, 7); for (const dx of [-26, 0, 26]) q.line([[X + 440 + dx, 560], [X + 440 + dx, 640]], 7, '#7a6a52'); }
    glowBlob(x, y - 140, 200, 'rgba(255,255,255,0.5)'); screw(x, y, L, ang, 91, 1);
    if (t > T_SCREW + 0.1 && t < T_SCREW + 0.9) strokedText('tink', X + 560, 1000, 64, '#fff6dc', 11, 0.2);
  }
}
const floorScrew = { x: SX + 520, y: 1345 };
function postWorld(t) {   // s7: pick up the screw, pocket it, pat the wardrobe, it creaks
  const lean = t > 19.6 ? 0.012 * Math.sin((t - 19.6) * 9) * Math.exp(-(t - 19.6) * 1.4) : 0;
  wardWorld(t, { lean });
  const X = SX, Y = SY, s = SS, pick = seg(t, 17.2, 17.6), tuck = seg(t, 17.6, 18.0), pat = t > 18.4 ? (t < 19.4 ? Math.abs(Math.sin((t - 18.4) * 6)) : 0) : 0;
  const patOn = seg(t, 18.2, 18.5) * (1 - seg(t, 19.3, 19.6));
  const calm = talking('s7', t);
  steve(X, Y, s, { eyes: 'dot', lid: 0.55, brow: undefined, mouth: mouthT('s7', t, 8), look: lerp(0.7, 0, patOn), fx: ['sweat'], tilt: 0 }, 1, 0, false);
  // pocket patch on his chest
  ctx.fillStyle = '#c98f1e'; ctx.beginPath(); ctx.moveTo(X + 40, Y - 52 * s); ctx.lineTo(X + 100, Y - 52 * s); ctx.lineTo(X + 100, Y - 42 * s); ctx.lineTo(X + 40, Y - 42 * s); ctx.closePath(); ctx.fill();
  const pocket = [X + 76, Y - 52 * s + 10];
  const handFloor = [floorScrew.x - 10, floorScrew.y - 20];
  let aR = restR(X, Y, s), sc = null;
  if (t < 17.2) { aR = restR(X, Y, s); sc = { x: floorScrew.x, y: floorScrew.y, ang: 1.5, L: 130 }; }
  else if (t < 17.6) { const k = eio(pick); aR = lerpPts(restR(X, Y, s), [[X + 330, Y - 60 * s + 330], handFloor], k); aR[1] = [lerp(restR(X, Y, s)[1][0], handFloor[0], k), lerp(restR(X, Y, s)[1][1], handFloor[1], k)]; sc = { x: floorScrew.x, y: floorScrew.y, ang: 1.5, L: 130 }; }
  else if (t < 18.0) { const k = eio(tuck); aR = [[lerp(X + 330, X + 200, k), lerp(Y - 60 * s + 330, Y - 60 * s + 140, k)], [lerp(handFloor[0], pocket[0] + 20, k), lerp(handFloor[1], pocket[1] + 20, k)]]; sc = { x: aR[1][0] + 20, y: aR[1][1] + 30, ang: 0.5, L: 130 * (1 - 0.4 * k) }; }
  else { const k = eio(patOn); const tgt = [[X + 300, Y - 60 * s + 20], [WARD.x - 120 + 10 * pat, Y - 60 * s + 10 - 40 * pat]]; aR = lerpPts([[X + 200, Y - 60 * s + 140], [pocket[0] + 20, pocket[1] + 20]], tgt, k); }
  arms(X, Y, s, restL(X, Y, s), aR);
  if (sc && t < 18.0 + 0.05) screw(sc.x, sc.y + 60, sc.L, sc.ang, 92, 0.4);
  if (t > 19.65 && t < 20.3) strokedText('creeak…', 700, 380, 56, '#fff6dc', 10, -0.08);
}
function foldWorld(t) {   // 20.2 – 23.6: close reach, then WIDE: door cracks, whole wardrobe folds flat in view, dust
  const wide = t >= T_OPEN, X = wide ? 300 : SX, s = wide ? 11 : SS, Y = wide ? 900 + 80 * 11 : SY;
  const open = 0.12 * eio(seg(t, T_OPEN + 0.1, T_OPEN + 0.6)) * (1 - seg(t, T_FOLD - 0.15, T_FOLD));
  const folding = t >= T_FOLD, k = clamp01((t - T_FOLD) / FOLD_D);
  const dustK = seg(t, T_FOLD + FOLD_D * 0.5, T_FOLD + FOLD_D * 0.5 + 1.2);
  const lean = !folding && t > T_OPEN + 0.5 ? 0.012 * Math.sin((t - T_OPEN) * 12) * seg(t, T_OPEN + 0.5, T_FOLD - 0.1) : 0;
  wardWorld(t, folding ? { fold: true, k, floorCol: lerpCol('#b8895e', '#7e6048', clamp01(k * 1.6)), dust: dustK > 0 ? 0.15 + 0.7 * dustK : 0 } : { open, lean });
  const grip = hpos(open), sh = [X + 8 * s, Y - 60 * s];
  const aft = eio(seg(t, T_FOLD + FOLD_D + 0.1, T_FOLD + FOLD_D + 0.8));
  const poseA = [[lerp(sh[0], grip[0], 0.5), lerp(sh[1], grip[1], 0.5) + 50 * s / 15], grip], still = [rel(X, Y, s, 15.3, 3.9), rel(X, Y, s, 22, 8.7)];
  const pat0 = [[X + 300, Y - 60 * s + 20], [WARD.x - 120, Y - 60 * s + 10]], reach = eio(seg(t, T_REACH, T_REACH + 0.6));
  const aR = t < T_OPEN ? lerpPts(pat0, poseA, reach) : lerpPts(poseA, still, aft);
  const hit = folding && t < T_FOLD + FOLD_D + 0.5;
  steve(X, Y, s, { eyes: 'dot', lid: aft > 0.5 ? 0.55 : 0.4, brow: hit ? 'worried' : undefined, mouth: folding && t > T_FOLD + 0.3 && t < T_FOLD + FOLD_D + 0.5 ? 'small' : 'line', look: 0.8 * (1 - aft) + 0.5 * aft, fx: ['sweat'], tilt: 0 }, 1, 0, false);
  arms(X, Y, s, restL(X, Y, s), aR);
  if (folding) knob(aR[1][0] + lerp(4, 40 * s / 15, aft), aR[1][1] + lerp(-6, -25 * s / 15, aft), 26 * s / 15);
  if (t > T_OPEN + 0.5 && t < T_FOLD + 0.4) strokedText('creak…', 760, 330, 52, '#fff6dc', 9, 0.1);
}
function drawerFace(w, h, knobOn, t) {
  const p = spen(t, 141, 6);
  quad([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], '#c8935a', p, 8);
  quad([[-w / 2 + 36, -h / 2 + 36], [w / 2 - 36, -h / 2 + 36], [w / 2 - 36, h / 2 - 36], [-w / 2 + 36, h / 2 - 36]], '#dcab74', p, 6);
  if (knobOn) knob(0, 0, 54); else { ctx.fillStyle = '#6f7787'; for (const dx of [-60, 60]) { ctx.beginPath(); ctx.arc(dx, 0, 16, 0, 7); ctx.fill(); } ctx.fillStyle = '#4a4e5c'; ctx.fillRect(-14, -50, 28, 100); }
}
function drawerWorld(t) {   // close on the drawer front: handle faces inward; it flips and flips back by itself; the cartoon man keeps smiling
  room(t, { floorY: 1650 });
  ctx.save(); ctx.translate(270, 360); ctx.rotate(-0.05); const p = spen(t, 131, 7);
  quad([[-210, -180], [210, -180], [210, 180], [-210, 180]], '#fffaf0', p, 7); text('14', -150, -125, 70, INK, 'Fredoka');
  ctx.save(); ctx.translate(40, 70); ctx.scale(0.6, 0.6); man(0, 0, 1, {}); ctx.restore();
  ctx.save(); ctx.translate(40, -50); drawerFace(130, 66, true, t); ctx.restore(); ctx.restore();
  const s = 9, X = 720, hcY = 470, Y = hcY + 80 * s, tr = 3 * Math.sin(t * 33) * (t > 9.28 ? 1 : 0);
  steve(X, Y, s, { eyes: 'dot', lid: 0.15, brow: 'worried', mouth: mouthT('s4', t, 9, 'teeth'), look: -0.3, fx: ['sweat'], tilt: 2 * Math.sin(t * 7) }, 1, 0, false);
  const ph = t < 8.8 ? 0 : t < 9.0 ? (t - 8.8) / 0.2 : t < 9.2 ? (t - 9.0) / 0.2 : 0, sq = (t >= 8.8 && t < 9.2) ? Math.max(0.06, Math.abs(Math.cos(Math.PI * ph))) : 1;
  const knobOn = t >= 8.9 && t < 9.1;
  arms(X, Y, s, [[X - 330, 880], [140, 1010]], [[X + 220, 880], [940, 1010]], false);
  ctx.save(); ctx.translate(540, 1010 + tr); ctx.scale(sq, 1); ctx.rotate(0.01 * Math.sin(t * 5)); drawerFace(800, 400, knobOn, t); ctx.restore();
  hand(140, 1010, 48, 0, SK, 73); hand(940, 1010, 48, 0, SK, 74);
}

function afterWorld(t) {   // 23.6 – 26: aftermath, deadpan; the handle falls off in his hand
  const X = SX, Y = SY, s = SS, blink = t > 24.45 && t < 24.57, fall = t - T_HDL, still = [rel(X, Y, s, 15.3, 3.9), rel(X, Y, s, 22, 8.7)];
  wardWorld(t, { fold: true, k: 1, dust: 0.85 + 0.15 * seg(t, T_PUNCH, T_BTN) });
  steve(X, Y, s, { eyes: blink ? 'closed' : 'dot', lid: 0.55, brow: undefined, mouth: mouthT('s8', t, 7), look: 0.5, fx: ['sweat'], tilt: 0 }, 1, 0, false);
  arms(X, Y, s, restL(X, Y, s), still);
  const kx = X + 385, ky = Y - 60 * s + 110;
  if (fall < 0) knob(kx, ky, 26);
  else { const yy = Math.min(1455, ky + 0.5 * 2600 * fall * fall), b = fall - Math.sqrt(2 * (1455 - ky) / 2600), bo = b > 0 ? Math.abs(Math.sin(b * 11)) * 50 * Math.exp(-b * 5) : 0; knob(kx + 20 * Math.max(0, b), yy - bo, 26); }
}

// =====================================================================================
// WORLD J · BUTTON: instruction step 1, the cartoon man now holds ONE screw and smiles; push-in on the screw → frame 1
// =====================================================================================
const BTN = { px: 690, py: 960, L: 170 };
function buttonWorld(t) {
  room(t, { floorY: 1650 });
  const sx = 540, sy = 700, sw = 880, sh = 980, p = spen(t, 131, 7);
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(-0.015); quad([[-sw / 2, -sh / 2], [sw / 2, -sh / 2], [sw / 2, sh / 2], [-sw / 2, sh / 2]], '#fffaf0', p, 8); text('1', -sw / 2 + 80, -sh / 2 + 100, 130, INK, 'Fredoka'); ctx.restore();
  man(480, 760, 1.5, { screw: true });
  hand(BTN.px - 30, BTN.py - 60, 38, 0, SK, 75);
  screw(BTN.px, BTN.py, BTN.L, 0.04, 93, 0.5 + 0.5 * Math.sin(t * 6));
}

// ---------- the film ----------
const SHOTS = [];
function build() {
  SHOTS.push(
    // A · HOOK (0 – 2.5): frame 1 held 1.0 s (s1 muttered), then the 1.0 s pull-back to the cardboard-strewn living room
    [0, t => {
      const pb = eio(seg(t, 1.0, 2.2));
      cam(lerp(1, 0.66, pb) * (1 + 0.14 * (1 - eo(seg(t, 0, 0.55)))), 540, lerp(960, 1150, pb), () => hookWorld(t, { blur: 16 * (1 - pb), mouth: talking('s1', t) ? (chat(t, 9) ? 'small' : 'wobble') : 'wobble' }));
    }],
    // B · BOX FLASHBACK (s2): the flap pops, Snuggles' ears rise, a smiling stick-man promises EASY
    [T_BOX, t => cam(kf(t, [[T_BOX, 1.0], [T_SHEET, 1.12]], t2 => t2), 540, 1000, () => boxWorld(t), ...shake(t, t > T_BOX && t < T_BOX + 0.3 ? 8 : 0, 40))],
    // C · STEP ONE (s3): the wordless man smiles holding a panel; Steve mirrors the pose, the panel upside down
    [T_SHEET, t => {
      const up = eo(seg(t, T_SHEET + 0.3, T_SHEET + 0.9));
      cam(kf(t, [[T_SHEET, 1.0], [T_DRAWER, 1.1]], t2 => t2), 540, 960, () => instrWorld(t, { step: 1, item: 'panel', raise: up, pose: { mouth: mouthT('s3', t, 9), brow: undefined, look: 0.3 } }));
    }],
    // D · STEP 14 (s4): CLOSE on the drawer front, handle facing in; it flips, flips back by itself; the cartoon man keeps smiling
    [T_DRAWER, t => cam(kf(t, [[T_DRAWER, 1.0], [T_E1, 1.14]], t2 => t2), 540, 960, () => drawerWorld(t), ...shake(t, t > 9.18 && t < 9.4 ? 7 : 0, 40))],
    // E · MONTAGE OF HOURS (silent): window day→night / the Allen key wears round / the hand cramps into an L
    [T_E1, t => cam(kf(t, [[T_E1, 1.0], [T_E2, 1.15]], t2 => t2), 540, 1000, () => winWorld(t))],
    [T_E2, t => cam(kf(t, [[T_E2, 1.0], [T_E3, 1.12]], t2 => t2), 540, 900, () => keyWorld(t), ...shake(t, 3, 30))],
    [T_E3, t => cam(kf(t, [[T_E3, 1.0], [T_PEAK, 1.12]], t2 => t2), 540, 900, () => handWorld(t))],
    // F · PEAK (s6): arms up, warm light, the screw drops from his sleeve: tink
    [T_PEAK, t => cam(kf(t, [[T_PEAK, 1.0], [T_POST, 1.1]], t2 => t2), 540, 1000, () => peakWorld(t), ...shake(t, t > T_PEAK + 0.05 && t < T_PEAK + 0.3 ? 6 : 0, 40))],
    // G · s7 forced calm: pick up the screw, pocket it, pat the wardrobe, it creaks once
    [T_POST, t => cam(kf(t, [[T_POST, 1.0], [T_REACH, 1.12]], t2 => t2), kf(t, [[T_POST, 540], [T_REACH, 600]], t2 => t2), 1000, () => postWorld(t))],
    // H · the silent collapse: reach, door cracks, the whole wardrobe folds flat like a card house, dust
    [T_REACH, t => cam(kf(t, [[T_REACH, 1.05], [T_OPEN, 1.2]], t2 => t2), 560, 1000, () => foldWorld(t))],
    // H2 · WIDE: whole wardrobe + whole Steve in frame; creak, the top tips, sides slap out, back falls, dust, silence
    [T_OPEN, t => {
      let a = 0; for (const lt of LAND) if (t > lt) a += 14 * Math.exp(-(t - lt) * 11);
      cam(kf(t, [[T_OPEN, 0.82], [T_PUNCH, 0.78]], t2 => t2), 620, 1010, () => foldWorld(t), ...shake(t, a, 37));
    }],
    // I · PUNCH (s8): deadpan in the dust, the handle falls off in his hand, hold
    [T_PUNCH, t => cam(kf(t, [[T_PUNCH, 1.0], [T_BTN, 1.28]], t2 => t2), kf(t, [[T_PUNCH, 560], [T_BTN, 480]], t2 => t2), kf(t, [[T_PUNCH, 1000], [T_BTN, 960]], t2 => t2), () => afterWorld(t))],
    // J · BUTTON: step 1, the cartoon man holds one screw; push-in lands exactly on frame 1 (loop)
    [T_BTN, t => {
      const z1 = 800 / BTN.L, z = kf(t, [[T_BTN, 0.9], [T_BTN + 0.8, 1.1], [DUR, z1]], t2 => t2 * t2);
      const u = clamp01((z - 1.1) / (z1 - 1.1));
      const fx = lerp(540, BTN.px - 20 / z1, u), fy = lerp(900, BTN.py - 680 / z1, u);
      cam(z, fx, fy, () => buttonWorld(t));
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
  if (t < 2.5 || t >= DUR - 0.9) title(['POV: one screw', 'left over']);
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
