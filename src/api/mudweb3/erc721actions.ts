import {
  Account,
  Chain,
  Client,
  erc721Abi,
  Hex,
  Transport,
  WalletClient,
} from "viem";
import { readContract, writeContract } from "viem/actions";

export function erc721actions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
>(client: Client<transport, chain, account>) {
  return {
    erc721balanceOf: async (contractAddress: Hex, owner: Hex) => {
      return readContract(client, {
        address: contractAddress,
        abi: erc721Abi,
        functionName: "balanceOf",
        args: [owner],
      });
    },
  };
}

export function erc721walletActions(client: WalletClient) {
  const { chain, account } = client;
  if (!account) {
    throw new Error("Wallet client must have an account");
  }
  if (!chain) {
    throw new Error("Wallet client must have a chain");
  }
  return {
    erc721transferFrom: async (
      contractAddress: Hex,
      from: Hex,
      to: Hex,
      tokenId: bigint
    ) => {
      return writeContract(client, {
        chain: chain,
        account: account,
        address: contractAddress,
        abi: erc721Abi,
        functionName: "transferFrom",
        args: [from, to, tokenId],
      });
    },
  };
}
