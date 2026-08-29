import { useState, useEffect } from "react";
import type {
  AthleteAnalytics,
  AthleteCareer,
  AthleteProfile,
  CareerSeason,
  H2hMatchup,
  MeetMark,
  ScoreContext,
  StandingsPosition,
} from "@/lib/dl-data";

/** An athlete who exists in the season's worldwide toplist but is not in the
 * projected field. Carries the REAL reason (mirroring run.py's selection
 * order) rather than a generic "not found", plus their real season marks. */
export type AthleteNotInField = {
  inField: false;
  name: string;
  disc: string;
  discKey: string;
  seasonBest: string | null;
  worldRank: number | null;
  waUrl: string | null;
  reason: string;
  reasonCode:
    "not_in_standings" | "outside_points_cut" | "injury_removed" | "outside_cut" | "no_data";
  /** Their real place in WA's Diamond League standings, or null when they
   * have no points in this discipline at all -- the two cases the site used
   * to report as one. */
  dl: StandingsPosition | null;
  injuryReason?: string | null;
  injuryUrl?: string | null;
  history: MeetMark[];
  historyYear: number | null;
  photoUrl: string | null;
  photoFocus: { x: number; y: number } | null;
  /** The same real season stats the in-field profile shows. Present for the
   * near-miss athletes run.py scores; `nat`/`age` still resolve from the
   * toplist scrape for anyone further down, the rest stay null. */
  nat: string | null;
  careerBest: string | null;
  pbGap: number | null;
  age: number | null;
  meetsCount: number | null;
  /** Days since they last competed anywhere — see the note on AthleteProfile. */
  daysSinceLast: number | null;
  lastRaceDate: string | null;
  /** Every competition this season, and every scraped final on record. A
   * near-miss athlete very often has ZERO Diamond League meetings, which is
   * frequently why they are not qualified — so meetsCount alone made the
   * panel read as broken rather than as "raced, but not here". */
  racesThisSeason: number;
  racesOnRecord: number;
  /** null when no profile has been fetched for this athlete —
   * athlete_profile_scraper covers the athletes the site renders pages for,
   * not all 7,628 in the race log. */
  career: AthleteCareer | null;
  /** The model's podium chance IF this athlete were in the field. Real
   * output from the same forest, but conditional -- never label it as a
   * prediction about the actual Final. Null when run.py never scored them. */
  hypotheticalProb: number | null;
  /** Record against the athletes who did qualify. */
  h2h: H2hMatchup[];
  /** The same analyst material an in-field profile gets. None of it depends
   * on being selected: a win rate and a head-to-head are facts about races
   * already run, and for a reader asking whether this athlete should have
   * qualified they are the evidence. */
  analytics: AthleteAnalytics | null;
  careerSeasons: CareerSeason[];
  scoreContext: ScoreContext | null;
  /** Here the "In field" badge marks the athletes who DID qualify. */
  rivalNames: string[];
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "notInField"; data: AthleteNotInField }
  | { status: "ok"; data: AthleteProfile };

/** Lazy per-athlete detail, fetched only when the profile page is visited --
 * kept out of the main /api/predictions payload (see api.py's
 * build_top_winners) since computing history/h2h for every athlete on
 * every dashboard load would be wasted work for the ones never opened. */
export function useAthleteProfile(discKey: string, name: string): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    fetch(`http://localhost:5000/api/athlete/${discKey}/${encodeURIComponent(name)}`)
      .then(async (r) => {
        if (r.ok) {
          setState({ status: "ok", data: (await r.json()) as AthleteProfile });
          return;
        }
        // A 404 here does NOT mean "no such athlete" -- it means they aren't
        // in predictions_latest.csv, which is only the ~230 projected
        // finalists out of ~3,700 ranked athletes. Ask why before giving up.
        if (r.status === 404) {
          const s = await fetch(
            `http://localhost:5000/api/athlete-status/${discKey}/${encodeURIComponent(name)}`,
          );
          if (s.ok) {
            const data = (await s.json()) as AthleteNotInField;
            if (!data.inField) {
              setState({ status: "notInField", data });
              return;
            }
          }
          throw new Error("Athlete not found");
        }
        throw new Error(`API returned ${r.status}`);
      })
      .catch((e) =>
        setState({
          status: "error",
          message: e.message ?? "Could not reach API — is api.py running?",
        }),
      );
  }, [discKey, name]);

  return state;
}
