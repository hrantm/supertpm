export const roleSnapshots = [
  {
    id: "team-lead",
    name: "Team Lead: Checkout Rollback",
    selectorLabel: "Team Lead - 1 initiative",
    roleName: "Team Lead",
    owner: "Maya Chen",
    sponsor: "Checkout Platform",
    cadence: "Daily initiative check",
    refresh: "Mon 8:00 AM",
    confidence: 87,
    releaseTarget: "Rollback validation",
    summary:
      "The team lead view stays close to one initiative: code fixes, validation proof, owner handoffs, and whether the work is still pointed in the right direction.",
    scope: {
      scopeLabel: "1 initiative",
      organizationLabel: "1 project under one team",
      decisionAltitude: "Implementation direction",
      hierarchyDescription:
        "Maya sees the checkout rollback initiative only. The useful signal is not portfolio rollup; it is whether code, tests, runbook evidence, and the team plan agree.",
      initiativeTitle: "Signal synthesis for the active initiative",
      visibleSignals: [
        "PR diffs and review state",
        "CI failures and staging validation",
        "Jira story drift",
        "Runbook edits",
        "Standup blockers",
      ],
    },
    scopeTree: [
      {
        label: "Checkout rollback automation",
        owner: "Maya Chen",
        count: "1 initiative",
        status: "Watch",
        summary: "Implementation has landed, but staging rollback proof is still missing.",
      },
    ],
    metrics: [
      {
        label: "Active initiatives",
        value: "1",
        delta: "+0",
        tone: "neutral",
        note: "Focused view for the team lead's current delivery commitment.",
      },
      {
        label: "Open code fixes",
        value: "6",
        delta: "-2",
        tone: "good",
        note: "Two review comments were resolved after the Friday PR update.",
      },
      {
        label: "Validation risk",
        value: "42%",
        delta: "+7",
        tone: "watch",
        note: "Risk moved from implementation to staging proof.",
      },
      {
        label: "Reviewed signals",
        value: "28",
        delta: "+10",
        tone: "neutral",
        note: "PR, CI, runbook, Jira, and standup notes were reviewed.",
      },
    ],
    initiatives: [
      {
        key: "REL-2204",
        name: "Checkout rollback automation",
        lead: "Reliability",
        progress: 48,
        planned: 62,
        status: "watch",
        evidence: ["PR #488", "CI 8831", "Runbook draft"],
        summary:
          "Rollback path is coded, but the staging validation checklist is still empty.",
      },
    ],
    readout: [
      "The implementation direction is right, but the team should stop calling the work done until staging rollback proof exists.",
      "The highest leverage action is pairing Reliability and Checkout on one end-to-end validation run today.",
      "Jira progress is ahead of proof. The lead update should be a validation plan, not a green status.",
    ],
    weekChanges: [
      {
        type: "Risk shifted",
        tone: "watch",
        title: "Rollback moved from code risk to validation risk",
        summary:
          "The PR now contains the rollback command path, but CI and runbook signals do not prove it works in staging.",
        previous: "Implementation open",
        current: "Validation missing",
        confidence: "High confidence",
        explanation: [
          "PR #488 shows the rollback command path and guardrail checks are implemented.",
          "CI 8831 validates unit coverage but does not exercise the staging rollback path.",
          "The runbook draft exists, but the validation checklist has no completed timestamp.",
        ],
        sources: ["REL-2204", "PR #488", "CI 8831", "Runbook draft"],
        action:
          "Run staging rollback validation before the next lead sync and attach proof to REL-2204.",
      },
      {
        type: "Code fix",
        tone: "good",
        title: "Two review blockers were resolved",
        summary:
          "The Friday review thread shows idempotency and auth guard comments were addressed in the latest commit.",
        previous: "6 blocking comments",
        current: "4 blocking comments",
        confidence: "Medium confidence",
        explanation: [
          "The review thread shows two previously blocking comments marked resolved.",
          "The latest commit includes idempotency handling for repeated rollback requests.",
          "Auth guard coverage still needs one reviewer confirmation before merge confidence increases.",
        ],
        sources: ["PR #488", "Review thread", "Commit 18c2a"],
        action:
          "Ask the reviewer to confirm the remaining auth guard comment before the afternoon standup.",
      },
      {
        type: "Direction check",
        tone: "watch",
        title: "Runbook ownership is not explicit",
        summary:
          "The code path and runbook moved in parallel, but the runbook still does not name an operational owner.",
        previous: "Owner implied",
        current: "Owner missing",
        confidence: "Medium confidence",
        explanation: [
          "The Notion runbook has command steps and contact links.",
          "No named owner is listed for Thursday readiness or release-day support.",
          "Standup notes mention Reliability and Checkout separately, which can create handoff ambiguity.",
        ],
        sources: ["Runbook draft", "Standup notes", "REL-2204"],
        action:
          "Name the release-day owner in the runbook before sharing the status upward.",
      },
    ],
    reviewQueue: [
      {
        title: "Attach staging proof",
        owner: "Maya",
        body: "The initiative cannot move back to green until rollback validation is evidenced.",
      },
      {
        title: "Close remaining PR comments",
        owner: "Reliability",
        body: "Two code fixes landed, but auth guard review is still open.",
      },
      {
        title: "Name operational owner",
        owner: "Checkout",
        body: "Runbook support ownership is missing from the release checklist.",
      },
    ],
    conflicts: [
      {
        title: "Jira status is greener than validation evidence",
        priority: "High",
        system: "REL-2204 is marked 62 percent complete and trending toward readiness.",
        evidence:
          "PR #488 is implemented, but CI and runbook signals do not show a successful staging rollback.",
        question:
          "Team lead question: should the initiative remain in watch until staging proof is attached?",
        sources: ["REL-2204", "PR #488", "CI 8831", "Runbook draft"],
      },
      {
        title: "Runbook looks complete but ownership is unclear",
        priority: "Medium",
        system: "The Notion runbook has command steps and escalation contacts.",
        evidence:
          "Standup notes do not name who owns release-day rollback execution.",
        question:
          "Team lead question: who is accountable for the first rollback drill?",
        sources: ["Runbook draft", "Standup notes"],
      },
    ],
    digest: [
      {
        title: "Completed last week",
        items: [
          "Rollback command scaffolding landed in PR #488.",
          "Two blocking review comments were resolved.",
          "Initial runbook steps were drafted in Notion.",
        ],
      },
      {
        title: "Plan for this week",
        items: [
          "Run staging rollback validation and attach evidence to REL-2204.",
          "Close the remaining auth guard review comment.",
          "Name the release-day rollback owner in the runbook.",
        ],
      },
      {
        title: "Slipped commitments",
        items: [
          "Staging proof was planned for Friday but has no CI, deploy, or runbook evidence yet.",
        ],
      },
    ],
    drafts: {
      executive: {
        title: "Lead summary",
        paragraphs: [
          "Checkout rollback automation is implemented but should remain in watch until staging proof is attached.",
          "The team needs one validation run, one remaining review confirmation, and explicit release-day ownership before calling this ready.",
        ],
      },
      engineering: {
        title: "Engineering update",
        paragraphs: [
          "Focus today is validation, not more implementation.",
          "PR #488 has the rollback path. CI 8831 does not prove staging behavior. The runbook needs an owner and a completed validation checklist.",
        ],
      },
      jira: {
        title: "Suggested system-of-record note",
        paragraphs: [
          "Status: Watch.",
          "Update: Rollback implementation has landed. Staging validation and release-day owner assignment remain open.",
          "Next step: attach validation proof before the next lead sync.",
        ],
      },
    },
    risks: [
      {
        id: "tl-risk-1",
        severity: "watch",
        status: "watch",
        title: "Staging rollback proof is missing",
        owner: "Reliability",
        probability: "High",
        impact: "Initiative readiness",
        body:
          "The rollback path is implemented, but no linked signal proves it works end to end in staging.",
        action: "Run validation and attach evidence to REL-2204.",
        sources: ["REL-2204", "CI 8831", "Runbook draft"],
      },
      {
        id: "tl-risk-2",
        severity: "watch",
        status: "watch",
        title: "Release-day owner is unnamed",
        owner: "Checkout",
        probability: "Medium",
        impact: "Operational handoff",
        body:
          "The runbook names steps and contacts, but not the accountable owner for the first rollback drill.",
        action: "Assign an owner before sharing the status upward.",
        sources: ["Runbook draft", "Standup notes"],
      },
      {
        id: "tl-risk-3",
        severity: "critical",
        status: "critical",
        title: "Auth guard review can block readiness",
        owner: "Reliability",
        probability: "Medium",
        impact: "Code confidence",
        body:
          "One auth guard review comment remains unresolved and touches rollback execution permissions.",
        action: "Get reviewer confirmation before the afternoon standup.",
        sources: ["PR #488", "Review thread"],
      },
    ],
    evidence: [
      {
        time: "08:00",
        source: "Jira",
        title: "REL-2204 still marked on target",
        body:
          "The story shows expected progress at 62 percent despite validation evidence lagging.",
        confidence: "Medium",
      },
      {
        time: "08:03",
        source: "GitHub",
        title: "Rollback command path landed",
        body:
          "PR #488 includes the command path, idempotency handling, and rollback guard checks.",
        confidence: "High",
      },
      {
        time: "08:07",
        source: "CI",
        title: "CI does not exercise staging rollback",
        body:
          "CI 8831 is green for unit coverage but has no linked staging validation job.",
        confidence: "High",
      },
      {
        time: "08:11",
        source: "Notion",
        title: "Runbook checklist is incomplete",
        body:
          "The runbook draft includes commands and contacts, but the validation checklist is empty.",
        confidence: "Medium",
      },
      {
        time: "08:15",
        source: "Meeting Notes",
        title: "Owner handoff is ambiguous",
        body:
          "Standup notes mention Reliability and Checkout follow-up without a named release-day owner.",
        confidence: "Medium",
      },
    ],
    signals: [
      { source: "Jira", detail: "Story scope and acceptance criteria", state: "Read only", strength: 92 },
      { source: "Git", detail: "PR diff, review state, changed files", state: "Simulated", strength: 90 },
      { source: "CI", detail: "Test pass and missing validation jobs", state: "Simulated", strength: 78 },
      { source: "Slack", detail: "Standup blockers and owner asks", state: "Optional", strength: 52 },
      { source: "Meeting Notes", detail: "Daily sync decisions", state: "Simulated", strength: 66 },
      { source: "Notion", detail: "Runbook steps and ownership", state: "Simulated", strength: 70 },
      { source: "Output", detail: "Lead update and Jira note", state: "Human reviewed", strength: 100 },
    ],
  },
  {
    id: "manager",
    name: "Manager: Checkout Platform",
    selectorLabel: "Manager - 4 team leads",
    roleName: "Manager",
    owner: "Chris L.",
    sponsor: "Commerce Engineering",
    cadence: "Monday team lead review",
    refresh: "Mon 8:00 AM",
    confidence: 82,
    releaseTarget: "Jun 28 release train",
    summary:
      "The manager view rolls up four team leads, highlights dependencies between their projects, and separates local implementation noise from management-level priority calls.",
    scope: {
      scopeLabel: "4 team leads",
      organizationLabel: "7 initiatives across 4 leads",
      decisionAltitude: "Dependency and priority tradeoffs",
      hierarchyDescription:
        "Chris sees every initiative owned by four team leads. The useful signal is how one lead's risk changes another lead's plan, especially fraud, rollback, payment auth, and observability dependencies.",
      initiativeTitle: "Signal synthesis across team-lead projects",
      visibleSignals: [
        "Team lead status drift",
        "Cross-project dependencies",
        "Ownership gaps",
        "Sprint commitment risk",
        "Escalation candidates",
      ],
    },
    scopeTree: [
      {
        label: "Maya Chen - Checkout rollback",
        owner: "Team Lead",
        count: "1 initiative",
        status: "Watch",
        summary: "Rollback implementation is done, but validation proof is missing.",
      },
      {
        label: "Owen Patel - Fraud handoff",
        owner: "Team Lead",
        count: "2 initiatives",
        status: "At risk",
        summary: "Fraud API contract drift is blocking release confidence.",
      },
      {
        label: "Priya Shah - Order observability",
        owner: "Team Lead",
        count: "2 initiatives",
        status: "On track",
        summary: "Trace coverage is progressing, with retry and refund gaps still open.",
      },
      {
        label: "Leo Martinez - Payment auth",
        owner: "Team Lead",
        count: "2 initiatives",
        status: "On track",
        summary: "Payment cleanup shipped and no longer needs manager escalation.",
      },
    ],
    metrics: [
      {
        label: "Team leads",
        value: "4",
        delta: "+0",
        tone: "neutral",
        note: "Four leads own the active release work in this manager scope.",
      },
      {
        label: "Open blockers",
        value: "4",
        delta: "-1",
        tone: "good",
        note: "Payment auth dependency cleared Friday.",
      },
      {
        label: "Commitment risk",
        value: "31%",
        delta: "+0",
        tone: "watch",
        note: "Risk is concentrated in fraud handoff and rollback validation.",
      },
      {
        label: "Cross-project links",
        value: "9",
        delta: "+3",
        tone: "watch",
        note: "Fraud and rollback dependencies now affect the same release train.",
      },
    ],
    initiatives: [
      {
        key: "REL-2204",
        name: "Checkout rollback automation",
        lead: "Maya Chen",
        progress: 48,
        planned: 62,
        status: "watch",
        evidence: ["PR #488", "Runbook draft", "CI 8831"],
        summary:
          "Code exists, but validation proof is missing before release readiness.",
      },
      {
        key: "FRAUD-612",
        name: "Risk score handoff",
        lead: "Owen Patel",
        progress: 33,
        planned: 55,
        status: "at-risk",
        evidence: ["PR #496", "Slack risk thread", "Meeting notes"],
        summary:
          "API contract changed twice and PRs do not map to committed sprint scope.",
      },
      {
        key: "OBS-1047",
        name: "Order trace observability",
        lead: "Priya Shah",
        progress: 61,
        planned: 58,
        status: "on-track",
        evidence: ["PR #492", "Deploy 06.15"],
        summary:
          "Trace IDs now appear on checkout and receipt surfaces.",
      },
      {
        key: "PAY-1842",
        name: "Payment authorization cleanup",
        lead: "Leo Martinez",
        progress: 76,
        planned: 72,
        status: "on-track",
        evidence: ["PR #481", "PR #488", "CI 8829"],
        summary:
          "Merged token refresh changes and cleared two failing integration tests.",
      },
    ],
    readout: [
      "Payment auth is no longer the main blocker. Risk has shifted to rollback validation and fraud score handoff.",
      "The fraud contract issue now affects rollback readiness because both feed the same release train.",
      "The manager update should name owners and dependency decisions, not list every code fix from each lead.",
    ],
    weekChanges: [
      {
        type: "Risk shifted",
        tone: "risk",
        title: "Main risk moved from payments auth to fraud handoff",
        summary:
          "Payment cleanup is evidenced by merged PRs, while FRAUD-612 picked up a contract mismatch after sprint commitment.",
        previous: "PAY-1842 blocked",
        current: "FRAUD-612 at risk",
        confidence: "High confidence",
        explanation: [
          "PAY-1842 has two merged PRs and a linked deploy reference, so the old blocker is no longer the highest management concern.",
          "PR #496 implements v3 fraud mapping while Jira acceptance criteria still reference the v2 response contract.",
          "Meeting notes do not name a decision owner for the contract change.",
        ],
        sources: ["PAY-1842", "PR #481", "PR #496", "Meeting Notes"],
        action:
          "Confirm Fraud Systems ownership before Wednesday and rebaseline the commitment if the v3 contract is real scope.",
      },
      {
        type: "Dependency",
        tone: "watch",
        title: "Fraud handoff now gates rollback confidence",
        summary:
          "Rollback can validate technically, but the release train still cannot clear readiness while fraud response fields are unstable.",
        previous: "Separate lead risks",
        current: "Connected release risk",
        confidence: "Medium confidence",
        explanation: [
          "REL-2204 and FRAUD-612 are both mapped to the Jun 28 release train.",
          "Fraud response changes alter the checkout failure path that rollback validation must cover.",
          "The Monday lead sync did not assign one owner to reconcile the dependency.",
        ],
        sources: ["REL-2204", "FRAUD-612", "Release plan", "Lead sync"],
        action:
          "Run a joint dependency review with Maya and Owen before Thursday readiness.",
      },
      {
        type: "Signal improved",
        tone: "good",
        title: "Observability gained release evidence",
        summary:
          "Order trace work moved from planned implementation to deployed feature-flag evidence.",
        previous: "Planned",
        current: "Deployed in staging",
        confidence: "High confidence",
        explanation: [
          "OBS-1047 has a deploy event for checkout trace propagation behind a feature flag.",
          "PR #492 links implementation to checkout and receipt surfaces.",
          "Retry and refund paths are still not covered, so the status remains on track rather than complete.",
        ],
        sources: ["OBS-1047", "PR #492", "Deploy 06.15"],
        action:
          "Keep this green-yellow and ask whether retry and refund trace coverage is release-blocking.",
      },
    ],
    reviewQueue: [
      {
        title: "Confirm Fraud Systems owner",
        owner: "Chris",
        body: "Meeting notes and Slack agree that FRAUD-612 lacks a named decision owner.",
      },
      {
        title: "Ask for rollback validation proof",
        owner: "Maya",
        body: "Implementation evidence exists, but CI and deploy signals do not yet show end-to-end validation.",
      },
      {
        title: "Run dependency review",
        owner: "Chris",
        body: "Fraud handoff and rollback validation are connected through the release train.",
      },
    ],
    conflicts: [
      {
        title: "Jira progress is ahead of implementation evidence",
        priority: "High",
        system:
          "FRAUD-612 appears planned against the original v2 response contract.",
        evidence:
          "PR #496 implements v3 mapping and the meeting notes show the owner decision is still open.",
        question:
          "Manager question: should this commitment be rebaselined before Thursday status?",
        sources: ["FRAUD-612", "PR #496", "Meeting Notes"],
      },
      {
        title: "Merged code does not equal release confidence",
        priority: "Medium",
        system:
          "REL-2204 has implementation work merged and appears close to done.",
        evidence:
          "CI and Notion show no completed staging validation checklist for the rollback path.",
        question:
          "Manager question: is rollback validation release-blocking or a post-merge follow-up?",
        sources: ["REL-2204", "CI 8831", "Notion runbook"],
      },
    ],
    digest: [
      {
        title: "Completed last week",
        items: [
          "PAY-1842 merged PR #481 and PR #488 for token refresh cleanup.",
          "OBS-1047 deployed trace ID propagation behind a feature flag.",
          "REL-2204 completed rollback command scaffolding, but validation remains open.",
        ],
      },
      {
        title: "Plan for this week",
        items: [
          "Finish rollback verification in staging and publish operational runbook.",
          "Resolve FRAUD-612 API contract mismatch with Fraud Systems.",
          "Run a joint dependency review for fraud handoff and rollback readiness.",
        ],
      },
      {
        title: "Slipped commitments",
        items: [
          "FRAUD-612 was forecast at 55 percent complete, but code evidence supports roughly 33 percent.",
          "REL-2204 verification was planned for Friday and has no CI or deploy signal yet.",
        ],
      },
    ],
    drafts: {
      executive: {
        title: "Manager summary",
        paragraphs: [
          "Checkout Platform remains directionally on track, with one dependency that needs management attention this week.",
          "Payment authorization cleanup shipped as planned. Rollback automation is progressing, but validation is now the critical path. Fraud score handoff is the only initiative trending at risk due to repeated API contract changes.",
          "Recommended action: confirm Fraud Systems ownership by Wednesday and keep rollback verification in the Thursday readiness review.",
        ],
      },
      engineering: {
        title: "Engineering update",
        paragraphs: [
          "This week's priority is converting merged code into verified release confidence.",
          "Maya should close staging validation for REL-2204. Owen and Checkout need one contract decision on FRAUD-612 before additional implementation work starts.",
          "Evidence reviewed: Jira issues PAY-1842, REL-2204, OBS-1047, FRAUD-612; PR #481, #488, #496; deploy checkout-2026.06.15.",
        ],
      },
      jira: {
        title: "Suggested system-of-record note",
        paragraphs: [
          "Status: Watch.",
          "Update: Payment auth cleanup shipped and observability work progressed. Rollback automation implementation is complete but validation is pending. Fraud handoff has slipped because API contract changes are not reflected in sprint estimates.",
          "Risks: FRAUD-612 ownership and REL-2204 validation. Next checkpoint: Thursday readiness review.",
        ],
      },
    },
    risks: [
      {
        id: "mgr-risk-1",
        severity: "critical",
        status: "blocked",
        title: "Fraud score API contract changed after sprint commitment",
        owner: "Owen Patel",
        probability: "High",
        impact: "Release confidence",
        body:
          "The committed story still assumes v2 response fields, while PR #496 implements v3 mapping. Jira progress has not been adjusted.",
        action: "Schedule owner decision before Wednesday noon.",
        sources: ["FRAUD-612", "PR #496", "Meeting notes", "Slack #checkout-risk"],
      },
      {
        id: "mgr-risk-2",
        severity: "watch",
        status: "watch",
        title: "Rollback implementation lacks staging proof",
        owner: "Maya Chen",
        probability: "Medium",
        impact: "Operational readiness",
        body:
          "Code has landed, but no CI run or deploy evidence confirms the rollback path works end to end.",
        action: "Add staging validation to Thursday review.",
        sources: ["REL-2204", "PR #488", "CI 8831", "Notion runbook"],
      },
      {
        id: "mgr-risk-3",
        severity: "watch",
        status: "watch",
        title: "Connected projects lack one dependency owner",
        owner: "Chris L.",
        probability: "Medium",
        impact: "Release train coordination",
        body:
          "Fraud handoff and rollback validation now affect the same checkout release path, but ownership is split between two leads.",
        action: "Hold a joint dependency review with both leads.",
        sources: ["Release plan", "Lead sync", "FRAUD-612", "REL-2204"],
      },
    ],
    evidence: [
      {
        time: "08:00",
        source: "Jira",
        title: "PAY-1842 moved to Done",
        body:
          "Sprint board shows payment auth cleanup complete with two linked PRs and one deploy reference.",
        confidence: "High",
      },
      {
        time: "08:04",
        source: "GitHub",
        title: "PR #496 conflicts with FRAUD-612 scope",
        body:
          "Diff references v3 risk mapping, but Jira acceptance criteria still describe v2 response fields.",
        confidence: "Medium",
      },
      {
        time: "08:08",
        source: "CI",
        title: "Rollback validation missing",
        body:
          "REL-2204 has merged implementation code, but no green staging validation run is linked.",
        confidence: "High",
      },
      {
        time: "08:11",
        source: "Deploy",
        title: "Trace IDs deployed behind feature flag",
        body:
          "Checkout trace propagation is live in staging behind checkout_trace_context.",
        confidence: "High",
      },
      {
        time: "08:14",
        source: "Meeting Notes",
        title: "Fraud ownership unresolved in lead sync",
        body:
          "The Monday lead sync shows no named owner for the v3 risk score contract decision.",
        confidence: "Medium",
      },
    ],
    signals: [
      { source: "Jira", detail: "Initiatives and committed scope", state: "Read only", strength: 94 },
      { source: "Git", detail: "PRs, diffs, owners, changed files", state: "Simulated", strength: 88 },
      { source: "CI", detail: "Test and validation evidence", state: "Simulated", strength: 71 },
      { source: "Slack", detail: "Risk comments and owner asks", state: "Optional", strength: 46 },
      { source: "Meeting Notes", detail: "Lead syncs, standups, and review decisions", state: "Simulated", strength: 68 },
      { source: "Notion", detail: "Runbooks, specs, and release checklists", state: "Simulated", strength: 63 },
      { source: "Output", detail: "Brief, system note, manager summary", state: "Human reviewed", strength: 100 },
    ],
  },
  {
    id: "director",
    name: "Director: Commerce Engineering",
    selectorLabel: "Director - 4 managers",
    roleName: "Director",
    owner: "Dana Morgan",
    sponsor: "Product Engineering",
    cadence: "Biweekly portfolio review",
    refresh: "Mon 8:00 AM",
    confidence: 76,
    releaseTarget: "Q3 commerce milestones",
    summary:
      "The director view rolls up four managers and shifts from individual blockers to portfolio health, capacity tradeoffs, recurring dependency patterns, and roadmap commitments.",
    scope: {
      scopeLabel: "4 managers",
      organizationLabel: "23 initiatives across 4 managers",
      decisionAltitude: "Portfolio sequencing",
      hierarchyDescription:
        "Dana sees four manager scopes: Checkout Platform, Account Platform, Marketplace Operations, and Trust Systems. The useful signal is where local risks repeat across managers or threaten roadmap commitments.",
      initiativeTitle: "Signal synthesis across manager portfolios",
      visibleSignals: [
        "Portfolio risk concentration",
        "Manager-level dependency chains",
        "Capacity and review bottlenecks",
        "Roadmap milestone drift",
        "Escalation patterns",
      ],
    },
    scopeTree: [
      {
        label: "Checkout Platform",
        owner: "Chris L.",
        count: "7 initiatives",
        status: "Watch",
        summary: "Release confidence depends on fraud handoff and rollback validation.",
      },
      {
        label: "Account Platform",
        owner: "Nia Brooks",
        count: "5 initiatives",
        status: "On track",
        summary: "Identity refresh is healthy, with Android adoption as the only watch item.",
      },
      {
        label: "Marketplace Operations",
        owner: "Samir Rao",
        count: "6 initiatives",
        status: "Watch",
        summary: "Catalog migration is slowed by partner data quality and review queues.",
      },
      {
        label: "Trust Systems",
        owner: "Elena Park",
        count: "5 initiatives",
        status: "At risk",
        summary: "Fraud controls and compliance review share the same scarce reviewers.",
      },
    ],
    metrics: [
      {
        label: "Managers",
        value: "4",
        delta: "+0",
        tone: "neutral",
        note: "Four manager portfolios are included in this director view.",
      },
      {
        label: "Active initiatives",
        value: "23",
        delta: "+3",
        tone: "watch",
        note: "New compliance work entered the portfolio after planning.",
      },
      {
        label: "Portfolio risk",
        value: "38%",
        delta: "+6",
        tone: "watch",
        note: "Risk is concentrated in shared reviewers and commerce release dependencies.",
      },
      {
        label: "Exec asks",
        value: "5",
        delta: "+2",
        tone: "watch",
        note: "Two roadmap commitments need director-level sequencing decisions.",
      },
    ],
    initiatives: [
      {
        key: "MGR-CHECKOUT",
        name: "Checkout Platform release train",
        lead: "Chris L.",
        progress: 58,
        planned: 66,
        status: "watch",
        evidence: ["Manager brief", "Release plan", "FRAUD-612"],
        summary:
          "Fraud contract drift and rollback validation are connected risks under the same release train.",
      },
      {
        key: "MGR-ACCOUNT",
        name: "Account Platform identity refresh",
        lead: "Nia Brooks",
        progress: 71,
        planned: 68,
        status: "on-track",
        evidence: ["Readiness review", "CI 4412", "Legal packet"],
        summary:
          "Legal and token rotation cleared; Android adoption remains a bounded watch item.",
      },
      {
        key: "MGR-MKTOPS",
        name: "Marketplace catalog migration",
        lead: "Samir Rao",
        progress: 52,
        planned: 61,
        status: "watch",
        evidence: ["Data quality report", "Partner notes", "Review queue"],
        summary:
          "Partner data quality issues are slowing migration and consuming review capacity.",
      },
      {
        key: "MGR-TRUST",
        name: "Trust controls modernization",
        lead: "Elena Park",
        progress: 44,
        planned: 63,
        status: "at-risk",
        evidence: ["Compliance review", "Fraud roadmap", "Staffing plan"],
        summary:
          "Compliance review and fraud controls are competing for the same senior reviewers.",
      },
    ],
    readout: [
      "The director-level issue is not one checkout bug; it is reviewer scarcity across Trust, Fraud, and Commerce release work.",
      "Checkout and Trust risks share the same fraud systems dependency, so escalating them separately will hide the capacity problem.",
      "Account Platform can stay out of executive escalation unless Android adoption slips again.",
    ],
    weekChanges: [
      {
        type: "Pattern found",
        tone: "risk",
        title: "Fraud systems dependency repeats across two managers",
        summary:
          "Checkout and Trust both depend on the same fraud systems reviewers, creating a portfolio-level capacity risk.",
        previous: "Local team risks",
        current: "Shared reviewer bottleneck",
        confidence: "High confidence",
        explanation: [
          "Checkout Platform has FRAUD-612 blocked on a contract decision.",
          "Trust Systems has compliance and fraud-control reviews queued with the same senior reviewers.",
          "Manager notes from both scopes reference reviewer availability as the limiting factor.",
        ],
        sources: ["FRAUD-612", "Trust review queue", "Manager notes"],
        action:
          "Sequence fraud reviewer allocation across Checkout and Trust before the next portfolio review.",
      },
      {
        type: "Roadmap drift",
        tone: "watch",
        title: "Catalog migration slipped because partner quality is below threshold",
        summary:
          "Marketplace Operations is still progressing, but data-quality cleanup is consuming planned migration capacity.",
        previous: "Migration execution",
        current: "Partner cleanup first",
        confidence: "Medium confidence",
        explanation: [
          "The data quality report shows two partner feeds below launch threshold.",
          "Review queue activity increased without matching completed migration evidence.",
          "Partner notes show cleanup ownership is still split between operations and engineering.",
        ],
        sources: ["Data quality report", "Partner notes", "Review queue"],
        action:
          "Decide whether catalog migration absorbs cleanup work or rebaselines the milestone.",
      },
      {
        type: "Signal improved",
        tone: "good",
        title: "Identity refresh no longer needs director escalation",
        summary:
          "Account Platform cleared legal and token rotation risks; Android adoption is bounded to one manager watch item.",
        previous: "Multiple readiness risks",
        current: "One mobile watch",
        confidence: "High confidence",
        explanation: [
          "Legal copy and session token rotation both have completion evidence.",
          "Android adoption is behind but isolated to one stream.",
          "No cross-manager dependency is currently attached to the identity refresh.",
        ],
        sources: ["Legal packet", "CI 4412", "Readiness review"],
        action:
          "Keep Account Platform in the portfolio brief but remove it from the escalation list.",
      },
    ],
    reviewQueue: [
      {
        title: "Sequence fraud reviewer allocation",
        owner: "Dana",
        body: "Checkout and Trust are competing for the same senior reviewers.",
      },
      {
        title: "Rebaseline catalog migration scope",
        owner: "Samir",
        body: "Partner cleanup is consuming migration capacity and should be explicit in the plan.",
      },
      {
        title: "Keep identity refresh out of escalation",
        owner: "Nia",
        body: "Account Platform has one bounded watch item and no director-level dependency.",
      },
    ],
    conflicts: [
      {
        title: "Managers report separate risks, but evidence shows one bottleneck",
        priority: "High",
        system:
          "Checkout and Trust are tracked as independent manager-level risks.",
        evidence:
          "Both risk chains cite the same fraud systems reviewers and the same decision forum.",
        question:
          "Director question: should reviewer allocation be sequenced centrally this week?",
        sources: ["Manager notes", "Trust review queue", "FRAUD-612"],
      },
      {
        title: "Catalog plan omits cleanup capacity",
        priority: "Medium",
        system:
          "Marketplace Operations plan still assumes migration capacity is available.",
        evidence:
          "Partner data quality cleanup is already consuming review and engineering time.",
        question:
          "Director question: should partner cleanup become explicit scope or trigger a milestone rebaseline?",
        sources: ["Partner notes", "Data quality report", "Review queue"],
      },
    ],
    digest: [
      {
        title: "Completed last week",
        items: [
          "Account Platform cleared legal copy and token rotation risks.",
          "Checkout Platform shipped payment auth cleanup.",
          "Marketplace Operations completed the first partner feed quality review.",
        ],
      },
      {
        title: "Plan for this week",
        items: [
          "Sequence fraud reviewer allocation across Checkout and Trust.",
          "Decide whether catalog cleanup is explicit migration scope.",
          "Keep identity refresh monitored at manager level unless Android adoption slips again.",
        ],
      },
      {
        title: "Slipped commitments",
        items: [
          "Trust controls modernization slipped behind plan because compliance and fraud reviews share the same scarce reviewers.",
          "Catalog migration progress trails the roadmap because partner data cleanup was not in the original estimate.",
        ],
      },
    ],
    drafts: {
      executive: {
        title: "Director summary",
        paragraphs: [
          "Commerce Engineering has two director-level concerns this week: shared fraud reviewer capacity and catalog migration cleanup scope.",
          "Checkout and Trust should be sequenced together because their risks share the same reviewers. Account Platform is healthy enough to remain out of escalation.",
          "Recommended action: make reviewer allocation and catalog cleanup scope explicit before the next portfolio review.",
        ],
      },
      engineering: {
        title: "Engineering update",
        paragraphs: [
          "The main portfolio constraint is reviewer capacity, not isolated team execution.",
          "Checkout and Trust managers should align on fraud reviewer sequencing. Marketplace Operations should clarify whether partner cleanup is part of committed migration scope.",
        ],
      },
      jira: {
        title: "Suggested portfolio note",
        paragraphs: [
          "Status: Watch.",
          "Update: Account Platform improved; Checkout and Trust risks are connected through shared fraud reviewer capacity; Marketplace migration needs cleanup scope clarification.",
          "Next checkpoint: portfolio sequencing review.",
        ],
      },
    },
    risks: [
      {
        id: "dir-risk-1",
        severity: "critical",
        status: "critical",
        title: "Shared fraud reviewers are overcommitted",
        owner: "Dana Morgan",
        probability: "High",
        impact: "Portfolio sequencing",
        body:
          "Checkout and Trust both depend on the same senior reviewers, but the work is still planned as independent manager-level risk.",
        action: "Sequence reviewer allocation centrally this week.",
        sources: ["Manager notes", "Trust review queue", "FRAUD-612"],
      },
      {
        id: "dir-risk-2",
        severity: "watch",
        status: "watch",
        title: "Catalog migration cleanup is hidden scope",
        owner: "Samir Rao",
        probability: "Medium",
        impact: "Roadmap milestone",
        body:
          "Partner data cleanup is consuming migration capacity but is not represented in the committed plan.",
        action: "Make cleanup scope explicit or rebaseline the milestone.",
        sources: ["Data quality report", "Partner notes"],
      },
      {
        id: "dir-risk-3",
        severity: "watch",
        status: "watch",
        title: "Android adoption can return to escalation",
        owner: "Nia Brooks",
        probability: "Low",
        impact: "Identity release readiness",
        body:
          "Identity refresh is healthy overall, but Android adoption remains one review cycle behind target.",
        action: "Monitor at manager level and escalate only if the review slips again.",
        sources: ["Readiness review", "PR #777"],
      },
    ],
    evidence: [
      {
        time: "08:00",
        source: "Manager Brief",
        title: "Checkout risk is still tied to fraud handoff",
        body:
          "Checkout Platform manager brief names FRAUD-612 and rollback validation as connected release risks.",
        confidence: "High",
      },
      {
        time: "08:05",
        source: "Review Queue",
        title: "Trust controls waiting on fraud reviewers",
        body:
          "Trust Systems review queue shows two compliance reviews waiting on the same senior fraud reviewers.",
        confidence: "High",
      },
      {
        time: "08:09",
        source: "Data Quality",
        title: "Partner feeds below migration threshold",
        body:
          "Two partner feeds are below the catalog migration quality threshold and need cleanup.",
        confidence: "Medium",
      },
      {
        time: "08:13",
        source: "Readiness Review",
        title: "Identity refresh de-escalated",
        body:
          "Legal copy and token rotation are evidenced; Android adoption remains the only watch item.",
        confidence: "High",
      },
      {
        time: "08:18",
        source: "Meeting Notes",
        title: "No central reviewer sequencing decision",
        body:
          "Portfolio notes mention reviewer scarcity but do not assign allocation order across managers.",
        confidence: "Medium",
      },
    ],
    signals: [
      { source: "Jira", detail: "Portfolio initiatives and manager status", state: "Read only", strength: 90 },
      { source: "Git", detail: "Review queues and ownership concentration", state: "Simulated", strength: 80 },
      { source: "CI", detail: "Release readiness and validation trend", state: "Simulated", strength: 67 },
      { source: "Slack", detail: "Escalation asks and dependency comments", state: "Optional", strength: 44 },
      { source: "Meeting Notes", detail: "Portfolio review decisions", state: "Simulated", strength: 74 },
      { source: "Notion", detail: "Roadmap, launch checklists, and partner plans", state: "Simulated", strength: 69 },
      { source: "Output", detail: "Director brief and sequencing asks", state: "Human reviewed", strength: 100 },
    ],
  },
  {
    id: "vp",
    name: "VP: Product Engineering",
    selectorLabel: "VP - 4 directors",
    roleName: "VP",
    owner: "Avery Stone",
    sponsor: "Executive Staff",
    cadence: "Monthly operating review",
    refresh: "Mon 8:00 AM",
    confidence: 72,
    releaseTarget: "Q3 business commitments",
    summary:
      "The VP view rolls up four directors and changes the product from delivery tracking to operating visibility: strategic commitments, investment tradeoffs, risk concentration, and where leaders need alignment.",
    scope: {
      scopeLabel: "4 directors",
      organizationLabel: "76 initiatives across 4 directors",
      decisionAltitude: "Operating model and investment tradeoffs",
      hierarchyDescription:
        "Avery sees four director organizations. The useful signal is not which PR changed; it is where portfolio risks threaten commitments, customer trust, or allocation decisions.",
      initiativeTitle: "Signal synthesis across director organizations",
      visibleSignals: [
        "Commitment health",
        "Risk concentration by director",
        "Investment and staffing tradeoffs",
        "Customer-impact milestones",
        "Executive alignment gaps",
      ],
    },
    scopeTree: [
      {
        label: "Commerce Engineering",
        owner: "Dana Morgan",
        count: "23 initiatives",
        status: "Watch",
        summary: "Shared fraud reviewer capacity is affecting Checkout and Trust.",
      },
      {
        label: "Consumer Experience",
        owner: "Riley Kim",
        count: "18 initiatives",
        status: "On track",
        summary: "Growth experiments are healthy, with design review as the only watch item.",
      },
      {
        label: "Platform Foundations",
        owner: "Jordan Lee",
        count: "21 initiatives",
        status: "Watch",
        summary: "Infra migration is progressing but consuming more staff capacity than forecast.",
      },
      {
        label: "Data and Intelligence",
        owner: "Morgan Fox",
        count: "14 initiatives",
        status: "At risk",
        summary: "Analytics modernization and governance commitments are both behind plan.",
      },
    ],
    metrics: [
      {
        label: "Directors",
        value: "4",
        delta: "+0",
        tone: "neutral",
        note: "Four director organizations are included in this operating view.",
      },
      {
        label: "Commitments at risk",
        value: "8",
        delta: "+2",
        tone: "watch",
        note: "Risk increased in data governance and commerce dependency sequencing.",
      },
      {
        label: "Org risk",
        value: "29%",
        delta: "+4",
        tone: "watch",
        note: "Risk is still bounded but now concentrated in two director organizations.",
      },
      {
        label: "Investment tradeoffs",
        value: "5",
        delta: "+2",
        tone: "watch",
        note: "Staffing and reviewer capacity decisions need VP-level alignment.",
      },
    ],
    initiatives: [
      {
        key: "DIR-COMMERCE",
        name: "Commerce Engineering",
        lead: "Dana Morgan",
        progress: 57,
        planned: 66,
        status: "watch",
        evidence: ["Director brief", "Reviewer capacity", "Q3 roadmap"],
        summary:
          "Commerce can hit commitments if fraud reviewer allocation is sequenced this week.",
      },
      {
        key: "DIR-CX",
        name: "Consumer Experience",
        lead: "Riley Kim",
        progress: 69,
        planned: 65,
        status: "on-track",
        evidence: ["Experiment review", "Design queue", "Launch plan"],
        summary:
          "Growth and onboarding work are healthy, with design review as a contained watch item.",
      },
      {
        key: "DIR-PLATFORM",
        name: "Platform Foundations",
        lead: "Jordan Lee",
        progress: 62,
        planned: 68,
        status: "watch",
        evidence: ["Migration plan", "Staffing forecast", "Incident review"],
        summary:
          "Infra migration is progressing but consuming more senior staff time than forecast.",
      },
      {
        key: "DIR-DATA",
        name: "Data and Intelligence",
        lead: "Morgan Fox",
        progress: 41,
        planned: 60,
        status: "at-risk",
        evidence: ["Governance review", "Analytics roadmap", "Hiring plan"],
        summary:
          "Analytics modernization and governance commitments are behind plan and competing for the same specialists.",
      },
    ],
    readout: [
      "The VP-level story is risk concentration: Commerce and Data account for most commitment risk this cycle.",
      "Reviewer capacity and specialist allocation are operating-model issues, not isolated execution misses.",
      "Consumer Experience can stay green; it does not need the same executive attention as Commerce reviewer sequencing and Data governance recovery.",
    ],
    weekChanges: [
      {
        type: "Risk concentration",
        tone: "risk",
        title: "Two director orgs now hold most commitment risk",
        summary:
          "Commerce and Data account for the majority of at-risk Q3 commitments after new governance and reviewer-capacity signals landed.",
        previous: "Distributed risk",
        current: "Commerce and Data concentrated",
        confidence: "High confidence",
        explanation: [
          "Commerce risk increased after shared fraud reviewer capacity affected two manager portfolios.",
          "Data risk increased after governance and analytics modernization both slipped behind plan.",
          "Consumer Experience and Platform Foundations are not driving the current executive escalation list.",
        ],
        sources: ["Director briefs", "Governance review", "Reviewer capacity"],
        action:
          "Use the operating review to align on Commerce reviewer sequencing and Data specialist allocation.",
      },
      {
        type: "Investment tradeoff",
        tone: "watch",
        title: "Specialist capacity is becoming the limiting resource",
        summary:
          "Senior fraud reviewers, data governance specialists, and infra migration leads are all overcommitted relative to Q3 asks.",
        previous: "Team-level staffing asks",
        current: "Org-level allocation decision",
        confidence: "Medium confidence",
        explanation: [
          "Three director briefs cite specialist capacity rather than generic headcount.",
          "The staffing forecast shows senior staff utilization above plan for Platform and Data.",
          "Commerce reviewer scarcity is already affecting roadmap sequencing.",
        ],
        sources: ["Staffing forecast", "Director briefs", "Q3 roadmap"],
        action:
          "Decide which Q3 commitments get specialist priority and which get rebaselined.",
      },
      {
        type: "Signal improved",
        tone: "good",
        title: "Consumer Experience remains out of escalation",
        summary:
          "Growth and onboarding milestones have healthy evidence and no cross-director dependency requiring VP action.",
        previous: "Potential design bottleneck",
        current: "Contained watch",
        confidence: "High confidence",
        explanation: [
          "Experiment review shows launch candidates progressing on plan.",
          "Design review is one queue behind but not blocking the customer milestone.",
          "No director brief links Consumer Experience to the current operating-review tradeoffs.",
        ],
        sources: ["Experiment review", "Design queue", "Launch plan"],
        action:
          "Keep Consumer Experience in the readout as green-yellow and reserve VP attention for Commerce and Data.",
      },
    ],
    reviewQueue: [
      {
        title: "Align on specialist allocation",
        owner: "Avery",
        body: "Commerce, Data, and Platform all cite scarce senior specialists as limiting resources.",
      },
      {
        title: "Review Data recovery plan",
        owner: "Morgan",
        body: "Governance and analytics modernization are both behind plan.",
      },
      {
        title: "Confirm Commerce sequencing",
        owner: "Dana",
        body: "Fraud reviewer allocation needs one ordering decision this week.",
      },
    ],
    conflicts: [
      {
        title: "Local plans look manageable, but org risk is concentrated",
        priority: "High",
        system:
          "Each director plan has mitigation steps and mostly bounded status language.",
        evidence:
          "Commitment risk is now concentrated in Commerce reviewer sequencing and Data specialist allocation.",
        question:
          "VP question: which Q3 commitments should receive scarce specialist capacity first?",
        sources: ["Director briefs", "Staffing forecast", "Governance review"],
      },
      {
        title: "Platform migration progress hides staff cost",
        priority: "Medium",
        system:
          "Platform Foundations is progressing close to plan on migration milestones.",
        evidence:
          "The staffing forecast shows the migration is consuming more senior staff time than planned.",
        question:
          "VP question: should migration staffing be protected or traded off against Data recovery?",
        sources: ["Migration plan", "Staffing forecast", "Incident review"],
      },
    ],
    digest: [
      {
        title: "Completed last period",
        items: [
          "Consumer Experience kept growth and onboarding milestones on track.",
          "Platform Foundations progressed infra migration with no new incident regression.",
          "Commerce identified fraud reviewer capacity as the true blocker behind multiple manager risks.",
        ],
      },
      {
        title: "Plan for this period",
        items: [
          "Align specialist allocation across Commerce, Platform, and Data.",
          "Review Data governance recovery plan and rebaseline if needed.",
          "Confirm Commerce fraud reviewer sequencing before Q3 milestones drift.",
        ],
      },
      {
        title: "Slipped commitments",
        items: [
          "Data governance and analytics modernization are both behind plan.",
          "Commerce release confidence depends on a reviewer allocation decision that is not yet made.",
        ],
      },
    ],
    drafts: {
      executive: {
        title: "VP operating summary",
        paragraphs: [
          "Q3 engineering commitments remain recoverable, but risk is now concentrated in Commerce and Data.",
          "The common pattern is specialist capacity: fraud reviewers, data governance experts, and infra migration leads are being pulled across too many critical commitments.",
          "Recommended action: use the operating review to prioritize specialist allocation and rebaseline lower-priority commitments explicitly.",
        ],
      },
      engineering: {
        title: "Leadership update",
        paragraphs: [
          "The next operating decision is not a broad hiring request. It is a sequencing decision for scarce senior specialists.",
          "Commerce needs fraud reviewer sequencing; Data needs governance recovery; Platform migration needs protected capacity only if it remains a top Q3 commitment.",
        ],
      },
      jira: {
        title: "Suggested operating-review note",
        paragraphs: [
          "Status: Watch.",
          "Update: Risk is concentrated in Commerce and Data. Consumer Experience remains healthy. Platform migration is progressing but consuming more senior staff capacity than forecast.",
          "Decision needed: specialist allocation priority for Q3 commitments.",
        ],
      },
    },
    risks: [
      {
        id: "vp-risk-1",
        severity: "critical",
        status: "critical",
        title: "Specialist capacity is overcommitted",
        owner: "Avery Stone",
        probability: "High",
        impact: "Q3 commitment health",
        body:
          "Commerce, Data, and Platform all depend on scarce senior specialists for commitments planned in the same window.",
        action: "Prioritize specialist allocation in the operating review.",
        sources: ["Staffing forecast", "Director briefs", "Q3 roadmap"],
      },
      {
        id: "vp-risk-2",
        severity: "critical",
        status: "blocked",
        title: "Data governance recovery plan is not credible yet",
        owner: "Morgan Fox",
        probability: "High",
        impact: "Governance commitment",
        body:
          "Governance and analytics modernization are both behind plan and competing for the same specialists.",
        action: "Create a recovery plan or rebaseline the governance commitment.",
        sources: ["Governance review", "Analytics roadmap", "Hiring plan"],
      },
      {
        id: "vp-risk-3",
        severity: "watch",
        status: "watch",
        title: "Commerce risk needs one sequencing decision",
        owner: "Dana Morgan",
        probability: "Medium",
        impact: "Commerce Q3 milestones",
        body:
          "Commerce risk is recoverable if fraud reviewer allocation is sequenced this week.",
        action: "Confirm reviewer sequencing before the next operating review.",
        sources: ["Director brief", "Reviewer capacity", "Q3 roadmap"],
      },
    ],
    evidence: [
      {
        time: "08:00",
        source: "Director Briefs",
        title: "Risk concentrated in Commerce and Data",
        body:
          "Commerce and Data account for most Q3 commitments now flagged watch or worse.",
        confidence: "High",
      },
      {
        time: "08:05",
        source: "Staffing Forecast",
        title: "Senior specialist utilization above plan",
        body:
          "Fraud reviewers, data governance specialists, and infra migration leads are all forecast above planned utilization.",
        confidence: "Medium",
      },
      {
        time: "08:09",
        source: "Governance Review",
        title: "Data governance recovery plan missing",
        body:
          "The review shows governance and analytics modernization both behind plan without a credible recovery owner.",
        confidence: "High",
      },
      {
        time: "08:13",
        source: "Experiment Review",
        title: "Consumer Experience remains healthy",
        body:
          "Growth and onboarding launch candidates are progressing with design review as a contained watch item.",
        confidence: "High",
      },
      {
        time: "08:18",
        source: "Q3 Roadmap",
        title: "Tradeoff not reflected in commitments",
        body:
          "The roadmap still lists all specialist-heavy commitments in the same window without sequencing notes.",
        confidence: "Medium",
      },
    ],
    signals: [
      { source: "Jira", detail: "Commitment health across director orgs", state: "Read only", strength: 86 },
      { source: "Git", detail: "Review concentration and specialist ownership", state: "Simulated", strength: 72 },
      { source: "CI", detail: "Release-readiness trend by portfolio", state: "Simulated", strength: 58 },
      { source: "Slack", detail: "Escalation asks and leadership alignment gaps", state: "Optional", strength: 42 },
      { source: "Meeting Notes", detail: "Operating review decisions", state: "Simulated", strength: 76 },
      { source: "Notion", detail: "Roadmap, staffing, and recovery plans", state: "Simulated", strength: 74 },
      { source: "Output", detail: "VP operating brief and decision asks", state: "Human reviewed", strength: 100 },
    ],
  },
];

export const views = [
  { id: "overview", label: "Overview" },
  { id: "digest", label: "Role Brief" },
  { id: "risks", label: "Attention Needed" },
  { id: "evidence", label: "Evidence" },
];

export const statuses = {
  "on-track": "On track",
  watch: "Watch",
  "at-risk": "At risk",
  blocked: "Blocked",
  critical: "Critical",
};
