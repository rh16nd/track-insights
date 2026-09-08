import { useEffect, useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Panel } from "./shell";
import { apiFetch } from "@/lib/api";
import { discName } from "@/lib/dl-data";
import { localeTag } from "@/lib/dates";
import { useT, type Lang } from "@/lib/i18n";

export type NewsArticle = {
  headline: string;
  url: string | null;
  source: string;
  /** When the story ran. A news search has no sense of season, so the age of
   * the evidence is shown rather than assumed. */
  published?: string | null;
};

/** One ATHLETE, with the reporting behind them. It used to be one row per
 * article, which stacked up into near-duplicates the moment a story got picked
 * up -- Keely Hodgkinson withdrawing filled the top three rows on 2026-09-08,
 * one event, three outlets. */
export type NewsItem = {
  athlete: string;
  status: "remove" | "watch" | string;
  disciplines: string[];
  /** Discipline keys beside the English labels, so the name can be shown in
   * the reader's language rather than the API's. */
  discKeys?: string[];
  keywords: string[];
  articles: NewsArticle[];
  latest?: string | null;
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
      subtitle={checked ? t("news.subtitleWithDate", { date: checked }) : t("news.subtitle")}
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
          {state.items.map((n) => (
            <AthleteNews key={n.athlete} n={n} lang={lang} t={t} />
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

/** One athlete's row: who, and how sure, with the reporting folded away.
 *
 * Collapsed by default. The name is the answer to the reader's question; the
 * articles are the evidence for it, and putting a well-covered withdrawal's
 * fourteen headlines on the page pushes every other athlete off it. */
function AthleteNews({
  n,
  lang,
  t,
}: {
  n: NewsItem;
  lang: Lang;
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const count = n.articles.length;
  const when = (iso?: string | null) =>
    iso
      ? new Date(`${iso}T00:00:00`).toLocaleDateString(localeTag(lang), {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;

  return (
    <li className="py-3.5 first:pt-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full flex-wrap items-center gap-2 text-left transition-colors hover:text-terracotta-strong"
      >
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
            {n.disciplines.map((label, i) => discName(t, n.discKeys?.[i], label)).join(", ")}
          </span>
        )}
        <span className="nums ml-auto flex shrink-0 items-center gap-1 text-[11.5px] text-muted-foreground">
          {t(count === 1 ? "news.reportOne" : "news.reportMany", { n: count })}
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </button>

      {/* The most recent headline stays visible when collapsed: the row has to
          say something, and the newest thing known is the useful something. */}
      {!open && (
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {n.articles[0]?.headline}
        </p>
      )}

      {open && (
        <ul id={panelId} className="mt-2 space-y-2.5">
          {n.articles.map((a, i) => (
            <li key={a.url ?? `${a.headline}-${i}`} className="border-l-2 border-border pl-3">
              <p className="text-[13px] leading-relaxed text-foreground">
                {a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-border underline-offset-2 transition-colors hover:text-terracotta-strong hover:decoration-terracotta-strong"
                  >
                    {a.headline}
                  </a>
                ) : (
                  a.headline
                )}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[11.5px] text-muted-foreground">
                <span>{a.source}</span>
                {when(a.published) && <span className="nums">{when(a.published)}</span>}
              </div>
            </li>
          ))}
          {n.keywords.length > 0 && (
            <li className="nums pl-3 text-[11.5px] text-muted-foreground">
              {t("news.matchedOn", { keywords: n.keywords.join(", ") })}
            </li>
          )}
        </ul>
      )}
    </li>
  );
}
