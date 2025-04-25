import { Hex, TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";

export type TurretSetSystemParameters = {
  turretId: bigint;
  systemId: Hex;
};

export type TurretSetSystemReturnType = TransactionReceipt;

export async function turretSetSystem(
  client: WorldWriteClient,
  args: TurretSetSystemParameters
): Promise<TurretSetSystemReturnType> {
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartTurretSystem.systemId,
    functionName: "configureSmartTurret",
    args: [args.turretId, args.systemId],
  });
}
