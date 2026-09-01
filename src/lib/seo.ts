/** Per-page titles and descriptions.
 *
 * Every route served the same <title> until now — "PodiumCall — 2026 Diamond
 * League Predictions" — which means ~270 real pages (32 disciplines, ~237
 * athletes, plus the fixed routes) were indistinguishable in a search result,
 * a browser tab, or a shared link.
 *
 * `head()` runs before the route's data loads, so a title cannot wait for the
 * API. Anything dynamic here is derived from the URL params instead. */

const EVENT_NAME: Record<string, string> = {
  "100m": "100m",
  "200m": "200m",
  "400m": "400m",
  "800m": "800m",
  "1500m": "1500m",
  "5000m": "5000m",
  "110h": "110m Hurdles",
  "100h": "100m Hurdles",
  "400h": "400m Hurdles",
  "3000sc": "3000m Steeplechase",
  HJ: "High Jump",
  PV: "Pole Vault",
  LJ: "Long Jump",
  TJ: "Triple Jump",
  SP: "Shot Put",
  DT: "Discus Throw",
  JT: "Javelin Throw",
};

/** "men_100m" -> "Men's 100m". Derived from the key rather than duplicating
 * api.py's DISC_LABELS: a second hand-maintained list of 32 labels is a
 * second thing to keep in sync, and this maps the 17 event codes instead.
 * Verified to reproduce all 32 of the API's own labels exactly. Falls back to
 * the raw key rather than inventing a name for one it doesn't recognise. */
export function disciplineLabel(discKey: string): string {
  const [sex, ...rest] = discKey.split("_");
  const event = rest.join("_");
  const name = EVENT_NAME[event];
  if (!name || (sex !== "men" && sex !== "women")) return discKey;
  return `${sex === "men" ? "Men's" : "Women's"} ${name}`;
}

const SUFFIX = "PodiumCall";

/** One place that builds the tags, so title and og:title cannot drift apart
 * — the failure mode where a page looks right in a tab and wrong when
 * shared. */
export function pageHead(title: string, description: string) {
  const full = `${title} · ${SUFFIX}`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
    ],
  };
}

/* -- Structured data (JSON-LD) -------------------------------------------
 *
 * The site had none - only Open Graph and Twitter cards, which describe how
 * a link previews, not what the page IS. A launch checklist asked for "local
 * schema"; LocalBusiness does not apply to a prediction site with no
 * premises, so what is emitted is what these pages actually are: a WebSite,
 * and a BreadcrumbList per page.
 *
 * Most useful schema.org properties are URLs, and this project has no domain
 * yet - the same blocker that stops sitemap.xml and canonical tags (see
 * scripts/make-sitemap.py, which refuses to run without PODIUMCALL_BASE_URL).
 * Rather than invent an origin or emit relative URLs that consumers reject,
 * the URL-dependent parts are omitted until VITE_SITE_URL is set and appear
 * on their own once it is. An incomplete but valid graph beats a complete
 * invalid one. */
const RAW_SITE = import.meta.env["VITE_SITE_URL"] ?? "";

/** Absolute origin for this deployment, or "" when unknown. */
export const SITE_URL = RAW_SITE.replace(/\/+$/, "");

export const HAS_SITE_URL = SITE_URL.length > 0;

/** Absolute URL for a site-relative path, or undefined when the origin is
 * unknown - undefined so callers can leave the key in place and let
 * JSON.stringify drop it. */
export function absoluteUrl(path: string): string | undefined {
  if (!HAS_SITE_URL) return undefined;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type JsonLdGraph = Record<string, unknown>;

/** The site itself. Safe to emit with no domain: name, description and
 * language are true wherever it is served. */
export function websiteSchema(): JsonLdGraph {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SUFFIX,
    description:
      "Real-data podium predictions for the 2026 Wanda Diamond League Final, trained on results scraped from World Athletics.",
    inLanguage: "en",
    url: absoluteUrl("/"),
  };
}

/** One breadcrumb trail. Returns null without a domain: every element except
 * the last needs an `item` URL, so a trail of bare names is rejected - worse
 * than emitting nothing. */
export function breadcrumbSchema(trail: { name: string; path: string }[]): JsonLdGraph | null {
  if (!HAS_SITE_URL || trail.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      // The last crumb is the page you are on, and takes no item.
      item: i === trail.length - 1 ? undefined : absoluteUrl(step.path),
    })),
  };
}
