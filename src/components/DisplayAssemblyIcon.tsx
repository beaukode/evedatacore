import React from "react";
import { SvgIcon, SvgIconOwnProps, Tooltip } from "@mui/material";
import SmartGateIcon from "@mui/icons-material/Share";
import SmartStorateIcon from "@mui/icons-material/Warehouse";
import SmartTurretIcon from "@mui/icons-material/Security";
import SmartNetworkNodeIcon from "@mui/icons-material/Hub";
import SmartHangarIcon from "@mui/icons-material/Garage";
import SmartManufacturerIcon from "@mui/icons-material/Factory";
import { AssemblyType } from "@shared/mudsql/types";
import {
  smartAssembliesTypes,
  SmartAssemblyState,
  smartAssemblyStates,
  SmartAssemblyType,
} from "@/constants";

const iconMap: Record<keyof typeof smartAssembliesTypes, typeof SvgIcon> = {
  [AssemblyType.Gate]: SmartGateIcon,
  [AssemblyType.Turret]: SmartTurretIcon,
  [AssemblyType.Storage]: SmartStorateIcon,
  [AssemblyType.NetworkNode]: SmartNetworkNodeIcon,
  [AssemblyType.Hangar]: SmartHangarIcon,
  [AssemblyType.Manufacturer]: SmartManufacturerIcon,
};

const colorMap: Record<
  keyof typeof smartAssemblyStates,
  SvgIconOwnProps["color"]
> = {
  1: "disabled",
  2: "warning",
  3: "primary",
  4: "error",
};

interface DisplayAssemblyIconProps extends SvgIconOwnProps {
  typeId?: number;
  stateId?: number;
  tooltip?: boolean;
}

const DisplayAssemblyIcon: React.FC<DisplayAssemblyIconProps> = React.memo(
  ({ typeId, stateId, tooltip, ...rest }) => {
    if (!(typeId && stateId)) return null;
    const Icon = typeId ? iconMap[typeId as SmartAssemblyType] : undefined;
    const color = stateId ? colorMap[stateId as SmartAssemblyState] : undefined;

    if (!Icon) return null;

    if (!tooltip) return <Icon color={color} {...rest} />;

    const title = ` ${smartAssemblyStates[stateId as SmartAssemblyState]} - ${smartAssembliesTypes[typeId as SmartAssemblyType]}`;
    return (
      <Tooltip title={title} placement="right" arrow>
        <Icon color={color} {...rest} />
      </Tooltip>
    );
  }
);

export default DisplayAssemblyIcon;
