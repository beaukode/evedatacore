import React from "react";
import { Typography } from "@mui/material";
import { NoMaxWidthTooltip } from "./ui/NoMaxWidthTooltip";

interface DisplayTypeProps {
  name?: string;
  typeId?: string | number;
}

const DisplayType: React.FC<DisplayTypeProps> = ({ name, typeId }) => {
  if (!name) return null;
  if (!typeId) return name;
  return (
    <NoMaxWidthTooltip disableFocusListener title={`Type Id: ${typeId}`}>
      <Typography variant="body1" component="span">
        {name}
      </Typography>
    </NoMaxWidthTooltip>
  );
};

export default DisplayType;
