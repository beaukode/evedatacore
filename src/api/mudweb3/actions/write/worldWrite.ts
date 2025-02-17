import {
  Abi,
  BaseError,
  ContractFunctionArgs,
  ContractFunctionName,
  TransactionReceipt,
  WriteContractParameters,
} from "viem";
import { isError } from "lodash-es";
import { WorldWriteClient } from "../../types";
import { WorldAbi, worldAbi } from "../../abi";
import { Web3TransactionError } from "../../Web3TransactionError";
import { WorldSimulateParameters } from "../read/worldSimulate";

export type WorldWriteParameters<
  abi extends Abi = WorldAbi,
  functionName extends ContractFunctionName<
    abi,
    "nonpayable" | "payable"
  > = ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  > = ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
> = {
  functionName: functionName;
  args: args;
};

export type WorldWriteReturnType = TransactionReceipt;

export async function worldWrite<
  abi extends Abi = WorldAbi,
  functionName extends ContractFunctionName<
    abi,
    "nonpayable" | "payable"
  > = ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  > = ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
>(
  client: WorldWriteClient,
  args: WorldWriteParameters<abi, functionName, args>
): Promise<WorldWriteReturnType> {
  try {
    const params = {
      chain: client.writeClient.chain,
      account: client.writeClient.account,
      address: client.mudAddresses.world,
      abi: worldAbi,
      functionName: args.functionName,
      args: args.args,
    };

    await client.worldSimulate({
      functionName: args.functionName,
      args: args.args,
    } as WorldSimulateParameters<abi>);

    const tx = await client.writeClient.writeContract(
      params as WriteContractParameters
    );
    const receipt = await client.waitForTransactionReceipt({
      hash: tx,
      timeout: 60 * 1000,
    });

    if (receipt.status === "reverted") {
      // In case of revert, we simulate the transaction to get the revert reason
      await client.worldSimulate({
        functionName: args.functionName,
        args: args.args,
        blockNumber: BigInt(0),
      } as WorldSimulateParameters<abi>);
    }
    return receipt;
  } catch (e) {
    console.error(e);
    if (isError(e)) {
      if (e instanceof Web3TransactionError) {
        throw e;
      }
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
