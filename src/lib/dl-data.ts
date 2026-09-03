// dl-data.ts — types for everything the Flask API serves.
// The API's location lives in lib/api.ts (VITE_API_BASE_URL, defaulting to
// http://localhost:5000); run `python api.py` in your athletics-predictor
// folder for the local default.
export type MeetStatus = "done" | "next" | "upcoming" | "final";

export type Meet = {
  n: number;
  /** First day, "%d %b". Four 2026 meetings run over two days. */
  date: string;
  /** Last day, only present when the meeting spans more than one. */
  dateEnd?: string;
  city: string;
  status: MeetStatus;
  /** Set on every leg World Athletics tags "DF". Usually one meeting, but
   * the Final has been split across two before (2018, 2019), which is why
   * this is a flag and not "the last meeting of the season". */
  final?: boolean;
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
  /** Days since they last competed ANYWHERE, not just at a Diamond League
   * meeting. The DL-only figure overstated the gap for 30 of 237 in-field
   * athletes — one read "71d ago" having raced 19 days earlier elsewhere —
   * and the label carries no qualifier, so it has to mean what it says. */
  daysSinceLast: number | null;
  lastRaceDate: string | null;
  /** Every competition, where meetsCount counts Diamond League meetings
   * only. Reported separately rather than replacing it: the two count
   * different things and the tiles say which. */
  racesThisSeason: number;
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
  /** Season-by-season bests. The other axis from `history`, which is one
   * season race by race. Empty for an athlete with nothing on record. */
  careerSeasons: CareerSeason[];
  /** null when the athlete has no row in this season's toplist. */
  scoreContext: ScoreContext | null;
  /** null until src/worldwide_scraper.py has run for this discipline. */
  analytics: AthleteAnalytics | null;
  /** null when no profile has been fetched for this athlete —
   * athlete_profile_scraper covers the athletes the site renders pages for,
   * not all 7,628 in the race log. */
  career: AthleteCareer | null;
  /** The model's rival shortlist. Used to mark, inside the single
   * head-to-head panel, which opponents this athlete will actually meet at
   * the Final -- the separate "vs projected field" panel was removed once
   * it drew the same derived numbers and became a duplicate. */
  rivalNames: string[];
};

export type ConfidenceRow = {
  disc: string;
  discKey: string;
  value: number;
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
  /** Every discipline's favourite's podium probability, strongest first.
   * All 32, not a truncated list -- the dashboard reads the WEAK end. */
  confidence: ConfidenceRow[];
};

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
  /** null when the race log has fewer than two of this field's athletes. */
  fieldAnalysis: FieldAnalysis | null;
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

/** Cross-discipline performance stats (/api/stats), built on World
 * Athletics' own Results Score -- the only number in this dataset that
 * compares a shot putter to a 1500m runner. Nothing else on the site can
 * rank across events, so this is its own endpoint rather than part of
 * /api/predictions. */
export type Performance = {
  athlete: string;
  discKey: string;
  disc: string;
  isField: boolean;
  mark: string;
  score: number;
  venue: string | null;
  date: string | null;
  /** WA writes indoor marks into its outdoor toplists, tagged only by a
   * "(i)" venue suffix. They are kept, never silently filtered -- for a
   * vault or a shot put indoors is arguably the truer measure -- but they
   * are always labelled so no indoor mark reads as an outdoor one. */
  indoor: boolean;
};

export type DisciplineDepth = {
  discKey: string;
  disc: string;
  isField: boolean;
  athletes: number;
  medianScore: number;
  topScore: number;
  indoorShare: number;
};

export type StatsData = {
  season: number;
  topPerformances: Performance[];
  disciplineDepth: DisciplineDepth[];
  scoreScale: { min: number; max: number; median: number; rows: number } | null;
  indoor: { rows: number; total: number; share: number } | null;
  /** What the model was trained on, counted off the training files rather
   * than described in prose. `competitions` is distinct (venue, date) pairs:
   * the raw rows carry where and when but no meeting id, so a two-day
   * meeting counts twice -- it is a count of competition days, which is why
   * `venues` is reported beside it. Null when no training files are present. */
  corpus: {
    marks: number;
    seasons: number;
    firstSeason: number | null;
    lastSeason: number | null;
    venues: number;
    competitions: number;
  } | null;
};

/** One season's best for an athlete, assembled across every source that
 * carries a dated mark. `indoorMarks` is reported rather than filtered:
 * in the vertical jumps that can be half the data, and a progression line
 * that hides it is a claim the data cannot make. */
export type CareerSeason = {
  year: number;
  /** Numeric, for plotting -- seconds or metres. */
  best: number;
  bestMark: string;
  marks: number;
  indoorMarks: number;
};

/** Where an athlete's season best sits on World Athletics' scoring table.
 * `percentile` is across ALL disciplines -- the whole reason for using WA's
 * score -- while `discPercentile` keeps the within-event reading. The two
 * genuinely differ: Ingebrigtsen's 2026 best is 92.8 overall but 76.0 in
 * the men's 1500m, because that event is deep. */
export type ScoreContext = {
  score: number;
  percentile: number;
  discPercentile: number;
  discMedian: number;
  indoor: boolean;
  venue: string | null;
};

/** Analyst-grade race-log statistics (api.py -> src/athlete_analytics.py).
 * Computed from every scraped final an athlete has contested, not from a
 * season-best row -- which is only possible since the worldwide scrape
 * took the median athlete from 2 logged races a season to 5+.
 *
 * Note there is deliberately no season best in `form`: `careerSeasons`
 * owns that number, computed from the toplist, which carries an athlete's
 * real best wherever it was set. The two genuinely disagree (Kovacs's real
 * 2018 best is 21.02m; the best race in the log is 20.36m), and showing
 * both would put two different figures for one season on one page. */
export type TierRecord = {
  tier: string | null;
  label: string;
  races: number;
  wins: number;
  podiums: number;
  avgFinish: number;
};

export type SeasonRecord = {
  year: number;
  races: number;
  wins: number;
  podiums: number;
};

export type CompetitionRecord = {
  races: number;
  wins: number;
  podiums: number;
  winRate: number;
  podiumRate: number;
  avgFinish: number;
  bestFinish: number;
  /** Diamond League, continental championships and Continental Tour Gold.
   * A count and a share, never a quality score -- the categories are World
   * Athletics' own and are not comparable on one axis. */
  topTierRaces: number;
  topTierShare: number;
  byTier: TierRecord[];
  bySeason: SeasonRecord[];
  seasons: number;
};

export type SeasonForm = {
  year: number;
  marks: number;
  /** Not for display -- see the note above. */
  bestLogged: number;
  top3Average: number;
  top3Count: number;
  median: number;
  /** Coefficient of variation as a percent. Null below 3 marks, where it
   * would be noise wearing two decimal places. */
  consistency: number | null;
  spread: number;
};

export type SeasonShape = {
  byMonth: { month: string; races: number }[];
  bestMonth: string | null;
  firstRace: string;
  lastRace: string;
  races: number;
};

export type DerivedH2h = {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  meetings: number;
  winRate: number;
  lastMet: string | null;
};

export type AthleteAnalytics = {
  raceCount: number;
  record: CompetitionRecord | null;
  form: SeasonForm[];
  seasonShape: SeasonShape | null;
  headToHead: DerivedH2h[];
  coverage: { seasons: number[]; sources: string[]; withPlace: number };
};

/** How a discipline's contenders compare to EACH OTHER. The question a
 * ranked list with probabilities beside it cannot answer: two athletes with
 * near-identical season bests are not the same bet if one has beaten the
 * other every time they have lined up.
 *
 * Viable because the pairs genuinely exist — measured across all 32 fields,
 * the median discipline has raced 100% of its possible pairings. A cell is
 * null where two athletes have never met, which is a fact worth showing
 * rather than a zero worth inventing. */
export type H2hCell = {
  wins: number;
  losses: number;
  meetings: number;
  lastMet: string | null;
} | null;

export type MatrixRow = {
  name: string;
  cells: H2hCell[];
  wins: number;
  losses: number;
  meetings: number;
  /** null, not 0, when they have never met anyone in this field. */
  winRate: number | null;
};

export type FieldMatrix = {
  names: string[];
  rows: MatrixRow[];
  pairsMet: number;
  pairsPossible: number;
  coverage: number | null;
};

export type FormResult = {
  place: number;
  date: string;
  meeting: string | null;
};

export type FieldComparisonRow = {
  name: string;
  races: number;
  seasonRaces: number;
  top3Average: number | null;
  consistency: number | null;
  winRate: number | null;
  podiumRate: number | null;
  avgFinish: number | null;
  bestMonth: string | null;
  /** Last six finishing positions, OLDEST FIRST so the strip reads
   * left-to-right like a timeline. The head-to-head grid is an all-time
   * record and says nothing about right now — an athlete can lead a rivalry
   * 6-1 and have just finished ninth. */
  recentForm: FormResult[];
};

export type FieldAnalysis = {
  matrix: FieldMatrix;
  comparison: FieldComparisonRow[];
  season: number;
};

/** What World Athletics says an athlete has already won, and where it ranks
 * them (api.py -> src/athlete_career.py). Read from WA, not derived here —
 * which is why it lives apart from AthleteAnalytics, whose every number is
 * computed from the race log. */
export type HonourResult = {
  competition: string | null;
  mark: string | null;
  place: number | null;
};

export type HonourGroup = {
  /** World Athletics' own label: "Olympic Games", "World Championships",
   * "Diamond League Final", "National Championships"… 51 distinct values
   * appear across the fetched profiles. */
  category: string | null;
  results: HonourResult[];
  gold: number;
  silver: number;
  bronze: number;
  podiums: number;
};

export type WorldRanking = {
  events: { event: string; place: number }[];
  overall: number | null;
  best: { event: string; place: number } | null;
};

export type PersonalBest = {
  discipline: string | null;
  mark: string | null;
  venue: string | null;
  date: string | null;
  indoor: boolean;
};

export type AthleteCareer = {
  /** Global titles first; continental ones only when there are none, and
   * always named ("Commonwealth champion") so the two can't be confused.
   * Age-group, national and NCAA titles never appear here. null when the
   * athlete has no podium at any of them — no consolation phrasing. */
  headline: string | null;
  honours: HonourGroup[];
  worldRanking: WorldRanking;
  personalBests: PersonalBest[];
  eventCount: number;
};

/** Field athletes do not race — a shot putter competes. The site said
 * "races" everywhere, including on the 12 field disciplines, which is wrong
 * in exactly the way an athletics reader notices immediately.
 *
 * Discipline-aware rather than neutral-for-everyone: "competition" is
 * correct for a sprinter too, but "races" is what a sprinter's page should
 * say, and every component that renders these already knows `isField`. */
export const startNounKey = (isField: boolean, count = 2): string =>
  isField
    ? count === 1
      ? "word.competition"
      : "word.competitions"
    : count === 1
      ? "word.race"
      : "word.races";

/** Past tense, for "have never …ed each other". */
export const startVerbKey = (isField: boolean): string =>
  isField ? "word.competedAgainst" : "word.raced";

/** A discipline's name in the reader's language.
 *
 * The API sends English labels ("Men's 100m"), but the 32 disciplines are a
 * closed set with stable keys, so the name is translated on `discKey` rather
 * than by matching the English. Falls back to whatever the API called it if a
 * key ever appears that the locale tables do not carry — a new discipline
 * should show up in English, not as a raw key. */
export const discName = (
  t: (key: string) => string,
  discKey: string | null | undefined,
  fallback: string,
): string => {
  if (!discKey) return fallback;
  const key = `disc.name.${discKey}`;
  const name = t(key);
  return name === key ? fallback : name;
};

/** English writes "5th"; French writes "5e", and "1er" for one. Ordinals are
 * grammar rather than formatting, so they cannot come out of the number
 * itself the same way in every language. */
export const ordinalIn = (lang: string, n: number): string =>
  lang === "fr" ? (n === 1 ? `${n}er` : `${n}e`) : ordinal(n);

/** Discipline vs discipline — the third level of the site, after the field
 * and the athlete.
 *
 * Built on World Athletics' Results Score and deliberately NOT on the
 * model's probabilities. The target is top-three membership scored per
 * athlete, so a field's probabilities sum to no fixed total: across the 32
 * real 2026 fields they run from 31 to 320. Ranking events by them would
 * rank the model's per-event confidence rather than the depth of the field.
 * The probabilities still order athletes WITHIN a discipline, which is where
 * the site uses them. */
export type DepthVerdict = {
  key: "level" | "mixed" | "topHeavy";
  label: string;
  /** How the verdict was arrived at, in words, so it reads as arithmetic
   * rather than opinion. */
  basis: string;
};

export type DepthRow = {
  discKey: string;
  disc: string;
  isField: boolean;
  fieldSize: number;
  /** How many of the field carried a WA score. A spread measured over 5 of 8
   * athletes is a different claim from one measured over all 8. */
  scored: number;
  /** WA points from the strongest finalist to the weakest. Small = level. */
  spread: number;
  bestScore: number;
  bestAthlete: string;
  worstScore: number;
  /** The world top-100 median for this event, so the field can be read
   * against the discipline it is drawn from. */
  toplistMedian: number | null;
  favouriteProb: number;
  probGap: number | null;
  spreadRank: number;
};

export type DepthIndexData = {
  disciplines: (DepthRow & { verdict: DepthVerdict })[];
  total: number;
  season: number;
  toplistDepth: number;
};

export type FieldScore = {
  name: string;
  score: number;
  prob: number;
};

export type DisciplineReport = {
  discKey: string;
  disc: string;
  isField: boolean;
  season: number;
  athletes: Athlete[];
  /** Both moved here from /api/projections/<key> when the two pages merged
   * into one page per event. */
  trajectories: Trajectory[] | null;
  storylines: Storyline[] | null;
  depth: (DepthRow & { verdict: DepthVerdict | null; of: number }) | null;
  scores: FieldScore[];
  fieldAnalysis: FieldAnalysis | null;
};
