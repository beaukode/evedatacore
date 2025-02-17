import { encodeFunctionData, Hex, TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";
import { worldAbi } from "../../abi";

export type GateSetSystemParameters = {
  gateId: bigint;
  systemId: Hex;
};

export type GateSetSystemReturnType = TransactionReceipt;

export async function gateSetSystem(
  client: WorldWriteClient,
  args: GateSetSystemParameters
): Promise<GateSetSystemReturnType> {
  const data = encodeFunctionData({
    abi: worldAbi,
    functionName: "configureSmartGate",
    args: [args.gateId, args.systemId],
  });
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartGateSystem.systemId,
    data,
  });
}
