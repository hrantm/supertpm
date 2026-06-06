# Signal Desk

Signal Desk is a chat-first demo app that answers questions from fake Slack, Jira, and Google Drive style work data stored in SQLite.

## Run locally

```bash
python3 scripts/seed_local.py
python3 server.py
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env` for OpenAI-backed answers:

- `OPENAI_API_KEY`

The checked-in demo can use `.env` to read `OPENAI_API_KEY` from `/Users/hrant/.zshrc` and uses `gpt-5-nano` as the low-cost model. Without an OpenAI key, answers use deterministic local synthesis so the demo still runs.

## Generate a larger fake corpus

For the main demo, use the generated corpus instead of real integrations:

```bash
python3 scripts/generate_demo_corpus.py --reset
python3 server.py
```

This creates a repeatable fake corpus directly in SQLite with Slack, Jira, and Google Drive records across Growth and Platform teams.

The generated corpus includes realistic demo cases:

- team summaries
- person-focused work summaries
- blocker and risk questions
- stale Drive docs versus newer Slack/Jira updates
- decisions and tradeoffs
- 1:1 prep questions
- “what changed since yesterday?” questions

## Demo flow

Try:

- What is the Growth team working on?
- What is Priya working on?
- What changed since yesterday?
- What blockers are slowing down the billing migration?
- What decisions were made about the enterprise analytics launch?
- Which projects need manager attention?
- What should I ask Taylor in our 1:1?
- Which Drive docs look stale compared with Slack or Jira?
- Who is involved in API rate limits?
- Summarize the onboarding experiment from Slack, Jira, and docs.

## Optional fake source seeders

The main demo uses `generate_demo_corpus.py`. These smaller scripts seed fake local records for individual source styles:

```bash
python3 scripts/seed_slack.py
python3 scripts/seed_jira.py
python3 scripts/seed_drive.py
```
