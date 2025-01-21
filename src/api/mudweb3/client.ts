import { Table, GetRecordOptions, getRecord } from "@latticexyz/store/internal";
import { Client, Hex, isAddress, WalletClient as ViemWalletClient } from "viem";
import { eveworld } from "./eveworld";
import { erc721actions, erc721walletActions } from "./erc721actions";

export type MudWeb3ClientConfig = {
  publicClient: Client;
  walletClient?: ViemWalletClient;
  worldAddress: string;
};

export type MudWeb3Client = ReturnType<typeof createMudWeb3Client>;
type WalletClient = ReturnType<typeof createWalletClient>;
type PublicClient = ReturnType<typeof createPublicClient>;

function createWalletClient(
  _worldAddress: Hex,
  walletClient: ViemWalletClient
) {
  return walletClient.extend(erc721walletActions);
}

function createPublicClient(worldAddress: Hex, publicClient: Client) {
  return publicClient
    .extend(erc721actions)
    .extend((client) => ({
      async getRecord<table extends Table>(options: GetRecordOptions<table>) {
        return getRecord<table>(client, options);
      },
    }))
    .extend((client) => ({
      async getDeployableState(id: bigint) {
        return client.getRecord({
          address: worldAddress,
          table: eveworld.tables.eveworld__DeployableState,
          key: { smartObjectId: id },
        });
      },
    }));
}

export function createMudWeb3Client(config: MudWeb3ClientConfig) {
  const { worldAddress, publicClient, walletClient } = config;
  if (!isAddress(worldAddress)) {
    throw new Error(`Invalid world address: ${worldAddress}`);
  }

  const extendedClient: PublicClient & { wallet?: WalletClient } =
    createPublicClient(worldAddress, publicClient);

  if (walletClient) {
    extendedClient.wallet = createWalletClient(worldAddress, walletClient);
  }
  return extendedClient;
}
