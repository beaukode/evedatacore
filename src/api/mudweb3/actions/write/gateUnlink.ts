import { encodeFunctionData, TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";
import { worldAbi } from "../../abi";

export type GateUnlinkParameters = {
  gateId: bigint;
  destinationGateId: bigint;
};

export type GateUnlinkReturnType = TransactionReceipt;

export async function gateUnlink(
  client: WorldWriteClient,
  args: GateUnlinkParameters
): Promise<GateUnlinkReturnType> {
  const data = encodeFunctionData({
    abi: worldAbi,
    functionName: "unlinkSmartGates",
    args: [args.gateId, args.destinationGateId],
  });
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartGateSystem.systemId,
    data,
  });
}
