import React from "react";
import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router";

const HeaderLogo: React.FC = () => {
  return (
    <Typography
      variant="h6"
      component={NavLink}
      to="/"
      sx={{
        textDecoration: "none",
        color: "inherit",
        fontFamily: "Major Mono Display",
        lineHeight: 1,
        textAlign: "center",
      }}
    >
      EVE
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        |D
        <Box component="span" sx={{ fontSize: "0.8em" }}>
          atacore
        </Box>
      </Box>
      <Box
        component="span"
        sx={{ fontSize: "0.6em", display: { xs: "inline", sm: "none" } }}
      >
        <br />
        Datacore
      </Box>
    </Typography>
  );
};

export default HeaderLogo;
