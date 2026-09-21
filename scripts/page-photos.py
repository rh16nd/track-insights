"""Fetch the photos behind the page headers, crop them to a wide header, and
write their credits where the site reads them.

    python scripts/page-photos.py            # every photo
    python scripts/page-photos.py track      # only the named ones

Each photo is a free-licensed scene from Wikimedia Commons, chosen for the page
it sits on, never a recognisable athlete: a page names real athletes, and a
stranger's face above a name reads as that athlete. The originals are cached in
scripts/.photo-cache/ (not committed); the crops go to public/photos/ at 1200
and 2400 px wide, and the credits to src/lib/page-photo-credits.ts, which this
script owns.

Commons rate-limits its API, answering with a non-JSON page when it does, so
every request is spaced 1.5 s apart and retried with back-off.
"""
import io
import json
import re
import sys
import time
from pathlib import Path

import requests
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "scripts" / ".photo-cache"
OUT = ROOT / "public" / "photos"
CREDITS = ROOT / "src" / "lib" / "page-photo-credits.ts"
API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "PodiumCall/1.0 (https://www.podiumcall.cc; page header photos)"}

# A header is wide and short. On a phone the same file is drawn much taller
# than it is wide, so `focus` (the CSS object-position) keeps the subject in
# the frame there too.
RATIO = 2.4

# key -> Commons file, focal point (share of width, height) for the crop, and
# the object-position the page uses.
PHOTOS = {
    # A floodlit stadium: the whole season in one view.
    "dashboard": ("File:Athletics at the 2012 Summer Olympics (7925560204).jpg", 0.5, 0.45, "50% 45%"),
    # Hurdles wheeled across the lanes.
    "track": ("File:French Athletics Championships 2013 t113118.jpg", 0.5, 0.62, "55% 60%"),
    # The start line the landing opens on.
    "start": ("File:Starting line (Unsplash).jpg", 0.55, 0.5, "60% 50%"),
    # A 1950s 100m finish, for the page that grades the calls.
    "results": (
        "File:Atletiek Nederland tegen Duitsland, finish 100 m heren, Bestanddeelnr 907-2891.jpg",
        0.5, 0.55, "50% 55%",
    ),
    # Starting blocks, for the qualifying standings.
    "blocks": ("File:Starting block J1.jpg", 0.5, 0.5, "50% 50%"),
    # Nagoya's Mizuho stadium at night, the Asian Games' athletics venue.
    # Zoomed a little: the panorama's stitching leaves a black edge along its top.
    "nagoya": ("File:Mizuho athletic stadium130824-2.jpg", 0.5, 0.56, "50% 55%", 0.9),
}

# Where Commons' author field carries more than a name.
AUTHOR = {"start": "Kolleen Gladden"}

# The 2400px file only serves sharp screens, where the header's dark wash hides
# compression, so it can take more of it.
QUALITY = {1200: 72, 2400: 60}
# Fine, even texture (a track surface, a crowd) costs far more bytes than it
# earns at 2400px under the wash.
QUALITY_2400 = {"blocks": 40, "track": 48, "nagoya": 50}


def api(params, tries=6):
    for i in range(tries):
        r = requests.get(API, params=params, headers=UA, timeout=30)
        try:
            return r.json()
        except ValueError:
            time.sleep(4 * (i + 1))
    raise RuntimeError("Commons kept answering with a non-JSON page")


def fetch(url, tries=6):
    for i in range(tries):
        r = requests.get(url, headers=UA, timeout=120)
        if r.ok and r.headers.get("content-type", "").startswith("image"):
            return r.content
        time.sleep(5 * (i + 1))
    raise RuntimeError(f"could not fetch {url}")


def crop(im, fx, fy, zoom=1.0):
    w, h = im.size
    cw, ch = (int(h * RATIO), h) if w / h > RATIO else (w, int(w / RATIO))
    cw, ch = int(cw * zoom), int(ch * zoom)
    left = min(max(int(fx * w - cw / 2), 0), w - cw)
    top = min(max(int(fy * h - ch / 2), 0), h - ch)
    return im.crop((left, top, left + cw, top + ch))


def strip_tags(html):
    return re.sub(r"<[^>]+>", "", html or "").strip()


def main(only):
    CACHE.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    meta_path = CACHE / "meta.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}

    for key, (title, fx, fy, focus, *zoom) in PHOTOS.items():
        if only and key not in only:
            continue
        cached = CACHE / f"{key}.jpg"
        if key not in meta or meta[key].get("title") != title or not cached.exists():
            data = api({
                "action": "query", "format": "json", "titles": title, "prop": "imageinfo",
                "iiprop": "url|size|extmetadata", "iiurlwidth": 3200,
            })
            ii = next(iter(data["query"]["pages"].values()))["imageinfo"][0]
            em = ii.get("extmetadata", {})
            meta[key] = {
                "title": title,
                "author": strip_tags(em.get("Artist", {}).get("value")),
                "license": em.get("LicenseShortName", {}).get("value"),
                "source": ii["descriptionurl"],
            }
            cached.write_bytes(fetch(ii.get("thumburl") or ii["url"]))
            time.sleep(1.5)
        meta[key]["focus"] = focus
        meta[key]["author"] = AUTHOR.get(key) or " ".join(meta[key]["author"].split())
        im = crop(Image.open(io.BytesIO(cached.read_bytes())).convert("RGB"), fx, fy, *zoom)
        for width in (1200, 2400):
            if im.width < width:
                print(f"  {key}: the source is only {im.width}px wide, {width}px is upscaled")
            out = im.resize((width, round(width / RATIO)), Image.LANCZOS)
            path = OUT / f"{key}-{width}.webp"
            q = QUALITY_2400.get(key, QUALITY[width]) if width == 2400 else QUALITY[width]
            out.save(path, "WEBP", quality=q, method=6)
            print(f"{key} {width} {path.stat().st_size // 1024} KB")

    meta_path.write_text(json.dumps(meta, indent=1, ensure_ascii=False), encoding="utf-8")
    known = {k: meta[k] for k in PHOTOS if k in meta}
    lines = [
        "// Written by scripts/page-photos.py. Do not edit by hand: change the",
        "// PHOTOS table there and run it again.",
        "",
        "export const PAGE_PHOTO_CREDITS = {",
    ]
    for key, m in known.items():
        lines.append(
            f"  {key}: {{ author: {json.dumps(m['author'], ensure_ascii=False)}, "
            f"license: {json.dumps(m['license'])}, source: {json.dumps(m['source'], ensure_ascii=False)}, "
            f"focus: {json.dumps(m['focus'])} }},"
        )
    lines += ["} as const;", "", "export type PagePhotoKey = keyof typeof PAGE_PHOTO_CREDITS;", ""]
    CREDITS.write_text("\n".join(lines), encoding="utf-8")
    print(f"credits for {len(known)} photos -> {CREDITS.relative_to(ROOT)}")


if __name__ == "__main__":
    main(set(sys.argv[1:]))
