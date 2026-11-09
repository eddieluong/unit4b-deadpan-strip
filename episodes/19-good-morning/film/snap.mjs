import { openDemo, closeServer } from '/home/honglv/lemo-opuscar/core/render/page.mjs';
const ts = process.argv.slice(3).map(Number);
const { browser, page } = await openDemo(process.argv[2] || '.', { w: 1080, h: 1920, warnings: true });
page.on('pageerror', e => console.log('PAGEERR', e.message));
for (const t of ts) { await page.evaluate(t => window.render(t), t); await page.screenshot({ path: `out/tmp/f_${t.toFixed(2)}.png`, type: 'png' }); }
await browser.close(); closeServer();
