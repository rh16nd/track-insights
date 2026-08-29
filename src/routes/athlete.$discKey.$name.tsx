import { createFileRoute, Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { Shell, Panel, PanelSkeleton, ErrorPanel, WatchBadge } from "@/components/dl/shell";
import { useAthleteProfile, type AthleteNotInField } from "@/hooks/useAthleteProfile";
import { SeasonTrendChart } from "@/components/dl/season-trend-chart";
import { HeadToHeadChart } from "@/components/dl/head-to-head-chart";
import { CareerProgressionChart } from "@/components/dl/career-progression-chart";
import { AthleteAnalyticsBlock } from "@/components/dl/athlete-analytics";
import { RadialMeter } from "@/components/dl/radial-meter";
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
  const hero = (
    <div
      className={`relative min-h-[200px] overflow-hidden rounded-2xl sm:min-h-[240px] ${
        data.photoUrl ? "" : "track-surface"
      }`}
      style={
        data.photoUrl
          ? {
              backgroundImage: `url(${data.photoUrl})`,
              backgroundSize: "cover",
              backgroundPosition: data.photoFocus
                ? `${data.photoFocus.x}% ${data.photoFocus.y}%`
                : "center 15%",
            }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-background/25" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, oklch(0.19 0.03 40 / 0.88) 0%, oklch(0.19 0.03 40 / 0.45) 28%, transparent 55%)",
        }}
      />
      {/* Top scrim for the back link, matching the in-field hero -- without
          it the link sits on raw photo and can land on a bright patch. */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 30%)" }}
      />
      <div className="relative flex min-h-[200px] flex-col justify-between p-6 sm:min-h-[240px] sm:p-8">
        {/* Back sits in the hero here for the same reason it does on the
            in-field profile: this page is almost always reached from a table
            or a search result, and the way out shouldn't be below the fold. */}
        {canGoBack ? (
          <button
            type="button"
            onClick={() => router.history.back()}
            className="label-caps -m-2 self-start p-2 text-white/75 transition-colors hover:text-white"
          >
            ← Back
          </button>
        ) : (
          <Link
            to={backTo}
            className="label-caps -m-2 self-start p-2 text-white/75 transition-colors hover:text-white"
          >
            ← Back to {backTo === "/field" ? "field" : "track"} events
          </Link>
        )}
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="label-caps text-white/75">{data.disc} · not in the projected field</div>
            <h1
              className="mt-1.5 text-[26px] font-semibold tracking-tight text-white sm:text-[30px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {data.name}
            </h1>
            <p className="mt-1.5 text-[14px] text-white/85">
              {[
                data.nat,
                data.dl ? `${ordinal(data.dl.rank)} on ${data.dl.points} DL points` : null,
                data.worldRank != null ? `World #${data.worldRank}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          {/* The model really did score this athlete -- run.py runs the same
              forest over the near-miss group. Shown with an explicitly
              conditional label, because it is not a forecast about the
              Final: they are not in it. */}
          {data.hypotheticalProb != null && (
            <RadialMeter
              value={data.hypotheticalProb}
              label="Podium chance if they qualified"
              dark
              size={148}
              strokeWidth={12}
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Shell
      title={data.name}
      hero={hero}
      description="This athlete is ranked this season but is not among the projected finalists. Here's why, and what they have actually run."
    >
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
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
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
              value={data.pbGap != null ? data.pbGap.toFixed(2) : "—"}
              sub="vs. career best"
              icon="ruler"
            />
            <StatBlock
              label="Age"
              value={data.age != null ? String(Math.round(data.age)) : "—"}
              icon="calendar"
            />
            <StatBlock
              label="Meets this season"
              value={data.meetsCount != null ? String(data.meetsCount) : "—"}
              sub="in this discipline"
              icon="grid"
            />
            <StatBlock
              label="Last competed"
              value={data.daysSinceLast != null ? `${data.daysSinceLast}d ago` : "—"}
              icon="clock"
            />
          </div>
          {/* Career best, PB gap, meets and last-competed come from run.py's
              scoring pass, which only covers the field plus the near-miss
              group. Further down the toplist they are genuinely unknown, and
              saying so beats a grid of silent dashes. */}
          {data.careerBest === null && (
            <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
              Career best, PB gap and activity aren&apos;t computed for athletes this far outside
              the field — the model only scores the projected finalists and the closest challengers.
            </p>
          )}
        </Panel>

        <Panel title="Real season form">
          {data.history.length > 0 ? (
            <SeasonTrendChart history={data.history} year={data.historyYear} />
          ) : (
            <div className="text-[12.5px] text-muted-foreground">
              No {data.historyYear ?? "recent"} meet history on record for this athlete.
            </div>
          )}
        </Panel>
      </div>

      {/* The most interesting thing this page can say: how they actually do
          against the athletes who did qualify. Same data and same
          two-meeting threshold as the in-field profile's panel -- only the
          opponent list differs. */}
      <Panel
        title="Head-to-head vs the projected field"
        subtitle="Real meetings against the athletes who did qualify, from World Athletics results."
        className="mt-4"
      >
        {data.h2h.length > 0 ? (
          <HeadToHeadChart matchups={data.h2h} opponentsLabel="the qualified field" />
        ) : (
          <div className="text-[12.5px] text-muted-foreground">
            No qualifying head-to-head record against this discipline&apos;s projected field.
          </div>
        )}
      </Panel>

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
}: {
  label: string;
  value: string;
  sub?: string;
  icon: "target" | "trophy" | "ruler" | "calendar" | "grid" | "clock";
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-terracotta-strong">
        <StatIcon kind={icon} />
        <span className="label-caps text-muted-foreground">{label}</span>
      </div>
      <div className="nums mt-1.5 text-[20px] font-semibold text-foreground">{value}</div>
      {sub && <div className="text-[11.5px] text-muted-foreground">{sub}</div>}
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
          hint="This athlete may not be in the current predictions file — withdrawn athletes are filtered out before profiles are built."
        />
      </Shell>
    );
  }

  const a = state.data;

  const hero = (
    <div
      className={`relative min-h-[220px] overflow-hidden rounded-2xl sm:min-h-[260px] ${a.photoUrl ? "" : "track-surface"}`}
      style={
        a.photoUrl
          ? {
              backgroundImage: `url(${a.photoUrl})`,
              backgroundSize: "cover",
              backgroundPosition: a.photoFocus
                ? `${a.photoFocus.x}% ${a.photoFocus.y}%`
                : "center 15%",
            }
          : undefined
      }
    >
      {/* Real action-shot photo from World Athletics' own CDN (see api.py's
          load_athlete_photo) as a full banner -- never a stock photo or
          generic avatar; falls back to the app's own track-surface texture
          when no real photo exists, same honesty principle as everywhere
          else in this project. The crop position comes from api.py's real
          face detection (photoFocus, get_photo_focus) run on the actual
          downloaded photo -- these are wide action shots, not pre-cropped
          headshots, so a fixed crop reliably cut faces out of frame on wide
          desktop banners (verified: it cropped Noah Lyles' own face out
          entirely). Falls back to a fixed top-biased "15%" position (still
          better than the original "30%") only when detection found no face.
          A single flat tint strong enough to guarantee text contrast
          (measured worst-case against a near-white photo patch) muddied the
          photo too much to actually see it -- split into two layers
          instead: a light, uniform brand tint for warmth/consistency with
          the rest of the app (barely dims the photo), plus a black scrim
          that's only strong at the bottom, where the name/meter/subtitle
          actually sit, fading to nothing by mid-height so the upper photo
          stays genuinely clear. */}
      {a.photoUrl ? (
        <>
          <div className="absolute inset-0 bg-background/25" />
          {/* Bottom scrim protects the name/subtitle/meter; top scrim
              protects the back link -- both fade to nothing
              well before the vertical middle, so the actual subject of the
              photo (not just its edges) stays clearly visible. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 32%, rgba(0,0,0,0.05) 62%, transparent 78%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%)",
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-background/85" />
      )}
      <div
        className="relative flex h-full flex-col justify-between px-6 pb-6 pt-7 sm:px-8 sm:pt-8"
        style={a.photoUrl ? { textShadow: "0 1px 4px rgba(0,0,0,0.45)" } : undefined}
      >
        {canGoBack ? (
          <button
            type="button"
            onClick={() => router.history.back()}
            className={`label-caps -m-2 p-2 transition-colors hover:text-white ${a.photoUrl ? "text-white/75" : "text-white/60"}`}
          >
            ← Back
          </button>
        ) : (
          <Link
            to="/dashboard"
            className={`label-caps -m-2 p-2 transition-colors hover:text-white ${a.photoUrl ? "text-white/75" : "text-white/60"}`}
          >
            ← Back to dashboard
          </Link>
        )}
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="text-[28px] font-semibold tracking-tight text-white sm:text-[36px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {a.name}
              </h1>
              {a.injuryWatch && <WatchBadge reason={a.injuryReason} url={a.injuryUrl} />}
            </div>
            <p className="mt-1.5 text-[14px] text-white/85">
              {a.disc} · {a.nat} · Rank #{a.rank} predicted
            </p>
          </div>
          <RadialMeter value={a.prob} label="Podium chance" dark size={148} strokeWidth={12} />
        </div>
      </div>
    </div>
  );

  return (
    <Shell title={a.name} hero={hero}>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <Panel title="Season stats">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatBlock label="2026 season best" value={a.mark} icon="target" />
            <StatBlock label="Career best" value={a.careerBest ?? "—"} icon="trophy" />
            <StatBlock
              label="PB gap"
              value={a.pbGap != null ? a.pbGap.toFixed(2) : "—"}
              sub="vs. career best"
              icon="ruler"
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
              sub="in this discipline"
              icon="grid"
            />
            <StatBlock
              label="Last competed"
              value={a.daysSinceLast != null ? `${a.daysSinceLast}d ago` : "—"}
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
              {a.scoreContext.discPercentile.toFixed(0)}th percentile within {a.disc.toLowerCase()},
              where the median is <span className="nums">{a.scoreContext.discMedian}</span>. The two
              readings differ because events differ in depth.
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

        <Panel title="Real season form">
          {a.history.length > 0 ? (
            <SeasonTrendChart history={a.history} year={a.historyYear} />
          ) : (
            <div className="text-[12.5px] text-muted-foreground">
              No prior-season meet history on record for this athlete.
            </div>
          )}
        </Panel>
      </div>

      {a.careerSeasons.length > 1 && (
        <Panel
          title="Career progression"
          subtitle="Best mark in each season on record. A season the athlete did not contest is a gap in the line, not an invented point."
          className="mt-4"
        >
          <CareerProgressionChart
            seasons={a.careerSeasons}
            isField={FIELD_EVENT_KEYS.has(a.discKey)}
          />
        </Panel>
      )}

      {a.analytics && (
        <AthleteAnalyticsBlock analytics={a.analytics} isField={FIELD_EVENT_KEYS.has(a.discKey)} />
      )}

      {/* Kept alongside the derived record above, because it answers a
          different question: this is the athlete against the people they
          will actually face at the Final, scored by the model's rival
          shortlist. The analytics panel is who they race MOST. */}
      <Panel title="Head-to-head vs projected field" className="mt-4">
        {a.h2h.length > 0 ? (
          <HeadToHeadChart matchups={a.h2h} />
        ) : (
          <div className="text-[12.5px] text-muted-foreground">
            No qualifying head-to-head record vs. this discipline's other top picks.
          </div>
        )}
      </Panel>
    </Shell>
  );
}
