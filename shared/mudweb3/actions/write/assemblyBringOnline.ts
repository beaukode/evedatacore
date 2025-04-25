import { TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";

export type AssemblyBringOnlineParameters = {
  assemblyId: bigint;
};

export type AssemblyBringOnlineReturnType = TransactionReceipt;

export async function assemblyBringOnline(
  client: WorldWriteClient,
  args: AssemblyBringOnlineParameters
): Promise<AssemblyBringOnlineReturnType> {
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartDeployableSystem.systemId,
    functionName: "bringOnline",
    args: [args.assemblyId],
  });
}
