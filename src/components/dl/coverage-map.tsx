import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { NatFlag } from "@/components/dl/nat-flag";
import { useCountries } from "@/hooks/useCountries";
import { useInView } from "@/hooks/useInView";
import { useDismiss } from "@/hooks/useDismiss";
import { IOC_TO_ISO2 } from "@/lib/flags";
import { localeTag } from "@/lib/dates";
import { useT } from "@/lib/i18n";

/** The outlines from scripts/make-world-map.py: Natural Earth's countries,
 * projected with Equal Earth into a `width`-wide box, keyed by ISO alpha-2. */
type WorldMap = {
  width: number;
  height: number;
  shapes: Record<string, string>;
  dots: Record<string, [number, number]>;
};

let mapPromise: Promise<WorldMap> | null = null;
function loadMap(): Promise<WorldMap> {
  mapPromise ??= fetch("/geo/world-110m.v1.json").then((r) => {
    if (!r.ok) throw new Error(`map ${r.status}`);
    return r.json() as Promise<WorldMap>;
  });
  return mapPromise;
}

/** Athletes per country, in five steps on a rough log scale: one athlete is
 * worth seeing on the map as well as a hundred. */
const BUCKETS = [1, 2, 6, 21, 101];
const BUCKET_LABELS = ["1", "2–5", "6–20", "21–100", "101+"];
const bucketOf = (n: number) => BUCKETS.filter((b) => n >= b).length - 1;
/** The gold's strength for each step, over the panel. The faintest still
 * stands clear of a country with no one (measured, 3:1 or better). */
const FILL = [
  "oklch(0.59 0.075 70)",
  "oklch(0.66 0.085 72)",
  "oklch(0.73 0.095 74)",
  "oklch(0.8 0.1 76)",
  "oklch(0.88 0.11 78)",
];
const EMPTY = "oklch(0.3 0.01 55)";
const TOP = 12;

type Row = { code: string; iso: string | null; name: string; athletes: number };

/** Where the site's athletes come from: every nation with a ranked athlete
 * this season, lit in gold by how many, on a world map (the user, 2026-09-21:
 * people like to see how far the site reaches).
 *
 * The map itself is a picture for sighted readers; the list beside it is the
 * same information for everyone, and the way in by keyboard. Hovering or
 * focusing a country in the list lights it on the map. With a mouse a country
 * on the map opens its page; a tap first shows its name and a button to open
 * it, since a small country is too easy to hit by mistake with a finger. */
export function CoverageMap() {
  const { t, lang } = useT();
  const router = useRouter();
  const { ref, inView } = useInView<HTMLDivElement>(0.05);
  const state = useCountries(inView);
  const [map, setMap] = useState<WorldMap | null>(null);
  const [mapFailed, setMapFailed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [tip, setTip] = useState<{ code: string; x: number; y: number; touch: boolean } | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false);
  const pointerType = useRef("mouse");
  const frame = useRef<HTMLDivElement>(null);
  const closeTip = useCallback(() => {
    setTip(null);
    setActive(null);
  }, []);
  // A tapped country's card closes on Escape or a tap anywhere else.
  useDismiss(!!tip?.touch, closeTip, frame);

  useEffect(() => {
    if (!inView) return;
    loadMap()
      .then(setMap)
      .catch(() => setMapFailed(true));
  }, [inView]);

  const names = useMemo(() => {
    try {
      return new Intl.DisplayNames([localeTag(lang)], { type: "region" });
    } catch {
      return null;
    }
  }, [lang]);

  const rows = useMemo<Row[]>(() => {
    if (state.status !== "ok") return [];
    return state.data
      .filter((c) => c.athleteCount > 0)
      .map((c) => {
        const iso = IOC_TO_ISO2[c.code] ?? null;
        let name = c.name;
        if (iso) {
          try {
            name = names?.of(iso.toUpperCase()) ?? c.name;
          } catch {
            // An unknown region code falls back to the name we were sent.
          }
        }
        return { code: c.code, iso, name, athletes: c.athleteCount };
      })
      .sort((a, b) => b.athletes - a.athletes || a.name.localeCompare(b.name));
  }, [state, names]);

  const byIso = useMemo(() => new Map(rows.filter((r) => r.iso).map((r) => [r.iso!, r])), [rows]);
  const byCode = useMemo(() => new Map(rows.map((r) => [r.code, r])), [rows]);
  const total = rows.reduce((n, r) => n + r.athletes, 0);
  const fmt = (n: number) => n.toLocaleString(localeTag(lang));
  const count = (n: number) =>
    n === 1 ? t("dashboard.map.athleteOne") : t("dashboard.map.athleteCount", { n: fmt(n) });

  const point = (e: ReactPointerEvent) => {
    const box = frame.current?.getBoundingClientRect();
    return box ? { x: e.clientX - box.left, y: e.clientY - box.top } : { x: 0, y: 0 };
  };
  const hover = (row: Row, e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setActive(row.code);
    setTip({ code: row.code, ...point(e), touch: false });
  };
  const leave = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setActive(null);
    setTip(null);
  };
  const choose = (row: Row, e: ReactMouseEvent) => {
    if (pointerType.current === "mouse") {
      void router.navigate({ to: "/country/$code", params: { code: row.code } });
      return;
    }
    const box = frame.current?.getBoundingClientRect();
    setActive(row.code);
    setTip({
      code: row.code,
      x: box ? e.clientX - box.left : 0,
      y: box ? e.clientY - box.top : 0,
      touch: true,
    });
  };

  const tipRow = tip ? byCode.get(tip.code) : undefined;
  const frameWidth = frame.current?.clientWidth ?? 0;

  const shown = showAll ? rows : rows.slice(0, TOP);

  return (
    <div ref={ref}>
      {state.status === "error" || mapFailed ? (
        <p className="text-[14px] text-muted-foreground">{t("dashboard.map.error")}</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
          <figure className="min-w-0">
            <div
              ref={frame}
              className="relative"
              onPointerDown={(e) => {
                pointerType.current = e.pointerType;
              }}
              onClick={(e) => {
                // A tap on the sea or an uncovered country closes the card.
                if (!(e.target as Element).closest("[data-country]")) closeTip();
              }}
            >
              {map ? (
                <svg
                  viewBox={`0 0 ${map.width} ${map.height}`}
                  className="block h-auto w-full"
                  aria-hidden="true"
                >
                  {Object.entries(map.shapes).map(([iso, d]) => {
                    const row = byIso.get(iso);
                    return (
                      <path
                        key={iso}
                        d={d}
                        fill={row ? FILL[bucketOf(row.athletes)] : EMPTY}
                        stroke="var(--card)"
                        strokeWidth={0.5}
                        data-country={row ? row.code : undefined}
                        className={
                          row ? "cursor-pointer transition-[fill] duration-150" : undefined
                        }
                        onPointerMove={row ? (e) => hover(row, e) : undefined}
                        onPointerLeave={row ? leave : undefined}
                        onClick={row ? (e) => choose(row, e) : undefined}
                      />
                    );
                  })}
                  {Object.entries(map.dots).map(([iso, [x, y]]) => {
                    const row = byIso.get(iso);
                    if (!row) return null;
                    return (
                      <circle
                        key={iso}
                        cx={x}
                        cy={y}
                        r={3.4}
                        fill={FILL[bucketOf(row.athletes)]}
                        stroke="var(--card)"
                        strokeWidth={0.8}
                        data-country={row.code}
                        className="cursor-pointer"
                        onPointerMove={(e) => hover(row, e)}
                        onPointerLeave={leave}
                        onClick={(e) => choose(row, e)}
                      />
                    );
                  })}
                  {/* The country being pointed at, or picked in the list,
                      drawn again on top with a light edge. */}
                  {active &&
                    (() => {
                      const iso = byCode.get(active)?.iso;
                      if (!iso) return null;
                      const d = map.shapes[iso];
                      const dot = map.dots[iso];
                      return d ? (
                        <path
                          d={d}
                          fill="none"
                          stroke="white"
                          strokeWidth={1.4}
                          pointerEvents="none"
                        />
                      ) : dot ? (
                        <circle
                          cx={dot[0]}
                          cy={dot[1]}
                          r={5.5}
                          fill="none"
                          stroke="white"
                          strokeWidth={1.4}
                          pointerEvents="none"
                        />
                      ) : null;
                    })()}
                </svg>
              ) : (
                <div className="skeleton-pulse aspect-[2.05] w-full rounded-2xl bg-white/10" />
              )}

              {tip && tipRow && (
                <div
                  className="landing-menu glass pointer-events-auto absolute z-10 w-max max-w-[240px] -translate-x-1/2 rounded-xl px-3.5 py-2.5 text-[13px] text-white"
                  style={{
                    left: Math.min(Math.max(tip.x, 110), Math.max(110, frameWidth - 110)),
                    top: tip.y + 14,
                  }}
                  data-country={tip.code}
                  role={tip.touch ? "dialog" : undefined}
                  aria-label={tip.touch ? tipRow.name : undefined}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <NatFlag nat={tipRow.code} showCode={false} />
                    {tipRow.name}
                  </div>
                  <div className="mt-0.5 text-white/80">{count(tipRow.athletes)}</div>
                  {tip.touch && (
                    <Link
                      to="/country/$code"
                      params={{ code: tipRow.code }}
                      className="mt-2 flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-[13px] font-semibold text-[var(--terracotta-ink)]"
                    >
                      {t("dashboard.map.open", { name: tipRow.name })}
                    </Link>
                  )}
                </div>
              )}
            </div>

            <figcaption className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div className="flex gap-8">
                <div>
                  <div className="page-title nums text-[40px] leading-none text-foreground">
                    {rows.length ? fmt(rows.length) : "—"}
                  </div>
                  <div className="label-caps mt-2 text-muted-foreground">
                    {t("dashboard.map.countries")}
                  </div>
                </div>
                <div>
                  <div className="page-title nums text-[40px] leading-none text-gold-strong">
                    {total ? fmt(total) : "—"}
                  </div>
                  <div className="label-caps mt-2 text-muted-foreground">
                    {t("dashboard.map.athletes")}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-muted-foreground">{t("dashboard.map.legend")}</div>
                <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1.5">
                  {BUCKET_LABELS.map((label, i) => (
                    <li
                      key={label}
                      className="flex items-center gap-1.5 text-[12px] text-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="size-3 rounded-sm"
                        style={{ backgroundColor: FILL[i] }}
                      />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </figcaption>
          </figure>

          <div className="min-w-0">
            <ol
              aria-label={t("dashboard.map.listLabel")}
              className={`flex flex-col ${showAll ? "max-h-[440px] overflow-y-auto pr-1" : ""}`}
            >
              {shown.map((r, i) => (
                <li key={r.code}>
                  <Link
                    to="/country/$code"
                    params={{ code: r.code }}
                    onMouseEnter={() => setActive(r.code)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(r.code)}
                    onBlur={() => setActive(null)}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/5 ${
                      active === r.code ? "bg-white/5" : ""
                    }`}
                  >
                    <span className="nums w-6 shrink-0 text-right text-[12px] text-muted-foreground">
                      {i + 1}
                    </span>
                    <NatFlag nat={r.code} showCode={false} />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-foreground">
                      {r.name}
                    </span>
                    <span className="nums shrink-0 text-[13px] text-gold-strong">
                      {fmt(r.athletes)}
                    </span>
                  </Link>
                </li>
              ))}
              {state.status === "loading" &&
                Array.from({ length: 6 }, (_, i) => (
                  <li
                    key={i}
                    className="skeleton-pulse my-2 h-7 rounded-lg bg-white/10"
                    aria-hidden="true"
                  />
                ))}
            </ol>
            {rows.length > TOP && (
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                aria-expanded={showAll}
                className="glass label-caps mt-3 inline-flex min-h-11 items-center rounded-full px-4 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              >
                {showAll
                  ? t("dashboard.map.showFewer")
                  : t("dashboard.map.showAll", { n: fmt(rows.length) })}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
