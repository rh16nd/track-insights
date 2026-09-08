import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { NatFlag } from "./nat-flag";

/** A photo-led athlete card, in the shape World Athletics uses for its own
 * rankings carousel: the headshot with the event written across the bottom of
 * it, then the name, the nation, a rule in the site's accent, and the one
 * number the card is about.
 *
 * WHY A SHARED COMPONENT. Two views want this — the dashboard's model
 * favourites and each country's best athletes — and they want it to be the
 * same object, not two things that resemble each other. The differences
 * between them are a label and a number, which is what `statLabel`/`stat` are.
 *
 * NO PHOTO IS A NORMAL STATE, not an error. World Athletics has no headshot
 * for roughly a third of athletes, and their own cards show a grey silhouette
 * in that case. This shows the athlete's initials instead: a silhouette says
 * "missing person", a monogram says "this person, no picture", and the second
 * is the true one. */
export function AthleteCard({
  name,
  nat,
  discipline,
  stat,
  statLabel,
  sub,
  photoUrl,
  photoCredit,
  photoFocus,
  to,
  index = 0,
}: {
  name: string;
  nat: string | null;
  /** Written across the foot of the photo, as WA does it. */
  discipline: string;
  stat: string | number;
  statLabel: string;
  /** The athlete's mark, under the name. World Athletics' own card has no
   * equivalent, but a mark is the first thing an athletics reader looks for
   * and both views this replaced were already showing one. */
  sub?: string | null | undefined;
  // `undefined` is spelled out rather than left to the `?`: the project runs
  // with exactOptionalPropertyTypes, under which an optional prop does NOT
  // accept an explicit undefined, and every caller here passes one through
  // from an API field that may be absent.
  photoUrl?: string | null | undefined;
  photoCredit?: { author?: string | null; license?: string | null } | null | undefined;
  /** Where the face is, as a percentage, from the project's cached face
   * detection. World Athletics' asset is an ACTION picture rather than a
   * headshot, so without this the crop lands wherever the photographer left
   * the athlete. Null when detection found no face; the crop then falls back
   * to the top-biased default, exactly as the profile page does. */
  photoFocus?: { x: number; y: number } | null | undefined;
  to?: { discKey: string; name: string } | undefined;
  index?: number | undefined;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const card = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
            style={{
              objectPosition: photoFocus
                ? `${photoFocus.x}% ${photoFocus.y}%`
                : "center 18%",
            }}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="dg text-[40px] font-bold tracking-tight text-muted-foreground/45">
              {initials}
            </span>
          </div>
        )}
        {/* The event label sits on the photo, so it needs its own ground
            rather than trusting whatever the photo happens to be behind it —
            a pale sky and a dark track are both possible and only one of them
            carries white text. */}
        <span className="label-caps absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-white">
          {discipline}
        </span>
        {photoCredit?.author && (
          <span className="absolute right-1.5 top-1.5 rounded bg-black/45 px-1.5 py-0.5 text-[9px] leading-tight text-white/85">
            {photoCredit.author}
            {photoCredit.license ? ` · ${photoCredit.license}` : ""}
          </span>
        )}
      </div>
      <div className="px-4 pb-4 pt-3.5">
        <div className="truncate text-[15px] font-semibold text-foreground">{name}</div>
        <div className="mt-1 flex items-center gap-2.5">
          <NatFlag nat={nat ?? "—"} />
          {sub && <span className="nums text-[12px] text-muted-foreground">{sub}</span>}
        </div>
        <div className="mt-2.5 h-px w-14 bg-terracotta" />
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="label-caps text-muted-foreground">{statLabel}</span>
          <span className="nums text-[17px] font-semibold text-foreground">{stat}</span>
        </div>
      </div>
    </>
  );

  const shell =
    "card-surface group block overflow-hidden rounded-[14px] border border-border bg-card transition-[transform,box-shadow] duration-150 ease-out";

  if (!to) {
    return (
      <div className={`stagger-item ${shell}`} style={{ "--stagger-i": index } as CSSProperties}>
        {card}
      </div>
    );
  }
  return (
    <Link
      to="/athlete/$discKey/$name"
      params={to}
      className={`stagger-item ${shell} hover:-translate-y-0.5 hover:shadow-lg`}
      style={{ "--stagger-i": index } as CSSProperties}
    >
      {card}
    </Link>
  );
}
