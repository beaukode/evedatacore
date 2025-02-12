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