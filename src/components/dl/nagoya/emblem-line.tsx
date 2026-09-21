import { useInView } from "@/hooks/useInView";
import { ASIAN_GAMES_STRIPE } from "@/lib/championship-themes";

/** The Aichi-Nagoya emblem's purple, gold and green line, as the page's
 * divider between sections. It draws itself in from the left the first time it
 * comes into view, and is simply there under reduced motion. */
export function EmblemLine({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.6);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-in={inView}
      className={`emblem-line flex h-1 w-full overflow-hidden rounded-full ${className}`}
    >
      {ASIAN_GAMES_STRIPE.map((colour) => (
        <span key={colour} className="flex-1" style={{ backgroundColor: colour }} />
      ))}
    </div>
  );
}
