import { Abi, BaseError, Hex, SimulateContractParameters } from "viem";
import { isError } from "lodash-es";
import { MudWeb3ClientBase } from "../../types";
import { worldAbi, WorldAbi } from "../../abi";
import { Web3TransactionError } from "../../Web3TransactionError";

export type WorldSimulateParameters<abi extends Abi = WorldAbi> = Pick<
  SimulateContractParameters<abi>,
  "functionName" | "args" | "blockNumber"
>;

export type WorldSimulateReturnType = Hex;

export async function worldSimulate<abi extends Abi = WorldAbi>(
  client: MudWeb3ClientBase,
  args: WorldSimulateParameters<abi>
): Promise<WorldSimulateReturnType> {
  try {
    if (client.debugCalls) {
      console.log("worldSimulate", args.functionName, args.args);
    }
    const { result } = await client.simulateContract({
      account: client.writeClient?.account,
      address: client.mudAddresses.world,
      abi: worldAbi,
      functionName: args.functionName,
      args: args.args,
      blockNumber: args.blockNumber,
    } as SimulateContractParameters);

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
