import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import DistanceIcon from "@mui/icons-material/Straighten";
import LPointIcon from "@mui/icons-material/Hub";
import PlanetIcon from "@mui/icons-material/Public";
import {
  mapActions,
  mapSelectors,
  useMapDispatch,
  useMapSelector,
} from "../state";
import { MapDisplay } from "../common";
import Panel from "./Panel";

const PanelDisplay: React.FC = () => {
  const dispatch = useMapDispatch();
  const display = useMapSelector(mapSelectors.selectDisplay);

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newDisplay: MapDisplay | null
  ) => {
    if (newDisplay) {
      dispatch(mapActions.setDisplay(newDisplay));
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
