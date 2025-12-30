import React from "react";
import { Box, Grid2, List } from "@mui/material";
import BasicListItem from "@/components/ui/BasicListItem";
import { SolarSystem } from "@/api/evedatacore-v2";

interface ExploreSolarsystemWorldDataProps {
  solarSystem: SolarSystem;
}

const ExploreSolarsystemWorldData: React.FC<
  ExploreSolarsystemWorldDataProps
> = ({ solarSystem }) => {
  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem title="Id">{solarSystem.id}</BasicListItem>
            <BasicListItem title="L-Points">
              {solarSystem.lpoints.occupied} occupied /{" "}
              {solarSystem.lpoints.count} total
            </BasicListItem>
          </List>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem title="World coordinates">
              <Box sx={{ pl: 4 }}>
                <span style={{ textWrap: "nowrap" }}>
                  x: {solarSystem.location.x}
                </span>
                <br />
                <span style={{ textWrap: "nowrap" }}>
                  y: {solarSystem.location.y}
                </span>
                <br />
                <span style={{ textWrap: "nowrap" }}>
                  z: {solarSystem.location.z}
                </span>
              </Box>
            </BasicListItem>
          </List>
        </Grid2>
      </Grid2>
    </>
  );
};

export default ExploreSolarsystemWorldData;
