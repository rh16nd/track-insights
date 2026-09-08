r"""Generate src/lib/flag-palette.ts -- a whole page theme per nation.

Run with the predictor's venv (nothing here needs it, but it is the venv the
other scripts in this folder document):
    C:\Users\rayen\athletics-predictor\venv\Scripts\python.exe scripts/make-flag-palette.py

WHY THIS EXISTS
A country page used to look like every other page with a different name on it.
Dressing it in the nation's own colours is the obvious fix and the obvious
trap: half the world's flags are yellow, light blue or white, and a page in
Ukraine's gold or Botswana's sky with the site's white text on it is
unreadable. So each colour is CHOSEN and then CLAMPED, both by measurement.

  choose  the flag's largest area of colour, penalised by how far it would
          have to be darkened to be usable, and nudged toward chromatic
          colours so a black-red-green tricolour reads as red or green rather
          than as black.
  clamp   drop OKLCH lightness -- hue and chroma held, so Jamaica stays green
          and Japan stays crimson -- until every piece of text the site paints
          on that surface clears WCAG AA. Which text depends on the surface,
          so each colour below has its own test.

WHAT COMES OUT, PER NATION
  ground  the page's canvas, replacing the site's terracotta everywhere: the
          head band, the ground behind the panels, the footer. Built as the
          nation's hue at the site canvas's own chroma and lightness
          (oklch(0.52 0.105 h)) and then darkened until it carries the three
          things the site paints straight onto a canvas -- white/90 (footer),
          white/92 (the band's description) and --gold-on-canvas (breadcrumb
          and eyebrow). Starting from the site's own numbers is deliberate: a
          country page should read as this site in another colour, not as a
          different product.
  accent  the vivid flag colour, for rules and edges on the light panels,
          darkened only as far as being legible ON a panel requires.
  stripes the flag's colours untouched, for the hairline and the ambient
          blooms. Nothing here sits behind text.

WHAT THE MEASUREMENT COMPOSITES IN
Nothing on this site is ever painted bare, and measuring the bare colour is
how you ship a page that fails:
  * ambient-grain, a fixed full-page noise overlay, lifts the canvas. Its
    strength here is calibrated against the note in styles.css, which records
    the old 0.54 canvas compositing to (163,94,70).
  * the head band's own warm radial wash, oklch(0.8 0.11 68 / 0.18).
  * the two national blooms this file emits, at their peak alpha.

Input is scripts/flag-pixels.txt (measured areas, see its header). Output is a
generated TypeScript module -- do not edit that by hand, edit this and re-run.
"""

import math
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "flag-pixels.txt")
OUT = os.path.join(HERE, "..", "src", "lib", "flag-palette.ts")

AA = 4.5

# --- what the site paints on a canvas, straight out of styles.css -----------
# The head band's description is white at 92%, the footer is white at 90%, and
# the breadcrumb leaf and eyebrow are --gold-on-canvas. All three have to clear
# AA on whatever colour the page is wearing.
CANVAS_TEXT_ALPHAS = (0.92, 0.90)
GOLD_ON_CANVAS = (0.98, 0.08, 68.0)

# The site's own canvas, oklch(0.52 0.105 40). A national ground starts here
# and only ever gets darker, so no country page is brighter or louder than the
# site it belongs to.
CANVAS_L, CANVAS_C = 0.52, 0.105

# shell.tsx lays this warm radial over every head band. It LIGHTENS the ground,
# so it eats into every ratio above.
BAND_WASH = (0.8, 0.11, 68.0)
BAND_WASH_ALPHA = 0.18

# ambient-grain, the fixed full-page noise tile. Calibrated, not guessed: the
# note in styles.css records the old 0.54 canvas compositing to (163,94,70),
# which is a white lift of this much.
GRAIN_ALPHA = 0.034

# The two national blooms (see FLAG_PALETTE.glow). Peak alpha of each, so the
# ground is clamped against the brightest point of the page rather than the
# average one. Kept near the site's own ambient-glow (0.07/0.08): a bloom
# strong enough to matter is also strong enough to force the ground several
# steps darker to pay for it, and the nations that lost most were the ones
# whose flags are half white.
GLOW_ALPHAS = (0.10, 0.09)

# --card, the panel colour. `accent` has to be legible against it, since it
# also serves as a text colour on panels.
CARD = (0.97, 0.012, 75.0)

# The head band is a DARKER version of the page's ground, and that is what buys
# the flag its place. The page ground sits exactly at the 4.5:1 floor, so it has
# no headroom at all -- laying a flag over it at any visible strength breaks the
# text. Dropping the band to this lightness creates the headroom, and then
# `flagAlpha` below spends as much of it as it can on showing the flag.
#
# There is precedent in the site for a heavier band: the athlete page's
# headTone="brick" is exactly this move, "a darker, heavier band that signals a
# different KIND of page".
#
# 0.18 rather than something closer to the ground, because the whole point is
# how much flag survives. Measured across all 136 nations, the median share of
# the flag that stays legible is 22% at L=0.30, 29% at 0.22 and 31% at 0.18 --
# and at 0.30 twenty-one nations came out under 15%, which is a smudge rather
# than a flag. The band ends up dark and richly tinted, and the flag laid over
# it supplies most of the colour anyway.
BAND_L = 0.18

# ...and the band is nearly NEUTRAL, not a saturated version of the nation's
# hue. This was the bug the user found: the band was being built from the
# flag's dominant colour and the flag was then laid over it, so the dominant
# colour cancelled itself out. Germany, Norway and Japan all resolved to the
# same band, #330000, because all three flags are dominantly red -- and each
# then had to show red on red. Germany lost two of its three stripes (black on
# near-black, red on dark red) and read as an empty header.
#
# A hint of the nation's hue is kept so the band is not a flat grey, but the
# COLOUR on a country page comes from the flag, which is the thing that
# actually identifies it.
BAND_C = 0.03

# How much of the flag may show, at most. Past this the band stops reading as a
# themed header and starts reading as text typed on a flag, which is a different
# and much worse thing.
FLAG_ALPHA_MAX = 0.55
# ...and a floor, below which the flag is not worth showing at all. A nation
# under it keeps a plain band rather than a smudge.
FLAG_ALPHA_MIN = 0.12


# --- sRGB <-> OKLCH ---------------------------------------------------------
def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def rgb_to_hex(rgb):
    return "#" + "".join(f"{round(max(0.0, min(1.0, c)) * 255):02x}" for c in rgb)


def _lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _gam(c):
    c = max(0.0, min(1.0, c))
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


def rgb_to_oklab(rgb):
    r, g, b = (_lin(c) for c in rgb)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = l ** (1 / 3) if l > 0 else 0, m ** (1 / 3) if m > 0 else 0, s ** (1 / 3) if s > 0 else 0
    return (
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
    )


def oklab_to_rgb(lab):
    L, a, b = lab
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    return (
        _gam(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        _gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        _gam(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
    )


def oklch_to_rgb(L, C, h):
    r = math.radians(h)
    return oklab_to_rgb((L, C * math.cos(r), C * math.sin(r)))


def rgb_to_oklch(rgb):
    L, a, b = rgb_to_oklab(rgb)
    return L, (a * a + b * b) ** 0.5, math.degrees(math.atan2(b, a)) % 360


def luminance(rgb):
    r, g, b = (_lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def over(top, alpha, bottom):
    """`top` painted at `alpha` over `bottom`."""
    return tuple(alpha * t + (1 - alpha) * b for t, b in zip(top, bottom))


def white_at(alpha, bg):
    """`text-white/<alpha>` as it is actually painted: white is translucent, so
    the colour underneath is part of the text colour too."""
    return over((1.0, 1.0, 1.0), alpha, bg)


# --- the two surfaces, measured as painted ----------------------------------
def as_canvas(ground, glows):
    """The ground as the eye receives it at its brightest: national blooms,
    then the site's grain tile. The brightest point is the one that has to
    pass, not the average."""
    lit = ground
    for c, a in zip(glows, GLOW_ALPHAS):
        lit = over(c, a, lit)
    return over((1.0, 1.0, 1.0), GRAIN_ALPHA, lit)


def as_band(ground, glows):
    """The same ground inside the head band, which adds the warm wash."""
    return over(oklch_to_rgb(*BAND_WASH), BAND_WASH_ALPHA, as_canvas(ground, glows))


def canvas_ratio(ground, glows):
    """The WORST of everything the site paints straight onto a canvas, on the
    worst-lit part of the page. One number, so the clamp has one job."""
    gold = oklch_to_rgb(*GOLD_ON_CANVAS)
    worst = 99.0
    for surface in (as_canvas(ground, glows), as_band(ground, glows)):
        worst = min(worst, contrast(gold, surface))
        for a in CANVAS_TEXT_ALPHAS:
            worst = min(worst, contrast(white_at(a, surface), surface))
    return worst


def clamp_ground(hue, chroma, glows):
    """Darken the nation's canvas until every canvas-backed text token clears
    AA on it. Starts at the site's own canvas lightness and never goes above
    it."""
    L = CANVAS_L
    while L > 0.08:
        ground = oklch_to_rgb(L, chroma, hue)
        ratio = canvas_ratio(ground, glows)
        if ratio >= AA:
            return ground, ratio, round(CANVAS_L - L, 2)
        L -= 0.01
    ground = oklch_to_rgb(0.08, chroma, hue)
    return ground, canvas_ratio(ground, glows), round(CANVAS_L - 0.08, 2)


def band_ratio(band, glows, brightest, alpha):
    """The band's worst text ratio with the flag showing through it at `alpha`.

    `brightest` is the flag's single lightest pixel, so this is the worst point
    of the worst stripe rather than the flag's average -- a headline that
    happens to fall across the white bar of a tricolour has to be as readable
    as one that does not."""
    lit = over(brightest, alpha, band)
    for c, a in zip(glows, GLOW_ALPHAS):
        lit = over(c, a, lit)
    lit = over((1.0, 1.0, 1.0), GRAIN_ALPHA, lit)
    lit = over(oklch_to_rgb(*BAND_WASH), BAND_WASH_ALPHA, lit)
    gold = oklch_to_rgb(*GOLD_ON_CANVAS)
    worst = contrast(gold, lit)
    for a in CANVAS_TEXT_ALPHAS:
        worst = min(worst, contrast(white_at(a, lit), lit))
    return worst


def solve_flag_alpha(band, glows, brightest):
    """The most of the flag that can show and still leave every word on the
    band readable. Walked in 1% steps from the cap downwards, so the answer is
    the largest one that passes rather than a round number someone picked."""
    alpha = FLAG_ALPHA_MAX
    while alpha >= FLAG_ALPHA_MIN:
        if band_ratio(band, glows, brightest, alpha) >= AA:
            return round(alpha, 2), band_ratio(band, glows, brightest, alpha)
        alpha -= 0.01
    return 0.0, band_ratio(band, glows, brightest, 0.0)


def clamp_accent(rgb):
    """Darken a flag colour until it is legible as text on a panel. Panels are
    near-white, so this is the same operation as making white legible on the
    colour, and it leaves the accent safe for both."""
    card = oklch_to_rgb(*CARD)
    L, C, h = rgb_to_oklch(rgb)
    while L > 0.05:
        out = oklch_to_rgb(L, C, h)
        if contrast(out, card) >= AA:
            return out, contrast(out, card)
        L -= 0.01
    out = oklch_to_rgb(0.05, C, h)
    return out, contrast(out, card)


def read_table():
    """-> {iso2: (entries, brightest)}. `entries` is (hex, area percent) largest
    first; `brightest` is the flag's lightest pixel, or white when the line
    predates that column, which is the safe assumption."""
    flags = {}
    for line in open(SRC, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        code, *rest = line.split()
        entries = [
            (m.group(1), int(m.group(2)))
            for m in (re.match(r"^(#[0-9a-f]{6}):(\d+)$", chunk) for chunk in rest)
            if m
        ]
        brightest = next(
            (c[len("max:"):] for c in rest if c.startswith("max:#")), "#ffffff"
        )
        edges = next((c[len("edges:"):] for c in rest if c.startswith("edges:")), None)
        edges = tuple(float(x) for x in edges.split("/")) if edges else (1.0, 0.0, 0.0)
        centre = next((int(c[len("centre:"):]) for c in rest if c.startswith("centre:")), 0)
        if entries:
            flags[code] = (entries, brightest, edges, centre)
    return flags


def classify_motif(edges, centre):
    """What SHAPE this flag is, from its edge orientations.

    The page then wears that shape as a faint texture, so two nations with
    similar colours still read as different places -- Germany's page is ruled
    horizontally like its flag, France's vertically, Jamaica's diagonally,
    Norway's in a cross, Japan's in rings.

    Derived from the flag rather than chosen for the country on purpose. A
    hand-picked "traditional" motif per nation would be a guess about someone
    else's culture, and a wrong one is worse than none -- the same reason
    flags.ts refuses to guess a flag from a country code. This can only ever
    be a description of the flag that is already on the page.

    Thresholds tuned against flags whose construction is not in doubt, and
    every rule earns its place:
      cross    both directions strong and no diagonals at all. That is the
               Nordic signature (Norway 0.58/0.41/0.01) and nothing else
               produces it; Switzerland and Georgia land here too.
      emblem   a device on a plain field: the middle far from the outer ring
               AND no strong direction. The second half matters -- France's
               centre reads 250 purely because a tricolour's middle stripe is
               not its edges, and without it France would be "emblem".
      diagonal at 0.45 rather than 0.42, which is what moves Ethiopia (0.434)
               back to horizontal, where its stripes actually are, and
               Portugal (0.431) back to vertical.
    """
    h, v, d = edges
    lo, hi = min(h, v), max(h, v)
    if d < 0.10 and hi > 0 and lo / hi > 0.5:
        return "cross"
    if centre > 200 and hi < 0.5:
        return "emblem"
    if d >= 0.45:
        return "diagonal"
    return "horizontal" if h > v else "vertical"


def choose_source(entries):
    """Pick the colour the nation's page is built from.

    Area first, docked for the darkening the colour would need (a yellow that
    has to become olive has lost the argument) and topped up for chroma, which
    is what stops a black-red-green tricolour from always resolving to black.
    A near-white or near-grey colour is skipped outright: darkened it is just
    grey, which is no nation's colour."""
    best, best_score = None, -1.0
    for hexv, share in entries:
        rgb = hex_to_rgb(hexv)
        _, C, h = rgb_to_oklch(rgb)
        if C < 0.04:
            continue
        _, _, moved = clamp_ground(h, min(C, CANVAS_C), (rgb, rgb))
        score = share / 100 * (1 - 1.5 * moved) + 0.30 * min(C / 0.18, 1.0)
        if score > best_score:
            best, best_score = hexv, score
    return best


if __name__ == "__main__":
    flags = read_table()
    rows = {}
    for code, (entries, brightest_hex, edges, centre) in sorted(flags.items()):
        source = choose_source(entries)
        if source is None:
            # Every colour on this flag is white, black or grey. There is no
            # national hue to wear, and inventing one would be worse than the
            # site's own ground -- which is what the page falls back to.
            continue
        src_rgb = hex_to_rgb(source)
        _, src_c, src_h = rgb_to_oklch(src_rgb)

        stripes = [h for h, _ in entries][:3]
        # The blooms are the flag's OTHER colours where it has them, so the
        # ambient light on the page is the nation's too, not just a lighter
        # wash of the ground. White is excluded on purpose: a white bloom is
        # not a colour anyone reads as national, and it costs the ground
        # several steps of darkening to stay legible under it -- which is what
        # turned Japan's page near-black on the first pass.
        glow_hex = [
            h for h in stripes
            if h != source and rgb_to_oklch(hex_to_rgb(h))[1] >= 0.04
        ] or [source]
        glows = [hex_to_rgb(glow_hex[0]), hex_to_rgb(glow_hex[min(1, len(glow_hex) - 1)])]

        ground, ratio, moved = clamp_ground(src_h, min(src_c, CANVAS_C), glows)
        accent, accent_ratio = clamp_accent(src_rgb)
        # The band: the same hue, dropped to a fixed darker lightness, and then
        # asked how much flag it can afford to show.
        band = oklch_to_rgb(BAND_L, min(src_c, BAND_C), src_h)
        flag_alpha, band_r = solve_flag_alpha(band, glows, hex_to_rgb(brightest_hex))
        rows[code] = {
            "motif": classify_motif(edges, centre),
            "ground": rgb_to_hex(ground),
            "band": rgb_to_hex(band),
            "flagAlpha": flag_alpha,
            "accent": rgb_to_hex(accent),
            "stripes": stripes,
            "glow": [rgb_to_hex(g) for g in glows],
            "source": source,
            "brightest": brightest_hex,
            "ratio": round(ratio, 2),
            "bandRatio": round(band_r, 2),
            "accentRatio": round(accent_ratio, 2),
            "moved": moved,
        }

    # The point of the whole exercise, so it is an assertion rather than a
    # number to read past: no nation ships a page its own text cannot be read
    # on. A future edit to the scoring that reintroduces one fails here instead
    # of on someone's screen.
    bad = {
        c: r
        for c, r in rows.items()
        if r["ratio"] < AA or r["accentRatio"] < AA or r["bandRatio"] < AA
    }
    assert not bad, f"below {AA}:1 -- {bad}"

    lines = [
        "/** Each nation's own page theme, measured off its flag.",
        " *",
        " * GENERATED by scripts/make-flag-palette.py from scripts/flag-pixels.txt.",
        " * Do not edit by hand: edit the script and re-run it.",
        " *",
        " * `ground` replaces the site's terracotta canvas for the whole country",
        " * page -- band, body and footer. It is the nation's hue at the site",
        " * canvas's own chroma, darkened until every text token the site paints",
        " * straight onto a canvas (white/90, white/92 and --gold-on-canvas) clears",
        " * WCAG AA, measured with the grain tile, the band's warm wash and the two",
        " * blooms below all composited on. The ratio on each line is that",
        " * measurement at the page's brightest point, not an estimate.",
        " *",
        " * `band` is the head band, deliberately darker than the ground: the whole",
        " * flag is laid across it at `flagAlpha`, and a ground already sitting at",
        " * the 4.5:1 floor has no room to give. `flagAlpha` is then the MOST of the",
        " * flag that fits, walked down in 1% steps from a 55% cap until the band's",
        " * text clears AA against the flag's single brightest pixel -- the worst",
        " * point of the worst stripe, not the flag's average.",
        " *",
        " * `motif` is the SHAPE of the flag rather than its colour -- horizontal,",
        " * vertical, diagonal, cross or emblem, read off where the flag's edges",
        " * point. The page wears it as a faint ruling, so two nations with similar",
        " * colours still read as different places. Derived, never chosen: a",
        " * hand-picked national motif would be a guess about someone else's",
        " * culture, and this can only ever describe the flag already on the page.",
        " *",
        " * `accent` is the same flag colour left vivid, darkened only as far as",
        " * being readable ON a panel needs; `stripes` and `glow` are the flag's",
        " * colours untouched, since nothing is painted on top of them.",
        " *",
        " * Only lightness ever moves, so the hue that makes a colour recognisable",
        " * survives every clamp. */",
        "export type FlagPalette = {",
        "  /** How the flag is built, for the page's own ruling. */",
        '  motif: "horizontal" | "vertical" | "diagonal" | "cross" | "emblem";',
        "  /** Page canvas, already AA-safe under everything the site paints on one. */",
        "  ground: string;",
        "  /** Head band, darker than the ground to make room for the flag. */",
        "  band: string;",
        "  /** How much of the flag the band can show, 0-1. */",
        "  flagAlpha: number;",
        "  /** Vivid flag colour for rules and edges on the light panels. */",
        "  accent: string;",
        "  /** Up to three flag colours, largest area first, unclamped. */",
        "  stripes: string[];",
        "  /** Two flag colours for the page's ambient blooms, unclamped. */",
        "  glow: string[];",
        "};",
        "",
        "/** Keyed by ISO 3166-1 alpha-2, the code the flag SVG is named by. Use",
        " * `countryPalette()` in ./flags to reach one from a nation's IOC code. */",
        "export const FLAG_PALETTE: Record<string, FlagPalette> = {",
    ]
    # Emitted in the exact shape prettier would reformat it into, so that
    # regenerating this file never turns up as a wall of lint.
    for code, r in rows.items():
        stripes = ", ".join('"%s"' % h for h in r["stripes"])
        glow = ", ".join('"%s"' % h for h in r["glow"])
        lines += [
            "  // %s: ground %s:1, band %s:1 with %d%% of the flag showing"
            " (brightest pixel %s), accent %s:1"
            % (
                r["source"], r["ratio"], r["bandRatio"],
                round(r["flagAlpha"] * 100), r["brightest"], r["accentRatio"],
            ),
            "  %s: {" % code,
            '    motif: "%s",' % r["motif"],
            '    ground: "%s",' % r["ground"],
            '    band: "%s",' % r["band"],
            "    flagAlpha: %s," % r["flagAlpha"],
            '    accent: "%s",' % r["accent"],
            "    stripes: [%s]," % stripes,
            "    glow: [%s]," % glow,
            "  },",
        ]
    lines.append("};")
    lines.append("")
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))

    worst = min(rows.values(), key=lambda r: r["ratio"])
    moved = max(rows.values(), key=lambda r: r["moved"])
    alphas = sorted(r["flagAlpha"] for r in rows.values())
    motifs = {}
    for r in rows.values():
        motifs[r["motif"]] = motifs.get(r["motif"], 0) + 1
    print("  %d nations -> %s" % (len(rows), os.path.abspath(OUT)))
    print("  worst canvas contrast %s:1 (floor %s), from %s" % (worst["ratio"], AA, worst["source"]))
    print("  motifs: " + ", ".join(f"{k} {v}" for k, v in sorted(motifs.items())))
    print(
        "  flag showing through the band: %d%%-%d%% (median %d%%)"
        % (alphas[0] * 100, alphas[-1] * 100, alphas[len(alphas) // 2] * 100)
    )
    print(
        "  most darkened %s -> %s (L-%s from the site's %s)"
        % (moved["source"], moved["ground"], moved["moved"], CANVAS_L)
    )
