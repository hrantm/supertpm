import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App.jsx";
import "./styles.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#123c36",
      dark: "#0f2f2a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#b7791f",
    },
    success: {
      main: "#1f7a4a",
    },
    warning: {
      main: "#b7791f",
    },
    error: {
      main: "#b91c1c",
    },
    info: {
      main: "#075985",
    },
    background: {
      default: "#f5f6f3",
      paper: "#ffffff",
    },
    text: {
      primary: "#111816",
      secondary: "#5f6b66",
    },
    divider: "rgba(17,24,22,0.12)",
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily:
      'Aptos, "Avenir Next", "Helvetica Neue", "Segoe UI", system-ui, sans-serif',
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
      fontWeight: 760,
      letterSpacing: "0.06em",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(17,24,22,0.12)",
          borderRadius: 4,
          boxShadow: "none",
          backgroundColor: "#ffffff",
          transition: "border-color 160ms ease, background-color 160ms ease",
          "&:hover": {
            borderColor: "rgba(17,24,22,0.2)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 4,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
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
          borderRadius: 3,
          width: 32,
          height: 32,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          fontWeight: 760,
          height: 24,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(17,24,22,0.12)",
        },
        head: {
          color: "#5f6b66",
          fontSize: 12,
          fontWeight: 780,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 3,
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
