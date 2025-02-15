import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { AbiTypeDetails } from "@/tools/abi";

interface HexFieldProps extends React.ComponentProps<typeof TextField> {
  abiType: AbiTypeDetails;
  control: Control;
  name: string;
}

function transformValue(value: string): string | null {
  let r = value.trim().toLowerCase();
  if (r.startsWith("0x")) {
    r = r.substring(2);
  }
  r = r.replace(/[^0-9a-f]/g, "");

  return r;
}

const HexField: React.FC<HexFieldProps> = ({
  control,
  name,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abiType,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <TextField
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    0x
                  </InputAdornment>
                ),
              },
            }}
            fullWidth
            {...rest}
            {...field}
            onChange={(e) => field.onChange(transformValue(e.target.value))}
          />
        );
      }}
    />
  );
};

export default HexField;
