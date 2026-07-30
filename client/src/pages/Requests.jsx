import { Box, Typography, Paper } from "@mui/material";

export default function Requests() {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Requests</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Resource requests will appear here.
        </Typography>
        {/* TODO: wire to requests API endpoint */}
      </Paper>
    </Box>
  );
}
