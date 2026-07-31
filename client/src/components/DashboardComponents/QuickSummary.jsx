import { Paper, Typography, Divider, Box, LinearProgress } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import GroupsIcon from "@mui/icons-material/Groups";

const rows = [
  { key: "disasters", label: "Active Disasters", icon: <WarningAmberIcon fontSize="small" />, color: "#ef4444" },
  { key: "resources", label: "Available Resources", icon: <Inventory2Icon fontSize="small" />, color: "#1976d2" },
  { key: "shelters",  label: "Registered Shelters", icon: <HolidayVillageIcon fontSize="small" />, color: "#2e7d32" },
];

export default function QuickSummary({ disasters, resources, shelters, occupancy, capacity }) {
  const occupancyPct = capacity > 0 ? Math.min(100, Math.round((occupancy / capacity) * 100)) : 0;

  const values = { disasters, resources, shelters };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Quick Summary
      </Typography>

      <Divider sx={{ my: 2 }} />

      {rows.map(({ key, label, icon, color }, i) => (
        <Box key={key}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={1.5}
          >
            <Box display="flex" alignItems="center" gap={1} sx={{ color }}>
              {icon}
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {label}
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color }}>
              {values[key] ?? 0}
            </Typography>
          </Box>
          {i < rows.length - 1 && <Divider />}
        </Box>
      ))}

      <Divider sx={{ my: 1 }} />

      {/* Occupancy bar */}
      <Box pt={1.5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
          <Box display="flex" alignItems="center" gap={1} sx={{ color: "#ed6c02" }}>
            <GroupsIcon fontSize="small" />
            <Typography variant="body2" fontWeight={500} color="text.primary">
              Shelter Occupancy
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={700} color="text.secondary">
            {occupancy} / {capacity}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={occupancyPct}
          color={occupancyPct > 90 ? "error" : occupancyPct > 70 ? "warning" : "success"}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" mt={0.5} display="block" textAlign="right">
          {occupancyPct}% capacity used
        </Typography>
      </Box>
    </Paper>
  );
}
