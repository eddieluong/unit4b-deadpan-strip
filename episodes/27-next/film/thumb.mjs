import { openDemo, closeServer } from '/home/honglv/lemo-opuscar/core/render/page.mjs';
import fs from 'fs'; fs.mkdirSync('thumbs', { recursive: true });
const { browser, page } = await openDemo('.', { w: 1080, h: 1920, q: 'stills=1', warnings: true });
await page.evaluate(() => { window.NOTITLE = true; });
for (let i = 0; i < 3; i++) { await page.evaluate(k => window.render(k), i); await page.screenshot({ path: `thumbs/base_${'ABC'[i]}.png`, type: 'png' }); }
await browser.close(); closeServer();
