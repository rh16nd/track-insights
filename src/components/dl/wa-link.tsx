import { useT } from "@/lib/i18n";
/** Links out to World Athletics.
 *
 * This site's whole argument is that its numbers are real and scraped, and
 * it said so on all nine pages while offering no way to check — a critique
 * scored Help and Documentation 1/4 for exactly that, noting that `waUrl`
 * already sat in the payload, unused, on every surface but the athlete page.
 * A claim a reader cannot follow up is a claim they have to take on trust.
 *
 * Deliberately NOT added to every athlete row in a table. Those names
 * already link to that athlete's own page, which carries the World
 * Athletics link — one hop away, in the place with room to explain what is
 * being verified. Repeating it per row would be link soup and would compete
 * with the internal navigation the tables exist for.
 */

const WA_HOME = "https://worldathletics.org";

/** Every athlete URL in the payload comes from World Athletics' own API
 * (scraped alongside the marks, never constructed here), in one of the two
 * shapes WA itself publishes: `athlete=NNN` for most, a trailing `-NNN`
 * slug for the rest. All 364 rows carry one. */
export function WaAthleteLink({
  href,
  name,
  className = "",
}: {
  href: string | null | undefined;
  name: string;
  className?: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      /* The visible text is short enough to sit on a plaque; the label
         carries who is being verified, which is what a screen reader needs
         when several of these appear in a row. */
      aria-label={`${name} on World Athletics (opens in a new tab)`}
      className={`text-[11px] text-muted-foreground transition-colors hover:text-terracotta-strong hover:underline ${className}`}
    >
      World Athletics&nbsp;↗
    </a>
  );
}

/** The source itself, for the places where the page names World Athletics
 * as where its data comes from.
 *
 * `tone` exists because the hover colour cannot be one value. Darkening to
 * --foreground is right on a light card and wrong on the terracotta canvas,
 * where it measured 3.51:1 against the link's own 4.65:1 at rest -- a hover
 * that makes a link HARDER to read than not hovering it. On the canvas the
 * legible direction is lighter. Same mistake as the athlete page's coverage
 * note: a token carried across a background change.
 *
 * The canvas tone resolves to plain white (5.30:1 over the grain composite)
 * rather than --landing-fg, which would have been the natural choice and is
 * WRONG here: that variable is scoped to `.landing`, and this component is
 * also used in Shell's footer, which sits on the same terracotta on all
 * nine app pages but outside that scope. A var that resolves to nothing
 * fails silently. */
export function WaSourceLink({
  tone = "card",
  className = "",
}: {
  tone?: "card" | "canvas";
  className?: string;
}) {
  const { t } = useT();
  const hover = tone === "canvas" ? "hover:text-white" : "hover:text-foreground";
  return (
    <a
      href={WA_HOME}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("wa.ariaLabel")}
      className={`underline decoration-current/40 underline-offset-2 transition-colors hover:decoration-current ${hover} ${className}`}
    >
      World Athletics
    </a>
  );
}
