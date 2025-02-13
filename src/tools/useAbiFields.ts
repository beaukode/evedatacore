import React from "react";
import { z } from "zod";
import { AbiType } from "@latticexyz/config";
import BooleanField from "@/components/form/BooleanField";
import HexField from "@/components/form/HexField";
import IntegerField from "@/components/form/IntegerField";
import { abiTypeZodSchema } from "./abi/abiTypeZodSchema";
import {
  AbiTypeDetails,
  BaseAbiType,
  parseAbiType,
  TableRecordValues,
  TableValue,
} from "./abi";
import StringField from "@/components/form/StringField";

type Schema = Record<string, { type: AbiType }>;

function recordValueToFormValue(
  abiType: AbiTypeDetails,
  value: TableValue | undefined
): string | boolean {
  if (abiType.isArray) {
    return value?.toString() || "";
  } else if (abiType.baseType === "bool") {
    return value === "true";
  } else if (["address", "bytes"].includes(abiType.baseType)) {
    if (value && value.toString().startsWith("0x")) {
      return value.toString().substring(2);
    }
    return value?.toString() || "";
  } else {
    return value?.toString() || "";
  }
}

const formComponentsMap: Record<
  BaseAbiType,
  | typeof IntegerField
  | typeof HexField
  | typeof BooleanField
  | typeof StringField
> = {
  uint: IntegerField,
  int: IntegerField,
  bool: BooleanField,
  address: HexField,
  bytes: HexField,
  string: StringField,
};

export type AbiField = {
  key: string;
  type: AbiType;
  label: string;
  abiType: AbiTypeDetails;
  validationSchema: z.ZodSchema;
  defaultValue: string | boolean;
  initialValue: string | boolean;
  FormComponent:
    | typeof IntegerField
    | typeof HexField
    | typeof BooleanField
    | typeof StringField;
};

type UseAbiFieldsResult<
  schema extends Schema,
  values extends TableRecordValues<keyof schema>,
> = {
  fields: AbiField[];
  validationSchema: z.ZodObject<Record<keyof schema, z.ZodSchema>>;
  defaultValues: Record<keyof schema, string | boolean>;
  initialValues: Record<keyof values, string | boolean>;
  recordValuesToFormValues: (
    values: TableRecordValues<keyof schema>
  ) => Record<keyof schema, string | boolean>;
};

const useAbiFields = <T extends Schema, V extends TableRecordValues<keyof T>>(
  schema: T,
  values?: V
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
        initialValue: recordValueToFormValue(typeDetails, values?.[key]),
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
