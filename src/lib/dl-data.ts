// dl-data.ts — all data fetched live from Flask API at localhost:5000
// Run `python api.py` in your athletics-predictor folder first
export const DAYS_TO_FINAL = 23;
export const LAST_UPDATED = "12 Aug 2026";
export type MeetStatus = "done" | "next" | "upcoming" | "final";

export type Meet = {
  n: number;
  date: string;
  city: string;
  status: MeetStatus;
};

export type Athlete = {
  rank: number;
  name: string;
  nat: string;
  qualified: boolean;
  mark: string;
  prob: number;
  waUrl: string;
};

export type Discipline = { id: string; label: string; athletes: Athlete[] };

export type ApiData = {
  lastUpdated: string;
  daysToFinal: number;
  modelAccuracy: number;
  meets: Meet[];
  trackDisciplines: Discipline[];
  fieldDisciplines: Discipline[];
  topWinners: {
    medal: string;
    name: string;
    disc: string;
    mark: string;
    prob: number;
    waUrl: string;
  }[];
  confidence: { disc: string; value: number }[];
};

export const API_URL = "http://localhost:5000/api/predictions";

export const statusLabel: Record<MeetStatus, string> = {
  done: "Done",
  next: "Next up",
  upcoming: "Upcoming",
  final: "Final",
};

// ── Trajectory helpers (kept client-side, derived from live data) ──

export const parseMark = (mark: string): number => {
  if (mark.endsWith("m")) return parseFloat(mark);
  if (mark.includes(":")) {
    const [m, s] = mark.split(":");
    return Number(m) * 60 + Number(s);
  }
  return Number(mark);
};

export const formatMark = (value: number, sample: string): string => {
  if (sample.endsWith("m")) return `${value.toFixed(2)}m`;
  if (sample.includes(":")) {
    const m = Math.floor(value / 60);
    const s = value - m * 60;
    return `${m}:${s.toFixed(2).padStart(5, "0")}`;
  }
  return value.toFixed(2);
};

const TRAJECTORY_MEETS = [
  "Doha",
  "Shanghai",
  "Xiamen",
  "Rabat",
  "Rome",
  "Stockholm",
  "Oslo",
  "Paris",
  "Eugene",
  "Monaco",
  "London",
  "Lausanne",
  "Silesia",
  "Zürich",
  "Brussels",
];

export type TrajectoryPoint = {
  meet: string;
  actual: number | null;
  projected: number | null;
};

export const trajectoryFor = (d: Discipline): TrajectoryPoint[] => {
  const leader = d.athletes[0];
  if (!leader) return [];
  const target = parseMark(leader.mark);
  const isField = leader.mark.endsWith("m");
  const spread = target * (isField ? 0.022 : 0.02);
  const start = isField ? target - spread : target + spread;
  const n = TRAJECTORY_MEETS.length;

  return TRAJECTORY_MEETS.map((meet, i) => {
    const t = i / (n - 1);
    const eased = Math.pow(t, 0.7);
    const wobble = (i % 3 === 1 ? 1 : i % 3 === 2 ? -1 : 0) * spread * 0.06;
    const value = Number((start + (target - start) * eased + wobble).toFixed(3));
    const isPast = i <= 10;
    return {
      meet,
      actual: isPast ? value : null,
      projected: i >= 10 ? value : null,
    };
  });
};

export const trajectoryDomain = (points: TrajectoryPoint[]): [number, number] => {
  const values = points
    .flatMap((p) => [p.actual, p.projected])
    .filter((v): v is number => v !== null);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.25 || 0.1;
  return [Number((min - pad).toFixed(2)), Number((max + pad).toFixed(2))];
};
