// dl-data.ts — all data fetched live from Flask API at localhost:5000
// Run `python api.py` in your athletics-predictor folder first
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
  injuryWatch: boolean;
  injuryReason: string | null;
  injuryUrl: string | null;
};

/** `athletes` is the CONFIRMED Diamond League field and nothing else -- every
 * model-derived figure on the site (top winners, confidence, storylines, the
 * favourite) reads it, so a non-qualified athlete leaking in would be
 * presented as a projected finalist. `nearMiss` carries the next-fastest
 * athletes who are NOT in WA's standings: scored by the same model, shown
 * separately, never numbered. */
export type Discipline = {
  id: string;
  label: string;
  /** Places this discipline has at the Final (6 field / 10 long distance /
   * 8 otherwise). NOT the same as athletes.length -- an injury removal
   * leaves the projected field a place short. */
  qualLimit: number;
  athletes: Athlete[];
  nearMiss?: Athlete[];
};

export type RemovedAthlete = {
  name: string;
  disciplines: string[];
  reason: string | null;
  url: string | null;
};

export type MeetMark = {
  date: string;
  mark: string;
  markValue: number | null;
  venue: string;
  resultsScore: number | null;
};

export type H2hMatchup = {
  opponent: string;
  wins: number;
  losses: number;
  meetings: number;
};

export type TopWinner = {
  rank: number;
  name: string;
  disc: string;
  discKey: string;
  mark: string;
  prob: number;
  waUrl: string;
  injuryWatch: boolean;
  injuryReason: string | null;
  injuryUrl: string | null;
};

// Full detail for one athlete's profile page, from /api/athlete/<discKey>/<name>.
export type AthleteProfile = {
  name: string;
  discKey: string;
  disc: string;
  nat: string;
  rank: number;
  mark: string;
  careerBest: string | null;
  pbGap: number | null;
  age: number | null;
  meetsCount: number | null;
  daysSinceLast: number | null;
  prob: number;
  waUrl: string;
  photoUrl: string | null;
  photoFocus: { x: number; y: number } | null;
  injuryWatch: boolean;
  injuryReason: string | null;
  injuryUrl: string | null;
  history: MeetMark[];
  historyYear: number | null;
  h2h: H2hMatchup[];
};

export type ApiData = {
  lastUpdated: string;
  daysToFinal: number;
  /** The number the site should quote about itself: top-3 hit rate among
   * the athletes who actually contested the Final -- the task run.py
   * performs. Distinct from `modelAccuracyToplist`, the historical figure
   * that picks 3 from a discipline's whole ~101-athlete toplist, which the
   * site never does. Same predictions, ~12 points apart. */
  modelAccuracy: number;
  modelAccuracyBasis: string;
  modelAccuracyToplist: number | null;
  meets: Meet[];
  trackDisciplines: Discipline[];
  fieldDisciplines: Discipline[];
  removedAthletes: RemovedAthlete[];
  topWinners: TopWinner[];
  confidence: { disc: string; value: number }[];
};

export const API_URL = "http://localhost:5000/api/predictions";

export const statusLabel: Record<MeetStatus, string> = {
  done: "Done",
  next: "Next up",
  upcoming: "Upcoming",
  final: "Final",
};

// Real per-discipline detail for the Projections page, from
// /api/projections/<discKey> -- replaces the old client-side fabricated
// trajectory (see git history: parseMark/trajectoryFor/trajectoryDomain/
// TRAJECTORY_MEETS, a smoothed curve toward the model's projection that
// didn't reflect which meets an athlete actually competed in).
export type Trajectory = {
  name: string;
  rank: number;
  prob: number;
  historyYear: number | null;
  history: MeetMark[];
};

export type Storyline = {
  type: string;
  title: string;
  stat: string;
  text: string;
  athletes: string[];
};

export type ProjectionsDetail = {
  trajectories: Trajectory[];
  storylines: Storyline[];
};

/** The race for a place at the Final, from World Athletics' own Diamond
 * League standings (/api/qualification). Nothing here is modelled -- points
 * are WA's, and the verdicts are arithmetic:
 *   safe    — cannot be displaced even scoring nothing again
 *   in      — above the cut line as it stands, but still catchable
 *   chasing — below the line and still mathematically alive
 *   out     — cannot reach the cut even by winning everything left
 *   unknown — WA lists no points for this athlete
 * Note `meetingsLeft`: with nothing left to win, `in` and `chasing` no
 * longer mean "catchable" or "alive" -- they can only be produced by a
 * points TIE across the cut line, which World Athletics' own tie-break
 * settles. The qualification page renders those two states differently
 * in that case; anything else consuming them must do the same. */
export type QualStatus = "safe" | "in" | "chasing" | "out" | "unknown";

export type QualificationRow = {
  rank: number;
  name: string;
  country: string | null;
  events: number | null;
  points: number | null;
  /** Points behind the cut line. Negative means clear of it, 0 means on it. */
  gap: number | null;
  /** Current points plus everything still winnable. */
  maxPoints: number | null;
  status: QualStatus;
};

export type QualificationDiscipline = {
  discKey: string;
  disc: string;
  isField: boolean;
  qualLimit: number;
  cutPoints: number | null;
  standings: QualificationRow[];
};

/** One athlete's row in WA's full standings, as attached to the
 * "why isn't X in the field?" answer. */
export type StandingsPosition = QualificationRow & {
  qualLimit: number;
  cutPoints: number | null;
};

export type QualificationData = {
  scrapedAt: string | null;
  meetingsLeft: number;
  nextMeet: Meet | null;
  pointsForAWin: number;
  disciplines: QualificationDiscipline[];
};

/** 1st/2nd/3rd/4th... including the 11-13 exceptions, which a bare
 * last-digit check gets wrong ("11st"). */
export const ordinal = (n: number): string => {
  const suffix =
    n % 100 >= 11 && n % 100 <= 13
      ? "th"
      : n % 10 === 1
        ? "st"
        : n % 10 === 2
          ? "nd"
          : n % 10 === 3
            ? "rd"
            : "th";
  return `${n}${suffix}`;
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
