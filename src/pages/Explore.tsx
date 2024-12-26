import React from "react";
import {
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";
import { NavLink, Route, Routes, useLocation } from "react-router";
import ExploreCharacters from "./ExploreCharacters";
import ExploreAssemblies from "./ExploreAssemblies";
import ExploreCharacter from "./ExploreCharacter";
import ExploreAssembly from "./ExploreAssembly";
import Error404 from "./Error404";
import ExploreTypes from "./ExploreTypes";
import ExploreType from "./ExploreType";
import { getSolarsystems } from "../api/stillness";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../contexts/AppContext";
import ExploreConfig from "./ExploreConfig";
import ExploreKillmails from "./ExploreKillmails";
import ExploreSolarsystems from "./ExploreSolarsystems";
import ExploreSolarsystem from "./ExploreSolarsystem";

const routesMap: Record<string, number> = {
  "/explore": 0,
  "/explore/": 0,
  "/explore/characters": 0,
  "/explore/assemblies": 1,
  "/explore/killmails": 2,
  "/explore/types": 3,
  "/explore/solarsystems": 4,
  "/explore/config": 5,
};

const Explore: React.FC = () => {
  const location = useLocation();
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
    }
  }, [query.data, setSolarSystems]);

  return (
    <>
      <Paper elevation={1} sx={{ flexGrow: 0 }}>
        <Tabs value={currentTab}>
          <Tab
            label="Characters"
            component={NavLink}
            to="/explore/characters"
          />
          <Tab
            label="Assemblies"
            component={NavLink}
            to="/explore/assemblies"
          />
          <Tab label="Killmails" component={NavLink} to="/explore/killmails" />
          <Tab label="Types" component={NavLink} to="/explore/types" />
          <Tab
            label="Solar Systems"
            component={NavLink}
            to="/explore/solarsystems"
          />
          <Tab label="Config" component={NavLink} to="/explore/config" />
        </Tabs>
      </Paper>
      {query.isLoading && (
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
      {query.data && (
        <Routes>
          <Route path="" element={<ExploreCharacters />} />
          <Route path="/characters" element={<ExploreCharacters />} />
          <Route path="/characters/:address" element={<ExploreCharacter />} />
          <Route path="/assemblies" element={<ExploreAssemblies />} />
          <Route path="/assemblies/:id" element={<ExploreAssembly />} />
          <Route path="/killmails" element={<ExploreKillmails />} />
          <Route path="/types" element={<ExploreTypes />} />
          <Route path="/types/:id" element={<ExploreType />} />
          <Route path="/solarsystems" element={<ExploreSolarsystems />} />
          <Route path="/solarsystems/:id" element={<ExploreSolarsystem />} />
          <Route path="/config" element={<ExploreConfig />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      )}
    </>
  );
};

export default Explore;
