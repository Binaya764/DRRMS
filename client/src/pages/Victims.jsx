import { Box, Typography, Paper } from "@mui/material";

export default function Victims() {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Victims</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Victim records will appear here.
        </Typography>
        {/* TODO: wire to victims API endpoint */}
      </Paper>
    </Box>
  );
}
