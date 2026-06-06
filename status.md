# Signal Desk Status

## Current Product Shape

Signal Desk is a local demo app for senior-manager visibility across fake Slack, Jira, and Google Drive work data. The app runs locally on `http://localhost:3000` with a Python backend, SQLite/FTS retrieval, and a static ChatGPT-style frontend.

## What Works

- Chat UI served from `public/`.
- Python backend in `server.py`.
- SQLite database at `data/signal-desk.sqlite`.
- Generated fake corpus via `scripts/generate_demo_corpus.py --reset`.
- Current corpus size after latest seed: `224` records:
  - `115` Slack
  - `67` Jira
  - `42` Google Drive
- `/api/chat` retrieves relevant records and calls OpenAI Responses API.
- `.env` loads `OPENAI_API_KEY` from `/Users/hrant/.zshrc`.
- Answers return `mode: openai-responses` when OpenAI is available.
- Citations are collapsed behind one expandable `Sources` row.
- `/api/stats` returns source/team counts.
- Demo eval script exists at `scripts/eval_demo_questions.py`.
- Demo narration/video artifact exists under `demo-video/`, but the user rejected the generated video quality and wants to re-plan the video from features/script first.
- Executive dashboard includes triaged actions, major initiatives, risks, dependencies, stale docs, decisions, people load, and velocity-versus-token usage monitoring.
- Velocity/token usage metrics are generated into SQLite and surfaced as mismatch flags when token usage rises without corresponding completed Jira velocity.
- Fake Google Calendar-style records/events are generated into SQLite. Upcoming important meetings now influence dashboard priority actions.

## Current Demo Story

The product should be presented as a working assistant that lets managers ask natural-language questions across Slack, Jira, and Drive. It summarizes work, shows evidence, detects blockers/stale docs, identifies overloaded people and dependencies, and helps managers prepare for 1:1s or staff meetings.

## Important Constraints

- The integrations are fake. Data is generated into SQLite.
- Do not call it fake in demo narration unless explicitly discussing implementation.
- Use Jira terminology, not Linear.
- The user wants port `3000` only. If restarting, kill existing `server.py` first and restart on `3000`.
- The UI should stay familiar and restrained, close to ChatGPT for chat, and operational for dashboard.

## Useful Commands

```bash
python3 scripts/generate_demo_corpus.py --reset
python3 server.py
python3 scripts/eval_demo_questions.py
```

## Next Work

Add an executive dashboard to the local demo:
- teams
- major initiatives
- current risks
- dependencies
- stale docs
- unresolved decisions
- overloaded people
- recommended manager actions
- velocity/token usage mismatch flags
- important upcoming meetings that affect priority
