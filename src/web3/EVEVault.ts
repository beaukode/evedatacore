import { Wallet } from "@rainbow-me/rainbowkit";
import { oneKeyWallet } from "@rainbow-me/rainbowkit/wallets";

export const EVEVault = (): Wallet => {
  const base = oneKeyWallet();
  return {
    ...base,
    name: "EVE Vault",
    iconUrl: "https://vault.evefrontier.com/favicon-16.png",
    iconBackground: "#000",
    downloadUrls: {
      android:
        "https://artifacts.evefrontier.com/wallet/android/eve-vault-v1.0.5.apk",
      ios: "https://testflight.apple.com/join/w2NCeawN",
      chrome:
        "https://artifacts.evefrontier.com/wallet/extension/vault-v1.0.9/wallet-alpha.zip",
      qrCode: "https://vault.evefrontier.com",
    },
    mobile: {
      getUri: (uri: string) => uri,
    },
    qrCode: {
      getUri: (uri: string) => uri,
      instructions: {
        learnMoreUrl: "https://docs.evefrontier.com/EveVault/installation",
        steps: [
          {
            description:
              "We recommend putting EVE Vault on your home screen for faster access to your wallet.",
            step: "install",
            title: "Open the EVE Vault app",
          },
          {
            description:
              "After you scan, a connection prompt will appear for you to connect your wallet.",
            step: "scan",
            title: "Tap the scan button",
          },
        ],
      },
    },
    extension: {
      instructions: {
        learnMoreUrl: "https://docs.evefrontier.com/EveVault/installation",
        steps: [
          {
            description:
              "We recommend pinning EVE Vault for quicker access to your wallet.",
            step: "install",
            title: "Install the EVE Vault extension",
          },
          {
            description:
              "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
            step: "create",
            title: "Create or Import a Wallet",
          },
          {
            description:
              "Once you set up your wallet, click below to refresh the browser and load up the extension.",
            step: "refresh",
            title: "Refresh your browser",
          },
        ],
      },
    },
  };
};
