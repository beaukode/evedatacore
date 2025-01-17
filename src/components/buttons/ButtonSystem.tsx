import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";

interface ButtonSystemProps {
  name?: string;
  id?: string;
}

const ButtonSystem: React.FC<ButtonSystemProps> = ({ name, id }) => {
  if (!id) return null;

  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/systems/${id}`}
    >
      {name}
    </Button>
  );
};

export default ButtonSystem;
