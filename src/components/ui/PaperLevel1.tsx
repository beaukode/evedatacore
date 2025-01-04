import React from "react";
import { Typography, Paper, LinearProgress, Box } from "@mui/material";

interface RootPaperProps {
  title: string;
  loading?: boolean;
  children?: React.ReactNode;
}

const PaperLevel1: React.FC<RootPaperProps> = ({
  title,
  loading,
  children,
}) => {
  return (
    <>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "background.default" }}
        gutterBottom
      >
        {title}
      </Typography>
      {loading && (
        <Box sx={{ position: "relative" }}>
          <LinearProgress
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
            }}
          />
        </Box>
      )}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        {children}
      </Paper>
    </>
  );
};

export default PaperLevel1;
