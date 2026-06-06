import json
import sys
import urllib.error
import urllib.request

BASE_URL = "http://localhost:3000"

CASES = [
    ("What is the Growth team working on?", ["Growth"], 4),
    ("What is Priya working on?", ["Priya"], 2),
    ("What changed since yesterday?", ["yesterday"], 4),
    ("What blockers are slowing down the billing migration?", ["Billing Migration"], 3),
    ("What decisions were made about the enterprise analytics launch?", ["Enterprise Analytics"], 2),
    ("Which Drive docs look stale compared with Slack or Jira?", ["stale"], 4),
    ("Who looks overloaded?", ["Mina"], 2),
    ("Which projects have cross-team dependencies?", ["dependency"], 2),
    ("What should I ask Taylor in our 1:1?", ["Taylor"], 1),
    ("What should I bring up in staff?", ["staff"], 2),
]


def post_chat(question):
    request = urllib.request.Request(
        f"{BASE_URL}/api/chat",
        data=json.dumps({"question": question}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def main():
    failures = []
    for question, expected_terms, min_citations in CASES:
        try:
            result = post_chat(question)
        except urllib.error.URLError as exc:
            failures.append((question, f"request failed: {exc}"))
            continue

        answer = result.get("answer", "")
        citations = result.get("citations", [])
        mode = result.get("mode")
        if mode != "openai-responses":
            failures.append((question, f"expected openai-responses, got {mode}"))
        if len(citations) < min_citations:
            failures.append((question, f"expected at least {min_citations} citations, got {len(citations)}"))
        for term in expected_terms:
            if term.lower() not in answer.lower():
                failures.append((question, f"missing expected term in answer: {term}"))
        print(f"ok: {question} ({mode}, {len(citations)} citations)")

    if failures:
        print("\nFailures:")
        for question, message in failures:
            print(f"- {question}: {message}")
        sys.exit(1)

    print("\nAll demo evals passed.")


if __name__ == "__main__":
    main()
