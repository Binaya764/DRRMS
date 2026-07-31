import { Paper, Typography, Divider, Stack, Box, Chip } from "@mui/material";

const severityColor = (s) =>
  ({ Low: "info", Medium: "warning", High: "error", Critical: "error" }[s] || "default");

export default function RecentDisasters({ disasters }) {
  const recent = disasters.slice(0, 5);

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

      {recent.length === 0 ? (
        <Typography color="text.secondary">No active disasters.</Typography>
      ) : (
        recent.map((d, index) => (
          <Box key={d.area_id}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              py={1.5}
            >
              <Box>
                <Typography fontWeight={600}>{d.disaster_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {d.disaster_type} • {d.location}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                {d.severity && (
                  <Chip label={d.severity} color={severityColor(d.severity)} size="small" />
                )}
                <Chip label={d.status || "Active"} color="error" size="small" />
              </Stack>
            </Stack>

            {index < recent.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </Paper>
  );
}
