import { Box, Typography, Paper } from "@mui/material";

export default function Donations() {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Donations</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Donation records will appear here.
        </Typography>
        {/* TODO: wire to donations API endpoint */}
      </Paper>
    </Box>
  );
}
