import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";

interface DisplaySystemProps {
  name?: string;
  id?: string;
}

const DisplaySystem: React.FC<DisplaySystemProps> = ({ name, id }) => {
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

export default DisplaySystem;
