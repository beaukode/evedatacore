import React from "react";
import { Box } from "@mui/material";
import { Control } from "react-hook-form";
import { CheckboxElement } from "react-hook-form-mui";
import { AbiTypeDetails } from "@/tools";

interface BooleanFieldProps
  extends React.ComponentProps<typeof CheckboxElement> {
  abiType: AbiTypeDetails;
  error: boolean;
  control: Control;
  name: string;
}

const BooleanField: React.FC<BooleanFieldProps> = ({
  control,
  name,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abiType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  ...rest
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <CheckboxElement
        labelProps={{
          labelPlacement: "end",
        }}
        {...rest}
        name={name}
        control={control}
      />
    </Box>
  );
};

export default BooleanField;
