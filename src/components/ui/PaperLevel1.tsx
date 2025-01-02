import React from "react";
import { Typography, Paper } from "@mui/material";

interface RootPaperProps {
  title: string;
  children: React.ReactNode;
}

const PaperLevel1: React.FC<RootPaperProps> = ({ title, children }) => {
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
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        {children}
      </Paper>
    </>
  );
};

export default PaperLevel1;
