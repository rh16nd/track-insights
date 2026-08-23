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
      className="size-[18px]"
      aria-hidden
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Real, computed narrative angles for the selected discipline (see api.py's
 * build_storylines) -- a discipline with a thin real storyline crop (e.g.
 * no debutants, no close probability gap) simply renders fewer cards
 * rather than a filler one, so every card here is backed by a real,
 * checkable number, never generic copy. */
export function StorylineCards({ storylines }: { storylines: Storyline[] }) {
  if (storylines.length === 0) {
    return (
      <div className="text-[12.5px] text-muted-foreground">
        No standout real storylines for this discipline right now — check back as the season
        progresses.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {storylines.map((s, i) => (
        <div
          key={i}
          className="stagger-item rounded-lg border border-border bg-secondary/30 p-3.5"
          style={{ "--stagger-i": i } as React.CSSProperties}
        >
          <div className="flex items-center gap-2 text-terracotta-strong">
            <StorylineIcon type={s.type} />
            <span className="label-caps text-foreground">{s.title}</span>
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{s.text}</p>
        </div>
      ))}
    </div>
  );
}
