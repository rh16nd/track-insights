import { Link } from "@tanstack/react-router";
import type { Storyline } from "@/lib/dl-data";

const ICONS: Record<string, string[]> = {
  photo_finish: ["M10 2v16M2 10h16"],
  injury_watch: ["M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z", "M10 6v4.5M10 13.2v.1"],
  returning_champion: [
    "M6 3h8v4a4 4 0 0 1-8 0V3Z",
    "M6 4H3.5A1.5 1.5 0 0 0 2 5.5C2 7 3 8 4.5 8H6",
    "M14 4h2.5A1.5 1.5 0 0 1 18 5.5C18 7 17 8 15.5 8H14",
  ],
  debutant: ["M10 2l2.2 4.5 5 .7-3.6 3.5.85 5-4.45-2.3-4.45 2.3.85-5L2.8 7.2l5-.7L10 2Z"],
  rivalry: ["M6 6l8 8M14 6l-8 8"],
  hot_streak: ["M4 16c3-1 3-5 6-6s3 4 6-6", "M14 3h3v3"],
};

const DEFAULT_ICON = ["M10 2v3M10 15v3M2 10h3M15 10h3"];

function StorylineIcon({ type }: { type: string }) {
  const paths = ICONS[type] ?? DEFAULT_ICON;
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[14px]"
      aria-hidden
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

function AthleteLinks({ discKey, names }: { discKey: string; names: string[] }) {
  return (
    <>
      {names.map((n, i) => (
        <span key={n}>
          {i > 0 && <span className="text-muted-foreground"> vs. </span>}
          <Link
            to="/athlete/$discKey/$name"
            params={{ discKey, name: n }}
            className="text-foreground underline decoration-border underline-offset-2 transition-colors hover:text-terracotta-strong hover:decoration-terracotta-strong"
          >
            {n}
          </Link>
        </span>
      ))}
    </>
  );
}

/** Real, computed narrative angles for the selected discipline (see api.py's
 * build_storylines). Each one's real `stat` value is the visual anchor --
 * not an icon-plus-paragraph card, which is the generic template a real
 * number should never hide behind. The first (strongest) storyline gets a
 * featured treatment; the rest read as a plain divided list, not a grid of
 * same-size boxes -- rhythm comes from scale and spacing, not a border. */
export function StorylineCards({
  storylines,
  discKey,
}: {
  storylines: Storyline[];
  discKey: string;
}) {
  if (storylines.length === 0) {
    return (
      <div className="text-[12.5px] text-muted-foreground">
        No standout storylines for this discipline right now. Check back as the season progresses.
      </div>
    );
  }
  const [featured, ...rest] = storylines;
  if (!featured) return null;

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-border pb-5">
        <span className="nums shrink-0 text-[40px] font-semibold leading-none text-terracotta-strong sm:text-[48px]">
          {featured.stat}
        </span>
        <div className="min-w-[220px] flex-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <StorylineIcon type={featured.type} />
            <span className="label-caps">{featured.title}</span>
          </div>
          <p className="mt-1 max-w-lg text-[13.5px] leading-relaxed text-foreground">
            <AthleteLinks discKey={discKey} names={featured.athletes} />
            {" — "}
            {featured.text}
          </p>
        </div>
      </div>

      {rest.length > 0 && (
        <ul className="divide-y divide-border">
          {rest.map((s, i) => (
            <li
              key={i}
              className="stagger-item flex items-center gap-4 py-3.5"
              style={{ "--stagger-i": i + 1 } as React.CSSProperties}
            >
              <span className="nums w-20 shrink-0 text-[19px] font-semibold text-foreground">
                {s.stat}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <StorylineIcon type={s.type} />
                  <span className="label-caps">{s.title}</span>
                </div>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">
                  <span className="text-foreground">
                    <AthleteLinks discKey={discKey} names={s.athletes} />
                  </span>{" "}
                  — {s.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
