import React from "react";
import { Box, Button, IconButton, Skeleton } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import { NavLink } from "react-router";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonSolarsystemProps {
  solarSystemId?: string | number;
  fastRender?: boolean;
  showMapLink?: boolean;
}

const ButtonSolarsystem: React.FC<ButtonSolarsystemProps> = ({
  solarSystemId,
  fastRender,
  showMapLink = false,
}) => {
  const solarSystems = useSolarSystemsIndex();

  if (solarSystemId === undefined) return null;
  if (!solarSystems) return <Skeleton width={80} />;

  const solarSystem = solarSystems.getById(solarSystemId.toString());
  if (!solarSystem) return null;

  if (fastRender) {
    return (
      <LooksOutlinedButton>{solarSystem.solarSystemName}</LooksOutlinedButton>
    );
  }

  const button = (
    <Button
      sx={{ justifyContent: "flex-start" }}
      component={NavLink}
      to={`/explore/solarsystems/${solarSystem.solarSystemId}`}
      variant="outlined"
    >
      {solarSystem.solarSystemName}
    </Button>
  );

  if (!showMapLink) {
    return button;
  }
  return (
    <Box display="flex" gap={1}>
      <Button
        sx={{ justifyContent: "flex-start" }}
        component={NavLink}
        to={`/explore/solarsystems/${solarSystem.solarSystemId}`}
        variant="outlined"
      >
        {solarSystem.solarSystemName}
      </Button>
      <IconButton
        color="primary"
        size="small"
        component={NavLink}
        to={`/explore/solarsystems/${solarSystem.solarSystemId}/map`}
      >
        <MapIcon />
      </IconButton>
    </Box>
  );
};

export default ButtonSolarsystem;
