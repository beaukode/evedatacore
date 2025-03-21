import { encodeFunctionData, TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";
import { worldAbi } from "../../abi";

export type AssemblyBringOfflineParameters = {
  assemblyId: bigint;
};

export type AssemblyBringOfflineReturnType = TransactionReceipt;

export async function assemblyBringOffline(
  client: WorldWriteClient,
  args: AssemblyBringOfflineParameters
): Promise<AssemblyBringOfflineReturnType> {
  const data = encodeFunctionData({
    abi: worldAbi,
    functionName: "bringOffline",
    args: [args.assemblyId],
  });
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartDeployableSystem.systemId,
    data,
  });
}
