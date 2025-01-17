import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { SolarSystemsIndex } from "@/tools/solarSystemsIndex";

interface AutoCompleteSolarSystemProps
  extends Omit<
    React.ComponentProps<typeof Autocomplete>,
    "onChange" | "renderInput" | "options"
  > {
  label: string;
  value: SolarSystemValue | null;
  error?: string;
  onChange: (value: SolarSystemValue | null) => void;
  solarSystemsIndex: SolarSystemsIndex;
}

export type SolarSystemValue = {
  label: string;
  id: number;
};

const AutoCompleteSolarSystem = React.forwardRef<
  unknown,
  AutoCompleteSolarSystemProps
>(({ label, value, onChange, error, solarSystemsIndex, ...rest }, ref) => {
  const [inputValue, setInputValue] = React.useState<string>("");

  const options: Array<SolarSystemValue | null> = React.useMemo(() => {
    if (inputValue.length < 1) return [];
    return solarSystemsIndex
      .searchByName(inputValue)
      .slice(0, 50)
      .map((ss) => ({ label: ss.solarSystemName, id: ss.solarSystemId }));
  }, [solarSystemsIndex, inputValue]);

  return (
    <Autocomplete
      value={value || null}
      noOptionsText={
        inputValue.length === 0 ? "Type to search" : "No solar system found"
      }
      options={options}
      onChange={(_, newValue) => {
        onChange(newValue as SolarSystemValue | null);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          inputRef={ref}
          {...params}
          error={!!error}
          helperText={error}
          label={label}
          slotProps={{
            inputLabel: { shrink: value === null ? undefined : true },
          }}
        />
      )}
      {...rest}
    />
  );
});

export default AutoCompleteSolarSystem;
