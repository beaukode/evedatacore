import { devWagmiConfig } from "./wagmiConfig.dev";
import { prodWagmiConfig } from "./wagmiConfig.prod";
import * as web3ConfigAnvil from "./web3Config.anvil";
import * as web3ConfigProd from "./web3Config.prod";

export const wagmiConfig = import.meta.env.DEV
  ? devWagmiConfig
  : prodWagmiConfig;

export const web3Config = import.meta.env.VITE_APP_USE_ANVIL === "true"
  ? web3ConfigAnvil
  : web3ConfigProd;

export const chainId = web3Config.chainId;
export const indexerBaseUrl = web3Config.indexerBaseUrl;
export const worldAddress = web3Config.worldAddress;
