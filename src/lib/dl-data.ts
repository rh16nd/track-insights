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

export type Discipline = { id: string; label: string; athletes: Athlete[] };

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
  modelAccuracy: number;
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

export const formatMark = (value: number, sample: string): string => {
  if (sample.endsWith("m")) return `${value.toFixed(2)}m`;
  if (sample.includes(":")) {
    const m = Math.floor(value / 60);
    const s = value - m * 60;
    return `${m}:${s.toFixed(2).padStart(5, "0")}`;
  }
  return value.toFixed(2);
};

