import React from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import { NavLink, Route, Routes, useLocation } from "react-router";
import Error404 from "./Error404";
import PrismicPage from "@/components/prismic/PrismicPage";

const routesMap: Record<string, number> = {
  "/dapps-directory": 0,
  "/dapps-directory/": 0,
  "/dapps-directory/tribe-storage": 0,
  "/dapps-directory/gate-access": 1,
};

const DAppsDirectory: React.FC = () => {
  const location = useLocation();

  const path = location.pathname.split("/").slice(0, 3).join("/");

  const currentTab = routesMap[path];

  return (
    <>
      <Paper elevation={1} sx={{ flexGrow: 0 }}>
        <Tabs value={currentTab} variant="scrollable" scrollButtons>
          <Tab
            label="Tribe Storage"
            component={NavLink}
            to="/dapps-directory/tribe-storage"
          />
          <Tab
            label="Gate Access"
            component={NavLink}
            to="/dapps-directory/gate-access"
          />
        </Tabs>
      </Paper>
      <Routes>
        <Route path="" element={<PrismicPage uid="tribe-storage" />} />
        <Route path="/" element={<PrismicPage uid="tribe-storage" />} />
        <Route
          path="/tribe-storage"
          element={<PrismicPage uid="tribe-storage" />}
        />
        <Route
          path="/gate-access"
          element={<PrismicPage uid="gate-access" />}
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default DAppsDirectory;
