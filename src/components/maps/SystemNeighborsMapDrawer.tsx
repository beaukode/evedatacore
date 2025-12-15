import React from "react";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SelectIcon from "@mui/icons-material/AdsClick";
import RoutingIcon from "@mui/icons-material/Route";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import DistanceIcon from "@mui/icons-material/Straighten";
import LPointIcon from "@mui/icons-material/Hub";
import PlanetIcon from "@mui/icons-material/Public";
import ColorIcon from "@mui/icons-material/Square";
import { DisplayKey, ToolKey } from "./common";

interface SystemNeighborsMapDrawerProps {
  display: DisplayKey;
  onDisplayChange: (display: DisplayKey) => void;
  tool: ToolKey;
  onToolChange: (tool: ToolKey) => void;
}

const SystemNeighborsMapDrawer: React.FC<SystemNeighborsMapDrawerProps> = ({
  tool,
  onToolChange,
  display,
  onDisplayChange,
}) => {
  const handleDisplayChange = (
    _: React.MouseEvent<HTMLElement>,
    newDisplay: DisplayKey | null
  ) => {
    if (newDisplay) {
      onDisplayChange(newDisplay);
    }
  };

  const handleToolChange = (
    _: React.MouseEvent<HTMLElement>,
    newTool: ToolKey | null
  ) => {
    if (newTool) {
      onToolChange(newTool);
    }
  };

  return (
    <>
      <Accordion elevation={4} expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">Display</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: "center" }}>
          <ToggleButtonGroup
            value={display}
            onChange={handleDisplayChange}
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
      <Accordion elevation={4} expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">Tool</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: "center" }}>
          <ToggleButtonGroup
            value={tool}
            onChange={handleToolChange}
            size="small"
            exclusive
          >
            <ToggleButton value="select" title="Select">
              <SelectIcon />
            </ToggleButton>
            <ToggleButton value="routing" title="Routing" disabled>
              <RoutingIcon />
            </ToggleButton>
            <ToggleButton value="wip" title="Work in progress" disabled>
              <QuestionMarkIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </AccordionDetails>
      </Accordion>
      <Accordion elevation={4} expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">EVD-S3G</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl sx={{ my: 1 }} fullWidth>
            <InputLabel id="color-label">Color</InputLabel>
            <Select
              labelId="color-label"
              label="Color"
              size="small"
              value="default"
              fullWidth
            >
              <MenuItem value="default">
                <ListItemIcon>
                  <ColorIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>Default</ListItemText>
              </MenuItem>
              <MenuItem value="red">
                <ListItemIcon>
                  <ColorIcon fontSize="small" htmlColor="red" />
                </ListItemIcon>
                <ListItemText>Red</ListItemText>
              </MenuItem>
              <MenuItem value="green">
                <ListItemIcon>
                  <ColorIcon fontSize="small" htmlColor="green" />
                </ListItemIcon>
                <ListItemText>Green</ListItemText>
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            label="Notes"
            multiline
            rows={5}
            fullWidth
          />
          <Typography variant="caption" color="text.secondary">
            2025-12-13 12:00
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default SystemNeighborsMapDrawer;
