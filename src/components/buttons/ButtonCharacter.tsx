import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonCharacterProps {
  name?: string;
  address?: string;
  fastRender?: boolean;
}

const ButtonCharacter: React.FC<ButtonCharacterProps> = ({
  name,
  address,
  fastRender,
}) => {
  if (!name) return address;
  if (!address) return name;
  if (fastRender) {
    return (
      <LooksOutlinedButton sx={{ justifyContent: "flex-start" }}>
        {name}
      </LooksOutlinedButton>
    );
  }
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/characters/${address}`}
      variant="outlined"
    >
      {name}
    </Button>
  );
};

export default ButtonCharacter;
