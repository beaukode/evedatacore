import React from "react";
import { SxProps, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  SNMActions,
  useSNMSelector,
  SNMSelectors,
  useSNMDispatch,
} from "./Store";

interface SystemsMapSearchFieldProps {
  sx?: SxProps;
}

const SystemsMapSearchField: React.FC<SystemsMapSearchFieldProps> = ({
  sx,
}) => {
  const search = useSNMSelector(SNMSelectors.selectSearch);
  const dispatch = useSNMDispatch();

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
        dispatch(SNMActions.setSearch(e.target.value));
      }}
    />
  );
};

export default SystemsMapSearchField;
