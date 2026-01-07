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
import {
  mapActions,
  mapSelectors,
  useMapDispatch,
  useMapSelector,
} from "../state";
import PointsOfInterestField from "./PointsOfInterestField";
import { useSystemDataCopy } from "../hooks/useSystemDataCopy";
import SaveIcon from "./SaveIcon";
import Panel from "./Panel";

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
  const systemDataCopy = useSystemDataCopy();
  const dispatch = useMapDispatch();
  const selectedNode = useMapSelector(mapSelectors.selectSelectedNode);
  const nodeAttributes = useMapSelector((s) =>
    selectedNode
      ? mapSelectors.selectNodeAttributes(s, selectedNode)
      : undefined
  );
  const nodeRecord = useMapSelector(mapSelectors.selectSelectedNodeRecord);
  const nodeDirty = useMapSelector(mapSelectors.selectSelectedNodeDirty);

  const handleColorChange = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      dispatch(
        mapActions.updateSelectedNodeRecord({
          color: event.target.value,
        })
      );
    },
    [dispatch]
  );

  const handleNotesChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        mapActions.updateSelectedNodeRecord({
          notes: event.target.value,
        })
      );
    },
    [dispatch]
  );

  const handleContentChange = React.useCallback(
    (value: string[]) => {
      dispatch(mapActions.updateSelectedNodeRecord({ content: value }));
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
              await systemDataCopy.copy(nodeRecord);
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
      <PointsOfInterestField
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
