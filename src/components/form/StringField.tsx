import React from "react";
import { TextField } from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { AbiTypeDetails } from "@/tools/abi";

interface StringFieldProps extends React.ComponentProps<typeof TextField> {
  abiType: AbiTypeDetails;
  control: Control;
  name: string;
}

const StringField: React.FC<StringFieldProps> = ({
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
            {...field}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            fullWidth
            rows={5}
            multiline
            {...rest}
          />
        );
      }}
    />
  );
};

export default StringField;
