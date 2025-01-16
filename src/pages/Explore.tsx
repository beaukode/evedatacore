import React from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import { NavLink, Route, Routes, useLocation } from "react-router";
import ExploreCharacters from "./ExploreCharacters";
import ExploreAssemblies from "./ExploreAssemblies";
import ExploreCharacter from "./ExploreCharacter";
import ExploreAssembly from "./ExploreAssembly";
import Error404 from "./Error404";
import ExploreTypes from "./ExploreTypes";
import ExploreType from "./ExploreType";
import ExploreConfig from "./ExploreConfig";
import ExploreKillmails from "./ExploreKillmails";
import ExploreSolarsystems from "./ExploreSolarsystems";
import ExploreSolarsystem from "./ExploreSolarsystem";
import ExploreNamespaces from "./ExploreNamespaces";
import ExploreNamespace from "./ExploreNamespace";
import ExploreTables from "./ExploreTables";
import ExploreTable from "./ExploreTable";
import ExploreSystems from "./ExploreSystems";
import ExploreSystem from "./ExploreSystem";

const routesMap: Record<string, number> = {
  "/explore": 0,
  "/explore/": 0,
  "/explore/characters": 0,
  "/explore/assemblies": 1,
  "/explore/killmails": 2,
  "/explore/types": 3,
  "/explore/solarsystems": 4,
  "/explore/namespaces": 5,
  "/explore/tables": 6,
  "/explore/systems": 7,
  "/explore/config": 8,
};

const Explore: React.FC = () => {
  const location = useLocation();

  const path = location.pathname.split("/").slice(0, 3).join("/");

  const currentTab = routesMap[path];

  return (
    <>
      <Paper elevation={1} sx={{ flexGrow: 0 }}>
        <Tabs value={currentTab} variant="scrollable" scrollButtons>
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
          <Tab
            label="Namespaces"
            component={NavLink}
            to="/explore/namespaces"
          />
          <Tab label="Tables" component={NavLink} to="/explore/tables" />
          <Tab label="Systems" component={NavLink} to="/explore/systems" />
          <Tab label="Config" component={NavLink} to="/explore/config" />
        </Tabs>
      </Paper>
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
        <Route path="/namespaces" element={<ExploreNamespaces />} />
        <Route path="/namespaces/:id" element={<ExploreNamespace />} />
        <Route path="/tables" element={<ExploreTables />} />
        <Route path="/tables/:id" element={<ExploreTable />} />
        <Route path="/systems" element={<ExploreSystems />} />
        <Route path="/systems/:id" element={<ExploreSystem />} />
        <Route path="/config" element={<ExploreConfig />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Explore;
