import { TransactionReceipt, Hex } from "viem";
import { MudWeb3Client } from "@shared/mudweb3";
import { gatesAbi } from "./abi";

export type AddCharacterExceptionParameters = {
  gateId: bigint;
  characterId: bigint;
  configSystemId: Hex;
};

export async function addCharacterException(
  client: MudWeb3Client,
  args: AddCharacterExceptionParameters
): Promise<TransactionReceipt> {
  return client.systemWrite({
    abi: gatesAbi,
    systemAddress: args.configSystemId,
    functionName: "addCharacterException",
    args: [args.gateId, args.characterId],
  });
}
