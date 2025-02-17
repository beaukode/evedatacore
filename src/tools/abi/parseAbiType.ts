import { BaseAbiType, isBaseApiType } from "./types";
import { AbiType } from "@latticexyz/config";

export type AbiTypeDetails = {
  baseType: BaseAbiType;
  isArray: boolean;
  isDynamicLength: boolean;
  length?: number;
};

export function parseAbiType(type: AbiType): AbiTypeDetails {
  const match = type.match(/^([a-z]+)(\d*)/);
  if (!match) {
    throw new Error(`Invalid ABI type: ${type}`);
  }

  const [, baseType, length] = match;
  if (!(baseType && isBaseApiType(baseType))) {
    throw new Error(`Invalid base ABI type: ${baseType}`);
  }

  if (length) {
    const parsedLength = Number.parseInt(length, 10);
    if (isNaN(parsedLength) || parsedLength <= 0) {
      throw new Error(`Invalid length in ABI type: ${type}`);
    }
  }

  return {
    baseType: baseType,
    isArray: type.endsWith("[]"),
    isDynamicLength: ["bytes", "string"].includes(type),
    length: length ? Number.parseInt(length, 10) : undefined,
  };
}
