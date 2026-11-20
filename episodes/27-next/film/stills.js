// UNIT 4B · Tập 18 "One Screw" — 3 KEY STILLS (hook, peak, punch), full-bleed 9:16. render(0|1|2).
import { W, H, ctx, INK, SK, MUSTARD, spen, strokedText, title, glowBlob, armTube, steve, hand, room, debris, cardboard, foam, screw, palm, wardrobe, pile, ghost, WARD, dust, cloud, drop, paper, panel, boilFrame, lerp } from './flat.js';

// ---------- STILL 1 · HOOK: giant screw in an open palm, Steve's face above, wardrobe blurred behind ----------
function still1(t) {
  room(t, { floorY: 1250 });
  ctx.save(); ctx.filter = 'blur(16px)'; wardrobe(t, 540, 1250, 760, 1000); ctx.restore();   // finished wardrobe, out of focus
  ctx.save(); ctx.filter = 'blur(12px)'; debris(t, { dy: -100 }); ctx.restore();
  glowBlob(540, 1250, 800, 'rgba(255,230,170,0.16)');
  const s = 15, X = 540, hcY = 650, Y = hcY + 80 * s;
  steve(X, Y, s, { eyes: 'dot', lid: 0.0, brow: 'worried', mouth: 'wobble', look: 0, fx: ['sweat'], tilt: 0 }, 0, 0, false);
  armTube([[X - 8 * s, Y - 60 * s], [X - 230, Y - 52 * s + 120], [X - 250, Y - 38 * s + 250]], 56, MUSTARD, 33);
  armTube([[X + 8 * s, Y - 60 * s], [X + 300, Y - 56 * s + 150], [X + 70, 1640]], 58, MUSTARD, 34);
  palm(540, 1680, 1.0, 70, false);
  screw(560, 1640, 800, 0.04, 90, 1);
  palm(540, 1680, 1.0, 70, true);
  if (!window.NOTITLE) title(['POV: one screw', 'left over']);
}
// ---------- STILL 2 · PEAK: "DONE! I BUILT it!" arms up, tall wardrobe, the screw drops from his sleeve ----------
function still2(t) {
  room(t, { floorY: WARD.yb });
  glowBlob(540, 900, 1200, 'rgba(255,220,120,0.35)');
  for (let i = 0; i < 11; i++) { const a = -Math.PI / 2 + (i - 5) * 0.2; ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,225,130,0.16)'; ctx.beginPath(); ctx.moveTo(400, 900); ctx.lineTo(400 + Math.cos(a - 0.05) * 1800, 900 + Math.sin(a - 0.05) * 1800); ctx.lineTo(400 + Math.cos(a + 0.05) * 1800, 900 + Math.sin(a + 0.05) * 1800); ctx.fill(); ctx.restore(); }
  wardrobe(t, WARD.x, WARD.yb, WARD.w, WARD.h, {});
  const s = 15, X = 330, hcY = 760, Y = hcY + 80 * s;
  steve(X, Y, s, { eyes: 'happy', brow: 'raised', mouth: 'grin', look: 0, fx: ['sparkle'], tilt: -4, lid: 0 }, 0, 0, false);
  armTube([[X - 8 * s, Y - 60 * s], [X - 200, Y - 60 * s - 130], [X - 290, Y - 60 * s - 380]], 56, MUSTARD, 33);
  armTube([[X + 8 * s, Y - 60 * s], [X + 230, Y - 60 * s - 130], [X + 320, Y - 60 * s - 380]], 56, MUSTARD, 34);
  hand(X - 290, Y - 60 * s - 400, 44, 0, SK, 71); hand(X + 320, Y - 60 * s - 400, 44, 0, SK, 72);
  // the screw falls out of his right sleeve
  { const q = spen(t, 74, 7); for (const dx of [-26, 0, 26]) q.line([[X + 440 + dx, 640], [X + 440 + dx, 740]], 7, '#7a6a52'); }
  glowBlob(X + 420, 780, 200, 'rgba(255,255,255,0.7)'); screw(X + 440, 900, 250, 0.5, 91, 1);
  strokedText('tink', X + 560, 960, 56, '#fff6dc', 11, 0.2);
}
// ---------- STILL 3 · PUNCH: the wardrobe has folded flat; Steve in the dust, holding the door handle ----------
function still3(t) {
  room(t, { floorY: WARD.yb, floorCol: '#7e6048' });
  ghost(t); pile(t, 1.0);
  dust(560, 1330, 0.5, 90, 4, 5); dust(1010, 1320, 0.5, 70, 3, 8);
  const s = 15, X = 330, hcY = 760, Y = hcY + 80 * s;
  steve(X, Y, s, { eyes: 'dot', lid: 0.55, brow: undefined, mouth: 'line', look: 0.5, fx: ['sweat'], tilt: 0 }, 1, 0, false);
  armTube([[X - 8 * s, Y - 60 * s], [X - 210, Y - 60 * s + 150], [X - 235, Y - 60 * s + 290]], 54, MUSTARD, 33);
  armTube([[X + 8 * s, Y - 60 * s], [X + 230, Y - 60 * s + 60], [X + 330, Y - 60 * s + 130]], 54, MUSTARD, 34);
  hand(X + 345, Y - 60 * s + 135, 40, 0, SK, 71);
  ctx.fillStyle = '#cfd5de'; ctx.beginPath(); ctx.arc(X + 385, Y - 60 * s + 110, 26, 0, 7); ctx.fill(); spen(t, 75, 6).outline([...Array(24)].map((_, i) => [X + 385 + Math.cos(i / 24 * 6.283) * 26, Y - 60 * s + 110 + Math.sin(i / 24 * 6.283) * 26]), true, 6);
  if (!window.NOTITLE) title(['POV: one screw', 'left over']);
}
const STILLS = [still1, still2, still3];
function render(i) {
  window.T_NOW = 0.1;
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
