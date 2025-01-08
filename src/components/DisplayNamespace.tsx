import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";

interface DisplayNamespaceProps {
  name: string;
  id: string;
}

const DisplayNamespace: React.FC<DisplayNamespaceProps> = ({ name, id }) => {
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

export default DisplayNamespace;
