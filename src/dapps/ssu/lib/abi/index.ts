import { worldAbi } from "@/api/mudweb3";
import SSUSystemErrors from "./SSUSystemErrors.abi.json";
import SSUSystemAbi from "./SSUSystem.abi.json";

export const ssuAbi = [
  ...worldAbi,
  ...SSUSystemErrors,
  ...SSUSystemAbi,
] as const;

export type SsuAbi = typeof ssuAbi;
