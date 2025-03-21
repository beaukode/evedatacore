import { BaseError, Hex } from "viem";
import { isError } from "lodash-es";
import { MudWeb3ClientBase } from "../../types";
import { worldAbi } from "../../abi";
import { Web3TransactionError } from "../../Web3TransactionError";

export type SystemSimulateParameters = {
  systemAddress: Hex;
  data: Hex;
  blockNumber?: bigint;
};

export type SystemSimulateReturnType = Hex;

export async function systemSimulate(
  client: MudWeb3ClientBase,
  args: SystemSimulateParameters
): Promise<SystemSimulateReturnType> {
  try {
    const { result } = await client.simulateContract({
      account: client.writeClient?.account,
      address: client.mudAddresses.world,
      abi: worldAbi,
      functionName: "call",
      args: [args.systemAddress, args.data],
      blockNumber: args.blockNumber,
    });

    return result;
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
