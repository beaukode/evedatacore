import React from "react";
import { Tooltip, TooltipProps } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

interface HintProps extends Omit<TooltipProps, "title" | "children"> {
  children: React.ReactNode;
}

const HintIcon: React.FC<HintProps> = ({ children, ...rest }) => {
  return (
    <Tooltip title={children} {...rest}>
      <HelpIcon />
    </Tooltip>
  );
};

export default HintIcon;
