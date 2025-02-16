import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonCorporationProps {
  name?: string;
  id?: string;
  fastRender?: boolean;
}

const ButtonCorporation: React.FC<ButtonCorporationProps> = ({
  name,
  id,
  fastRender,
}) => {
  if (!id) return null;
  if (fastRender) {
    return <LooksOutlinedButton>{name}</LooksOutlinedButton>;
  }
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/corporations/${id}`}
      variant="outlined"
    >
      {name}
    </Button>
  );
};

export default ButtonCorporation;
