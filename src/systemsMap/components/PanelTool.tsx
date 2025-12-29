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
import SelectIcon from "@mui/icons-material/AdsClick";
import RoutingIcon from "@mui/icons-material/Route";
import {
  SNMActions,
  SNMSelectors,
  useSNMDispatch,
  useSNMSelector,
} from "../Store";
import { ToolKey } from "../common";

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
    <Accordion elevation={4} expanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span">Tool</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ textAlign: "center" }}>
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
      </AccordionDetails>
    </Accordion>
  );
};

export default PanelDisplay;
