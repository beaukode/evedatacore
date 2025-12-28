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
  const nodeRecord = useSNMSelector(SNMSelectors.selectSelectedNodeRecord);
  const nodeDirty = useSNMSelector(SNMSelectors.selectSelectedNodeDirty);

  const handleColorChange = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      dispatch(
        SNMActions.updateSelectedNodeRecord({
          color: event.target.value,
        })
      );
    },
    [dispatch]
  );

  const handleNotesChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        SNMActions.updateSelectedNodeRecord({
          notes: event.target.value,
        })
      );
    },
    [dispatch]
  );

  if (!selectedNode || !nodeAttributes || !nodeRecord) {
    return null;
  }

  return (
    <Accordion elevation={4} expanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span">
          {nodeAttributes.name} {nodeDirty ? "*" : ""}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl sx={{ my: 1 }} fullWidth>
          <InputLabel id="color-label">Color</InputLabel>
          <Select
            labelId="color-label"
            label="Color"
            size="small"
            value={nodeRecord.color ?? "default"}
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
          value={nodeRecord.notes ?? ""}
          onChange={handleNotesChange}
          rows={5}
          multiline
          fullWidth
        />
        <Typography variant="caption" color="text.secondary">
          {new Date(nodeRecord.updatedAt).toLocaleString()}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default PanelSelectedSystem;
