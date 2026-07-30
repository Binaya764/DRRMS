import { Card, CardContent, Box, Typography } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const iconMap = {
  lock: <LockOutlinedIcon fontSize="large" />,
  users: <PeopleAltOutlinedIcon fontSize="large" />,
  unlock: <LockOpenOutlinedIcon fontSize="large" />,
  warning: <ReportProblemOutlinedIcon fontSize="large" />,
};

const StatCards = ({ title, value, subtitle, icon, color = "#1976d2" }) => {
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 3,
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography variant="h4" fontWeight="bold" mt={1}>
              {value}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              bgcolor: `${color}20`,
              color: color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {iconMap[icon]}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCards;
