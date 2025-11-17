import React from "react";
import { Tooltip } from "@mui/material";
import { GetAssembliesTypeStateResponse } from "@/api/evedatacore-v2";
import { numberFormatter } from "@/constants";

type LPoint = GetAssembliesTypeStateResponse["items"][number]["lpoint"];

interface LPointLocationProps {
  lpoint: LPoint;
  fastRender?: boolean;
  showDistance?: boolean;
}

const LPointLocation: React.FC<LPointLocationProps> = ({
  lpoint,
  fastRender,
  showDistance,
}) => {
  if (!lpoint) return null;
  if (fastRender || showDistance === false) {
    return (
      <span>
        P{lpoint.planet}
        {lpoint.lpoint}
      </span>
    );
  }
  return (
    <Tooltip
      title={`Distance to L-Point: ~${numberFormatter.format(Number(lpoint.distance))} meters`}
    >
      <span style={{ cursor: "default" }}>
        P{lpoint.planet}
        {lpoint.lpoint}
      </span>
    </Tooltip>
  );
};

export default LPointLocation;
