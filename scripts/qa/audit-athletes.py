"""Every athlete page the site links, checked against what we hold on record.

The rule (the user, 2026-09-21): a section appears when the athlete has the
data for it and is left out when they don't. This finds the pages that break
it the costly way, with data on record that never reaches the page:

  missing_file       no snapshot at all, so the page waits on the live API
  career             World Athletics profile cached, no career block
  chart              World Athletics has races in this event this season, no chart
  analytics          races on record (any round), no analytics block
  record             finals on record, no competition record
  h2h                a final shared with another placed athlete, no head-to-head
  stats_vs_chart     the chart has this season's races, the stats say none

Run with the backend's venv, which has pandas and the race-log loader:
    C:\\Users\\rayen\\athletics-predictor\\venv\\Scripts\\python.exe scripts/qa/audit-athletes.py [--data DIR] [--out FILE]
--data defaults to the live checkout's public/data. Writes a CSV of every
athlete with a flag, and prints the counts by group.
"""
import argparse
import collections
import csv
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
HOME = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
BACKEND = os.path.join(HOME, "athletics-predictor")
sys.path.insert(0, os.path.join(BACKEND, "src"))

import pandas as pd  # noqa: E402
import athlete_analytics as aa  # noqa: E402

YEAR = 2026
FLAGS = ["missing_file", "career", "chart", "analytics", "record", "h2h", "stats_vs_chart"]
WA_ID = re.compile(r"athlete[=/](\d+)")


def slug(name):
    """athlete_slug() in build_static_api.py, which names the files."""
    s = unicodedata.normalize("NFD", name)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def load_page(data, disc, name):
    for kind in ("athlete", "athlete-status"):
        path = os.path.join(data, kind, disc, f"{slug(name)}.json")
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                return kind, json.load(f)
    return None, None


def linked_athletes(data):
    """{(disc, name): set of groups} for every athlete page the site links."""
    groups = collections.defaultdict(set)
    with open(os.path.join(data, "search-index.json"), encoding="utf-8") as f:
        for name, disc, _mark, _rank in json.load(f).get("athletes") or []:
            groups[(disc, name)].add("ranked")
    with open(os.path.join(data, "world-rankings.json"), encoding="utf-8") as f:
        for disc, lists in json.load(f).items():
            for key in ("model", "points"):
                for row in lists.get(key) or []:
                    groups[(disc, row["name"])].add("top20")
    for path in os.listdir(os.path.join(data, "discipline")):
        with open(os.path.join(data, "discipline", path), encoding="utf-8") as f:
            report = json.load(f)
        for a in report.get("athletes") or []:
            groups[(report["discKey"], a["name"])].add("event page")
    with open(os.path.join(data, "championship.json"), encoding="utf-8") as f:
        call = json.load(f)
    for p in call.get("projections") or []:
        for a in (p.get("athletes") or []) + (p.get("unranked") or []):
            if a.get("hasPage") is not False and a.get("name"):
                groups[(p["discKey"], a["name"])].add("asian games")
    return groups


class RaceLog:
    """Every race row per event, all rounds, from the same three files the
    site's analytics read, keyed by lower-cased name."""

    def __init__(self):
        self.cache = {}

    def event(self, disc):
        if disc in self.cache:
            return self.cache[disc]
        frames = []
        for path, source, tier in (
            (os.path.join(aa.WORLDWIDE_DIR, f"{disc}.csv"), "worldwide", None),
            (os.path.join(aa.RAW_DIR, f"{disc}_{YEAR}_meetings.csv"), "dl", "DL"),
            (os.path.join(aa.RAW_DIR, f"{disc}.csv"), "dl", "DL"),
        ):
            if not os.path.exists(path):
                continue
            df = pd.read_csv(path)
            if source == "dl" and "source" in df.columns:
                df = df[df["source"].isin(["dl_meeting", "major_meet"])]
            frames.append(aa._normalise(df, source, tier=tier))
        frames = [f for f in frames if not f.empty]
        if not frames:
            self.cache[disc] = (pd.DataFrame(), {}, set())
            return self.cache[disc]
        log = pd.concat(frames, ignore_index=True).drop_duplicates(subset=["Competitor", "date", "Mark"])
        log["key"] = log["Competitor"].str.lower()
        finals = log[log["isFinal"] & log["place"].notna()]
        # Races (date, meeting) with at least two placed finalists: a shared
        # final, which is all a head-to-head needs.
        counts = finals.groupby(["date", "Meeting"]).size()
        shared = {k for k, n in counts.items() if n >= 2}
        self.cache[disc] = (log, dict(tuple(log.groupby("key"))), shared)
        return self.cache[disc]

    def athlete(self, disc, name):
        log, by_name, shared = self.event(disc)
        rows = by_name.get(name.lower())
        if rows is None:
            return 0, 0, False
        finals = rows[rows["isFinal"] & rows["place"].notna()]
        met = any((d, m) in shared for d, m in zip(finals["date"], finals["Meeting"]))
        return len(rows), len(finals), met


def wa_season(profile_dir, wa_id, disc):
    """(races this season in this event, races this season in any event) from
    the athlete's cached World Athletics profile, or None when not cached."""
    path = os.path.join(profile_dir, f"{wa_id}.json")
    if not wa_id or not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        profile = (json.load(f).get("profile") or {})
    by_event = ((profile.get("resultsByYear") or {}).get("resultsByEvent")) or []
    here = anywhere = 0
    for ev in by_event:
        this = [r for r in ev.get("results") or [] if str(r.get("date", "")).endswith(str(YEAR))]
        anywhere += len(this)
        try:
            import api  # noqa: WPS433 -- heavy, so only when a profile exists
            matches = api._profile_event_matches(ev.get("discipline"), disc)
        except Exception:
            matches = False
        if matches:
            here += len(this)
    return here, anywhere


def audit(data, out_path):
    sys.path.insert(0, BACKEND)
    profile_dir = os.path.join(BACKEND, "data", "athlete_profiles")
    races = RaceLog()
    groups = linked_athletes(data)
    rows = []
    for (disc, name), where in sorted(groups.items()):
        kind, page = load_page(data, disc, name)
        flags = []
        if page is None:
            flags.append("missing_file")
        wa_id = None
        if page and page.get("waUrl"):
            m = WA_ID.search(page["waUrl"])
            wa_id = m.group(1) if m else None
        season = wa_season(profile_dir, wa_id, disc)
        total, finals, met = races.athlete(disc, name)
        if page is not None:
            analytics = page.get("analytics") or {}
            history = page.get("history") or []
            if season is not None and not page.get("career"):
                flags.append("career")
            if season and season[0] > 0 and not history:
                flags.append("chart")
            if total > 0 and not analytics:
                flags.append("analytics")
            if finals > 0 and not (analytics.get("record") or {}).get("races"):
                flags.append("record")
            if met and not analytics.get("headToHead"):
                flags.append("h2h")
            this_season = [h for h in history if str(h.get("date", "")).endswith(str(YEAR))]
            if this_season and (not page.get("racesThisSeason") or not page.get("lastRaceDate")):
                flags.append("stats_vs_chart")
        rows.append({
            "disc": disc, "name": name, "groups": "|".join(sorted(where)), "file": kind or "",
            "raceRows": total, "finals": finals, "sharedFinal": int(met),
            "waSeasonHere": season[0] if season else "", "waCached": int(season is not None),
            "flags": "|".join(flags),
        })

    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    print(f"{len(rows)} athlete pages linked. Wrote {out_path}\n")
    for group in ("all", "top20", "event page", "asian games", "ranked"):
        subset = [r for r in rows if group == "all" or group in r["groups"].split("|")]
        if not subset:
            continue
        counts = collections.Counter(f for r in subset for f in r["flags"].split("|") if f)
        cells = "  ".join(f"{flag} {counts.get(flag, 0)}" for flag in FLAGS)
        clean = sum(1 for r in subset if not r["flags"])
        print(f"{group:12s} {len(subset):5d} pages, {clean:5d} clean | {cells}")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--data", default=os.path.join(HOME, "track-insights-main", "public", "data"))
    parser.add_argument("--out", default="athlete-audit.csv")
    args = parser.parse_args()
    audit(args.data, args.out)


if __name__ == "__main__":
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    main()
