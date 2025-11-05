import React from "react";
import { Badge, Box, SvgIcon, SvgIconOwnProps, Tooltip } from "@mui/material";
import SmartGateIcon from "@mui/icons-material/Share";
import SmartStorateIcon from "@mui/icons-material/Warehouse";
import SecurityIcon from "@mui/icons-material/Security";
import HubIcon from "@mui/icons-material/Hub";
import GarageIcon from "@mui/icons-material/Garage";
import FactoryIcon from "@mui/icons-material/Factory";
import RecyclingIcon from "@mui/icons-material/Recycling";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import FlightIcon from "@mui/icons-material/Flight";
import FenceIcon from "@mui/icons-material/Fence";
import CellTowerIcon from "@mui/icons-material/CellTower";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import {
  asmTypeLabel,
  AssemblyTypeId,
  SmartAssemblyState,
  smartAssemblyStates,
} from "@/constants";

const iconMap: Record<AssemblyTypeId, typeof SvgIcon> = {
  84556: SecurityIcon, // Smart Turret
  84955: SmartGateIcon, // Smart Gate
  88086: SmartGateIcon, // Small Gate
  87162: FactoryIcon, // Portable Printer
  87119: FactoryIcon, // Printer S
  88067: FactoryIcon, // Printer M
  87120: FactoryIcon, // Printer L
  87161: RecyclingIcon, // Portable Refinery
  88063: RecyclingIcon, // Refinery M
  88064: RecyclingIcon, // Refinery L
  88068: PrecisionManufacturingIcon, // Assembler
  88069: FlightIcon, // Shipyard S
  88070: FlightIcon, // Shipyard M
  88071: FlightIcon, // Shipyard L
  88092: HubIcon, // Network Node
  87160: GarageIcon, // Smart Hangar
  88093: GarageIcon, // Smart Hangar
  88094: GarageIcon, // Smart Hangar
  88098: TempleHinduIcon, // Totem 1
  88099: TempleHinduIcon, // Totem 2
  88100: FenceIcon, // Wall 1
  88101: FenceIcon, // Wall 2
  90184: CellTowerIcon, // Relay
  87566: SmartStorateIcon, // Portable Storage
  88082: SmartStorateIcon, // Smart Storage Unit S
  88083: SmartStorateIcon, // Smart Storage Unit M
  77917: SmartStorateIcon, // Smart Storage Unit L
};

const badgeMap: Record<AssemblyTypeId, string | undefined> = {
  84556: undefined, // Smart Turret
  84955: "L", // Smart Gate
  88086: "S", // Small Gate
  87162: "P", // Portable Printer
  87119: "S", // Printer S
  88067: "M", // Printer M
  87120: "L", // Printer L
  87161: "P", // Portable Refinery
  88063: "M", // Refinery M
  88064: "L", // Refinery L
  88068: undefined, // Assembler
  88069: "S", // Shipyard S
  88070: "M", // Shipyard M
  88071: "L", // Shipyard L
  88092: undefined, // Network Node
  87160: "R", // Refuge
  88093: "M", // Hangar M
  88094: "L", // Hangar L
  88098: "1", // Totem 1
  88099: "2", // Totem 2
  88100: "1", // Wall 1
  88101: "2", // Wall 2
  90184: undefined, // Relay
  87566: "P", // Portable Storage
  88082: "S", // Smart Storage Unit S
  88083: "M", // Smart Storage Unit M
  77917: "L", // Smart Storage Unit L
};

const colorMap: Record<keyof typeof smartAssemblyStates, string> = {
  1: "rgba(255, 255, 255, 0.3)",
  2: "rgb(255, 167, 38)",
  3: "primary",
  4: "rgb(255, 9, 34)",
};

interface DisplayAssemblyIconProps extends SvgIconOwnProps {
  typeId?: number;
  stateId?: number;
  tooltip?: boolean;
}

const DisplayAssemblyIcon: React.FC<DisplayAssemblyIconProps> = React.memo(
  ({ typeId, stateId, tooltip, ...rest }) => {
    if (!(typeId && stateId)) return null;
    const Icon = typeId ? iconMap[typeId as AssemblyTypeId] : undefined;
    const color = stateId ? colorMap[stateId as SmartAssemblyState] : undefined;

    if (!Icon) return null;

    const badgeContent = badgeMap[typeId as AssemblyTypeId];

    const icon = badgeContent ? (
      <Box paddingRight={1.5}>
        <Badge
          badgeContent={badgeContent}
          overlap="circular"
          color="primary"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: color,
            },
          }}
        >
          <Icon htmlColor={color} {...rest} />
        </Badge>
      </Box>
    ) : (
      <Box paddingRight={1.5}>
        <Icon htmlColor={color} {...rest} />
      </Box>
    );

    if (!tooltip) return icon;

    const title = `${smartAssemblyStates[stateId as SmartAssemblyState]} - ${asmTypeLabel[typeId as AssemblyTypeId]}`;

    return (
      <Tooltip title={title} placement="right" arrow>
        {icon}
      </Tooltip>
    );
  }
);

export default React.memo(DisplayAssemblyIcon);
