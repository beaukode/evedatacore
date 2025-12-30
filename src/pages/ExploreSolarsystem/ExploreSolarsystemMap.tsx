import React from "react";
import { SolarSystem } from "@/api/evedatacore-v2";
import SystemsMap from "@/systemsMap/SystemsMap";

interface ExploreSolarsystemMapProps {
  solarSystem: SolarSystem;
}

const ExploreSolarsystemMap: React.FC<ExploreSolarsystemMapProps> = ({
  solarSystem,
}) => {
  return <SystemsMap systemId={solarSystem.id} />;
};

export default ExploreSolarsystemMap;
