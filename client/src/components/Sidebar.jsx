import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const DRAWER_WIDTH = 240;
export const COLLAPSED_WIDTH = 72;

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
  {
    label: "Disaster Areas",
    path: "/disaster-areas",
    icon: <WarningAmberIcon />,
  },
  { label: "Camps", path: "/camps", icon: <HolidayVillageIcon /> },
  { label: "Resources", path: "/resources", icon: <VolunteerActivismIcon /> },
  { label: "Inventory", path: "/inventory", icon: <Inventory2Icon /> },
  { label: "Victims", path: "/victims", icon: <PeopleIcon /> },
  { label: "Requests", path: "/requests", icon: <AssignmentIcon /> },
  { label: "Donations", path: "/donations", icon: <CardGiftcardIcon /> },
  { label: "Distribution", path: "/distribution", icon: <LocalShippingIcon /> },
  { label: "Deployments", path: "/deployments", icon: <DirectionsRunIcon /> },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: "width .25s",

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          overflowX: "hidden",
          transition: "width .25s",
          boxSizing: "border-box",
          background: "#1e293b",
          color: "#fff",
          borderRight: "none",
          borderRadius: "0px",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 2,
          py: 2,
        }}
      >
        {!collapsed && (
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#fff",
                letterSpacing: 1,
                fontSize: 18,
                mb: "17px",
                mt: 1,
                fontSize: 23,
              }}
            >
              DRRMS
            </Typography>
          </Box>
        )}

        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: "#fff",
            bgcolor: "#334155",
            "&:hover": {
              bgcolor: "#475569",
            },
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "#334155" }} />

      {/* Navigation */}
      <List sx={{ px: 1, pt: 1 }}>
        {navItems.map((item) => {
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                end={item.path === "/"}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: collapsed ? "center" : "initial",
                  px: collapsed ? 1 : 2,
                  bgcolor: active ? "#2563eb" : "transparent",
                  color: active ? "#fff" : "#94a3b8",

                  "&:hover": {
                    bgcolor: active ? "#2563eb" : "#334155",
                    color: "#fff",
                  },

                  transition: "all .2s",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
