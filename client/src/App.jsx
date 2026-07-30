import { Routes, Route, NavLink } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";

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

const DRAWER_WIDTH = 220;

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Disaster Areas", path: "/disaster-areas" },
  { label: "Camps", path: "/camps" },
  { label: "Resources", path: "/resources" },
  { label: "Inventory", path: "/inventory" },
  { label: "Victims", path: "/victims" },
  { label: "Requests", path: "/requests" },
  { label: "Donations", path: "/donations" },
  { label: "Distribution", path: "/distribution" },
  { label: "Deployments", path: "/deployments" },
];

export default function App() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb" }}>
          <Typography variant="h6" fontWeight={700} color="primary">
            DRRMS
          </Typography>
        </Box>
        <List dense>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                end={item.path === "/"}
                sx={{
                  borderRadius: 1,
                  mx: 0.5,
                  "&.active": {
                    bgcolor: "primary.main",
                    color: "white",
                    "& .MuiListItemText-primary": { fontWeight: 600 },
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/disaster-areas" element={<DisasterAreas />} />
          <Route path="/camps" element={<Camps />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/victims" element={<Victims />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/distribution" element={<Distribution />} />
          <Route path="/deployments" element={<Deployments />} />
        </Routes>
      </Box>
    </Box>
  );
}
