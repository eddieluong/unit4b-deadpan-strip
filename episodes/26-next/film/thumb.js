// UNIT 4B · 26 Mosquito — thumbnails A/B/C: stills worlds + short text (no punch-line text, nothing below y 1536).
import { paper, panel } from './lib/cast_stick.js';
import { boilFrame } from './lib/motion.js';
import { ctx, W, H, INK, strokedText } from './room.js';
import { hookWorld, peakWorld } from './stills.js';
function big(s, y, size, fill) { strokedText(s, 540, y, size, fill, 26); }
function render(i) {
  window.T_NOW = 0.1; ctx.setTransform(1, 0, 0, 1, 0, 0); paper(ctx, W, H, 11);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  if (i === 0) { hookWorld(0.1, { look: 0.9 }); }
  if (i === 1) { ctx.translate(540, 900); ctx.scale(1.12, 1.12); ctx.translate(-540, -900); peakWorld(0.3, {}); }
  if (i === 2) { ctx.translate(540, 960); ctx.scale(1.2, 1.2); ctx.translate(-540, -960); hookWorld(0.1, { look: -0.6 }); }
  ctx.restore();
  if (i === 0) big('3 AM.', 260, 190, '#fff6dc');
  if (i === 1) big('REVENGE', 250, 170, '#ffd84a');
  if (i === 2) big('HEAR THAT?', 260, 150, '#fff6dc');
  panel(ctx, 6, 6, W - 12, H - 12, 5, null, boilFrame(0.1));
}
window.render = render;
(async () => {
  for (const [fam, file, weight] of [['Patrick Hand', 'fonts/patrick-hand-latin-400-normal.woff2', '400'], ['Fredoka', 'fonts/fredoka-latin-600-normal.woff2', '600']]) { const f = new FontFace(fam, `url(${file})`, { weight }); await f.load(); document.fonts.add(f); }
  window.READY = true;
})();
