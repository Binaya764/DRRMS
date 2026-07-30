import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#1976d2",
    },

    secondary: {
      main: "#2e7d32",
    },

    error: {
      main: "#d32f2f",
    },

    warning: {
      main: "#ed6c02",
    },

    info: {
      main: "#0288d1",
    },

    success: {
      main: "#2e7d32",
    },

    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },

    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },

  shape: {
    borderRadius: 10,
  },

  typography: {
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(","),

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #e5e7eb",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #e5e7eb",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },

    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: "small",
        variant: "outlined",
      },
    },

    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
        },
        columnHeaders: {
          backgroundColor: "#f8fafc",
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
