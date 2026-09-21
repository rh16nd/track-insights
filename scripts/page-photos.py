"""Fetch the photos behind the page headers, crop them to a wide header, and
write their credits where the site reads them.

    python scripts/page-photos.py            # every photo
    python scripts/page-photos.py track      # only the named ones

The set the user chose on 2026-09-21 is athletics seen from above: drone shots
of tracks and pits from Unsplash (free under the Unsplash License) and
high-angle race photos from Paris 2024 on Wikimedia Commons (CC BY 4.0). From
that height no athlete is recognisable, which matters because the pages name
real athletes. The originals are cached in scripts/.photo-cache/ (not
committed); the crops go to public/photos/ at 1200 and 2400 px wide, and the
credits to src/lib/page-photo-credits.ts, which this script owns.

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


def commons(title, fy=0.5, focus="50% 50%", zoom=1.0):
    return {"from": "commons", "title": title, "fy": fy, "focus": focus, "zoom": zoom}


def unsplash(photo, page, author, fy=0.5, focus="50% 50%", zoom=1.0):
    return {"from": "unsplash", "photo": photo, "page": page, "author": author,
            "fy": fy, "focus": focus, "zoom": zoom}


PHOTOS = {
    # Runners and their shadows, straight down.
    "dashboard": unsplash(
        "photo-1502904550040-7534597429ae",
        "https://unsplash.com/photos/group-of-people-running-on-stadium-atSaEOeE8Nk",
        "Steven Lelham", focus="60% 50%",
    ),
    # The 4x100m final from high in the stands.
    "track": commons("File:Athletics at the 2024 Summer Olympics – Men's 4 × 100 metres relay final - 08.jpg"),
    # A stadium's long jump runway and pit from a drone.
    "field": unsplash(
        "photo-1502954268779-a2e1a7cca09c",
        "https://unsplash.com/photos/top-view-of-stadium-m1cBsfdWZf8",
        "Bence Boros", focus="55% 50%",
    ),
    # The steeplechase water jump.
    "stats": commons(
        "File:Athletics at the 2024 Summer Olympics Paris - Women's 3000mn Steeplechase, Finale - 04.jpg",
        fy=0.45, focus="50% 45%",
    ),
    # A race down the straight, from a drone.
    "schedule": unsplash(
        "photo-1552750691-e634382cb586",
        "https://unsplash.com/photos/aerial-photography-of-sports-field-HBfOTPDz0pU",
        "CHUTTERSNAP",
    ),
    # Set, in the blocks.
    "qualification": commons("File:Athletics at the 2024 Summer Olympics – Women's 100 metres hurdles semi-final 1 - 02.jpg"),
    # The 400m hurdles final, for the page that grades the calls.
    "results": commons("File:Athletics at the 2024 Summer Olympics – Men's 400 m hurdles final - 01.jpg"),
    # A stadium bend from a drone.
    "how": unsplash(
        "photo-1615059965614-963bff71bc17",
        "https://unsplash.com/photos/aerial-view-of-green-and-brown-stadium-gzQJAWr8Vwk",
        "Patrick Federi",
    ),
    # The start line the landing opens on, for the 404.
    "start": commons("File:Starting line (Unsplash).jpg", focus="60% 50%"),
    # Nagoya's Mizuho stadium at night, the Asian Games' athletics venue, for
    # the championship page. Zoomed a little: the panorama's stitching leaves a
    # black edge along its top.
    "nagoya": commons("File:Mizuho athletic stadium130824-2.jpg", fy=0.56, focus="50% 55%", zoom=0.9),
}

# Where Commons' author field carries more than a name.
AUTHOR = {"start": "Kolleen Gladden"}

# The 2400px file only serves sharp screens, where the header's dark wash hides
# compression, so it can take more of it.
QUALITY = {1200: 72, 2400: 60}
QUALITY_2400 = {"nagoya": 50}


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


def crop(im, fy, zoom=1.0, fx=0.5):
    w, h = im.size
    cw, ch = (int(h * RATIO), h) if w / h > RATIO else (w, int(w / RATIO))
    cw, ch = int(cw * zoom), int(ch * zoom)
    left = min(max(int(fx * w - cw / 2), 0), w - cw)
    top = min(max(int(fy * h - ch / 2), 0), h - ch)
    return im.crop((left, top, left + cw, top + ch))


def strip_tags(html):
    return re.sub(r"<[^>]+>", "", html or "").strip()


def credit_and_image(key, spec, cached):
    """The photo's credit, fetching the original into the cache if needed."""
    if spec["from"] == "unsplash":
        if not cached.exists():
            cached.write_bytes(fetch(f"https://images.unsplash.com/{spec['photo']}?w=3200&q=85&fm=jpg"))
        return {"author": spec["author"], "license": "Unsplash", "source": spec["page"]}
    data = api({
        "action": "query", "format": "json", "titles": spec["title"], "prop": "imageinfo",
        "iiprop": "url|size|extmetadata", "iiurlwidth": 3200,
    })
    time.sleep(1.5)
    ii = next(iter(data["query"]["pages"].values()))["imageinfo"][0]
    em = ii.get("extmetadata", {})
    if not cached.exists():
        cached.write_bytes(fetch(ii.get("thumburl") or ii["url"]))
        time.sleep(1.5)
    return {
        "author": AUTHOR.get(key) or " ".join(strip_tags(em.get("Artist", {}).get("value")).split()),
        "license": em.get("LicenseShortName", {}).get("value"),
        "source": ii["descriptionurl"],
    }


def main(only):
    CACHE.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    meta_path = CACHE / "credits.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}

    for key, spec in PHOTOS.items():
        if only and key not in only:
            continue
        ref = spec.get("title") or spec.get("photo")
        cached = CACHE / f"{key}.jpg"
        if key not in meta or meta[key].get("ref") != ref or not cached.exists():
            if cached.exists():
                cached.unlink()
            meta[key] = {"ref": ref, **credit_and_image(key, spec, cached)}
        meta[key]["focus"] = spec["focus"]
        im = crop(Image.open(io.BytesIO(cached.read_bytes())).convert("RGB"), spec["fy"], spec["zoom"])
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
