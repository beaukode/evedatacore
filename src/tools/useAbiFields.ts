import React from "react";
import { z } from "zod";
import { AbiType } from "@latticexyz/config";
import BooleanField from "@/components/form/BooleanField";
import HexField from "@/components/form/HexField";
import IntegerField from "@/components/form/IntegerField";
import { abiTypeZodSchema } from "./abi/abiTypeZodSchema";
import { AbiTypeDetails, BaseAbiType, parseAbiType } from "./abi";
import { Hex } from "viem";

type Schema = Record<string, { type: AbiType }>;

function recordValueToFormValue(
  abiType: AbiTypeDetails,
  value: string | undefined
): string | boolean {
  if (abiType.isArray) {
    return value || "";
  } else if (abiType.baseType === "bool") {
    return value === "true";
  } else if (["address", "bytes"].includes(abiType.baseType)) {
    if (value && value.startsWith("0x")) {
      return value.substring(2);
    }
    return value || "";
  } else {
    return value || "";
  }
}

const formComponentsMap: Record<
  BaseAbiType,
  typeof IntegerField | typeof HexField | typeof BooleanField
> = {
  uint: IntegerField,
  int: IntegerField,
  bool: BooleanField,
  address: HexField,
  bytes: HexField,
  string: IntegerField,
};

export type AbiField = {
  key: string;
  type: AbiType;
  label: string;
  abiType: AbiTypeDetails;
  validationSchema: z.ZodSchema;
  defaultValue: string | boolean;
  initialValue: string | boolean;
  FormComponent: typeof IntegerField | typeof HexField | typeof BooleanField;
};

type UseAbiFieldsResult<
  schema extends Schema,
  values extends Record<string, string>,
> = {
  fields: AbiField[];
  validationSchema: z.ZodObject<Record<keyof schema, z.ZodSchema>>;
  defaultValues: Record<keyof schema, string | boolean>;
  initialValues: Record<keyof values, string | boolean>;
  recordValuesToFormValues: (
    values: Record<
      keyof schema,
      | string
      | bigint
      | number
      | boolean
      | Hex
      | readonly number[]
      | readonly bigint[]
      | readonly Hex[]
      | readonly boolean[]
    >
  ) => Record<keyof schema, string | boolean>;
};

const useAbiFields = <T extends Schema, V extends Record<string, string>>(
  schema: T,
  values: V
): UseAbiFieldsResult<T, V> => {
  const {
    fields,
    validationSchema,
    defaultValues,
    initialValues,
    recordValuesToFormValues,
  } = React.useMemo(() => {
    const fields: AbiField[] = [];
    const validationShape: z.ZodRawShape = {};
    const defaultValues: Record<string, string | boolean> = {};
    const initialValues: Record<string, string | boolean> = {};

    for (const [key, { type }] of Object.entries(schema)) {
      const typeDetails = parseAbiType(type);
      const field = {
        key,
        type,
        label: `${key} (${type})`,
        abiType: typeDetails,
        validationSchema: abiTypeZodSchema(typeDetails),
        defaultValue: typeDetails.baseType === "bool" ? false : "",
        initialValue: recordValueToFormValue(typeDetails, values[key]),
        FormComponent: formComponentsMap[typeDetails.baseType],
      };

      fields.push(field);

      validationShape[key] = field.validationSchema;
      defaultValues[key] = field.defaultValue;
      initialValues[key] = field.initialValue;
    }

    function recordValuesToFormValues(
      values: Record<keyof T, string | bigint | number>
    ): Record<keyof T, string | boolean> {
      return Object.values(fields).reduce(
        (acc, { key, abiType, defaultValue }) => {
          return {
            ...acc,
            [key]:
              values[key] === undefined
                ? defaultValue
                : recordValueToFormValue(abiType, values[key].toString()),
          };
        },
        {} as Record<keyof T, string | boolean>
      );
    }

    const validationSchema = z.object(validationShape);

    return {
      fields,
      validationSchema,
      defaultValues,
      initialValues,
      recordValuesToFormValues,
    };
  }, [schema, values]);

  return {
    fields,
    validationSchema,
    defaultValues,
    initialValues,
    recordValuesToFormValues,
  } as UseAbiFieldsResult<T, V>;
};

export default useAbiFields;
