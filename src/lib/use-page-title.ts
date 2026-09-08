import { useEffect } from "react";
import { SUFFIX } from "./seo";

/** The browser-tab title, in the reader's language.
 *
 * `head()` cannot do this. It runs before the route's data loads and outside
 * `I18nProvider`, so it has no way to reach the language -- which is why all
 * twelve routes hardcode an English title in `pageHead`. A French reader was
 * reading a French page in a tab that said "Men's 100m · PodiumCall".
 *
 * So the SSR title stays exactly as it was, and this rewrites it on the client
 * once the language is known. Crawlers and link unfurlers read the SSR output
 * and never run this effect, which is the right split: the tab is for the
 * reader, the meta tags are for the machines.
 *
 * Only `document.title` is touched, deliberately. Rewriting the meta
 * description or the og: tags here would be dead code for exactly the same
 * reason -- nothing that reads them ever runs an effect.
 *
 * Pass a title that is already translated; the caller has `t` and, for the
 * dynamic routes, the params to build "Name — Discipline" from. The suffix
 * comes from `seo.ts` rather than a second literal, so the two cannot drift. */
export function usePageTitle(title: string): void {
  useEffect(() => {
    if (title) document.title = `${title} · ${SUFFIX}`;
  }, [title]);
}
