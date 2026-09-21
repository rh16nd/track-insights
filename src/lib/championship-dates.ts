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

/** How far a time zone is ahead of UTC at an instant, in milliseconds. */
function zoneOffset(at: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(at));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  const wall = Date.UTC(
    part("year"),
    part("month") - 1,
    part("day"),
    part("hour"),
    part("minute"),
    part("second"),
  );
  return wall - Math.floor(at / 1000) * 1000;
}

/** The instant a date's midnight arrives in a championship's own time zone, so
 * a countdown to Nagoya reads the same in Paris and in Tokyo. Without a zone,
 * the reader's own midnight. */
export function zonedMidnight(date: string, timeZone?: string): number {
  if (!timeZone) return new Date(`${date}T00:00:00`).getTime();
  const [y = 1970, m = 1, d = 1] = date.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d);
  let at = utc - zoneOffset(utc, timeZone);
  // Once more, for the rare zone whose offset changes that night.
  const again = utc - zoneOffset(at, timeZone);
  if (again !== at) at = again;
  return at;
}
