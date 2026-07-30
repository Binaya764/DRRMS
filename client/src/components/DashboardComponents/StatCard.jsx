import { Card, CardContent, Box, Typography } from "@mui/material";

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";

const iconMap = {
  // Dashboard
  disaster: <WarningAmberOutlinedIcon fontSize="large" />,
  warning: <WarningAmberOutlinedIcon fontSize="large" />,
  resource: <Inventory2OutlinedIcon fontSize="large" />,
  inventory: <Inventory2OutlinedIcon fontSize="large" />,
  shelter: <HolidayVillageOutlinedIcon fontSize="large" />,
  village: <HolidayVillageOutlinedIcon fontSize="large" />,
  occupancy: <GroupsOutlinedIcon fontSize="large" />,
  users: <GroupsOutlinedIcon fontSize="large" />,

  // Optional future icons
  hospital: <LocalHospitalOutlinedIcon fontSize="large" />,
  donation: <VolunteerActivismOutlinedIcon fontSize="large" />,
  camp: <HomeWorkOutlinedIcon fontSize="large" />,
  water: <WaterDropOutlinedIcon fontSize="large" />,
  fire: <LocalFireDepartmentOutlinedIcon fontSize="large" />,
  medical: <MedicalServicesOutlinedIcon fontSize="large" />,
};

const StatCards = ({
  title,
  value,
  subtitle,
  icon = "resource",
  color = "#1976d2",
}) => {
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
            {iconMap[icon] ?? <Inventory2OutlinedIcon fontSize="large" />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCards;
