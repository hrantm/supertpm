# Architecture Review Workflow

Use this workflow when discussing integrations, customer data, SOC 2, IP protection, deployment model, or backend design.

## Steps

1. Read `.agents/architect.md`.
2. State the decision or question.
3. Identify possible architecture options.
4. Compare options against:
   - customer data exposure
   - Xcelforce IP exposure
   - procurement friction
   - SOC 2 / security burden
   - implementation cost
   - pilot feasibility
5. Recommend one path.
6. List what must be documented before customer conversations.

## Output Format

```text
Question

Options

Recommendation

Why

Data flow

Security controls

IP risks

Pilot scope

Open questions
```

## Default Architecture Bias

Unless the user asks otherwise, prefer:

- Xcelforce-managed SaaS / remote MCP for early product validation.
- Read-only metadata-first integrations.
- No autonomous writes.
- No full source-code access for the first pilot.
- SOC 2 Type II roadmap and security packet.
- Customer-hosted deployment only as later enterprise option.

## Required Artifacts For Serious Enterprise Discussion

- Data-flow diagram.
- Integration scope list.
- Security controls sheet.
- Data retention policy.
- No-training statement.
- SOC 2 roadmap.
- DPA/subprocessor draft.
- IP protection note.
- Pilot access model.
