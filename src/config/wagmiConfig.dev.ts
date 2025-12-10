import { http } from "viem";
import { anvil, optimismSepolia } from "viem/chains";
import { createConfig } from "wagmi";
import { metaMask, coinbaseWallet, safe, injected } from "wagmi/connectors";

const transports = {
  [anvil.id]: http(),
  [optimismSepolia.id]: http(),
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
      ...optimismSepolia,
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
    [optimismSepolia.id]: 2000,
  },
});
