import { MudWeb3Client, MudWeb3ClientConfig, MudWeb3ClientRead } from "./types";
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

export function createMudWeb3PublicClient(
  config: MudWeb3ClientConfig
): MudWeb3ClientRead {
  const { publicClient, mudAddresses } = config;

  const extendedClient = publicClient
    .extend(() => ({
      mudAddresses,
    }))
    .extend(mudWeb3ReadActions);

  return extendedClient;
}
