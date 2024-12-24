import React from "react";
import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import { Routes, Route } from "react-router";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import About from "./pages/About";
import Dev from "./pages/Dev";
import { useMudContext } from "./mud/MudContext";

const Routing: React.FC = () => {
  const { sqlIndexer } = useMudContext();

  if (!sqlIndexer) {
    return (
      <Box p={2} overflow="hidden">
        <Paper
          elevation={1}
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Loading tables
          </Typography>
          <LinearProgress />
        </Paper>
      </Box>
    );
  }

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/explore/*" element={<Explore />} />
      <Route path="/dev" element={<Dev />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default Routing;
