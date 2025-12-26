import React from "react";
import { Drawer, IconButton, List } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExploreDataIcon from "@mui/icons-material/TravelExplore";
import CalculateIcon from "@mui/icons-material/Calculate";
import DAppsIcon from "@mui/icons-material/Extension";
import DevIcon from "@mui/icons-material/Code";
import AboutIcon from "@mui/icons-material/HelpCenter";
import DiscordIcon from "@/components/icons/Discord";
import MenuItem from "./MenuItem";

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsOpen(open);
    };

  return (
    <>
      <IconButton
        sx={{ display: { xs: "inline-flex", md: "none" } }}
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <List
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <MenuItem
            to="/explore/characters"
            text="Explore"
            icon={<ExploreDataIcon />}
          />
          <MenuItem
            to="/calculate/route-planner"
            text="Calculate"
            icon={<CalculateIcon />}
          />
          <MenuItem to="/dapps-directory" text="DApps" icon={<DAppsIcon />} />
          <MenuItem to="/dev" text="Dev" icon={<DevIcon />} />
          <MenuItem
            to="https://discord.gg/Jv4B5dJpez"
            text="Discord"
            icon={<DiscordIcon />}
            external
          />
          <MenuItem to="/about" text="About" icon={<AboutIcon />} />
        </List>
      </Drawer>
    </>
  );
};

export default Menu;
