import React from "react";
import { Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { NoMaxWidthTooltip } from "./ui/NoMaxWidthTooltip";
import { useAppContext } from "../contexts/AppContext";

interface DisplaySolarsystemProps {
  solarSystemId?: string | number;
}

const DisplaySolarsystem: React.FC<DisplaySolarsystemProps> = ({
  solarSystemId,
}) => {
  const { solarSystems } = useAppContext();

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

  const solarSystem = solarSystems[id];
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
      <Typography
        variant="body1"
        sx={{ textTransform: "lowercase" }}
        component="span"
      >
        {solarSystem.solarSystemName}
      </Typography>
    </NoMaxWidthTooltip>
  );
};

export default DisplaySolarsystem;
