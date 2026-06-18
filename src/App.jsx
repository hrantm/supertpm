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
  FileText,
  Gauge,
  GitBranch,
  GitPullRequest,
  Layers3,
  ListChecks,
  MessageSquareText,
  RadioTower,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { programs, statuses, views } from "./data";

const drawerWidth = 260;

const viewIcons = {
  overview: Gauge,
  digest: ClipboardCheck,
  risks: ShieldAlert,
  evidence: GitBranch,
};

const draftTabs = [
  { id: "executive", label: "Executive", icon: FileText },
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
  Mocked: "warning",
  Optional: "info",
  "Human reviewed": "primary",
};

const toneColor = {
  good: "success.main",
  watch: "warning.main",
  neutral: "info.main",
};

const panelSx = {
  bgcolor: "rgba(17,18,23,0.86)",
  borderColor: "rgba(255,255,255,0.08)",
};

function App() {
  const [programId, setProgramId] = useState(programs[0].id);
  const [activeView, setActiveView] = useState("overview");
  const [activeDraft, setActiveDraft] = useState("executive");
  const [riskFilter, setRiskFilter] = useState("all");
  const [toast, setToast] = useState("");

  const program = useMemo(
    () => programs.find((item) => item.id === programId) ?? programs[0],
    [programId]
  );

  const filteredRisks = useMemo(() => {
    if (riskFilter === "all") return program.risks;
    return program.risks.filter((risk) => risk.severity === riskFilter || risk.status === riskFilter);
  }, [program.risks, riskFilter]);

  function showToast(message) {
    setToast(message);
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
        background:
          "radial-gradient(circle at 50% -20%, rgba(94,106,210,0.18), transparent 36%), #08090b",
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
          programId={programId}
          setActiveView={setActiveView}
          setProgramId={setProgramId}
          showToast={showToast}
        />

        <ContextStrip program={program} />

        {activeView === "overview" && <Overview program={program} />}
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
          <Risks filteredRisks={filteredRisks} riskFilter={riskFilter} setRiskFilter={setRiskFilter} />
        )}
        {activeView === "evidence" && <Evidence program={program} />}
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2200}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
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
        bgcolor: "#0d0e11",
        color: "common.white",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        zIndex: 10,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: 1, py: 1 }}>
        <Avatar
          variant="rounded"
          sx={{
            width: 34,
            height: 34,
            bgcolor: "rgba(94,106,210,0.22)",
            color: "common.white",
            border: "1px solid rgba(94,106,210,0.34)",
          }}
        >
          <Activity size={18} />
        </Avatar>
        <Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.48)", fontWeight: 800, lineHeight: 1 }}>
            Xcelforce
          </Typography>
          <Typography variant="subtitle2" sx={{ lineHeight: 1.05, fontWeight: 850 }}>
            Program Pulse
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
                borderRadius: 1.5,
                color: "rgba(255,255,255,0.62)",
                "&.Mui-selected": {
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "common.white",
                },
                "&.Mui-selected:hover, &:hover": {
                  bgcolor: "rgba(255,255,255,0.075)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                <Icon size={18} />
              </ListItemIcon>
              <ListItemText
                primary={view.label}
                primaryTypographyProps={{ fontWeight: 720, fontSize: 13 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Card
        elevation={0}
        sx={{
          mt: "auto",
          bgcolor: "rgba(255,255,255,0.045)",
          color: "common.white",
          border: "1px solid rgba(255,255,255,0.075)",
        }}
      >
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.48)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Coverage
            </Typography>
            <RadioTower size={15} />
          </Stack>
          <Stack spacing={1.15}>
            {program.signals.map((signal) => (
              <Box key={signal.source}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.65 }}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.78)", fontWeight: 780 }}>
                    {signal.source}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.42)", fontSize: 11 }}>
                    {signal.state}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={signal.strength}
                  sx={{
                    height: 4,
                    borderRadius: 99,
                    bgcolor: "rgba(255,255,255,0.09)",
                    "& .MuiLinearProgress-bar": { bgcolor: "#5e6ad2" },
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

function Header({ activeView, program, programId, setActiveView, setProgramId, showToast }) {
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
            <Chip size="small" label="Prototype" color="primary" variant="outlined" />
            <Chip size="small" label="Hardcoded data" variant="outlined" />
          </Stack>
          <Typography variant="h3" sx={{ mb: 0.75, letterSpacing: 0, fontSize: { xs: 32, md: 40 } }}>
            {program.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
            Read-only visibility across Jira, GitHub, Slack, Notion, meeting notes, and release signals. {program.summary}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
          <FormControl size="small" sx={{ minWidth: 230 }}>
            <Select
              value={programId}
              onChange={(event) => setProgramId(event.target.value)}
              sx={{
                height: 32,
                fontSize: 13,
                ".MuiSelect-select": { py: 0.65 },
              }}
            >
              {programs.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Refresh mock data">
            <IconButton
              onClick={() => showToast("Mock source snapshot refreshed.")}
              sx={{ width: 32, height: 32, border: 1, borderColor: "divider" }}
            >
              <RefreshCw size={15} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircle2 size={14} />}
            onClick={() => showToast("Brief prepared for human review.")}
            sx={{
              minHeight: 32,
              height: 32,
              px: 1.35,
              fontSize: 13,
              lineHeight: 1,
              "& .MuiButton-startIcon": { mr: 0.65 },
            }}
          >
            Prepare Brief
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
          bgcolor: "rgba(17,18,23,0.86)",
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

function ContextStrip({ program }) {
  const items = [
    ["Owner", program.owner],
    ["Sponsor", program.sponsor],
    ["Cadence", program.cadence],
    ["Release target", program.releaseTarget],
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(5, 1fr)" },
        overflow: "hidden",
        mb: 2.5,
        bgcolor: "rgba(17,18,23,0.72)",
        border: 1,
        borderColor: "divider",
      }}
    >
      {items.map(([label, value]) => (
        <Box
          key={label}
          sx={{
            p: 1.45,
            borderRight: { xl: 1 },
            borderBottom: { xs: 1, sm: 0 },
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 760, mt: 0.45 }}>
            {value}
          </Typography>
        </Box>
      ))}
      <Box sx={{ p: 1.45 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.8 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Source confidence
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 760, mt: 0.45 }}>
              {program.confidence}%
            </Typography>
          </Box>
          <Gauge size={18} />
        </Stack>
        <LinearProgress variant="determinate" value={program.confidence} sx={{ height: 4, borderRadius: 99 }} />
      </Box>
    </Paper>
  );
}

function Overview({ program }) {
  return (
    <Stack spacing={2.5}>
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
          <SectionHeader icon={Layers3} eyebrow="Initiative health" title="Current delivery picture" />
          <TableContainer>
            <Table sx={{ minWidth: 780 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Initiative</TableCell>
                  <TableCell>Lead</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Evidence</TableCell>
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
            <SectionHeader icon={Sparkles} eyebrow="Manager readout" title="What changed" />
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
                        bgcolor: "action.hover",
                        color: "text.primary",
                        fontSize: 12,
                        fontWeight: 900,
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
        <ConflictingSignals conflicts={program.conflicts} />
      </Box>
    </Stack>
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
                <Typography variant="subtitle2" sx={{ fontWeight: 850 }}>
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
      <SectionHeader icon={RadioTower} eyebrow="Source coverage" title="Fragmented inputs" />
      <Stack divider={<Divider />}>
        {program.signals.map((signal) => (
          <Box key={signal.source} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 1.1 }}>
              <Box>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 900 }}>
                  {signal.source}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 850 }}>
                  {signal.detail}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={signal.state}
                color={sourceStateColor[signal.state] ?? "default"}
                variant={signal.state === "Mocked" ? "outlined" : "filled"}
              />
            </Stack>
            <LinearProgress variant="determinate" value={signal.strength} sx={{ height: 5, borderRadius: 99 }} />
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

function ConflictingSignals({ conflicts }) {
  return (
    <Card elevation={0} sx={panelSx}>
      <SectionHeader icon={AlertTriangle} eyebrow="Conflicting signals" title="Needs confirmation" />
      <Stack divider={<Divider />}>
        {conflicts.map((conflict) => (
          <Box key={conflict.title} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Chip size="small" label={conflict.priority} color={conflict.priority === "High" ? "error" : "warning"} variant="outlined" />
              <Typography variant="subtitle2" sx={{ fontWeight: 850 }}>
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
              <Paper variant="outlined" sx={{ p: 1.25, bgcolor: "rgba(8,9,11,0.62)" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
                  System says
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.35 }}>
                  {conflict.system}
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 1.25, bgcolor: "rgba(8,9,11,0.62)" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
                  Signals say
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
                <Chip key={source} size="small" label={source} variant="filled" sx={{ bgcolor: "action.hover" }} />
              ))}
            </Stack>
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
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.08em" }}>
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
        <Typography variant="caption" color="primary" sx={{ fontWeight: 900 }}>
          {initiative.key}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 850 }}>
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
            {initiative.progress}% complete
          </Typography>
          <Typography variant="caption" color={drift >= 0 ? "success.main" : "error.main"} sx={{ fontWeight: 800 }}>
            {drift >= 0 ? "+" : ""}
            {drift}% vs plan
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={initiative.progress} sx={{ height: 5, borderRadius: 99 }} />
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
            <Chip key={source} size="small" label={source} variant="filled" sx={{ bgcolor: "action.hover" }} />
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
          title="Weekly visibility brief"
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
              <Typography variant="subtitle1" sx={{ fontWeight: 850, mb: 1 }}>
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
        <SectionHeader icon={MessageSquareText} eyebrow="Suggested communication" title="Human-reviewed drafts" />
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
              bgcolor: "rgba(8,9,11,0.72)",
              minHeight: 276,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5 }}>
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
            onClick={() => showToast("Readout approved for sharing.")}
          >
            Approve readout
          </Button>
          <Button variant="outlined" size="small" onClick={() => showToast("Draft opened for editing.")}>
            Edit draft
          </Button>
          <Button color="inherit" size="small" onClick={() => showToast("Signal dismissed from this brief.")}>
            Dismiss signal
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

function Risks({ filteredRisks, riskFilter, setRiskFilter }) {
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
            sx={{ textTransform: "capitalize", fontWeight: 800 }}
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

              <Alert severity="success" icon={<CheckCircle2 size={16} />} sx={{ mb: 2, bgcolor: "rgba(56,161,105,0.1)", color: "text.primary" }}>
                {risk.action}
              </Alert>

              <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                {risk.sources.map((source) => (
                  <Chip key={source} size="small" label={source} variant="filled" sx={{ bgcolor: "action.hover" }} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}

function RiskStat({ label, value }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.15, bgcolor: "rgba(8,9,11,0.62)", borderColor: "divider" }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 850 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function Evidence({ program }) {
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
        <SectionHeader icon={GitPullRequest} eyebrow="Source-backed signals" title="What the system saw" />
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
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
                {event.time}
              </Typography>
              <Box>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 900 }}>
                  {event.source}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 850 }}>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.body}
                </Typography>
              </Box>
              <Chip size="small" label={`Confidence: ${event.confidence}`} variant="outlined" />
            </Box>
          ))}
        </Stack>
      </Card>

      <Card elevation={0} sx={panelSx}>
        <SectionHeader icon={RadioTower} eyebrow="Traceability" title="Coverage map" />
        <Stack divider={<Divider />}>
          {program.signals.map((signal) => (
            <Box key={signal.source} sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 1.25 }}>
                <Box>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 900 }}>
                    {signal.source}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 850 }}>
                    {signal.detail}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={signal.state}
                  color={sourceStateColor[signal.state] ?? "default"}
                  variant={signal.state === "Mocked" ? "outlined" : "filled"}
                />
              </Stack>
              <LinearProgress variant="determinate" value={signal.strength} sx={{ height: 7, borderRadius: 99 }} />
            </Box>
          ))}
        </Stack>
      </Card>
    </Box>
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
            bgcolor: "rgba(255,255,255,0.055)",
            color: "text.secondary",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Icon size={15} />
        </Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {eyebrow}
          </Typography>
          <Typography variant="subtitle1" sx={{ lineHeight: 1.1, fontWeight: 820 }}>
            {title}
          </Typography>
        </Box>
      </Stack>
      {action}
    </Stack>
  );
}

export default App;
