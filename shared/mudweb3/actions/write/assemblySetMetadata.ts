import { TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";

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
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.EntityRecordSystem.systemId,
    functionName: "setEntityMetadata",
    args: [args.assemblyId, args.name, args.dappURL, args.description],
  });
}
