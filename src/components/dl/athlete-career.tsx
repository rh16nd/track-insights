import { useT } from "@/lib/i18n";
import { Panel } from "@/components/dl/shell";
import type { AthleteCareer, HonourGroup } from "@/lib/dl-data";

/** What an athlete has already won, and where World Athletics ranks them.
 *
 * Every figure here is READ from World Athletics rather than computed by
 * this project — which is the whole reason it sits apart from the analytics
 * block, whose numbers are all derived from the race log. A reader should be
 * able to tell at a glance which claims are WA's and which are ours.
 *
 * The medal counts are podium places only. A sixth at the Olympics is a real
 * result and stays in the detail below, but it is not a credential. */
export function AthleteCareerBlock({ career }: { career: AthleteCareer }) {
  const { headline, honours, worldRanking, personalBests, eventCount } = career;
  const ranked = worldRanking.events.slice(0, 3);
  const { t } = useT();
  const decorated = honours.filter((h) => h.podiums > 0);

  return (
    <Panel
      title={t("car.title")}
      subtitle={t("car.subtitle")}
      className="mt-4"
    >
      {/* The one line worth reading if you read nothing else here. Built
          only from global titles, falling back to continental ones named in
          full — an age-group, national or NCAA title never reaches it, so
          "champion" here always means a championship worth the word. */}
      {headline && (
        <p className="mb-5 text-[15px] font-semibold leading-snug text-gold-strong">{headline}</p>
      )}

      {(ranked.length > 0 || worldRanking.overall !== null) && (
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          {ranked.map((r) => (
            <div key={r.event}>
              <div className="label-caps text-muted-foreground">{r.event}</div>
              <div className="nums mt-1 text-[26px] font-semibold leading-none text-foreground">
                #{r.place}
              </div>
              <div className="mt-1 text-[11.5px] text-muted-foreground">{t("car.worldRanking")}</div>
            </div>
          ))}
          {worldRanking.overall !== null && (
            <div>
              <div className="label-caps text-muted-foreground">{t("car.overall")}</div>
              <div className="nums mt-1 text-[26px] font-semibold leading-none text-muted-foreground">
                #{worldRanking.overall}
              </div>
              <div className="mt-1 text-[11.5px] text-muted-foreground">{t("car.acrossAllEvents")}</div>
            </div>
          )}
        </div>
      )}

      {decorated.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-left">
            <caption className="label-caps pb-2 text-left text-muted-foreground">
              {t("car.honours")}
            </caption>
            <thead>
              <tr className="label-caps border-b border-border text-muted-foreground">
                <th scope="col" className="pb-2 pr-2 font-semibold">
                  {t("car.colChampionship")}
                </th>
                <th scope="col" className="w-14 pb-2 pl-3 text-right font-semibold">
                  {t("car.colGold")}
                </th>
                <th scope="col" className="w-14 pb-2 pl-3 text-right font-semibold">
                  {t("car.colSilver")}
                </th>
                <th scope="col" className="w-14 pb-2 pl-3 text-right font-semibold">
                  {t("car.colBronze")}
                </th>
                <th scope="col" className="w-20 pb-2 pl-3 text-right font-semibold">
                  {t("car.colEntries")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {decorated.map((h) => (
                <HonourRow key={h.category ?? "unlabelled"} honour={h} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {personalBests.length > 0 && (
        <p className="mt-5 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
          {t("car.pbBefore")}
          <span className="nums font-medium text-foreground">{eventCount}</span>{" "}
          {t(eventCount === 1 ? "car.event" : "car.events")}
          {eventCount >= 4 && t("car.pbRange")}
          {t("car.pbAfter")}
        </p>
      )}
    </Panel>
  );
}

/** Gold reads gold; silver and bronze stay muted rather than getting invented
 * metallic tints, which at this size would be two more low-contrast greys
 * pretending to carry meaning. A zero is a dash: nought golds is not a
 * number anyone needs to read. */
function HonourRow({ honour }: { honour: HonourGroup }) {
  const cell = (n: number, gold = false) =>
    n === 0 ? (
      <span className="text-muted-foreground/50">—</span>
    ) : (
      <span className={gold ? "font-semibold text-gold-strong" : "text-foreground"}>{n}</span>
    );
  return (
    <tr className="transition-colors hover:bg-secondary/40">
      <td className="py-2.5 pr-2 text-[13px] text-foreground">{honour.category ?? "Other"}</td>
      <td className="nums py-2.5 pl-3 text-right text-[13px]">{cell(honour.gold, true)}</td>
      <td className="nums py-2.5 pl-3 text-right text-[13px]">{cell(honour.silver)}</td>
      <td className="nums py-2.5 pl-3 text-right text-[13px]">{cell(honour.bronze)}</td>
      <td className="nums py-2.5 pl-3 text-right text-[12.5px] text-muted-foreground">
        {honour.results.length}
      </td>
    </tr>
  );
}
