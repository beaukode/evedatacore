import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router";

interface MenuItemProps {
  to: string;
  text: string;
  icon: React.ReactNode;
  external?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, text, icon, external }) => {
  const commonProps = external
    ? {
        component: "a" as const,
        href: to,
        rel: "noopener",
        target: "_blank",
      }
    : {
        component: NavLink,
        to,
      };

  return (
    <ListItem {...commonProps} sx={{ color: "inherit" }} disablePadding>
      <ListItemButton>
        <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default MenuItem;
