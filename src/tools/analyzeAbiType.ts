import { AbiType } from "@latticexyz/store/internal";

export type AbiTypeDetails = {
  baseType: "uint" | "int" | "bool" | "address" | "bytes" | "string";
  isArray: boolean;
  isDynamicLength: boolean;
  length?: number;
};

export function analyzeAbiType(type: AbiType): AbiTypeDetails {
  const match = type.match(/^([a-z]+)(\d*)/);
  if (!match) {
    throw new Error(`Invalid ABI type: ${type}`);
  }

  const [, baseType, length] = match;
  return {
    baseType: baseType as AbiTypeDetails["baseType"],
    isArray: type.endsWith("[]"),
    isDynamicLength: ["bytes", "string"].includes(type),
    length: length ? Number.parseInt(length, 10) : undefined,
  };
}
