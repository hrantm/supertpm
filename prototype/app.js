const fixture = {
  programs: [
    {
      id: "checkout-reliability",
      name: "Checkout Reliability",
      owner: "Chris L.",
      cadence: "Weekly EM review",
      refresh: "Mon 8:00 AM",
      confidence: "82 percent",
      metrics: [
        {
          label: "Initiatives",
          value: "7",
          trend: "up",
          delta: "+2",
          note: "2 moved from watch to on track after PR merges.",
        },
        {
          label: "Open blockers",
          value: "4",
          trend: "down",
          delta: "-1",
          note: "Payments auth dependency cleared Friday.",
        },
        {
          label: "Commitment risk",
          value: "31%",
          trend: "flat",
          delta: "+0",
          note: "Same risk level, but concentrated in two stories.",
        },
        {
          label: "Evidence links",
          value: "38",
          trend: "up",
          delta: "+9",
          note: "PR, Jira, deploy, and CI signals in this digest.",
        },
      ],
      initiatives: [
        {
          key: "PAY-1842",
          name: "Payment authorization cleanup",
          lead: "Backend Platform",
          progress: 76,
          delta: "+18%",
          status: "on-track",
          summary: "Merged token refresh changes and cleared two failing integration tests.",
        },
        {
          key: "REL-2204",
          name: "Checkout rollback automation",
          lead: "Reliability",
          progress: 48,
          delta: "-12%",
          status: "watch",
          summary: "Rollback path is coded, but deployment verification has not started.",
        },
        {
          key: "OBS-1047",
          name: "Order trace observability",
          lead: "Frontend Core",
          progress: 61,
          delta: "+9%",
          status: "on-track",
          summary: "Trace IDs now appear on checkout and receipt surfaces.",
        },
        {
          key: "FRAUD-612",
          name: "Risk score handoff",
          lead: "Fraud Systems",
          progress: 33,
          delta: "-22%",
          status: "at-risk",
          summary: "API contract changed twice and PRs do not map to the committed sprint scope.",
        },
      ],
      readout: [
        "The team shipped meaningful reliability work, but delivery confidence is uneven across backend and fraud dependencies.",
        "Payment auth is no longer the main blocker. Risk has shifted to rollback verification and fraud score handoff.",
        "Two initiatives show Jira progress ahead of code evidence. The digest flags both for manager review before Thursday status.",
        "The generated executive summary should stay green-yellow, not red. The current risk is containable if ownership is clarified by Wednesday.",
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
            "Add checkout trace coverage to the Thursday readiness review.",
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
        exec: {
          title: "Executive summary",
          body: [
            "Checkout Reliability remains directionally on track, with one dependency that needs management attention this week.",
            "Payment authorization cleanup shipped as planned. Rollback automation is progressing, but validation is now the critical path. Fraud score handoff is the only initiative trending at risk due to repeated API contract changes.",
            "Recommended action: confirm Fraud Systems ownership by Wednesday and keep rollback verification in the Thursday readiness review.",
          ],
        },
        engineering: {
          title: "Engineering team update",
          body: [
            "This week's priority is converting merged code into verified release confidence.",
            "Backend Platform should close staging validation for REL-2204. Fraud Systems and Checkout need one contract decision on FRAUD-612 before additional implementation work starts.",
            "Evidence reviewed: Jira issues PAY-1842, REL-2204, OBS-1047, FRAUD-612; PR #481, #488, #496; deploy checkout-2026.06.15.",
          ],
        },
        jira: {
          title: "Suggested Jira initiative update",
          body: [
            "Status: Watch.",
            "Update: Payment auth cleanup shipped and observability work progressed. Rollback automation implementation is complete but validation is pending. Fraud handoff has slipped because API contract changes are not reflected in sprint estimates.",
            "Risks: FRAUD-612 ownership and REL-2204 validation. Next checkpoint: Thursday readiness review.",
          ],
        },
      },
      risks: [
        {
          id: "risk-1",
          severity: "critical",
          status: "blocked",
          title: "Fraud score API contract changed after sprint commitment",
          owner: "Fraud Systems",
          body: "The committed story still assumes v2 response fields, while PR #496 implements v3 mapping. Jira progress has not been adjusted.",
          action: "Schedule owner decision before Wednesday noon.",
          sources: ["FRAUD-612", "PR #496", "Slack #checkout-risk"],
        },
        {
          id: "risk-2",
          severity: "watch",
          status: "watch",
          title: "Rollback implementation lacks staging proof",
          owner: "Reliability",
          body: "Code has landed, but no CI run or deploy evidence confirms the rollback path works end to end.",
          action: "Add staging validation to Thursday review.",
          sources: ["REL-2204", "PR #488", "CI run 8831"],
        },
        {
          id: "risk-3",
          severity: "watch",
          status: "watch",
          title: "Trace coverage is good but not yet release-wide",
          owner: "Frontend Core",
          body: "Checkout and receipt flows are covered. Refund and retry paths are not linked to order trace IDs.",
          action: "Confirm whether retry coverage is release-blocking.",
          sources: ["OBS-1047", "PR #492", "Deploy 06.15"],
        },
        {
          id: "risk-4",
          severity: "critical",
          status: "critical",
          title: "Sprint estimate drift is concentrated in two owners",
          owner: "Engineering Leads",
          body: "Two stories show high activity but low closure. The signal suggests hidden work or underestimated implementation paths.",
          action: "Rebaseline story points before next sprint planning.",
          sources: ["PAY board", "Git activity", "Sprint 26.12"],
        },
      ],
      evidence: [
        {
          time: "Mon 08:00",
          type: "Jira",
          title: "PAY-1842 moved to Done",
          body: "Sprint board shows payment auth cleanup complete with two linked PRs and one deploy reference.",
          confidence: "High",
        },
        {
          time: "Mon 08:04",
          type: "GitHub",
          title: "PR #496 conflicts with FRAUD-612 scope",
          body: "Diff references v3 risk mapping, but Jira acceptance criteria still describe v2 response fields.",
          confidence: "Medium",
        },
        {
          time: "Mon 08:08",
          type: "CI",
          title: "Rollback validation missing",
          body: "REL-2204 has merged implementation code, but no green staging validation run is linked.",
          confidence: "High",
        },
        {
          time: "Mon 08:11",
          type: "Deploy",
          title: "Trace IDs deployed behind feature flag",
          body: "Checkout trace propagation is live in staging behind checkout_trace_context.",
          confidence: "High",
        },
      ],
      signalMap: [
        { type: "Jira", name: "Initiatives and committed scope", state: "Read only" },
        { type: "Git", name: "PRs, diffs, owners, changed files", state: "Mocked" },
        { type: "CI", name: "Test and validation evidence", state: "Mocked" },
        { type: "Slack", name: "Risk comments and owner asks", state: "Optional" },
        { type: "Output", name: "Digest, Jira update, exec summary", state: "Human reviewed" },
      ],
    },
    {
      id: "rider-identity",
      name: "Rider Identity Refresh",
      owner: "Platform Identity",
      cadence: "Thursday readiness review",
      refresh: "Mon 8:00 AM",
      confidence: "74 percent",
      metrics: [
        { label: "Initiatives", value: "5", trend: "flat", delta: "+0", note: "Stable scope for the last two weeks." },
        { label: "Open blockers", value: "2", trend: "down", delta: "-3", note: "Legal copy and auth token issues cleared." },
        { label: "Commitment risk", value: "24%", trend: "down", delta: "-8", note: "Risk improved after mobile SDK merge." },
        { label: "Evidence links", value: "26", trend: "up", delta: "+4", note: "More CI evidence than last digest." },
      ],
      initiatives: [
        { key: "ID-310", name: "Identity consent copy", lead: "Product Systems", progress: 88, delta: "+20%", status: "on-track", summary: "Legal-approved strings landed for web and iOS." },
        { key: "ID-344", name: "Session token rotation", lead: "Identity Core", progress: 71, delta: "+14%", status: "on-track", summary: "Rotation logic merged with passing integration tests." },
        { key: "ID-351", name: "Android SDK rollout", lead: "Mobile", progress: 42, delta: "-9%", status: "watch", summary: "SDK published, but adoption branch is still behind target." },
      ],
      readout: [
        "Identity refresh is healthier than last week and no longer needs executive escalation.",
        "Android SDK adoption should be watched because it is the only stream with code lagging Jira status.",
        "The Thursday readout should focus on release readiness, not scope debate.",
      ],
      digest: [
        { title: "Completed last week", items: ["Consent copy landed across web and iOS.", "Session rotation tests passed.", "Legal blocker cleared."] },
        { title: "Plan for this week", items: ["Finish Android SDK adoption.", "Run staged identity refresh rollout.", "Prepare Thursday go/no-go summary."] },
        { title: "Slipped commitments", items: ["Android adoption branch remains one review cycle behind."] },
      ],
      drafts: {
        exec: { title: "Executive summary", body: ["Rider Identity Refresh is on track with one mobile adoption watch item.", "No escalation requested this week."] },
        engineering: { title: "Engineering team update", body: ["Keep Android SDK adoption on the critical path.", "All other streams have enough evidence for Thursday readiness."] },
        jira: { title: "Suggested Jira initiative update", body: ["Status: On track.", "Update: Legal copy and token rotation cleared. Android adoption remains the only watch item."] },
      },
      risks: [
        { id: "risk-5", severity: "watch", status: "watch", title: "Android adoption branch is behind", owner: "Mobile", body: "Branch is one review cycle behind target despite Jira showing planned progress.", action: "Confirm reviewer availability today.", sources: ["ID-351", "PR #771"] },
        { id: "risk-6", severity: "watch", status: "watch", title: "Rollout copy still needs final localization pass", owner: "Product Systems", body: "English copy is approved. Localized strings are not attached to the release checklist.", action: "Attach localization evidence before Thursday.", sources: ["ID-310", "Release checklist"] },
      ],
      evidence: [
        { time: "Mon 08:00", type: "Jira", title: "ID-310 moved to Done", body: "Legal-approved consent copy is attached to the issue.", confidence: "High" },
        { time: "Mon 08:06", type: "GitHub", title: "ID-351 branch behind target", body: "Android adoption branch has two unresolved reviews.", confidence: "Medium" },
        { time: "Mon 08:09", type: "CI", title: "Session rotation tests green", body: "Integration suite passed on commit a82c1.", confidence: "High" },
      ],
      signalMap: [
        { type: "Jira", name: "Release checklist and scope", state: "Read only" },
        { type: "Git", name: "SDK branches and PRs", state: "Mocked" },
        { type: "CI", name: "Integration tests", state: "Mocked" },
        { type: "Output", name: "Thursday readiness summary", state: "Human reviewed" },
      ],
    },
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
  digest: "Monday Digest",
  risks: "Risk Review",
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
  if (status === "blocked") return "status-blocked";
  return "status-at-risk";
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
  document.querySelector("#program-owner").textContent = program.owner;
  document.querySelector("#program-cadence").textContent = program.cadence;
  document.querySelector("#program-refresh").textContent = program.refresh;
  document.querySelector("#program-confidence").textContent = program.confidence;
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
    .map(
      (initiative) => `
        <tr>
          <td>
            <div class="initiative-name">
              <strong>${initiative.name}</strong>
              <span>${initiative.key} - ${initiative.summary}</span>
            </div>
          </td>
          <td>${initiative.lead}</td>
          <td>
            <div class="progress-track" aria-label="${initiative.progress} percent complete">
              <div class="progress-fill" style="width: ${initiative.progress}%"></div>
            </div>
            <span class="subtle">${initiative.progress}% complete</span>
          </td>
          <td>${initiative.delta}</td>
          <td><span class="status-pill ${statusClass(initiative.status)}">${statusLabels[initiative.status]}</span></td>
        </tr>
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

  document.querySelector("#risk-grid").innerHTML = risks
    .map(
      (risk) => `
        <article class="risk-card">
          <div class="risk-meta">
            <span class="status-pill ${statusClass(risk.status)}">${statusLabels[risk.status]}</span>
            <span class="subtle">${risk.owner}</span>
          </div>
          <div>
            <h4>${risk.title}</h4>
            <p>${risk.body}</p>
          </div>
          <p><strong>Suggested action:</strong> ${risk.action}</p>
          <footer>
            ${risk.sources.map((source) => `<span class="source-chip">${source}</span>`).join("")}
          </footer>
        </article>
      `
    )
    .join("");
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
  renderMetrics(program);
  renderInitiatives(program);
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
  showToast("Mock data refreshed");
});

document.querySelector("#approve-button").addEventListener("click", () => {
  showToast("Digest marked ready for review");
});

document.querySelector("#copy-digest-button").addEventListener("click", async () => {
  const program = getProgram();
  const text = program.digest
    .map((section) => `${section.title}\n${section.items.map((item) => `- ${item}`).join("\n")}`)
    .join("\n\n");

  try {
    await navigator.clipboard.writeText(text);
    showToast("Digest copied");
  } catch {
    showToast("Copy unavailable in this browser");
  }
});

renderProgramOptions();
renderAll();
