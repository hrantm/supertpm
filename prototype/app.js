const fixture = {
  programs: [
    {
      id: "team-lead",
      name: "Team Lead - 1 initiative",
      role: "Team Lead",
      orgScope: "1 initiative",
      altitude: "Implementation direction",
      confidence: "87 percent",
      scopeSummary:
        "The team lead sees one initiative. Useful signals stay close to the work: PR diffs, CI failures, runbook gaps, Jira story drift, and standup blockers.",
      visibleSignals: ["PR diffs", "CI validation", "Jira story drift", "Runbook ownership", "Standup blockers"],
      metrics: [
        { label: "Active initiatives", value: "1", trend: "flat", delta: "+0", note: "Focused on one delivery commitment." },
        { label: "Open code fixes", value: "6", trend: "good", delta: "-2", note: "Two review comments were resolved Friday." },
        { label: "Validation risk", value: "42%", trend: "watch", delta: "+7", note: "Risk moved from code completion to staging proof." },
        { label: "Reviewed signals", value: "28", trend: "neutral", delta: "+10", note: "PR, CI, runbook, Jira, and standup notes reviewed." },
      ],
      initiatives: [
        {
          key: "REL-2204",
          name: "Checkout rollback automation",
          lead: "Reliability",
          progress: 48,
          delta: "-14%",
          status: "watch",
          summary: "Code exists, but staging rollback proof is missing.",
        },
      ],
      readout: [
        "The implementation direction is right, but the initiative should stay in watch until staging proof exists.",
        "The highest leverage action is pairing Reliability and Checkout on one end-to-end validation run today.",
        "The lead update should focus on validation and ownership, not a green status.",
      ],
      digest: [
        { title: "Completed last week", items: ["Rollback command scaffolding landed.", "Two blocking review comments were resolved.", "Initial runbook steps were drafted."] },
        { title: "Plan for this week", items: ["Run staging rollback validation.", "Close the remaining auth guard review.", "Name the release-day rollback owner."] },
        { title: "Slipped commitments", items: ["Staging proof was planned for Friday but has no linked evidence yet."] },
      ],
      drafts: {
        exec: { title: "Lead summary", body: ["Checkout rollback automation is implemented but should remain in watch until staging proof is attached.", "The team needs one validation run, one review confirmation, and explicit release-day ownership before calling this ready."] },
        engineering: { title: "Engineering update", body: ["Focus today is validation, not more implementation.", "PR #488 has the rollback path. CI does not prove staging behavior. The runbook needs an owner and a completed validation checklist."] },
        jira: { title: "Suggested system note", body: ["Status: Watch.", "Update: Rollback implementation has landed. Staging validation and release-day owner assignment remain open."] },
      },
      risks: [
        { id: "tl-risk-1", severity: "watch", status: "watch", title: "Staging rollback proof is missing", owner: "Reliability", body: "No linked signal proves the rollback path works end to end in staging.", action: "Run validation and attach evidence to REL-2204.", sources: ["REL-2204", "CI 8831", "Runbook"] },
        { id: "tl-risk-2", severity: "critical", status: "critical", title: "Auth guard review can block readiness", owner: "Reliability", body: "One auth guard review comment remains unresolved.", action: "Get reviewer confirmation before the afternoon standup.", sources: ["PR #488", "Review thread"] },
      ],
      evidence: [
        { time: "Mon 08:00", type: "Jira", title: "REL-2204 still marked on target", body: "The story shows expected progress despite validation evidence lagging.", confidence: "Medium" },
        { time: "Mon 08:03", type: "GitHub", title: "Rollback command path landed", body: "PR #488 includes the command path and guard checks.", confidence: "High" },
        { time: "Mon 08:07", type: "CI", title: "CI does not exercise staging rollback", body: "CI is green for unit coverage but has no linked staging validation job.", confidence: "High" },
      ],
      signalMap: [
        { type: "Jira", name: "Story scope and acceptance criteria", state: "Read only" },
        { type: "Git", name: "PR diff, review state, changed files", state: "Mocked" },
        { type: "CI", name: "Test pass and missing validation jobs", state: "Mocked" },
        { type: "Output", name: "Lead update and system note", state: "Human reviewed" },
      ],
    },
    {
      id: "manager",
      name: "Manager - 4 team leads",
      role: "Manager",
      orgScope: "4 team leads",
      altitude: "Dependency and priority tradeoffs",
      confidence: "82 percent",
      scopeSummary:
        "The manager sees every project under four team leads. Useful signals are dependency chains, ownership gaps, sprint commitment risk, and which lead-level issue needs escalation.",
      visibleSignals: ["Team lead drift", "Cross-project dependencies", "Ownership gaps", "Commitment risk", "Escalation candidates"],
      metrics: [
        { label: "Team leads", value: "4", trend: "flat", delta: "+0", note: "Four leads own the active release work." },
        { label: "Open blockers", value: "4", trend: "good", delta: "-1", note: "Payment auth dependency cleared Friday." },
        { label: "Commitment risk", value: "31%", trend: "watch", delta: "+0", note: "Risk is concentrated in fraud handoff and rollback validation." },
        { label: "Cross-project links", value: "9", trend: "watch", delta: "+3", note: "Fraud and rollback now affect the same release train." },
      ],
      initiatives: [
        { key: "Maya Chen", name: "Checkout rollback", lead: "Team Lead", progress: 48, delta: "-14%", status: "watch", summary: "Implementation is done, but validation proof is missing." },
        { key: "Owen Patel", name: "Fraud handoff", lead: "Team Lead", progress: 33, delta: "-22%", status: "at-risk", summary: "API contract drift is blocking release confidence." },
        { key: "Priya Shah", name: "Order observability", lead: "Team Lead", progress: 61, delta: "+3%", status: "on-track", summary: "Trace coverage is progressing, with retry and refund gaps open." },
        { key: "Leo Martinez", name: "Payment auth cleanup", lead: "Team Lead", progress: 76, delta: "+4%", status: "on-track", summary: "Payment cleanup shipped and no longer needs manager escalation." },
      ],
      readout: [
        "Payment auth is no longer the main blocker. Risk shifted to rollback validation and fraud handoff.",
        "The fraud contract issue now affects rollback readiness because both feed the same release train.",
        "The manager update should name owners and dependency decisions, not list every code fix.",
      ],
      digest: [
        { title: "Completed last week", items: ["Payment auth cleanup shipped.", "Order trace propagation deployed behind a feature flag.", "Rollback implementation landed, but validation remains open."] },
        { title: "Plan for this week", items: ["Resolve the fraud API contract mismatch.", "Finish rollback validation.", "Run a joint dependency review for fraud and rollback readiness."] },
        { title: "Slipped commitments", items: ["Fraud handoff is behind committed scope.", "Rollback proof was planned for Friday and has no validation signal yet."] },
      ],
      drafts: {
        exec: { title: "Manager summary", body: ["Checkout Platform remains directionally on track, with one dependency needing management attention this week.", "Recommended action: confirm Fraud Systems ownership and keep rollback validation in Thursday readiness."] },
        engineering: { title: "Engineering update", body: ["This week's priority is converting merged code into verified release confidence.", "Fraud and Checkout need one contract decision before additional implementation work starts."] },
        jira: { title: "Suggested system note", body: ["Status: Watch.", "Update: Payment auth shipped. Rollback validation and fraud handoff remain the active risks."] },
      },
      risks: [
        { id: "mgr-risk-1", severity: "critical", status: "blocked", title: "Fraud score API contract changed after sprint commitment", owner: "Owen Patel", body: "The committed story assumes v2 response fields, while the active PR implements v3 mapping.", action: "Schedule owner decision before Wednesday noon.", sources: ["FRAUD-612", "PR #496", "Lead sync"] },
        { id: "mgr-risk-2", severity: "watch", status: "watch", title: "Rollback implementation lacks staging proof", owner: "Maya Chen", body: "Code landed, but no signal confirms the rollback path works end to end.", action: "Add staging validation to Thursday review.", sources: ["REL-2204", "CI 8831"] },
        { id: "mgr-risk-3", severity: "watch", status: "watch", title: "Connected projects lack one dependency owner", owner: "Chris L.", body: "Fraud handoff and rollback validation now affect the same checkout release path.", action: "Hold a joint dependency review with both leads.", sources: ["Release plan", "Lead sync"] },
      ],
      evidence: [
        { time: "Mon 08:00", type: "Jira", title: "Payment auth moved to Done", body: "Sprint board shows payment auth cleanup complete with linked PRs.", confidence: "High" },
        { time: "Mon 08:04", type: "GitHub", title: "PR #496 conflicts with fraud scope", body: "Diff references v3 risk mapping while Jira still describes v2 fields.", confidence: "Medium" },
        { time: "Mon 08:08", type: "CI", title: "Rollback validation missing", body: "Rollback implementation is merged, but no staging validation run is linked.", confidence: "High" },
      ],
      signalMap: [
        { type: "Jira", name: "Initiatives and committed scope", state: "Read only" },
        { type: "Git", name: "PRs, owners, and changed files", state: "Mocked" },
        { type: "Slack", name: "Risk comments and owner asks", state: "Optional" },
        { type: "Output", name: "Manager brief and system note", state: "Human reviewed" },
      ],
    },
    {
      id: "director",
      name: "Director - 4 managers",
      role: "Director",
      orgScope: "4 managers",
      altitude: "Portfolio sequencing",
      confidence: "76 percent",
      scopeSummary:
        "The director sees four manager portfolios. Useful signals are repeated dependency patterns, capacity bottlenecks, roadmap milestone drift, and which manager risks should be sequenced together.",
      visibleSignals: ["Portfolio risk concentration", "Manager dependencies", "Capacity bottlenecks", "Roadmap drift", "Escalation patterns"],
      metrics: [
        { label: "Managers", value: "4", trend: "flat", delta: "+0", note: "Four manager portfolios are included." },
        { label: "Active initiatives", value: "23", trend: "watch", delta: "+3", note: "New compliance work entered after planning." },
        { label: "Portfolio risk", value: "38%", trend: "watch", delta: "+6", note: "Risk is concentrated in shared reviewers and commerce release dependencies." },
        { label: "Exec asks", value: "5", trend: "watch", delta: "+2", note: "Two roadmap commitments need director-level sequencing decisions." },
      ],
      initiatives: [
        { key: "Chris L.", name: "Checkout Platform", lead: "Manager", progress: 58, delta: "-8%", status: "watch", summary: "Fraud handoff and rollback validation are connected release risks." },
        { key: "Nia Brooks", name: "Account Platform", lead: "Manager", progress: 71, delta: "+3%", status: "on-track", summary: "Identity refresh is healthy, with Android adoption as the only watch item." },
        { key: "Samir Rao", name: "Marketplace Operations", lead: "Manager", progress: 52, delta: "-9%", status: "watch", summary: "Partner data quality is slowing catalog migration." },
        { key: "Elena Park", name: "Trust Systems", lead: "Manager", progress: 44, delta: "-19%", status: "at-risk", summary: "Fraud controls and compliance review share scarce reviewers." },
      ],
      readout: [
        "The director-level issue is reviewer scarcity across Trust, Fraud, and Commerce release work.",
        "Checkout and Trust risks share the same fraud dependency, so escalating them separately hides the capacity problem.",
        "Account Platform can stay out of executive escalation unless Android adoption slips again.",
      ],
      digest: [
        { title: "Completed last week", items: ["Account Platform cleared legal copy and token rotation risks.", "Checkout Platform shipped payment auth cleanup.", "Marketplace completed the first partner feed quality review."] },
        { title: "Plan for this week", items: ["Sequence fraud reviewer allocation across Checkout and Trust.", "Decide whether catalog cleanup is explicit migration scope.", "Keep identity refresh monitored at manager level."] },
        { title: "Slipped commitments", items: ["Trust controls modernization slipped because compliance and fraud reviews share scarce reviewers.", "Catalog migration trails roadmap because partner cleanup was not in the original estimate."] },
      ],
      drafts: {
        exec: { title: "Director summary", body: ["Commerce Engineering has two director-level concerns: shared fraud reviewer capacity and catalog migration cleanup scope.", "Recommended action: make reviewer allocation and catalog cleanup explicit before the next portfolio review."] },
        engineering: { title: "Engineering update", body: ["The main portfolio constraint is reviewer capacity, not isolated team execution.", "Checkout and Trust managers should align on fraud reviewer sequencing."] },
        jira: { title: "Suggested portfolio note", body: ["Status: Watch.", "Update: Account Platform improved; Checkout and Trust risks are connected through shared reviewer capacity."] },
      },
      risks: [
        { id: "dir-risk-1", severity: "critical", status: "critical", title: "Shared fraud reviewers are overcommitted", owner: "Dana Morgan", body: "Checkout and Trust both depend on the same senior reviewers.", action: "Sequence reviewer allocation centrally this week.", sources: ["Manager notes", "Trust review queue"] },
        { id: "dir-risk-2", severity: "watch", status: "watch", title: "Catalog migration cleanup is hidden scope", owner: "Samir Rao", body: "Partner data cleanup is consuming migration capacity but is not represented in the plan.", action: "Make cleanup scope explicit or rebaseline.", sources: ["Data quality report", "Partner notes"] },
      ],
      evidence: [
        { time: "Mon 08:00", type: "Manager Brief", title: "Checkout risk tied to fraud handoff", body: "Checkout Platform names fraud and rollback as connected release risks.", confidence: "High" },
        { time: "Mon 08:05", type: "Review Queue", title: "Trust waiting on fraud reviewers", body: "Two compliance reviews are waiting on the same senior fraud reviewers.", confidence: "High" },
        { time: "Mon 08:09", type: "Data Quality", title: "Partner feeds below threshold", body: "Two partner feeds are below the catalog migration quality threshold.", confidence: "Medium" },
      ],
      signalMap: [
        { type: "Jira", name: "Portfolio initiatives and manager status", state: "Read only" },
        { type: "Git", name: "Review queues and ownership concentration", state: "Mocked" },
        { type: "Notion", name: "Roadmap and partner plans", state: "Mocked" },
        { type: "Output", name: "Director brief and sequencing asks", state: "Human reviewed" },
      ],
    },
    {
      id: "vp",
      name: "VP - 4 directors",
      role: "VP",
      orgScope: "4 directors",
      altitude: "Operating model and investment tradeoffs",
      confidence: "72 percent",
      scopeSummary:
        "The VP sees four director organizations. Useful signals are commitment health, risk concentration, staffing tradeoffs, customer-impact milestones, and executive alignment gaps.",
      visibleSignals: ["Commitment health", "Risk by director", "Staffing tradeoffs", "Customer milestones", "Executive alignment"],
      metrics: [
        { label: "Directors", value: "4", trend: "flat", delta: "+0", note: "Four director organizations are included." },
        { label: "Commitments at risk", value: "8", trend: "watch", delta: "+2", note: "Risk increased in data governance and commerce sequencing." },
        { label: "Org risk", value: "29%", trend: "watch", delta: "+4", note: "Risk is bounded but concentrated in two director organizations." },
        { label: "Investment tradeoffs", value: "5", trend: "watch", delta: "+2", note: "Staffing and reviewer capacity decisions need VP-level alignment." },
      ],
      initiatives: [
        { key: "Dana Morgan", name: "Commerce Engineering", lead: "Director", progress: 57, delta: "-9%", status: "watch", summary: "Commerce can recover if fraud reviewer allocation is sequenced this week." },
        { key: "Riley Kim", name: "Consumer Experience", lead: "Director", progress: 69, delta: "+4%", status: "on-track", summary: "Growth and onboarding are healthy, with design review as a contained watch item." },
        { key: "Jordan Lee", name: "Platform Foundations", lead: "Director", progress: 62, delta: "-6%", status: "watch", summary: "Infra migration is progressing but consuming more senior staff time than forecast." },
        { key: "Morgan Fox", name: "Data and Intelligence", lead: "Director", progress: 41, delta: "-19%", status: "at-risk", summary: "Analytics modernization and governance commitments are behind plan." },
      ],
      readout: [
        "The VP-level story is risk concentration: Commerce and Data account for most commitment risk this cycle.",
        "Reviewer capacity and specialist allocation are operating-model issues, not isolated execution misses.",
        "Consumer Experience can stay green; it does not need the same executive attention as Commerce and Data.",
      ],
      digest: [
        { title: "Completed last period", items: ["Consumer Experience kept growth and onboarding milestones on track.", "Platform progressed infra migration with no new incident regression.", "Commerce identified reviewer capacity as the true blocker."] },
        { title: "Plan for this period", items: ["Align specialist allocation across Commerce, Platform, and Data.", "Review Data governance recovery plan.", "Confirm Commerce fraud reviewer sequencing."] },
        { title: "Slipped commitments", items: ["Data governance and analytics modernization are both behind plan.", "Commerce release confidence depends on a reviewer allocation decision."] },
      ],
      drafts: {
        exec: { title: "VP operating summary", body: ["Q3 engineering commitments remain recoverable, but risk is concentrated in Commerce and Data.", "Recommended action: prioritize specialist allocation and rebaseline lower-priority commitments explicitly."] },
        engineering: { title: "Leadership update", body: ["The next operating decision is a sequencing decision for scarce senior specialists.", "Commerce needs reviewer sequencing; Data needs governance recovery; Platform migration needs protected capacity only if it remains top priority."] },
        jira: { title: "Suggested operating-review note", body: ["Status: Watch.", "Update: Risk is concentrated in Commerce and Data. Decision needed: specialist allocation priority for Q3 commitments."] },
      },
      risks: [
        { id: "vp-risk-1", severity: "critical", status: "critical", title: "Specialist capacity is overcommitted", owner: "Avery Stone", body: "Commerce, Data, and Platform depend on scarce senior specialists in the same window.", action: "Prioritize specialist allocation in the operating review.", sources: ["Staffing forecast", "Director briefs"] },
        { id: "vp-risk-2", severity: "critical", status: "blocked", title: "Data governance recovery plan is not credible yet", owner: "Morgan Fox", body: "Governance and analytics modernization are both behind plan.", action: "Create a recovery plan or rebaseline the governance commitment.", sources: ["Governance review", "Analytics roadmap"] },
      ],
      evidence: [
        { time: "Mon 08:00", type: "Director Briefs", title: "Risk concentrated in Commerce and Data", body: "Commerce and Data account for most Q3 commitments now flagged watch or worse.", confidence: "High" },
        { time: "Mon 08:05", type: "Staffing", title: "Senior specialist utilization above plan", body: "Fraud reviewers, governance specialists, and infra leads are all forecast above plan.", confidence: "Medium" },
        { time: "Mon 08:09", type: "Governance", title: "Data recovery plan missing", body: "Governance and analytics modernization are behind plan without a credible recovery owner.", confidence: "High" },
      ],
      signalMap: [
        { type: "Jira", name: "Commitment health across director orgs", state: "Read only" },
        { type: "Git", name: "Review concentration and specialist ownership", state: "Mocked" },
        { type: "Notion", name: "Roadmap, staffing, and recovery plans", state: "Mocked" },
        { type: "Output", name: "VP operating brief and decision asks", state: "Human reviewed" },
      ],
    },
  ],
};

const signalColumns = [
  { id: "jira", label: "Jira", terms: ["jira", "story", "scope", "commitment", "roadmap", "release"] },
  { id: "git", label: "Git", terms: ["pr", "git", "review", "commit", "branch", "reviewer"] },
  { id: "ci", label: "CI", terms: ["ci", "validation", "test", "readiness", "migration"] },
  { id: "notes", label: "Notes", terms: ["notes", "sync", "brief", "meeting", "review", "standup"] },
  { id: "docs", label: "Docs", terms: ["notion", "runbook", "plan", "governance", "checklist", "forecast"] },
];

const dependencyLinks = {
  "team-lead": [
    { source: "PR #488", target: "Staging validation", severity: "watch", summary: "Implementation exists, but release confidence waits on proof." },
    { source: "Runbook owner", target: "Release-day support", severity: "watch", summary: "The handoff is ambiguous until one accountable owner is named." },
  ],
  manager: [
    { source: "Fraud handoff", target: "Rollback readiness", severity: "critical", summary: "Contract drift changes the checkout failure path rollback must validate." },
    { source: "Payment auth", target: "Release train", severity: "good", summary: "This dependency cleared and should leave escalation." },
    { source: "Observability", target: "Incident debugging", severity: "watch", summary: "Retry and refund coverage still determine completeness." },
  ],
  director: [
    { source: "Checkout", target: "Trust", severity: "critical", summary: "Both portfolios depend on the same senior fraud reviewers." },
    { source: "Partner quality", target: "Catalog migration", severity: "watch", summary: "Hidden cleanup scope is consuming migration capacity." },
    { source: "Account Platform", target: "Escalation", severity: "good", summary: "Identity refresh can stay monitored at manager level." },
  ],
  vp: [
    { source: "Commerce", target: "Specialists", severity: "critical", summary: "Reviewer sequencing is needed to protect Q3 commerce milestones." },
    { source: "Data governance", target: "Q3 commitments", severity: "critical", summary: "Governance recovery is not credible without specialist capacity." },
    { source: "Platform", target: "Staffing tradeoff", severity: "watch", summary: "Migration is progressing, but consuming more senior staff than forecast." },
  ],
};

const state = {
  programId: fixture.programs[0].id,
  view: "overview",
  audience: "exec",
  riskFilter: "all",
};

const viewTitles = {
  overview: "Overview",
  digest: "Role Brief",
  risks: "Attention Needed",
  evidence: "Evidence",
};

const statusLabels = {
  "on-track": "On track",
  watch: "Watch",
  "at-risk": "At risk",
  blocked: "Blocked",
  critical: "Critical",
};

const programSelect = document.querySelector("#program-select");
const viewTitle = document.querySelector("#view-title");
const toast = document.querySelector("#toast");

function getProgram() {
  return fixture.programs.find((program) => program.id === state.programId) || fixture.programs[0];
}

function statusClass(status) {
  if (status === "on-track") return "status-on-track";
  if (status === "watch") return "status-watch";
  if (status === "blocked" || status === "critical") return "status-blocked";
  return "status-at-risk";
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function signalScore(item, column) {
  const text = [item.key, item.name, item.lead, item.summary].join(" ").toLowerCase();
  const hasEvidence = column.terms.some((term) => text.includes(term));
  const statusPenalty = item.status === "at-risk" || item.status === "critical" || item.status === "blocked" ? 28 : item.status === "watch" ? 12 : 0;
  const evidenceBonus = hasEvidence ? 18 : column.id === "jira" ? 8 : 0;
  return clamp(Math.round(item.progress + evidenceBonus - statusPenalty), 18, 96);
}

function heatmapTone(score) {
  if (score >= 74) return "good";
  if (score >= 50) return "watch";
  return "critical";
}

function probabilityScore(probability, status) {
  if (probability === "High" || status === "critical" || status === "blocked") return 3;
  if (probability === "Low") return 1;
  return 2;
}

function impactScore(risk) {
  const text = `${risk.title} ${risk.body}`.toLowerCase();
  if (risk.status === "blocked" || risk.status === "critical") return 3;
  if (text.includes("q3") || text.includes("portfolio") || text.includes("roadmap") || text.includes("commitment")) return 3;
  if (text.includes("release") || text.includes("readiness") || text.includes("operational")) return 2;
  return 1;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderProgramOptions() {
  programSelect.innerHTML = fixture.programs
    .map((program) => `<option value="${program.id}">${program.name}</option>`)
    .join("");
  programSelect.value = state.programId;
}

function renderContext(program) {
  document.querySelector("#program-owner").textContent = program.role;
  document.querySelector("#program-cadence").textContent = program.orgScope;
  document.querySelector("#program-refresh").textContent = program.altitude;
  document.querySelector("#program-confidence").textContent = program.confidence;
}

function renderScope(program) {
  document.querySelector("#scope-content").innerHTML = `
    <p>${program.scopeSummary}</p>
    <div class="scope-chip-row">
      ${program.visibleSignals.map((signal) => `<span class="source-chip">${signal}</span>`).join("")}
    </div>
  `;
}

function renderMetrics(program) {
  document.querySelector("#metric-grid").innerHTML = program.metrics
    .map(
      (metric) => `
        <article class="metric">
          <div class="metric-top">
            <span class="metric-label">${metric.label}</span>
            <span class="trend ${metric.trend}">${metric.delta}</span>
          </div>
          <div class="metric-value">${metric.value}</div>
          <p class="metric-note">${metric.note}</p>
        </article>
      `
    )
    .join("");
}

function renderInitiatives(program) {
  document.querySelector("#initiative-table").innerHTML = program.initiatives
    .map((initiative) => {
      const cells = signalColumns
        .map((column) => {
          const score = signalScore(initiative, column);
          const tone = heatmapTone(score);
          return `
            <div class="heatmap-cell ${tone}" title="${column.label}: ${score}% signal strength">
              <strong>${score}</strong>
              <span>${tone === "good" ? "strong" : tone === "watch" ? "watch" : "gap"}</span>
            </div>
          `;
        })
        .join("");

      return `
        <article class="heatmap-row">
          <div class="heatmap-item">
            <span class="signal-type">${initiative.key}</span>
            <strong>${initiative.name}</strong>
            <p>${initiative.summary}</p>
            <span class="subtle">Owner: ${initiative.lead}</span>
          </div>
          ${cells}
          <div class="heatmap-status">
            <span class="status-pill ${statusClass(initiative.status)}">${statusLabels[initiative.status]}</span>
            <span class="subtle">${initiative.delta}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderDependencies(program) {
  document.querySelector("#dependency-map").innerHTML = (dependencyLinks[program.id] || [])
    .map(
      (link) => `
        <article class="dependency-link ${link.severity}">
          <div class="dependency-path">
            <span>${link.source}</span>
            <i></i>
            <span>${link.target}</span>
          </div>
          <p>${link.summary}</p>
        </article>
      `
    )
    .join("");
}

function renderHumanJudgement(program) {
  document.querySelector("#human-judgement").innerHTML = program.risks
    .slice(0, 3)
    .map(
      (risk) => `
        <article class="judgement-item">
          <div>
            <h4>${risk.title}</h4>
            <p>${risk.action}</p>
          </div>
          <span class="source-chip">${risk.owner}</span>
        </article>
      `
    )
    .join("");
}

function renderReadout(program) {
  document.querySelector("#manager-readout").innerHTML = program.readout
    .map(
      (item, index) => `
        <article class="readout-item">
          <span class="readout-index">${String(index + 1).padStart(2, "0")}</span>
          <p>${item}</p>
        </article>
      `
    )
    .join("");
}

function renderDigest(program) {
  document.querySelector("#digest-content").innerHTML = program.digest
    .map(
      (section) => `
        <section class="digest-section">
          <h4>${section.title}</h4>
          <ul>
            ${section.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </section>
      `
    )
    .join("");
}

function renderDraft(program) {
  const draft = program.drafts[state.audience];
  document.querySelector("#draft-box").innerHTML = `
    <h4>${draft.title}</h4>
    ${draft.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
  `;
}

function renderRisks(program) {
  const risks =
    state.riskFilter === "all"
      ? program.risks
      : program.risks.filter((risk) => risk.severity === state.riskFilter || risk.status === state.riskFilter);

  const probabilityRows = [
    { score: 3, label: "High probability" },
    { score: 2, label: "Medium probability" },
    { score: 1, label: "Low probability" },
  ];
  const impactColumns = [
    { score: 1, label: "Contained impact" },
    { score: 2, label: "Delivery impact" },
    { score: 3, label: "Strategic impact" },
  ];

  document.querySelector("#risk-grid").innerHTML = `
    <div class="risk-matrix-inner">
      <div></div>
      ${impactColumns.map((column) => `<div class="matrix-label">${column.label}</div>`).join("")}
      ${probabilityRows
        .map(
          (row) => `
            <div class="matrix-label row-label">${row.label}</div>
            ${impactColumns
              .map((column) => {
                const cellRisks = risks.filter((risk) => probabilityScore(risk.probability, risk.status) === row.score && impactScore(risk) === column.score);
                return `
                  <div class="matrix-cell ${row.score === 3 && column.score === 3 ? "critical-zone" : row.score + column.score >= 5 ? "watch-zone" : ""}">
                    ${
                      cellRisks.length === 0
                        ? `<span class="empty-risk">No active risks</span>`
                        : cellRisks
                            .map(
                              (risk) => `
                                <article class="risk-card matrix-risk">
                                  <div class="risk-meta">
                                    <span class="status-pill ${statusClass(risk.status)}">${statusLabels[risk.status]}</span>
                                    <span class="subtle">${risk.owner}</span>
                                  </div>
                                  <h4>${risk.title}</h4>
                                  <p>${risk.body}</p>
                                  <p><strong>Action:</strong> ${risk.action}</p>
                                </article>
                              `
                            )
                            .join("")
                    }
                  </div>
                `;
              })
              .join("")}
          `
        )
        .join("")}
    </div>
  `;
}

function renderEvidence(program) {
  document.querySelector("#evidence-timeline").innerHTML = program.evidence
    .map(
      (event) => `
        <article class="timeline-item">
          <span class="time-stamp">${event.time}<br>${event.type}</span>
          <div>
            <h4>${event.title}</h4>
            <p>${event.body}</p>
            <span class="source-chip">Confidence: ${event.confidence}</span>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelector("#signal-map").innerHTML = program.signalMap
    .map(
      (signal) => `
        <div class="signal-row">
          <span class="signal-type">${signal.type}</span>
          <strong>${signal.name}</strong>
          <span class="source-chip">${signal.state}</span>
        </div>
      `
    )
    .join("");
}

function renderView() {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.querySelector(`#${state.view}-view`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });
  viewTitle.textContent = viewTitles[state.view];
}

function renderAll() {
  const program = getProgram();
  renderContext(program);
  renderScope(program);
  renderMetrics(program);
  renderInitiatives(program);
  renderDependencies(program);
  renderHumanJudgement(program);
  renderReadout(program);
  renderDigest(program);
  renderDraft(program);
  renderRisks(program);
  renderEvidence(program);
  renderView();
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    renderView();
  });
});

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.audience = button.dataset.audience;
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === button));
    renderDraft(getProgram());
  });
});

document.querySelectorAll(".filter-pill").forEach((button) => {
  button.addEventListener("click", () => {
    state.riskFilter = button.dataset.filter;
    document.querySelectorAll(".filter-pill").forEach((pill) => pill.classList.toggle("active", pill === button));
    renderRisks(getProgram());
  });
});

programSelect.addEventListener("change", (event) => {
  state.programId = event.target.value;
  renderAll();
});

document.querySelector("#refresh-button").addEventListener("click", () => {
  showToast("Role snapshot refreshed");
});

document.querySelector("#approve-button").addEventListener("click", () => {
  showToast("Brief marked ready for review");
});

document.querySelector("#copy-digest-button").addEventListener("click", async () => {
  const program = getProgram();
  const text = program.digest
    .map((section) => `${section.title}\n${section.items.map((item) => `- ${item}`).join("\n")}`)
    .join("\n\n");

  try {
    await navigator.clipboard.writeText(text);
    showToast("Brief copied");
  } catch {
    showToast("Copy unavailable in this browser");
  }
});

renderProgramOptions();
renderAll();
