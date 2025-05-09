import { encodeFunctionData, TransactionReceipt, Hex } from "viem";
import { MudWeb3Client } from "@shared/mudweb3";
import { gatesAbi } from "./abi";

export type UpdateConfigParameters = {
  gateId: bigint;
  defaultRule?: boolean;
  addCharacters?: bigint[];
  removeCharacters?: bigint[];
  addCorporations?: bigint[];
  removeCorporations?: bigint[];
  configSystemId: Hex;
};

export type UpdateConfigReturnType = TransactionReceipt;

type CallParameters = {
  systemId: Hex;
  callData: Hex;
};

export async function updateConfig(
  client: MudWeb3Client,
  args: UpdateConfigParameters
): Promise<UpdateConfigReturnType> {
  const calls: Array<CallParameters> = [];

  if (args.defaultRule !== undefined) {
    calls.push({
      systemId: args.configSystemId,
      callData: encodeFunctionData({
        abi: gatesAbi,
        functionName: "setDefaultRule",
        args: [args.gateId, args.defaultRule],
      }),
    });
  }

  for (const character of args.addCharacters ?? []) {
    calls.push({
      systemId: args.configSystemId,
      callData: encodeFunctionData({
        abi: gatesAbi,
        functionName: "addCharacterException",
        args: [args.gateId, character],
      }),
    });
  }

  for (const character of args.removeCharacters ?? []) {
    calls.push({
      systemId: args.configSystemId,
      callData: encodeFunctionData({
        abi: gatesAbi,
        functionName: "removeCharacterException",
        args: [args.gateId, character],
      }),
    });
  }

  for (const corporation of args.addCorporations ?? []) {
    calls.push({
      systemId: args.configSystemId,
      callData: encodeFunctionData({
        abi: gatesAbi,
        functionName: "addCorpException",
        args: [args.gateId, corporation],
      }),
    });
  }

  for (const corporation of args.removeCorporations ?? []) {
    calls.push({
      systemId: args.configSystemId,
      callData: encodeFunctionData({
        abi: gatesAbi,
        functionName: "removeCorpException",
        args: [args.gateId, corporation],
      }),
    });
  }

  return client.systemWriteBatch({
    calls,
  });
}
