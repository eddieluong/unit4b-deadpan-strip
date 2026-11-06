import { openDemo, closeServer } from '/home/honglv/lemo-opuscar/core/render/page.mjs';
import fs from 'fs';
const { browser, page } = await openDemo(process.argv[2] || '.', { w: 1080, h: 1920, warnings: true });
// openDemo serves index.html; navigate to thumb.html on the same server
const u = new URL(page.url()); u.pathname = u.pathname.replace(/[^/]*$/, 'thumb.html'); await page.goto(u.href);
await page.waitForFunction('window.READY', null, { timeout: 20000 });
for (let i = 0; i < 3; i++) { await page.evaluate(k => window.render(k), i); await page.screenshot({ path: `thumbs/thumb_${'ABC'[i]}.png`, type: 'png' }); console.log('thumb', 'ABC'[i]); }
await browser.close(); closeServer();
