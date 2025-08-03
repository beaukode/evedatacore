import IWorldAbi from "@eveworld/world-v2/out/world/IWorld.sol/IWorld.abi.json";
import EntityRecordSystemAbi from "@eveworld/world-v2/out/EntityRecordSystem.sol/EntityRecordSystem.abi.json";
import DeployableSystemAbi from "@eveworld/world-v2/out/DeployableSystem.sol/DeployableSystem.abi.json";
import EphemeralInteractSystemAbi from "@eveworld/world-v2/out/EphemeralInteractSystem.sol/EphemeralInteractSystem.abi.json";
import SmartTurretSystemAbi from "@eveworld/world-v2/out/SmartTurretSystem.sol/SmartTurretSystem.abi.json";
import SmartGateSystemAbi from "@eveworld/world-v2/out/SmartGateSystem.sol/SmartGateSystem.abi.json";

export const worldAbi = [
  ...IWorldAbi,
  ...EntityRecordSystemAbi,
  ...DeployableSystemAbi,
  ...EphemeralInteractSystemAbi,
  ...SmartTurretSystemAbi,
  ...SmartGateSystemAbi,
] as const;

export type WorldAbi = typeof worldAbi;
