import { IWorldAbi } from "@eveworld/contracts";
import GateConfigErrors from "./GateConfigErrors.abi.json";
import GateConfigSystemAbi from "./GateConfigSystem.abi.json";

export const gatesAbi = [
  ...IWorldAbi.abi,
  ...GateConfigErrors,
  ...GateConfigSystemAbi,
] as const;

export type GatesAbi = typeof gatesAbi;
