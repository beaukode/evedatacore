import React from "react";
import { Helmet } from "react-helmet";
import { Paper, Typography, Button } from "@mui/material";
import ExploreDataIcon from "@mui/icons-material/TravelExplore";
import CalculateIcon from "@mui/icons-material/Calculate";
import { NavLink } from "react-router";

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>EVE:F tools</title>
      </Helmet>
      <Typography variant="h5" component="h1" sx={{ m: 2 }}>
        Hello Awaken,
      </Typography>
      <Paper elevation={1} sx={{ m: 2 }}>
        <Typography variant="h5" component="h2" sx={{ m: 2 }}>
          <ExploreDataIcon
            fontSize="large"
            sx={{ verticalAlign: "middle", mr: 2 }}
          />
          Explore
        </Typography>
        <Button
          component={NavLink}
          to="/explore/characters"
          sx={{ m: 2, py: 2, px: 4 }}
          variant="contained"
        >
          Characters
        </Button>
        <Button
          component={NavLink}
          to="/explore/assemblies"
          sx={{ m: 2, py: 2, px: 4 }}
          variant="contained"
        >
          Assemblies
        </Button>
        <Button
          component={NavLink}
          to="/explore/killmails"
          sx={{ m: 2, py: 2, px: 4 }}
          variant="contained"
        >
          Killmails
        </Button>
        <Button
          component={NavLink}
          to="/explore/types"
          sx={{ m: 2, py: 2, px: 4 }}
          variant="contained"
        >
          Types
        </Button>
        <Button
          component={NavLink}
          to="/explore/solarsystems"
          sx={{ m: 2, py: 2, px: 4 }}
          variant="contained"
        >
          Solar systems
        </Button>
        <Button
          component={NavLink}
          to="/explore/config"
          sx={{ m: 2, py: 2, px: 4 }}
          variant="contained"
        >
          Config
        </Button>
      </Paper>
      <Paper elevation={1} sx={{ m: 2 }}>
        <Typography variant="h5" component="h2" sx={{ m: 2 }}>
          <CalculateIcon
            fontSize="large"
            sx={{ verticalAlign: "middle", mr: 2 }}
          />
          Calculate
        </Typography>
        <Button
          component={NavLink}
          to="/calculate/route-planner"
          sx={{ m: 2, py: 2, px: 4 }}
          variant="contained"
        >
          Route planner
        </Button>
        <Button
          component={NavLink}
          to="/calculate/various-calculators"
          sx={{ m: 2, py: 2, px: 4 }}
          variant="contained"
        >
          Various calculators
        </Button>
      </Paper>
      <Button component={NavLink} to="/about" size="small" variant="text">
        About the website
      </Button>
    </>
  );
};

export default Home;
