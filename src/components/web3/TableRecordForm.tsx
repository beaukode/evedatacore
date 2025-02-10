import React from "react";
import { Button } from "@mui/material";
import { Table } from "@latticexyz/config";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AbiTypeDetails, analyzeAbiType } from "@/tools";
import IntegerField from "../form/IntegerField";
import { zodResolver } from "@hookform/resolvers/zod";
import HexField from "../form/HexField";
import BooleanField from "../form/BooleanField";

interface TableRecordFormProps {
  table: Table;
}

function bigintValidator(value: z.ZodString, min: bigint, max: bigint) {
  return value
    .transform((value) => {
      return BigInt(value);
    })
    .refine((value) => value >= min, {
      message: `Value must be greater than or equal to ${min}`,
    })
    .refine((value) => value <= max, {
      message: `Value must be lesser than or equal to ${max}`,
    });
}

function getValidationSchema(abiType: AbiTypeDetails): z.ZodTypeAny {
  if (abiType.isArray) {
    return z.array(getValidationSchema({ ...abiType, isArray: false }));
  }

  switch (abiType.baseType) {
    case "uint": {
      const max = 2n ** BigInt(abiType.length || 0) - 1n;
      return bigintValidator(
        z.string().min(1, { message: "Required" }),
        0n,
        max
      );
    }
    case "int": {
      const min = (-2n) ** BigInt(abiType.length ? abiType.length - 1 : 0);
      const max = 2n ** BigInt(abiType.length ? abiType.length - 1 : 0) - 1n;
      return bigintValidator(
        z.string().min(1, { message: "Required" }),
        min,
        max
      );
    }
    case "bool":
      return z.boolean();
    case "address":
      return z.string().length(40);
    case "bytes": {
      if (abiType.length) {
        return z
          .string()
          .length(abiType.length * 2)
          .transform((value) => `0x${value}`);
      }
      return z
        .string()
        .min(1, { message: "Required" })
        .transform((value) => `0x${value}`);
    }
    case "string":
      return z.string().default("");
  }
}

const componentsMap: Record<
  AbiTypeDetails["baseType"],
  typeof IntegerField | typeof HexField | typeof BooleanField
> = {
  uint: IntegerField,
  int: IntegerField,
  bool: BooleanField,
  address: HexField,
  bytes: HexField,
  string: IntegerField,
};

const defaultValues: Record<
  AbiTypeDetails["baseType"],
  string | boolean | unknown[]
> = {
  uint: "",
  int: "",
  bool: false,
  address: "",
  bytes: "",
  string: "",
};

const TableRecordForm: React.FC<TableRecordFormProps> = ({ table }) => {
  const fields = React.useMemo(() => {
    return Object.entries(table.schema).map(([key, { type }]) => {
      const typeDetails = analyzeAbiType(type);
      return {
        key,
        type,
        label: `${key} (${type})`,
        abiType: typeDetails,
        Component: componentsMap[typeDetails.baseType],
        defaultValue: defaultValues[typeDetails.baseType],
        validationSchema: getValidationSchema(typeDetails),
      };
    });
  }, [table]);

  const schema = z.object(
    fields.reduce((acc, { key, validationSchema }) => {
      return {
        ...acc,
        [key]: validationSchema,
      };
    }, {})
  );

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<Record<string, string>>({
    defaultValues: fields.reduce((acc, { key, defaultValue }) => {
      return {
        ...acc,
        [key]: defaultValue,
      };
    }, {}),
    resolver: zodResolver(schema),
  });

  const values = watch();

  React.useEffect(() => {
    console.log("values", values);
  }, [values]);

  React.useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  return (
    <form onSubmit={handleSubmit((v) => console.log("handleSubmit", v))}>
      {fields.map(({ key, label, abiType, Component }) => {
        if (abiType.isArray) {
          return <div>Array type not supported</div>;
        }
        return (
          <Component
            key={key}
            control={control}
            name={key}
            label={label}
            abiType={abiType}
            error={!!errors[key]}
            helperText={errors[key]?.message?.toString()}
            margin="dense"
          />
        );
      })}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default TableRecordForm;
