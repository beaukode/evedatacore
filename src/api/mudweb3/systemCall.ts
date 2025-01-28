import { BaseError, Hex, WalletClient } from "viem";
import {
  waitForTransactionReceipt,
  writeContract,
  simulateContract,
} from "viem/actions";
import { IWorldAbi } from "@eveworld/contracts";
import SmartDeployableSystemAbi from "@eveworld/world/out/SmartDeployableSystem.sol/SmartDeployableSystem.abi.json";
import { isError } from "lodash-es";

export class Web3TransactionError extends Error {
  public readonly tx?: string;
  public readonly details?: string[];

  constructor(message: string, tx?: string, details?: string[]) {
    super(message);
    this.tx = tx;
    this.details = details;
  }
}

export async function worldSystemCall(
  client: WalletClient,
  worldAddress: Hex,
  systemAddress: Hex,
  data: Hex
) {
  const { chain, account } = client;
  if (!account) {
    throw new Web3TransactionError("Wallet client must have an account");
  }
  if (!chain) {
    throw new Web3TransactionError("Wallet client must have a chain");
  }

  let tx: Hex | undefined = undefined;
  try {
    await simulateContract(client, {
      chain: chain,
      account: account,
      address: worldAddress,
      abi: [...IWorldAbi.abi, ...SmartDeployableSystemAbi],
      functionName: "call",
      args: [systemAddress, data],
    });

    tx = await writeContract(client, {
      chain: chain,
      account: account,
      address: worldAddress,
      abi: IWorldAbi.abi,
      functionName: "call",
      args: [systemAddress, data],
    });
    const receipt = await waitForTransactionReceipt(client, {
      hash: tx,
      timeout: 60 * 1000,
    });

    if (receipt.status === "reverted") {
      // In case of revert, we simulate the transaction to get the revert reason
      await simulateContract(client, {
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
