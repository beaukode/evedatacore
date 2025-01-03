import React from "react";
import {
  Paper,
  Tabs,
  Tab,
  Box,
  LinearProgress,
  Typography,
} from "@mui/material";
import { NavLink, Route, Routes, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getSolarsystems } from "@/api/stillness";
import { useAppContext } from "@/contexts/AppContext";
import CalculateJumpDistance from "./CalculateVarious";
import Error404 from "./Error404";
import CalculateVarious from "./CalculateVarious";
import ErrorWip from "./ErrorWip";

const routesMap: Record<string, number> = {
  "/calculate": 0,
  "/calculate/": 0,
  "/calculate/systems-distance": 0,
  "/calculate/various-calculators": 1,
};

const Calculate: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const { setSolarSystems } = useAppContext();

  const path = location.pathname.split("/").slice(0, 3).join("/");

  const currentTab = routesMap[path];

  const query = useQuery({
    queryKey: ["Solarsystems"],
    queryFn: async () => await getSolarsystems().then((r) => r.data || {}),
  });

  React.useEffect(() => {
    if (query.data) {
      setSolarSystems(query.data);
      setLoading(false);
    }
  }, [query.data, setSolarSystems]);

  return (
    <>
      <Paper elevation={1} sx={{ flexGrow: 0 }}>
        <Tabs value={currentTab}>
          <Tab
            label="Systems distance"
            component={NavLink}
            to="/calculate/systems-distance"
          />
          <Tab
            label="Various calculators"
            component={NavLink}
            to="/calculate/various-calculators"
          />
        </Tabs>
      </Paper>
      {loading && (
        <Box p={2} overflow="hidden">
          <Paper
            elevation={1}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Loading Solarsystems
            </Typography>
            <LinearProgress />
          </Paper>
        </Box>
      )}
      {!loading && (
        <Routes>
          <Route path="" element={<CalculateJumpDistance />} />
          <Route path="/systems-distance" element={<ErrorWip />} />
          <Route path="/various-calculators" element={<CalculateVarious />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      )}
    </>
  );
};

export default Calculate;
