import {
  Abi,
  BaseError,
  ContractFunctionArgs,
  ContractFunctionName,
  decodeFunctionResult,
  DecodeFunctionResultParameters,
  DecodeFunctionResultReturnType,
  encodeFunctionData,
  EncodeFunctionDataParameters,
  Hex,
} from "viem";
import { isError } from "lodash-es";
import { MudWeb3ClientBase } from "../../types";
import { WorldAbi, worldAbi } from "../../abi";
import { Web3TransactionError } from "../../Web3TransactionError";

type mutability = "pure" | "view" | "payable" | "nonpayable";

export type SystemSimulateParameters<
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
  systemAddress: Hex;
  functionName: functionName;
  args: args;
  blockNumber?: bigint;
};

export type SystemSimulateReturnType<
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
> = DecodeFunctionResultReturnType<abi, functionName, args>;

export async function systemSimulate<
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
  client: MudWeb3ClientBase,
  args: SystemSimulateParameters<abi, functionName, args>
): Promise<SystemSimulateReturnType<abi, functionName, args>> {
  try {
    const data = encodeFunctionData({
      abi: worldAbi,
      functionName: args.functionName,
      args: args.args,
    } as EncodeFunctionDataParameters);

    const response = await client.simulateContract({
      account: client.writeClient?.account,
      address: client.mudAddresses.world,
      abi: worldAbi,
      functionName: "call",
      args: [args.systemAddress, data],
      blockNumber: args.blockNumber,
    });

    const result = decodeFunctionResult<abi, functionName, args>({
      abi: worldAbi,
      data: response.result,
      functionName: args.functionName,
      args: args.args,
    } as DecodeFunctionResultParameters<abi, functionName, args>);

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
