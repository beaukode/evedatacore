import React from "react";
import { Button, Skeleton } from "@mui/material";
import { NavLink } from "react-router";
import { useSolarSystemsIndex } from "@/contexts/AppContext";

interface DisplaySolarsystemProps {
  solarSystemId?: string | number;
}

const DisplaySolarsystem: React.FC<DisplaySolarsystemProps> = ({
  solarSystemId,
}) => {
  const solarSystems = useSolarSystemsIndex();

  if (solarSystemId === undefined) return null;
  if (!solarSystems) return <Skeleton width={80} />;

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
