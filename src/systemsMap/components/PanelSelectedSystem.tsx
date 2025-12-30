import React from "react";
import {
  Box,
  FormControl,
  IconButton,
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
import ColorIcon from "@mui/icons-material/Square";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { upperFirst } from "lodash-es";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import {
  SNMActions,
  SNMSelectors,
  useSNMDispatch,
  useSNMSelector,
} from "../Store";
import SystemContentCheckboxGroup from "./SystemContentCheckboxGroup";
import SaveIcon from "./SaveIcon";
import Panel from "./Panel";
import { copySystemDataToClipboard } from "../common";

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
  const solarSystemsIndex = useSolarSystemsIndex();
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

  const handleContentChange = React.useCallback(
    (value: string[]) => {
      dispatch(SNMActions.updateSelectedNodeRecord({ content: value }));
    },
    [dispatch]
  );

  if (!selectedNode || !nodeAttributes || !nodeRecord) {
    return null;
  }

  return (
    <Panel
      title={nodeAttributes.name}
      titleAdornment={
        <Box display="flex" alignItems="center" gap={0.5}>
          {nodeDirty && <SaveIcon />}
          <IconButton
            color="primary"
            size="small"
            onClick={async () => {
              const name =
                solarSystemsIndex?.getById(selectedNode)?.solarSystemName ?? "";
              await copySystemDataToClipboard(name, nodeRecord);
            }}
          >
            <CopyIcon fontSize="small" />
          </IconButton>
        </Box>
      }
      sx={{ flexGrow: 1, flexShrink: 1, flexBasis: "100%" }}
    >
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
        rows={2}
        multiline
        fullWidth
      />
      <SystemContentCheckboxGroup
        value={nodeRecord.content ?? []}
        onChange={handleContentChange}
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 100,
          alignSelf: "stretch",
        }}
      />
      <Typography variant="caption" color="text.secondary">
        Last updated:{" "}
        {new Date(nodeRecord.updatedAt).toLocaleString(undefined, {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </Typography>
    </Panel>
  );
};

export default PanelSelectedSystem;
