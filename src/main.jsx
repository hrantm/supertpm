import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App.jsx";
import "./styles.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5e6ad2",
      dark: "#4b55b8",
    },
    secondary: {
      main: "#26a69a",
    },
    success: {
      main: "#38a169",
    },
    warning: {
      main: "#d29922",
    },
    error: {
      main: "#e5484d",
    },
    info: {
      main: "#60a5fa",
    },
    background: {
      default: "#08090b",
      paper: "#111217",
    },
    text: {
      primary: "#f3f4f6",
      secondary: "#9aa0aa",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: 0,
      lineHeight: 1.04,
    },
    h4: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 800,
    },
    subtitle1: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 800,
      textTransform: "none",
    },
    overline: {
      fontWeight: 900,
      letterSpacing: "0.08em",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          boxShadow: "none",
          backgroundColor: "#111217",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 32,
          boxShadow: "none",
          paddingLeft: 12,
          paddingRight: 12,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          width: 32,
          height: 32,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 800,
          height: 24,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.08)",
        },
        head: {
          color: "#8b929e",
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 32,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
