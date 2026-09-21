"""Contrast of each header text line against the background behind it.

Reads measure/boxes-<session>.json (text boxes and computed colours) and the
matching measure/<page>-<width>-bg.png (the header with its text hidden), and
reports, for each line, the ratio against the 98th-percentile-lightest
background pixel under it (the worst case, minus stray single pixels)."""
import json
import math
import re
import sys

from PIL import Image


def srgb_from_oklab(L, a, b):
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    f = lambda x: 12.92 * x if x <= 0.0031308 else 1.055 * max(x, 0) ** (1 / 2.4) - 0.055
    return tuple(max(0.0, min(1.0, f(c))) * 255 for c in (r, g, bb))


def parse(color):
    nums = [float(x) for x in re.findall(r"-?[\d.]+(?:e-?\d+)?", color)]
    alpha = 1.0
    if "/" in color:
        alpha = nums[-1]
        nums = nums[:-1]
    if color.startswith("oklab"):
        rgb = srgb_from_oklab(*nums[:3])
    elif color.startswith("oklch"):
        L, C, h = nums[:3]
        rgb = srgb_from_oklab(L, C * math.cos(math.radians(h)), C * math.sin(math.radians(h)))
    else:
        rgb = tuple(nums[:3])
        if len(nums) == 4:
            alpha = nums[3]
    return rgb, alpha


def lum(c):
    ch = lambda v: (v / 255) / 12.92 if v / 255 <= 0.03928 else (((v / 255) + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


def main(session, width, dpr):
    raw = open(f"measure/boxes-{session}.json", encoding="utf-8").read().strip()
    data = json.loads(json.loads(raw) if raw.startswith('"') else raw)
    worst_all = []
    for page, rows in data.items():
        im = Image.open(f"measure/{page}-{width}-bg.png").convert("RGB")
        worst = None
        for r in rows:
            fg, alpha = parse(r["color"])
            if alpha == 0:
                continue
            x0, y0 = int(r["x"] * dpr), int(r["y"] * dpr)
            x1, y1 = int((r["x"] + r["w"]) * dpr), int((r["y"] + r["h"]) * dpr)
            px = [im.getpixel((x, y)) for y in range(max(0, y0), min(im.height, y1), 2)
                  for x in range(max(0, x0), min(im.width, x1), 2)]
            if not px:
                continue
            px.sort(key=lum)
            bg = px[int(len(px) * 0.98) - 1] if len(px) > 50 else px[-1]
            text = tuple(alpha * f + (1 - alpha) * b for f, b in zip(fg, bg))
            cr = ratio(text, bg)
            if worst is None or cr < worst[0]:
                worst = (cr, r["text"], r["size"], bg)
            if cr < 4.5:
                print(f"  LOW {page}: {cr:.2f} '{r['text']}' {r['size']} on {tuple(int(v) for v in bg)}")
        print(f"{page} @{width}: worst {worst[0]:.2f} ('{worst[1]}', {worst[2]})")
        worst_all.append(worst[0])
    return min(worst_all)


if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]), float(sys.argv[3]))
