import { Hex, webSocket, createPublicClient } from "viem";
import { EnvVariablesService } from "./envVariables";
import { createMudWeb3PublicClient } from "@shared/mudweb3";
import { pyrope } from "@latticexyz/common/chains";

export type MudWeb3Service = ReturnType<typeof createMudWeb3Service>;

interface MudWeb3ServiceConfig {
  env: EnvVariablesService;
}

export function createMudWeb3Service({ env }: MudWeb3ServiceConfig) {
  return createMudWeb3PublicClient({
    mudAddresses: {
      world: env.WORLD_ADDRESS as Hex,
    },
    publicClient: createPublicClient({
      chain: pyrope,
      transport: webSocket(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
  });
}
