import { useEffect, useState } from "react";
import axios from "axios";

import { Box, Typography, CircularProgress, Grid } from "@mui/material";

import StatCards from "../components/DashboardComponents/StatCard";
import RecentDisasters from "../components/DashboardComponents/RecentDisasters";
import QuickSummary from "../components/DashboardComponents/QuickSummary";

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
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const totalOccupancy = shelters.reduce(
    (sum, shelter) => sum + (shelter.current_occupancy || 0),
    0,
  );

  const totalCapacity = shelters.reduce(
    (sum, shelter) => sum + (shelter.capacity || 0),
    0,
  );

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>

        <Typography color="text.secondary">
          Disaster Relief Resource Management System
        </Typography>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCards
            title="Active Disasters"
            value={disasters.length}
            subtitle="Currently Active"
            icon="disaster"
            color="#ef4444"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCards
            title="Resources"
            value={resources.length}
            subtitle="Available Resources"
            icon="resource"
            color="#1976d2"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCards
            title="Shelters"
            value={shelters.length}
            subtitle="Registered Camps"
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

      {/* Bottom Section */}
      <Grid
        container
        spacing={3}
        sx={{
          mt: 2,
        }}
      >
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
