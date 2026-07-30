import { Box, Typography, Paper } from "@mui/material";

export default function Inventory() {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Inventory</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Inventory data will appear here.
        </Typography>
        {/* TODO: wire to inventory API endpoint */}
      </Paper>
    </Box>
  );
}
