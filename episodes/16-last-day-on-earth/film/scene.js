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
const limb = (p, pts, w = 30) => { p.line(pts, w + 8, INK); p.line(pts, w, SLEEVE); const h = pts[pts.length - 1]; p.dot(h[0], h[1], 25, 22, '#fffdf8'); };
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
    // window with a moon, behind the bed head
    p.part(roundPoly([[640, 400], [960, 400], [960, 760], [640, 760]], 10), '#14193a', { shade: false, lw: 5 });
    p.line([[800, 400], [800, 760]], 5); p.line([[640, 580], [960, 580]], 5);
    ctx.fillStyle = '#f4efd0'; ctx.beginPath(); ctx.arc(720, 480, 34, 0, 7); ctx.fill(); ctx.fillStyle = '#14193a'; ctx.beginPath(); ctx.arc(734, 472, 30, 0, 7); ctx.fill();
    // bedside clock
    p.part(roundPoly([[70, 1180], [330, 1180], [330, 1400], [70, 1400]], 10), '#3a4378', { shade: 0.1, lw: 5 });
    p.part(roundPoly([[84, 1090], [316, 1090], [316, 1180], [84, 1180]], 8), '#0d1126', { shade: false, lw: 5 });
    hand('2:00 AM', 200, 1136, 46, 0, '#ff5a4a');
    // bed: headboard + mattress
    p.part(roundPoly([[340, 560], [1040, 560], [1040, 1400], [340, 1400]], 30), '#6b4a3a', { shade: 0.12, lw: 6 });
    p.part(roundPoly([[360, 1380], [1060, 1380], [1060, 1520], [360, 1520]], 18), '#c8d0ea', { shade: 0.1, lw: 5 });
    p.part(roundPoly([[360, 1520], [1060, 1520], [1060, 1700], [360, 1700]], 8), '#6b4a3a', { shade: 0.12, lw: 5 });
    p.part(roundPoly([[430, 720], [720, 720], [740, 1180], [430, 1180]], 60), '#e6e8f6', { shade: 0.12, lw: 5 });   // pillow behind his back
    const s = 11, X = 520, Y = 1400;
    drawCharacter(ctx, 'steve', X, Y, s, { expr: 'dead_inside', eyes: 'pinpoint', brow: 'worried', mouth: 'line', fx: [], look: 0.95, sit: 1, hair: 3, bags: 1, armL: 'none', armR: 'none', tilt: -3, lean: 4 }, { frame: boilFrame(t) });
    // blanket over his legs
    p.part(roundPoly([[X - 230, Y - 255], [X + 130, Y - 290], [X + 330, Y - 310], [X + 520, Y - 220], [X + 560, Y - 20], [X - 230, Y - 20]], 90), '#8a5fb0', { shade: 0.14, lw: 6 });
    p.line([[X + 60, Y - 285], [X + 90, Y - 40]], 4, 'rgba(255,255,255,0.35)');
    // phone, screen to the viewer, held in both hands
    const px = 830, py = 1050, pw = 330, ph = 560;
    ctx.save(); ctx.translate(px, py); ctx.rotate(-0.07);
    ctx.save(); const gl = ctx.createRadialGradient(0, 0, 40, 0, 0, 640); gl.addColorStop(0, 'rgba(120,200,255,0.42)'); gl.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = gl; ctx.fillRect(-900, -900, 1800, 1800); ctx.restore();
    const q = spen(t, 9);
    q.part(roundPoly([[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [pw / 2, ph / 2], [-pw / 2, ph / 2]], 36), '#1a1e32', { shade: false, lw: 6 });
    q.part(roundPoly([[-pw / 2 + 16, -ph / 2 + 22], [pw / 2 - 16, -ph / 2 + 22], [pw / 2 - 16, ph / 2 - 22], [-pw / 2 + 16, ph / 2 - 22]], 20), '#e8f4ff', { shade: false, lw: 2 });
    q.part(roundPoly([[-pw / 2 + 16, -ph / 2 + 22], [pw / 2 - 16, -ph / 2 + 22], [pw / 2 - 16, -ph / 2 + 92], [-pw / 2 + 16, -ph / 2 + 92]], 12), '#d9382c', { shade: false, lw: 2 });
    hand('BREAKING', 0, -ph / 2 + 58, 40, 0, '#fff');
    ['WORLD', 'WAR 3:', 'ANY DAY', 'NOW?'].forEach((w, i) => hand(w, 0, -90 + i * 80, 60, 0, i === 3 ? '#d9382c' : INK));
    q.line([[-110, 218], [110, 218]], 12, '#c8d6e8'); q.line([[-110, 190], [60, 190]], 12, '#c8d6e8');
    ctx.restore();
    // arms: shoulders -> hands on the phone's lower edges
    const A = spen(t, 12), shR = [X + 78, Y - 45 * s + 10], shL = [X - 78, Y - 45 * s + 10];
    limb(A, [shR, [X + 190, Y - 120], [px - 100, py + 235]]);
    limb(A, [shL, [X - 40, Y - 150], [px - 150, py + 250]]);
    // blue light on his face
    const hc = headOf(X, Y + 15 * s, s); ctx.save(); ctx.globalCompositeOperation = 'screen';
    const fg = ctx.createRadialGradient(hc[0] + 120, hc[1] + 40, 20, hc[0] + 60, hc[1], 330); fg.addColorStop(0, 'rgba(110,190,255,0.55)'); fg.addColorStop(1, 'rgba(110,190,255,0)');
    ctx.beginPath(); ctx.arc(hc[0], hc[1], hc[2] - 7, 0, 7); ctx.clip(); ctx.fillStyle = fg; ctx.fillRect(hc[0] - 400, hc[1] - 400, 800, 800); ctx.restore();
  });
  caption([['World', 'War', 'THREE']], CAP_Y, 80, ['THREE']);
}

// ---------- STILL 2 · row 8: the peak, on a wobbly chair ----------
function still2(t) {
  clipPanel(() => {
    ctx.fillStyle = '#d8cfba'; ctx.fillRect(PX, PY, PW, PH); ctx.fillStyle = '#a89a80'; ctx.fillRect(PX, 1580, PW, 100);
    const p = spen(t, 3); p.line([[PX, 1580], [PX + PW, 1580]], 4);
    ctx.fillStyle = 'rgba(24,30,70,0.38)'; ctx.fillRect(PX, PY, PW, PH);
    p.part(roundPoly([[700, 420], [980, 420], [980, 800], [700, 800]], 8), '#12173a', { shade: false, lw: 5 }); p.line([[840, 420], [840, 800]], 4);   // night window
    // chair + Steve + laptop tilt together about the chair's near foot
    ctx.save(); ctx.translate(430, 1580); ctx.rotate(0.06); ctx.translate(-430, -1580);
    const seat = 1420, X = 290, s = 10.2, c = spen(t, 21);
    c.part(roundPoly([[120, seat - 330], [160, seat - 330], [160, seat], [120, seat]], 6), '#e8a53a', { shade: 0.12, lw: 5 });   // chair back post
    c.line([[130, seat - 250], [440, seat - 250]], 0.1); 
    for (const lx of [150, 430]) c.part(roundPoly([[lx - 14, seat], [lx + 14, seat], [lx + 18, 1580], [lx - 18, 1580]], 4), '#c8862a', { shade: 0.12, lw: 5 });
    c.part(roundPoly([[110, seat - 6], [460, seat - 6], [460, seat + 36], [110, seat + 36]], 8), '#f2c14e', { shade: 0.12, lw: 5 });
    drawCharacter(ctx, 'steve', X, seat - 8, s, { expr: 'furious', look: 0.9, mouth: 'scream', fx: ['vein', 'sweat'], hair: 1, bags: 1, armL: 'none', armR: 'none', tilt: 5, lean: 6 }, { frame: boilFrame(t) });
    // laptop held out in front, screen to the viewer
    const L = spen(t, 33), lx0 = 480, lx1 = 990, sy0 = 700, sy1 = 1050;
    L.part(roundPoly([[lx0 + 10, sy1], [lx1 - 10, sy1], [lx1 + 30, sy1 + 56], [lx0 - 30, sy1 + 56]], 10), '#8a93a8', { shade: 0.12, lw: 5 });
    L.part(roundPoly([[lx0, sy0], [lx1, sy0], [lx1, sy1], [lx0, sy1]], 18), '#2a2f44', { shade: false, lw: 6 });
    L.part(roundPoly([[lx0 + 16, sy0 + 16], [lx1 - 16, sy0 + 16], [lx1 - 16, sy1 - 16], [lx0 + 16, sy1 - 16]], 8), '#f6f8fc', { shade: false, lw: 2 });
    L.part([[lx0 + 16, sy0 + 16], [lx1 - 16, sy0 + 16], [lx1 - 16, sy0 + 72], [lx0 + 16, sy0 + 72]], '#d9e4f4', { shade: false, lw: 2 });
    hand('To: Gary', lx0 + 130, sy0 + 46, 38, 0, INK); hand('Subject: URGENT', lx0 + 340, sy0 + 46, 28, 0, '#7a6a8a');
    hand('— And', 735, sy0 + 125, 60, 0, INK); hand('ANOTHER thing', 735, sy0 + 195, 60, 0, '#d9382c'); 
    L.line([[lx0 + 40, sy0 + 270], [lx0 + 300, sy0 + 270]], 8, '#c8d0e0');
    L.part(roundPoly([[lx1 - 170, sy0 + 292], [lx1 - 36, sy0 + 292], [lx1 - 36, sy0 + 340], [lx1 - 170, sy0 + 340]], 12), '#2f6ac8', { shade: false, lw: 3 }); hand('SEND', lx1 - 103, sy0 + 317, 30, 0, '#fff');
    // both hands hammering the keys; typing blur marks
    const sh = [[X + 74, seat - 8 - 60 * s + 8], [X - 74, seat - 8 - 60 * s + 8]];
    limb(L, [sh[0], [X + 190, sy1 - 20], [620, sy1 + 36]]);
    limb(L, [sh[1], [X + 40, sy1 + 110], [800, sy1 + 44]]);
    for (const [a, b] of [[590, 1040], [640, 1025], [830, 1040], [870, 1025]]) L.line([[a, b], [a - 14, b - 30]], 5, INK);
    // flying sweat
    const hc = headOf(X, seat - 8, s);
    [[-1, -0.5, 14], [-0.9, 0.45, 12], [-1.2, 0.0, 10]].forEach(([dx, dy, z], i) => teardrop(L, hc[0] + dx * 230, hc[1] + dy * 240 - 30, z * 1.6, dx * 0.5));
    ctx.restore();
    // wobble marks at the chair feet
    const w = spen(t, 44); w.line([[80, 1560], [50, 1540]], 5); w.line([[70, 1590], [34, 1590]], 5); w.line([[500, 1480], [530, 1455]], 5);
    sfxText('#@$%&!', 770, 540, 125, -0.08, '#ff5a4a');
  });
  caption([['And', 'ANOTHER', 'thing']], CAP_Y, 80, ['ANOTHER']);
}

// ---------- STILL 3 · row 13: the punch, hallway ----------
function still3(t) {
  clipPanel(() => {
    ctx.fillStyle = '#e4dcc6'; ctx.fillRect(PX, PY, PW, PH); ctx.fillStyle = '#b9a98a'; ctx.fillRect(PX, 1560, PW, 160);
    const p = spen(t, 3); p.line([[PX, 1560], [PX + PW, 1560]], 4);
    for (let x = PX + 30; x < PX + PW; x += 90) p.line([[x, PY], [x, 1560]], 2, 'rgba(150,130,100,0.28)');   // wallpaper stripes
    // door frame on the right + dark flat inside
    const fx0 = 650, fx1 = 990, ftop = 420;
    p.part(roundPoly([[fx0, ftop], [fx1, ftop], [fx1, 1560], [fx0, 1560]], 4), '#4a3f4f', { shade: false, lw: 6 });
    // the hot tub: huge, wedged crooked through the doorway
    ctx.save(); ctx.translate(840, 1180); ctx.rotate(-0.09); ctx.translate(-840, -1180);
    const T = spen(t, 55);
    T.part(roundPoly([[560, 990], [1120, 990], [1120, 1480], [560, 1480]], 120), '#2fa6c8', { shade: 0.16, lw: 7 });
    T.part(roundPoly([[560, 990], [1120, 990], [1120, 1080], [560, 1080]], 45), '#f2f6fa', { shade: 0.1, lw: 6 });
    for (const [jx, jy] of [[680, 1220], [800, 1260], [920, 1220], [1030, 1270], [740, 1360], [880, 1380], [1000, 1380]]) T.part(ellipsePts(jx, jy, 20, 20, 16), '#1d7f9c', { shade: false, lw: 4 });
    T.part(roundPoly([[770, 1090], [1010, 1090], [1010, 1160], [770, 1160]], 10), '#fff1a8', { shade: 0.08, lw: 4 }); hand('HOT TUB $8,400', 890, 1126, 28, 0, INK);
    ctx.restore();
    // frame jambs on top so the tub reads as stuck in the door
    const F = spen(t, 56); F.part(roundPoly([[fx0 - 34, ftop - 30], [fx0 + 8, ftop - 30], [fx0 + 8, 1560], [fx0 - 34, 1560]], 4), '#8a5a3a', { shade: 0.14, lw: 6 });
    F.part(roundPoly([[fx1 - 8, ftop - 30], [fx1 + 34, ftop - 30], [fx1 + 34, 1560], [fx1 - 8, 1560]], 4), '#8a5a3a', { shade: 0.14, lw: 6 });
    F.part(roundPoly([[fx0 - 34, ftop - 40], [fx1 + 34, ftop - 40], [fx1 + 34, ftop + 8], [fx0 - 34, ftop + 8]], 4), '#8a5a3a', { shade: 0.14, lw: 6 });
    F.part(roundPoly([[800, 340], [900, 340], [900, 380], [800, 380]], 8), '#e0b04a', { shade: 0.1, lw: 4 }); hand('4B', 850, 361, 34, 0, INK);
    // Steve with the box
    const X = 360, s = 10.6, Y = 1560;
    drawCharacter(ctx, 'steve', X, Y, s, { expr: 'dead_inside', mouth: 'line', fx: ['gloom'], look: 0.3, hair: 3, bags: 1, armL: 'none', armR: 'none' }, { frame: boilFrame(t) });
    const hc = headOf(X, Y, s), B = spen(t, 66), bx0 = 170, bx1 = 560, by0 = 1060, by1 = 1370;
    // desk things + droopy plant inside the box
    B.part(roundPoly([[bx0 + 20, by0 - 10], [bx0 + 80, by0 - 10], [bx0 + 70, by0 + 40], [bx0 + 30, by0 + 40]], 4), '#b5673a', { shade: 0.12, lw: 4 });
    B.line([[bx0 + 50, by0 - 8], [bx0 + 52, by0 - 130], [bx0 + 130, by0 - 120], [bx0 + 175, by0 - 60]], 7, '#7a5a38');
    B.line([[bx0 + 50, by0 - 8], [bx0 + 20, by0 - 90], [bx0 - 40, by0 - 70], [bx0 - 60, by0 - 10]], 7, '#7a5a38');
    B.part(ellipsePts(bx0 + 176, by0 - 52, 20, 11, 10), '#a88a52', { shade: false, lw: 3 }); B.part(ellipsePts(bx0 - 58, by0 - 6, 20, 11, 10), '#a88a52', { shade: false, lw: 3 });
    B.part(roundPoly([[bx0 + 240, by0 - 50], [bx0 + 310, by0 - 50], [bx0 + 310, by0 + 20], [bx0 + 240, by0 + 20]], 6), '#d9382c', { shade: 0.1, lw: 4 });   // mug
    B.line([[bx0 + 310, by0 - 30], [bx0 + 336, by0 - 22], [bx0 + 310, by0 - 6]], 5);
    B.part(roundPoly([[bx0 + 310, by0 - 100], [bx0 + 370, by0 - 70], [bx0 + 360, by0 - 60], [bx0 + 300, by0 - 90]], 3), '#4a8f6a', { shade: false, lw: 3 });   // stapler tip
    B.part(roundPoly([[bx0, by0], [bx1, by0], [bx1 - 24, by1], [bx0 + 24, by1]], 10), '#c9a46a', { shade: 0.14, lw: 6 });
    B.part(roundPoly([[bx0 + 120, by0 + 60], [bx1 - 120, by0 + 60], [bx1 - 130, by0 + 120], [bx0 + 130, by0 + 120]], 6), '#e9d8b4', { shade: 0.08, lw: 4 });   // tape strip
    hand('DESK', (bx0 + bx1) / 2, by0 + 190, 56, 0, INK);
    // arms hugging the box
    const sy = Y - 60 * s + 8; limb(B, [[X + 76, sy], [bx1 + 40, by0 + 130], [bx1 - 24, by0 + 40]]); limb(B, [[X - 76, sy], [bx0 - 36, by0 + 130], [bx0 + 24, by0 + 40]]);
    // cake frosting on his face and in his hair
    const Fr = spen(t, 77), [hx, hy, hr] = hc;
    for (const [dx, dy, rx, ry, col] of [[-0.55, 0.35, 34, 22, '#f7b6d2'], [0.5, 0.5, 30, 20, '#fff4f8'], [0.05, 0.9, 40, 18, '#f7b6d2'], [-0.1, -0.7, 36, 20, '#fff4f8'], [0.7, -0.2, 22, 15, '#f7b6d2']])
      Fr.part(ellipsePts(hx + dx * hr, hy + dy * hr, rx, ry, 16), col, { shade: 0.1, lw: 3 });
    Fr.part(ellipsePts(hx + 0.62 * hr, hy + 0.85 * hr, 9, 22, 10), '#f7b6d2', { shade: false, lw: 2.5 });   // drip
    ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(hx - 0.55 * hr, hy + 0.3 * hr, 8, 0, 7); ctx.fill();   // a cherry crumb
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
