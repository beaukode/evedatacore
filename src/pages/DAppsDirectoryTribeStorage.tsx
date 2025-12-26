import React from "react";
import { Helmet } from "react-helmet";
import { Box, Typography } from "@mui/material";
import PaperLevel1 from "@/components/ui/PaperLevel1";

const DAppsDirectoryTribeStorage: React.FC = () => {
  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <>
        <Helmet>
          <title>Tribe Storage dApp</title>
        </Helmet>
        <PaperLevel1 title="Tribe Storage dApp">
          <Typography variant="body1">
            This dApp allows your tribe members to put and optionally take items
            from your Smart Storage Unit inventory.
          </Typography>
        </PaperLevel1>
      </>
    </Box>
  );
};

export default DAppsDirectoryTribeStorage;
