import { worldAbi } from "@shared/mudweb3";
import GateConfigErrors from "./GateConfigErrors.abi.json";
import GateConfigSystemAbi from "./GateConfigSystem.abi.json";

export const gatesAbi = [
  ...worldAbi,
  ...GateConfigErrors,
  ...GateConfigSystemAbi,
] as const;

export type GatesAbi = typeof gatesAbi;
