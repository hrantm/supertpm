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
      dark: "#10201b",
    },
    secondary: {
      main: "#d6a11e",
    },
    success: {
      main: "#1f7a4a",
    },
    warning: {
      main: "#d6a11e",
    },
    error: {
      main: "#b91c1c",
    },
    info: {
      main: "#075985",
    },
    background: {
      default: "#f8f7f1",
      paper: "#fffef8",
    },
    text: {
      primary: "#10201b",
      secondary: "#53645f",
    },
    divider: "rgba(18,60,54,0.14)",
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily:
      'Aptos, "Segoe UI", system-ui, sans-serif',
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
          border: "1px solid rgba(18,60,54,0.14)",
          borderRadius: 4,
          boxShadow: "none",
          backgroundColor: "#fffef8",
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
          fontWeight: 800,
          height: 24,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(18,60,54,0.14)",
        },
        head: {
          color: "#53645f",
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
