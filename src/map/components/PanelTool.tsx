import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import SelectIcon from "@mui/icons-material/AdsClick";
import RoutingIcon from "@mui/icons-material/Route";
import {
  mapActions,
  mapSelectors,
  useMapDispatch,
  useMapSelector,
} from "../state";
import { ToolKey } from "../common";
import Panel from "./Panel";

const PanelDisplay: React.FC = () => {
  const dispatch = useMapDispatch();
  const tool = useMapSelector(mapSelectors.selectTool);

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newTool: ToolKey | null
  ) => {
    if (newTool) {
      dispatch(mapActions.setTool(newTool));
    }
  };

  return (
    <Panel title="Tool" containerSx={{ alignItems: "center" }}>
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
