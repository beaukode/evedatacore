import React from "react";
import PanelDisplay from "./SystemNeighborsMap/components/PanelDisplay";
import PanelSelectedSystem from "./SystemNeighborsMap/components/PanelSelectedSystem";
import PanelTool from "./SystemNeighborsMap/components/PanelTool";

const SystemNeighborsMapDrawer: React.FC = () => {
  return (
    <>
      <PanelDisplay />
      <PanelTool />
      <PanelSelectedSystem />
    </>
  );
};

export default SystemNeighborsMapDrawer;
