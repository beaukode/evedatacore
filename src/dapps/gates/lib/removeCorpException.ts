import { TransactionReceipt, Hex } from "viem";
import { MudWeb3Client } from "@shared/mudweb3";
import { gatesAbi } from "./abi";

export type RemoveCorpExceptionParameters = {
  gateId: bigint;
  corpId: bigint;
  configSystemId: Hex;
};

export async function removeCorpException(
  client: MudWeb3Client,
  args: RemoveCorpExceptionParameters
): Promise<TransactionReceipt> {
  return client.systemWrite({
    abi: gatesAbi,
    systemAddress: args.configSystemId,
    functionName: "removeCorpException",
    args: [args.gateId, args.corpId],
  });
}
