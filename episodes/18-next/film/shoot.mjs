// node shoot.mjs → stills/{still_1_hook,still_2_climax,still_3_punch}.png
import { openDemo, closeServer } from '/home/honglv/lemo-opuscar/core/render/page.mjs';
const jobs = [['still_1_hook', 0, null], ['still_2_climax', 1, null], ['still_3_punch', 2, null]];
const { browser, page } = await openDemo(process.argv[2] || '.', { w: 1080, h: 1920, q: 'stills=1', warnings: true });
for (const [n, i, skin] of jobs) { await page.evaluate(([i, s]) => { window.render(i); }, [i, skin]); await page.screenshot({ path: `stills/${n}.png`, type: 'png' }); console.log(n); }
await browser.close(); closeServer();
