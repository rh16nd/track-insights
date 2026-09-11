// Landscape-only capture for the animated intro video. 1440x782 CSS @2x -> 2880x1564, so the
// camera can push in without the UI going soft. Saves a "before" frame for every press, and
// meta.json with element rects in screenshot pixels, so the renderer knows where to aim.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://podiumcall.vercel.app';
const DSF = 2;
const LBL = {
  en: { model: 'Model rating', feedback: 'Send feedback', tip: 'About ', fav: /favourites/i, qualified: /already qualified/i, relays: /mixed relays/i, modelStat: /podiumcall model/i },
  fr: { model: 'Éval. du modèle', feedback: 'Envoyer un retour', tip: 'En savoir plus sur ', fav: /favoris/i, qualified: /déjà qualifiés/i, relays: /relais mixtes/i, modelStat: /modèle podiumcall|podiumcall/i },
};
async function variant(browser, lang) {
  const L = LBL[lang]; const dir = `cap4/${lang}`; fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 782 }, deviceScaleFactor: DSF, reducedMotion: 'reduce' });
  await ctx.addInitScript((l) => { try { localStorage.setItem('podiumcall:welcome:v1', '1'); localStorage.setItem('podiumcall:lang', l); } catch (e) {} }, lang);
  const page = await ctx.newPage();
  const r = { v: lang }; const meta = { dsf: DSF, width: 1440 * DSF, height: 782 * DSF, shots: {} };
  const step = async (n, fn) => { try { await fn(); r[n] = 'ok'; } catch (e) { r[n] = 'ERR ' + String(e.message).split('\n')[0].slice(0, 80); } };
  const go = async (p) => { await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 45000 }); await page.waitForTimeout(1500); };
  const box = async (loc) => { const b = await loc.boundingBox(); return b ? [b.x, b.y, b.width, b.height].map(v => Math.round(v * DSF)) : null; };
  const shot = async (n, rects) => { await page.screenshot({ path: `${dir}/${n}.png` }); meta.shots[n] = rects; };
  const toTop = async (loc, off) => { await loc.evaluate((el, o) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - o, behavior: 'instant' }), off); await page.waitForTimeout(600); };
  const center = async (loc) => { await loc.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(600); };
  const mustHaveScrolled = async () => { const y = await page.evaluate(() => window.scrollY); if (y < 100) throw new Error('page did not scroll (y=' + y + ')'); };
  const h1 = () => page.locator('h1').first();

  await step('01', async () => { await go('/dashboard'); await shot('01', { focus: await box(h1()) }); });
  await step('02', async () => { const h = page.getByRole('heading', { name: L.fav }).first(); await toTop(h, 90); await mustHaveScrolled(); await shot('02', { focus: await box(h) }); });
  await step('03', async () => { await go('/track'); await page.waitForFunction(() => document.querySelectorAll('table tbody tr').length >= 10, null, { timeout: 25000 }); const tab = page.getByRole('tab', { name: L.model }); await toTop(tab, 150); await shot('03', { focus: await box(page.locator('table').first()), press: await box(tab) }); });
  await step('04', async () => { const tab = page.getByRole('tab', { name: L.model }); await tab.click(); await page.waitForTimeout(1800); r.selected = await page.locator('[role=tab][aria-selected="true"]').first().innerText(); await shot('04', { focus: await box(page.locator('table').first()) }); });
  await step('05', async () => { await go('/athlete/men_PV/Armand%20DUPLANTIS'); if (/Brussels|Bruxelles/.test(await page.evaluate(() => document.body.innerText))) throw new Error('stale city text on the athlete page'); const stat = page.getByText(L.modelStat).first(); await shot('05', { focus: await box(h1()), stat: (await stat.count()) ? await box(stat) : null }); });
  await step('06b', async () => { const t = page.locator(`main button[aria-label^="${L.tip}"]:visible`).first(); await center(t); await page.mouse.move(2, 2); await page.waitForTimeout(400); await shot('06b', { press: await box(t) }); });
  await step('06', async () => { const t = page.locator(`main button[aria-label^="${L.tip}"]:visible`).first(); await t.hover(); await page.waitForTimeout(500); await t.click(); await page.waitForTimeout(800); const tip = page.locator('[role=tooltip]:visible').first(); if (!(await tip.count())) throw new Error('info tip not open'); await shot('06', { focus: await box(tip), press: await box(t) }); });
  await step('07', async () => { await go('/ultimate'); await shot('07', { focus: await box(h1()) }); });
  await step('08', async () => { const h = page.getByRole('heading', { name: L.qualified }).first(); await toTop(h, 70); await mustHaveScrolled(); await shot('08', { focus: await box(h) }); });
  await step('09', async () => { await go('/country/JAM'); await shot('09', { focus: await box(h1()) }); });
  await step('10', async () => { const h = page.getByRole('heading', { name: L.relays }).first(); await toTop(h, 70); await mustHaveScrolled(); await shot('10', { focus: await box(h) }); });
  await step('11', async () => { await go('/stats'); await shot('11', { focus: await box(h1()) }); });
  await step('12b', async () => { await go('/dashboard'); const inp = page.locator('input[type=search]:visible').first(); if (!(await inp.count())) throw new Error('no visible search box on desktop'); await shot('12b', { press: await box(inp) }); });
  await step('12', async () => { const inp = page.locator('input[type=search]:visible').first(); await inp.fill('jam'); await page.waitForTimeout(2000); const list = page.locator('ul[role=listbox]').first(); r.hits = await page.locator('ul[role=listbox] li').count(); if (!r.hits) throw new Error('no search results'); await shot('12', { focus: await box(list), press: await box(inp) }); });
  await step('13', async () => { await go('/results'); await shot('13', { focus: await box(h1()) }); });
  await step('14b', async () => { const fb = page.getByRole('button', { name: L.feedback }).first(); await center(fb); await page.mouse.move(2, 2); await page.waitForTimeout(400); await shot('14b', { press: await box(fb) }); });
  await step('14', async () => { const fb = page.getByRole('button', { name: L.feedback }).first(); await fb.click(); await page.waitForTimeout(1000); const dlg = page.locator('[role=dialog]:visible').first(); if (!(await dlg.count())) throw new Error('feedback form not open'); await shot('14', { focus: await box(dlg) }); });

  fs.writeFileSync(`${dir}/meta.json`, JSON.stringify(meta, null, 1));
  await ctx.close(); return r;
}
(async () => {
  const browser = await chromium.launch();
  for (const lang of ['en', 'fr']) console.log('VARIANT ' + JSON.stringify(await variant(browser, lang)));
  await browser.close();
})().catch(e => { console.error('CAPTURE_FAIL', e.message); process.exit(1); });
