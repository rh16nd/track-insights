import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel } from "./shell";
import { apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";

export type NewsItem = {
  headline: string;
  url: string | null;
  source: string;
  athlete: string;
  status: "remove" | "watch" | string;
  disciplines: string[];
  keywords: string[];
};

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ok"; items: NewsItem[]; checkedAt: string | null };

/** The real news the injury checker matched, as a feed.
 *
 * This evidence was already scraped and stored -- it just only ever appeared
 * as a tooltip on whichever athlete it flagged, so you had to already
 * suspect someone to find it. Listing it does two jobs: it explains why the
 * field changed, and it makes BAD matches visible. The item that removed
 * Cole Hocker is a headline about Jakob Ingebrigtsen, which is obvious the
 * moment you read it here and invisible behind a badge.
 *
 * The matched keywords are shown deliberately, for the same reason: "back"
 * sitting under a removal is the tell that the match is wrong. */
export function NewsFeed() {
  const { t, lang } = useT();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const ac = new AbortController();
    // No retry affordance here on purpose: the feed renders nothing at all
    // when it fails (see below), so there is no error surface to put a
    // button on. apiFetch's own retries are the whole recovery story.
    apiFetch<{ items?: NewsItem[]; checkedAt?: string | null }>("/api/news", { signal: ac.signal })
      .then((d) => {
        if (!ac.signal.aborted)
          setState({ status: "ok", items: d.items ?? [], checkedAt: d.checkedAt ?? null });
      })
      .catch(() => {
        if (!ac.signal.aborted) setState({ status: "error" });
      });
    return () => ac.abort();
  }, []);

  if (state.status === "error") return null;

  const checked =
    state.status === "ok" && state.checkedAt
      ? new Date(state.checkedAt).toLocaleDateString(lang, {
          day: "2-digit",
          month: "short",
        })
      : null;

  return (
    <Panel
      title={t("news.title")}
      subtitle={
        checked ? t("news.subtitleWithDate", { date: checked }) : t("news.subtitle")
      }
      className="mt-4"
    >
      {state.status === "loading" && (
        <p className="text-[13px] text-muted-foreground">{t("news.loading")}</p>
      )}

      {state.status === "ok" && state.items.length === 0 && (
        <p className="text-[13px] text-muted-foreground">{t("news.empty")}</p>
      )}

      {state.status === "ok" && state.items.length > 0 && (
        <ul className="divide-y divide-border">
          {state.items.map((n, i) => (
            <li key={n.url ?? `${n.athlete}-${i}`} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`label-caps shrink-0 rounded-sm px-1.5 py-1 ${
                    n.status === "remove"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-gold/15 text-gold-strong"
                  }`}
                >
                  {n.status === "remove" ? t("news.removed") : t("watch.badge")}
                </span>
                <span className="text-[13.5px] font-medium text-foreground">{n.athlete}</span>
                {n.disciplines.length > 0 && (
                  <span className="text-[11.5px] text-muted-foreground">
                    {n.disciplines.join(", ")}
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
                {n.url ? (
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-border underline-offset-2 transition-colors hover:text-terracotta-strong hover:decoration-terracotta-strong"
                  >
                    {n.headline}
                  </a>
                ) : (
                  n.headline
                )}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground">
                <span>{n.source}</span>
                {n.keywords.length > 0 && (
                  <span className="nums">{t("news.matchedOn", { keywords: n.keywords.join(", ") })}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-[11.5px] leading-relaxed text-muted-foreground">
        {t("news.disclaimerBefore")}
        <Link to="/dashboard" className="underline decoration-border underline-offset-2">
          {t("news.searchFor")}
        </Link>
        {t("news.disclaimerAfter")}
      </p>
    </Panel>
  );
}
