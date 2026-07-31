import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";

import StatCards from "../components/DashboardComponents/StatCard";
import RecentDisasters from "../components/DashboardComponents/RecentDisasters";
import QuickSummary from "../components/DashboardComponents/QuickSummary";
import { getDisasters, getResources, getShelters } from "../services/api";

export default function Dashboard() {
  const [disasters, setDisasters] = useState([]);
  const [resources, setResources] = useState([]);
  const [shelters,  setShelters]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([getDisasters(), getResources(), getShelters()])
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
      <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Use current_population (the real DB column name)
  const totalOccupancy = shelters.reduce((sum, s) => sum + (s.current_population || 0), 0);
  const totalCapacity  = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Disaster Relief Resource Management System
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCards
            title="Active Disasters"
            value={disasters.length}
            subtitle="Currently active"
            icon="disaster"
            color="#ef4444"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCards
            title="Resources"
            value={resources.length}
            subtitle="Available resources"
            icon="resource"
            color="#1976d2"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCards
            title="Shelters"
            value={shelters.length}
            subtitle="Registered camps"
            icon="shelter"
            color="#2e7d32"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCards
            title="Occupancy"
            value={totalOccupancy}
            subtitle={`Capacity: ${totalCapacity}`}
            icon="occupancy"
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* Bottom section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RecentDisasters disasters={disasters} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <QuickSummary
            disasters={disasters.length}
            resources={resources.length}
            shelters={shelters.length}
            occupancy={totalOccupancy}
            capacity={totalCapacity}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
