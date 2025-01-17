import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";

interface ButtonNamespaceProps {
  name: string;
  id: string;
}

const ButtonNamespace: React.FC<ButtonNamespaceProps> = ({ name, id }) => {
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/namespaces/${id}`}
    >
      {name}
    </Button>
  );
};

export default ButtonNamespace;
