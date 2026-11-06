// UNIT 4B · 17 "Typing..." — 3 KEY STILLS, full-bleed 9:16 panel (title inside the panel). render(0|1|2).
import { drawCharacter, paper, panel, nameTab, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const INK = '#2a2230', TITLE_Y = 232, PL_Y = 1640;   // caption plate starts at y 1640 (> 82 % of H)
const spen = (t, seed) => { const p = new VPen(ctx, 0, 0, 1, { lw: 3, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
function text(s, x, y, size, color = INK, font = 'Fredoka', rot = 0, weight = '600') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
}
const armTo = (X, shY, sc, hx, hy, bend) => ({ hand: [(hx - X) / sc, (shY - hy) / sc], bend });
const headOf = (x, y, s) => [x, y - 80 * s, 15 * s];
function title() {   // inside the panel, top; clears y 170
  ctx.save(); ctx.font = '600 56px Fredoka'; const w = ctx.measureText("POV: they're typing...").width + 70;
  ctx.fillStyle = 'rgba(42,34,48,0.9)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, TITLE_Y - 50, w, 100, 50); ctx.fill();
  text("POV: they're typing...", 540, TITLE_Y + 3, 56, '#fff6dc'); ctx.restore();
}
function plate(id, lines, stress = []) {   // caption plate with name tab; words in `stress` go yellow
  ctx.save(); ctx.fillStyle = 'rgba(30,24,40,0.88)'; ctx.beginPath(); ctx.roundRect(40, PL_Y, 1000, 240, 36); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  nameTab(ctx, 70, PL_Y - 30, id, 34);
  const size = lines.length > 1 ? 76 : 100; ctx.save(); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  lines.forEach((ln, li) => {
    const ws = ln.split(' '), gap = 20, wd = ws.map(w => ctx.measureText(w).width); let x = 540 - (wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
    const y = PL_Y + 135 + (li - (lines.length - 1) / 2) * (size + 6);
    ws.forEach((w, i) => { ctx.fillStyle = stress.some(s => w.startsWith(s)) ? '#ffd84a' : '#fff'; ctx.fillText(w, x, y); x += wd[i] + gap; });
  });
  ctx.restore();
}
function bubble(p, cx, cy, w, h, dots = true, tailX = 0, fill = '#e8eaf4') {
  p.part(roundPoly([[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]], h * 0.42), fill, { shade: 0.1, lw: 6 });
  const tx = cx + tailX; p.part(roundPoly([[tx - w * 0.07, cy + h / 2 - 8], [tx + w * 0.07, cy + h / 2 - 8], [tx - w * 0.02, cy + h / 2 + h * 0.22]], 6), fill, { shade: 0.1, lw: 6 });
  p.line([[tx - w * 0.06, cy + h / 2 - 6], [tx + w * 0.06, cy + h / 2 - 6]], 7, fill);
  if (dots) for (let i = -1; i <= 1; i++) p.dot(cx + i * w * 0.24, cy - (i === 0 ? h * 0.05 : -h * 0.03) , h * 0.13, h * 0.13, '#5d6382');
}
function wall(t, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function faceGlow(hc, rgba = 'rgba(110,190,255,0.5)', dx = 0, dy = 160) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 8, 0, 7); ctx.clip();
  const g = ctx.createRadialGradient(hc[0] + dx, hc[1] + dy, 20, hc[0] + dx, hc[1] + dy, hc[2] * 1.5); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.fillStyle = g; ctx.fillRect(hc[0] - 400, hc[1] - 400, 800, 800); ctx.restore();
}
function drop(p, x, y, sz, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]], '#8fd3f4', { shade: false, lw: 3 }); ctx.restore();
}

// ---------- STILL 1 · frame 1 (t=0.0) ----------
function still1(t) {
  wall(t, '#232a52', '#141833');
  const p = spen(t, 3);
  ctx.fillStyle = '#10142c'; ctx.fillRect(0, 1480, W, 440); p.line([[0, 1480], [W, 1480]], 5);   // floor
  // window with moon
  p.part(roundPoly([[60, 330], [260, 330], [260, 700], [60, 700]], 8), '#0e1230', { shade: false, lw: 5 }); p.line([[160, 330], [160, 700]], 4); p.line([[60, 515], [260, 515]], 4);
  ctx.fillStyle = '#f4efd0'; ctx.beginPath(); ctx.arc(110, 420, 26, 0, 7); ctx.fill(); ctx.fillStyle = '#0e1230'; ctx.beginPath(); ctx.arc(122, 414, 23, 0, 7); ctx.fill();
  // the storm-cloud bubble: giant, dots bounce (phase 0), swelling shadow below
  ctx.save(); const sg = ctx.createRadialGradient(540, 760, 40, 540, 760, 560); sg.addColorStop(0, 'rgba(8,10,28,0.5)'); sg.addColorStop(1, 'rgba(8,10,28,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 400, W, 700); ctx.restore();
  const bp = spen(t, 11); bubble(bp, 560, 520, 840, 360, true, -120);
  for (const [x, y, z] of [[1000, 760, 22], [30, 840, 16]]) bp.line([[x, y], [x - 30, y + 60]], 5, '#8fa0d8');   // rain ticks = storm
  // Steve close-up (face 26 % of frame height) + phone held below his chin, screen toward him
  const s = 17, X = 390, hc0 = 1090, Y = hc0 + 80 * s, shY = Y - 60 * s;
  const phx = 390, phy = 1500;
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'wide', brow: 'worried', mouth: 'small', fx: ['sweat'], look: 0.1, hair: 1, bags: 1,
    armL: armTo(X, shY, s, phx - 110, phy + 30, [0, -3]), armR: armTo(X, shY, s, phx + 110, phy + 30, [0, -3]) }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s); faceGlow(hc);
  drop(spen(t, 21), hc[0] + hc[2] + 70, hc[1] - 90, 22, 0.35);
  // phone back (dark) with a glow rim
  ctx.save(); const gl = ctx.createRadialGradient(phx, phy, 40, phx, phy, 420); gl.addColorStop(0, 'rgba(120,200,255,0.35)'); gl.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 1100, W, 540); ctx.restore();
  const q = spen(t, 9); q.part(roundPoly([[phx - 105, phy - 150], [phx + 105, phy - 150], [phx + 105, phy + 150], [phx - 105, phy + 150]], 30), '#2a3050', { shade: 0.1, lw: 6 });
  q.dot(phx - 55, phy - 105, 17, 17, '#12162e'); q.dot(phx - 18, phy - 105, 11, 11, '#12162e');
  // Snuggles beside him, staring up
  const cs = 12.5, cX = 870, cY = 1180 + 34 * cs;
  drawCharacter(ctx, 'snuggles', cX, cY, cs, { eyes: 'wide', look: 0.1, mouth: 'line', tail: 0.4 }, { frame: boilFrame(t) });
  title(); plate('snuggles', ['Nine forty-one.', 'He asked ONE question.'], ['ONE']);
}

// ---------- STILL 2 · PEAK (line 7) ----------
function still2(t) {
  wall(t, '#2a2f56', '#171b38');
  const p = spen(t, 5);
  ctx.fillStyle = '#10142c'; ctx.fillRect(0, 1540, W, 380); p.line([[0, 1540], [W, 1540]], 5);
  // the bubble fills the ceiling
  const bp = spen(t, 12); bubble(bp, 540, 380, 1180, 520, true, 120);
  // scroll of text unrolling from the bubble to the floor and across it
  const sx0 = 700, sx1 = 1010, sy0 = 600, sy1 = 1500, sp = spen(t, 31);
  sp.part(roundPoly([[sx0, sy0], [sx1, sy0], [sx1, sy1], [sx0, sy1]], 6), '#f7f0d8', { shade: 0.08, lw: 5 });
  sp.part(roundPoly([[sx0 - 260, sy1 - 20], [sx1, sy1 - 20], [sx1, sy1 + 36], [sx0 - 260, sy1 + 36]], 20), '#efe6c4', { shade: 0.1, lw: 5 });
  sp.part(ellipsePts(sx0 - 262, sy1 + 8, 26, 30, 20), '#e2d6ac', { shade: 0.1, lw: 5 });
  const words = ['and another', 'thing is,', 'ALSO...', 'furthermore', 'as I said', 'in March,', 'honestly', 'listen,', 'and ANOTHER', 'thing...', 'so anyway', 'where was I', 'oh right,', 'and also...'];
  words.forEach((w, i) => text(w, (sx0 + sx1) / 2, sy0 + 50 + i * 62, 40, /[A-Z]{3}/.test(w) ? '#d9382c' : '#5a4f66', 'Patrick Hand', (i % 2 ? 0.015 : -0.015), '400'));
  // table + Steve behind it, gripping the edge
  const s = 12, X = 290, hc0 = 1180, Y = hc0 + 80 * s, shY = Y - 60 * s, ty = 1500;
  drawCharacter(ctx, 'steve', X, Y, s, { eyes: 'pinpoint', brow: 'worried', mouth: 'O', fx: ['sweat', 'gloom'], look: 0.3, hair: 2, bags: 1,
    armL: armTo(X, shY, s, 60, ty - 10, [-3, -3]), armR: armTo(X, shY, s, 520, ty - 10, [3, -3]) }, { frame: boilFrame(t) });
  const tp = spen(t, 41);
  tp.part(roundPoly([[-30, ty], [640, ty], [640, 1920], [-30, 1920]], 6), '#8a6a48', { shade: 0.12, lw: 6 });
  tp.part(roundPoly([[-40, ty - 26], [660, ty - 26], [660, ty + 16], [-40, ty + 16]], 6), '#a98660', { shade: 0.12, lw: 6 });
  for (const [dx, dy] of [[-1, 0], [1, 0]]) tp.line([[dx > 0 ? 680 : -60, ty - 40], [dx > 0 ? 700 : -80, ty - 60]], 5);   // table shake ticks
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(110,190,255,0.3)', 0, 120);
  drop(spen(t, 22), hc[0] + hc[2] + 60, hc[1] - 80, 20, 0.35);
  title(); plate('steve', ['Is that a paragraph?', "It's a PARAGRAPH."], ['PARAGRAPH']);
}

// ---------- STILL 3 · PUNCH (line 9) ----------
function still3(t) {
  wall(t, '#262c58', '#141833');
  const p = spen(t, 7);
  // the giant cloud's edge far above + a dotted sway path: the tiny bubble drifted all the way down
  p.line([[540, 270], [610, 350], [470, 440], [600, 520]], 4, 'rgba(160,175,230,0.5)');
  ctx.save(); ctx.fillStyle = 'rgba(8,10,28,0.35)'; ctx.fillRect(0, 280, W, 900); ctx.restore();
  const bp = spen(t, 13); bubble(bp, 560, 700, 880, 700, false, -150, '#eef0f8');
  text('k', 560, 690, 560, '#2a2230', 'Fredoka', 0, '600');
  // Steve in the corner: lids half dropped, flat
  const s = 11.5, X = 270, hc0 = 1360, Y = hc0 + 80 * s;
  drawCharacter(ctx, 'steve', X, Y, s, { expr: 'deadpan', lid: 0.55, mouth: 'line', fx: ['gloom'], look: 0.6, hair: 0, bags: 1, arm: 'down' }, { frame: boilFrame(t) });
  const hc = headOf(X, Y, s); faceGlow(hc, 'rgba(110,190,255,0.3)', 120, -60);
  title(); plate('steve', ['…k.']);
}

const STILLS = [still1, still2, still3];
function render(i) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); STILLS[Math.round(i)](0.1); ctx.restore();
  panel(ctx, 6, 6, W - 12, H - 12, 5, null, boilFrame(0.1));
}
window.render = render; window.TEXTS = () => []; window.DUR = 3;
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  render(0); window.READY = true;
})();
