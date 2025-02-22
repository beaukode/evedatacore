import { TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";

export type AssemblyBringOfflineParameters = {
  assemblyId: bigint;
};

export type AssemblyBringOfflineReturnType = TransactionReceipt;

export async function assemblyBringOffline(
  client: WorldWriteClient,
  args: AssemblyBringOfflineParameters
): Promise<AssemblyBringOfflineReturnType> {
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartDeployableSystem.systemId,
    functionName: "bringOffline",
    args: [args.assemblyId],
  });
}
