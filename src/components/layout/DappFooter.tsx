import React from "react";
import { Box, Typography } from "@mui/material";
import ExternalLink from "../ui/ExternalLink";

const DappFooter: React.FC = () => {
  return (
    <Box
      position="fixed"
      component="footer"
      sx={{
        py: 0.2,
        mt: "auto",
        width: "100%",
        opacity: 1,
        backgroundColor: "#000400",
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        top: "auto",
        bottom: 0,
      }}
    >
      <Typography variant="body2" color="text.primary" align="center">
        This DApp is provided by{" "}
        <ExternalLink href="https://evedataco.re" title="EVE|Datacore" />
      </Typography>
    </Box>
  );
};

export default DappFooter;
