import { Paper, Typography, Divider, Stack, Box, Chip } from "@mui/material";

export default function RecentDisasters({ disasters }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Recent Active Disasters
      </Typography>

      <Divider sx={{ my: 2 }} />

      {disasters.length === 0 ? (
        <Typography color="text.secondary">No active disasters.</Typography>
      ) : (
        disasters.slice(0, 5).map((d, index) => (
          <Box key={d.event_id}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              py={1.5}
            >
              <Box>
                <Typography fontWeight={600}>{d.name}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {d.type} • {d.location}
                </Typography>
              </Box>

              <Chip label="Active" color="error" size="small" />
            </Stack>

            {index !== Math.min(5, disasters.length) - 1 && <Divider />}
          </Box>
        ))
      )}
    </Paper>
  );
}
