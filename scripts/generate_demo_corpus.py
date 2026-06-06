import argparse
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.db import clear_records, upsert_calendar_event, upsert_project_metric, upsert_record

BASE_TIME = datetime(2026, 6, 6, 10, 0, tzinfo=timezone.utc)

PROJECTS = [
    {
        "team": "Growth",
        "project": "Onboarding Experiment",
        "channel": "growth-product",
        "lead": "Priya Shah",
        "people": ["Priya Shah", "Marco Lee", "Iris Okafor"],
        "summary": "activation checklist, first-run guidance, and experiment ramp controls",
        "status": "dogfood ready",
        "blocker": "analytics taxonomy signoff is required before ramping beyond internal users",
        "decision": "Referral prompts stay out of the first experiment so activation measurement stays clean.",
    },
    {
        "team": "Growth",
        "project": "Enterprise Analytics",
        "channel": "growth-analytics",
        "lead": "Samir Rao",
        "people": ["Samir Rao", "Mina Torres", "Alex Morgan"],
        "summary": "query cost guardrails, beta customer reporting, and launch readiness",
        "status": "in review",
        "blocker": "query-cost alerting must be approved before beta invites go out",
        "decision": "Chart customization moved to the next release; cost guardrails remain in scope.",
    },
    {
        "team": "Growth",
        "project": "Pricing Page Cleanup",
        "channel": "growth-product",
        "lead": "Marco Lee",
        "people": ["Marco Lee", "Priya Shah", "Nora Patel"],
        "summary": "pricing copy cleanup, FAQ consolidation, and annual plan messaging",
        "status": "on track",
        "blocker": "legal review is pending for the enterprise discount language",
        "decision": "Annual plan copy will use the conservative approved wording for the demo launch.",
    },
    {
        "team": "Growth",
        "project": "Self-Serve Reports",
        "channel": "growth-analytics",
        "lead": "Mina Torres",
        "people": ["Mina Torres", "Samir Rao", "Iris Okafor"],
        "summary": "report templates, saved views, and CSV export improvements",
        "status": "needs attention",
        "blocker": "CSV export memory usage is above the agreed threshold on large accounts",
        "decision": "Saved views ship first; scheduled email delivery stays out of beta.",
    },
    {
        "team": "Platform",
        "project": "Billing Migration",
        "channel": "platform-billing",
        "lead": "Taylor Brooks",
        "people": ["Taylor Brooks", "Jordan Lee", "Drew Kim"],
        "summary": "invoice reconciliation, cutover checklist, and annual contract adjustments",
        "status": "blocked",
        "blocker": "annual contract adjustment tests fail on prepaid invoices",
        "decision": "Cutover will not start until finance provides prepaid annual invoice samples.",
    },
    {
        "team": "Platform",
        "project": "Policy Engine",
        "channel": "platform-api",
        "lead": "Drew Kim",
        "people": ["Drew Kim", "Priya Shah", "Jordan Lee"],
        "summary": "write-path beta, audit logs, and compliance retention requirements",
        "status": "blocked",
        "blocker": "audit log retention requirements are still unresolved with compliance",
        "decision": "The write path remains behind a beta flag until retention is approved.",
    },
    {
        "team": "Platform",
        "project": "Data Warehouse Reliability",
        "channel": "platform-data",
        "lead": "Jordan Lee",
        "people": ["Jordan Lee", "Mina Torres", "Taylor Brooks"],
        "summary": "warehouse backfills, pipeline retries, and freshness monitoring",
        "status": "watch",
        "blocker": "backfill retries are noisy and make freshness alerts hard to trust",
        "decision": "The team will add per-table freshness thresholds instead of one global SLA.",
    },
    {
        "team": "Platform",
        "project": "API Rate Limits",
        "channel": "platform-api",
        "lead": "Drew Kim",
        "people": ["Drew Kim", "Samir Rao", "Nora Patel"],
        "summary": "customer-specific rate limit overrides, monitoring, and support tooling",
        "status": "in progress",
        "blocker": "support needs an admin-safe override audit trail before broad rollout",
        "decision": "Overrides require a reason code and expire automatically after seven days.",
    },
]

SLACK_TEMPLATES = [
    "{lead} said {project} is focused on {summary}. Current status is {status}.",
    "{person} posted that the main blocker for {project} is that {blocker}.",
    "Decision for {project}: {decision}",
    "{person} asked whether leadership needs to weigh in on {project}; {lead} said only if the blocker remains open tomorrow.",
    "{project} update: the next milestone is being prepared for review by {people}.",
    "{person} noted that docs and Jira are now aligned for {project}, except for the open blocker.",
    "{lead} summarized the week: progress is visible, but {blocker}.",
    "Reminder from {person}: demo notes for {project} need to cite Jira issues and Drive docs.",
    "{person}: yesterday the team expected {project} to be green, but today's Slack thread says {blocker}.",
    "{lead}: for my weekly manager sync, the headline is status={status}; risk={blocker}; decision={decision}",
    "{person} said the Jira board is current for {project}, but the Drive brief is one day stale on the blocker.",
    "{lead} asked {person} to prepare a customer-facing explanation for {project} before the Friday review.",
    "{person}: if someone asks what changed since yesterday, say the risk moved from tracking to manager-visible for {project}.",
    "{lead} confirmed ownership: {people} are the active contributors on {project}.",
]

JIRA_ISSUES = [
    ("Scope and acceptance criteria", "Define the MVP scope, owners, and acceptance criteria for {project}."),
    ("Implementation workstream", "{lead} owns the main implementation path for {project}: {summary}."),
    ("Blocker follow-up", "Track blocker resolution for {project}: {blocker}."),
    ("Launch readiness checklist", "Prepare launch readiness checklist and confirm rollout criteria for {project}."),
    ("Cross-team dependency", "Coordinate dependency review for {project} with {people}."),
    ("Manager review item", "Manager attention requested for {project} because {blocker}. Decision context: {decision}"),
    ("Yesterday status", "Yesterday {project} was expected to be on track. Today's update moved status to {status}."),
    ("Owner update", "Current owners for {project}: {people}. {lead} is accountable for the next weekly summary."),
]

DRIVE_DOCS = [
    (
        "Project Brief",
        "{project} is owned by {lead} on the {team} team. The team is working on {summary}. Current status: {status}. Main blocker: {blocker}.",
    ),
    (
        "Decision Log",
        "Decision for {project}: {decision} Open question: {blocker}. Leadership should review this if the open question is not resolved by the next weekly lead meeting.",
    ),
    (
        "Weekly Status",
        "Weekly status for {project}: progress is moving, status is {status}, and the most important manager-visible risk is that {blocker}. People involved: {people}.",
    ),
    (
        "Stale Original Plan",
        "Original plan for {project}: status was green yesterday and no manager escalation was expected. This doc may be stale if Slack or Jira has a newer blocker update.",
    ),
    (
        "1:1 Prep Notes",
        "For a 1:1 with {lead}, ask about {blocker}, whether {decision}, and whether the active contributors ({people}) need help unblocking cross-team dependencies.",
    ),
]


def slug(value):
    return value.lower().replace(" ", "-").replace("/", "-")


def iso(minutes_ago):
    return (BASE_TIME - timedelta(minutes=minutes_ago)).isoformat()


def render(template, project, person=None):
    values = {
        **project,
        "person": person or project["lead"],
        "people": ", ".join(project["people"]),
    }
    return template.format(**values)


def slack_records():
    records = []
    for project_index, project in enumerate(PROJECTS):
        for index, template in enumerate(SLACK_TEMPLATES):
            person = project["people"][index % len(project["people"])]
            channel = project["channel"]
            message_id = f"{project_index + 1:02d}{index + 1:02d}"
            records.append(
                {
                    "external_id": f"slack:{channel}:{message_id}",
                    "source": "slack",
                    "source_url": f"https://slack.example.com/archives/{channel}/p{message_id}",
                    "title": f"#{channel}: {project['project']} update {index + 1}",
                    "text": render(template, project, person),
                    "author": person,
                    "team": project["team"],
                    "project": project["project"],
                    "people": ", ".join(project["people"]),
                    "occurred_at": iso(project_index * 180 + index * 17),
                }
            )
    return records


def jira_records():
    records = []
    for project_index, project in enumerate(PROJECTS):
        team_key = "GRO" if project["team"] == "Growth" else "PLAT"
        for index, (title, description) in enumerate(JIRA_ISSUES):
            issue_number = project_index * 10 + index + 101
            records.append(
                {
                    "external_id": f"jira:{team_key}-{issue_number}",
                    "source": "jira",
                    "source_url": f"https://jira.example.com/browse/{team_key}-{issue_number}",
                    "title": f"{team_key}-{issue_number}: {project['project']} - {title}",
                    "text": render(description, project),
                    "author": project["lead"],
                    "team": project["team"],
                    "project": project["project"],
                    "people": ", ".join(project["people"]),
                    "occurred_at": iso(project_index * 190 + index * 29 + 8),
                }
            )
    return records


def drive_records():
    records = []
    for project_index, project in enumerate(PROJECTS):
        project_slug = slug(project["project"])
        for index, (doc_type, body) in enumerate(DRIVE_DOCS):
            records.append(
                {
                    "external_id": f"google_drive:{project_slug}:{slug(doc_type)}",
                    "source": "google_drive",
                    "source_url": f"https://docs.example.com/document/d/{project_slug}-{slug(doc_type)}",
                    "title": f"{project['project']} {doc_type}",
                    "text": render(body, project),
                    "author": project["lead"],
                    "team": project["team"],
                    "project": project["project"],
                    "people": ", ".join(project["people"]),
                    "occurred_at": iso(project_index * 210 + index * 43 + 20),
                }
            )
    return records


def scenario_records():
    return [
        {
            "external_id": "slack:growth-analytics:overload-001",
            "source": "slack",
            "source_url": "https://slack.example.com/archives/growth-analytics/poverload001",
            "title": "#growth-analytics: Mina capacity concern",
            "text": "Samir flagged that Mina Torres is carrying Enterprise Analytics query guardrails, Self-Serve Reports CSV memory work, and two customer escalation follow-ups. He asked whether scope can move off Mina this week.",
            "author": "Samir Rao",
            "team": "Growth",
            "project": "Enterprise Analytics",
            "people": "Samir Rao, Mina Torres",
            "occurred_at": iso(34),
        },
        {
            "external_id": "jira:GRO-CAPACITY-MINA",
            "source": "jira",
            "source_url": "https://jira.example.com/browse/GRO-CAPACITY-MINA",
            "title": "GRO-CAPACITY-MINA: Mina workload review",
            "text": "Mina Torres is assigned to three active manager-visible workstreams: Enterprise Analytics guardrails, Self-Serve Reports CSV export, and customer escalation analysis. Recommendation: move report templates to Iris.",
            "author": "Samir Rao",
            "team": "Growth",
            "project": "Self-Serve Reports",
            "people": "Mina Torres, Samir Rao, Iris Okafor",
            "occurred_at": iso(52),
        },
        {
            "external_id": "google_drive:growth:staff-brief",
            "source": "google_drive",
            "source_url": "https://docs.example.com/document/d/growth-staff-brief",
            "title": "Growth Staff Meeting Brief",
            "text": "Bring up Mina Torres workload, Enterprise Analytics beta risk, stale plans on Self-Serve Reports, and whether Pricing Page legal review needs manager escalation.",
            "author": "Nora Patel",
            "team": "Growth",
            "project": "Enterprise Analytics",
            "people": "Nora Patel, Mina Torres, Samir Rao",
            "occurred_at": iso(64),
        },
        {
            "external_id": "slack:platform-api:dependency-001",
            "source": "slack",
            "source_url": "https://slack.example.com/archives/platform-api/pdependency001",
            "title": "#platform-api: Growth dependency on rate limits",
            "text": "Drew said Enterprise Analytics beta depends on API Rate Limits support overrides. Samir confirmed Growth cannot invite the beta customer cohort until the override audit trail is ready.",
            "author": "Drew Kim",
            "team": "Platform",
            "project": "API Rate Limits",
            "people": "Drew Kim, Samir Rao",
            "occurred_at": iso(71),
        },
        {
            "external_id": "jira:PLAT-GRO-DEPENDENCY",
            "source": "jira",
            "source_url": "https://jira.example.com/browse/PLAT-GRO-DEPENDENCY",
            "title": "PLAT-GRO-DEPENDENCY: Enterprise Analytics blocked by API overrides",
            "text": "Cross-team dependency: Growth Enterprise Analytics beta is blocked until Platform ships API Rate Limits override audit trail.",
            "author": "Drew Kim",
            "team": "Platform",
            "project": "API Rate Limits",
            "people": "Drew Kim, Samir Rao, Mina Torres",
            "occurred_at": iso(78),
        },
        {
            "external_id": "jira:PLAT-205-DONE",
            "source": "jira",
            "source_url": "https://jira.example.com/browse/PLAT-205-DONE",
            "title": "PLAT-205-DONE: Billing migration reconciliation marked done",
            "text": "Jira status says invoice reconciliation is Done, but the latest Slack thread still reports annual contract adjustment risk on prepaid invoices.",
            "author": "Taylor Brooks",
            "team": "Platform",
            "project": "Billing Migration",
            "people": "Taylor Brooks, Jordan Lee",
            "occurred_at": iso(87),
        },
        {
            "external_id": "slack:platform-billing:conflict-001",
            "source": "slack",
            "source_url": "https://slack.example.com/archives/platform-billing/pconflict001",
            "title": "#platform-billing: Jira says done but rollout still risky",
            "text": "Jordan noted that Jira has reconciliation marked done, but Slack still shows rollout risk because prepaid annual invoice samples are not validated.",
            "author": "Jordan Lee",
            "team": "Platform",
            "project": "Billing Migration",
            "people": "Jordan Lee, Taylor Brooks",
            "occurred_at": iso(29),
        },
        {
            "external_id": "google_drive:platform:staff-brief",
            "source": "google_drive",
            "source_url": "https://docs.example.com/document/d/platform-staff-brief",
            "title": "Platform Staff Meeting Brief",
            "text": "Bring up Billing Migration status conflict, Policy Engine audit retention, API Rate Limits dependency for Growth, and Data Warehouse alert noise. Ask whether Taylor and Drew need manager help.",
            "author": "Nora Patel",
            "team": "Platform",
            "project": "Billing Migration",
            "people": "Nora Patel, Taylor Brooks, Drew Kim",
            "occurred_at": iso(93),
        },
    ]


PROJECT_METRICS = [
    {
        "team": "Growth",
        "project": "Onboarding Experiment",
        "period": "2026-W23",
        "completed_points": 28,
        "planned_points": 32,
        "token_usage": 2_900_000,
        "previous_token_usage": 2_100_000,
        "ai_assisted_prs": 11,
        "notes": "Velocity is close to plan and token usage rose moderately because experiment copy and analytics scaffolding used AI-assisted development.",
    },
    {
        "team": "Growth",
        "project": "Enterprise Analytics",
        "period": "2026-W23",
        "completed_points": 18,
        "planned_points": 30,
        "token_usage": 5_600_000,
        "previous_token_usage": 3_700_000,
        "ai_assisted_prs": 14,
        "notes": "Token usage increased while query-cost guardrails remained in review; manager should check whether work is blocked or velocity is being undercounted.",
    },
    {
        "team": "Growth",
        "project": "Pricing Page Cleanup",
        "period": "2026-W23",
        "completed_points": 22,
        "planned_points": 24,
        "token_usage": 1_200_000,
        "previous_token_usage": 1_000_000,
        "ai_assisted_prs": 6,
        "notes": "Healthy velocity with low token usage; no token efficiency concern.",
    },
    {
        "team": "Growth",
        "project": "Self-Serve Reports",
        "period": "2026-W23",
        "completed_points": 7,
        "planned_points": 24,
        "token_usage": 6_800_000,
        "previous_token_usage": 2_900_000,
        "ai_assisted_prs": 18,
        "notes": "Critical mismatch: high token usage, many AI-assisted PRs, and low completed points. Either Jira velocity is missing work or tokens are being spent on churn.",
    },
    {
        "team": "Platform",
        "project": "Billing Migration",
        "period": "2026-W23",
        "completed_points": 15,
        "planned_points": 28,
        "token_usage": 4_200_000,
        "previous_token_usage": 3_200_000,
        "ai_assisted_prs": 9,
        "notes": "Velocity is low because validation is blocked; token usage is elevated but explainable by test generation and reconciliation debugging.",
    },
    {
        "team": "Platform",
        "project": "Policy Engine",
        "period": "2026-W23",
        "completed_points": 8,
        "planned_points": 26,
        "token_usage": 7_100_000,
        "previous_token_usage": 3_600_000,
        "ai_assisted_prs": 21,
        "notes": "Critical mismatch: token usage nearly doubled while completed points stayed low. Could mean audit-retention blockers are causing AI-driven rework or Jira velocity is not capturing design work.",
    },
    {
        "team": "Platform",
        "project": "Data Warehouse Reliability",
        "period": "2026-W23",
        "completed_points": 20,
        "planned_points": 25,
        "token_usage": 3_900_000,
        "previous_token_usage": 2_700_000,
        "ai_assisted_prs": 13,
        "notes": "Velocity is acceptable; token use rose for pipeline retry analysis but does not require escalation.",
    },
    {
        "team": "Platform",
        "project": "API Rate Limits",
        "period": "2026-W23",
        "completed_points": 24,
        "planned_points": 26,
        "token_usage": 5_200_000,
        "previous_token_usage": 3_300_000,
        "ai_assisted_prs": 17,
        "notes": "Velocity is strong but token usage jumped sharply; monitor for waste after the override audit trail ships.",
    },
]


def metric_records():
    records = []
    for metric in PROJECT_METRICS:
        project_slug = slug(metric["project"])
        velocity_percent = round(metric["completed_points"] / metric["planned_points"] * 100)
        token_delta = round((metric["token_usage"] - metric["previous_token_usage"]) / metric["previous_token_usage"] * 100)
        records.append(
            {
                "external_id": f"ai_telemetry:{project_slug}:{metric['period']}",
                "source": "ai_telemetry",
                "source_url": f"https://telemetry.example.com/projects/{project_slug}/{metric['period']}",
                "title": f"{metric['project']} AI token usage and velocity",
                "text": (
                    f"{metric['project']} completed {metric['completed_points']} of {metric['planned_points']} planned points "
                    f"({velocity_percent}% velocity) while using {metric['token_usage']:,} AI tokens, up {token_delta}% from the previous period. "
                    f"AI-assisted PRs: {metric['ai_assisted_prs']}. {metric['notes']}"
                ),
                "author": "Signal Desk Telemetry",
                "team": metric["team"],
                "project": metric["project"],
                "people": "",
                "occurred_at": iso(18 + len(records) * 11),
            }
        )
    return records


CALENDAR_EVENTS = [
    {
        "external_id": "calendar:billing-cutover-review",
        "title": "Billing Migration Cutover Review",
        "starts_at": "2026-06-06T15:00:00+00:00",
        "attendees": "Taylor Brooks, Jordan Lee, Nora Patel, Finance Ops",
        "team": "Platform",
        "project": "Billing Migration",
        "importance": "critical",
        "prep_focus": "Resolve prepaid annual invoice samples and decide whether cutover can proceed.",
        "source_url": "https://calendar.example.com/events/billing-cutover-review",
    },
    {
        "external_id": "calendar:policy-retention-compliance",
        "title": "Policy Engine Retention Compliance Review",
        "starts_at": "2026-06-06T17:30:00+00:00",
        "attendees": "Drew Kim, Priya Shah, Compliance Lead, Nora Patel",
        "team": "Platform",
        "project": "Policy Engine",
        "importance": "critical",
        "prep_focus": "Align on audit log retention requirement blocking the write-path beta.",
        "source_url": "https://calendar.example.com/events/policy-retention-compliance",
    },
    {
        "external_id": "calendar:growth-platform-beta",
        "title": "Enterprise Analytics Beta Dependency Sync",
        "starts_at": "2026-06-07T16:00:00+00:00",
        "attendees": "Samir Rao, Mina Torres, Drew Kim, Nora Patel",
        "team": "Growth",
        "project": "Enterprise Analytics",
        "importance": "high",
        "prep_focus": "Confirm API Rate Limits override audit trail before beta customer invites.",
        "source_url": "https://calendar.example.com/events/enterprise-analytics-beta-dependency",
    },
    {
        "external_id": "calendar:self-serve-capacity",
        "title": "Self-Serve Reports Capacity Review",
        "starts_at": "2026-06-07T18:00:00+00:00",
        "attendees": "Mina Torres, Samir Rao, Iris Okafor, Nora Patel",
        "team": "Growth",
        "project": "Self-Serve Reports",
        "importance": "high",
        "prep_focus": "Decide whether to move report templates off Mina due to token/velocity mismatch and workload signals.",
        "source_url": "https://calendar.example.com/events/self-serve-capacity-review",
    },
]


def calendar_records():
    return [
        {
            "external_id": event["external_id"],
            "source": "calendar",
            "source_url": event["source_url"],
            "title": event["title"],
            "text": (
                f"Upcoming {event['importance']} meeting at {event['starts_at']}. "
                f"Attendees: {event['attendees']}. Prep focus: {event['prep_focus']}"
            ),
            "author": "Google Calendar",
            "team": event["team"],
            "project": event["project"],
            "people": event["attendees"],
            "occurred_at": iso(5 + len(event["external_id"])),
        }
        for event in CALENDAR_EVENTS
    ]


def main():
    parser = argparse.ArgumentParser(description="Generate fake Slack, Jira, and Google Drive demo data.")
    parser.add_argument("--reset", action="store_true", help="Delete existing records before seeding.")
    args = parser.parse_args()

    if args.reset:
        clear_records()

    records = [*slack_records(), *jira_records(), *drive_records(), *scenario_records(), *metric_records(), *calendar_records()]
    for record in records:
        upsert_record(record)
    for metric in PROJECT_METRICS:
        upsert_project_metric(metric)
    for event in CALENDAR_EVENTS:
        upsert_calendar_event(event)

    counts = {
        "slack": len([record for record in records if record["source"] == "slack"]),
        "jira": len([record for record in records if record["source"] == "jira"]),
        "google_drive": len([record for record in records if record["source"] == "google_drive"]),
        "ai_telemetry": len([record for record in records if record["source"] == "ai_telemetry"]),
        "calendar": len([record for record in records if record["source"] == "calendar"]),
    }
    print(
        f"Seeded {len(records)} records "
        f"({counts['slack']} Slack, {counts['jira']} Jira, {counts['google_drive']} Google Drive, "
        f"{counts['ai_telemetry']} AI telemetry, {counts['calendar']} Calendar)."
    )


if __name__ == "__main__":
    main()
