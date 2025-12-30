import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import SelectIcon from "@mui/icons-material/AdsClick";
import RoutingIcon from "@mui/icons-material/Route";
import {
  SNMActions,
  SNMSelectors,
  useSNMDispatch,
  useSNMSelector,
} from "../Store";
import { ToolKey } from "../common";
import Panel from "./Panel";

const PanelDisplay: React.FC = () => {
  const dispatch = useSNMDispatch();
  const tool = useSNMSelector(SNMSelectors.selectTool);

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newTool: ToolKey | null
  ) => {
    if (newTool) {
      dispatch(SNMActions.setTool(newTool));
    }
  };

  return (
    <Panel title="Tool">
      <ToggleButtonGroup
        value={tool}
        onChange={handleChange}
        size="small"
        exclusive
      >
        <ToggleButton value="select" title="Select">
          <SelectIcon />
        </ToggleButton>
        <ToggleButton value="routing" title="Routing" disabled>
          <RoutingIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Panel>
  );
};

export default PanelDisplay;
