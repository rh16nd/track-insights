"""Writes crawl-site.js: a playwright-cli run-code script that opens every
page of the site, or a chosen set, and checks what a reader actually sees.

run-code has no file access, so the page list is written into the script.

    python scripts/qa/make-crawl.py --base http://localhost:8081 --set priority --out crawl-site.js
    playwright-cli -s=desk --raw run-code --filename=crawl-site.js > crawl.json

Sets:
  routes    every route, all 36 event pages, every country page
  priority  routes, plus every top-20 athlete, every Asian Games entrant and
            three athletes per country
  athletes  every ranked athlete (about 4,800 pages; hours)
"""
import argparse
import json
import os
from urllib.parse import quote

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DATA = os.path.abspath(os.path.join(HERE, "..", "..", "..", "track-insights-main", "public", "data"))

FIELD_EVENTS = {"HJ", "PV", "LJ", "TJ", "SP", "DT", "JT", "HT"}

# Wording from the Diamond League era, which ended with its Final on 4
# September. A page that still says it is out of date.
STALE = ["projected field", "In field", "projected to line up", "Final field",
         "the qualified field", "plateau projeté", "Dans le plateau"]
# The placeholder a figure shows when it is not known, and the lines that
# said so. A section holding only these is an empty section.
EMPTY = ["—", "No qualifying head-to-head record", "no dated results",
         "aren't computed for athletes"]

CHECK_JS = r"""
async page => {
  const PAGES = __PAGES__;
  const STALE = __STALE__;
  const EMPTY = __EMPTY__;
  const out = [];
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('/_vercel/')) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const [kind, path] of PAGES) {
    errors.length = 0;
    let row = { kind, path };
    try {
      await page.goto(__BASE__ + path, { waitUntil: 'domcontentloaded', timeout: 45000 });
      // Settled: no skeleton left and the text has held still, leaving out
      // any countdown (role="timer"), which changes every second by design.
      let last = '', since = Date.now();
      const deadline = Date.now() + 40000;
      while (Date.now() < deadline) {
        const [busy, text] = await page.evaluate(() => {
          let t = document.body ? document.body.innerText : '';
          for (const e of document.querySelectorAll('[role="timer"]')) t = t.replace(e.innerText, '');
          return [document.querySelectorAll('[aria-busy="true"]').length, t];
        });
        if (text !== last) { last = text; since = Date.now(); }
        else if (!busy && Date.now() - since > 1200) break;
        await page.waitForTimeout(250);
      }
      row = { ...row, ...(await page.evaluate(([STALE, EMPTY]) => {
        const main = document.querySelector('main') || document.body;
        const text = document.body.innerText;
        const sections = [...main.querySelectorAll('section')].filter((s) => !s.querySelector('section'));
        const empty = sections.filter((s) => {
          const heading = s.querySelector('h1,h2,h3');
          let body = s.innerText;
          if (heading) body = body.replace(heading.innerText, '');
          for (const e of EMPTY) body = body.split(e).join('');
          return body.replace(/[\s·]/g, '').length === 0;
        }).map((s) => (s.querySelector('h1,h2,h3') || {}).innerText || '?');
        const dashes = [...main.querySelectorAll('div,span,td,b')]
          .filter((e) => e.childElementCount === 0 && e.textContent.trim() === '—').length;
        window.scrollTo({ left: 9999, top: window.scrollY, behavior: 'instant' });
        return {
          h1: (document.querySelector('h1') || {}).innerText || '',
          failed: /Couldn.t load|could not be loaded|Impossible de charger|Page not found|Page introuvable/.test(text),
          stale: STALE.filter((s) => text.includes(s)),
          empty,
          dashes,
          sideways: window.scrollX,
          sections: sections.length,
        };
      }, [STALE, EMPTY])) };
    } catch (e) {
      row.failed = true;
      row.error = String(e).slice(0, 160);
    }
    row.console = errors.slice(0, 3);
    out.push(row);
  }
  return JSON.stringify(out);
}
"""


def athlete_path(disc, name):
    return f"/athlete/{disc}/{quote(name, safe='')}"


def pages_for(data, which):
    pages = [("route", p) for p in ("/", "/dashboard", "/track", "/field", "/championship",
                                    "/results", "/schedule", "/stats", "/how-it-works",
                                    "/qualification")]
    for fn in sorted(os.listdir(os.path.join(data, "discipline"))):
        disc = fn[:-5]
        pages.append(("event", f"/discipline/{disc}"))
        field = disc.split("_")[-1] in FIELD_EVENTS
        pages.append(("field pill" if field else "track pill",
                      f"/{'field' if field else 'track'}?disc={disc}"))
    with open(os.path.join(data, "countries.json"), encoding="utf-8") as f:
        codes = [c["code"] for c in json.load(f).get("countries", [])]
    pages += [("country", f"/country/{c}") for c in codes]
    if which == "routes":
        return pages

    athletes = []
    if which == "priority":
        with open(os.path.join(data, "world-rankings.json"), encoding="utf-8") as f:
            for disc, lists in json.load(f).items():
                for key in ("points", "model"):
                    athletes += [("top20", disc, r["name"]) for r in lists.get(key) or []]
        with open(os.path.join(data, "championship.json"), encoding="utf-8") as f:
            for p in json.load(f).get("projections") or []:
                athletes += [("asian games", p["discKey"], a["name"]) for a in p["athletes"]
                             if a.get("hasPage") is not False]
        # Three per country, read off each country page's own list.
        for c in codes:
            path = os.path.join(data, "country", f"{c}.json")
            if not os.path.exists(path):
                continue
            with open(path, encoding="utf-8") as f:
                country = json.load(f)
            found = []

            def walk(o):
                if isinstance(o, dict):
                    if isinstance(o.get("name"), str) and o.get("discKey"):
                        found.append((o["discKey"], o["name"]))
                    for v in o.values():
                        walk(v)
                elif isinstance(o, list):
                    for v in o:
                        walk(v)
            walk(country)
            athletes += [("country", d, n) for d, n in found[:3]]
    else:
        with open(os.path.join(data, "search-index.json"), encoding="utf-8") as f:
            athletes = [("ranked", disc, name) for name, disc, _m, _r in json.load(f)["athletes"]]

    seen = set()
    for kind, disc, name in athletes:
        if (disc, name) in seen:
            continue
        seen.add((disc, name))
        pages.append((kind, athlete_path(disc, name)))
    return pages


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--base", default="http://localhost:8081")
    parser.add_argument("--set", choices=["routes", "priority", "athletes"], default="priority")
    parser.add_argument("--data", default=DEFAULT_DATA)
    parser.add_argument("--out", default="crawl-site.js")
    parser.add_argument("--part", default=None, help="i/n: only the i-th of n equal slices")
    args = parser.parse_args()
    pages = pages_for(args.data, args.set)
    if args.part:
        i, n = (int(x) for x in args.part.split("/"))
        size = -(-len(pages) // n)
        pages = pages[(i - 1) * size:i * size]
    script = (CHECK_JS.replace("__PAGES__", json.dumps(pages, ensure_ascii=False))
              .replace("__STALE__", json.dumps(STALE, ensure_ascii=False))
              .replace("__EMPTY__", json.dumps(EMPTY, ensure_ascii=False))
              .replace("__BASE__", json.dumps(args.base)))
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(script)
    print(f"{len(pages)} pages -> {args.out}")


if __name__ == "__main__":
    main()
