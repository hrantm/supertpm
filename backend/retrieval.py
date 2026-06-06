import re

from backend.db import all_records, connect

STOPWORDS = {
    "the",
    "a",
    "an",
    "is",
    "are",
    "what",
    "which",
    "who",
    "about",
    "from",
    "and",
    "or",
    "to",
    "of",
    "on",
    "in",
    "this",
    "that",
    "with",
    "doing",
    "working",
}


def terms(text):
    return [
        term
        for term in re.sub(r"[^a-z0-9\s-]", " ", text.lower()).split()
        if len(term) > 2 and term not in STOPWORDS
    ]


def expand_question(question):
    normalized = question.lower()
    expansions = []
    if any(word in normalized for word in ["overloaded", "overload", "too much", "capacity"]):
        expansions.extend(["workload", "capacity", "carrying", "assigned", "scope", "move off"])
    if any(word in normalized for word in ["staff", "bring up"]):
        expansions.extend(["staff brief", "bring up", "manager escalation", "leadership"])
    if any(word in normalized for word in ["dependency", "dependencies", "depends"]):
        expansions.extend(["dependency", "depends", "blocked by", "cross-team"])
    if "1:1" in normalized or "one on one" in normalized or "one-on-one" in normalized:
        expansions.extend(["1:1", "prep notes", "ask about"])
    if any(word in normalized for word in ["stale", "outdated"]):
        expansions.extend(["stale", "yesterday", "newer blocker"])
    if any(word in normalized for word in ["token", "tokens", "velocity", "usage", "waste", "wasting", "efficiency"]):
        expansions.extend(["token usage", "velocity", "completed points", "planned points", "ai assisted", "mismatch", "wasted", "undercounted"])
    if any(word in normalized for word in ["meeting", "meetings", "calendar", "prep", "upcoming"]):
        expansions.extend(["upcoming", "meeting", "calendar", "prep focus", "attendees", "review"])
    return " ".join([question, *expansions])


def normalize(text):
    return re.sub(r"[^a-z0-9]+", " ", str(text).lower()).strip()


def semantic_score(question_terms, record):
    haystack = " ".join(
        str(record.get(key, ""))
        for key in ["title", "text", "author", "team", "project", "people"]
    ).lower()
    score = sum(1 for term in question_terms if term in haystack)
    title = str(record.get("title", "")).lower()
    text = str(record.get("text", "")).lower()
    for term in question_terms:
        if term in title:
            score += 2
        if term in text:
            score += 1
    return score


def distinct_values(records, key):
    values = []
    seen = set()
    for record in records:
        raw = record.get(key) or ""
        if key == "people":
            parts = [part.strip() for part in raw.split(",")]
        else:
            parts = [raw.strip()]
        for part in parts:
            normalized = normalize(part)
            if part and normalized not in seen:
                seen.add(normalized)
                values.append(part)
    return values


def dynamic_entity_filter(question, records):
    normalized = normalize(question)
    focused = records

    for key in ["project", "team", "people", "author"]:
        matches = []
        for value in distinct_values(records, key):
            value_norm = normalize(value)
            value_terms = value_norm.split()
            if value_norm and (value_norm in normalized or any(term in normalized for term in value_terms if len(term) > 3)):
                matches.append(value)
        if not matches:
            continue

        if key == "people":
            subset = [
                record
                for record in focused
                if any(match.lower() in str(record.get("people", "")).lower() for match in matches)
            ]
        else:
            subset = [
                record
                for record in focused
                if normalize(record.get(key, "")) in {normalize(match) for match in matches}
            ]
        if subset:
            focused = subset

    return focused


def intent_filter(question, records):
    normalized = question.lower()
    focused = records

    focused = dynamic_entity_filter(question, focused)

    if "1:1" in normalized or "one on one" in normalized or "one-on-one" in normalized:
        prep_matches = [
            record
            for record in focused
            if "1:1" in f"{record.get('title', '')} {record.get('text', '')}".lower()
        ]
        if prep_matches:
            focused = prep_matches

    if any(word in normalized for word in ["doc", "docs", "document", "drive"]):
        doc_matches = [record for record in focused if record.get("source") == "google_drive"]
        if doc_matches:
            focused = doc_matches

    project_aliases = {
        "billing migration": "Billing Migration",
        "enterprise analytics": "Enterprise Analytics",
        "onboarding experiment": "Onboarding Experiment",
        "policy engine": "Policy Engine",
        "pricing page": "Pricing Page Cleanup",
        "pricing-page": "Pricing Page Cleanup",
        "activation analytics": "Activation Analytics",
        "mobile onboarding": "Mobile Onboarding",
        "data warehouse": "Data Warehouse Reliability",
        "warehouse reliability": "Data Warehouse Reliability",
        "self serve reports": "Self-Serve Reports",
        "self-serve reports": "Self-Serve Reports",
        "admin permissions": "Admin Permissions",
        "permissions": "Admin Permissions",
        "invoice reconciliation": "Invoice Reconciliation",
        "api rate limits": "API Rate Limits",
        "rate limits": "API Rate Limits",
    }
    for phrase, project in project_aliases.items():
        if phrase in normalized:
            project_matches = [record for record in focused if record.get("project") == project]
            if project_matches:
                focused = project_matches
            break

    team_aliases = {"growth": "Growth", "platform": "Platform"}
    for phrase, team in team_aliases.items():
        if phrase in normalized:
            team_matches = [record for record in focused if record.get("team") == team]
            if team_matches:
                focused = team_matches
            break

    if any(word in normalized for word in ["blocker", "blockers", "blocked", "slowing", "risk", "attention"]):
        risk_words = ["blocked", "blocker", "fails", "failed", "yellow", "unresolved", "requires", "needs"]
        risk_matches = [
            record
            for record in focused
            if any(word in f"{record.get('title', '')} {record.get('text', '')}".lower() for word in risk_words)
        ]
        if risk_matches:
            focused = risk_matches

    if any(word in normalized for word in ["overloaded", "overload", "too much", "capacity"]):
        capacity_words = ["workload", "capacity", "carrying", "assigned to three", "move off", "scope can move"]
        capacity_matches = [
            record
            for record in focused
            if any(word in f"{record.get('title', '')} {record.get('text', '')}".lower() for word in capacity_words)
        ]
        if capacity_matches:
            focused = capacity_matches

    if any(word in normalized for word in ["token", "tokens", "velocity", "usage", "waste", "wasting", "efficiency"]):
        telemetry_matches = [
            record
            for record in focused
            if record.get("source") == "ai_telemetry"
            or any(word in f"{record.get('title', '')} {record.get('text', '')}".lower() for word in ["token", "velocity", "completed points", "ai-assisted", "mismatch"])
        ]
        if telemetry_matches:
            focused = telemetry_matches

    if any(word in normalized for word in ["meeting", "meetings", "calendar", "prep", "upcoming"]):
        calendar_matches = [record for record in focused if record.get("source") == "calendar"]
        meeting_matches = [
            record
            for record in focused
            if any(word in f"{record.get('title', '')} {record.get('text', '')}".lower() for word in ["meeting", "calendar", "prep focus", "attendees"])
        ]
        if calendar_matches:
            focused = calendar_matches
        elif meeting_matches:
            focused = meeting_matches

    return focused


def retrieve(question, limit=8):
    expanded_question = expand_question(question)
    question_terms = terms(expanded_question)
    fts_query = " OR ".join(f'"{term}"' for term in question_terms[:8])
    records_by_id = {}

    if fts_query:
        with connect() as conn:
            rows = conn.execute(
                """
                SELECT r.id, r.external_id, r.source, r.source_url, r.title, r.text, r.author,
                       r.team, r.project, r.people, r.occurred_at, bm25(record_fts) AS rank
                FROM record_fts
                JOIN records r ON r.id = record_fts.rowid
                WHERE record_fts MATCH ?
                ORDER BY rank
                LIMIT ?
                """,
                (fts_query, max(limit * 5, 50)),
            ).fetchall()
        records_by_id.update({row["id"]: dict(row) for row in rows})

    for record in all_records():
        if semantic_score(question_terms, record) > 0:
            records_by_id[record["id"]] = record

    scored = []
    for record in records_by_id.values():
        rank_bonus = max(0, 8 - abs(record.get("rank", 0))) if "rank" in record else 0
        record["score"] = semantic_score(question_terms, record) + rank_bonus
        scored.append(record)

    focused = intent_filter(
        question,
        sorted(scored, key=lambda row: (row["score"], row["occurred_at"]), reverse=True),
    )

    if any(word in question.lower() for word in ["changed", "since yesterday", "today", "recent"]):
        focused = sorted(focused, key=lambda row: row["occurred_at"], reverse=True)

    return focused[:limit]
