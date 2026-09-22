import type { CSSProperties } from "react";
import { NatFlag } from "@/components/dl/nat-flag";
import { StripArrow } from "@/components/dl/side-strip";
import { STRIP_ITEM, STRIP_ROW, useSideStrip } from "@/hooks/useSideStrip";
import { useInView } from "@/hooks/useInView";
import { ASIAN_GAMES_SUN } from "@/lib/championship-themes";
import { chanceLabel, discName, eventOrder } from "@/lib/dl-data";
import type { UltimateProjection } from "@/lib/dl-data";
import type { Lang } from "@/lib/i18n";

type T = (k: string, v?: Record<string, string | number>) => string;

/** World Athletics writes a single-named athlete with a placeholder given
 * name, ". SEEMA"; the reader never sees the placeholder. */
function displayName(name: string): string {
  return name.replace(/^\.\s+/, "");
}

/** The call at a glance: one tile per called event, the track and then the
 * field, each in the site's order. A tile names the favourite and their podium
 * chance, and opens the event in the full table below. */
export function NagoyaTiles({
  projections,
  onOpen,
  t,
  lang,
}: {
  /** Already in the site's event order. */
  projections: UltimateProjection[];
  onOpen: (discKey: string) => void;
  t: T;
  lang: Lang;
}) {
  const groups = [
    {
      key: "track",
      label: t("nav.track"),
      events: projections.filter((p) => eventOrder(p.discKey)[0] === 0),
    },
    {
      key: "field",
      label: t("nav.field"),
      events: projections.filter((p) => eventOrder(p.discKey)[0] !== 0),
    },
  ].filter((g) => g.events.length > 0);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <TileGroup
          key={group.key}
          label={group.label}
          events={group.events}
          onOpen={onOpen}
          t={t}
          lang={lang}
        />
      ))}
    </div>
  );
}

/** One group's tiles as a sideways row, like the dashboard's favourites (the
 * user, 2026-09-22): swipe or scroll it, or page with the arrows. */
function TileGroup({
  label,
  events,
  onOpen,
  t,
  lang,
}: {
  label: string;
  events: UltimateProjection[];
  onOpen: (discKey: string) => void;
  t: T;
  lang: Lang;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.2);
  const { row, edge, page } = useSideStrip<HTMLUListElement>(events.length);
  return (
    <section ref={ref}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="label-caps flex items-center gap-3 text-muted-foreground">
          {label}
          <span className="nums font-normal tracking-normal normal-case">({events.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          <StripArrow
            dir={-1}
            disabled={edge.start}
            onPage={page}
            label={t("nagoya.glance.pagePrev")}
          />
          <StripArrow
            dir={1}
            disabled={edge.end}
            onPage={page}
            label={t("nagoya.glance.pageNext")}
          />
        </div>
      </div>
      <ul
        ref={row}
        data-in={inView}
        aria-label={t("nagoya.glance.stripLabel", { group: label })}
        className={`nagoya-tiles mt-4 ${STRIP_ROW}`}
      >
        {events.map((p, i) => (
          <li
            key={p.discKey}
            className={`nagoya-tile ${STRIP_ITEM}`}
            style={{ "--tile-i": Math.min(i, 6) } as CSSProperties}
          >
            <Tile p={p} onOpen={onOpen} t={t} lang={lang} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Tile({
  p,
  onOpen,
  t,
  lang,
}: {
  p: UltimateProjection;
  onOpen: (discKey: string) => void;
  t: T;
  lang: Lang;
}) {
  // The favourite is the first athlete not reported out, as in the table.
  const field = p.athletes.filter((a) => a.injuryStatus !== "remove");
  const lead = field[0];
  const next = field.slice(1, 3).map((a) => displayName(a.name));
  const disc = discName(t, p.discKey, p.disciplineLabel);
  const onPoints = p.method === "points" || lead?.podiumChance == null;

  return (
    <button
      type="button"
      onClick={() => onOpen(p.discKey)}
      className="nagoya-tile-card group flex h-full w-full flex-col rounded-2xl p-5 text-left"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="text-[13.5px] font-medium text-muted-foreground">{disc}</span>
        {!onPoints && lead && <SunArc value={lead.podiumChance ?? 0} />}
      </span>

      {lead ? (
        <>
          <span className="mt-3 flex min-w-0 items-center gap-2">
            <span className="truncate text-[18px] font-semibold leading-snug text-foreground">
              {displayName(lead.name)}
            </span>
          </span>
          {lead.nat && <NatFlag nat={lead.nat} className="mt-1" />}

          <span className="mt-4 flex items-baseline gap-2">
            {onPoints ? (
              <>
                <span className="hero-serif nums text-[30px] leading-none text-foreground">
                  {lead.rankingScore ?? "—"}
                </span>
                <span className="text-[13px] text-muted-foreground">
                  {t("nagoya.glance.onPoints")}
                </span>
              </>
            ) : (
              <>
                <span className="hero-serif nums text-[40px] leading-none text-gold-strong">
                  {chanceLabel(lang, lead.podiumChance ?? 0)}%
                </span>
                <span className="text-[13px] text-muted-foreground">
                  {t("landing.call.chance")}
                </span>
              </>
            )}
          </span>

          {next.length > 0 && (
            <span className="mt-4 block border-t border-border pt-3 text-[12.5px] leading-snug text-muted-foreground">
              {t("nagoya.glance.next", { names: next.join(", ") })}
            </span>
          )}
        </>
      ) : null}

      <span className="mt-auto flex items-center gap-1.5 pt-4 text-[12.5px] font-semibold text-terracotta-strong">
        {t("nagoya.glance.openTable")}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          className="nagoya-tile-arrow size-4"
          aria-hidden="true"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </span>
    </button>
  );
}

/** A small red sun with a ring that fills to the favourite's podium chance. The
 * ring is the coral the page uses for its controls (8.05:1 on the tile's
 * green), since the sun's own red does not reach 3:1 against it. The figure
 * beside it carries the number; the ring is there to be seen at a glance. */
function SunArc({ value }: { value: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const share = Math.max(0, Math.min(100, value)) / 100;
  return (
    <svg viewBox="0 0 48 48" className="size-12 shrink-0 -rotate-90" aria-hidden="true">
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-white/12"
      />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="var(--terracotta-strong)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${c * share} ${c}`}
      />
      <circle cx="24" cy="24" r="12" fill={ASIAN_GAMES_SUN} />
    </svg>
  );
}
