import { Box, Typography, Paper } from "@mui/material";

export default function Distribution() {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Distribution</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Distribution records will appear here.
        </Typography>
        {/* TODO: wire to distribution API endpoint */}
      </Paper>
    </Box>
  );
}
