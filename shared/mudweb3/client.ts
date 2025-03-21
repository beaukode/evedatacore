import { MudWeb3Client, MudWeb3ClientConfig } from "./types";
import { mudWeb3ReadActions, mudWeb3WriteActions } from "./actions";

export function createMudWeb3Client(
  config: MudWeb3ClientConfig
): MudWeb3Client {
  const { publicClient, walletClient, mudAddresses } = config;

  const extendedClient = publicClient
    .extend(() => ({
      mudAddresses,
      writeClient: walletClient,
    }))
    .extend(mudWeb3ReadActions)
    .extend(mudWeb3WriteActions);

  return extendedClient;
}
