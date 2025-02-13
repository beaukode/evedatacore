import { Hex } from "viem";

export const baseApiTypes = [
  "uint",
  "int",
  "bool",
  "address",
  "bytes",
  "string",
] as const;

export type BaseAbiType = (typeof baseApiTypes)[number];

export function isBaseApiType(value: string): value is BaseAbiType {
  return baseApiTypes.includes(value as BaseAbiType);
}

export type TableValue =
  | string
  | bigint
  | number
  | boolean
  | Hex
  | readonly number[]
  | readonly bigint[]
  | readonly Hex[]
  | readonly boolean[];

export type TableRecordValues<K extends string | number | symbol> = Record<
  K,
  TableValue
>;
