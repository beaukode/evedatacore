import { TransactionReceipt, Hex } from "viem";
import { MudWeb3Client } from "@shared/mudweb3";
import { gatesAbi } from "./abi";

export type AddCorpExceptionParameters = {
  gateId: bigint;
  corpId: bigint;
  configSystemId: Hex;
};

export async function addCorpException(
  client: MudWeb3Client,
  args: AddCorpExceptionParameters
): Promise<TransactionReceipt> {
  return client.systemWrite({
    abi: gatesAbi,
    systemAddress: args.configSystemId,
    functionName: "addCorpException",
    args: [args.gateId, args.corpId],
  });
}
