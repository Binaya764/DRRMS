import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function Navbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const date = time.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const currentTime = time.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#EAF1F8",
        color: "#0f172a",
        borderBottom: "1px solid #cbd5e1",
        borderRadius: "0px",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "86px !important",
          px: { xs: 3, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left */}
        <Box>
          <Typography
            sx={{
              mt: 1,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#0f172a",
            }}
          >
            Disaster Relief Resource Management System
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 14,
              color: "#64748b",
              fontWeight: 500,
              mb: "1px",
            }}
          >
            Coordinating Emergency Response & Resource Distribution
          </Typography>
        </Box>

        {/* Right */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Chip
            icon={<CheckCircleIcon />}
            label="System Online"
            sx={{
              bgcolor: "#dcfce7",
              color: "#166534",
              fontWeight: 700,
              px: 1,
              height: 38,
              borderRadius: "20px",
            }}
          />

          <Chip
            icon={<CalendarTodayIcon />}
            label={date}
            sx={{
              bgcolor: "#eff6ff",
              color: "#1d4ed8",
              fontWeight: 600,
              px: 1,
              height: 38,
              borderRadius: "20px",
            }}
          />

          <Chip
            icon={<AccessTimeIcon />}
            label={`${currentTime} NPT`}
            sx={{
              bgcolor: "#f8fafc",
              color: "#334155",
              fontWeight: 600,
              px: 1,
              height: 38,
              borderRadius: "20px",
            }}
          />

          <Chip
            icon={<WarningAmberIcon />}
            label="3 Active Disasters"
            sx={{
              bgcolor: "#fee2e2",
              color: "#b91c1c",
              fontWeight: 700,
              px: 1,
              height: 38,
              borderRadius: "20px",
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
