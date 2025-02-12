import React from "react";
import { TextField } from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { AbiTypeDetails } from "@/tools/abi";

interface IntegerFieldProps extends React.ComponentProps<typeof TextField> {
  abiType: AbiTypeDetails;
  control: Control;
  name: string;
}

function transformValue(value: string, signed: boolean = false): string | null {
  let r = value.replace(/[^0-9]/g, "");

  if (r !== "0") {
    r = r.replace(/^0+/, "");
  }

  if (signed && value.startsWith("-")) {
    r = "-" + r;
  }
  return r;
}

const IntegerField: React.FC<IntegerFieldProps> = ({
  control,
  name,
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
            onChange={(e) =>
              field.onChange(
                transformValue(e.target.value, abiType.baseType === "int")
              )
            }
            {...rest}
          />
        );
      }}
    />
  );
};

export default IntegerField;
