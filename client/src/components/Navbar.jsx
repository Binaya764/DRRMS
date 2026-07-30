import { useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { DRAWER_WIDTH } from "./Sidebar";

const titles = {
  "/":               { title: "Dashboard",        subtitle: "Overview of active operations" },
  "/disaster-areas": { title: "Disaster Areas",   subtitle: "Active disaster events" },
  "/camps":          { title: "Camps & Shelters", subtitle: "Shelter occupancy and capacity" },
  "/resources":      { title: "Resources",        subtitle: "Available relief resources" },
  "/inventory":      { title: "Inventory",        subtitle: "Stock and supply tracking" },
  "/victims":        { title: "Victims",          subtitle: "Affected people records" },
  "/requests":       { title: "Resource Requests",subtitle: "Incoming requests from shelters" },
  "/donations":      { title: "Donations",        subtitle: "Donated goods and supplies" },
  "/distribution":   { title: "Distribution",     subtitle: "Relief distribution records" },
  "/deployments":    { title: "Deployments",      subtitle: "Field team deployments" },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const page = titles[pathname] || { title: "DRRMS", subtitle: "" };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        width: "100%",
        zIndex: 1,
      }}
    >
      <Toolbar sx={{ px: { xs: 3, md: 4 }, minHeight: "64px !important" }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1.2}>
            {page.title}
          </Typography>
          {page.subtitle && (
            <Typography variant="caption" color="text.secondary">
              {page.subtitle}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
