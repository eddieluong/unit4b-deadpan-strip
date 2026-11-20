// UNIT 4B · 26 "Mosquito" (Tập 17) — 3 KEY STILLS, full-bleed 9:16 panel. render(0|1|2). Night bedroom: bg dark, faces bright.
// 0 = frame-1 hook (giant mosquito beside Steve's wide eyes), 1 = PEAK (row 7: SMACK, "GOT you!"), 2 = PUNCH (row 8b: swarm over Steve, slipper raised).
import { paper, panel, drawCharacter } from './lib/cast_stick.js';
import { boilFrame } from './lib/motion.js';
import { W, H, ctx, INK, spen, text, strokedText, glowBlob, armTube, steve, MUSTARD, SK, roomWall, moonGlow, lampGlow, windowFrame, curtains, lamp, clock, moth, mosquito, bzz, swarm, darkCloud, slipper, blanket, pillow, poly } from './room.js';
import { roundPoly, ellipsePts } from './lib/cast_v2.js';
export function title(T) {
  const L = Array.isArray(T) ? T : [T]; ctx.save(); ctx.font = '600 56px Fredoka';
  const w = Math.max(...L.map(l => ctx.measureText(l).width)) + 70, h = 104 + (L.length - 1) * 68, top = 232 - 52 + (L.length > 1 ? -4 : 0);
  ctx.fillStyle = 'rgba(42,34,48,0.92)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, top, w, h, 52); ctx.fill();
  L.forEach((l, i) => text(l, 540, top + 55 + i * 68, 56, '#fff6dc')); ctx.restore();
}
export const TITLE = ['POV: there’s a mosquito', 'in your room'];
const fist = (x, y, r = 40, t = 0.1) => { const f = ellipsePts(x, y, r, r * 0.92, 24); ctx.fillStyle = SK; ctx.beginPath(); f.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.fill(); spen(t, 68, 6).outline(f, true, 6); };

// ---------- STILL 1 · HOOK ----------
export function hookWorld(t, o = {}) {
  ctx.save(); ctx.translate(540, 960); ctx.scale(1.25, 1.25); ctx.translate(-540, -960); roomWall(t, 0, -300, 2300); ctx.restore();
  moonGlow(760, 560, 900, 0.5); moonGlow(300, 700, 700, 0.25);
  // pillow + Steve's head, blanket to the nose, fists gripping the edge
  const s = 14, X = 360, hcY = 780, Y = hcY + 80 * s;
  pillow(X, hcY + 20, 640, 330, t);
  steve(X + (o.sw ?? 0), Y, s, { eyes: 'wide', brow: 'worried', mouth: 'line', look: o.look ?? 0.9, fx: ['sweat'], tilt: -2 }, 0, 0, false);
  blanket(-60, hcY + 105, 760, 1960, t);
  fist(X - 150, hcY + 140, 48, t); fist(X + 150, hcY + 140, 48, t);
  // the giant mosquito, right beside his face
  const my = (o.my ?? 560) + 14 * Math.sin(t * 7), mx = (o.mx ?? 800) + 10 * Math.sin(t * 5);
  mosquito(mx, my, 500, -0.4 + 0.05 * Math.sin(t * 6), t, { eyes: true, flip: 1, flap: 1 });
  bzz(mx - 120, my + 330, t, 36);
  text('bzzz', mx + 150, my + 330, 80, '#fff6dc', 'Fredoka', -0.12);
}
function still1(t) { hookWorld(t); title(TITLE); }
// ---------- STILL 2 · PEAK ----------
export function peakWorld(t, o = {}) {
  roomWall(t, 1, 0, H);
  windowFrame(20, 400, 360, 980, 1, t, { under: () => { moth(110, 560, t, 26, 1); moth(250, 700, t, 22, 2); } });
  curtains(20, 400, 360, 980, t, 70);
  lamp(900, 300, true, t); moth(820, 230, t, 24, 3); moth(960, 370, t, 20, 4); moth(870, 410, t, 18, 5);
  // Steve, big, grinning, on the bed (right), arm out to the wall
  const s = 14, X = 680, hcY = 1020, Y = hcY + 80 * s;
  pillow(900, 1700, 400, 200, t);
  steve(X, Y, s, { eyes: 'angry', brow: 'angry', mouth: 'grin', look: -0.9, fx: ['sweat'], tilt: -6 }, 0, 0, false);
  const sh = [X - 8 * s, Y - 60 * s];
  armTube([sh, [X - 230, Y - 60 * s - 130], [500, 800]], 54, MUSTARD, 35);
  armTube([[X + 8 * s, Y - 60 * s], [X + 180, Y - 56 * s + 120], [X + 150, Y - 40 * s]], 56, MUSTARD, 36);
  blanket(100, 1520, 1100, 2000, t);
  // SMACK: slipper on the wall + burst
  { const q = spen(t, 71, 9); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; q.line([[420 + Math.cos(a) * 120, 790 + Math.sin(a) * 120], [420 + Math.cos(a) * (190 + 40 * (i % 2)), 790 + Math.sin(a) * (190 + 40 * (i % 2))]], 9, '#ff9a1f'); }
    slipper(430, 795, -1.45, 1.0, t, {}); strokedText('SMACK', 470, 560, 110, '#fff6dc', 16); }
  for (const [x, y, a] of [[180, 1180, 0.5], [90, 1300, 0.2], [650, 380, -0.9]]) spen(t, 74, 7).line([[x, y], [x + Math.cos(a) * 70, y + Math.sin(a) * 70]], 9, INK);
}
function still2(t) { peakWorld(t); }
// ---------- STILL 3 · PUNCH ----------
export function punchWorld(t, o = {}) {
  roomWall(t, 0.85, 0, H);
  const wx0 = -20, wy0 = 330, wx1 = 560, wy1 = 1150;
  windowFrame(wx0, wy0, wx1, wy1, 1, t, { moon: false, under: () => darkCloud(300, 740, 300, 0.85) });
  curtains(wx0, wy0, wx1, wy1, t, 110);
  lamp(880, 380, true, t);
  swarm(t, [260, 760], [880, 380], o.n ?? 70, { size: 62, spread: 300, speed: 0.25 });
  // Steve, close-up, flat face, slipper drooping in his raised hand
  const s = 16, X = 540, hcY = o.hcY ?? 1130, Y = hcY + 80 * s;
  steve(X, Y, s, { eyes: o.blink ? 'closed' : 'dot', lid: 0.55, brow: 'worried', mouth: 'line', look: 0.0, fx: [], tilt: 0 }, 0, 0, false);
  armTube([[X + 8 * s, Y - 60 * s], [X + 260, Y - 56 * s + 40], [X + 250 + (o.droop ?? 0), 800]], 60, MUSTARD, 36);
  slipper(X + 290 + (o.droop ?? 0) * 1.2, 690 + (o.droop ?? 0) * 1.0, -0.25 + (o.droop ?? 0) * 0.012, 0.85, t, {});
  armTube([[X - 8 * s, Y - 60 * s], [X - 250, Y - 56 * s + 120], [X - 230, Y - 40 * s]], 60, MUSTARD, 33);
  // swarm's shadow over his forehead
  ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = '#10142e'; ctx.beginPath(); ctx.ellipse(X - 30, hcY - 230, 250, 90, 0.1, 0, 7); ctx.fill(); ctx.restore();
  for (const [dx, dy, sz, f] of [[-290, -260, 120, 1], [250, -240, 90, -1], [-240, 40, 70, 1]]) mosquito(X + dx, hcY + dy, sz, 0.3, t, { flip: f, k: dx });
}
function still3(t) { punchWorld(t); }

const STILLS = [still1, still2, still3];
export function render(i) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
  paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); STILLS[Math.round(i)](0.1); ctx.restore();
  panel(ctx, 6, 6, W - 12, H - 12, 5, null, boilFrame(0.1));
}
if (new URLSearchParams(location.search).has('stills')) {
  window.render = render; window.TEXTS = () => []; window.DUR = 3;
  (async () => {
    for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
      const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
    }
    render(0); window.READY = true;
  })();
}
