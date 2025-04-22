import React from "react";
import { Skeleton } from "@mui/material";
import { useSolarSystemsIndex } from "@/contexts/AppContext";

interface ButtonSolarsystemProps {
  solarSystemId?: string | number;
}

const SolarsystemName: React.FC<ButtonSolarsystemProps> = ({
  solarSystemId,
}) => {
  const solarSystems = useSolarSystemsIndex();

  if (solarSystemId === undefined) return null;
  if (!solarSystems) return <Skeleton width={80} />;

  const solarSystem = solarSystems.getById(solarSystemId.toString());
  if (!solarSystem) return null;

  return solarSystem.solarSystemName;
};

export default SolarsystemName;
