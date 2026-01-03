import React from "react";
import { Route, Routes } from "react-router";
import Error404 from "../Error404";
import { SolarSystem } from "@/api/evedatacore-v2";
import { SystemsMapContextProvider } from "@/systemsMap/contexts/SystemsMapContextProvider";
import SystemsMap from "@/systemsMap/SystemsMap";
import SystemsUserData from "@/systemsMap/SystemsUserData";
import SystemsSettings from "@/systemsMap/SystemsSettings";

interface ExploreSolarsystemRoutingProps {
  solarSystem: SolarSystem;
}

const ExploreSolarsystemRouting: React.FC<ExploreSolarsystemRoutingProps> = ({
  solarSystem,
}) => {
  return (
    <SystemsMapContextProvider>
      <Routes>
        <Route path="/map" element={<SystemsMap systemId={solarSystem.id} />} />
        <Route path="/data" element={<SystemsUserData />} />
        <Route path="/settings" element={<SystemsSettings />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </SystemsMapContextProvider>
  );
};

export default ExploreSolarsystemRouting;
