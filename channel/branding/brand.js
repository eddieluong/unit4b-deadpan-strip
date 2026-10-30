// UNIT 4B channel art: one page, one asset per ?asset= (avatar 1080², youtube banner 2560×1440, facebook cover 1640×624).
// Render with lemo-opuscar:  node core/render/still.mjs <this folder> 0 --size WxH --q 'asset=avatar' --out <dir>
import { drawCharacter, paper } from './lib/cast_stick.js';
import { VPen, roundPoly, ellipsePts } from './lib/cast_v2.js';

const Q = new URLSearchParams(location.search), ASSET = Q.get('asset') || 'avatar';
const SIZE = { avatar: [1080, 1080], youtube: [2560, 1440], facebook: [1640, 624] }[ASSET];
const [W, H] = SIZE, cv = document.getElementById('c'); cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
const INK = '#2a2230', WALL = '#ece2cf', FLOORC = '#d8c6a8', DOOR = '#c7a985', MUSTARD = '#f2b632';
const TAGLINE = 'Small problems. Big feelings.';

const pen = (x, y, s, seed = 1) => new VPen(ctx, x, y, s, { lw: Math.max(2.4, s * 0.85), hand: true, frame: 0, seed });
function text(t, x, y, font, color = INK, align = 'center') { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y); }

// a slice of apartment 4B: wall, floor, the door with its number, a chair facing it, Steve, the cat
function scene({ floorY, s, doorX, chairX, catX, titleX, titleY, titleSize }) {
  ctx.fillStyle = WALL; ctx.fillRect(0, 0, W, floorY);
  ctx.fillStyle = FLOORC; ctx.fillRect(0, floorY, W, H - floorY);
  const p = pen(0, floorY, 1, 3);
  p.line([[0, 0], [W, 0]], Math.max(3, s * 0.7));
  for (const k of [0.35, 0.7]) p.line([[0, -(H - floorY) * k], [W, -(H - floorY) * k]], 2, 'rgba(42,34,48,0.22)');
  // door with a "4B" plate
  const dw = 34 * s, dh = 108 * s, d = pen(doorX, floorY, s, 9);
  d.part([[-17, 0], [17, 0], [17, 108], [-17, 108]], DOOR, { shade: false });
  d.part(roundPoly([[-11, 58], [11, 58], [11, 92], [-11, 92]], 1), null, { shade: false, lw: Math.max(2, s * 0.5) });
  d.dot(-13, 50, 1.3, 1.3, '#e8c35a');
  d.part(roundPoly([[-6, 96], [6, 96], [6, 103], [-6, 103]], 1), '#fffdf6', { shade: false, lw: Math.max(2, s * 0.5) });
  text('4B', doorX, floorY - 99.5 * s, `600 ${5.2 * s}px Fredoka`);
  void dw; void dh;
  // chair + Steve, seated, staring at the door
  const c = pen(chairX, floorY, s, 17);
  for (const sx of [-1, 1]) c.line([[sx * 12, 0], [sx * 12, 21]], c.lw * 1.1, '#8a6040');
  c.part(roundPoly([[-15, 20], [15, 20], [15, 23.5], [-15, 23.5]], 1), '#b98a5e', { shade: 0.2 });
  for (const sx of [-1, 1]) c.line([[sx * 12, 23], [sx * 12, 52]], c.lw * 1.1, '#8a6040');
  c.part(roundPoly([[-13, 44], [13, 44], [13, 52], [-13, 52]], 1.5), '#b98a5e', { shade: 0.2 });
  drawCharacter(ctx, 'steve', chairX, floorY, s, { sit: true, expr: 'nervous', look: 0.8 }, { frame: 0 });
  drawCharacter(ctx, 'snuggles', catX, floorY, s * 0.95, { expr: 'smug', look: -0.6 }, { frame: 0 });
  // title block
  text('UNIT 4B', titleX, titleY, `600 ${titleSize}px Fredoka`);
  text(TAGLINE, titleX, titleY + titleSize * 0.82, `${titleSize * 0.42}px "Patrick Hand"`, '#4a3f4c');
  text('new shorts every week', titleX, titleY + titleSize * 1.32, `${titleSize * 0.3}px "Patrick Hand"`, '#7a6e78');
}

function avatar() {   // reads at 40 px: one big sweaty face on mustard, the "4B" plate in the corner
  paper(ctx, W, H, 4);
  ctx.fillStyle = MUSTARD; ctx.beginPath(); ctx.arc(W / 2, H / 2, W / 2, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(W / 2, H / 2, W / 2, 0, Math.PI * 2); ctx.clip();
  const s = 21; drawCharacter(ctx, 'steve', W / 2, H / 2 + 80 * s - 10, s, { expr: 'nervous', look: 0 }, { frame: 0 });
  ctx.restore();
  const p = pen(0, 0, 1, 5); p.T = q => q;
  p.part(roundPoly([[730, 800], [930, 800], [930, 930], [730, 930]], 18), '#fffdf6', { shade: false, lw: 10 });
  text('4B', 830, 868, '600 104px Fredoka');
}

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (ASSET === 'avatar') return avatar();
  if (ASSET === 'youtube')   // everything that matters sits inside the 1546×423 safe area (x 507–2053, y 508–931)
    scene({ floorY: 925, s: 4.1, doorX: 1880, chairX: 1600, catX: 1395, titleX: 930, titleY: 650, titleSize: 170 });
  else                       // facebook: phones crop the sides, keep it inside x 220–1420
    scene({ floorY: 560, s: 3.6, doorX: 1300, chairX: 1060, catX: 880, titleX: 500, titleY: 245, titleSize: 140 });
}

window.DUR = 1; window.render = render;
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) {
    const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f);
  }
  render(); window.READY = true;
})();
