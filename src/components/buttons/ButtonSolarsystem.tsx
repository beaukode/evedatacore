import React from "react";
import { Button, Skeleton } from "@mui/material";
import { NavLink } from "react-router";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonSolarsystemProps {
  solarSystemId?: string | number;
  fastRender?: boolean;
}

const ButtonSolarsystem: React.FC<ButtonSolarsystemProps> = ({
  solarSystemId,
  fastRender,
}) => {
  const solarSystems = useSolarSystemsIndex();

  if (solarSystemId === undefined) return null;
  if (!solarSystems) return <Skeleton width={80} />;

  const solarSystem = solarSystems.getById(solarSystemId.toString());
  if (!solarSystem) return null;

  if (fastRender) {
    return (
      <LooksOutlinedButton> {solarSystem.solarSystemName}</LooksOutlinedButton>
    );
  }
  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/solarsystems/${solarSystem.solarSystemId}`}
      variant="outlined"
    >
      {solarSystem.solarSystemName}
    </Button>
  );
};

export default ButtonSolarsystem;
