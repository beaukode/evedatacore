import {
  AppBar,
  Box,
  Button,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink, Route, Routes, useLocation } from "react-router";
import ExploreDataIcon from "@mui/icons-material/TravelExplore";
import CalculateIcon from "@mui/icons-material/Calculate";
import AboutIcon from "@mui/icons-material/HelpCenter";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import About from "./pages/About";
import Calculate from "./pages/Calculate";
import Dev from "./pages/Dev";

function App() {
  const location = useLocation();

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 0 }}>
        <AppBar position="static">
          <Toolbar color="secondary">
            <Typography
              variant="h6"
              component={NavLink}
              to="/"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              EVE Frontier tools
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Button
                startIcon={<ExploreDataIcon />}
                to="/explore/characters"
                component={NavLink}
                sx={{ m: 2 }}
                size="large"
                variant={
                  location.pathname.startsWith("/explore")
                    ? "outlined"
                    : "contained"
                }
              >
                Explore
              </Button>
              <Button
                startIcon={<CalculateIcon />}
                to="/calculate/route-planner"
                component={NavLink}
                size="large"
                sx={{ m: 2 }}
                variant={
                  location.pathname.startsWith("/calculate")
                    ? "outlined"
                    : "contained"
                }
              >
                Calculate
              </Button>
            </Box>
            <Box>
              <IconButton
                color="primary"
                component={NavLink}
                title="About"
                aria-label="About"
                to="/about"
              >
                <AboutIcon fontSize="large" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/explore/*" element={<Explore />} />
        <Route path="/calculate/*" element={<Calculate />} />
        <Route path="/dev" element={<Dev />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Paper>
  );
}

export default App;
