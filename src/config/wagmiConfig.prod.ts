import { http } from "viem";
import { garnet } from "@latticexyz/common/chains";
import { createConfig } from "wagmi";
import { coinbaseWallet, metaMask, safe, injected } from "wagmi/connectors";

const transports = {
  [garnet.id]: http(),
};

export const prodWagmiConfig = createConfig({
  connectors: [
    injected({
      target: {
        provider: window?.ethereum,
        id: "eveVault",
        name: "EVE Vault",
        icon: "https://vault.evefrontier.com/favicon-16.png",
      },
    }),
    metaMask({ dappMetadata: { name: "EVE Datacore" } }),
    coinbaseWallet({ appName: "EVE Datacore" }),
    safe(),
    injected(),
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
