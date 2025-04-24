import { IWorldAbi } from "@eveworld/contracts";
import SmartDeployableSystemAbi from "@eveworld/world/out/SmartDeployableSystem.sol/SmartDeployableSystem.abi.json";
import EntityRecordSystemAbi from "@eveworld/world/out/EntityRecordSystem.sol/EntityRecordSystem.abi.json";
import SmartGateSystemAbi from "@eveworld/world/out/SmartGateSystem.sol/SmartGateSystem.abi.json";
import InventoryInteractSystemAbi from "@eveworld/world/out/InventoryInteractSystem.sol/InventoryInteractSystem.abi.json";
import { Abi } from "viem";

export const worldAbi: Abi = [
  ...IWorldAbi.abi,
  ...SmartDeployableSystemAbi,
  ...EntityRecordSystemAbi,
  ...SmartGateSystemAbi,
  ...InventoryInteractSystemAbi,
] as const;

export type WorldAbi = typeof worldAbi;
