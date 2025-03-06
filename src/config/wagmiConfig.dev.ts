import { http } from "viem";
import { anvil } from "viem/chains";
import { garnet, redstone, pyrope } from "@latticexyz/common/chains";
import { createConfig } from "wagmi";
import { metaMask, coinbaseWallet, safe, injected } from "wagmi/connectors";

const transports = {
  [anvil.id]: http(),
  [garnet.id]: http(),
  [redstone.id]: http(),
  [pyrope.id]: http(),
};

export const devWagmiConfig = createConfig({
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
      ...redstone,
      blockExplorers: {
        ...redstone.blockExplorers,
        worldsExplorer: {
          name: "MUD Worlds Explorer",
          url: "https://explorer.mud.dev/redstone/worlds",
        },
      },
      iconUrl:
        "https://pbs.twimg.com/profile_images/1724553277147131904/cdma6E3g_400x400.jpg",
    },
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
    {
      ...pyrope,
    },
    {
      ...anvil,
      blockExplorers: {
        default: {
          name: "Blockscout",
          url: "http://localhost:13690/anvil/worlds",
        },
        ...anvil.blockExplorers,
        worldsExplorer: {
          name: "MUD Worlds Explorer",
          url: "http://localhost:13690/anvil/worlds",
        },
      },
    },
  ],
  transports,
  pollingInterval: {
    [anvil.id]: 2000,
    [garnet.id]: 2000,
    [redstone.id]: 2000,
  },
});
