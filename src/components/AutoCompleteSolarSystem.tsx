import React from "react";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import { Autocomplete, TextField } from "@mui/material";

interface AutoCompleteSolarSystemProps
  extends Omit<
    React.ComponentProps<typeof Autocomplete>,
    "onChange" | "renderInput" | "options"
  > {
  label: string;
  value: SolarSystemValue | null;
  error?: string;
  onChange: (value: SolarSystemValue | null) => void;
}

export type SolarSystemValue = {
  label: string;
  id: number;
};

const AutoCompleteSolarSystem = React.forwardRef<
  unknown,
  AutoCompleteSolarSystemProps
>(({ label, value, onChange, error, ...rest }, ref) => {
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
