import { Link } from "@tanstack/react-router";
import type { ChampionshipCall } from "@/lib/dl-data";
import { ordinalIn } from "@/lib/dl-data";
import { localeTag } from "@/lib/dates";
import { useT } from "@/lib/i18n";
import { Panel } from "./shell";

/** Where an athlete stands in the current championship's call, on their page.
 *
 * Added 2026-09-14 along with pages for the Asian Games entrants who are on no
 * world toplist. For them the call is why the page exists, so it says it in the
 * call's own terms: a place on points, a place and a podium chance where the
 * model called the event, or why they could not be ranked at all. */
export function ChampionshipCallPanel({ call }: { call: ChampionshipCall }) {
  const { t, lang } = useT();
  const chance =
    call.podiumChance === null
      ? "—"
      : new Intl.NumberFormat(localeTag(lang), { maximumFractionDigits: 1 }).format(
          call.podiumChance,
        );
  const sentence =
    call.rank === null
      ? t(`championship.projection.unranked.${call.unranked ?? "noMark"}`)
      : call.method === "points"
        ? t("ath.champ.points", {
            rank: ordinalIn(lang, call.rank),
            n: call.ranked,
            score: call.rankingScore ?? "—",
          })
        : t("ath.champ.model", { rank: ordinalIn(lang, call.rank), n: call.ranked, chance });

  return (
    <Panel title={t(call.labelKey)} subtitle={t("ath.champ.subtitle")} className="mt-6">
      <p className="max-w-2xl text-[14px] leading-relaxed text-foreground">{sentence}</p>
      <Link
        to="/championship"
        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-terracotta/40 px-3.5 py-1.5 text-[12.5px] font-semibold text-terracotta-strong transition-[transform,background-color,border-color] duration-150 ease-out hover:border-terracotta hover:bg-terracotta/[0.07] active:scale-[0.97]"
      >
        {t("ath.champ.link")}
      </Link>
    </Panel>
  );
}
