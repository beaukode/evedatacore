import React from "react";
import { Button } from "@mui/material";
import { shorten } from "@/tools";
import { NavLink } from "react-router";

interface ButtonAssemblyProps {
  name?: string;
  id?: string;
}

const ButtonAssembly: React.FC<ButtonAssemblyProps> = ({ name, id }) => {
  if (!id) return null;
  const label = name || shorten(id);

  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/assemblies/${id}`}
    >
      {label}
    </Button>
  );
};

export default ButtonAssembly;
