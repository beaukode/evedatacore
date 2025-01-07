import React from "react";
import { Chip } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import { Table } from "@latticexyz/config";

interface DisplayTableFieldsChipsProps {
  table: Table;
}

const DisplayTableFieldsChips: React.FC<DisplayTableFieldsChipsProps> = ({
  table,
}) => {
  return (
    <>
      {Object.entries(table.schema).map(([k, { type }]) => (
        <Chip
          key={k}
          icon={table.key.includes(k) ? <KeyIcon /> : undefined}
          sx={{ m: 0.5, fontFamily: "monospace" }}
          color="secondary"
          label={`${k} (${type})`}
        />
      ))}
    </>
  );
};

export default DisplayTableFieldsChips;
