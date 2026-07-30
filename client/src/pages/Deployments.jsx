import { Box, Typography, Paper } from "@mui/material";

export default function Deployments() {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Deployments</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Deployment records will appear here.
        </Typography>
        {/* TODO: wire to deployments API endpoint */}
      </Paper>
    </Box>
  );
}
