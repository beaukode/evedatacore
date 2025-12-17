import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ColorIcon from "@mui/icons-material/Square";
import {
  SNMActions,
  SNMSelectors,
  useSNMDispatch,
  useSNMSelector,
} from "../Store";
import { upperFirst } from "lodash-es";

const colors = {
  default: "primary",
  red: "red",
  blue: "blue",
  yellow: "yellow",
  purple: "purple",
  orange: "orange",
  pink: "pink",
  brown: "brown",
};

const PanelSelectedSystem: React.FC = () => {
  const dispatch = useSNMDispatch();
  const selectedNode = useSNMSelector(SNMSelectors.selectSelectedNode);
  const nodeAttributes = useSNMSelector((s) =>
    selectedNode
      ? SNMSelectors.selectNodeAttributes(s, selectedNode)
      : undefined
  );
  const dbRecord = useSNMSelector((s) =>
    selectedNode ? SNMSelectors.selectDbRecord(s, selectedNode) : undefined
  );

  const handleColorChange = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      if (!selectedNode) {
        return;
      }
      dispatch(
        SNMActions.dbUpdateSystem({
          id: selectedNode,
          prop: "color",
          value: event.target.value,
        })
      );
    },
    [dispatch, selectedNode]
  );

  if (!selectedNode || !nodeAttributes) {
    return null;
  }

  return (
    <Accordion elevation={4} expanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span">{nodeAttributes.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl sx={{ my: 1 }} fullWidth>
          <InputLabel id="color-label">Color</InputLabel>
          <Select
            labelId="color-label"
            label="Color"
            size="small"
            value={dbRecord?.color ?? "default"}
            onChange={handleColorChange}
            renderValue={(value) => {
              return (
                <ListItem disablePadding dense>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ColorIcon
                      fontSize="small"
                      color={value === "default" ? "primary" : undefined}
                      htmlColor={value}
                    />
                  </ListItemIcon>
                  <ListItemText>{upperFirst(value)}</ListItemText>
                </ListItem>
              );
            }}
            fullWidth
          >
            {Object.entries(colors).map(([key, value]) => (
              <MenuItem value={key} key={key}>
                <ListItemIcon>
                  <ColorIcon fontSize="small" htmlColor={value} />
                </ListItemIcon>
                <ListItemText>{upperFirst(key)}</ListItemText>
              </MenuItem>
            ))}
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
