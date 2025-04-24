import { TransactionReceipt, Hex } from "viem";
import { MudWeb3Client } from "@shared/mudweb3";
import { gatesAbi } from "./abi";

export type SetupGateParameters = {
  gateId: bigint;
  defaultRule: boolean;
  configSystemId: Hex;
};

export async function setDefaultRule(
  client: MudWeb3Client,
  args: SetupGateParameters
): Promise<TransactionReceipt> {
  return client.systemWrite({
    abi: gatesAbi,
    systemAddress: args.configSystemId,
    functionName: "setDefaultRule",
    args: [args.gateId, args.defaultRule],
  });
}
