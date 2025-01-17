import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";

interface ButtonCharacterProps {
  name?: string;
  address?: string;
}

const ButtonCharacter: React.FC<ButtonCharacterProps> = ({ name, address }) => {
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

export default ButtonCharacter;
