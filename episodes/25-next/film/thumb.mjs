import { openDemo, closeServer } from '/home/honglv/lemo-opuscar/core/render/page.mjs';
const { browser, page } = await openDemo('.', { w: 1080, h: 1920, warnings: true });
await page.evaluate(() => { window.NO_TITLE = 1; window.NO_CAP = 1; });
const T = { A: 0.5, B: 12.85, C: 21.6 };
for (const k of 'ABC') { await page.evaluate(t => window.render(t), T[k]); await page.screenshot({ path: `out/tmp/raw_${k}.png`, type: 'png' }); console.log(k); }
await browser.close(); closeServer();
