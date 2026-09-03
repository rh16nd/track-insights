import type { ReactNode } from "react";
import { disciplineLabel, pageHead } from "@/lib/seo";
import { createFileRoute, Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, WatchBadge } from "@/components/dl/shell";
import { useAthleteProfile, type AthleteNotInField } from "@/hooks/useAthleteProfile";
import { SeasonTrendChart } from "@/components/dl/season-trend-chart";
import { HeadToHeadChart } from "@/components/dl/head-to-head-chart";
import { AthleteAnalyticsBlock } from "@/components/dl/athlete-analytics";
import { AthleteCareerBlock } from "@/components/dl/athlete-career";
import { InfoTip } from "@/components/dl/info-tip";
import { ordinal } from "@/lib/dl-data";

const FIELD_EVENT_KEYS = new Set([
  "men_HJ",
  "women_HJ",
  "men_PV",
  "women_PV",
  "men_LJ",
  "women_LJ",
  "men_TJ",
  "women_TJ",
  "men_SP",
  "women_SP",
  "men_DT",
  "women_DT",
  "men_JT",
  "women_JT",
]);

/** An athlete who is really ranked this season but is NOT in the projected
 * field. Shows the actual reason -- taken from the API, which mirrors
 * run.py's real selection order -- plus their genuine season marks.
 *
 * This page exists because the absence itself was the confusing thing:
 * Noah Lyles is world #1 at 9.79 and still misses the Final, and before
 * this the site just didn't mention him at all.
 *
 * 2026-08-25: the reason it gave was also wrong. It said he had no Diamond
 * League points, because standings.json only keeps the qualifying places
 * and "absent from that list" was read as "never scored". He is 9th on 15
 * points, two short of the cut. The API now answers from the full
 * standings table and this page shows the points and the gap. */
function NotInField({
  data,
  discKey,
  canGoBack,
  router,
}: {
  data: AthleteNotInField;
  discKey: string;
  canGoBack: boolean;
  router: { history: { back: () => void } };
}) {
  const backTo = FIELD_EVENT_KEYS.has(discKey) ? "/field" : "/track";

  // Same real World Athletics photo the in-field profiles get, cropped by
  // the same real face detection. Not being in the projected eight is not a
  // reason to give someone a visibly lesser page.
  // World Athletics genuinely has no photo for some athletes, and
  // load_athlete_photo returns null rather than substituting a stock image.
  // Fall back to the app's own track-surface texture, exactly as the in-field
  // profile does -- without this the page simply lost its header and looked
  // broken for anyone WA has no picture of.
  // Same dossier head as an in-field athlete -- this page had its own older
  // rounded-card hero, which meant one athlete page looked like two designs
  // depending on whether the athlete qualified. The only differences that
  // survive are the ones that are actually true: the tag says they are not in
  // the field, and the model figure is labelled as conditional.
  const words = data.name.trim().split(/\s+/);
  const tc = (w: string) =>
    w.length > 1 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w;
  const surname = words.length > 1 ? tc(words[words.length - 1]!) : "";
  const forename = words.length > 1 ? words.slice(0, -1).map(tc).join(" ") : data.name;

  const backdrop = data.photoUrl ? (
    <div aria-hidden="true" className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${data.photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: data.photoFocus
            ? `${data.photoFocus.x}% ${data.photoFocus.y}%`
            : "center 15%",
        }}
      />
      <div className="absolute inset-0 bg-brick/45" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, oklch(0.406 0.121 40 / 0.92) 0%, oklch(0.406 0.121 40 / 0.55) 38%, oklch(0.406 0.121 40 / 0.08) 72%, transparent 88%)",
        }}
      />
    </div>
  ) : null;

  const hero = (
    <div className="grid items-end gap-9 lg:grid-cols-[1.35fr_0.65fr] lg:gap-11">
      <div>
        {canGoBack ? (
          <button
            type="button"
            onClick={() => router.history.back()}
            className="label-caps -m-2 p-2 text-white/80 transition-colors hover:text-white"
          >
            ← Back
          </button>
        ) : (
          <Link
            to={backTo}
            className="label-caps -m-2 p-2 text-white/80 transition-colors hover:text-white"
          >
            ← Back to {backTo === "/field" ? "field" : "track"} events
          </Link>
        )}
        <div className="label-caps mt-3 text-gold-on-canvas">Athlete dossier · {data.disc}</div>
        <h1
          className="mt-3.5 text-[clamp(40px,7vw,92px)] leading-[0.92] font-bold tracking-[-0.03em] text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {forename}
          {surname && (
            <>
              <br />
              {surname}
            </>
          )}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Tag>{data.nat}</Tag>
          <Tag>Not in the projected field</Tag>
          {data.dl && (
            <Tag>
              {ordinal(data.dl.rank)} on {data.dl.points} DL points
            </Tag>
          )}
          {data.worldRank != null && <Tag>World #{data.worldRank}</Tag>}
        </div>
      </div>

      {/* The model really did score this athlete -- run.py runs the same
          forest over the near-miss group. Kept, with an explicitly
          conditional label, because it is not a forecast about the Final:
          they are not in it. */}
      {data.hypotheticalProb != null && (
        <div className="rounded-[20px] border border-white/20 bg-white/10 px-6 py-5">
          <div className="label-caps text-gold-on-canvas">If they had qualified</div>
          <p className="mt-2 text-[14px] leading-relaxed text-white/92">
            <span className="nums font-semibold text-white">{data.hypotheticalProb}%</span> chance
            of a podium, from the same model run over the near-miss group. This isn&apos;t a
            projection about Brussels; they aren&apos;t in the field.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Shell title={data.name} crumb={data.name} hero={hero} headTone="brick" headBackdrop={backdrop}>
      <Panel
        title="Why they're not in the projected field"
        subtitle="The same eligibility check the projections themselves use"
      >
        <p className="text-[13.5px] leading-relaxed text-foreground">{data.reason}</p>
        {data.injuryReason && (
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            Flagged from: {data.injuryReason}{" "}
            {data.injuryUrl && (
              <a
                href={data.injuryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta-strong hover:underline"
              >
                View source
              </a>
            )}
          </p>
        )}
        {/* Points are what actually decides eligibility, so when the athlete
            has any they belong right under the reason rather than only
            inside the prose. The rest of their numbers live in Season stats
            below, the same panel the in-field profile uses. */}
        {data.dl && (
          <div className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <div className="label-caps text-muted-foreground">Diamond League points</div>
              <div className="nums mt-1 text-[20px] font-semibold text-foreground">
                {data.dl.points ?? "—"}
                {/* Separated by a middot, not just whitespace: "15" beside
                    "9th" reads as "159th" at a glance. */}
                <span className="ml-2 text-[13px] font-medium text-muted-foreground">
                  · {ordinal(data.dl.rank)} in the standings
                </span>
              </div>
            </div>
            <div>
              <div className="label-caps text-muted-foreground">Gap to the cut</div>
              <div className="nums mt-1 text-[20px] font-semibold text-foreground">
                {data.dl.gap == null ? "—" : data.dl.gap > 0 ? `−${data.dl.gap}` : "level"}
                {data.dl.cutPoints != null && (
                  <span className="ml-2 text-[13px] font-medium text-muted-foreground">
                    · cut at {data.dl.cutPoints}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        {data.dl && (
          <Link
            to="/qualification"
            search={{ disc: data.discKey }}
            className="mt-4 inline-block text-[12.5px] font-medium text-terracotta-strong hover:underline"
          >
            See the full {data.disc} standings →
          </Link>
        )}
        {data.worldRank === 1 && (
          <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
            Worth noting: this is the fastest mark in the world this season. Diamond League Final
            eligibility is decided by points scored in the series, not by season best.
          </p>
        )}
      </Panel>

      {/* Same two-panel row, same StatBlock grid and same chart the in-field
          profile uses. None of these numbers stop being true because the
          athlete missed the cut, and the page read as a stub without them. */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel title="Season stats">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatBlock label="2026 season best" value={data.seasonBest ?? "—"} icon="target" />
            <StatBlock
              label="World rank"
              value={data.worldRank != null ? `#${data.worldRank}` : "—"}
              sub="this season's toplist"
              icon="trophy"
            />
            <StatBlock label="Career best" value={data.careerBest ?? "—"} icon="trophy" />
            <StatBlock
              label="PB gap"
              value={
                data.pbGap != null
                  ? `${data.pbGap.toFixed(2)}${FIELD_EVENT_KEYS.has(data.discKey) ? "m" : "s"}`
                  : "—"
              }
              sub="off their career best"
              icon="ruler"
              hint={`How far this season's best mark is from the athlete's all-time best, in ${
                FIELD_EVENT_KEYS.has(data.discKey) ? "metres" : "seconds"
              }. Zero means they've matched their personal best this year; a bigger number means they're still off it.`}
            />
            <StatBlock
              label="Age"
              value={data.age != null ? String(Math.round(data.age)) : "—"}
              icon="calendar"
            />
            <StatBlock
              label="Meets this season"
              value={data.meetsCount != null ? String(data.meetsCount) : "—"}
              sub="Diamond League meetings"
              icon="grid"
            />
            <StatBlock
              label={
                FIELD_EVENT_KEYS.has(data.discKey)
                  ? "Competitions this season"
                  : "Races this season"
              }
              value={String(data.racesThisSeason)}
              sub="all competitions"
              icon="grid"
            />
            <StatBlock
              label="Last competed"
              value={data.daysSinceLast != null ? `${data.daysSinceLast}d ago` : "—"}
              {...(data.lastRaceDate ? { sub: data.lastRaceDate } : {})}
              icon="clock"
            />
            {/* The same World Athletics score the in-field profile carries,
                and it lands harder here: it is the number that says how good
                this athlete is in absolute terms, next to a page explaining
                why they are not in the field. */}
            {data.scoreContext && (
              <StatBlock
                label="WA score"
                value={String(data.scoreContext.score)}
                sub={`Top ${Math.max(0.1, 100 - data.scoreContext.percentile).toFixed(1)}% of all ranked marks`}
                icon="ruler"
                hint="World Athletics' own points score for a mark. It puts every event on one scale, so a 9.9 hundred metres and a 2.30m high jump can be lined up and compared. Higher is better."
              />
            )}
          </div>
          {data.scoreContext && (
            <p className="mt-4 max-w-md text-[11.5px] leading-snug text-muted-foreground">
              {ordinal(Math.round(data.scoreContext.discPercentile))} percentile within{" "}
              {data.disc.toLowerCase()}, where the median is{" "}
              <span className="nums">{data.scoreContext.discMedian}</span>.
              {data.scoreContext.indoor && " This mark was set indoors."}
            </p>
          )}
          {/* Career best, PB gap, meets and last-competed come from run.py's
              scoring pass, which only covers the field plus the near-miss
              group. Further down the toplist they are genuinely unknown, and
              saying so beats a grid of silent dashes. */}
          {/* Covers both shapes of the same gap: an athlete World Athletics
              has no individual results for at all, and one whose results are
              all from earlier seasons. Either way the blank is "not known",
              which is a different statement from "did not race" and has to
              be said rather than left as a dash. */}
          {data.daysSinceLast == null && (
            <p className="mt-4 max-w-md text-[12px] leading-relaxed text-muted-foreground">
              World Athletics lists a season best for this athlete but no dated results this season
              {data.racesOnRecord > 0 ? " (their results on record are from earlier years)" : ""},
              so meetings and last-competed are unknown here rather than zero.
            </p>
          )}
          {data.careerBest === null && (
            <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
              Career best, PB gap and activity aren&apos;t computed for athletes this far outside
              the field. The model only scores the projected finalists and the closest challengers.
            </p>
          )}
        </Panel>

        <Panel
          title="Real season form"
          subtitle="Diamond League meetings only. The competition record below counts every scraped final, so its totals run higher. That's a difference in scope, not a contradiction."
        >
          {data.history.length > 0 ? (
            <SeasonTrendChart history={data.history} year={data.historyYear} />
          ) : (
            <div className="text-[12.5px] text-muted-foreground">
              No {data.historyYear ?? "recent"} meet history on record for this athlete.
            </div>
          )}
        </Panel>
      </div>

      {/* The near-miss page gets the same analyst block as an in-field one.
          Withholding it made this look like a stub of the real profile,
          when for a reader asking "should this athlete have qualified?"
          the record IS the evidence -- and the "In field" badge inside the
          head-to-head reads more pointedly here, marking the athletes who
          did get in. The old standalone head-to-head panel is gone for the
          same reason it went from the in-field page: the analytics one
          draws the same derived numbers. */}
      {data.career && <AthleteCareerBlock career={data.career} />}

      {data.analytics ? (
        <AthleteAnalyticsBlock
          analytics={data.analytics}
          isField={FIELD_EVENT_KEYS.has(data.discKey)}
          rivalNames={data.rivalNames}
          careerSeasons={data.careerSeasons}
        />
      ) : (
        <Panel
          title="Head-to-head vs the projected field"
          subtitle="Real meetings against the athletes who did qualify, from World Athletics results."
          className="mt-6"
        >
          {data.h2h.length > 0 ? (
            <HeadToHeadChart matchups={data.h2h} opponentsLabel="the qualified field" />
          ) : (
            <div className="text-[12.5px] text-muted-foreground">
              No qualifying head-to-head record against this discipline&apos;s projected field.
            </div>
          )}
        </Panel>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        {canGoBack ? (
          <button
            type="button"
            onClick={() => router.history.back()}
            className="label-caps -m-2 p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back
          </button>
        ) : (
          <Link
            to={backTo}
            className="label-caps -m-2 p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to {backTo === "/field" ? "field" : "track"} events
          </Link>
        )}
        {data.waUrl && (
          <a
            href={data.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-muted-foreground transition-colors hover:text-terracotta-strong hover:underline"
          >
            View full profile on World Athletics
          </a>
        )}
      </div>
    </Shell>
  );
}

export const Route = createFileRoute("/athlete/$discKey/$name")({
  // ~237 athlete pages. The name comes off the URL, where World Athletics'
  // caps convention still applies, so it is title-cased for the tab and the
  // search result the same way the dossier headline is.
  head: ({ params }) => {
    const name = decodeURIComponent(params.name)
      .split(/\s+/)
      .map((w) => (w.length > 1 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
      .join(" ");
    const label = disciplineLabel(params.discKey);
    return pageHead(
      `${name} — ${label}`,
      `${name}'s ${label} form for the 2026 Diamond League Final: season and career bests, real per-meeting results, head-to-head record and World Athletics ranking.`,
    );
  },
  component: AthleteProfilePage,
});

function StatIcon({
  kind,
}: {
  kind: "target" | "trophy" | "ruler" | "calendar" | "grid" | "clock";
}) {
  const common = {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-[15px]",
    "aria-hidden": true,
  };
  const paths: Record<typeof kind, string[]> = {
    target: ["M10 2v3M10 15v3M2 10h3M15 10h3"],
    trophy: [
      "M6 3h8v4a4 4 0 0 1-8 0V3Z",
      "M6 4H3.5A1.5 1.5 0 0 0 2 5.5C2 7 3 8 4.5 8H6",
      "M14 4h2.5A1.5 1.5 0 0 1 18 5.5C18 7 17 8 15.5 8H14",
      "M8.5 11v2M10 11v3M11.5 11v2M7.5 17h5M8.5 13.5v3.5M11.5 13.5v3.5",
    ],
    ruler: ["M3 13.5 13.5 3l3.5 3.5L7 17l-4-3.5Z", "M8 8l2 2M11 5l2 2"],
    calendar: ["M3 4h14v13H3z", "M3 8h14M6.5 2.5v3M13.5 2.5v3"],
    grid: ["M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z"],
    clock: ["M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z", "M10 6v4l3 2"],
  };
  return (
    <svg {...common}>
      {paths[kind].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

function StatBlock({
  label,
  value,
  sub,
  icon,
  hint,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: "target" | "trophy" | "ruler" | "calendar" | "grid" | "clock";
  /** Optional tap-and-hover explanation for a stat that isn't self-evident. */
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-terracotta-strong">
        <StatIcon kind={icon} />
        <span className="label-caps text-muted-foreground">{label}</span>
        {hint && <InfoTip label={`About ${label}`}>{hint}</InfoTip>}
      </div>
      <div className="nums mt-1.5 text-[20px] font-semibold text-foreground">{value}</div>
      {sub && <div className="text-[11.5px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

/** v0's `.dh-tags` pill and `.dh-fig` figure — the two repeating pieces of
 * the dossier head. Both sit on the brick band, so their colours are fixed
 * to it rather than inheriting page tokens. */
function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="dg rounded-full bg-white/12 px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[0.02em] text-white">
      {children}
    </span>
  );
}

function DossierFigure({
  label,
  value,
  gold = false,
}: {
  label: string;
  value: string;
  gold?: boolean;
}) {
  return (
    <div>
      <div className="label-caps text-white/70">{label}</div>
      <b
        className={`dg nums mt-1 block text-[30px] leading-[1.05] font-bold tracking-[-0.02em] ${
          gold ? "text-gold-on-canvas" : "text-white"
        }`}
      >
        {value}
      </b>
    </div>
  );
}

function AthleteProfilePage() {
  const { discKey, name } = Route.useParams();
  const state = useAthleteProfile(discKey, decodeURIComponent(name));
  const router = useRouter();
  const canGoBack = useCanGoBack();

  // The athlete's real name is already in the route params, so the header
  // can show who is loading rather than a generic "Athlete" title card.
  const pendingName = decodeURIComponent(name);

  if (state.status === "loading") {
    return (
      <Shell
        title={pendingName}
        eyebrow="Athlete profile"
        description="Loading real season form, head-to-head record and season stats…"
      >
        <PanelSkeleton rows={6} />
      </Shell>
    );
  }

  if (state.status === "notInField") {
    return <NotInField data={state.data} discKey={discKey} canGoBack={canGoBack} router={router} />;
  }

  if (state.status === "error") {
    return (
      <Shell
        title={pendingName}
        eyebrow="Athlete profile"
        description="This athlete's profile could not be loaded."
      >
        <ErrorPanel
          title="Could not load athlete profile"
          message={state.message}
          hint="This athlete may not be in the current predictions file. Withdrawn athletes are filtered out before profiles are built."
          onRetry={state.retry}
        />
      </Shell>
    );
  }

  const a = state.data;

  // v0's athlete dossier head. The name is the page -- clamp(46px,7vw,92px),
  // split across two lines the way a file front reads -- with the figures
  // inline beneath it and the model's own read boxed off to the side.
  //
  // The real photo is KEPT, as the band's backdrop rather than as its own
  // rounded banner: it comes from World Athletics' CDN with a crop position
  // from api.py's face detection (a fixed crop cut Noah Lyles' face out of
  // frame entirely), and v0 having no photo is not a reason to throw that
  // away. Two scrims rather than one flat tint -- a uniform tint dark enough
  // to guarantee contrast muddied the photo past the point of being worth
  // showing.
  // World Athletics writes surnames in caps ("Oblique SEVILLE"). At 12px in a
  // table that is just a convention; at 92px across a dossier front it reads
  // as shouting, so the display is title-cased. The underlying name is
  // untouched -- every link, lookup and API call still uses WA's own string.
  const titleCase = (w: string) =>
    w.length > 1 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w;
  const words = a.name.trim().split(/\s+/);
  const surname = words.length > 1 ? titleCase(words[words.length - 1]!) : "";
  const forename = words.length > 1 ? words.slice(0, -1).map(titleCase).join(" ") : a.name;

  const backdrop = a.photoUrl ? (
    <div aria-hidden="true" className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${a.photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: a.photoFocus ? `${a.photoFocus.x}% ${a.photoFocus.y}%` : "center 15%",
        }}
      />
      <div className="absolute inset-0 bg-brick/45" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, oklch(0.406 0.121 40 / 0.92) 0%, oklch(0.406 0.121 40 / 0.55) 38%, oklch(0.406 0.121 40 / 0.08) 72%, transparent 88%)",
        }}
      />
    </div>
  ) : null;

  const hero = (
    <div className="grid items-end gap-9 lg:grid-cols-[1.35fr_0.65fr] lg:gap-11">
      <div>
        {canGoBack ? (
          <button
            type="button"
            onClick={() => router.history.back()}
            className="label-caps -m-2 p-2 text-white/80 transition-colors hover:text-white"
          >
            ← Back
          </button>
        ) : (
          <Link
            to="/dashboard"
            className="label-caps -m-2 p-2 text-white/80 transition-colors hover:text-white"
          >
            ← Back to dashboard
          </Link>
        )}
        <div className="label-caps mt-3 text-gold-on-canvas">Athlete dossier · {a.disc}</div>
        <h1
          className="mt-3.5 text-[clamp(40px,7vw,92px)] leading-[0.92] font-bold tracking-[-0.03em] text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {forename}
          {surname && (
            <>
              <br />
              {surname}
            </>
          )}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Tag>{a.nat}</Tag>
          {a.age != null && <Tag>Age {Math.round(a.age)}</Tag>}
          <Tag>#{a.rank} in the projected field</Tag>
          {a.injuryWatch && <WatchBadge reason={a.injuryReason} url={a.injuryUrl} tone="dark" />}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-7 gap-y-5">
          <DossierFigure label="Season best" value={a.mark} />
          {a.careerBest && <DossierFigure label="Personal best" value={a.careerBest} />}
          {a.lastRaceDate && <DossierFigure label="Last competed" value={a.lastRaceDate} />}
          <DossierFigure
            label={`Races in ${a.historyYear ?? ""}`.trim()}
            value={String(a.racesThisSeason)}
          />
          <DossierFigure label="PodiumCall model" value={`${a.prob}%`} gold />
        </div>
      </div>

      <div className="rounded-[20px] border border-white/20 bg-white/10 px-6 py-5">
        <div className="label-caps text-gold-on-canvas">PodiumCall model</div>
        <p className="mt-2 text-[14px] leading-relaxed text-white/92">
          <span className="nums font-semibold text-white">{a.prob}%</span> chance of finishing on
          the podium in Brussels, not of winning. The model predicts top-three membership.
          {a.scoreContext && (
            <>
              {" "}
              The <span className="nums">{a.mark}</span> scores{" "}
              <span className="nums">{a.scoreContext.score}</span> World Athletics points, the{" "}
              <span className="nums">{a.scoreContext.discPercentile}th</span> percentile of this
              discipline.
            </>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <Shell title={a.name} crumb={a.name} hero={hero} headTone="brick" headBackdrop={backdrop}>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel title="Season stats">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatBlock label="2026 season best" value={a.mark} icon="target" />
            <StatBlock label="Career best" value={a.careerBest ?? "—"} icon="trophy" />
            <StatBlock
              label="PB gap"
              value={
                a.pbGap != null
                  ? `${a.pbGap.toFixed(2)}${FIELD_EVENT_KEYS.has(a.discKey) ? "m" : "s"}`
                  : "—"
              }
              sub="off their career best"
              icon="ruler"
              hint={`How far this season's best mark is from the athlete's all-time best, in ${
                FIELD_EVENT_KEYS.has(a.discKey) ? "metres" : "seconds"
              }. Zero means they've matched their personal best this year; a bigger number means they're still off it.`}
            />
            <StatBlock
              label="Age"
              value={a.age != null ? String(Math.round(a.age)) : "—"}
              icon="calendar"
            />
            {/* Scoped to THIS discipline, and saying so matters now that the
                Mile no longer counts as a 1500m (2026-08-24 scraper fix):
                Josh Kerr's whole 2026 Diamond League 1500m season was Miles,
                so this legitimately reads 0 next to a "last competed" figure
                that came from his toplist mark. Same situation for anyone who
                switches events mid-season. */}
            <StatBlock
              label="Meets this season"
              value={a.meetsCount != null ? String(a.meetsCount) : "—"}
              sub="Diamond League meetings"
              icon="grid"
            />
            <StatBlock
              label={
                FIELD_EVENT_KEYS.has(a.discKey) ? "Competitions this season" : "Races this season"
              }
              value={String(a.racesThisSeason)}
              sub="all competitions"
              icon="grid"
            />
            <StatBlock
              label="Last competed"
              value={a.daysSinceLast != null ? `${a.daysSinceLast}d ago` : "—"}
              {...(a.lastRaceDate ? { sub: a.lastRaceDate } : {})}
              icon="clock"
            />
            {/* World Athletics' own scoring-table points. The only number on
                this page that means anything outside this event -- a 1269 in
                the 100m and a 1269 in the shot put are the same quality of
                performance -- so it is the one that answers "is that mark
                actually good" for a reader who does not know the event. */}
            {a.scoreContext && (
              <StatBlock
                label="WA score"
                value={String(a.scoreContext.score)}
                sub={`Top ${Math.max(0.1, 100 - a.scoreContext.percentile).toFixed(1)}% of all ranked marks`}
                icon="ruler"
              />
            )}
          </div>
          {a.scoreContext && (
            <p className="mt-4 max-w-md text-[11.5px] leading-snug text-muted-foreground">
              {ordinal(Math.round(a.scoreContext.discPercentile))} percentile within{" "}
              {a.disc.toLowerCase()}, where the median is{" "}
              <span className="nums">{a.scoreContext.discMedian}</span>. The two readings differ
              because events differ in depth.
              {a.scoreContext.indoor && " This mark was set indoors."}
            </p>
          )}
          <a
            href={a.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-[12px] text-muted-foreground transition-colors hover:text-terracotta-strong hover:underline"
          >
            View full profile on World Athletics →
          </a>
        </Panel>

        <Panel
          title="Real season form"
          subtitle="Diamond League meetings only. The competition record below counts every scraped final, so its totals run higher. That's a difference in scope, not a contradiction."
        >
          {a.history.length > 0 ? (
            <SeasonTrendChart history={a.history} year={a.historyYear} />
          ) : (
            <div className="text-[12.5px] text-muted-foreground">
              No prior-season meet history on record for this athlete.
            </div>
          )}
        </Panel>
      </div>

      {a.career && <AthleteCareerBlock career={a.career} />}

      {a.analytics && (
        <AthleteAnalyticsBlock
          analytics={a.analytics}
          isField={FIELD_EVENT_KEYS.has(a.discKey)}
          rivalNames={a.rivalNames}
          careerSeasons={a.careerSeasons}
        />
      )}
    </Shell>
  );
}
