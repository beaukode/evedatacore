import { Hex, WalletClient, PublicClient } from "viem";
import { MudWeb3ReadActions } from "./actions/mudWeb3ReadActions";
import { MudWeb3WriteActions } from "./actions";

export type MudWeb3ClientAddresses = {
  world: Hex;
};

export type MudWeb3ClientConfig = {
  publicClient: PublicClient;
  walletClient?: WalletClient;
  mudAddresses: MudWeb3ClientAddresses;
};

export type MudWeb3ClientBase = PublicClient & {
  mudAddresses: MudWeb3ClientAddresses;
  writeClient?: WalletClient;
};

export type MudWeb3ClientRead = MudWeb3ClientBase & MudWeb3ReadActions;

export type MudWeb3Client = MudWeb3ClientRead & MudWeb3WriteActions;

type WriteClient = NonNullable<MudWeb3ClientRead["writeClient"]>;

export type WorldWriteClient = Omit<MudWeb3ClientRead, "writeClient"> & {
  writeClient: Omit<WriteClient, "account"> & {
    account: NonNullable<WriteClient["account"]>;
  };
};

export function isWorldWriteClient(
  client: MudWeb3ClientRead
): client is WorldWriteClient {
  return (
    client.writeClient !== undefined && client.writeClient.account !== undefined
  );
}

export type InventoryItemTransfert = {
  inventoryItemId: bigint;
  quantity: bigint;
};