import {
  Abi,
  BaseError,
  ContractFunctionArgs,
  ContractFunctionName,
  ReadContractReturnType,
} from "viem";
import { isError } from "lodash-es";
import { MudWeb3ClientBase } from "../../types";
import { worldAbi, WorldAbi } from "../../abi";
import { Web3TransactionError } from "../../Web3TransactionError";

type mutability = "pure" | "view";

export type WorldReadParameters<
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
  functionName: functionName;
  args: args;
};

export type WorldReadReturnType<
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
> = ReadContractReturnType<abi, functionName, args>;

export async function worldRead<
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
  args: WorldReadParameters<abi, functionName, args>
): Promise<WorldReadReturnType<abi, functionName, args>> {
  try {
    const params = {
      account: client.writeClient?.account,
      address: client.mudAddresses.world,
      abi: worldAbi as unknown as abi,
      functionName: args.functionName,
      args: args.args,
    };

    return client.readContract(params);
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
