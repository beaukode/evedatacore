import { devWagmiConfig } from "./wagmiConfig.dev";
import { prodWagmiConfig } from "./wagmiConfig.prod";

export const wagmiConfig =
  process.env.NODE_ENV === "development" ? devWagmiConfig : prodWagmiConfig;
