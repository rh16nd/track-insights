import { IOC_TO_ISO2 } from "@/lib/flags";

/** A nationality cell: the small flag followed by World Athletics' own 3-letter
 * IOC code. The code stays the source of truth and the accessible label — the
 * flag is a scannable visual aid, not a replacement — so the image is marked
 * decorative (`alt=""`) and the code carries the meaning for assistive tech.
 *
 * The flag SVGs are served from `public/flags/` (same origin, so the enforced
 * CSP's `img-src 'self'` already allows them — no whitelist change). A nation
 * with no verified IOC→ISO2 mapping renders as just the code, no broken image.
 *
 * A hairline ring contains flags whose own edge is white or pale (Japan, the
 * Nordic crosses) against the cream card, so they read as a distinct object
 * rather than bleeding into the surface. */
export function NatFlag({ nat, className = "" }: { nat: string; className?: string }) {
  const iso = IOC_TO_ISO2[nat];
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {iso && (
        <img
          src={`/flags/${iso}.svg`}
          alt=""
          width={16}
          height={12}
          loading="lazy"
          decoding="async"
          className="h-3 w-4 shrink-0 rounded-[2px] object-cover ring-1 ring-black/[0.08]"
        />
      )}
      <span className="nums text-[12px] text-muted-foreground">{nat}</span>
    </span>
  );
}
