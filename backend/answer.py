import json
import os
import urllib.error
import urllib.request


def fallback_answer(question, records):
    if not records:
        return (
            "I could not find matching Slack, Jira, or Drive evidence for that question. "
            "Seed local data or connect the real demo workspaces, then try again."
        )

    grouped = {}
    for record in records:
        key = f"{record.get('team') or 'Unknown team'} / {record.get('project') or 'General'}"
        grouped.setdefault(key, []).append(record)

    normalized = question.lower()
    preferred_terms = []
    if any(term in normalized for term in ["blocker", "blocked", "slowing", "risk", "attention"]):
        preferred_terms = ["blocker", "blocked", "fail", "fails", "pending", "unresolved", "needs", "required"]
    elif any(term in normalized for term in ["decision", "decided", "tradeoff"]):
        preferred_terms = ["decision", "decided", "moved", "requires", "stays", "ship"]

    def representative(items):
        if preferred_terms:
            scored = []
            for index, item in enumerate(items):
                text = f"{item['title']} {item['text']}".lower()
                score = sum(1 for term in preferred_terms if term in text)
                if "blocker:" in text or "main blocker" in text:
                    score += 3
                if "decision for" in text or "decision:" in text:
                    score += 3
                scored.append((score, -index, item))
            best = max(scored, key=lambda row: (row[0], row[1]))
            if best[0] > 0:
                return best[2]
        return items[0]

    lines = ["Based on the retrieved sources:"]
    for key, items in list(grouped.items())[:4]:
        first = representative(items)
        sources = "; ".join(f"{item['source']}: {item['title']}" for item in items[:3])
        lines.append(f"- {key}: {first['text']} ({sources})")
    return "\n".join(lines)


def answer_with_sources(question, records):
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return {"answer": fallback_answer(question, records), "mode": "local-fallback"}

    context = [
        {
            "citation_id": f"S{index + 1}",
            "source": record["source"],
            "title": record["title"],
            "url": record["source_url"],
            "team": record.get("team"),
            "project": record.get("project"),
            "occurred_at": record["occurred_at"],
            "text": record["text"],
        }
        for index, record in enumerate(records)
    ]

    payload = {
        "model": os.environ.get("OPENAI_MODEL", "gpt-5-nano"),
        "max_output_tokens": 700,
        "input": [
            {
                "role": "system",
                "content": (
                    "You are Signal Desk, a work visibility assistant for a senior engineering manager. "
                    "Answer only from the provided Slack, Jira, and Google Drive records. "
                    "Write a concise manager briefing, usually 3-6 bullets. "
                    "Distinguish facts from reasonable inferences. "
                    "If sources conflict or a doc appears stale compared with Slack/Jira, say that. "
                    "If the evidence is weak, say what is missing. "
                    "Every substantive claim must cite source IDs inline like [S1]. "
                    "Do not cite records you did not use."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Question: {question}\n\n"
                    "Use these retrieved records. Each record has a citation_id.\n"
                    f"{json.dumps(context, indent=2)}"
                ),
            },
        ],
    }

    request = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            data = json.loads(response.read().decode("utf-8"))
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
        return {
            "answer": (
                "LLM unavailable; showing retrieved evidence summary.\n\n"
                f"{fallback_answer(question, records)}"
            ),
            "mode": "local-fallback-llm-unavailable",
        }

    output_text = data.get("output_text")
    if not output_text:
        for item in data.get("output", []):
            for content in item.get("content", []):
                if content.get("type") == "output_text":
                    output_text = content.get("text")
                    break

    return {"answer": output_text or fallback_answer(question, records), "mode": "openai-responses"}
