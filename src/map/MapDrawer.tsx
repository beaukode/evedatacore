import React from "react";
import { Paper } from "@mui/material";
import PanelDisplay from "./components/PanelDisplay";
import PanelSelectedSystem from "./components/PanelSelectedSystem";
import PanelTool from "./components/PanelTool";

const MapDrawer: React.FC = () => {
  return (
    <Paper
      sx={{
        width: 300,
        flexShrink: 0,
        flexGrow: 0,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
      elevation={4}
    >
      <PanelDisplay />
      <PanelTool />
      <PanelSelectedSystem />
    </Paper>
  );
};

export default MapDrawer;
