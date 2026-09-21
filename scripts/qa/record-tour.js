// A scripted tour for recording a video with playwright-cli: arrive on a page
// from the menu, then glide between sections with eased scrolling, hover and
// click a tile. Record it with:
//   playwright-cli -s=desk video-start tour.webm
//   playwright-cli -s=desk --raw run-code --filename=record-tour.js
//   playwright-cli -s=desk video-stop
// Mark the welcome window seen first (localStorage podiumcall:welcome:v1 = 1),
// or it blocks the first click. Written for the Asian Games page, 2026-09-21.
async page => {
  await page.goto('http://localhost:8081/dashboard');
  await page.waitForTimeout(2500);
  // Arrive from the menu, as a reader would.
  await page.getByRole('link', { name: 'Asian Games', exact: true }).first().click();
  await page.waitForTimeout(4500);
  const glide = async (to, ms) => {
    await page.evaluate(([to, ms]) => new Promise((done) => {
      const from = window.scrollY, t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        window.scrollTo({ top: from + (to - from) * e, behavior: 'instant' });
        k < 1 ? requestAnimationFrame(step) : done();
      };
      requestAnimationFrame(step);
    }), [to, ms]);
  };
  const top = async (sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY - 100, sel);
  await glide(await top('#nagoya-how'), 1800);
  await page.waitForTimeout(2200);
  await glide(await top('#nagoya-glance'), 1600);
  await page.waitForTimeout(2600);
  const tile = page.locator('.nagoya-tile-card', { hasText: "Women's 400m" }).first();
  await glide(await tile.evaluate((e) => e.getBoundingClientRect().top + window.scrollY - 300), 1400);
  await page.waitForTimeout(900);
  await tile.hover();
  await page.waitForTimeout(700);
  await tile.click();
  await page.waitForTimeout(3200);
  await glide(await top('#nagoya-not-called'), 2000);
  await page.waitForTimeout(1800);
  await glide(await top('#nagoya-foot'), 1600);
  await page.waitForTimeout(3500);
  return 'done';
}
