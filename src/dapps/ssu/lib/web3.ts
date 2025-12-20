import { TransactionReceipt, Hex } from "viem";
import { MudWeb3Client, eveworld } from "@/api/mudweb3";
import { SsuAbi, ssuAbi } from "./abi";

export type SetupDelegationParameters = {
  ssuId: bigint;
  contractAddress: Hex;
  allow: boolean;
};

export type SetupDelegationReturnType = TransactionReceipt;

export async function setupDelegation(
  client: MudWeb3Client,
  args: SetupDelegationParameters
) {
  return client.systemWrite({
    systemAddress:
      eveworld.namespaces.evefrontier.systems.EphemeralInteractSystem.systemId,
    abi: ssuAbi,
    functionName: "setTransferToEphemeralAccess",
    args: [args.ssuId, args.contractAddress, args.allow],
  });
}

export type SetupDappURLParameters = {
  ssuId: bigint;
  dappUrl: string;
};

export type SetupDappURLReturnType = TransactionReceipt;

export async function setupDappURL(
  client: MudWeb3Client,
  args: SetupDappURLParameters
) {
  return client.systemWrite({
    systemAddress:
      eveworld.namespaces.evefrontier.systems.EntityRecordSystem.systemId,
    abi: ssuAbi,
    functionName: "setDappURL",
    args: [args.ssuId, args.dappUrl],
  });
}

export type GetContractAddressParameters = {
  ssuSystemId: Hex;
};

export type GetContractAddressReturnType = Hex;

export async function getContractAddress(
  client: MudWeb3Client,
  args: GetContractAddressParameters
): Promise<Hex> {
  return client.systemSimulate<SsuAbi, "getContractAddress">({
    abi: ssuAbi,
    functionName: "getContractAddress",
    systemAddress: args.ssuSystemId,
    args: [],
  });
}

export type IsSystemAllowedParameters = {
  ssuId: bigint;
  ssuSystemId: Hex;
};

export type IsSystemAllowedReturnType = boolean;

export async function isSystemAllowed(
  client: MudWeb3Client,
  args: IsSystemAllowedParameters
): Promise<boolean> {
  return client.systemSimulate<SsuAbi, "isSystemAllowed">({
    abi: ssuAbi,
    functionName: "isSystemAllowed",
    systemAddress: args.ssuSystemId,
    args: [args.ssuId],
  });
}
