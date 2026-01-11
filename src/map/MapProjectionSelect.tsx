import React from "react";
import {
  SxProps,
  InputAdornment,
  MenuItem,
  Select,
  Paper,
} from "@mui/material";
import ProjectionIcon from "@mui/icons-material/Videocam";
import {
  mapActions,
  useMapSelector,
  mapSelectors,
  useMapDispatch,
} from "./state";
import { MapProjection } from "./common";

interface MapProjectionSelectProps {
  sx?: SxProps;
}

const MapProjectionSelect: React.FC<MapProjectionSelectProps> = ({ sx }) => {
  const isReady = useMapSelector(mapSelectors.selectIsReady);
  const projection = useMapSelector(mapSelectors.selectProjection);
  const dispatch = useMapDispatch();

  if (!isReady) {
    return null;
  }

  return (
    <Paper sx={sx}>
      <Select
        value={projection}
        size="small"
        onChange={(e) => {
          dispatch(mapActions.setProjection(e.target.value as MapProjection));
        }}
        startAdornment={
          <InputAdornment position="start">
            <ProjectionIcon fontSize="small" color="secondary" />
          </InputAdornment>
        }
        fullWidth
      >
        <MenuItem value="flat">Flat</MenuItem>
        <MenuItem value="center">Center</MenuItem>
      </Select>
    </Paper>
  );
};

export default MapProjectionSelect;
