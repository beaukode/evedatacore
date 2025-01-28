import { Table, GetRecordOptions, getRecord } from "@latticexyz/store/internal";
import { Client, Hex, isAddress, WalletClient as ViemWalletClient } from "viem";
import { erc721actions, erc721walletActions } from "./erc721actions";
import { eveworldActions, eveworlWalletActions } from "./eveworldActions";

export type MudWeb3ClientConfig = {
  publicClient: Client;
  walletClient?: ViemWalletClient;
  worldAddress: Hex;
  smartDeployableSystem: Hex;
};

export type MudWeb3Client = ReturnType<typeof createMudWeb3Client>;
type WalletClient = ReturnType<typeof createWalletClient>;
type PublicClient = ReturnType<typeof createPublicClient>;

type WalletClientConfig = {
  worldAddress: Hex;
  smartDeployableSystem: Hex;
};

function createWalletClient(
  walletClient: ViemWalletClient,
  config: WalletClientConfig
) {
  return walletClient
    .extend(erc721walletActions)
    .extend(eveworlWalletActions(config));
}

function createPublicClient(worldAddress: Hex, publicClient: Client) {
  return publicClient
    .extend(erc721actions)
    .extend((client) => ({
      async getRecord<table extends Table>(options: GetRecordOptions<table>) {
        return getRecord<table>(client, options);
      },
    }))
    .extend(eveworldActions(worldAddress));
}

export function createMudWeb3Client(config: MudWeb3ClientConfig) {
  const { worldAddress, smartDeployableSystem, publicClient, walletClient } =
    config;
  if (!isAddress(worldAddress)) {
    throw new Error(`Invalid world address: ${worldAddress}`);
  }

  const extendedClient: PublicClient & { wallet?: WalletClient } =
    createPublicClient(worldAddress, publicClient);

  if (walletClient) {
    extendedClient.wallet = createWalletClient(walletClient, {
      worldAddress,
      smartDeployableSystem,
    });
  }
  return extendedClient;
}
