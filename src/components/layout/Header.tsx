import React from "react";
import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import { NavLink, useLocation } from "react-router";
import ExploreDataIcon from "@mui/icons-material/TravelExplore";
import CalculateIcon from "@mui/icons-material/Calculate";
import AboutIcon from "@mui/icons-material/HelpCenter";
import DiscordIcon from "@/components/icons/Discord";
import Menu from "@/components/layout/Menu";
import HeaderLogo from "@/components/layout/HeaderLogo";
import DevIcon from "@mui/icons-material/Code";
import { ConnectButton } from "@/components/web3/ConnectButton";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AppBar position="static">
        <Toolbar
          color="secondary"
          sx={{ flexDirection: { xs: "row-reverse", md: "row" } }}
        >
          <Menu />
          <Box
            sx={{
              flexGrow: { xs: 1, md: 0 },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <HeaderLogo />
          </Box>
          <Box sx={{ flexGrow: 1, ml: 2, display: { xs: "none", md: "flex" } }}>
            <Button
              startIcon={<ExploreDataIcon />}
              to="/explore/characters"
              component={NavLink}
              sx={{ m: 1, fontFamily: "Major Mono Display" }}
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
              sx={{ m: 1, fontFamily: "Major Mono Display" }}
              variant={
                location.pathname.startsWith("/calculate")
                  ? "outlined"
                  : "contained"
              }
            >
              Calculate
            </Button>
            <Button
              startIcon={<DevIcon />}
              to="/dev/web3"
              component={NavLink}
              sx={{ m: 1, fontFamily: "Major Mono Display" }}
              variant={
                location.pathname.startsWith("/dev") ? "outlined" : "contained"
              }
            >
              Dev
            </Button>
            <IconButton
              color="primary"
              title="Discord"
              aria-label="Discord"
              href="https://discord.gg/cu2n3wjqgb"
              rel="noopener"
              target="_blank"
            >
              <DiscordIcon fontSize="large" />
            </IconButton>
            <IconButton
              color="primary"
              component={NavLink}
              title="About"
              aria-label="About"
              to="/about"
              sx={{ ml: 1 }}
            >
              <AboutIcon fontSize="large" />
            </IconButton>
          </Box>
          <Box>
            <ConnectButton />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
