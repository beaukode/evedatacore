import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface BaseItem {
  namespaceId?: string;
  namespace?: string;
}

interface SelectNamespaceProps<T extends BaseItem> {
  value: string;
  items?: T[];
  onChange: (value: string) => void;
  filter?: (item: T) => boolean;
}

const SelectNamespace = <T extends BaseItem>({
  value,
  items,
  onChange,
  filter,
}: SelectNamespaceProps<T>): React.ReactElement | null => {
  const namespaces = React.useMemo(() => {
    if (!items) return;
    const namespaces = items.reduce(
      (acc, t) => {
        const { namespaceId, namespace } = t;
        if (namespaceId && namespace && !acc[namespaceId] && filter?.(t)) {
          acc[namespaceId] = namespace;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const sorted = Object.entries(namespaces).sort(([, a], [, b]) =>
      (a || "").localeCompare(b || "")
    );

    return new Map(sorted);
  }, [items, filter]);

  if (!namespaces) return null;

  return (
    <FormControl variant="standard" sx={{ width: 160, mx: 2 }}>
      <InputLabel id="select-namespace-label">Namespace</InputLabel>
      <Select
        labelId="select-namespace-label"
        id="select-namespace"
        value={value}
        variant="standard"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        label="Namespace"
        fullWidth
      >
        <MenuItem value="0">All</MenuItem>
        {[...namespaces.entries()].map(([id, name]) => (
          <MenuItem value={id} key={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(SelectNamespace) as <T extends BaseItem>(
  props: SelectNamespaceProps<T>
) => React.ReactElement | null;
