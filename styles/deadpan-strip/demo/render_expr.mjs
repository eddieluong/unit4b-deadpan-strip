import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import { CAST, INK, paper, drawCharacter, nameTab, EXPRESSION_NAMES } from './cast.js';
const F = process.env.FONT_DIR || 'node_modules/@fontsource/patrick-hand/files/';
GlobalFonts.registerFromPath(F + 'patrick-hand-latin-400-normal.woff2', 'Patrick Hand');
const SC = { steve: 2.6, nana: 2.3, penny: 2.8, ted: 2.5, snuggles: 2.8 }, DX = {};
const id = process.argv[2], out = process.argv[3];
const W = 1920, H = 1080, cv = createCanvas(W, H), ctx = cv.getContext('2d');
paper(ctx, W, H, 5);
nameTab(ctx, 50, 30, id, 36);
ctx.fillStyle = '#6b625c'; ctx.font = '30px "Patrick Hand"'; ctx.fillText(`${EXPRESSION_NAMES.length} expressions · UNIT 4B`, 260, 60);
const cols = 7, cw = (W - 80) / cols, rh = 240, y0 = 110;
EXPRESSION_NAMES.forEach((e, i) => {
  const cx = 40 + (i % cols) * cw + cw / 2, top = y0 + Math.floor(i / cols) * rh;
  ctx.strokeStyle = 'rgba(42,36,34,0.18)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(cx - cw / 2 + 6, top + 4, cw - 12, rh - 10, 12); ctx.stroke();
  drawCharacter(ctx, id, cx + (DX[id] || 0), top + rh - 44, SC[id], { expr: e }, { lw: 2.6 });
  ctx.fillStyle = INK; ctx.font = '24px "Patrick Hand"'; ctx.textAlign = 'center'; ctx.fillText(e.replace('_', ' '), cx, top + rh - 16); ctx.textAlign = 'start';
});
fs.writeFileSync(out, cv.toBuffer('image/png')); console.log('ok', out);
