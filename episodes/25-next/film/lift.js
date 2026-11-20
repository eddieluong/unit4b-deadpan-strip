// lift.js — drawing helpers lifted from stills.js (approved key-still look) + live boil time. Edit scene.js for animation.
// UNIT 4B · 25 "One Bulb" (Tập 16).
import { drawCharacter, paper, panel } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';
export { drawCharacter, paper, panel, roundPoly, ellipsePts, VPen, boilFrame };

export const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
export const NOW = () => (typeof window !== 'undefined' && window.T_NOW !== undefined) ? window.T_NOW : 0.1;
export const INK = '#2a2230', TITLE_Y = 232;
export const SKIN = '#e2ac84';
export const spen = (t, seed, lw = 3) => { const p = new VPen(ctx, 0, 0, 1, { lw, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
// pen in Steve/Snuggles local units (same mapping drawCharacter uses)
export const lpen = (X, Y, s, seed = 5) => new VPen(ctx, X, Y, s, { lw: Math.max(2.4, s * 0.95), hand: true, frame: boilFrame(NOW()), seed });
export function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
export function strokedText(s, x, y, size, fill = '#fff', lw = 10) {
  ctx.save(); ctx.font = `600 ${size}px "Fredoka"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.strokeText(s, x, y); ctx.fillStyle = fill; ctx.fillText(s, x, y); ctx.restore();
}
export function title(T) {   // inside the panel, top; clears y 170 (iPhone safe area)
  ctx.save(); ctx.font = '600 56px Fredoka'; const w = ctx.measureText(T).width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 52, w, 104, 52); ctx.fill();
  text(T, 540, TITLE_Y + 3, 56, '#fff6dc'); ctx.restore();
}
export function glowBlob(x, y, r, rgba) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
export const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
export const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

export function armTube(pts, w, skin, seed = 31) { spen(NOW(), seed, 5).tube(pts, w, skin); }
export function steve(X, Y, s, pose, skin) { window.STEVE_SKIN = skin; drawCharacter(ctx, 'steve', X, Y, s, { arm: 'down', noShadow: true, ...pose }, { frame: boilFrame(NOW()) }); }
export function snuggles(X, Y, s, pose) { drawCharacter(ctx, 'snuggles', X, Y, s, { noShadow: true, ...pose }, { frame: boilFrame(NOW()) }); }

// ---------- palette / bulbs ----------
export const BULB_DIM = ['#a8413a', '#b0963a', '#3a6fa8', '#c07a3a', '#a85a8a'];
export const BULB_LIT = ['#ff4a3d', '#ffe14a', '#4aa8ff', '#ff9a2e', '#ff6ac8'];
export const WIRE = '#2f8a46';
// one bulb at (x,y); ang = direction the bulb hangs (rad); lit: bright + glow
export function bulb(x, y, ang, k, r = 24, lit = true, glow = 1) {
  const col = (lit ? BULB_LIT : BULB_DIM)[k % 5];
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang - Math.PI / 2);
  if (lit) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(0, r, 4, 0, r, r * 4.2 * glow); g.addColorStop(0, col + 'cc'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(-r * 5, -r * 4, r * 10, r * 10); ctx.restore(); }
  ctx.fillStyle = '#3b3340'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-r * 0.42, -r * 0.2, r * 0.84, r * 0.8, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-r * 0.62, r * 0.5); ctx.quadraticCurveTo(-r * 1.05, r * 1.5, 0, r * 1.75); ctx.quadraticCurveTo(r * 1.05, r * 1.5, r * 0.62, r * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,' + (lit ? 0.75 : 0.3) + ')'; ctx.beginPath(); ctx.ellipse(-r * 0.3, r * 1.15, r * 0.14, r * 0.3, 0.3, 0, 7); ctx.fill();
  ctx.restore();
}
export function wireStroke(pts, w = 12, col = WIRE) {   // pts: path fn
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = w + 8; pts(); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = w; pts(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = w * 0.28; pts(); ctx.stroke();
  ctx.restore();
}
export function star(x, y, R, fill = '#ffe14a') {
  const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.45 : R; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  poly(pts, fill); spen(NOW(), 77, 5).outline(pts, true, 6);
}
// giant knotted ball of lights
export const litAt = (i, j) => hash(i * 31 + j * 5 + 9) > 0.82;
export function knotBall(cx, cy, R, blink = -1, litAll = false) {
  let g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.1, cx, cy, R);
  g.addColorStop(0, '#2e7d46'); g.addColorStop(1, '#17432a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 0.93, 0, 7); ctx.fill();
  const loops = [], N = 30;
  for (let i = 0; i < N; i++) {
    const rot = hash(i + 1) * Math.PI, rx = R * (0.58 + 0.4 * hash(i + 50)), ry = R * (0.25 + 0.68 * hash(i + 90)), ox = (hash(i + 130) - 0.5) * R * 0.2, oy = (hash(i + 170) - 0.5) * R * 0.2;
    loops.push([cx + ox, cy + oy, rx, ry, rot]);
    wireStroke(() => { ctx.beginPath(); ctx.ellipse(cx + ox, cy + oy, rx, ry, rot, 0, 7); }, 13, i % 3 === 0 ? '#3aa055' : WIRE);
  }
  // bulbs on the wires, drawn on top so they read at phone size
  let k = 0;
  for (let i = 0; i < N; i++) {
    const [ox, oy, rx, ry, rot] = loops[i];
    for (let j = 0; j < 3; j++) {
      const a = hash(i * 7 + j * 13 + 3) * 6.283, lx = Math.cos(a) * rx, ly = Math.sin(a) * ry;
      const x = ox + lx * Math.cos(rot) - ly * Math.sin(rot), y = oy + lx * Math.sin(rot) + ly * Math.cos(rot);
      const out = Math.atan2(y - cy, x - cx), lit = litAll || (litAt(i, j) && (i * 3 + j) !== blink);
      bulb(x, y, out + (hash(i + j) - 0.5) * 0.8, k++, 25, lit);
    }
  }
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R * 0.95, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.restore();
}
export function plug(x, y, rot = 0, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  ctx.fillStyle = '#cfd3da'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
  for (const dx of [-17, 17]) { ctx.beginPath(); ctx.roundRect(dx - 6, -86, 12, 52, 3); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#f4f1e6'; ctx.beginPath(); ctx.roundRect(-40, -40, 80, 74, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-30, 16, 60, 8);
  ctx.restore();
}
export function livingWall(t, floorTop, warm = 1) {
  ctx.fillStyle = '#e6c9a0'; ctx.fillRect(0, 0, W, floorTop);
  ctx.fillStyle = 'rgba(160,110,70,0.16)'; for (let x = 0; x < W; x += 120) ctx.fillRect(x, 0, 60, floorTop);
  ctx.fillStyle = '#9a6a45'; ctx.fillRect(0, floorTop, W, H - floorTop);
  ctx.fillStyle = 'rgba(60,30,10,0.18)'; for (let y = floorTop + 70, r = 0; y < H; y += 90, r++) { ctx.fillRect(0, y, W, 5); for (let x = (r % 2) * 130; x < W; x += 260) ctx.fillRect(x, y - 90, 5, 90); }
  const p = spen(t, 40, 8); p.line([[-10, floorTop], [W + 10, floorTop]], 9, INK);
  ctx.fillStyle = '#6e4a30'; ctx.fillRect(0, floorTop - 46, W, 46); p.line([[-10, floorTop - 46], [W + 10, floorTop - 46]], 6, INK);
}

// ---------- STILL 1 · HOOK: giant knot + Steve poking out, plug up ----------
export function still1(t) {
  livingWall(t, 1600);
  // soft warm lamp light on the wall behind
  glowBlob(540, 640, 800, 'rgba(255,225,160,0.35)');
  const s = 15, X = 540, hcY = 640, Y = hcY + 80 * s;
  // right arm up holding the plug (sleeve + skin hand), behind the knot at the shoulder
  armTube([[700, 1000], [870, 920], [850, 700]], 64, '#e2b23c', 32);
  steve(X, Y, s, { hair: 1, eyes: 'dot', lid: 0.1, brow: 'worried', mouth: 'line', look: 0.35, fx: ['sweat'], arm: 'down' }, SKIN);
  knotBall(540, 1320, 540);
  // wire loops over his chin and neck
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(300, 860); ctx.quadraticCurveTo(540, 960, 780, 850); }, 14);
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(330, 820); ctx.quadraticCurveTo(520, 905, 740, 800); }, 12, '#3aa055');
  bulb(420, 905, 1.7, 1, 26, true); bulb(660, 892, 1.5, 3, 26, false);
  // the plug on its cord: from the knot up to the raised fist
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(830, 1090); ctx.bezierCurveTo(1010, 1000, 1010, 800, 872, 700); }, 13);
  const fist = ellipsePts(852, 690, 46, 40, 24);
  plug(852, 630, 0.18, 1.5);
  ctx.save(); ctx.fillStyle = SKIN; ctx.beginPath(); fist.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); ctx.restore(); spen(NOW(), 33, 6).outline(fist, true, 6);
  bulb(960, 930, 0.2, 2, 26, true);
  title('POV: getting the Christmas lights out');
}

// ---------- STILL 2 · PEAK "YES!" wrapped in lights, living room ----------
export function still2(t) {
  livingWall(t, 1560);
  // window (night) left, sofa right
  { const p = spen(t, 41, 7); ctx.fillStyle = '#1b2447'; ctx.fillRect(40, 420, 250, 420); ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (const [x, y] of [[90, 480], [220, 540], [150, 640], [240, 740], [80, 770]]) ctx.fillRect(x, y, 7, 7);
    p.outline([[40, 420], [290, 420], [290, 840], [40, 840]], true, 9); p.line([[165, 420], [165, 840]], 7); p.line([[40, 630], [290, 630]], 7); }
  { const p = spen(t, 42, 7); p.part(roundPoly([[800, 1150], [1090, 1150], [1090, 1560], [800, 1560]], 40), '#b4503f', { shade: 0.15, lw: 8 }); }
  // tree-shaped light zigzag
  const s = 10.5, X = 540, hcY = 690, Y = hcY + 80 * s;
  const ry0 = Y - 61 * s, wAt = y => 140 + (y - ry0) * 0.2;
  // arms up, triumphant
  steve(X, Y, s, { hair: 2, eyes: 'happy', brow: 'raised', mouth: 'grin', fx: ['blush'], arm: 'surrender' }, SKIN);
  const path = [];
  for (let i = 0, y = ry0 - 10; y < Y - 30; i++, y += 62) path.push([X + (i % 2 ? 1 : -1) * wAt(y), y]);
  wireStroke(() => { ctx.beginPath(); path.forEach((q, i) => i ? ctx.quadraticCurveTo((path[i - 1][0] + q[0]) / 2, (path[i - 1][1] + q[1]) / 2 + 34, q[0], q[1]) : ctx.moveTo(q[0], q[1])); }, 12);
  let k = 0;
  for (let i = 1; i < path.length; i++) for (let j = 0; j < 5; j++) {
    const u = (j + 0.5) / 5, x = path[i - 1][0] + (path[i][0] - path[i - 1][0]) * u, y = path[i - 1][1] + (path[i][1] - path[i - 1][1]) * u + Math.sin(u * Math.PI) * 17;
    bulb(x, y, Math.PI / 2 + (j % 2 ? 0.3 : -0.3), k++, 22, true, 1.2);
  }
  // star on top and the cord to the wall socket
  star(X, hcY - 292, 58);
  wireStroke(() => { ctx.beginPath(); ctx.moveTo(X - wAt(Y - 90), Y - 90); ctx.bezierCurveTo(300, Y + 20, 200, Y + 60, 90, 1500); }, 11);
  { ctx.fillStyle = '#f4f1e6'; ctx.beginPath(); ctx.roundRect(40, 1450, 90, 110, 10); ctx.fill(); spen(NOW(), 43, 5).outline([[40, 1450], [130, 1450], [130, 1560], [40, 1560]], true, 6); plug(86, 1480, 0, 0.8); }
  // XMAS box with Snuggles
  { const p = spen(t, 44, 7); p.part([[800, 1560], [1060, 1560], [1060, 1760], [800, 1760]], '#c79a5a', { shade: 0.18, lw: 8 }); text('XMAS', 930, 1660, 70, INK, 'Fredoka', -0.04); }
  snuggles(930, 1560, 5.8, { eyes: 'dot', lid: 0.35, look: -0.8, mouth: 'line', tilt: -6, tail: 0.3 });
  // warm glow
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,215,150,0.28)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  glowBlob(540, 1150, 820, 'rgba(255,200,110,0.42)');
  title('POV: getting the Christmas lights out');
  const T = 'YES! YES!'; ctx.save(); ctx.font = '600 100px Fredoka'; const w = ctx.measureText(T).width + 100;
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, 1770, w, 130, 65); ctx.fill(); text(T, 540, 1838, 100, '#fff2b0'); ctx.restore();
}

// ---------- STILL 3 · PUNCH: street blackout, only eyes and teeth ----------
export function blackout(t, o = {}) {
  const WO = o.win ?? 1;
  // night sky
  const g = ctx.createLinearGradient(0, 0, 0, 1000); g.addColorStop(0, '#080b1c'); g.addColorStop(1, '#1a2146'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 40; i++) ctx.fillRect(hash(i) * W, 330 + hash(i + 40) * 380, 5, 5);
  ctx.fillStyle = '#d8def5'; ctx.beginPath(); ctx.arc(150, 470, 52, 0, 7); ctx.fill(); glowBlob(150, 470, 240, 'rgba(160,180,255,0.22)');
  const RIM = '#34407a', HOUSE = '#05060d';
  const house = (x0, x1, top, base, roof) => { const pts = [[x0, base], [x0, top], [(x0 + x1) / 2, top - roof], [x1, top], [x1, base]]; poly(pts, HOUSE); const p = spen(t, Math.round(x0), 5); p.line([[x0, top], [(x0 + x1) / 2, top - roof], [x1, top]], 6, RIM); };
  house(-40, 250, 700, 1010, 110); house(260, 470, 760, 1010, 90); house(480, 1040, 640, 1010, 150);
  // neighbour window across the street: dim torch glow + silhouette, shutters
  { const x = 800, y = 760; ctx.save(); ctx.globalAlpha = WO; ctx.fillStyle = '#7a6226'; ctx.fillRect(x - 85, y - 90, 170, 190); glowBlob(x, y + 10, 190, 'rgba(255,220,120,0.25)');
    ctx.fillStyle = '#05060d'; ctx.beginPath(); ctx.arc(x - 6, y - 5, 38, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 80, y + 100); ctx.quadraticCurveTo(x - 6, y + 20, x + 70, y + 100); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = 1 - WO; ctx.fillStyle = '#0b0e1c'; ctx.fillRect(x - 85, y - 90, 170, 190); ctx.restore();
    ctx.strokeStyle = '#05060d'; ctx.lineWidth = 12; ctx.strokeRect(x - 85, y - 90, 170, 190); ctx.beginPath(); ctx.moveTo(x, y - 90); ctx.lineTo(x, y + 100); ctx.stroke();
    spen(t, 55, 5).outline([[x - 91, y - 96], [x + 91, y - 96], [x + 91, y + 106], [x - 91, y + 106]], true, 4); }
  // street + faint kerb
  ctx.fillStyle = '#0a0c18'; ctx.fillRect(0, 1010, W, 90); spen(t, 56, 5).line([[0, 1010], [W, 1010]], 6, RIM);
  // Steve's own facade: dark wall, big window, curtains, unlit bulbs along the sill
  ctx.fillStyle = '#06070f'; ctx.fillRect(0, 1100, W, H - 1100); ctx.fillStyle = 'rgba(52,64,122,0.22)'; for (let y = 1130; y < H; y += 70) ctx.fillRect(0, y, W, 4);
  const wx0 = 90, wx1 = 990, wy0 = 1130, wy1 = 1800;
  ctx.fillStyle = '#010208'; ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
  const cx = 540, cy = 1430;
  // head silhouette in Steve's proportions (hair spikes, ears, hood shoulders), cool moon rim light
  const HC = '#0c1026', RIMC = '#6f86d8', hr = 270, DY = 80, hcy = cy - 10 + DY;
  ctx.save(); ctx.beginPath(); ctx.rect(wx0, wy0, wx1 - wx0, wy1 - wy0); ctx.clip();
  const sh = [[cx - 470, wy1 + 20], [cx - 430, cy + 380], [cx - 250, cy + 300], [cx + 250, cy + 300], [cx + 430, cy + 380], [cx + 470, wy1 + 20]];
  poly(sh, HC); spen(t, 58, 6).line([[cx - 470, wy1], [cx - 430, cy + 380], [cx - 250, cy + 300]], 8, '#3a4a8c');
  ctx.fillStyle = HC; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + sx * (hr + 6), hcy + 30, 34, 52, 0, 0, 7); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(cx, hcy, hr + 6, hr, 0, 0, 7); ctx.fill();
  const spikes = [[-250, -150, -330, -330], [-170, -215, -230, -420], [-80, -250, -90, -450], [10, -262, 70, -480], [100, -250, 210, -430], [190, -205, 330, -350], [250, -140, 370, -240]];
  const tips = [];
  for (const [bx, by, tx0, ty0] of spikes) { const tx = bx + (tx0 - bx) * 0.45, ty = by + (ty0 - by) * 0.45; const nx = -(ty - by), ny = tx - bx, L = Math.hypot(nx, ny), w = 46; poly([[cx + bx - nx / L * w, hcy + by - ny / L * w], [cx + tx, hcy + ty], [cx + bx + nx / L * w, hcy + by + ny / L * w]], HC); { const a = [cx + bx - nx / L * w, hcy + by - ny / L * w], b = [cx + bx + nx / L * w, hcy + by + ny / L * w], T = [cx + tx, hcy + ty], left = a[0] < b[0] ? a : b; ctx.save(); ctx.lineJoin = 'round'; ctx.strokeStyle = RIMC; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(left[0], left[1]); ctx.lineTo(T[0], T[1]); ctx.stroke(); ctx.strokeStyle = '#3a4a8c'; ctx.lineWidth = 5; ctx.lineTo(a === left ? b[0] : a[0], a === left ? b[1] : a[1]); ctx.stroke(); ctx.restore(); } tips.push([cx + bx - Math.sign(bx || 1) * 0 - 38, hcy + by + 10, cx + tx, hcy + ty]); }
  ctx.fillStyle = HC; ctx.beginPath(); ctx.ellipse(cx, hcy - 170, 250, 120, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#4c5fa8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(cx, hcy - 170, 250, 120, 0, Math.PI * 1.0, Math.PI * 1.6); ctx.stroke();
  // rim light: left head edge + left-facing sides of the hair spikes
  ctx.lineCap = 'round'; ctx.strokeStyle = RIMC; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(cx, hcy, hr + 6, hr, 0, Math.PI * 0.62, Math.PI * 1.12); ctx.stroke();
    ctx.strokeStyle = 'rgba(140,165,240,0.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(cx, hcy, hr + 6, hr, 0, Math.PI * 1.12, Math.PI * 1.3); ctx.stroke();
  ctx.restore();
  // window frame + sill in moon rim, curtains, a dead (dark) bulb string over the top
  { const p = spen(t, 57, 9); p.outline([[wx0, wy0], [wx1, wy0], [wx1, wy1], [wx0, wy1]], true, 14); p.line([[wx0 - 30, wy1 + 10], [wx1 + 30, wy1 + 10]], 12, RIM); }
  ctx.save(); ctx.strokeStyle = RIM; ctx.lineWidth = 7; ctx.beginPath(); ctx.rect(wx0, wy0, wx1 - wx0, wy1 - wy0); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#1b2850'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(wx0 - 30, wy0 - 30); for (let i = 1; i <= 8; i++) ctx.quadraticCurveTo(wx0 - 30 + (i - 0.5) * 120, wy0 + 30, wx0 - 30 + i * 120, wy0 - 30); ctx.stroke(); ctx.restore();
  for (let i = 0; i < 8; i++) bulb(wx0 + 30 + i * 120, wy0 - 4, Math.PI / 2, i, 22, false);
  const face = () => { ctx.save(); ctx.globalAlpha = o.eyes ?? 1; const LK = o.look ?? 1, BL = o.blink ?? 0;
  for (const dx of [-105, 105]) {
    ctx.fillStyle = '#f4efe6'; ctx.beginPath(); ctx.ellipse(cx + dx, cy - 30 + DY, 66, 84 * (1 - 0.92 * BL) + 3, 0, 0, 7); ctx.fill();
    if (BL < 0.6) { ctx.fillStyle = '#05060d'; ctx.beginPath(); ctx.arc(cx + dx + 22 * LK, cy - 50 + DY + 6 * (1 - LK), 27, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx + dx + 29 * LK, cy - 59 + DY + 6 * (1 - LK), 8, 0, 7); ctx.fill(); }
    else { ctx.strokeStyle = '#05060d'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx + dx - 60, cy - 30 + DY); ctx.lineTo(cx + dx + 60, cy - 30 + DY); ctx.stroke(); }
  }
  if (o.teeth !== false) { const tx = cx - 125, ty = cy + 130 + DY, tw = 250, th = 62; ctx.fillStyle = '#f4efe6'; ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 22); ctx.fill();
    ctx.strokeStyle = '#05060d'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(tx + 8, ty + th / 2); ctx.lineTo(tx + tw - 8, ty + th / 2); ctx.stroke();
    for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(tx + i * tw / 6, ty + 4); ctx.lineTo(tx + i * tw / 6, ty + th - 4); ctx.stroke(); } }
  ctx.restore(); };
  if (o.dim) { ctx.fillStyle = 'rgba(0,0,0,' + o.dim + ')'; ctx.fillRect(0, 0, W, H); }
  face();
  if (o.title === false) return;
  // title (cream outline so it clears the dark)
  ctx.save(); ctx.font = '600 56px Fredoka'; const w = ctx.measureText('POV: getting the Christmas lights out').width + 70;
  ctx.strokeStyle = '#fff6dc'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 52, w, 104, 52); ctx.stroke(); ctx.restore();
  title('POV: getting the Christmas lights out');
}

