import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonTableProps {
  name?: string;
  id?: string;
  fastRender?: boolean;
}

const ButtonTable: React.FC<ButtonTableProps> = ({ name, id, fastRender }) => {
  if (!id) return null;
  if (fastRender) {
    return <LooksOutlinedButton>{name}</LooksOutlinedButton>;
  }
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/tables/${id}`}
      variant="outlined"
    >
      {name}
    </Button>
  );
};

export default ButtonTable;
