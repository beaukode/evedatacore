import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ColorIcon from "@mui/icons-material/Square";
import { SNMSelectors, useSNMSelector } from "../Store";

const PanelSelectedSystem: React.FC = () => {
  const selectedNode = useSNMSelector(SNMSelectors.selectSelectedNode);
  if (!selectedNode) {
    return null;
  }

  return (
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
  );
};

export default PanelSelectedSystem;
