import React from "react";
import { Button } from "@mui/material";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import { NavLink } from "react-router";

interface DisplaySolarsystemProps {
  solarSystemId?: string | number;
}

const DisplaySolarsystem: React.FC<DisplaySolarsystemProps> = ({
  solarSystemId,
}) => {
  const solarSystems = useSolarSystemsIndex();

  if (solarSystemId === undefined) return null;

  const solarSystem = solarSystems.getById(solarSystemId.toString());
  if (!solarSystem) return null;

  return (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/solarsystems/${solarSystem.solarSystemId}`}
    >
      {solarSystem.solarSystemName}
    </Button>
  );
};

export default DisplaySolarsystem;
