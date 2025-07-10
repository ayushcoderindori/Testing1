// src/theme.js
import { createTheme } from "@mui/material/styles";

// Light theme palette
const lightPalette = {
  mode: 'light',
  primary: { 
    main: "#2563EB", // Beautiful blue
    light: "#60A5FA",
    dark: "#1D4ED8"
  },
  secondary: { 
    main: "#7C3AED", // Purple
    light: "#A78BFA",
    dark: "#5B21B6"
  },
  success: { main: "#10B981" },
  info: { main: "#06B6D4" },
  warning: { main: "#F59E0B" },
  error: { main: "#EF4444" },
  background: {
    default: "#F8FAFC", // Light neutral
    paper: "#FFFFFF"
  },
  text: {
    primary: "#0F172A",
    secondary: "#475569"
  },
  divider: "#E2E8F0"
};

// Dark theme palette
const darkPalette = {
  mode: 'dark',
  primary: { 
    main: "#3B82F6", // Brighter blue for dark mode
    light: "#60A5FA",
    dark: "#2563EB"
  },
  secondary: { 
    main: "#8B5CF6", // Brighter purple for dark mode
    light: "#A78BFA",
    dark: "#7C3AED"
  },
  success: { main: "#10B981" },
  info: { main: "#06B6D4" },
  warning: { main: "#F59E0B" },
  error: { main: "#EF4444" },
  background: {
    default: "#0F172A", // Dark navy
    paper: "#1E293B"    // Lighter dark
  },
  text: {
    primary: "#F1F5F9",
    secondary: "#CBD5E1"
  },
  divider: "#334155"
};

const typography = {
  fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  h1: { fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.02em" },
  h2: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" },
  h3: { fontSize: "1.75rem", fontWeight: 600 },
  h4: { fontSize: "1.5rem", fontWeight: 600 },
  h5: { fontSize: "1.25rem", fontWeight: 600 },
  h6: { fontSize: "1.125rem", fontWeight: 600 },
  body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 },
  body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: "0.75rem", fontWeight: 400 },
  button: { fontSize: "0.875rem", fontWeight: 600, textTransform: "none" }
};

const createCustomTheme = (mode) => createTheme({
  palette: mode === 'light' ? lightPalette : darkPalette,
  typography,
  spacing: 4,
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transform: "translateY(-1px)"
          }
        },
        contained: {
          background: mode === 'light' 
            ? "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)"
            : "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
          "&:hover": {
            background: mode === 'light'
              ? "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)"
              : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: "20px",
          transition: "all 0.3s ease",
          boxShadow: mode === 'light' 
            ? "0 1px 3px rgba(0,0,0,0.1)"
            : "0 4px 12px rgba(0,0,0,0.3)",
          "&:hover": {
            boxShadow: mode === 'light'
              ? "0 8px 25px rgba(0,0,0,0.15)"
              : "0 8px 25px rgba(0,0,0,0.4)",
            transform: "translateY(-2px)"
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 2
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "0 4px",
          minHeight: 40,
          textTransform: "none",
          fontWeight: 600
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: `1px solid ${mode === 'light' ? '#E2E8F0' : '#334155'}`
        }
      }
    }
  }
});

export default { createCustomTheme, lightPalette, darkPalette };
