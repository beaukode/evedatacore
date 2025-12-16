import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DistanceIcon from "@mui/icons-material/Straighten";
import LPointIcon from "@mui/icons-material/Hub";
import PlanetIcon from "@mui/icons-material/Public";
import {
  SNMActions,
  SNMSelectors,
  useSNMDispatch,
  useSNMSelector,
} from "../Store";
import { DisplayKey } from "../../common";

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
    <Accordion elevation={4} expanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span">Display</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ textAlign: "center" }}>
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
      </AccordionDetails>
    </Accordion>
  );
};

export default PanelDisplay;
