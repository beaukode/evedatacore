import React from "react";
import { z } from "zod";
import { AbiType } from "@latticexyz/config";
import {
  AbiTypeDetails,
  BaseAbiType,
  parseAbiType,
  TableRecordValues,
  TableValue,
  abiTypeZodSchema,
} from "./abi";
import BooleanField from "@/components/form/BooleanField";
import HexField from "@/components/form/HexField";
import IntegerField from "@/components/form/IntegerField";
import StringField from "@/components/form/StringField";
import IntegerArrayField from "@/components/form/IntegerArrayField";

type Schema = Record<string, { type: AbiType }>;

type FormValue<T extends AbiTypeDetails> = T["isArray"] extends true
  ? Array<T["baseType"] extends "bool" ? boolean : string>
  : T["baseType"] extends "bool"
    ? boolean
    : string;

function recordValueToFormValue<T extends AbiTypeDetails>(
  abiType: T,
  value: TableValue | undefined
): FormValue<T> {
  if (abiType.isArray) {
    if (Array.isArray(value)) {
      return value.map((v: TableValue) =>
        recordValueToFormValue({ ...abiType, isArray: false }, v)
      ) as unknown as FormValue<T>;
    } else {
      return [] as string[] as FormValue<T>;
    }
  } else if (abiType.baseType === "bool") {
    if (typeof value === "boolean") {
      return value as FormValue<T>;
    }
    return (value === "true") as FormValue<T>;
  } else if (["address", "bytes"].includes(abiType.baseType)) {
    if (value && value.toString().startsWith("0x")) {
      return value.toString().substring(2) as FormValue<T>;
    }
    return (value?.toString() || "") as FormValue<T>;
  } else {
    return (value?.toString() || "") as FormValue<T>;
  }
}

function getDefaultValue<T extends AbiTypeDetails>(
  typeDetails: T
): FormValue<T> {
  if (typeDetails.isArray) return [] as unknown as FormValue<T>;
  return (typeDetails.baseType === "bool" ? false : "") as FormValue<T>;
}

const formComponentsMap: Record<
  BaseAbiType,
  | typeof IntegerField
  | typeof HexField
  | typeof BooleanField
  | typeof StringField
  | typeof IntegerArrayField
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
    | typeof StringField
    | typeof IntegerArrayField;
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
        defaultValue: getDefaultValue(typeDetails),
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
