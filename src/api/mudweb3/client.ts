import { MudWeb3Client, MudWeb3ClientConfig, MudWeb3ClientRead } from "./types";
import { mudWeb3ReadActions, mudWeb3WriteActions } from "./actions";

export function createMudWeb3Client(
  config: MudWeb3ClientConfig
): MudWeb3Client {
  const { publicClient, walletClient, mudAddresses, debugCalls } = config;

  const extendedClient = publicClient
    .extend(() => ({
      mudAddresses,
      writeClient: walletClient,
      debugCalls,
    }))
    .extend(mudWeb3ReadActions)
    .extend(mudWeb3WriteActions);

  return extendedClient;
}

export function createMudWeb3PublicClient(
  config: MudWeb3ClientConfig
): MudWeb3ClientRead {
  const { publicClient, mudAddresses, debugCalls } = config;

  const extendedClient = publicClient
    .extend(() => ({
      mudAddresses,
      debugCalls,
    }))
    .extend(mudWeb3ReadActions);

  return extendedClient;
}
