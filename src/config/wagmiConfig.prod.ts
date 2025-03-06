import { http } from "viem";
import { pyrope } from "@latticexyz/common/chains";
import { createConfig } from "wagmi";
import { coinbaseWallet, metaMask, safe, injected } from "wagmi/connectors";

const transports = {
  [pyrope.id]: http(),
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
      ...pyrope,
    },
  ],
  transports,
  pollingInterval: {
    [pyrope.id]: 2000,
  },
});
