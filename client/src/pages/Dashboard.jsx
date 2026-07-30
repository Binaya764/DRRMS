import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from "@mui/material";
import axios from "axios";

function StatCard({ label, value }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h4">{value ?? "—"}</Typography>
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
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Active Disasters" value={disasters.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Resources Available" value={resources.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Shelters" value={shelters.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Occupancy"
            value={shelters.reduce((sum, s) => sum + (s.current_occupancy || 0), 0)}
          />
        </Grid>
      </Grid>

      {/* Recent disasters */}
      <Typography variant="h6" gutterBottom>
        Recent Active Disasters
      </Typography>
      <Box>
        {disasters.length === 0 ? (
          <Typography color="text.secondary">No active disasters.</Typography>
        ) : (
          disasters.slice(0, 5).map((d) => (
            <Card key={d.event_id} sx={{ mb: 1 }}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Typography fontWeight={600}>{d.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {d.type} — {d.location}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}
