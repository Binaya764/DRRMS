import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Divider,
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

import Dashboard from "./pages/Dashboard";
import Camps from "./pages/Camps";
import Inventory from "./pages/Inventory";
import Resources from "./pages/Resources";
import Requests from "./pages/Requests";
import Donations from "./pages/Donations";
import Victims from "./pages/Victims";
import Distribution from "./pages/Distribution";
import Deployments from "./pages/Deployments";
import DisasterAreas from "./pages/DisasterAreas";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Dashboard",     path: "/",               icon: <DashboardIcon fontSize="small" /> },
  { label: "Disaster Areas",path: "/disaster-areas", icon: <WarningAmberIcon fontSize="small" /> },
  { label: "Camps",         path: "/camps",           icon: <HolidayVillageIcon fontSize="small" /> },
  { label: "Resources",     path: "/resources",       icon: <VolunteerActivismIcon fontSize="small" /> },
  { label: "Inventory",     path: "/inventory",       icon: <Inventory2Icon fontSize="small" /> },
  { label: "Victims",       path: "/victims",         icon: <PeopleIcon fontSize="small" /> },
  { label: "Requests",      path: "/requests",        icon: <AssignmentIcon fontSize="small" /> },
  { label: "Donations",     path: "/donations",       icon: <CardGiftcardIcon fontSize="small" /> },
  { label: "Distribution",  path: "/distribution",    icon: <LocalShippingIcon fontSize="small" /> },
  { label: "Deployments",   path: "/deployments",     icon: <DirectionsRunIcon fontSize="small" /> },
];

export default function App() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            background: "#1e293b",
            color: "#fff",
            borderRight: "none",
          },
        }}
      >
        {/* Logo area */}
        <Box sx={{ px: 3, py: 2.5 }}>
          <Typography variant="h6" fontWeight={800} letterSpacing={1}
            sx={{ color: "#fff", fontSize: 18 }}>
            🛡 DRRMS
          </Typography>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            Disaster Relief & Resource Mgmt
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#334155" }} />

        <List sx={{ px: 1, pt: 1 }}>
          {navItems.map((item) => {
            const active = item.path === "/"
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
                    px: 2,
                    py: 1,
                    color: active ? "#fff" : "#94a3b8",
                    bgcolor: active ? "#2563eb" : "transparent",
                    "&:hover": {
                      bgcolor: active ? "#2563eb" : "#334155",
                      color: "#fff",
                    },
                    transition: "all 0.15s",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#f1f5f9", minHeight: "100vh" }}
      >
        <Routes>
          <Route path="/"                element={<Dashboard />} />
          <Route path="/disaster-areas"  element={<DisasterAreas />} />
          <Route path="/camps"           element={<Camps />} />
          <Route path="/resources"       element={<Resources />} />
          <Route path="/inventory"       element={<Inventory />} />
          <Route path="/victims"         element={<Victims />} />
          <Route path="/requests"        element={<Requests />} />
          <Route path="/donations"       element={<Donations />} />
          <Route path="/distribution"    element={<Distribution />} />
          <Route path="/deployments"     element={<Deployments />} />
        </Routes>
      </Box>
    </Box>
  );
}
