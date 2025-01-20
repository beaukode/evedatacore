import React from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonGenericProps {
  to: string;
  children: React.ReactNode;
  fastRender?: boolean;
}

const ButtonGeneric: React.FC<ButtonGenericProps> = ({
  to,
  children,
  fastRender,
}) => {
  if (fastRender) {
    return (
      <LooksOutlinedButton sx={{ justifyContent: "flex-start" }}>
        {children}
      </LooksOutlinedButton>
    );
  }
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={to}
      variant="outlined"
    >
      {children}
    </Button>
  );
};

export default ButtonGeneric;
