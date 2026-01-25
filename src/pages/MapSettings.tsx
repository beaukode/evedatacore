import React from "react";
import { Box, Grid2 } from "@mui/material";
import Databases from "./MapSettings/Databases";
import Copy from "./MapSettings/Copy";

const MapSettings: React.FC = () => {
  return (
    <Box p={2}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Databases />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Copy />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default MapSettings;
