import React from "react";
import { SxProps, TextField, InputAdornment } from "@mui/material";
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
  const search = useMapSelector(mapSelectors.selectSearch);
  const dispatch = useMapDispatch();

  return (
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
      sx={sx}
      fullWidth
      onChange={(e) => {
        dispatch(mapActions.setSearch(e.target.value));
      }}
    />
  );
};

export default MapSearchField;
