import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Item {
  account?: string;
  ownerName?: string;
}

interface SelectOwnerProps {
  value: string;
  onChange: (value: string) => void;
  items?: Item[];
}

const SelectOwner: React.FC<SelectOwnerProps> = ({
  value,
  onChange,
  items,
}) => {
  const owners = React.useMemo(() => {
    if (!items) return;
    const owners = items.reduce(
      (acc, t) => {
        if (t.account && !acc[t.account]) {
          acc[t.account] = t.ownerName || t.account;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const sorted = Object.entries(owners).sort(
      ([, a]: [string, string], [, b]: [string, string]) => {
        // Put unknwon owners at the end
        if (a.startsWith("0x") && !b.startsWith("0x")) {
          return 1;
        } else if (!a.startsWith("0x") && b.startsWith("0x")) {
          return -1;
        } else {
          return a.localeCompare(b);
        }
      }
    );

    return new Map(sorted);
  }, [items]);

  if (!owners) return null;

  return (
    <FormControl variant="standard" sx={{ width: 160, ml: 2 }}>
      <InputLabel id="select-owner-label">Owner</InputLabel>
      <Select
        labelId="select-owner-label"
        id="select-owner"
        value={value}
        variant="standard"
        onChange={(e) => onChange(e.target.value)}
        label="Owner"
        fullWidth
      >
        <MenuItem value="0">All</MenuItem>
        {[...owners.entries()].map(([id, name]) => (
          <MenuItem value={id} key={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(SelectOwner);
