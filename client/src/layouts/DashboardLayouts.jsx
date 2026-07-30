import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar, { DRAWER_WIDTH } from "../components/Sidebar";

import Dashboard from "../pages/Dashboard";
import Camps from "../pages/Camps";
import Inventory from "../pages/Inventory";
import Resources from "../pages/Resources";
import Requests from "../pages/Requests";
import Donations from "../pages/Donations";
import Victims from "../pages/Victims";
import Distribution from "../pages/Distribution";
import Deployments from "../pages/Deployments";
import DisasterAreas from "../pages/DisasterAreas";

export default function DashboardLayouts() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f1f5f9",
          minHeight: "100vh",
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
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
