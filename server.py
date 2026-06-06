import hashlib
import hmac
import json
import os
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from backend.env import load_env

load_env()

from backend.answer import answer_with_sources
from backend.db import dashboard_data, record_stats, upsert_record
from backend.retrieval import retrieve

PORT = int(os.environ.get("PORT", "3000"))
PUBLIC_DIR = Path(__file__).parent / "public"


def json_response(handler, payload, status=200):
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def read_json(handler):
    length = int(handler.headers.get("Content-Length", "0"))
    raw = handler.rfile.read(length)
    if not raw:
        return {}, raw
    return json.loads(raw.decode("utf-8")), raw


def verify_slack_signature(headers, raw_body):
    secret = os.environ.get("SLACK_SIGNING_SECRET")
    if not secret:
        return True
    timestamp = headers.get("X-Slack-Request-Timestamp", "")
    signature = headers.get("X-Slack-Signature", "")
    if not timestamp or abs(time.time() - int(timestamp)) > 60 * 5:
        return False
    base = f"v0:{timestamp}:{raw_body.decode('utf-8')}".encode("utf-8")
    digest = "v0=" + hmac.new(secret.encode("utf-8"), base, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, signature)


def slack_event_to_record(event):
    channel = event.get("channel", "unknown")
    ts = event.get("ts", str(time.time()))
    text = event.get("text", "")
    return {
        "external_id": f"slack:{channel}:{ts}",
        "source": "slack",
        "source_url": f"https://slack.com/app_redirect?channel={channel}&message_ts={ts}",
        "title": f"Slack message in {channel}",
        "text": text,
        "author": event.get("user", ""),
        "team": event.get("team", ""),
        "project": "",
        "people": "",
        "occurred_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_GET(self):
        if urlparse(self.path).path == "/api/health":
            json_response(self, {"ok": True})
            return
        if urlparse(self.path).path == "/api/stats":
            json_response(self, record_stats())
            return
        if urlparse(self.path).path == "/api/dashboard":
            json_response(self, dashboard_data())
            return
        return super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        payload, raw = read_json(self)

        if path == "/api/chat":
            question = str(payload.get("question", "")).strip()
            if not question:
                json_response(self, {"error": "Question is required"}, 400)
                return
            records = retrieve(question, 16)
            result = answer_with_sources(question, records)
            json_response(
                self,
                {
                    "answer": result["answer"],
                    "mode": result["mode"],
                    "citations": [
                        {
                            "citationId": f"S{index + 1}",
                            "id": record["external_id"],
                            "source": record["source"],
                            "title": record["title"],
                            "url": record["source_url"],
                            "occurredAt": record["occurred_at"],
                            "team": record.get("team", ""),
                            "project": record.get("project", ""),
                            "snippet": record.get("text", "")[:220],
                        }
                        for index, record in enumerate(records)
                    ],
                },
            )
            return

        if path == "/api/connectors/slack/events":
            if not verify_slack_signature(self.headers, raw):
                json_response(self, {"error": "Invalid Slack signature"}, 401)
                return
            if payload.get("type") == "url_verification":
                json_response(self, {"challenge": payload.get("challenge")})
                return
            event = payload.get("event", {})
            if event.get("type") == "message" and not event.get("subtype"):
                upsert_record(slack_event_to_record(event))
            json_response(self, {"ok": True})
            return

        if path == "/api/connectors/jira/webhook":
            data = payload.get("data", {})
            if data:
                upsert_record(
                    {
                        "external_id": f"jira:{data.get('id')}",
                        "source": "jira",
                        "source_url": data.get("url") or data.get("self") or "https://jira.example.com",
                        "title": data.get("title") or data.get("summary") or "Jira update",
                        "text": data.get("description") or data.get("body") or json.dumps(data),
                        "author": data.get("creator", {}).get("name", ""),
                        "team": data.get("team", {}).get("name", ""),
                        "project": data.get("project", {}).get("name", ""),
                        "people": data.get("assignee", {}).get("name", ""),
                        "occurred_at": data.get("updatedAt") or data.get("createdAt") or time.strftime("%Y-%m-%dT%H:%M:%S%z"),
                    }
                )
            json_response(self, {"ok": True})
            return

        if path == "/api/connectors/google-drive/poll":
            json_response(self, {"ok": True, "message": "Run scripts/seed_drive.py or add Drive polling credentials."})
            return

        json_response(self, {"error": "Not found"}, 404)


if __name__ == "__main__":
    print(f"Signal Desk listening on http://localhost:{PORT}")
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
