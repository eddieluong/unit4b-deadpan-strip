// UNIT 4B · 16 "Last Day on Earth" — KEY STILLS page (render(0|1|2) = row 1, row 8, row 13). Layout: PREPRODUCTION #21 safe area.
import { drawCharacter, paper, panel, CAST } from './lib/cast_stick.js';
import { roundPoly, ellipsePts, VPen } from './lib/cast_v2.js';
import { boilFrame } from './lib/motion.js';

const W = 1080, H = 1920, cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PX = 40, PY = 320, PW = 1000, PH = 1300, INK = '#2a2230', TITLE_Y = [230, 290], CAP_Y = 1500;
const TITLE = ['The news said: World War 3.', 'So nothing matters.'];
const SLEEVE = CAST.steve.color;
const spen = (t, seed) => { const p = new VPen(ctx, 0, 0, 1, { lw: 2.6, hand: true, frame: boilFrame(t), seed }); p.T = q => q; return p; };
const clipPanel = fn => { ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip(); fn(); ctx.restore(); };
function hand(text, x, y, size, rot = 0, color = INK) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px "Fredoka"`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore();
}
function sfxText(text, x, y, size, rot = 0, fill = '#ffd84a') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.22; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0); ctx.restore();
}
function caption(lines, y0, size = 80, stress = []) {   // lines: arrays of words; stress: set of words in yellow
  ctx.save(); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  lines.forEach((ws, li) => {
    const gap = 22, wd = ws.map(w => ctx.measureText(w).width); let x = 540 - (wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
    ws.forEach((w, i) => { ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(w, x, y0 + li * (size + 14)); ctx.fillStyle = stress.includes(w) ? '#ffd84a' : '#fff'; ctx.fillText(w, x, y0 + li * (size + 14)); x += wd[i] + gap; });
  });
  ctx.restore();
}
const armTo = (X, shY, sc, hx, hy, bend) => ({ hand: [(hx - X) / sc, (shY - hy) / sc], bend });
const limb_unused = (p, pts, w = 30) => { p.line(pts, w + 8, INK); p.line(pts, w, SLEEVE); const h = pts[pts.length - 1]; p.dot(h[0], h[1], 25, 22, '#fffdf8'); };
const headOf = (x, y, s) => [x, y - 80 * s, 15 * s];   // standing head centre + radius (screen px)
function teardrop(p, x, y, sz, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  p.part([[0, -sz * 1.4], [sz * 0.8, sz * 0.2], [sz * 0.7, sz * 0.7], [0, sz * 1.1], [-sz * 0.7, sz * 0.7], [-sz * 0.8, sz * 0.2]].map(q => q), '#8fd3f4', { shade: false, lw: 3 });
  ctx.restore();
}

// ---------- STILL 1 · row 1: 2 A.M. in bed ----------
function still1(t) {
  clipPanel(() => {
    ctx.fillStyle = '#26305a'; ctx.fillRect(PX, PY, PW, PH);
    ctx.fillStyle = '#1b2244'; ctx.fillRect(PX, 1400, PW, 300);
    const p = spen(t, 3);
    p.part(roundPoly([[640, 400], [960, 400], [960, 760], [640, 760]], 10), '#14193a', { shade: false, lw: 5 });
    p.line([[800, 400], [800, 760]], 5); p.line([[640, 580], [960, 580]], 5);
    ctx.fillStyle = '#f4efd0'; ctx.beginPath(); ctx.arc(720, 480, 34, 0, 7); ctx.fill(); ctx.fillStyle = '#14193a'; ctx.beginPath(); ctx.arc(734, 472, 30, 0, 7); ctx.fill();
    p.part(roundPoly([[70, 1180], [330, 1180], [330, 1400], [70, 1400]], 10), '#3a4378', { shade: 0.1, lw: 5 });
    p.part(roundPoly([[84, 1090], [316, 1090], [316, 1180], [84, 1180]], 8), '#0d1126', { shade: false, lw: 5 });
    hand('2:00 AM', 200, 1136, 46, 0, '#ff5a4a');
    // bed: headboard, mattress, base, pillow
    p.part(roundPoly([[300, 560], [1040, 560], [1040, 1400], [300, 1400]], 30), '#6b4a3a', { shade: 0.12, lw: 6 });
    p.part(roundPoly([[320, 1380], [1060, 1380], [1060, 1520], [320, 1520]], 18), '#c8d0ea', { shade: 0.1, lw: 5 });
    p.part(roundPoly([[320, 1520], [1060, 1520], [1060, 1700], [320, 1700]], 8), '#6b4a3a', { shade: 0.12, lw: 5 });
    p.part(roundPoly([[330, 800], [560, 800], [570, 1180], [330, 1180]], 60), '#e6e8f6', { shade: 0.12, lw: 5 });   // pillow behind his back
    const s = 11, X = 440, Y = 1400, shY = Y - 45 * s;
    // phone (screen to the viewer) behind his hands
    const px = 800, py = 900, pw = 310, ph = 520;
    ctx.save(); ctx.translate(px, py); ctx.rotate(-0.05);
    ctx.save(); const gl = ctx.createRadialGradient(0, 0, 40, 0, 0, 640); gl.addColorStop(0, 'rgba(120,200,255,0.42)'); gl.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = gl; ctx.fillRect(-900, -900, 1800, 1800); ctx.restore();
    const q = spen(t, 9);
    q.part(roundPoly([[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [pw / 2, ph / 2], [-pw / 2, ph / 2]], 36), '#1a1e32', { shade: false, lw: 6 });
    q.part(roundPoly([[-pw / 2 + 16, -ph / 2 + 22], [pw / 2 - 16, -ph / 2 + 22], [pw / 2 - 16, ph / 2 - 22], [-pw / 2 + 16, ph / 2 - 22]], 20), '#e8f4ff', { shade: false, lw: 2 });
    q.part(roundPoly([[-pw / 2 + 16, -ph / 2 + 22], [pw / 2 - 16, -ph / 2 + 22], [pw / 2 - 16, -ph / 2 + 92], [-pw / 2 + 16, -ph / 2 + 92]], 12), '#d9382c', { shade: false, lw: 2 });
    hand('BREAKING', 0, -ph / 2 + 58, 38, 0, '#fff');
    ['WORLD', 'WAR 3:', 'ANY DAY', 'NOW?'].forEach((w, i) => hand(w, 0, -80 + i * 74, 58, 0, i === 3 ? '#d9382c' : INK));
    ctx.restore();
    // Steve sits up in bed; library arms reach the phone's lower sides
    drawCharacter(ctx, 'steve', X, Y, s, { expr: 'dead_inside', eyes: 'pinpoint', brow: 'worried', mouth: 'line', fx: [], look: 0.95, sit: 1, hair: 0, bags: 1,
      armL: armTo(X, shY, s, 680, 1050, [0, -4]), armR: armTo(X, shY, s, 790, 1100, [0, -5]) }, { frame: boilFrame(t) });
    // blanket over his legs
    p.part(roundPoly([[X - 300, Y - 120], [X + 40, Y - 160], [X + 330, Y - 190], [X + 560, Y - 140], [X + 600, Y - 20], [X - 300, Y - 20]], 90), '#8a5fb0', { shade: 0.14, lw: 6 });
    p.line([[X + 120, Y - 170], [X + 140, Y - 40]], 4, 'rgba(255,255,255,0.35)');
    // blue light on his face
    const hc = headOf(X, Y + 15 * s, s); ctx.save(); ctx.globalCompositeOperation = 'screen';
    const fg = ctx.createRadialGradient(hc[0] + 120, hc[1] + 40, 20, hc[0] + 60, hc[1], 330); fg.addColorStop(0, 'rgba(110,190,255,0.5)'); fg.addColorStop(1, 'rgba(110,190,255,0)');
    ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 7, 0, 7); ctx.clip(); ctx.fillStyle = fg; ctx.fillRect(hc[0] - 400, hc[1] - 400, 800, 800); ctx.restore();
  });
  caption([['World', 'War', 'THREE']], CAP_Y, 80, ['THREE']);
}

// ---------- STILL 2 · row 8: the peak, standing on a wobbly chair ----------
function still2(t) {
  clipPanel(() => {
    ctx.fillStyle = '#d8cfba'; ctx.fillRect(PX, PY, PW, PH); ctx.fillStyle = '#a89a80'; ctx.fillRect(PX, 1580, PW, 100);
    const p = spen(t, 3); p.line([[PX, 1580], [PX + PW, 1580]], 4);
    ctx.fillStyle = 'rgba(24,30,70,0.38)'; ctx.fillRect(PX, PY, PW, PH);
    p.part(roundPoly([[640, 400], [900, 400], [900, 740], [640, 740]], 8), '#12173a', { shade: false, lw: 5 }); p.line([[770, 400], [770, 740]], 4);
    const s = 10.2, X = 300, seat = 1400, shY = seat - 60 * s;
    // desk with the laptop at his hand height
    const D = spen(t, 33), dy = 1060;
    D.part(roundPoly([[480, dy], [1070, dy], [1070, dy + 36], [480, dy + 36]], 6), '#9a7a58', { shade: 0.14, lw: 5 });
    D.part(roundPoly([[1000, dy + 36], [1040, dy + 36], [1040, 1580], [1000, 1580]], 4), '#8a6a48', { shade: 0.14, lw: 5 });
    D.part(roundPoly([[520, dy + 36], [560, dy + 36], [560, 1580], [520, 1580]], 4), '#8a6a48', { shade: 0.14, lw: 5 });
    const lx0 = 510, lx1 = 960, sy0 = 700, sy1 = dy - 8;
    D.part(roundPoly([[lx0 - 10, sy1], [lx1 + 10, sy1], [lx1 + 30, sy1 + 8], [lx0 - 30, sy1 + 8]], 4), '#8a93a8', { shade: 0.12, lw: 5 });
    D.part(roundPoly([[lx0, sy0], [lx1, sy0], [lx1, sy1], [lx0, sy1]], 18), '#2a2f44', { shade: false, lw: 6 });
    D.part(roundPoly([[lx0 + 14, sy0 + 14], [lx1 - 14, sy0 + 14], [lx1 - 14, sy1 - 40], [lx0 + 14, sy1 - 40]], 8), '#f6f8fc', { shade: false, lw: 2 });
    D.part([[lx0 + 14, sy0 + 14], [lx1 - 14, sy0 + 14], [lx1 - 14, sy0 + 66], [lx0 + 14, sy0 + 66]], '#d9e4f4', { shade: false, lw: 2 });
    hand('To: Gary', lx0 + 110, sy0 + 40, 34, 0, INK); hand('Subject: URGENT', lx0 + 300, sy0 + 40, 24, 0, '#7a6a8a');
    hand('— And', 735, sy0 + 112, 54, 0, INK); hand('ANOTHER thing', 735, sy0 + 172, 56, 0, '#d9382c');
    D.part(roundPoly([[lx1 - 160, sy1 - 100], [lx1 - 34, sy1 - 100], [lx1 - 34, sy1 - 58], [lx1 - 160, sy1 - 58]], 12), '#2f6ac8', { shade: false, lw: 3 }); hand('SEND', lx1 - 97, sy1 - 79, 28, 0, '#fff');
    // chair + Steve, tilting together on the chair's near foot
    ctx.save(); ctx.translate(500, 1580); ctx.rotate(0.05); ctx.translate(-500, -1580);
    const c = spen(t, 21);
    c.part(roundPoly([[80, seat - 340], [124, seat - 340], [124, seat], [80, seat]], 6), '#e8a53a', { shade: 0.12, lw: 5 });
    for (const lx of [120, 470]) c.part(roundPoly([[lx - 14, seat], [lx + 14, seat], [lx + 22, 1580], [lx - 22, 1580]], 4), '#c8862a', { shade: 0.12, lw: 5 });
    c.part(roundPoly([[70, seat - 4], [520, seat - 4], [520, seat + 44], [70, seat + 44]], 8), '#f2c14e', { shade: 0.12, lw: 5 });
    const hy = seat - 4;
    drawCharacter(ctx, 'steve', X, hy, s, { expr: 'furious', look: 0.9, mouth: 'scream', fx: ['vein', 'sweat'], hair: 1, bags: 1,
      armL: armTo(X, hy - 60 * s, s, 600, dy - 40, [0, -4]), armR: armTo(X, hy - 60 * s, s, 700, dy - 36, [0, -5]) }, { frame: boilFrame(t) });
    const hc = headOf(X, hy, s);
    [[-1, -0.5, 14], [-0.9, 0.45, 12], [-1.2, 0.0, 10]].forEach(([dx, dy2, z]) => teardrop(c, hc[0] + dx * 230 + 40, hc[1] + dy2 * 240 - 30, z * 1.6, dx * 0.5));
    ctx.restore();
    const w = spen(t, 44); w.line([[40, 1560], [14, 1540]], 5); w.line([[30, 1590], [0, 1590]], 5); w.line([[560, 1500], [590, 1475]], 5);
    sfxText('#@$%&!', 720, 540, 125, -0.08, '#ff5a4a');
  });
  caption([['And', 'ANOTHER', 'thing']], CAP_Y, 80, ['ANOTHER']);
}

// ---------- STILL 3 · row 13: the punch, hallway ----------
function still3(t) {
  clipPanel(() => {
    ctx.fillStyle = '#e4dcc6'; ctx.fillRect(PX, PY, PW, PH); ctx.fillStyle = '#b9a98a'; ctx.fillRect(PX, 1560, PW, 160);
    const p = spen(t, 3); p.line([[PX, 1560], [PX + PW, 1560]], 4);
    for (let x = PX + 30; x < PX + PW; x += 90) p.line([[x, PY], [x, 1560]], 2, 'rgba(150,130,100,0.28)');
    const fx0 = 600, fx1 = 980, ftop = 440;
    p.part(roundPoly([[fx0, ftop], [fx1, ftop], [fx1, 1560], [fx0, 1560]], 4), '#4a3f55', { shade: false, lw: 6 });
    // the hot tub: huge, wedged diagonally across the doorway
    ctx.save(); ctx.translate(790, 1010); ctx.rotate(-0.38); ctx.translate(-790, -1010);
    const T = spen(t, 55);
    T.part(roundPoly([[420, 800], [1160, 800], [1160, 1260], [420, 1260]], 120), '#2fa6c8', { shade: 0.16, lw: 7 });
    T.part(roundPoly([[420, 800], [1160, 800], [1160, 900], [420, 900]], 50), '#f2f6fa', { shade: 0.1, lw: 6 });
    for (const [jx, jy] of [[540, 1010], [680, 1060], [820, 1010], [960, 1060], [1090, 1010], [610, 1170], [760, 1190], [900, 1170], [1040, 1190]]) T.part(ellipsePts(jx, jy, 20, 20, 16), '#1d7f9c', { shade: false, lw: 4 });
    T.part(roundPoly([[640, 930], [950, 930], [950, 1000], [640, 1000]], 10), '#fff1a8', { shade: 0.08, lw: 4 }); hand('HOT TUB $8,400', 795, 966, 36, 0, INK);
    ctx.restore();
    const F = spen(t, 56);   // jambs and lintel on top: the tub is stuck in the door
    F.part(roundPoly([[fx0 - 34, ftop - 30], [fx0 + 8, ftop - 30], [fx0 + 8, 1560], [fx0 - 34, 1560]], 4), '#8a5a3a', { shade: 0.14, lw: 6 });
    F.part(roundPoly([[fx1 - 8, ftop - 30], [fx1 + 34, ftop - 30], [fx1 + 34, 1560], [fx1 - 8, 1560]], 4), '#8a5a3a', { shade: 0.14, lw: 6 });
    F.part(roundPoly([[fx0 - 34, ftop - 40], [fx1 + 34, ftop - 40], [fx1 + 34, ftop + 8], [fx0 - 34, ftop + 8]], 4), '#8a5a3a', { shade: 0.14, lw: 6 });
    F.part(roundPoly([[750, 350], [850, 350], [850, 392], [750, 392]], 8), '#e0b04a', { shade: 0.1, lw: 4 }); hand('4B', 800, 372, 34, 0, INK);
    // Steve holding the box of desk things; library arms reach the box sides
    const X = 290, s = 10.6, Y = 1560, shY = Y - 60 * s, bx0 = 110, bx1 = 480, by0 = 1070, by1 = 1380;
    drawCharacter(ctx, 'steve', X, Y, s, { expr: 'dead_inside', mouth: 'line', fx: ['gloom'], look: 0.3, hair: 0, bags: 1,
      armL: armTo(X, shY, s, bx0 + 8, 1180, [-3, -2]), armR: armTo(X, shY, s, bx1 - 8, 1180, [3, -2]) }, { frame: boilFrame(t) });
    const hc = headOf(X, Y, s), B = spen(t, 66);
    B.part(roundPoly([[bx0 + 20, by0 - 10], [bx0 + 80, by0 - 10], [bx0 + 70, by0 + 40], [bx0 + 30, by0 + 40]], 4), '#b5673a', { shade: 0.12, lw: 4 });
    B.line([[bx0 + 50, by0 - 8], [bx0 + 52, by0 - 130], [bx0 + 130, by0 - 120], [bx0 + 175, by0 - 60]], 7, '#7a5a38');
    B.line([[bx0 + 50, by0 - 8], [bx0 + 20, by0 - 90], [bx0 - 40, by0 - 70], [bx0 - 60, by0 - 10]], 7, '#7a5a38');
    B.part(ellipsePts(bx0 + 176, by0 - 52, 20, 11, 10), '#a88a52', { shade: false, lw: 3 }); B.part(ellipsePts(bx0 - 58, by0 - 6, 20, 11, 10), '#a88a52', { shade: false, lw: 3 });
    B.part(roundPoly([[bx0 + 230, by0 - 50], [bx0 + 296, by0 - 50], [bx0 + 296, by0 + 20], [bx0 + 230, by0 + 20]], 6), '#d9382c', { shade: 0.1, lw: 4 });
    B.line([[bx0 + 296, by0 - 30], [bx0 + 320, by0 - 22], [bx0 + 296, by0 - 6]], 5);
    B.part(roundPoly([[bx0, by0], [bx1, by0], [bx1 - 24, by1], [bx0 + 24, by1]], 10), '#c9a46a', { shade: 0.14, lw: 6 });
    B.part(roundPoly([[bx0 + 110, by0 + 40], [bx1 - 110, by0 + 40], [bx1 - 120, by0 + 100], [bx0 + 120, by0 + 100]], 6), '#e9d8b4', { shade: 0.08, lw: 4 });
    hand('DESK', (bx0 + bx1) / 2, by0 + 180, 56, 0, INK);
    // cake frosting: white drips on forehead, cheek and chin + a few crumbs (no colour blobs)
    const Fr = spen(t, 77), [hx, hy, hr] = hc;
    for (const [dx, dy, rx, ry] of [[-0.62, 0.7, 24, 14], [0.0, 0.92, 38, 16], [-0.15, -0.72, 34, 16]]) Fr.part(ellipsePts(hx + dx * hr, hy + dy * hr, rx, ry, 16), '#fffefc', { shade: 0.06, lw: 3.5 });
    for (const [dx, dy, len] of [[-0.15, -0.65, 44], [-0.15, 0.95, 46]]) Fr.part(roundPoly([[hx + dx * hr - 9, hy + dy * hr], [hx + dx * hr + 9, hy + dy * hr], [hx + dx * hr + 8, hy + dy * hr + len], [hx + dx * hr - 8, hy + dy * hr + len]], 8), '#fffefc', { shade: 0.06, lw: 3.5 });
    for (const [dx, dy] of [[0.25, 0.3], [-0.3, 0.2], [0.7, 0.2], [0.1, 0.75]]) Fr.dot(hx + dx * hr, hy + dy * hr, 6, 5, '#7a4a2a');
  });
  caption([["The", "world", "didn't", "end."], ['My', 'JOB', 'did.']], CAP_Y - 40, 76, ['JOB']);
}

const STILLS = [still1, still2, still3];
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = '600 50px Fredoka';
  ctx.fillText(TITLE[0], 540, TITLE_Y[0]); ctx.fillText(TITLE[1], 540, TITLE_Y[1]); ctx.textAlign = 'start';
  STILLS[Math.round(t)](0.1);
  panel(ctx, PX, PY, PW, PH, 5, null, boilFrame(0.1));
  ctx.font = '600 30px Fredoka'; ctx.fillStyle = 'rgba(42,34,48,0.55)'; ctx.textAlign = 'right'; ctx.fillText('UNIT 4B', PX + PW - 24, PY + PH - 22); ctx.textAlign = 'start';
}
window.render = render; window.TEXTS = () => []; window.DUR = 3;
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  render(0); window.READY = true;
})();
