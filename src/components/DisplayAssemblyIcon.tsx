import React from "react";
import { SvgIcon, SvgIconOwnProps, Tooltip } from "@mui/material";
import SmartGateIcon from "@mui/icons-material/Share";
import SmartStorateIcon from "@mui/icons-material/Warehouse";
import SmartTurretIcon from "@mui/icons-material/Security";

const iconMap: Record<number, typeof SvgIcon> = {
  84955: SmartGateIcon,
  84556: SmartTurretIcon,
  77917: SmartStorateIcon,
};

const colorMap: Record<number, SvgIconOwnProps["color"]> = {
  1: "disabled",
  2: "warning",
  3: "primary",
};

const typeMap: Record<number, string> = {
  84955: "Smart Gate",
  84556: "Smart Turret",
  77917: "Smart Storage Unit",
};

const stateMap: Record<number, string> = {
  1: "Unanchored",
  2: "Anchored",
  3: "Online",
};

interface DisplayAssemblyIconProps {
  typeId?: number;
  stateId?: number;
  tooltip?: boolean;
}

const DisplayAssemblyIcon: React.FC<DisplayAssemblyIconProps> = React.memo(
  ({ typeId, stateId, tooltip }) => {
    if (!(typeId && stateId)) return null;
    const Icon = typeId ? iconMap[typeId] : undefined;
    const color = stateId ? colorMap[stateId] : undefined;

    if (!Icon) return null;

    if (!tooltip) return <Icon color={color} />;

    const title = ` ${stateMap[stateId]} - ${typeMap[typeId]}`;
    return (
      <Tooltip title={title} placement="right" arrow>
        <Icon color={color} />
      </Tooltip>
    );
  }
);

export default DisplayAssemblyIcon;
