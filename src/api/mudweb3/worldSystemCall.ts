import { BaseError, Client, Hex, WalletClient } from "viem";
import {
  waitForTransactionReceipt,
  writeContract,
  simulateContract,
} from "viem/actions";
import { IWorldAbi } from "@eveworld/contracts";
import SmartDeployableSystemAbi from "@eveworld/world/out/SmartDeployableSystem.sol/SmartDeployableSystem.abi.json";
import EntityRecordSystemAbi from "@eveworld/world/out/EntityRecordSystem.sol/EntityRecordSystem.abi.json";
import InventoryInteractSystemAbi from "@eveworld/world/out/InventoryInteractSystem.sol/InventoryInteractSystem.abi.json";
import { isError } from "lodash-es";
import { Web3TransactionError } from "./Web3TransactionError";

export async function worldSystemCall(
  publicClient: Client,
  walletClient: WalletClient,
  worldAddress: Hex,
  systemAddress: Hex,
  data: Hex
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
      chain: chain,
      account: account,
      address: worldAddress,
      abi: [
        ...IWorldAbi.abi,
        ...SmartDeployableSystemAbi,
        ...EntityRecordSystemAbi,
        ...InventoryInteractSystemAbi,
      ], // Merge all ABIs for error decoding
      functionName: "call",
      args: [systemAddress, data],
    });

    tx = await writeContract(walletClient, {
      chain: chain,
      account: account,
      address: worldAddress,
      abi: IWorldAbi.abi,
      functionName: "call",
      args: [systemAddress, data],
    });
    const receipt = await waitForTransactionReceipt(publicClient, {
      hash: tx,
      timeout: 60 * 1000,
    });

    if (receipt.status === "reverted") {
      // In case of revert, we simulate the transaction to get the revert reason
      await simulateContract(publicClient, {
        chain: chain,
        account: account,
        address: worldAddress,
        abi: IWorldAbi.abi,
        functionName: "call",
        args: [systemAddress, data],
        blockNumber: receipt.blockNumber,
      });
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
