import React from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import { NavLink, Route, Routes, useLocation } from "react-router";
import Error404 from "./Error404";
import DevMudSql from "./DevMudSql";
import DevWeb3 from "./DevWeb3";
import DevInternal from "./DevInternal";
import DevConfig from "./DevConfig";

const routesMap: Record<string, number> = {
  "/dev": 0,
  "/dev/": 0,
  "/dev/web3": 0,
  "/dev/mudsql": 1,
  "/dev/config": 2,
  "/dev/internal": 3,
};

const Dev: React.FC = () => {
  const location = useLocation();

  const path = location.pathname.split("/").slice(0, 3).join("/");

  const currentTab = routesMap[path];

  return (
    <>
      <Paper elevation={1} sx={{ flexGrow: 0 }}>
        <Tabs value={currentTab} variant="scrollable" scrollButtons>
          <Tab label="Web3" component={NavLink} to="/dev/web3" />
          <Tab label="MUD Sql" component={NavLink} to="/dev/mudsql" />
          <Tab label="Config" component={NavLink} to="/dev/config" />
          {import.meta.env.DEV && (
            <Tab label="Internal" component={NavLink} to="/dev/internal" />
          )}
        </Tabs>
      </Paper>
      <Routes>
        <Route path="" element={<DevMudSql />} />
        <Route path="/web3" element={<DevWeb3 />} />
        <Route path="/mudsql" element={<DevMudSql />} />
        <Route path="/config" element={<DevConfig />} />
        {import.meta.env.DEV && (
          <Route path="/internal" element={<DevInternal />} />
        )}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Dev;
