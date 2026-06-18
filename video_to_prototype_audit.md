# Video-To-Prototype Audit

## Purpose

This audit compares what Areg and Chris discussed across the four source videos against the current Program Pulse prototype.

Current prototype:

- React/Vite frontend-only app.
- Hardcoded synthetic data.
- MUI-based Linear-inspired interface.
- Deployed production URL: https://supertpm.vercel.app
- Core files:
  - `src/App.jsx`
  - `src/data.js`
  - `initial_ideas.md`

The prototype should be evaluated as a concept demo, not as an integration demo or production feasibility proof.

## Executive Finding

The current prototype now matches the strongest product wedge from the calls: a visibility layer for EMs and TPMs that synthesizes signals from Jira, code, CI, Slack, Notion, and meeting notes into a weekly program-health brief.

It does not yet cover the harder architecture, security, connector, IP-protection, deployment, and enterprise-trust topics that occupied a large part of the conversations.

That is mostly correct for this stage, but the demo should be explicit:

> This is the user-facing experience we would validate first. The integrations, security architecture, and deployment model are separate feasibility work.

## Video 1 Audit: Chris Demo

### What Was Discussed

Chris introduced the AI-augmented TPM concept.

Main themes:

- TPMs bridge business, product, engineering, risk, timelines, dependencies, and communication.
- AI should reduce manual TPM "doing" while preserving human judgment.
- Xcelforce can create AI-enabled TPMs using proprietary skills and MCP-style integrations.
- Skills could include codebase mapping, architecture analysis, technical support, planning, security, and coder personas.
- Weekly communications could be generated for different audiences:
  - executive email
  - engineering Slack or Teams message
  - team-level update
  - individual contribution summary
- Areg emphasized IP protection: the prompts, workflows, and judgment logic are the valuable asset.
- They needed a business visual, architecture/security explanation, and client-risk story.

### What We Built That Matches

- Program Pulse positions the tool as an EM/TPM visibility layer.
- The prototype reduces manual reporting into:
  - weekly visibility brief
  - initiative health
  - risks
  - source-backed evidence
  - suggested communication drafts
- Human judgment is visible through:
  - Prepare Brief
  - Approve readout
  - Edit draft
  - Dismiss signal
  - Needs follow-up
- Stakeholder-specific outputs are partially represented:
  - Executive draft
  - Engineering draft
  - System-of-record note

### What Is Missing

- No codebase mapping skill.
- No architecture/security persona.
- No individual contribution summary.
- No real MCP, skill execution, or prompt/persona orchestration.
- No IP-protection story in the product.
- No client-risk/security visual.
- No explanation of how Chris's judgment is encoded or protected.

### Assessment

The prototype captures the user-facing TPM reporting workflow from V1, but not the broader proprietary AI-skill-suite idea. That is acceptable if the demo is framed as "first visible product surface," not the full Xcelforce AI-enabled-resource platform.

## Video 2 Audit: Working Session On IP And Security

### What Was Discussed

This call focused on architecture, IP exposure, and enterprise trust.

Main themes:

- Installing skills directly on client laptops exposes Xcelforce IP.
- Chris proposed a remote MCP/server-side model:
  - Xcelforce hosts skill logic.
  - Client users authenticate to Xcelforce.
  - Clients only see tool names, descriptions, and input schemas.
  - Xcelforce processes requests and returns outputs.
- This creates data-egress and vendor-risk issues.
- Controls discussed:
  - ephemeral processing
  - TLS
  - DPA
  - tenant isolation
  - SOC 2 Type II
  - pen testing
  - vulnerability disclosure
  - security questionnaires
  - no-reverse-engineering clauses
- Areg worried large clients may reject Xcelforce login or external data transfer.
- Chris argued TPM/engineering operations is a better wedge than generic security AI.
- Differentiator: real-time program auditing from code and delivery systems.

### What We Built That Matches

- The prototype is explicitly read-only in language.
- Source coverage shows mocked/read-only/optional/human-reviewed states.
- It avoids autonomous writeback.
- It is framed around TPM/EM visibility, not security AI.
- It shows evidence-backed delivery synthesis from delivery systems.

### What Is Missing

- No security architecture view.
- No deployment-mode explanation:
  - Xcelforce-managed SaaS
  - customer-managed/VPC/local mode
- No IP-protection explanation.
- No auth model.
- No tenant isolation.
- No audit logs.
- No data retention/no-training policy.
- No SOC 2/DPA/vendor-risk packet.
- No prompt/skill access-control story.

### Assessment

The current prototype does not address the main subject of V2. That is fine for a product-experience demo, but Chris and Areg will likely ask about it because it was a major thread in their thinking. We should prepare a separate one-page architecture/security note before any serious buyer conversation.

## Video 3 Audit: EM Visibility And Go-To-Market

### What Was Discussed

This call shifted from TPM-only tooling to EM/director visibility and go-to-market.

Main themes:

- Reduce administrative overhead from standups and status reporting.
- Replace repeated status chasing with direct inspection of delivery signals.
- EMs may be a stronger wedge than TPMs because many teams lack TPM coverage.
- Areg referenced Madri's team as a pilot-like example of low visibility across leads, resources, and sprint commitments.
- The product could support:
  - TPMs
  - EMs
  - engineering directors
  - Xcelforce developers
  - eventually client internal teams
- Views could aggregate upward:
  - team lead
  - manager
  - director
- Areg wanted marketing language around AI-enabled resources.
- Chris could be positioned as the domain expert/talking head.
- Prototype estimate: roughly three weeks, excluding enterprise certification and onboarding.

### What We Built That Matches

- The prototype is strongest here.
- It clearly targets EM/TPM visibility.
- It emphasizes fragmented inputs:
  - Jira
  - GitHub/Git
  - CI
  - Slack
  - Meeting Notes
  - Notion
  - Output
- It shows commitment risk, progress vs plan, blockers, and source-backed signals.
- It includes "Conflicting signals" to show why status meetings/Jira alone are insufficient.
- It includes "Needs follow-up," which reflects TPM/EM attention management.
- It uses Chris as owner/operator in the hardcoded data.

### What Is Missing

- No hierarchy views:
  - team lead view
  - EM view
  - director view
- No specific pilot story for Madri or an Uber-like organization.
- No staffing-plus-software commercial narrative in the UI.
- No marketing/buyer page.
- No "meeting reduction" or "hours saved" proof point.
- No clear before/after story showing how many meetings/status pings this replaces.

### Assessment

The prototype aligns well with V3's product wedge. The biggest missing piece is buyer narrative: the app shows useful data, but it does not yet make the business value obvious enough for Areg's sales motion.

## Video 4 Audit: Architecture Review And Program Pulse

### What Was Discussed

This call produced the clearest product shape.

First visible product could include:

- Monday digest.
- Initiatives in flight.
- What got completed last week.
- What got pushed to production.
- PR/code summaries mapped to initiatives.
- What is planned this week.
- What slipped.
- Blockers and risks.
- Director/EM overview.
- On-track/off-track program health.

Other major points:

- Should Program Pulse become the source of truth, or feed updates into Jira/Linear/Slack/Teams?
- Main value is synthesis: code shipped versus planned work, and whether the initiative is actually on track.
- Architecture could become an "operating system for agents":
  - control plane
  - workers/agents
  - scheduling
  - queueing
  - auth
  - auditing
  - data ingestion
  - Jira/GitHub mapping
  - persona/prompt orchestration
  - report generation
  - output channels
- Areg reframed the commercial path:
  - client already pays for Chris
  - Xcelforce gives Chris better tools
  - client sees more output
  - then Xcelforce expands access
- They identified that experienced TPM value is the tree of secondary questions and judgment thresholds.

### What We Built That Matches

- Program Pulse name and concept.
- Weekly visibility brief.
- Initiative health table.
- Completed last week.
- Plan for this week.
- Slipped commitments.
- Blockers/risks.
- Program health/confidence.
- Evidence timeline.
- Source coverage map.
- Human-reviewed drafts.
- Suggested system-of-record note rather than direct writeback.
- Conflicting signals:
  - Jira says one thing.
  - PR/CI/meeting notes say another.
  - TPM question is surfaced.
- Needs follow-up queue.

### What Is Missing

- No dedicated "pushed to production" view.
- No real PR/code summary.
- No Jira/Linear to PR/commit mapping.
- No director-level rollup.
- No agent/control-plane architecture.
- No scheduler, queue, worker, auth, audit, or data-ingestion layer.
- No output channel integrations.
- No learning loop from edited/dismissed recommendations.

### Assessment

The prototype is most faithful to V4's visible product concept. It intentionally omits V4's architecture. That is the right tradeoff for a frontend concept demo, but we should not imply the hard backend exists.

## Feature Coverage Matrix

| Idea From Calls | Current Status | Notes |
| --- | --- | --- |
| Program Pulse | Built | Main nav and product framing use this. |
| EM/TPM visibility layer | Built | Strong current positioning. |
| Not a Jira replacement | Built | Uses "system-of-record note" and source-backed signals. |
| Monday/weekly digest | Built | Present as Weekly Brief. |
| Initiatives in flight | Built | Initiative health table. |
| Completed last week | Built | In weekly brief. |
| Planned this week | Built | In weekly brief. |
| Slipped commitments | Built | In weekly brief and data examples. |
| Blockers/risks | Built | Attention Needed view. |
| Evidence-backed claims | Built | Evidence timeline and source chips. |
| Conflicting source signals | Built | Explicit panel. |
| Human approval | Built conceptually | Buttons are UI-only, no persisted workflow. |
| Stakeholder-specific updates | Partial | Executive, engineering, system note only. |
| Slack/Teams/email export | Missing | Drafts exist, no export/send. |
| PR/code summaries | Partial | PR evidence exists, no real code summary. |
| Production/deploy visibility | Partial | Deploy signal appears, no first-class shipped-to-prod view. |
| Sprint estimation feedback | Partial | Drift and risk examples exist, no dedicated analysis. |
| Scope creep detection | Partial | Implied through conflicts/drift, not explicit. |
| Team lead/manager/director hierarchy | Missing | No hierarchy or rollups. |
| Real connectors | Missing | All data is hardcoded. |
| Jira/Linear mapping to PRs | Missing | Represented in data, not computed. |
| Agent OS/control plane | Missing | Outside frontend scope. |
| Security/IP architecture | Missing | Needs separate artifact. |
| Customer-managed deployment mode | Missing | Needs architecture note. |
| No-training/data retention guardrails | Missing | Should be surfaced in demo or companion doc. |
| ROI model | Missing | Important for Areg. |
| Buyer narrative | Partial | Product language improved, no one-page sales narrative. |

## What The Prototype Communicates Well

- This is about visibility, not project management.
- EMs and TPMs are overloaded by fragmented signals.
- Jira status alone is not enough.
- Code/PR/CI/meeting-note signals can contradict planned status.
- The system drafts a brief, but the human remains in control.
- Chris's value is encoded as judgment questions, not replaced.

## What The Prototype Does Not Yet Communicate Well

- How this helps Xcelforce sell AI-enabled resources.
- Why a buyer would pay for it.
- How much reporting/status-chasing time it saves.
- How Xcelforce protects its IP.
- How client data is secured.
- Whether this can run without code leaving the customer's environment.
- How the system learns from Chris's edits.

## What Is Too Much Or Potentially Distracting

- Two demo programs may dilute the demo. One crisp story is stronger.
- Too many metrics can make it feel like a dashboard rather than a weekly intelligence brief.
- Risk cards can read like generic governance if not tied to source conflicts.
- The "agent OS" idea should not be demo language for buyers.
- Security AI and developer productivity should remain future expansions, not first-demo scope.

## What Should Be Added Before Demoing To Chris And Areg

Highest priority:

1. A "What changed since last week" panel.
2. An "Evidence explanation" drawer or expanded view for one risk.
3. A small guardrail strip:
   - Read-only
   - Draft only
   - Human approved
   - No autonomous writes
4. A single crisp demo scenario:
   - Jira looks on track.
   - PR/CI/meeting notes show a hidden risk.
   - Program Pulse catches it.
   - Chris approves a brief.
5. A companion one-page architecture/security note.
6. A companion buyer narrative for Areg:
   - fewer status meetings
   - more visibility per EM
   - more programs per TPM
   - earlier risk detection

## Recommended Demo Framing

Use this positioning:

> Program Pulse is a delivery intelligence layer for EMs and TPMs. It does not replace Jira, Linear, Slack, Notion, or meetings. It reads the signals teams already produce, detects what changed or conflicts, drafts the weekly brief, and keeps Chris or the EM in control.

Suggested demo path:

1. Start with Program Pulse overview.
2. Point to fragmented inputs.
3. Show one conflicting signal.
4. Explain the TPM question the system asks.
5. Show the weekly brief.
6. Show human approval/edit/dismiss.
7. End with the source-backed evidence view.

## Overall Verdict

The prototype is now a strong concept demo for the Program Pulse wedge that emerged most clearly in V3 and V4.

It partially represents V1's AI-enabled TPM skill-suite concept and barely represents V2's security/IP architecture discussion.

That is the right scope for now if the next conversation is about whether the product experience matches Chris and Areg's thinking. It is not enough if the next conversation is about enterprise implementation, procurement, or client data approval.

The next best work is not more dashboard surface. It is sharpening the demo story and preparing two supporting artifacts:

1. Buyer narrative for Areg.
2. Architecture/security/IP note for Chris.
