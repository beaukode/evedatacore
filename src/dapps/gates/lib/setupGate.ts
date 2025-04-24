import { encodeFunctionData, TransactionReceipt, Hex } from "viem";
import { MudWeb3Client, eveworld } from "@shared/mudweb3";
import { gatesAbi } from "./abi";

export type SetupGateParameters = {
  gateId: bigint;
  dappUrl: string;
  accessSystemId: Hex;
  configSystemId: Hex;
};

export type SetupGateReturnType = TransactionReceipt;

export async function setupGate(
  client: MudWeb3Client,
  args: SetupGateParameters
): Promise<SetupGateReturnType> {
  const setDappURLCall = encodeFunctionData({
    abi: gatesAbi,
    functionName: "setDappURL",
    args: [args.gateId, args.dappUrl],
  });
  const configureSmartGateCall = encodeFunctionData({
    abi: gatesAbi,
    functionName: "configureSmartGate",
    args: [args.gateId, args.accessSystemId],
  });
  const configureGateConfigCall = encodeFunctionData({
    abi: gatesAbi,
    functionName: "setDefaultRule",
    args: [args.gateId, true],
  });

  return client.systemWriteBatch({
    calls: [
      {
        systemId:
          eveworld.namespaces.eveworld.systems.EntityRecordSystem.systemId,
        callData: setDappURLCall,
      },
      {
        systemId: eveworld.namespaces.eveworld.systems.SmartGateSystem.systemId,
        callData: configureSmartGateCall,
      },
      {
        systemId: args.configSystemId,
        callData: configureGateConfigCall,
      },
    ],
  });
}
