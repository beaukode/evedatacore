import { Table, GetRecordOptions, getRecord } from "@latticexyz/store/internal";
import { Client, isAddress } from "viem";
import { eveworld } from "./eveworld";

export type MudWeb3ClientConfig = {
  ethClient: Client;
  worldAddress: string;
};

export type MudWeb3Client = ReturnType<typeof createMudWeb3Client>;

export function createMudWeb3Client(config: MudWeb3ClientConfig) {
  const { worldAddress, ethClient } = config;
  if (!isAddress(worldAddress)) {
    throw new Error(`Invalid world address: ${worldAddress}`);
  }

  return ethClient
    .extend((ethClient) => ({
      async getRecord<table extends Table>(options: GetRecordOptions<table>) {
        return getRecord<table>(ethClient, options);
      },
    }))
    .extend((ethClient) => ({
      async getDeployableState(id: bigint) {
        return ethClient.getRecord({
          address: worldAddress,
          table: eveworld.tables.eveworld__DeployableState,
          key: { smartObjectId: id },
        });
      },
    }));
}
