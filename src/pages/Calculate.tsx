import React from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import { NavLink, Route, Routes, useLocation } from "react-router";
import Error404 from "./Error404";
import CalculateVarious from "./CalculateVarious";
import CalculateRoute from "./CalculateRoute";

const routesMap: Record<string, number> = {
  "/calculate": 0,
  "/calculate/": 0,
  "/calculate/route-planner": 0,
  "/calculate/various-calculators": 1,
};

const Calculate: React.FC = () => {
  const location = useLocation();

  const path = location.pathname.split("/").slice(0, 3).join("/");

  const currentTab = routesMap[path];

  return (
    <>
      <Paper elevation={1} sx={{ flexGrow: 0 }}>
        <Tabs value={currentTab}>
          <Tab
            label="Route planner"
            component={NavLink}
            to="/calculate/route-planner"
          />
          <Tab
            label="Various calculators"
            component={NavLink}
            to="/calculate/various-calculators"
          />
        </Tabs>
      </Paper>
      <Routes>
        <Route path="" element={<CalculateVarious />} />
        <Route path="/route-planner" element={<CalculateRoute />} />
        <Route path="/various-calculators" element={<CalculateVarious />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Calculate;
