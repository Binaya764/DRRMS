import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent,
  CircularProgress, Chip, Divider,
} from "@mui/material";
import WarningAmberIcon      from "@mui/icons-material/WarningAmber";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import HolidayVillageIcon    from "@mui/icons-material/HolidayVillage";
import PeopleAltIcon         from "@mui/icons-material/PeopleAlt";
import axios from "axios";

function StatCard({ label, value, icon, color }) {
  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 3 }}>
        <Box sx={{
          width: 56, height: 56, borderRadius: 3,
          bgcolor: `${color}15`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Box sx={{ color, display: "flex", fontSize: 28 }}>{icon}</Box>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.3}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={800} color="text.primary" lineHeight={1}>
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const totalOccupancy = shelters.reduce((s, x) => s + (x.current_occupancy || 0), 0);

  return (
    <Box>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard label="Active Disasters"   value={disasters.length} icon={<WarningAmberIcon fontSize="inherit" />}      color="#ef4444" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard label="Resources Available" value={resources.length} icon={<VolunteerActivismIcon fontSize="inherit" />} color="#2563eb" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard label="Shelters"            value={shelters.length}  icon={<HolidayVillageIcon fontSize="inherit" />}    color="#16a34a" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard label="Total Occupancy"     value={totalOccupancy}   icon={<PeopleAltIcon fontSize="inherit" />}         color="#d97706" />
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" mb={0.5}>Recent Active Disasters</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Latest events requiring attention
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {disasters.length === 0 ? (
            <Box py={4} textAlign="center">
              <Typography color="text.secondary" variant="body2">No active disasters at this time.</Typography>
            </Box>
          ) : (
            disasters.slice(0, 5).map((d, i) => (
              <Box key={d.event_id}>
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1.5}>
                  <Box>
                    <Typography fontWeight={600}>{d.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {d.type} &nbsp;·&nbsp; {d.location}
                    </Typography>
                  </Box>
                  <Chip label="Active" color="error" size="small" />
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
