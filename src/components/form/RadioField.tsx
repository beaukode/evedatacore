import React from "react";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";

interface RadioFieldProps {
  label: string;
  value?: string;
  disabled: boolean;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const RadioField: React.FC<RadioFieldProps> = ({
  label,
  value,
  disabled,
  options,
  onChange,
}) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioField;
