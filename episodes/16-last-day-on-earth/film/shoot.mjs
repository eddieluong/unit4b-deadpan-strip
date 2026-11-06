// node shoot.mjs  → stills/{frame1_row1,punch... }.png  (uses the lemo-opuscar page helper, same as ep15's still.mjs)
import { openDemo, closeServer } from '/home/honglv/lemo-opuscar/core/render/page.mjs';
const names = ['frame1_row1', 'peak_row8', 'punch_row13'];
const { browser, page } = await openDemo(process.argv[2] || '.', { w: 1080, h: 1920, q: '', warnings: true });
for (let i = 0; i < 3; i++) { await page.evaluate(t => window.render(t), i); await page.screenshot({ path: `stills/${names[i]}.png`, type: 'png' }); console.log(names[i]); }
await browser.close(); closeServer();
