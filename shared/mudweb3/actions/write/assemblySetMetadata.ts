import { encodeFunctionData, TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";
import { worldAbi } from "../../abi";

export type AssemblySetMetadataParameters = {
  assemblyId: bigint;
  name: string;
  dappURL: string;
  description: string;
};

export type AssemblySetMetadataReturnType = TransactionReceipt;

export async function assemblySetMetadata(
  client: WorldWriteClient,
  args: AssemblySetMetadataParameters
): Promise<AssemblySetMetadataReturnType> {
  const data = encodeFunctionData({
    abi: worldAbi,
    functionName: "setEntityMetadata",
    args: [args.assemblyId, args.name, args.dappURL, args.description],
  });
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.EntityRecordSystem.systemId,
    data,
  });
}
