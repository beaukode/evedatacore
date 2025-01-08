import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";

interface DisplayTableProps {
  name?: string;
  id?: string;
}

const DisplayTable: React.FC<DisplayTableProps> = ({ name, id }) => {
  if (!id) return null;

  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/tables/${id}`}
    >
      {name}
    </Button>
  );
};

export default DisplayTable;
