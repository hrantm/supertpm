import os
import sqlite3
from pathlib import Path

DB_PATH = Path(os.environ.get("SIGNAL_DESK_DB", "data/signal-desk.sqlite"))


def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          external_id TEXT NOT NULL UNIQUE,
          source TEXT NOT NULL,
          source_url TEXT NOT NULL,
          title TEXT NOT NULL,
          text TEXT NOT NULL,
          author TEXT,
          team TEXT,
          project TEXT,
          people TEXT,
          occurred_at TEXT NOT NULL,
          ingested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS project_metrics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          team TEXT NOT NULL,
          project TEXT NOT NULL,
          period TEXT NOT NULL,
          completed_points INTEGER NOT NULL,
          planned_points INTEGER NOT NULL,
          token_usage INTEGER NOT NULL,
          previous_token_usage INTEGER NOT NULL,
          ai_assisted_prs INTEGER NOT NULL,
          notes TEXT,
          UNIQUE(team, project, period)
        );

        CREATE TABLE IF NOT EXISTS calendar_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          external_id TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          starts_at TEXT NOT NULL,
          attendees TEXT,
          team TEXT,
          project TEXT,
          importance TEXT NOT NULL,
          prep_focus TEXT,
          source_url TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_records_source ON records(source);
        CREATE INDEX IF NOT EXISTS idx_records_team ON records(team);
        CREATE INDEX IF NOT EXISTS idx_records_project ON records(project);

        CREATE VIRTUAL TABLE IF NOT EXISTS record_fts USING fts5(
          title,
          text,
          author,
          team,
          project,
          people,
          content='records',
          content_rowid='id'
        );

        CREATE TRIGGER IF NOT EXISTS records_ai AFTER INSERT ON records BEGIN
          INSERT INTO record_fts(rowid, title, text, author, team, project, people)
          VALUES (new.id, new.title, new.text, new.author, new.team, new.project, new.people);
        END;

        CREATE TRIGGER IF NOT EXISTS records_ad AFTER DELETE ON records BEGIN
          INSERT INTO record_fts(record_fts, rowid, title, text, author, team, project, people)
          VALUES('delete', old.id, old.title, old.text, old.author, old.team, old.project, old.people);
        END;

        CREATE TRIGGER IF NOT EXISTS records_au AFTER UPDATE ON records BEGIN
          INSERT INTO record_fts(record_fts, rowid, title, text, author, team, project, people)
          VALUES('delete', old.id, old.title, old.text, old.author, old.team, old.project, old.people);
          INSERT INTO record_fts(rowid, title, text, author, team, project, people)
          VALUES (new.id, new.title, new.text, new.author, new.team, new.project, new.people);
        END;
        """
    )
    return conn


def upsert_record(record):
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO records (
              external_id, source, source_url, title, text, author, team, project, people, occurred_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(external_id) DO UPDATE SET
              source = excluded.source,
              source_url = excluded.source_url,
              title = excluded.title,
              text = excluded.text,
              author = excluded.author,
              team = excluded.team,
              project = excluded.project,
              people = excluded.people,
              occurred_at = excluded.occurred_at,
              ingested_at = CURRENT_TIMESTAMP
            """,
            (
                record["external_id"],
                record["source"],
                record["source_url"],
                record["title"],
                record["text"],
                record.get("author", ""),
                record.get("team", ""),
                record.get("project", ""),
                record.get("people", ""),
                record["occurred_at"],
            ),
        )


def upsert_project_metric(metric):
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO project_metrics (
              team, project, period, completed_points, planned_points, token_usage,
              previous_token_usage, ai_assisted_prs, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(team, project, period) DO UPDATE SET
              completed_points = excluded.completed_points,
              planned_points = excluded.planned_points,
              token_usage = excluded.token_usage,
              previous_token_usage = excluded.previous_token_usage,
              ai_assisted_prs = excluded.ai_assisted_prs,
              notes = excluded.notes
            """,
            (
                metric["team"],
                metric["project"],
                metric["period"],
                metric["completed_points"],
                metric["planned_points"],
                metric["token_usage"],
                metric["previous_token_usage"],
                metric["ai_assisted_prs"],
                metric.get("notes", ""),
            ),
        )


def upsert_calendar_event(event):
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO calendar_events (
              external_id, title, starts_at, attendees, team, project, importance, prep_focus, source_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(external_id) DO UPDATE SET
              title = excluded.title,
              starts_at = excluded.starts_at,
              attendees = excluded.attendees,
              team = excluded.team,
              project = excluded.project,
              importance = excluded.importance,
              prep_focus = excluded.prep_focus,
              source_url = excluded.source_url
            """,
            (
                event["external_id"],
                event["title"],
                event["starts_at"],
                event.get("attendees", ""),
                event.get("team", ""),
                event.get("project", ""),
                event["importance"],
                event.get("prep_focus", ""),
                event.get("source_url", ""),
            ),
        )


def rows_to_dicts(rows):
    return [dict(row) for row in rows]


def all_records():
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT id, external_id, source, source_url, title, text, author, team, project, people, occurred_at
            FROM records
            ORDER BY datetime(occurred_at) DESC
            """
        ).fetchall()
    return rows_to_dicts(rows)


def all_project_metrics():
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT team, project, period, completed_points, planned_points, token_usage,
                   previous_token_usage, ai_assisted_prs, notes
            FROM project_metrics
            ORDER BY token_usage DESC
            """
        ).fetchall()
    return rows_to_dicts(rows)


def upcoming_calendar_events():
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT external_id, title, starts_at, attendees, team, project, importance, prep_focus, source_url
            FROM calendar_events
            ORDER BY datetime(starts_at) ASC
            """
        ).fetchall()
    return rows_to_dicts(rows)


def clear_records():
    with connect() as conn:
        conn.execute("DELETE FROM records")
        conn.execute("DELETE FROM project_metrics")
        conn.execute("DELETE FROM calendar_events")


def record_stats():
    with connect() as conn:
        total = conn.execute("SELECT COUNT(*) AS count FROM records").fetchone()["count"]
        by_source = conn.execute(
            """
            SELECT source, COUNT(*) AS count
            FROM records
            GROUP BY source
            ORDER BY source
            """
        ).fetchall()
        by_team = conn.execute(
            """
            SELECT team, COUNT(*) AS count
            FROM records
            WHERE team != ''
            GROUP BY team
            ORDER BY team
            """
        ).fetchall()
    return {
        "total": total,
        "sources": {row["source"]: row["count"] for row in by_source},
        "teams": {row["team"]: row["count"] for row in by_team},
    }


def dashboard_data():
    records = all_records()
    metrics = all_project_metrics()
    meetings = upcoming_calendar_events()
    projects = {}
    risks = []
    dependencies = []
    stale_docs = []
    decisions = []
    people = {}

    risk_words = ["blocked", "blocker", "risk", "fail", "fails", "unresolved", "pending", "needs", "manager attention"]
    dependency_words = ["dependency", "depends", "blocked until", "cross-team"]
    stale_words = ["stale", "green yesterday", "newer blocker"]
    decision_words = ["decision", "decided", "moved", "requires", "remain in scope"]
    overload_words = ["workload", "capacity", "carrying", "assigned to three", "move off"]

    for record in records:
        team = record.get("team") or "Unknown"
        project = record.get("project") or "General"
        key = f"{team}::{project}"
        text = f"{record.get('title', '')} {record.get('text', '')}".lower()

        project_item = projects.setdefault(
            key,
            {
                "team": team,
                "project": project,
                "records": 0,
                "sources": set(),
                "latest": record.get("occurred_at"),
                "riskCount": 0,
                "decisionCount": 0,
            },
        )
        project_item["records"] += 1
        project_item["sources"].add(record.get("source"))
        if record.get("occurred_at", "") > (project_item.get("latest") or ""):
            project_item["latest"] = record.get("occurred_at")

        if any(word in text for word in risk_words):
            project_item["riskCount"] += 1
            risks.append(record)
        if any(word in text for word in dependency_words):
            dependencies.append(record)
        if record.get("source") == "google_drive" and any(word in text for word in stale_words):
            stale_docs.append(record)
        if any(word in text for word in decision_words):
            project_item["decisionCount"] += 1
            decisions.append(record)
        if record.get("source") != "calendar" and any(word in text for word in overload_words):
            for person in [part.strip() for part in (record.get("people") or "").split(",") if part.strip()]:
                item = people.setdefault(person, {"person": person, "count": 0, "projects": set(), "records": []})
                item["count"] += 1
                item["projects"].add(project)
                item["records"].append(record)

    project_rows = []
    for item in projects.values():
        status = "Watch"
        if item["riskCount"] >= 6:
            status = "At risk"
        elif item["riskCount"] <= 2:
            status = "On track"
        project_rows.append(
            {
                **item,
                "sources": sorted(item["sources"]),
                "status": status,
            }
        )

    project_rows.sort(key=lambda item: (item["status"] != "At risk", -item["riskCount"], item["team"], item["project"]))

    people_rows = []
    for item in people.values():
        people_rows.append(
            {
                "person": item["person"],
                "count": item["count"],
                "projects": sorted(item["projects"]),
                "sample": item["records"][0]["text"],
            }
        )
    people_rows.sort(key=lambda item: item["count"], reverse=True)

    def compact(record):
        return {
            "source": record["source"],
            "title": record["title"],
            "team": record.get("team", ""),
            "project": record.get("project", ""),
            "text": record.get("text", ""),
            "url": record.get("source_url", ""),
            "occurredAt": record.get("occurred_at", ""),
        }

    priority_risks = [
        record
        for record in risks
        if record.get("project") in {"Billing Migration", "Policy Engine", "API Rate Limits", "Enterprise Analytics"}
    ]
    priority_dependencies = [
        record
        for record in dependencies
        if record.get("project") in {"API Rate Limits", "Enterprise Analytics", "Billing Migration"}
    ]
    priority_stale_docs = [
        record
        for record in stale_docs
        if record.get("project") in {"Billing Migration", "Policy Engine", "Self-Serve Reports", "Enterprise Analytics"}
    ]
    priority_decisions = [
        record
        for record in decisions
        if record.get("project") in {"Enterprise Analytics", "Billing Migration", "Policy Engine"}
    ]

    velocity_token = []
    for metric in metrics:
        planned = max(metric["planned_points"], 1)
        velocity_rate = metric["completed_points"] / planned
        token_delta = (metric["token_usage"] - metric["previous_token_usage"]) / max(metric["previous_token_usage"], 1)
        tokens_per_point = metric["token_usage"] / max(metric["completed_points"], 1)
        severity = "normal"
        reason = "Token usage and delivery velocity appear aligned."
        if velocity_rate < 0.65 and token_delta > 0.35:
            severity = "critical"
            reason = "High token growth with low delivery velocity. Velocity may be undercounted or tokens are being wasted."
        elif tokens_per_point > 180000:
            severity = "watch"
            reason = "Token usage is high relative to completed work."
        elif velocity_rate > 0.9 and token_delta > 0.45:
            severity = "watch"
            reason = "Delivery is healthy, but token usage jumped sharply."
        velocity_token.append(
            {
                **metric,
                "velocityRate": round(velocity_rate, 2),
                "tokenDelta": round(token_delta, 2),
                "tokensPerPoint": int(tokens_per_point),
                "severity": severity,
                "reason": reason,
            }
        )
    velocity_token.sort(key=lambda item: (item["severity"] != "critical", item["severity"] != "watch", -item["token_usage"]))

    high_priority_meetings = [meeting for meeting in meetings if meeting["importance"] in {"critical", "high"}]

    return {
        "stats": record_stats(),
        "projects": project_rows[:5],
        "risks": [compact(record) for record in priority_risks[:3]],
        "dependencies": [compact(record) for record in priority_dependencies[:3]],
        "staleDocs": [compact(record) for record in priority_stale_docs[:3]],
        "decisions": [compact(record) for record in priority_decisions[:3]],
        "peopleLoad": people_rows[:3],
        "velocityToken": velocity_token[:5],
        "upcomingMeetings": high_priority_meetings[:5],
        "actions": [
            {
                "priority": "P0",
                "title": "Unblock Billing Migration validation",
                "detail": "Prep for the Billing Migration cutover review today; resolve prepaid invoice validation before cutover proceeds.",
            },
            {
                "priority": "P0",
                "title": "Resolve Policy Engine retention decision",
                "detail": "Compliance review is coming up; get audit log retention alignment so the write-path beta can open.",
            },
            {
                "priority": "P1",
                "title": "Clear API Rate Limits dependency for Growth",
                "detail": "Enterprise Analytics beta planning depends on Platform's override audit trail timing.",
            },
            {
                "priority": "P1",
                "title": "Investigate token-to-velocity mismatch",
                "detail": "Self-Serve Reports and Policy Engine show high token usage without matching completed work.",
            },
        ],
    }
