import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonNamespaceProps {
  name?: string;
  id?: string;
  fastRender?: boolean;
}

const ButtonNamespace: React.FC<ButtonNamespaceProps> = ({
  name,
  id,
  fastRender,
}) => {
  if (!(id && name)) return null;
  if (fastRender) {
    return (
      <LooksOutlinedButton sx={{ justifyContent: "flex-start" }}>
        {name.trim() ? <>{name}</> : <>(unamed)</>}
      </LooksOutlinedButton>
    );
  }
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/namespaces/${id}`}
      variant="outlined"
    >
      {name.trim() ? <>{name}</> : <>(unamed)</>}
    </Button>
  );
};

export default ButtonNamespace;
