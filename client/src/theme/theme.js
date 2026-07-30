import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary:    { main: "#2563eb" },
    secondary:  { main: "#16a34a" },
    error:      { main: "#ef4444" },
    warning:    { main: "#f59e0b" },
    info:       { main: "#0284c7" },
    success:    { main: "#16a34a" },
    background: { default: "#f1f5f9", paper: "#ffffff" },
    text:       { primary: "#0f172a", secondary: "#64748b" },
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', sans-serif",
    h4: { fontWeight: 800, letterSpacing: "-0.5px" },
    h5: { fontWeight: 700, letterSpacing: "-0.3px" },
    h6: { fontWeight: 700, letterSpacing: "-0.2px" },
    body1: { fontSize: "0.9375rem" },
    body2: { fontSize: "0.8125rem" },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
    caption: { fontSize: "0.75rem", letterSpacing: "0.02em" },
  },

  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: "none" },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          borderRadius: 16,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          borderRadius: 16,
        },
      },
    },

    MuiButton: {
      defaultProps: { variant: "contained", disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "7px 18px",
          fontSize: "0.875rem",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          "&:hover": { background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)" },
        },
      },
    },

    MuiTextField: {
      defaultProps: { fullWidth: true, size: "small", variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#f8fafc",
            "&:hover fieldset": { borderColor: "#2563eb" },
          },
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#f8fafc",
            color: "#475569",
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            borderBottom: "1px solid #e2e8f0",
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "#f8fafc" },
          "& .MuiTableCell-body": {
            borderBottom: "1px solid #f1f5f9",
            color: "#1e293b",
            fontSize: "0.875rem",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, fontSize: "0.75rem" },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20, padding: "4px" },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: "1.1rem", fontWeight: 700, paddingBottom: 8 },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, height: 8 },
      },
    },
  },
});

export default theme;
