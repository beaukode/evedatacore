import { TransactionReceipt, Hex } from "viem";
import { MudWeb3Client } from "@shared/mudweb3";
import { gatesAbi } from "./abi";

export type RemoveCharacterExceptionParameters = {
  gateId: bigint;
  characterId: bigint;
  configSystemId: Hex;
};

export async function removeCharacterException(
  client: MudWeb3Client,
  args: RemoveCharacterExceptionParameters
): Promise<TransactionReceipt> {
  return client.systemWrite({
    abi: gatesAbi,
    systemAddress: args.configSystemId,
    functionName: "removeCharacterException",
    args: [args.gateId, args.characterId],
  });
}
