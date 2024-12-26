import React from "react";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { NoMaxWidthTooltip } from "./ui/NoMaxWidthTooltip";
import { useSolarSystemsIndex } from "../contexts/AppContext";
import { NavLink } from "react-router";

interface DisplaySolarsystemProps {
  solarSystemId?: string | number;
}

const DisplaySolarsystem: React.FC<DisplaySolarsystemProps> = ({
  solarSystemId,
}) => {
  const solarSystems = useSolarSystemsIndex();

  if (solarSystemId === undefined) return null;

  const id = `${solarSystemId}`;
  if (id === "0")
    return (
      <NoMaxWidthTooltip
        title={
          <>
            Data is not available on this page.
            <br />
            It may be available on the item details page.
          </>
        }
        placement="right"
        arrow
      >
        <InfoIcon color="secondary" />
      </NoMaxWidthTooltip>
    );

  const solarSystem = solarSystems.getById(id);
  if (!solarSystem) return null;

  const title = (
    <>
      Solar System Id: {solarSystem.solarSystemId}
      <br />
      X: {solarSystem.location?.x}
      <br />
      Y: {solarSystem.location?.y}
      <br />
      Z: {solarSystem.location?.z}
      <br />
    </>
  );
  return (
    <NoMaxWidthTooltip
      disableFocusListener
      title={title}
      placement="right"
      arrow
    >
      <Button
        sx={{ justifyContent: "flex-start" }}
        component={NavLink}
        to={`/explore/solarsystems/${solarSystem.solarSystemId}`}
      >
        {solarSystem.solarSystemName}
      </Button>
    </NoMaxWidthTooltip>
  );
};

export default DisplaySolarsystem;
