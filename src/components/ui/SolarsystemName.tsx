import React from "react";
import { Skeleton } from "@mui/material";
import { useSolarSystemsIndex } from "@/contexts/AppContext";

interface ButtonSolarsystemProps {
  solarSystemId?: string | number;
  inline?: boolean;
}

const SolarsystemName: React.FC<ButtonSolarsystemProps> = ({
  solarSystemId,
  inline = false,
}) => {
  const solarSystems = useSolarSystemsIndex();

  if (solarSystemId === undefined) return null;
  if (!solarSystems)
    return (
      <Skeleton sx={{ display: inline ? "inline-block" : "block" }} width={80} />
    );

  const solarSystem = solarSystems.getById(solarSystemId.toString());
  if (!solarSystem) return null;

  return solarSystem.name;
};

export default SolarsystemName;
