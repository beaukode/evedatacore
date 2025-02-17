import React from "react";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Control, useFieldArray } from "react-hook-form";
import { AbiTypeDetails } from "@/tools/abi";
import IntegerField from "./IntegerField";
import HexField from "./HexField";
import BooleanField from "./BooleanField";
import StringField from "./StringField";
import Fieldset from "../ui/Fieldset";

type FormComponent =
  | typeof IntegerField
  | typeof HexField
  | typeof BooleanField
  | typeof StringField;

interface ArrayOfFieldsProps {
  abiType: AbiTypeDetails;
  control: Control;
  name: string;
  label: string;
  disabled?: boolean;
  formComponent: FormComponent;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const ArrayOfFields: React.FC<ArrayOfFieldsProps> = ({
  control,
  name,
  abiType,
  label,
  formComponent: FormComponent,
  disabled,
  onChange,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <Fieldset title={label}>
      {fields.map((field, index) => {
        const { error } = control.getFieldState(`${name}.${index}`);
        return (
          <Box key={field.id} display="flex" alignItems="center" gap={1}>
            <FormComponent
              key={field.id}
              error={!!error}
              label={`#${index + 1}`}
              helperText={error?.root?.message || error?.message}
              control={control}
              name={`${name}.${index}.value`}
              abiType={abiType}
              disabled={disabled}
              onChange={(e) => {
                onChange?.(e);
              }}
              margin="dense"
            />
            <IconButton
              title="Delete item"
              color="secondary"
              onClick={() => remove(index)}
              disabled={disabled}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          title="Add item"
          color="secondary"
          onClick={() => append({ value: "" })}
          disabled={disabled}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Fieldset>
  );
};

export default ArrayOfFields;
