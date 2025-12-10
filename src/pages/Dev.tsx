import React from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import { NavLink, Route, Routes, useLocation } from "react-router";
import Error404 from "./Error404";
import DevWeb3 from "./DevWeb3";
import DevInternal from "./DevInternal";
import DevConfig from "./DevConfig";

const routesMap: Record<string, number> = {
  "/dev": 0,
  "/dev/": 0,
  "/dev/config": 0,
  "/dev/web3": 1,
  "/dev/internal": 2,
};

const Dev: React.FC = () => {
  const location = useLocation();

  const path = location.pathname.split("/").slice(0, 3).join("/");

  const currentTab = routesMap[path];

  return (
    <>
      <Paper elevation={1} sx={{ flexGrow: 0 }}>
        <Tabs value={currentTab} variant="scrollable" scrollButtons>
          <Tab label="Config" component={NavLink} to="/dev/config" />
          <Tab label="Web3" component={NavLink} to="/dev/web3" />
          {import.meta.env.DEV && (
            <Tab label="Internal" component={NavLink} to="/dev/internal" />
          )}
        </Tabs>
      </Paper>
      <Routes>
        <Route path="" element={<DevConfig />} />
        <Route path="/config" element={<DevConfig />} />
        <Route path="/web3" element={<DevWeb3 />} />
        {import.meta.env.DEV && (
          <Route path="/internal" element={<DevInternal />} />
        )}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Dev;
