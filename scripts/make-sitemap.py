r"""Regenerate public/sitemap.xml from the published snapshot.

    PODIUMCALL_BASE_URL=https://www.podiumcall.cc C:\Users\rayen\athletics-predictor\venv\Scripts\python.exe scripts/make-sitemap.py

Run it after build_static_api.py. Since 2026-09-16 it reads public/data, the JSON
the site actually serves, rather than a local API. A local API can be pointed at
a different championship from the one published (PODIUMCALL_CHAMPIONSHIP, used to
review the next one before the flip), and a sitemap built from it would list pages
the live site does not have. The list is still read, never hand-kept, so it cannot
drift from the routes that exist, and a missing snapshot file fails loudly instead
of writing a stale or partial sitemap.

What it lists: the fixed pages, every event with a page (the 32 Diamond League
events and the ones only the world rankings carry, the hammer and the 10,000m),
each event's athletes with a page, every country, and, while a championship is on,
its entrants with a page. Before 2026-09-16 it missed /championship, /results,
/how-it-works, the countries and the hammer and 10,000m.
"""

import datetime
import json
import os
import urllib.parse

# REQUIRED, with no default: a sitemap is hundreds of absolute URLs, and a
# guessed host would put a fabricated fact in front of every crawler.
BASE = os.environ.get("PODIUMCALL_BASE_URL", "").rstrip("/")
DATA = os.path.join(os.path.dirname(__file__), "..", "public", "data")
FIXED = ["/", "/dashboard", "/track", "/field", "/qualification", "/stats", "/schedule",
         "/championship", "/results", "/how-it-works"]
DAILY = {"/", "/dashboard", "/championship"}


def read(name):
    path = os.path.join(DATA, name)
    if not os.path.exists(path):
        raise SystemExit(f"{os.path.abspath(path)} is missing: run build_static_api.py first, then this script")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def athlete_path(disc, name):
    # quote() so a name with a space or an accent survives; safe="" because the
    # slash must be encoded inside a single path segment.
    return f"/athlete/{disc}/{urllib.parse.quote(name, safe='')}"


def urls_for(preds, rankings, countries, summary, championship, today):
    """[(path, changefreq)] and the counts printed, from the snapshot payloads.
    `championship` is only read while the championship is on: its entrants have
    pages until it ends (api.championship_call), and not after."""
    urls = [(p, "daily" if p in DAILY else "weekly") for p in FIXED]
    seen = set()

    def add_athlete(disc, name):
        if name and disc and (disc, name) not in seen:
            seen.add((disc, name))
            urls.append((athlete_path(disc, name), "weekly"))

    dl = preds["trackDisciplines"] + preds["fieldDisciplines"]
    dl_ids = {d["id"] for d in dl}
    for d in dl:
        urls.append((f"/discipline/{d['id']}", "daily"))
        for a in d["athletes"]:
            add_athlete(d["id"], a["name"])
    extra = sorted(key for key in rankings if key not in dl_ids)
    for key in extra:
        urls.append((f"/discipline/{key}", "daily"))
        for a in rankings[key].get("model") or []:
            add_athlete(key, a.get("name"))
    for c in countries:
        urls.append((f"/country/{c['code']}", "weekly"))

    before = len(seen)
    if today.isoformat() <= (summary.get("endDate") or ""):
        for p in (championship() or {}).get("projections") or []:
            for a in (p.get("athletes") or []) + (p.get("unranked") or []):
                if a.get("hasPage"):
                    add_athlete(p.get("discKey"), a.get("name"))
    counts = {"fixed": len(FIXED), "events": len(dl) + len(extra), "extraEvents": len(extra),
              "countries": len(countries), "athletes": len(seen), "entrants": len(seen) - before}
    return urls, counts


def build(today=None):
    if not BASE:
        raise SystemExit(
            "PODIUMCALL_BASE_URL is not set. A sitemap needs the real, live "
            "origin; refusing to guess one. See the note above."
        )
    urls, counts = urls_for(read("predictions.json"), read("world-rankings.json"),
                            read("countries.json")["countries"], read("championship-summary.json"),
                            lambda: read("championship.json"), today or datetime.date.today())

    stamp = (today or datetime.date.today()).isoformat()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for path, freq in urls:
        lines += ["  <url>", f"    <loc>{BASE}{path}</loc>", f"    <lastmod>{stamp}</lastmod>",
                  f"    <changefreq>{freq}</changefreq>", "  </url>"]
    lines.append("</urlset>")

    out = os.path.join(os.path.dirname(__file__), "..", "public", "sitemap.xml")
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"wrote {os.path.abspath(out)}: {len(urls)} urls ({counts['fixed']} fixed, {counts['events']} events "
          f"of which {counts['extraEvents']} beyond the Diamond League, {counts['countries']} countries, "
          f"{counts['athletes']} athletes, {counts['entrants']} of them championship entrants)")
    _update_robots()


def _update_robots():
    """Point robots.txt at the sitemap, using the same real BASE. Kept here
    rather than hand-edited so the absolute URL cannot be a stale guess --
    robots.txt ships with no Sitemap line and gets the correct one written at
    generation time. Idempotent: any prior Sitemap line is replaced."""
    robots = os.path.join(os.path.dirname(__file__), "..", "public", "robots.txt")
    line = f"Sitemap: {BASE}/sitemap.xml"
    nl = chr(10)
    if os.path.exists(robots):
        with open(robots, encoding="utf-8") as f:
            kept = [ln for ln in f.read().splitlines() if not ln.lower().startswith("sitemap:")]
        body = nl.join(kept).rstrip() + nl + nl + line + nl
    else:
        body = line + nl
    with open(robots, "w", encoding="utf-8") as f:
        f.write(body)
    print(f"updated robots.txt -> {line}")


if __name__ == "__main__":
    build()
