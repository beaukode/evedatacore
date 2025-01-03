import { useSolarSystemsIndex } from "@/contexts/AppContext";
import { Autocomplete, TextField } from "@mui/material";
import React from "react";

interface AutoCompleteSolarSystemProps {
  label: string;
  value: SolarSystemValue | null;
  onChange: (value: SolarSystemValue | null) => void;
}

export type SolarSystemValue = {
  label: string;
  id: number;
};

const AutoCompleteSolarSystem: React.FC<AutoCompleteSolarSystemProps> = ({
  label,
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState<string>("");
  const ssIndex = useSolarSystemsIndex();

  const options: Array<SolarSystemValue | null> = React.useMemo(() => {
    if (inputValue.length < 1) return [];
    return ssIndex
      .searchByName(inputValue)
      .slice(0, 50)
      .map((ss) => ({ label: ss.solarSystemName, id: ss.solarSystemId }));
  }, [ssIndex, inputValue]);

  return (
    <Autocomplete
      sx={{ my: 2 }}
      value={value}
      noOptionsText={
        inputValue.length === 0 ? "Type to search" : "No solar system found"
      }
      options={options}
      filterOptions={(x) => x}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          slotProps={{
            inputLabel: { shrink: value === null ? undefined : true },
          }}
        />
      )}
      fullWidth
    />
  );
};

export default AutoCompleteSolarSystem;
