import {
  BaseError,
  Client,
  ContractFunctionArgs,
  ContractFunctionName,
  Hex,
  SimulateContractParameters,
  WalletClient,
  WriteContractParameters,
} from "viem";
import {
  waitForTransactionReceipt,
  writeContract,
  simulateContract,
} from "viem/actions";
import { IWorldAbi } from "@eveworld/contracts";
import SmartDeployableSystemAbi from "@eveworld/world/out/SmartDeployableSystem.sol/SmartDeployableSystem.abi.json";
import EntityRecordSystemAbi from "@eveworld/world/out/EntityRecordSystem.sol/EntityRecordSystem.abi.json";
import SmartGateSystemAbi from "@eveworld/world/out/SmartGateSystem.sol/SmartGateSystem.abi.json";
import { isError } from "lodash-es";
import { Web3TransactionError } from "./Web3TransactionError";

const myabi = [
  ...IWorldAbi.abi,
  ...SmartDeployableSystemAbi,
  ...EntityRecordSystemAbi,
  ...SmartGateSystemAbi,
]; // Merge all ABIs for error decoding;

export async function worldWrite<
  FunctionName extends ContractFunctionName<
    typeof myabi,
    "nonpayable" | "payable"
  >,
  Args extends ContractFunctionArgs<
    typeof myabi,
    "nonpayable" | "payable",
    FunctionName
  >,
>(
  publicClient: Client,
  walletClient: WalletClient,
  worldAddress: Hex,
  functionName: FunctionName,
  args: Args
) {
  const { chain, account } = walletClient;
  if (!account) {
    throw new Web3TransactionError("Wallet client must have an account");
  }
  if (!chain) {
    throw new Web3TransactionError("Wallet client must have a chain");
  }

  let tx: Hex | undefined = undefined;
  try {
    await simulateContract(publicClient, {
      address: worldAddress,
      abi: myabi,
      functionName,
      args,
    } as SimulateContractParameters);

    tx = await writeContract(walletClient, {
      chain: chain,
      account: account,
      address: worldAddress,
      abi: IWorldAbi.abi,
      functionName,
      args,
    } as WriteContractParameters);
    const receipt = await waitForTransactionReceipt(publicClient, {
      hash: tx,
      timeout: 60 * 1000,
    });

    if (receipt.status === "reverted") {
      // In case of revert, we simulate the transaction to get the revert reason
      await simulateContract(publicClient, {
        address: worldAddress,
        abi: IWorldAbi.abi,
        functionName,
        args,
        blockNumber: receipt.blockNumber,
      } as SimulateContractParameters);
    }
    return receipt;
  } catch (e) {
    console.error(e);

    if (isError(e)) {
      if (e instanceof BaseError) {
        throw new Web3TransactionError(e.shortMessage, tx, e.metaMessages);
      }
      throw new Web3TransactionError(e.message, tx);
    } else if (typeof e === "string") {
      throw new Web3TransactionError(e, tx);
    } else {
      throw new Web3TransactionError("Unknown error", tx);
    }
  }
}
