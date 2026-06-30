import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Eye,
  FileSearch,
  FileText,
  Gauge,
  GitBranch,
  GitPullRequest,
  History,
  Layers3,
  ListChecks,
  MessageSquareText,
  RadioTower,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { roleSnapshots, statuses, views } from "./data";

const drawerWidth = 260;

const viewIcons = {
  overview: Gauge,
  digest: ClipboardCheck,
  risks: ShieldAlert,
  evidence: GitBranch,
};

const draftTabs = [
  { id: "executive", label: "Leadership", icon: FileText },
  { id: "engineering", label: "Engineering", icon: MessageSquareText },
  { id: "jira", label: "System note", icon: ListChecks },
];

const riskFilters = ["all", "critical", "watch", "blocked"];

const statusColor = {
  "on-track": "success",
  watch: "warning",
  "at-risk": "error",
  blocked: "error",
  critical: "error",
};

const sourceStateColor = {
  "Read only": "success",
  Simulated: "warning",
  Optional: "info",
  "Human reviewed": "primary",
};

const scopeStatusColor = {
  "On track": "success",
  Watch: "warning",
  "At risk": "error",
  Blocked: "error",
};

const toneColor = {
  good: "success.main",
  watch: "warning.main",
  neutral: "info.main",
};

const panelSx = {
  bgcolor: "background.paper",
  borderColor: "divider",
};

const guardrails = [
  "Read-only inputs",
  "Draft output",
  "Human approval",
  "No writeback",
];

const insetSx = {
  bgcolor: "#f5f6f3",
  borderColor: "divider",
};

function App() {
  const [roleId, setRoleId] = useState(roleSnapshots[0].id);
  const [activeView, setActiveView] = useState("overview");
  const [activeDraft, setActiveDraft] = useState("executive");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [toast, setToast] = useState("");

  const program = useMemo(
    () => roleSnapshots.find((item) => item.id === roleId) ?? roleSnapshots[0],
    [roleId]
  );

  const filteredRisks = useMemo(() => {
    if (riskFilter === "all") return program.risks;
    return program.risks.filter((risk) => risk.severity === riskFilter || risk.status === riskFilter);
  }, [program.risks, riskFilter]);

  function showToast(message) {
    setToast(message);
  }

  function openEvidence(payload) {
    setSelectedEvidence(payload);
  }

  async function copyDigest() {
    const content = program.digest
      .map((section) => `${section.title}\n${section.items.map((item) => `- ${item}`).join("\n")}`)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(content);
      showToast("Brief copied to clipboard.");
    } catch {
      showToast("Copy is unavailable in this browser.");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        background: "#f5f6f3",
      }}
    >
      <Sidebar activeView={activeView} program={program} setActiveView={setActiveView} />

      <Box
        component="main"
        sx={{
          ml: { md: `${drawerWidth}px` },
          minHeight: "100vh",
          px: { xs: 1.5, sm: 2.5, lg: 3 },
          py: { xs: 1.5, sm: 2.25 },
        }}
      >
        <Header
          activeView={activeView}
          program={program}
          roleId={roleId}
          setActiveView={setActiveView}
          setRoleId={setRoleId}
          showToast={showToast}
        />

        <RoleMetaRail program={program} />

        {activeView === "overview" && <Overview openEvidence={openEvidence} program={program} />}
        {activeView === "digest" && (
          <Digest
            activeDraft={activeDraft}
            copyDigest={copyDigest}
            program={program}
            setActiveDraft={setActiveDraft}
            showToast={showToast}
          />
        )}
        {activeView === "risks" && (
          <Risks
            filteredRisks={filteredRisks}
            openEvidence={openEvidence}
            riskFilter={riskFilter}
            setRiskFilter={setRiskFilter}
          />
        )}
        {activeView === "evidence" && <Evidence openEvidence={openEvidence} program={program} />}
      </Box>

      <EvidenceDrawer evidence={selectedEvidence} onClose={() => setSelectedEvidence(null)} />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2200}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 1 }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function Sidebar({ activeView, program, setActiveView }) {
  return (
    <Paper
      component="aside"
      elevation={0}
      square
      sx={{
        position: "fixed",
        inset: "0 auto 0 0",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        width: drawerWidth,
        p: 1.5,
        bgcolor: "#0f2f2a",
        color: "common.white",
        borderRight: "1px solid rgba(16,32,27,0.18)",
        zIndex: 10,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: 1, py: 1 }}>
        <Avatar
          variant="rounded"
          sx={{
            width: 34,
            height: 34,
            bgcolor: "rgba(183,121,31,0.18)",
            color: "common.white",
            border: "1px solid rgba(183,121,31,0.34)",
          }}
        >
          <Activity size={18} />
        </Avatar>
        <Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.58)", fontWeight: 600, lineHeight: 1 }}>
            Xcelforce
          </Typography>
          <Typography variant="subtitle2" sx={{ lineHeight: 1.05, fontWeight: 700 }}>
            Org Pulse
          </Typography>
        </Box>
      </Stack>

      <List sx={{ mt: 1.5 }}>
        {views.map((view) => {
          const Icon = viewIcons[view.id];
          return (
            <ListItemButton
              key={view.id}
              selected={activeView === view.id}
              onClick={() => setActiveView(view.id)}
              sx={{
                mb: 0.25,
                minHeight: 34,
                borderRadius: 0.75,
                color: "rgba(255,255,255,0.62)",
                "&.Mui-selected": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "common.white",
                  borderLeft: "3px solid #b7791f",
                },
                "&.Mui-selected:hover, &:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                <Icon size={18} />
              </ListItemIcon>
              <ListItemText
                primary={view.label}
                primaryTypographyProps={{ fontWeight: 500, fontSize: 13 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Card
        elevation={0}
        sx={{
          mt: "auto",
          bgcolor: "rgba(16,32,27,0.18)",
          color: "common.white",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.58)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Visible signals
            </Typography>
            <RadioTower size={15} />
          </Stack>
          <Stack spacing={1.15}>
            {program.signals.map((signal) => (
              <Box key={signal.source}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.65 }}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.82)", fontWeight: 500 }}>
                    {signal.source}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.62)", fontSize: 11 }}>
                    {signal.state}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={signal.strength}
                  sx={{
                    height: 4,
                    borderRadius: 0,
                    bgcolor: "rgba(255,255,255,0.09)",
                    "& .MuiLinearProgress-bar": { bgcolor: "#b7791f" },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Paper>
  );
}

function Header({ activeView, program, roleId, setActiveView, setRoleId, showToast }) {
  return (
    <Stack spacing={1.5} sx={{ mb: 2 }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", lg: "center" }}
        justifyContent="space-between"
        sx={{
          px: { xs: 0, lg: 0.5 },
          py: 0.5,
        }}
      >
        <Box sx={{ maxWidth: 820 }}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <Chip size="small" label="Role-aware prototype" color="primary" variant="outlined" />
            <Chip size="small" label={program.scope.scopeLabel} variant="outlined" />
          </Stack>
          <Typography variant="h3" sx={{ mb: 0.75, letterSpacing: 0, fontSize: { xs: 32, md: 40 } }}>
            {program.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
            Prototype of read-only visibility that changes by role, organization scope, and decision altitude. {program.summary}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
          <FormControl size="small" sx={{ minWidth: 230 }}>
            <Select
              value={roleId}
              onChange={(event) => setRoleId(event.target.value)}
              sx={{
                height: 32,
                fontSize: 13,
                ".MuiSelect-select": { py: 0.65 },
              }}
            >
              {roleSnapshots.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.selectorLabel ?? item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Refresh role snapshot">
            <IconButton
              onClick={() => showToast("Role snapshot refreshed.")}
              sx={{ width: 32, height: 32, border: 1, borderColor: "divider" }}
            >
              <RefreshCw size={15} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircle2 size={14} />}
            onClick={() => showToast("Role brief prepared for human review.")}
            sx={{
              minHeight: 32,
              height: 32,
              px: 1.35,
              fontSize: 13,
              lineHeight: 1,
              "& .MuiButton-startIcon": { mr: 0.65 },
            }}
          >
            Prepare role brief
          </Button>
        </Stack>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          display: { xs: "block", md: "none" },
          border: 1,
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <Tabs
          value={activeView}
          onChange={(_, value) => setActiveView(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {views.map((view) => (
            <Tab key={view.id} value={view.id} label={view.label} />
          ))}
        </Tabs>
      </Paper>
    </Stack>
  );
}

function RoleMetaRail({ program }) {
  const items = [
    ["Role", program.roleName],
    ["Org scope", program.scope.organizationLabel],
    ["Decision altitude", program.scope.decisionAltitude],
    ["Signal confidence", `${program.confidence}%`],
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) auto" },
        overflow: "hidden",
        mb: 2.25,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
        }}
      >
        {items.map(([label, value], index) => (
          <Box
            key={label}
            sx={{
              px: 1.45,
              py: 1.15,
              borderRight: { md: index < items.length - 1 ? 1 : 0 },
              borderBottom: { xs: index < 2 ? 1 : 0, md: 0 },
              borderColor: "divider",
              minWidth: 0,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {label}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.35 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value}
              </Typography>
              {label === "Signal confidence" && (
                <LinearProgress
                  variant="determinate"
                  value={program.confidence}
                  sx={{ flex: 1, minWidth: 46, height: 3, borderRadius: 0 }}
                />
              )}
            </Stack>
          </Box>
        ))}
      </Box>

      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        useFlexGap
        flexWrap="wrap"
        sx={{
          px: 1.25,
          py: 0.95,
          borderTop: { xs: 1, xl: 0 },
          borderLeft: { xl: 1 },
          borderColor: "divider",
          bgcolor: "#fafbf9",
          minWidth: { xl: 430 },
        }}
      >
        {guardrails.map((item) => (
          <Chip
            key={item}
            size="small"
            icon={<Eye size={13} />}
            label={item}
            variant="outlined"
            sx={{
              bgcolor: "background.paper",
              color: "text.secondary",
              fontWeight: 500,
              "& .MuiChip-icon": { color: "success.main" },
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
}

function Overview({ openEvidence, program }) {
  return (
    <Stack spacing={2.5}>
      <RoleScopePanel program={program} />

      <WeekChanges changes={program.weekChanges} openEvidence={openEvidence} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" },
          gap: 1.5,
        }}
      >
        {program.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.55fr) minmax(360px, 0.75fr)" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Card elevation={0} sx={panelSx}>
          <SectionHeader icon={Layers3} eyebrow="Role-scoped synthesis" title={program.scope.initiativeTitle} />
          <TableContainer>
            <Table sx={{ minWidth: 780 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Scope item</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Evidence strength</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Linked evidence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {program.initiatives.map((initiative) => (
                  <InitiativeRow key={initiative.key} initiative={initiative} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Stack spacing={2}>
          <Card elevation={0} sx={panelSx}>
            <SectionHeader icon={Sparkles} eyebrow={`${program.roleName} readout`} title="What changed" />
            <List disablePadding>
              {program.readout.map((item, index) => (
                <Box key={item}>
                  <ListItemButton disableRipple sx={{ alignItems: "flex-start", py: 2 }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 34,
                        height: 34,
                        mr: 1.5,
                        bgcolor: "#f0f3ef",
                        color: "text.primary",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Avatar>
                    <ListItemText primary={item} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }} />
                  </ListItemButton>
                  {index < program.readout.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Card>

          <ReviewQueue program={program} />
        </Stack>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 0.95fr) minmax(0, 1.05fr)" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <SourceCoverage program={program} />
        <ConflictingSignals conflicts={program.conflicts} openEvidence={openEvidence} />
      </Box>
    </Stack>
  );
}

function RoleScopePanel({ program }) {
  return (
    <Card elevation={0} sx={panelSx}>
      <SectionHeader icon={Layers3} eyebrow={program.scope.scopeLabel} title="Role scope and visible signals" />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.3fr) minmax(320px, 0.7fr)" },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRight: { lg: 1 },
            borderBottom: { xs: 1, lg: 0 },
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 860 }}>
            {program.scope.hierarchyDescription}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: 1,
              mt: 1.5,
            }}
          >
            {program.scopeTree.map((node, index) => (
              <Paper key={node.label} variant="outlined" sx={{ ...insetSx, p: 1.35 }}>
                <Stack direction="row" spacing={1.2} alignItems="flex-start" justifyContent="space-between">
                  <Stack direction="row" spacing={1.15} alignItems="flex-start" sx={{ minWidth: 0 }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                        color: "text.secondary",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {node.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {node.owner} / {node.count}
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip
                    size="small"
                    label={node.status}
                    color={scopeStatusColor[node.status] ?? "default"}
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {node.summary}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        <Stack spacing={1.25} sx={{ p: 2 }}>
          <Paper variant="outlined" sx={{ ...insetSx, p: 1.35 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Decision altitude
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 0.35, fontWeight: 700 }}>
              {program.scope.decisionAltitude}
            </Typography>
          </Paper>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Signals visible here
            </Typography>
            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
              {program.scope.visibleSignals.map((signal) => (
                <Chip key={signal} size="small" label={signal} variant="filled" sx={{ bgcolor: "#f0f3ef" }} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}

function WeekChanges({ changes, openEvidence }) {
  return (
    <Card elevation={0} sx={panelSx}>
      <SectionHeader icon={History} eyebrow="Weekly delta" title="What changed since last week" />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(3, minmax(0, 1fr))" },
          gap: 0,
        }}
      >
        {changes.map((change, index) => (
          <Box
            key={change.title}
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: 326,
              p: 2,
              borderRight: { lg: index < changes.length - 1 ? 1 : 0 },
              borderBottom: { xs: index < changes.length - 1 ? 1 : 0, lg: 0 },
              borderColor: "divider",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
              <Chip size="small" label={change.type} color={change.tone === "good" ? "success" : change.tone === "risk" ? "error" : "warning"} variant="outlined" />
              <Chip size="small" label={change.confidence} variant="filled" sx={{ bgcolor: "#f0f3ef" }} />
            </Stack>
            <Typography
              variant="subtitle1"
              sx={{
                alignSelf: "start",
                display: "-webkit-box",
                fontWeight: 700,
                lineHeight: 1.25,
                mt: 1.25,
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              {change.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                alignSelf: "start",
                display: "-webkit-box",
                lineHeight: 1.45,
                mt: 0.75,
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }}
            >
              {change.summary}
            </Typography>
            <Paper variant="outlined" sx={{ ...insetSx, alignSelf: "stretch", p: 1.2, mt: 1.25 }}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Last week
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {change.previous}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 0, textAlign: "right" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Now
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {change.current}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
            <Stack
              direction="row"
              spacing={0.75}
              useFlexGap
              flexWrap="wrap"
              sx={{ alignContent: "flex-start", mt: 1.25, mb: 1.25, overflow: "hidden" }}
            >
              {change.sources.map((source) => (
                <Chip key={source} size="small" label={source} variant="filled" sx={{ bgcolor: "#f0f3ef" }} />
              ))}
            </Stack>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<FileSearch size={15} />}
              onClick={() =>
                openEvidence({
                  action: change.action,
                  confidence: change.confidence,
                  confidenceReason: `${change.confidence}. ${change.explanation[0]}`,
                  current: change.current,
                  currentLabel: "Now",
                  eyebrow: "Weekly delta",
                  explanation: change.explanation,
                  previous: change.previous,
                  previousLabel: "Last week",
                  sources: change.sources,
                  summary: change.summary,
                  title: change.title,
                })
              }
              sx={{ mt: "auto" }}
            >
              Explain evidence
            </Button>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

function ReviewQueue({ program }) {
  return (
    <Card elevation={0} sx={panelSx}>
      <SectionHeader icon={ClipboardCheck} eyebrow="Human judgment" title="Needs follow-up" />
      <Stack divider={<Divider />}>
        {program.reviewQueue.map((item) => (
          <Box key={item.title} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1.25} alignItems="flex-start" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.45 }}>
                  {item.body}
                </Typography>
              </Box>
              <Chip size="small" label={item.owner} variant="outlined" />
            </Stack>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

function SourceCoverage({ program }) {
  return (
    <Card elevation={0} sx={panelSx}>
      <SectionHeader icon={RadioTower} eyebrow="Visible sources" title="Signals at this role" />
      <Stack divider={<Divider />}>
        {program.signals.map((signal) => (
          <Box key={signal.source} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 1.1 }}>
              <Box>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                  {signal.source}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {signal.detail}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={signal.state}
                color={sourceStateColor[signal.state] ?? "default"}
                variant={signal.state === "Simulated" ? "outlined" : "filled"}
              />
            </Stack>
            <LinearProgress variant="determinate" value={signal.strength} sx={{ height: 5, borderRadius: 0 }} />
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

function ConflictingSignals({ conflicts, openEvidence }) {
  return (
    <Card elevation={0} sx={panelSx}>
      <SectionHeader icon={AlertTriangle} eyebrow="Conflicting signals" title="Needs confirmation" />
      <Stack divider={<Divider />}>
        {conflicts.map((conflict) => (
          <Box key={conflict.title} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Chip size="small" label={conflict.priority} color={conflict.priority === "High" ? "error" : "warning"} variant="outlined" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {conflict.title}
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1,
                mb: 1.25,
              }}
            >
              <Paper variant="outlined" sx={{ ...insetSx, p: 1.25 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  System-of-record says
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.35 }}>
                  {conflict.system}
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ ...insetSx, p: 1.25 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Role-visible signals show
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.35 }}>
                  {conflict.evidence}
                </Typography>
              </Paper>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
              {conflict.question}
            </Typography>
            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
              {conflict.sources.map((source) => (
                <Chip key={source} size="small" label={source} variant="filled" sx={{ bgcolor: "#f0f3ef" }} />
              ))}
            </Stack>
            <Button
              size="small"
              variant="outlined"
              startIcon={<FileSearch size={15} />}
              onClick={() =>
                openEvidence({
                  action: conflict.question,
                  confidence: `${conflict.priority} priority`,
                  confidenceReason: `${conflict.priority} priority because the system-of-record status and delivery evidence disagree.`,
                  current: conflict.evidence,
                  currentLabel: "Role-visible signals show",
                  eyebrow: "Conflicting signals",
                  explanation: [
                    `System-of-record says: ${conflict.system}`,
                    `Role-visible signals show: ${conflict.evidence}`,
                  ],
                  previous: conflict.system,
                  previousLabel: "System-of-record says",
                  sources: conflict.sources,
                  summary: conflict.question,
                  title: conflict.title,
                })
              }
              sx={{ mt: 1.5 }}
            >
              Explain evidence
            </Button>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

function MetricCard({ metric }) {
  const isPositive = metric.delta.startsWith("+") || metric.tone === "good";
  const DeltaIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card elevation={0} sx={{ ...panelSx, borderLeft: 3, borderLeftColor: toneColor[metric.tone] ?? "divider" }}>
      <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.35 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {metric.label}
          </Typography>
          <Chip
            size="small"
            icon={<DeltaIcon size={14} />}
            label={metric.delta}
            color={metric.tone === "watch" ? "warning" : metric.tone === "good" ? "success" : "info"}
            variant="outlined"
          />
        </Stack>
        <Typography variant="h4" sx={{ mb: 0.75, fontSize: 30 }}>
          {metric.value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {metric.note}
        </Typography>
      </CardContent>
    </Card>
  );
}

function InitiativeRow({ initiative }) {
  const drift = initiative.progress - initiative.planned;

  return (
    <TableRow hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
      <TableCell sx={{ width: "34%" }}>
        <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
          {initiative.key}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {initiative.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {initiative.summary}
        </Typography>
      </TableCell>
      <TableCell>{initiative.lead}</TableCell>
      <TableCell sx={{ minWidth: 170 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
          <Typography variant="caption" color="text.secondary">
            {initiative.progress}% evidence
          </Typography>
          <Typography variant="caption" color={drift >= 0 ? "success.main" : "error.main"} sx={{ fontWeight: 600 }}>
            {drift >= 0 ? "+" : ""}
            {drift}% vs expected
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={initiative.progress} sx={{ height: 5, borderRadius: 0 }} />
      </TableCell>
      <TableCell>
        <Chip
          size="small"
          label={statuses[initiative.status]}
          color={statusColor[initiative.status]}
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
          {initiative.evidence.map((source) => (
            <Chip key={source} size="small" label={source} variant="filled" sx={{ bgcolor: "#f0f3ef" }} />
          ))}
        </Stack>
      </TableCell>
    </TableRow>
  );
}

function Digest({ activeDraft, copyDigest, program, setActiveDraft, showToast }) {
  const draft = program.drafts[activeDraft];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(380px, 0.9fr)" },
        gap: 2,
        alignItems: "start",
      }}
    >
      <Card elevation={0} sx={panelSx}>
        <SectionHeader
          icon={CalendarClock}
          eyebrow={program.refresh}
          title="Role visibility brief"
          action={
            <Tooltip title="Copy digest">
              <IconButton onClick={copyDigest}>
                <Copy size={18} />
              </IconButton>
            </Tooltip>
          }
        />
        <Stack divider={<Divider />} spacing={0}>
          {program.digest.map((section) => (
            <Box key={section.title} sx={{ p: 2.25 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {section.title}
              </Typography>
              <Stack component="ul" spacing={1} sx={{ pl: 2.25, my: 0 }}>
                {section.items.map((item) => (
                  <Typography component="li" key={item} variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>

      <Card elevation={0} sx={panelSx}>
        <SectionHeader icon={MessageSquareText} eyebrow="Suggested communication" title="Drafts for human review" />
        <Box sx={{ px: 2, pt: 1 }}>
          <Tabs value={activeDraft} onChange={(_, value) => setActiveDraft(value)} variant="fullWidth">
            {draftTabs.map((tab) => (
              <Tab key={tab.id} value={tab.id} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        <CardContent>
          <Paper
            variant="outlined"
            sx={{
              p: 2.25,
              bgcolor: "#f5f6f3",
              minHeight: 276,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              {draft.title}
            </Typography>
            <Stack spacing={1.25}>
              {draft.paragraphs.map((paragraph) => (
                <Typography key={paragraph} variant="body2" color="text.secondary">
                  {paragraph}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ px: 2, pb: 2 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircle2 size={15} />}
            onClick={() => showToast("Brief approved for sharing.")}
          >
            Approve for sharing
          </Button>
          <Button variant="outlined" size="small" onClick={() => showToast("Draft opened for editing.")}>
            Edit draft
          </Button>
          <Button color="inherit" size="small" onClick={() => showToast("Signal excluded from this brief.")}>
            Exclude from brief
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

function Risks({ filteredRisks, openEvidence, riskFilter, setRiskFilter }) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {riskFilters.map((filter) => (
          <Chip
            clickable
            key={filter}
            label={filter}
            color={riskFilter === filter ? "primary" : "default"}
            variant={riskFilter === filter ? "filled" : "outlined"}
            onClick={() => setRiskFilter(filter)}
            sx={{ textTransform: "capitalize", fontWeight: 600 }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {filteredRisks.map((risk) => (
          <Card key={risk.id} elevation={0} sx={panelSx}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Chip size="small" label={statuses[risk.status]} color={statusColor[risk.status]} variant="outlined" />
                <AlertTriangle size={18} color="#e5484d" />
              </Stack>
              <Typography variant="h6" sx={{ fontSize: 17, mb: 1 }}>
                {risk.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {risk.body}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1,
                  mb: 2,
                }}
              >
                <RiskStat label="Owner" value={risk.owner} />
                <RiskStat label="Probability" value={risk.probability} />
                <RiskStat label="Impact" value={risk.impact} />
              </Box>

              <Alert severity="success" icon={<CheckCircle2 size={16} />} sx={{ mb: 2, bgcolor: "rgba(31,122,74,0.1)", color: "text.primary", borderRadius: 1 }}>
                {risk.action}
              </Alert>

              <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                {risk.sources.map((source) => (
                  <Chip key={source} size="small" label={source} variant="filled" sx={{ bgcolor: "#f0f3ef" }} />
                ))}
              </Stack>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                startIcon={<FileSearch size={15} />}
                onClick={() =>
                  openEvidence({
                    action: risk.action,
                    confidence: `${risk.probability} probability`,
                    confidenceReason: `${risk.probability} probability based on ${risk.sources.length} linked signals and ${risk.impact.toLowerCase()} impact.`,
                    current: risk.body,
                    currentLabel: "Risk signal",
                    eyebrow: "Risk explanation",
                    explanation: [
                      risk.body,
                      `Impact area: ${risk.impact}.`,
                      `Human owner to confirm: ${risk.owner}.`,
                    ],
                    sources: risk.sources,
                    summary: risk.body,
                    title: risk.title,
                  })
                }
                sx={{ mt: 1.5 }}
              >
                Explain evidence
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}

function RiskStat({ label, value }) {
  return (
    <Paper variant="outlined" sx={{ ...insetSx, p: 1.15 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function Evidence({ openEvidence, program }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.05fr) minmax(360px, 0.95fr)" },
        gap: 2,
        alignItems: "start",
      }}
    >
      <Card elevation={0} sx={panelSx}>
        <SectionHeader icon={GitPullRequest} eyebrow="Role-scoped source chain" title="Example signals" />
        <Stack divider={<Divider />}>
          {program.evidence.map((event) => (
            <Box
              key={`${event.time}-${event.title}`}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "76px minmax(0, 1fr) auto" },
                gap: 2,
                p: 2,
                alignItems: "start",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {event.time}
              </Typography>
              <Box>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                  {event.source}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.body}
                </Typography>
              </Box>
              <Stack alignItems={{ xs: "flex-start", sm: "flex-end" }} spacing={1}>
                <Chip size="small" label={`Confidence: ${event.confidence}`} variant="outlined" />
                <Button
                  size="small"
                  variant="text"
                  startIcon={<FileSearch size={14} />}
                  onClick={() =>
                    openEvidence({
                      action: "Use this as supporting evidence only; final status still needs human review.",
                      confidence: event.confidence,
                      confidenceReason: `${event.confidence} confidence from a ${event.source} signal in the simulated snapshot.`,
                      current: event.body,
                      currentLabel: event.source,
                      eyebrow: event.source,
                      explanation: [event.body],
                      sources: [event.source],
                      summary: event.body,
                      title: event.title,
                    })
                  }
                >
                  Explain
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>

      <Card elevation={0} sx={panelSx}>
        <SectionHeader icon={RadioTower} eyebrow="Traceability" title="Visible signal map" />
        <Stack divider={<Divider />}>
          {program.signals.map((signal) => (
            <Box key={signal.source} sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 1.25 }}>
                <Box>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                    {signal.source}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {signal.detail}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={signal.state}
                  color={sourceStateColor[signal.state] ?? "default"}
                  variant={signal.state === "Simulated" ? "outlined" : "filled"}
                />
              </Stack>
              <LinearProgress variant="determinate" value={signal.strength} sx={{ height: 7, borderRadius: 0 }} />
            </Box>
          ))}
        </Stack>
      </Card>
    </Box>
  );
}

function EvidenceDrawer({ evidence, onClose }) {
  const open = Boolean(evidence);
  const contextItems = evidence
    ? [
        { label: evidence.previousLabel ?? "Last week", value: evidence.previous },
        { label: evidence.currentLabel ?? "Now", value: evidence.current },
      ].filter((item) => item.value)
    : [];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 520 },
          bgcolor: "background.paper",
          backgroundImage: "none",
          borderLeft: 1,
          borderColor: "divider",
        },
      }}
    >
      {evidence && (
        <Stack sx={{ minHeight: "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                variant="rounded"
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "rgba(214,161,30,0.16)",
                  border: 1,
                  borderColor: "rgba(214,161,30,0.38)",
                }}
              >
                <FileSearch size={16} />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {evidence.eyebrow}
                </Typography>
                <Typography variant="subtitle1" sx={{ lineHeight: 1.15, fontWeight: 700 }}>
                  Evidence explanation
                </Typography>
              </Box>
            </Stack>
            <Tooltip title="Close">
              <IconButton onClick={onClose}>
                <X size={17} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack spacing={2} sx={{ p: 2, overflow: "auto" }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Claim
              </Typography>
              <Typography variant="h6" sx={{ fontSize: 19, fontWeight: 700, mt: 0.5, mb: 1 }}>
                {evidence.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {evidence.summary}
              </Typography>
            </Box>

            {contextItems.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: contextItems.length > 1 ? "repeat(2, minmax(0, 1fr))" : "1fr",
                  },
                  gap: 1,
                }}
              >
                {contextItems.map((item) => (
                  <Paper key={item.label} variant="outlined" sx={{ ...insetSx, p: 1.35 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.45, fontWeight: 700 }}>
                      {item.value}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Evidence chain
              </Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {evidence.explanation.map((item, index) => (
                  <Paper
                    key={`${item}-${index}`}
                    variant="outlined"
                    sx={{
                      p: 1.35,
                      bgcolor: "background.paper",
                      borderLeft: 3,
                      borderLeftColor: index === 0 ? "primary.main" : "divider",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
              <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                {evidence.sources.map((source) => (
                  <Chip key={source} size="small" label={source} variant="filled" sx={{ bgcolor: "#f0f3ef" }} />
                ))}
              </Stack>
            </Box>

            <Paper variant="outlined" sx={{ ...insetSx, p: 1.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Confidence reason
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700 }}>
                {evidence.confidenceReason ?? evidence.confidence}
              </Typography>
            </Paper>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Human follow-up
              </Typography>
              <Alert severity="info" icon={<CheckCircle2 size={16} />} sx={{ mt: 1, bgcolor: "rgba(7,89,133,0.1)", color: "text.primary", borderRadius: 1 }}>
                {evidence.action}
              </Alert>
            </Box>
          </Stack>
        </Stack>
      )}
    </Drawer>
  );
}

function SectionHeader({ action, eyebrow, icon: Icon, title }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ px: 1.75, py: 1.35, borderBottom: 1, borderColor: "divider" }}
    >
      <Stack direction="row" spacing={1.4} alignItems="center">
        <Avatar
          variant="rounded"
          sx={{
            width: 30,
            height: 30,
            bgcolor: "#f5f6f3",
            color: "text.secondary",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Icon size={15} />
        </Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {eyebrow}
          </Typography>
          <Typography variant="subtitle1" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
      </Stack>
      {action}
    </Stack>
  );
}

export default App;
