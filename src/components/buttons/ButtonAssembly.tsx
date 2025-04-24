import React from "react";
import { Button } from "@mui/material";
import { shorten } from "@/tools";
import { NavLink } from "react-router";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonAssemblyProps {
  name?: string;
  id?: string;
  fastRender?: boolean;
  sx?:
    | React.ComponentProps<typeof LooksOutlinedButton>["sx"]
    | React.ComponentProps<typeof Button>["sx"];
  to?: string;
}

const ButtonAssembly: React.FC<ButtonAssemblyProps> = ({
  name,
  id,
  fastRender,
  sx,
  to,
}) => {
  if (!id) return null;
  const label = name || shorten(id);
  if (fastRender) {
    return <LooksOutlinedButton sx={sx}>{label}</LooksOutlinedButton>;
  }
  to = to || `/explore/assemblies/${id}`;
  return (
    <Button component={NavLink} to={to} sx={sx} variant="outlined">
      {label}
    </Button>
  );
};

export default ButtonAssembly;
