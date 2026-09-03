r"""Regenerate the favicon set from the PodiumCall logo mark.

Run with the predictor's venv, which is where Pillow lives:
    C:\Users\rayen\athletics-predictor\venv\Scripts\python.exe scripts/make-favicons.py

The mark is the same 2-1-3 podium on a dark rounded square as public/favicon.svg
and src/components/dl/logo.tsx. It is drawn here directly (not rasterised from
the SVG) so it stays crisp at 16px, and emitted at the sizes Google, iOS and
Android actually look for, plus a multi-size .ico. Google caches favicons hard,
so a reliable, correctly-sized set is what makes it pick up the real logo when
it next re-crawls, instead of a stale default.
"""

import os

from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), "..", "public")

# Colours lifted straight from favicon.svg.
BG = (22, 9, 6)          # #160906  dark ground
TERRACOTTA = (187, 67, 22)   # #BB4316  bar 1
GOLD = (175, 109, 8)         # #AF6D08  bar 2 (tallest, the winner)
BRICK = (125, 43, 8)         # #7D2B08  bar 3
# The track arc is #BB4316 at 0.55 over the dark ground; pre-blended so it can
# be drawn solid without an extra alpha layer.
ARC = (113, 41, 15)

# Geometry in the SVG's 40-unit box: (x, y, w, h, radius, fill).
BARS = [
    (6, 14, 8.5, 14.5, 2, TERRACOTTA),
    (15.75, 8.5, 8.5, 20, 2, GOLD),
    (25.5, 17.5, 8.5, 11, 2, BRICK),
]


def render(size: int) -> Image.Image:
    """Draw the mark at `size`px, supersampled 8x then downscaled for edges."""
    ss = size * 8
    f = ss / 40.0
    img = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Dark rounded-square ground (rx = 9 in the 40-box).
    d.rounded_rectangle([0, 0, ss - 1, ss - 1], radius=9 * f, fill=BG)

    # The shallow track curve near the base: quadratic bezier M6,30 Q20,26.5 34,30.
    p0, p1, p2 = (6, 30), (20, 26.5), (34, 30)
    pts = []
    steps = 60
    for i in range(steps + 1):
        t = i / steps
        mt = 1 - t
        x = mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0]
        y = mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1]
        pts.append((x * f, y * f))
    d.line(pts, fill=ARC, width=max(1, round(1.5 * f)), joint="curve")

    # The three podium bars.
    for x, y, w, h, r, fill in BARS:
        d.rounded_rectangle([x * f, y * f, (x + w) * f, (y + h) * f], radius=r * f, fill=fill)

    return img.resize((size, size), Image.LANCZOS)


def main():
    os.makedirs(OUT, exist_ok=True)

    # PNGs at the sizes each platform looks for.
    for size in (16, 32, 48, 96, 192, 512):
        render(size).save(os.path.join(OUT, f"favicon-{size}.png"))
    # Apple touch icon is 180x180 and shown on a rounded tile already, so the
    # art fills the square.
    render(180).save(os.path.join(OUT, "apple-touch-icon.png"))

    # Multi-size .ico, the format Google and older browsers request by default.
    master = render(256)
    master.save(
        os.path.join(OUT, "favicon.ico"),
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )

    print("wrote favicon-{16,32,48,96,192,512}.png, apple-touch-icon.png, favicon.ico")


if __name__ == "__main__":
    main()
