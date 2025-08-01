import { BaseError, Hex } from "viem";
import { isError } from "lodash-es";
import { MudWeb3ClientBase } from "../../types";
import { worldAbi } from "../../abi";
import { Web3TransactionError } from "../../Web3TransactionError";

export type SystemSimulateBatchParameters = {
  calls: {
    systemId: Hex;
    callData: Hex;
  }[];
  blockNumber?: bigint;
};

export type SystemSimulateBatchReturnType = readonly Hex[];

export async function systemSimulateBatch(
  client: MudWeb3ClientBase,
  args: SystemSimulateBatchParameters
): Promise<SystemSimulateBatchReturnType> {
  try {
    if (client.debugCalls) {
      console.log("systemSimulateBatch", args.calls);
    }
    const response = await client.simulateContract({
      account: client.writeClient?.account,
      address: client.mudAddresses.world,
      abi: worldAbi,
      functionName: "batchCall",
      args: [args.calls],
      blockNumber: args.blockNumber,
    });

    return response.result;
  } catch (e) {
    console.error(e);
    if (isError(e)) {
      if (e instanceof BaseError) {
        throw new Web3TransactionError(
          e.shortMessage,
          undefined,
          e.metaMessages
        );
      }
      throw new Web3TransactionError(e.message);
    } else if (typeof e === "string") {
      throw new Web3TransactionError(e);
    } else {
      throw new Web3TransactionError("Unknown error");
    }
  }
}
