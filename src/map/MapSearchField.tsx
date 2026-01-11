import React from "react";
import { SxProps, TextField, InputAdornment, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  mapActions,
  useMapSelector,
  mapSelectors,
  useMapDispatch,
} from "./state";

interface MapSearchFieldProps {
  sx?: SxProps;
}

const MapSearchField: React.FC<MapSearchFieldProps> = ({ sx }) => {
  const isReady = useMapSelector(mapSelectors.selectIsReady);
  const search = useMapSelector(mapSelectors.selectSearch);
  const dispatch = useMapDispatch();

  if (!isReady) {
    return null;
  }

  return (
    <Paper sx={sx}>
      <TextField
        variant="outlined"
        size="small"
        value={search}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="secondary" />
              </InputAdornment>
            ),
          },
        }}
        fullWidth
        onChange={(e) => {
          dispatch(mapActions.setSearch(e.target.value));
        }}
      />
    </Paper>
  );
};

export default MapSearchField;
