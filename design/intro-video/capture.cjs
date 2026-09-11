// Screenshots of the live site for the PodiumCall intro video.
//
// Runs inside Higgsfield's sandbox (Playwright is installed globally there):
//   export NODE_PATH="$(npm root -g)" && node capture.cjs
// Writes cap3/<lang>-<fmt>/01.png .. 14.png for en/fr x phone/desk.
//
// Every step either proves it did its job or throws, so a bad shot shows up in
// the log instead of in the finished video. Each of these checks exists because
// the unchecked version shipped a wrong screenshot at least once.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://podiumcall.vercel.app';
const LBL = {
  en: { model: 'Model rating', search: 'Search athletes', feedback: 'Send feedback', tip: 'About ', fav: /favourites/i, qualified: /already qualified/i, relays: /mixed relays/i },
  fr: { model: 'Éval. du modèle', search: 'Rechercher des athlètes', feedback: 'Envoyer un retour', tip: 'En savoir plus sur ', fav: /favoris/i, qualified: /déjà qualifiés/i, relays: /relais mixtes/i },
};
// reducedMotion: the site's CSS turns smooth scrolling off under it. Smooth
// scrolling cancelled the favourites scroll (two identical shots) and closed the
// info tip mid-glide (it closes on scroll).
//
// Viewports are chosen so the site's own text is still readable once framed in
// the video: phone 390x604 @3x -> 1170x1812, desktop 1440x782 -> 1640x891.
const FMT = {
  phone: { viewport: { width: 390, height: 604 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce' },
  desk: { viewport: { width: 1440, height: 782 }, deviceScaleFactor: 1640 / 1440, reducedMotion: 'reduce' },
};
async function variant(browser, lang, fmt) {
  const L = LBL[lang]; const dir = `cap3/${lang}-${fmt}`; fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext(FMT[fmt]);
  // No welcome popup, and the language set before the app hydrates.
  await ctx.addInitScript((l) => { try { localStorage.setItem('podiumcall:welcome:v1', '1'); localStorage.setItem('podiumcall:lang', l); } catch (e) {} }, lang);
  const page = await ctx.newPage(); const r = { v: `${lang}-${fmt}` };
  const step = async (n, fn) => { try { await fn(); r[n] = 'ok'; } catch (e) { r[n] = 'ERR ' + String(e.message).split('\n')[0].slice(0, 80); } };
  const go = async (p) => { await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 45000 }); await page.waitForTimeout(1500); };
  const shot = (n) => page.screenshot({ path: `${dir}/${n}.png` });
  const toTop = async (loc, off) => { await loc.evaluate((el, o) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - o, behavior: 'instant' }), off); await page.waitForTimeout(600); };
  const center = async (loc) => { await loc.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(600); };
  const mustHaveScrolled = async () => { const y = await page.evaluate(() => window.scrollY); if (y < 100) throw new Error('page did not scroll (y=' + y + ')'); };
  await step('01', async () => { await go('/dashboard'); await shot('01'); });
  await step('02', async () => { await toTop(page.getByRole('heading', { name: L.fav }).first(), 90); await mustHaveScrolled(); await shot('02'); });
  await step('03', async () => { await go('/track'); await page.waitForFunction(() => document.querySelectorAll('table tbody tr').length >= 10, null, { timeout: 25000 }); await page.waitForTimeout(800); await shot('03'); });
  // Model rating is a role="tab" with aria-selected. The only aria-pressed
  // buttons on the page are the EN/FR switch, which an earlier selector flipped.
  await step('04', async () => { const tab = page.getByRole('tab', { name: L.model }); await toTop(tab, 150); await tab.click(); await page.waitForTimeout(1800); r.selected = await page.locator('[role=tab][aria-selected="true"]').first().innerText(); await shot('04'); });
  await step('05', async () => { await go('/athlete/men_PV/Armand%20DUPLANTIS'); if (/Brussels|Bruxelles/.test(await page.evaluate(() => document.body.innerText))) throw new Error('stale city text on the athlete page'); await shot('05'); });
  // The info tip opens on hover and pins on click; a click with no hover first toggled it shut.
  await step('06', async () => { const t = page.locator(`main button[aria-label^="${L.tip}"]:visible`).first(); await center(t); await t.hover(); await page.waitForTimeout(500); await t.click(); await page.waitForTimeout(800); const n = await page.locator('[role=tooltip]:visible').count(); if (!n) throw new Error('info tip not open'); await shot('06'); });
  await step('07', async () => { await go('/ultimate'); await shot('07'); });
  await step('08', async () => { await toTop(page.getByRole('heading', { name: L.qualified }).first(), 70); await mustHaveScrolled(); await shot('08'); });
  await step('09', async () => { await go('/country/JAM'); await shot('09'); });
  await step('10', async () => { await toTop(page.getByRole('heading', { name: L.relays }).first(), 70); await mustHaveScrolled(); await shot('10'); });
  await step('11', async () => { await go('/stats'); await shot('11'); });
  // Desktop shows the search box inline; on a phone it is hidden until the search
  // button is pressed, so match only the visible input.
  await step('12', async () => { await go('/dashboard'); if (!(await page.locator('input[type=search]:visible').count())) { await page.getByRole('button', { name: L.search }).first().click(); await page.waitForTimeout(500); } await page.locator('input[type=search]:visible').first().fill('jam'); await page.waitForTimeout(2000); r.hits = await page.locator('ul[role=listbox] li').count(); if (!r.hits) throw new Error('no search results'); await shot('12'); });
  await step('13', async () => { await go('/results'); await shot('13'); });
  await step('14', async () => { const fb = page.getByRole('button', { name: L.feedback }).first(); await center(fb); await fb.click(); await page.waitForTimeout(1000); if (!(await page.locator('[role=dialog]:visible').count())) throw new Error('feedback form not open'); await shot('14'); });
  await ctx.close(); return r;
}
(async () => {
  const browser = await chromium.launch();
  for (const lang of ['en', 'fr']) for (const fmt of ['phone', 'desk']) console.log('VARIANT ' + JSON.stringify(await variant(browser, lang, fmt)));
  await browser.close();
})().catch(e => { console.error('CAPTURE_FAIL', e.message); process.exit(1); });
