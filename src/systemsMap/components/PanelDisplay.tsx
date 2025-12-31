import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import DistanceIcon from "@mui/icons-material/Straighten";
import LPointIcon from "@mui/icons-material/Hub";
import PlanetIcon from "@mui/icons-material/Public";
import {
  SNMActions,
  SNMSelectors,
  useSNMDispatch,
  useSNMSelector,
} from "../Store";
import { DisplayKey } from "../common";
import Panel from "./Panel";

const PanelDisplay: React.FC = () => {
  const dispatch = useSNMDispatch();
  const display = useSNMSelector(SNMSelectors.selectDisplay);

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newDisplay: DisplayKey | null
  ) => {
    if (newDisplay) {
      dispatch(SNMActions.setDisplay(newDisplay));
    }
  };

  return (
    <Panel title="Display" containerSx={{ alignItems: "center" }}>
      <ToggleButtonGroup
        value={display}
        onChange={handleChange}
        size="small"
        exclusive
      >
        <ToggleButton value="distances" title="Distances">
          <DistanceIcon />
        </ToggleButton>
        <ToggleButton value="lpoints" title="L-Points">
          <LPointIcon />
        </ToggleButton>
        <ToggleButton value="planets" title="Planets">
          <PlanetIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Panel>
  );
};

export default PanelDisplay;
