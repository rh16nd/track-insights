import type { Lang } from "@/lib/i18n";
import { localeTag } from "@/lib/dates";

export type Phase = "upcoming" | "live" | "done";

type Dated = { startDate: string; endDate: string };

/** Where a championship stands today, and how many whole days until it starts. */
export function phaseOf(ev: Dated, now = new Date()): { phase: Phase; days: number } {
  const start = new Date(`${ev.startDate}T00:00:00`);
  const end = new Date(`${ev.endDate}T23:59:59`);
  const days = Math.max(0, Math.ceil((start.getTime() - now.getTime()) / 86_400_000));
  const phase: Phase = now < start ? "upcoming" : now <= end ? "live" : "done";
  return { phase, days };
}

/** "23–29 September 2026", with the month in the reader's language. */
export function dateRange(ev: Dated, lang: Lang): string {
  const start = new Date(`${ev.startDate}T00:00:00`);
  const end = new Date(`${ev.endDate}T00:00:00`);
  const month = new Intl.DateTimeFormat(localeTag(lang), { month: "long" }).format(end);
  return `${start.getDate()}–${end.getDate()} ${month} ${end.getFullYear()}`;
}
