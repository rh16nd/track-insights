import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

/** "← Back" for the head band.
 *
 * Goes back through history when there IS a history to go back through, and
 * falls back to a named destination when the page was opened cold — from a
 * shared link, a bookmark, or a search result. A back control that does
 * nothing on a first page load is worse than none, because it looks like the
 * page is broken rather than like there is nowhere to go.
 *
 * Extracted from the athlete page, which had this logic inline with the label
 * hardcoded as English — so a French reader got "← Back" on every athlete. */
export function BackButton({
  fallbackTo,
  fallbackLabel,
}: {
  /** Where to go when there is no history: a route path. */
  fallbackTo: string;
  /** What to call that destination, already translated. */
  fallbackLabel: string;
}) {
  const { t } = useT();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const className =
    "label-caps -m-2 inline-block p-2 text-white/80 transition-colors hover:text-white";

  if (canGoBack) {
    return (
      <button type="button" onClick={() => router.history.back()} className={className}>
        {t("nav.back")}
      </button>
    );
  }
  return (
    <Link to={fallbackTo} className={className}>
      {fallbackLabel}
    </Link>
  );
}
