r"""Regenerate public/og.png, the social share card.

Run with the predictor's venv, which is where Pillow lives:
    C:\Users\rayen\athletics-predictor\venv\Scripts\python.exe scripts/make-og.py

Drawn from the app's own tokens and lane motif rather than a stock graphic,
so the card and the site are visibly the same surface. Colours are converted
from the real OKLCH values instead of being eyeballed into hex -- the same
reason scratchpad/oklch2rgb.js existed for the Figma pass.
"""

import math
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
FONT_DIR = "C:/Windows/Fonts"


def oklch(lightness, chroma, hue_deg):
    """OKLCH -> sRGB, so the card can quote the app's tokens verbatim."""
    h = math.radians(hue_deg)
    a, b = chroma * math.cos(h), chroma * math.sin(h)
    l_ = lightness + 0.3963377774 * a + 0.2158037573 * b
    m_ = lightness - 0.1055613458 * a - 0.0638541728 * b
    s_ = lightness - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_**3, m_**3, s_**3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

    def enc(x):
        x = max(0.0, min(1.0, x))
        x = 12.92 * x if x <= 0.0031308 else 1.055 * (x ** (1 / 2.4)) - 0.055
        return int(round(max(0, min(1, x)) * 255))

    return (enc(r), enc(g), enc(bb))


BG = oklch(0.54, 0.105, 40)      # --background
BRICK = oklch(0.406, 0.121, 40)  # --brick
CREAM = oklch(0.97, 0.012, 75)   # --card
GOLD = oklch(0.8, 0.11, 68)      # --gold-light


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


def build():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img, "RGBA")

    # Lanes on the same 104px period the site uses (see .lanes in styles.css).
    y = -40
    while y < H + 104:
        d.rectangle([0, y, W, y + 2], fill=CREAM + (30,))
        y += 104

    # The gold sweep, matching .lanes::after.
    for i in range(340):
        d.rectangle([200 + i, 0, 201 + i, H], fill=GOLD + (int(22 * math.sin(math.pi * i / 340)),))

    # Scrim strongest on the left, which is where the text sits.
    for i in range(W):
        d.rectangle([i, 0, i + 1, H], fill=BRICK + (int(215 * max(0.0, 1 - (i / 760)) ** 1.25),))

    # The logo mark: three rising bars, the shape PodiumCallMark draws.
    bx, by, bw = 84, 150, 20
    for i, (height, colour) in enumerate(
        [(30, CREAM + (200,)), (52, GOLD + (255,)), (41, CREAM + (200,))]
    ):
        x = bx + i * (bw + 8)
        d.rounded_rectangle([x, by - height, x + bw, by], radius=5, fill=colour)
    d.text((bx + 3 * (bw + 8) + 14, by - 40), "PODIUMCALL", font=font("segoeuib.ttf", 30),
           fill=CREAM + (255,))

    bold, semi, small = font("segoeuib.ttf", 76), font("seguisb.ttf", 30), font("seguisb.ttf", 23)
    d.text((84, 232), "We make the call", font=bold, fill=CREAM + (255,))
    d.text((84, 316), "before the gun.", font=bold, fill=GOLD + (255,))
    d.text((84, 428), "Real-data podium predictions for all 32 disciplines", font=semi,
           fill=CREAM + (225,))
    d.text((84, 466), "at the 2026 Diamond League Final, Brussels.", font=semi, fill=CREAM + (225,))
    d.text((84, 540), "Scraped from World Athletics  ·  walk-forward validated", font=small,
           fill=GOLD + (220,))

    out = os.path.join(os.path.dirname(__file__), "..", "public", "og.png")
    img.save(out, "PNG", optimize=True)
    print(f"wrote {os.path.abspath(out)} ({os.path.getsize(out)} bytes)")


if __name__ == "__main__":
    build()
