import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent,
  CircularProgress, Chip, Divider,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import axios from "axios";

function StatCard({ label, value, icon, color }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
        <Box
          sx={{
            width: 52, height: 52, borderRadius: 2,
            bgcolor: `${color}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box sx={{ color, display: "flex" }}>{icon}</Box>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={700} color="text.primary" lineHeight={1.2}>
            {value ?? "—"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [disasters, setDisasters] = useState([]);
  const [resources, setResources] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("/api/disaster"),
      axios.get("/api/resource"),
      axios.get("/api/shelter"),
    ])
      .then(([d, r, s]) => {
        setDisasters(d.data);
        setResources(r.data);
        setShelters(s.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const totalOccupancy = shelters.reduce((s, x) => s + (x.current_occupancy || 0), 0);

  return (
    <Box p={4}>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of active operations
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2.5} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Active Disasters" value={disasters.length}
            icon={<WarningAmberIcon />} color="#ef4444" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Resources Available" value={resources.length}
            icon={<VolunteerActivismIcon />} color="#2563eb" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Shelters" value={shelters.length}
            icon={<HolidayVillageIcon />} color="#16a34a" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Total Occupancy" value={totalOccupancy}
            icon={<PeopleAltIcon />} color="#d97706" />
        </Grid>
      </Grid>

      {/* Recent disasters */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Recent Active Disasters
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {disasters.length === 0 ? (
            <Typography color="text.secondary" variant="body2">No active disasters.</Typography>
          ) : (
            disasters.slice(0, 5).map((d, i) => (
              <Box key={d.event_id}>
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1.2}>
                  <Box>
                    <Typography fontWeight={600} variant="body1">{d.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {d.type} · {d.location}
                    </Typography>
                  </Box>
                  <Chip label="Active" color="error" size="small" sx={{ fontWeight: 600 }} />
                </Box>
                {i < Math.min(disasters.length, 5) - 1 && <Divider />}
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
