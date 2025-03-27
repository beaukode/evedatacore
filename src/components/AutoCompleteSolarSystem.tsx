import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { SolarSystemsIndex } from "@/tools/solarSystemsIndex";

interface AutoCompleteSolarSystemProps
  extends Omit<
    React.ComponentProps<typeof Autocomplete>,
    "onChange" | "renderInput" | "options"
  > {
  label: string;
  value: number | null;
  error?: string;
  onChange: (value: number | null) => void;
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

  const options: Array<SolarSystemValue> = React.useMemo(() => {
    if (inputValue.length < 1) return [];
    return solarSystemsIndex
      .searchByName(inputValue)
      .slice(0, 50)
      .map((ss) => ({ label: ss.solarSystemName, id: ss.solarSystemId }));
  }, [solarSystemsIndex, inputValue]);

  const currentValue = React.useMemo(() => {
    if (value === null) return null;
    const solarSystem = solarSystemsIndex.getById(value.toString());
    return {
      label: solarSystem?.solarSystemName ?? "Unknown",
      id: value,
    };
  }, [value, solarSystemsIndex]);

  return (
    <Autocomplete
      value={currentValue}
      noOptionsText={
        inputValue.length === 0 ? "Type to search" : "No solar system found"
      }
      options={options}
      onChange={(_, newValue) => {
        if (newValue === null) {
          onChange(null);
        } else {
          onChange((newValue as SolarSystemValue).id);
        }
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
