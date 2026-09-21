async page => {
  // For each page: hide the header's text, screenshot what is behind it, and
  // return each text element's box and colour, to measure contrast offline.
  const w = page.viewportSize().width;
  const out = {};
  for (const [name, path] of [['dashboard', '/dashboard'], ['track', '/track'], ['field', '/field'], ['disc-400h', '/discipline/men_400h'], ['disc-HT', '/discipline/men_HT'], ['results', '/results'], ['stats', '/stats'], ['schedule', '/schedule'], ['qualification', '/qualification'], ['how', '/how-it-works'], ['athlete', '/athlete/men_400h/Alison%20DOS%20SANTOS']]) {
    await page.goto('http://localhost:8081' + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const boxes = await page.evaluate(() => {
      const head = document.querySelector('section.page-head');
      const els = [...head.querySelectorAll('h1, p, nav[aria-label="Breadcrumb"], .label-caps, b, a, button, span')]
        .filter((e) => e.childElementCount === 0 || e.tagName === 'H1' || e.tagName === 'P');
      const rows = [];
      for (const e of els) {
        if (!(e.textContent || '').trim()) continue;
        const cs = getComputedStyle(e);
        // Tight to the text: one rect per line box.
        const range = document.createRange();
        range.selectNodeContents(e);
        for (const r of range.getClientRects()) {
          if (r.width < 4 || r.height < 4 || r.bottom > innerHeight || r.top < 0) continue;
          rows.push({ tag: e.tagName, text: (e.textContent || '').trim().slice(0, 30), x: r.x, y: r.y, w: r.width, h: r.height, color: cs.color, size: cs.fontSize, weight: cs.fontWeight });
        }
      }
      const st = document.createElement('style');
      st.id = 'hide-text';
      st.textContent = 'section.page-head *{color:transparent!important;text-shadow:none!important;border-color:transparent!important} section.page-head svg{visibility:hidden}';
      document.head.appendChild(st);
      return rows;
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: `measure/${name}-${w}-bg.png` });
    await page.evaluate(() => document.getElementById('hide-text')?.remove());
    out[name] = boxes;
  }
  return JSON.stringify(out);
}
