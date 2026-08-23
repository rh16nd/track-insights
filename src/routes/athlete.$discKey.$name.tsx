import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Panel, WatchBadge } from "@/components/dl/shell";
import { useAthleteProfile } from "@/hooks/useAthleteProfile";
import { SeasonTrendChart } from "@/components/dl/season-trend-chart";
import { HeadToHeadChart } from "@/components/dl/head-to-head-chart";
import { RadialMeter } from "@/components/dl/radial-meter";

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

  if (state.status === "loading") {
    return (
      <Shell title="Athlete">
        <div className="card-shadow flex h-64 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
          Loading athlete profile…
        </div>
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell title="Athlete">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          <div className="mb-1 font-semibold">Could not load athlete profile</div>
          <div>{state.message}</div>
        </div>
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
              backgroundPosition: "center 15%",
            }
          : undefined
      }
    >
      {/* Real action-shot photo from World Athletics' own CDN (see api.py's
          load_athlete_photo) as a full banner -- never a stock photo or
          generic avatar; falls back to the app's own track-surface texture
          when no real photo exists, same honesty principle as everywhere
          else in this project. A single flat tint strong enough to
          guarantee text contrast (measured worst-case against a
          near-white photo patch) muddied the photo too much to actually
          see it -- split into two layers instead: a light, uniform brand
          tint for warmth/consistency with the rest of the app (barely
          dims the photo), plus a black scrim that's only strong at the
          bottom, where the name/meter/subtitle actually sit, fading to
          nothing by mid-height so the upper photo stays genuinely clear. */}
      {a.photoUrl ? (
        <>
          <div className="absolute inset-0 bg-background/25" />
          {/* Bottom scrim protects the name/subtitle/meter; top scrim
              protects the "Back to dashboard" link -- both fade to nothing
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
        <Link
          to="/dashboard"
          className={`label-caps transition-colors hover:text-white ${a.photoUrl ? "text-white/75" : "text-white/60"}`}
        >
          ← Back to dashboard
        </Link>
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
          <RadialMeter value={a.prob} label="Win probability" dark size={148} strokeWidth={12} />
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
            <StatBlock label="Age" value={a.age != null ? a.age.toFixed(1) : "—"} icon="calendar" />
            <StatBlock
              label="Meets this season"
              value={a.meetsCount != null ? String(a.meetsCount) : "—"}
              icon="grid"
            />
            <StatBlock
              label="Last raced"
              value={a.daysSinceLast != null ? `${a.daysSinceLast}d ago` : "—"}
              icon="clock"
            />
          </div>
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

      <Panel title="Head-to-head" className="mt-4">
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
