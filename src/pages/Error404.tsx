import React from "react";
import { Helmet } from "react-helmet";
import { Box, Button, Typography } from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

const subtitles = [
  "Are you a K4T-Y-61 resident ?",
  "You are not alone",
  "Out of fuel, please self destruct",
  "It's too bad you won't live! But then again, who does?",
  "Whoa.",
];

interface Error404Props {
  hideBackButton?: boolean;
}

const Error404: React.FC<Error404Props> = ({ hideBackButton }) => {
  const navigate = useNavigate();

  const randomSubtitle =
    subtitles[Math.floor(Math.random() * subtitles.length)];

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
        <Typography variant="h1">404</Typography>
        <Typography variant="h2">Page Not found</Typography>
        <Typography variant="subtitle2">{randomSubtitle}</Typography>
        {!hideBackButton && (
          <Button
            onClick={() => navigate(-1)}
            sx={{ mt: 8 }}
            variant="contained"
            size="large"
            startIcon={<BackIcon />}
          >
            Back
          </Button>
        )}
      </Box>
    </>
  );
};

export default Error404;
