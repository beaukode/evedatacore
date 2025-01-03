import React from "react";
import { Alert, Box, Grid2 as Grid } from "@mui/material";
import { Helmet } from "react-helmet";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ExternalLink from "@/components/ui/ExternalLink";

const CalculateRoute: React.FC = () => {
  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>Various calculators</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaperLevel1 title="Route planner">Route planner form</PaperLevel1>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaperLevel1 title="Roadmap">Results...</PaperLevel1>
        </Grid>
      </Grid>
      <Alert severity="info">
        This calculator is based on the work of Shish, from his website{" "}
        <ExternalLink
          title="EVE Frontier Toolbox"
          href="https://eftb.shish.io/"
        />{" "}
        and its source code
        <br />
        <br />
        If you enjoy this calculator, please consider supporting him by buying a
        coffee at{" "}
        <ExternalLink title="Buy a coffee" href="https://ko-fi.com/shish2k" />
      </Alert>
    </Box>
  );
};

export default CalculateRoute;
