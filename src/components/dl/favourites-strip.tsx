import type { ReactNode } from "react";
import { BareFrame } from "@/components/dl/bare-frame";
import { StripArrow } from "@/components/dl/side-strip";
import { STRIP_ITEM, STRIP_ROW, useSideStrip } from "@/hooks/useSideStrip";
import { useT } from "@/lib/i18n";

/** The dashboard's favourites as one sideways row of photo cards, with no box
 * around it (the user, 2026-09-22: a strip to go through every athlete, keeping
 * the big photo cards). Swipe or scroll it, or page through with the arrows;
 * each stop snaps to a card's edge. */
export function FavouritesStrip({
  title,
  subtitle,
  action,
  count,
  renderCard,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  count: number;
  renderCard: (index: number) => ReactNode;
}) {
  const { t } = useT();
  const { row, edge, page } = useSideStrip<HTMLUListElement>(count);

  return (
    <BareFrame
      level={2}
      title={title}
      subtitle={subtitle}
      className="mt-14"
      action={
        <div className="flex items-center gap-4">
          {action}
          <div className="flex items-center gap-2">
            <StripArrow
              dir={-1}
              disabled={edge.start}
              onPage={page}
              label={t("dashboard.favourites.prev")}
            />
            <StripArrow
              dir={1}
              disabled={edge.end}
              onPage={page}
              label={t("dashboard.favourites.next")}
            />
          </div>
        </div>
      }
    >
      {/* `favourites-strip` also names this row for the intro video's director. */}
      <ul
        ref={row}
        aria-label={t("dashboard.favourites.stripLabel")}
        className={`favourites-strip ${STRIP_ROW}`}
      >
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className={STRIP_ITEM}>
            {renderCard(i)}
          </li>
        ))}
      </ul>
    </BareFrame>
  );
}
