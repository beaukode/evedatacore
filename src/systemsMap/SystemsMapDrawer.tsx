import React from "react";
import PanelDisplay from "./components/PanelDisplay";
import PanelSelectedSystem from "./components/PanelSelectedSystem";
import PanelTool from "./components/PanelTool";

const SystemsMapDrawer: React.FC = () => {
  return (
    <>
      <PanelDisplay />
      <PanelTool />
      <PanelSelectedSystem />
    </>
  );
};

export default SystemsMapDrawer;
