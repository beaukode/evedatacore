import React from "react";
import { Helmet } from "react-helmet";
import { Box, Button, Typography } from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

const ErrorWip: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography variant="h1">418</Typography>
        <Typography variant="h2">Work in progress</Typography>
        <Typography variant="subtitle2">Come back later...</Typography>{" "}
        <Button
          onClick={() => navigate(-1)}
          sx={{ mt: 8 }}
          variant="contained"
          size="large"
          startIcon={<BackIcon />}
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default ErrorWip;
