async page => {
  // Screenshot every route, first screen and full page, into the folder named
  // by window.__SHOT_DIR (set below per run). Also records sideways scroll.
  const base = 'http://localhost:8081';
  const dir = globalThis.__dir || 'baseline';
  const routes = [
    ['landing', '/'],
    ['dashboard', '/dashboard'],
    ['track', '/track'],
    ['field', '/field'],
    ['disc-400h', '/discipline/men_400h'],
    ['disc-HT', '/discipline/men_HT'],
    ['athlete', '/athlete/men_400h/Alison%20DOS%20SANTOS'],
    ['championship', '/championship'],
    ['results', '/results'],
    ['stats', '/stats'],
    ['schedule', '/schedule'],
    ['qualification', '/qualification'],
    ['country-JPN', '/country/JPN'],
    ['how', '/how-it-works'],
    ['404', '/no-such-page'],
  ];
  const w = page.viewportSize().width;
  const out = [];
  for (const [name, path] of routes) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${dir}/${name}-${w}.png` });
    await page.screenshot({ path: `${dir}/${name}-${w}-full.png`, fullPage: true });
    const sx = await page.evaluate(() => { scrollTo(9999, 0); const x = scrollX; scrollTo(0, 0); return x; });
    out.push(`${name}:${sx}`);
  }
  return out.join(' ');
}
