import React from "react";
import { Chip } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";

interface DisplayTableFieldsChipsProps {
  table: {
    schema: Record<string, { type: string; internalType: string }>;
    key: string[];
  };
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
