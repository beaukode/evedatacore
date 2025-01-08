import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";

interface DisplayOwnerProps {
  name?: string;
  address?: string;
}

const DisplayOwner: React.FC<DisplayOwnerProps> = ({ name, address }) => {
  if (!name) return null;
  if (!address) return name;
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/characters/${address}`}
    >
      {name}
    </Button>
  );
};

export default DisplayOwner;
