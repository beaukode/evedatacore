import { encodeFunctionData, TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";
import { worldAbi } from "../../abi";

export type AssemblyBringOnlineParameters = {
  assemblyId: bigint;
};

export type AssemblyBringOnlineReturnType = TransactionReceipt;

export async function assemblyBringOnline(
  client: WorldWriteClient,
  args: AssemblyBringOnlineParameters
): Promise<AssemblyBringOnlineReturnType> {
  const data = encodeFunctionData({
    abi: worldAbi,
    functionName: "bringOnline",
    args: [args.assemblyId],
  });
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartDeployableSystem.systemId,
    data,
  });
}
