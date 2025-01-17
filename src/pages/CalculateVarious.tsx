import React from "react";
import { Alert, Box, Grid2 as Grid } from "@mui/material";
import { Helmet } from "react-helmet";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import JumpDistance from "./Calculators/JumpDistance";
import FuelRequirement from "./Calculators/FuelRequirement";
import SystemsDistance from "./Calculators/SystemsDistance";
import ExternalLink from "@/components/ui/ExternalLink";
import { useSolarSystemsIndex } from "@/contexts/AppContext";

const CalculateVarious: React.FC = () => {
  const solarSystemsIndex = useSolarSystemsIndex();

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>Various calculators</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaperLevel1 title="Ship jump distance">
            <JumpDistance />
          </PaperLevel1>
          <PaperLevel1 title="Systems distance" loading={!solarSystemsIndex}>
            {solarSystemsIndex && (
              <SystemsDistance solarSystemsIndex={solarSystemsIndex} />
            )}
          </PaperLevel1>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaperLevel1 title="Fuel Requirement">
            <FuelRequirement />
          </PaperLevel1>
        </Grid>
      </Grid>
      <Alert severity="info">
        Theses calculators are based on the work of Shish, from his website{" "}
        <ExternalLink
          title="EVE Frontier Toolbox"
          href="https://eftb.shish.io/"
        />{" "}
        and its source code
        <br />
        <br />
        If you enjoy these calculators, please consider supporting him by buying
        a coffee at{" "}
        <ExternalLink title="Buy a coffee" href="https://ko-fi.com/shish2k" />
      </Alert>
    </Box>
  );
};

export default CalculateVarious;
