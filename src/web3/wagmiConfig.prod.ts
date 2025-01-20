import { http } from "viem";
import { garnet } from "@latticexyz/common/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  safeWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { EVEVault } from "./EVEVault";

const transports = {
  [garnet.id]: http(),
};

export const prodWagmiConfig = getDefaultConfig({
  projectId: "BEAUKODE_EVEF",
  appName: "EVE Frontier tools",
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, EVEVault, safeWallet, coinbaseWallet],
    },
  ],
  multiInjectedProviderDiscovery: false,
  chains: [
    {
      ...garnet,
      blockExplorers: {
        ...garnet.blockExplorers,
        worldsExplorer: {
          name: "MUD Worlds Explorer",
          url: "https://explorer.mud.dev/garnet/worlds",
        },
      },
      iconUrl:
        "https://explorer.garnetchain.com/assets/configs/network_icon.svg",
    },
  ],
  transports,
  pollingInterval: {
    [garnet.id]: 2000,
  },
});
