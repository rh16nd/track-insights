"""Build the dashboard's coverage map: every country's outline, projected once,
in a small JSON file the page draws as SVG.

    python scripts/make-world-map.py

The outlines are Natural Earth's 1:110m countries (public domain), fetched once
into scripts/.map-cache/ and checked against a pinned SHA-256, projected with
Equal Earth (an equal-area projection, so no country looks bigger than it is)
into a 1000-unit-wide box, and written to public/geo/world-110m.v1.json, keyed
by ISO 3166 alpha-2 code in lower case, the same keys as src/lib/flags.ts.

Countries too small to have a shape at this scale get a dot from DOTS below.
The script fails if a country the site covers (public/data/countries.json, read
through IOC_TO_ISO2 in src/lib/flags.ts) has neither, so a new nation can never
silently go missing from the map. Nations with no ISO code (the refugee team,
neutral athletes) are listed beside the map only.
"""
import hashlib
import json
import math
import re
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "scripts" / ".map-cache"
OUT = ROOT / "public" / "geo" / "world-110m.v1.json"
SRC = ("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/"
       "v5.1.2/geojson/ne_110m_admin_0_countries.geojson")
SHA256 = None  # set from the first download, then pinned below
PINNED = Path(__file__).with_suffix(".sha256")

WIDTH = 1000

# Small nations with no polygon at 1:110m: (longitude, latitude).
DOTS = {
    "ag": (-61.8, 17.07), "ad": (1.52, 42.51), "bh": (50.55, 26.07), "bb": (-59.54, 13.19),
    "cv": (-23.6, 15.1), "km": (43.87, -11.88), "dm": (-61.37, 15.41), "fm": (158.2, 6.9),
    "gd": (-61.68, 12.12), "gu": (144.79, 13.44), "hk": (114.17, 22.32), "kn": (-62.75, 17.33),
    "lc": (-60.98, 13.91), "li": (9.55, 47.16), "mv": (73.51, 4.18), "mt": (14.4, 35.9),
    "mh": (171.18, 7.13), "mu": (57.55, -20.35), "mc": (7.42, 43.74), "nr": (166.93, -0.52),
    "pw": (134.58, 7.51), "ws": (-172.1, -13.76), "sm": (12.46, 43.94), "st": (6.61, 0.19),
    "sc": (55.49, -4.68), "sg": (103.82, 1.35), "to": (-175.2, -21.18), "tv": (179.2, -8.52),
    "vc": (-61.2, 13.25), "ki": (-157.36, 1.87), "aw": (-69.97, 12.52), "bm": (-64.78, 32.3),
    "ky": (-81.25, 19.31), "vg": (-64.62, 18.42), "vi": (-64.9, 17.74), "as": (-170.7, -14.28),
    "ck": (-159.78, -21.24), "mo": (113.54, 22.2), "pr": (-66.5, 18.22), "tt": (-61.25, 10.69),
    "fo": (-6.91, 61.89), "gi": (-5.35, 36.14), "je": (-2.13, 49.21), "gg": (-2.58, 49.45),
}

A1, A2, A3, A4 = 1.340264, -0.081106, 0.000893, 0.003796
M = math.sqrt(3) / 2
X_MAX = 2 * math.sqrt(3) * math.pi / (3 * A1)  # the x of longitude 180 on the equator
T_MAX = math.asin(M * 1)  # the theta of latitude 90
Y_MAX = A4 * T_MAX ** 9 + A3 * T_MAX ** 7 + A2 * T_MAX ** 3 + A1 * T_MAX
SCALE = WIDTH / (2 * X_MAX)
HEIGHT = round(2 * Y_MAX * SCALE)


def project(lon, lat):
    """Equal Earth, into the 1000-wide box, y growing downward."""
    lam, phi = math.radians(lon), math.radians(lat)
    t = math.asin(M * math.sin(phi))
    x = 2 * math.sqrt(3) * lam * math.cos(t) / (3 * (9 * A4 * t ** 8 + 7 * A3 * t ** 6 + 3 * A2 * t ** 2 + A1))
    y = A4 * t ** 9 + A3 * t ** 7 + A2 * t ** 3 + A1 * t
    return (x + X_MAX) * SCALE, (Y_MAX - y) * SCALE


def ring_path(ring):
    """A closed ring as relative SVG path commands, at one decimal."""
    pts = [project(lon, lat) for lon, lat in ring]
    out, prev = [], None
    for x, y in pts:
        x, y = round(x, 1), round(y, 1)
        if prev is None:
            out.append(f"M{x:g} {y:g}")
        else:
            dx, dy = round(x - prev[0], 1), round(y - prev[1], 1)
            if dx == 0 and dy == 0:
                continue
            out.append(f"l{dx:g} {dy:g}")
        prev = (x, y)
    return "".join(out) + "z"


def geometry_path(geom):
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    return "".join(ring_path(ring) for poly in polys for ring in poly)


def load_geojson():
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / "ne_110m_admin_0_countries.geojson"
    if not path.exists():
        r = requests.get(SRC, timeout=120)
        r.raise_for_status()
        path.write_bytes(r.content)
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if PINNED.exists():
        if digest != PINNED.read_text().strip():
            sys.exit(f"The cached Natural Earth file does not match {PINNED.name}. Delete the cache and check the source.")
    else:
        PINNED.write_text(digest + "\n")
    return json.loads(path.read_text(encoding="utf-8"))


def ioc_to_iso2():
    text = (ROOT / "src" / "lib" / "flags.ts").read_text(encoding="utf-8")
    block = text[text.index("IOC_TO_ISO2"):]
    block = block[: block.index("};")]
    return dict(re.findall(r'^\s*"?([A-Z]{3})"?:\s*"([a-z]{2})"', block, re.M))


def main():
    data = load_geojson()
    shapes = {}
    for feat in data["features"]:
        props = feat["properties"]
        iso = (props.get("ISO_A2_EH") or props.get("ISO_A2") or "").lower()
        if not re.fullmatch(r"[a-z]{2}", iso) or iso == "aq":
            continue
        shapes[iso] = shapes.get(iso, "") + geometry_path(feat["geometry"])

    dots = {iso: [round(v, 1) for v in project(*lonlat)] for iso, lonlat in DOTS.items() if iso not in shapes}

    # Every covered nation must be drawable.
    mapping = ioc_to_iso2()
    covered = json.loads((ROOT / "public" / "data" / "countries.json").read_text(encoding="utf-8"))["countries"]
    missing, listed_only = [], []
    for c in covered:
        iso = mapping.get(c["code"])
        if not iso:
            listed_only.append(c["code"])
        elif iso not in shapes and iso not in dots:
            missing.append(f"{c['code']} ({iso})")
    if missing:
        sys.exit("No shape or dot for: " + ", ".join(missing) + ". Add them to DOTS.")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({"width": WIDTH, "height": HEIGHT, "shapes": shapes, "dots": dots}, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"{len(shapes)} shapes, {len(dots)} dots, {OUT.stat().st_size // 1024} KB -> {OUT.relative_to(ROOT)}")
    print(f"covered: {len(covered)} nations; listed only (no ISO code): {', '.join(listed_only) or 'none'}")


if __name__ == "__main__":
    main()
