const examples = [
  "What is the Growth team working on?",
  "What is Priya working on?",
  "What changed since yesterday?",
  "What blockers are slowing down the billing migration?",
  "What decisions were made about the enterprise analytics launch?",
  "Where do token usage and velocity look mismatched?",
  "What important meetings are coming up?",
  "Which projects need manager attention?",
  "What should I ask Taylor in our 1:1?",
  "Summarize the onboarding experiment from Slack, Jira, and docs."
];

const stages = ["Searching Slack", "Reading Jira", "Checking Drive", "Composing answer"];

const thread = document.querySelector("#thread");
const question = document.querySelector("#question");
const composer = document.querySelector("#composer");
const examplesEl = document.querySelector("#examples");
const statsEl = document.querySelector("#stats");
const sendButton = composer.querySelector("button");
const chatTab = document.querySelector("#chatTab");
const dashboardTab = document.querySelector("#dashboardTab");
const chatView = document.querySelector("#chatView");
const dashboardView = document.querySelector("#dashboardView");
const dashboardRoot = document.querySelector("#dashboardRoot");
const refreshDashboard = document.querySelector("#refreshDashboard");
let dashboardRiskFilter = "all";
let latestDashboardData = null;

question.value = examples[0];

examplesEl.innerHTML = examples.map((example) => `<button type="button">${example}</button>`).join("");
examplesEl.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    question.value = button.textContent;
    ask(button.textContent);
  });
});

loadStats();
loadDashboard();
setView("dashboard");

chatTab.addEventListener("click", () => setView("chat"));
dashboardTab.addEventListener("click", () => {
  setView("dashboard");
  loadDashboard();
});
refreshDashboard.addEventListener("click", loadDashboard);
dashboardRoot.addEventListener("click", (event) => {
  const button = event.target.closest("[data-risk-filter]");
  if (!button) return;
  dashboardRiskFilter = button.dataset.riskFilter;
  if (latestDashboardData) renderDashboard(latestDashboardData);
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  ask(question.value);
});

function setView(view) {
  const dashboard = view === "dashboard";
  chatTab.classList.toggle("active", !dashboard);
  dashboardTab.classList.toggle("active", dashboard);
  chatView.classList.toggle("activeView", !dashboard);
  dashboardView.classList.toggle("activeView", dashboard);
}

function addMessage(role, content, metadata = {}) {
  if (thread.querySelector(".empty")) thread.innerHTML = "";
  const article = document.createElement("article");
  article.className = `message ${role}`;
  const label = role === "user" ? "You" : "Signal Desk";
  const initials = role === "user" ? "Y" : "S";
  article.innerHTML = `
    <div class="avatar" aria-hidden="true">${initials}</div>
    <div class="bubble">
      <div class="role">${label}</div>
      <div class="content"></div>
      ${metadata.mode ? `<div class="mode">mode: ${metadata.mode}</div>` : ""}
      ${
        metadata.citations?.length
          ? `<details class="sourcesPanel">
              <summary>
                <span>Sources</span>
                <strong>${metadata.citations.length}</strong>
              </summary>
              <div class="citations">
              ${metadata.citations
                .map(
                  (citation) => `
                    <details class="citation">
                      <summary>
                        <span>${citation.citationId || ""}</span>
                        <strong>${citation.source}</strong>
                        <b>${citation.title}</b>
                        <small>${[citation.team, citation.project].filter(Boolean).join(" / ")}</small>
                      </summary>
                      <div class="citationBody">
                        <p>${citation.snippet || ""}</p>
                        <a href="${citation.url}" target="_blank" rel="noreferrer">Open source</a>
                      </div>
                    </details>
                  `
                )
                .join("")}
              </div>
            </details>`
          : ""
      }
    </div>
  `;
  const contentEl = article.querySelector(".content");
  if (role === "assistant") {
    contentEl.innerHTML = formatAnswer(content);
  } else {
    contentEl.textContent = content;
  }
  thread.appendChild(article);
  thread.scrollTop = thread.scrollHeight;
  return article;
}

async function loadStats() {
  try {
    const response = await fetch("/api/stats");
    const stats = await response.json();
    const sources = stats.sources || {};
    statsEl.textContent = `${stats.total || 0} indexed · ${sources.slack || 0} Slack · ${sources.jira || 0} Jira · ${sources.google_drive || 0} Drive · ${sources.ai_telemetry || 0} AI telemetry`;
  } catch {
    statsEl.textContent = "Corpus stats unavailable";
  }
}

function sourceLabel(source) {
  if (source === "ai_telemetry") return "AI telemetry";
  if (source === "calendar") return "Calendar";
  return source === "google_drive" ? "Drive" : source;
}

function card(title, body, className = "") {
  return `<article class="dashCard ${className}"><h2>${title}</h2>${body}</article>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInline(value) {
  return escapeHtml(value).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function formatBullet(value) {
  const parts = value.split(": ");
  if (parts.length < 2 || parts[0].length > 80) return formatInline(value);
  return `<strong>${formatInline(parts.shift())}</strong><span>${formatInline(parts.join(": "))}</span>`;
}

function formatAnswer(content) {
  const lines = String(content).split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let bullets = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function flushBullets() {
    if (!bullets.length) return;
    blocks.push(`<ul>${bullets.map((line) => `<li>${formatBullet(line)}</li>`).join("")}</ul>`);
    bullets = [];
  }

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushBullets();
      return;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      bullets.push(bullet[1]);
      return;
    }

    flushBullets();
    paragraph.push(trimmed);
  });

  flushParagraph();
  flushBullets();
  return `<div class="answerFormatted">${blocks.join("")}</div>`;
}

function renderSignalList(items, emptyText = "No records found.") {
  if (!items?.length) return `<p class="emptyDash">${emptyText}</p>`;
  return `<div class="signalList">${items
    .map(
      (item) => `
        <a class="signalRow" href="${item.url}" target="_blank" rel="noreferrer">
          <span>${sourceLabel(item.source)}</span>
          <strong>${item.title}</strong>
          <small>${[item.team, item.project].filter(Boolean).join(" / ")}</small>
          <p>${item.text}</p>
        </a>
      `
    )
    .join("")}</div>`;
}

function priorityForSignal(item, category) {
  const text = `${item.title || ""} ${item.text || ""}`.toLowerCase();
  if (
    text.includes("blocked") ||
    text.includes("fail") ||
    text.includes("critical") ||
    item.project === "Billing Migration" ||
    item.project === "Policy Engine"
  ) {
    return "P0";
  }
  if (category === "dependency" || category === "stale_doc") return "P1";
  return "P2";
}

function riskCategoryLabel(category) {
  return {
    risk: "Risk",
    dependency: "Dependency",
    stale_doc: "Stale doc",
    decision: "Decision",
  }[category];
}

function collectRisks(data) {
  const sources = [
    ["risk", data.risks || []],
    ["dependency", data.dependencies || []],
    ["stale_doc", data.staleDocs || []],
    ["decision", data.decisions || []],
  ];
  const seen = new Set();
  const items = [];

  sources.forEach(([category, records]) => {
    records.forEach((record) => {
      const key = `${record.source}:${record.url}:${record.title}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({
        ...record,
        category,
        categoryLabel: riskCategoryLabel(category),
        priority: priorityForSignal(record, category),
      });
    });
  });

  const priorityRank = { P0: 0, P1: 1, P2: 2 };
  const categoryRank = { risk: 0, dependency: 1, stale_doc: 2, decision: 3 };
  return items.sort((a, b) => {
    const priorityDelta = priorityRank[a.priority] - priorityRank[b.priority];
    if (priorityDelta) return priorityDelta;
    const categoryDelta = categoryRank[a.category] - categoryRank[b.category];
    if (categoryDelta) return categoryDelta;
    return String(b.occurredAt || "").localeCompare(String(a.occurredAt || ""));
  });
}

function renderRiskFilterButton(label, value, count) {
  const active = dashboardRiskFilter === value ? "active" : "";
  return `<button class="${active}" type="button" data-risk-filter="${value}">${label}<span>${count}</span></button>`;
}

function renderCurrentRisks(data) {
  const risks = collectRisks(data);
  const counts = risks.reduce(
    (acc, item) => {
      acc.all += 1;
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    { all: 0 }
  );
  const filtered = dashboardRiskFilter === "all" ? risks : risks.filter((item) => item.category === dashboardRiskFilter);

  return `
    <div class="riskFilters">
      ${renderRiskFilterButton("All", "all", counts.all || 0)}
      ${renderRiskFilterButton("Risks", "risk", counts.risk || 0)}
      ${renderRiskFilterButton("Dependencies", "dependency", counts.dependency || 0)}
      ${renderRiskFilterButton("Stale docs", "stale_doc", counts.stale_doc || 0)}
      ${renderRiskFilterButton("Decisions", "decision", counts.decision || 0)}
    </div>
    ${
      filtered.length
        ? `<div class="signalList prioritizedRisks">${filtered
            .map(
              (item) => `
                <a class="signalRow ${item.priority.toLowerCase()}" href="${item.url}" target="_blank" rel="noreferrer">
                  <div class="riskMeta">
                    <span>${item.priority}</span>
                    <span>${item.categoryLabel}</span>
                    <span>${sourceLabel(item.source)}</span>
                  </div>
                  <strong>${item.title}</strong>
                  <small>${[item.team, item.project].filter(Boolean).join(" / ")}</small>
                  <p>${item.text}</p>
                </a>
              `
            )
            .join("")}</div>`
        : `<p class="emptyDash">No records found for this category.</p>`
    }
  `;
}

function renderProjects(projects) {
  return `<div class="projectList">${projects
    .map(
      (project) => `
        <div class="projectRow">
          <div>
            <strong>${project.project}</strong>
            <span>${project.team}</span>
          </div>
          <div class="projectMeta">
            <span class="status ${project.status.replace(/\s+/g, "").toLowerCase()}">${project.status}</span>
            <small>${project.records} records · ${project.sources.map(sourceLabel).join(", ")}</small>
          </div>
        </div>
      `
    )
    .join("")}</div>`;
}

function renderPeopleLoad(people) {
  if (!people?.length) return `<p class="emptyDash">No load signals found.</p>`;
  return `<div class="peopleList">${people
    .map(
      (person) => `
        <div class="personRow">
          <div>
            <strong>${person.person}</strong>
            <span>${person.projects.join(", ")}</span>
          </div>
          <b>${person.count}</b>
        </div>
      `
    )
    .join("")}</div>`;
}

function renderActions(actions) {
  return `<div class="actionList">${actions
    .map(
      (action) => `
        <div class="actionItem">
          <span>${action.priority}</span>
          <div>
            <strong>${action.title}</strong>
            <p>${action.detail}</p>
          </div>
        </div>
      `
    )
    .join("")}</div>`;
}

function renderVelocityToken(items) {
  if (!items?.length) return `<p class="emptyDash">No token usage data found.</p>`;
  return `<div class="velocityList">${items
    .map(
      (item) => `
        <div class="velocityRow ${item.severity}">
          <div>
            <strong>${item.project}</strong>
            <span>${item.team} · ${item.completed_points}/${item.planned_points} points · ${item.ai_assisted_prs} AI PRs</span>
            <p>${item.reason}</p>
          </div>
          <div class="tokenMetric">
            <b>${(item.token_usage / 1000000).toFixed(1)}M</b>
            <small>${Math.round(item.tokenDelta * 100)}% token change</small>
          </div>
        </div>
      `
    )
    .join("")}</div>`;
}

function renderMeetings(items) {
  if (!items?.length) return `<p class="emptyDash">No important upcoming meetings found.</p>`;
  return `<div class="meetingList">${items
    .map(
      (meeting) => `
        <a class="meetingRow ${meeting.importance}" href="${meeting.source_url}" target="_blank" rel="noreferrer">
          <div>
            <strong>${meeting.title}</strong>
            <span>${meeting.team} / ${meeting.project} · ${meeting.starts_at}</span>
            <p>${meeting.prep_focus}</p>
          </div>
          <b>${meeting.importance}</b>
        </a>
      `
    )
    .join("")}</div>`;
}

async function loadDashboard() {
  dashboardRoot.innerHTML = `<div class="dashboardLoading">Loading dashboard...</div>`;
  try {
    const response = await fetch("/api/dashboard");
    const data = await response.json();
    latestDashboardData = data;
    renderDashboard(data);
  } catch {
    dashboardRoot.innerHTML = `<div class="dashboardLoading">Dashboard unavailable.</div>`;
  }
}

function renderDashboard(data) {
  dashboardRoot.innerHTML = `
    <section class="topTriage">
      ${card("Recommended Actions", renderActions(data.actions || []), "triage")}
      ${card("Important Upcoming Meetings", renderMeetings(data.upcomingMeetings || []), "triage")}
    </section>
    <section class="insightPair">
      ${card("Velocity vs Token Usage", renderVelocityToken(data.velocityToken || []), "triage")}
      ${card("Current Risks", renderCurrentRisks(data), "triage")}
    </section>
  `;
}

async function ask(rawQuestion) {
  const text = rawQuestion.trim();
  if (!text) return;

  addMessage("user", text);
  question.value = "";
  sendButton.disabled = true;
  const pending = addMessage("assistant", "Thinking...");
  let stageIndex = 0;
  pending.querySelector(".content").textContent = stages[stageIndex];
  const stageTimer = setInterval(() => {
    stageIndex = Math.min(stageIndex + 1, stages.length - 1);
    pending.querySelector(".content").textContent = stages[stageIndex];
  }, 650);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: text })
    });
    const data = await response.json();
    clearInterval(stageTimer);
    pending.remove();
    addMessage("assistant", data.answer || data.error || "No answer returned.", {
      citations: data.citations || [],
      mode: data.mode
    });
  } finally {
    clearInterval(stageTimer);
    sendButton.disabled = false;
    question.focus();
  }
}
