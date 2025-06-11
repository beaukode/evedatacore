import {
  Abi,
  BaseError,
  ContractFunctionArgs,
  ContractFunctionName,
  encodeFunctionData,
  EncodeFunctionDataParameters,
  Hex,
  TransactionReceipt,
} from "viem";
import { isError } from "lodash-es";
import { WorldWriteClient } from "../../types";
import { WorldAbi, worldAbi } from "../../abi";
import { Web3TransactionError } from "../../Web3TransactionError";

type mutability = "nonpayable" | "payable";

export type SytemWriteParameters<
  abi extends Abi = WorldAbi,
  functionName extends ContractFunctionName<
    abi,
    mutability
  > = ContractFunctionName<abi, mutability>,
  args extends ContractFunctionArgs<
    abi,
    mutability,
    functionName
  > = ContractFunctionArgs<abi, mutability, functionName>,
> = {
  readonly abi?: abi;
  systemAddress: Hex;
  functionName: functionName;
  args: args;
};

export type SystemWriteReturnType = TransactionReceipt;

export async function systemWrite<
  abi extends Abi = WorldAbi,
  functionName extends ContractFunctionName<
    abi,
    mutability
  > = ContractFunctionName<abi, mutability>,
  args extends ContractFunctionArgs<
    abi,
    mutability,
    functionName
  > = ContractFunctionArgs<abi, mutability, functionName>,
>(
  client: WorldWriteClient,
  args: SytemWriteParameters<abi, functionName, args>
): Promise<SystemWriteReturnType> {
  try {
    const abi: abi = args.abi || (worldAbi as unknown as abi);
    if (client.debugCalls) {
      console.log(
        "systemWrite",
        args.systemAddress,
        args.functionName,
        args.args
      );
    }
    await client.systemSimulate({
      abi,
      systemAddress: args.systemAddress,
      functionName: args.functionName,
      args: args.args,
    });

    const data = encodeFunctionData({
      abi,
      functionName: args.functionName,
      args: args.args,
    } as EncodeFunctionDataParameters);

    const tx = await client.writeClient.writeContract({
      chain: client.writeClient.chain,
      account: client.writeClient.account,
      address: client.mudAddresses.world,
      abi: worldAbi,
      functionName: "call",
      args: [args.systemAddress, data],
    });
    const receipt = await client.waitForTransactionReceipt({
      hash: tx,
      timeout: 60 * 1000,
    });

    if (receipt.status === "reverted") {
      // In case of revert, we simulate the transaction on the same block to get the revert reason
      await client.systemSimulate({
        abi,
        systemAddress: args.systemAddress,
        functionName: args.functionName,
        args: args.args,
        blockNumber: receipt.blockNumber,
      });
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
