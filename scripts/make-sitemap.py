r"""Regenerate public/sitemap.xml from the live API.

    C:\Users\rayen\athletics-predictor\venv\Scripts\python.exe scripts/make-sitemap.py

The site is ~270 real URLs -- 7 fixed routes, 32 disciplines and every
projected finalist -- and robots.txt pointed crawlers at none of them. The
list is READ from the API rather than hand-kept, so it cannot drift from the
routes that actually exist; if the API is not running the script fails
loudly instead of writing a stale or empty file.
"""

import datetime
import json
import os
import urllib.parse
import urllib.request

API = "http://localhost:5000/api"
# REQUIRED, with no default. No domain is registered or deployed yet
# (PRODUCT.md records podiumcall.com/.io only as "appeared unregistered"), and
# a sitemap is 276 absolute URLs -- inventing a plausible-looking host would
# put a fabricated fact in front of every crawler that reads it. Set it when
# the real domain exists:
#   PODIUMCALL_BASE_URL=https://your-domain venv/Scripts/python.exe scripts/make-sitemap.py
BASE = os.environ.get("PODIUMCALL_BASE_URL", "").rstrip("/")
FIXED = ["/", "/dashboard", "/track", "/field", "/qualification", "/stats", "/schedule"]


def fetch(path):
    with urllib.request.urlopen(f"{API}{path}", timeout=30) as r:
        return json.load(r)


def build():
    if not BASE:
        raise SystemExit(
            "PODIUMCALL_BASE_URL is not set. A sitemap needs the real, live "
            "origin; refusing to guess one. See the note above."
        )
    preds = fetch("/predictions")
    discs = preds["trackDisciplines"] + preds["fieldDisciplines"]

    urls = [(p, "daily" if p in ("/", "/dashboard") else "weekly") for p in FIXED]
    seen = set()
    for d in discs:
        urls.append((f"/discipline/{d['id']}", "daily"))
        for a in d["athletes"]:
            key = (d["id"], a["name"])
            if key in seen:
                continue
            seen.add(key)
            # quote() so a name with a space or an accent survives; safe=""
            # because the slash must be encoded inside a single path segment.
            urls.append((f"/athlete/{d['id']}/{urllib.parse.quote(a['name'], safe='')}", "weekly"))

    today = datetime.date.today().isoformat()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for path, freq in urls:
        lines += ["  <url>", f"    <loc>{BASE}{path}</loc>", f"    <lastmod>{today}</lastmod>",
                  f"    <changefreq>{freq}</changefreq>", "  </url>"]
    lines.append("</urlset>")

    out = os.path.join(os.path.dirname(__file__), "..", "public", "sitemap.xml")
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"wrote {os.path.abspath(out)}: {len(urls)} urls "
          f"({len(FIXED)} fixed, {len(discs)} disciplines, {len(seen)} athletes)")


if __name__ == "__main__":
    build()
