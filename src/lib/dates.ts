import type { Lang } from "./i18n";

/** Dates and month names, in the reader's language.
 *
 * These do not come from the locale tables, because they are not copy: the API
 * sends them as data, already spelled in English. `athlete_analytics.py` builds
 * month names from its own `MONTHS` list and dates with `strftime("%d %b")`, so
 * a French reader was being shown "5 courses de 06 Jun à 23 Aug" and "est
 * tombée en Jun" -- French sentences with English words dropped into them.
 *
 * Fixed here rather than in the API on purpose. The month names are a closed
 * set of twelve, keyed and stable, which is the same reason `discName` in
 * dl-data.ts translates a discipline on its key rather than on its English
 * label. Changing the payload instead would mean re-running the scrape and
 * regenerating all 413 static JSON files for a display concern.
 *
 * `Intl` does the actual naming, so nothing here needs a translation table and
 * Arabic works the day its locale is added. */

/** The abbreviations the API sends. Order is the index, so this list IS the
 * lookup -- do not sort it. */
const EN_MONTH_ABBR = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

/** The BCP 47 tag for a UI language. Three routes inlined this exact ternary
 * before it lived anywhere; they now share it, so a fourth language is one
 * edit rather than a hunt. */
export const localeTag = (lang: Lang): string => (lang === "fr" ? "fr-FR" : "en-GB");

/** 0-11 from an English abbreviation, or null if it isn't one.
 *
 * Case-insensitive because the payload is not consistent: `seasonShape` carries
 * "Aug" and `history[].date` carries "28 APR 2026", from two different code
 * paths on the Python side. */
export const monthIndex = (abbr: string): number | null => {
  const i = EN_MONTH_ABBR.indexOf(abbr.trim().slice(0, 3).toLowerCase());
  return i === -1 ? null : i;
};

/** An English month abbreviation, named in `lang`.
 *
 * "short" for table cells and chart labels, "long" for prose -- "est tombée en
 * sept." reads like a form field, "est tombée en septembre" reads like French.
 * Any day of the month works as the anchor; the 15th avoids every timezone
 * edge that day 1 and day 28+ can produce.
 *
 * English returns the API's own string rather than a formatted one. It is
 * already English, so there is nothing to do -- and `Intl` disagrees with the
 * payload anyway ("Sept" against its "Sep"), which would have quietly changed
 * the English site while translating the French one. */
export const localizeMonth = (
  lang: Lang,
  abbr: string,
  style: "short" | "long" = "short",
): string => {
  if (lang === "en") return abbr;
  const idx = monthIndex(abbr);
  if (idx == null) return abbr;
  return new Intl.DateTimeFormat(localeTag(lang), { month: style }).format(
    new Date(Date.UTC(2001, idx, 15)),
  );
};

/** "28 Apr", "23 Aug 2026" and "28 APR 2026", with the month swapped for its
 * name in `lang` and everything else left exactly as it was.
 *
 * Deliberately not a parse-and-reformat: reordering the parts would mean
 * guessing at a shape the API has not promised. Anything this does not
 * recognise is returned untouched, which is the same thing `discName` and
 * `flagFile` do rather than invent a value. */
export const localizeDate = (lang: Lang, s: string | null | undefined): string => {
  if (!s) return s ?? "";
  if (lang === "en") return s;
  return s.replace(/\b([A-Za-z]{3})\b/, (whole) => {
    const named = localizeMonth(lang, whole, "short");
    return named === whole ? whole : named;
  });
};
