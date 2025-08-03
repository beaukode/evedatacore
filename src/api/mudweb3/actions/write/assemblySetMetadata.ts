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
      eveworld.namespaces.evefrontier.systems.EntityRecordSystem.systemId,
    functionName: "createMetadata",
    args: [
      args.assemblyId,
      { name: args.name, dappURL: args.dappURL, description: args.description },
    ],
  });
}
