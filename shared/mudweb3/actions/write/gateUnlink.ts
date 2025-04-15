import { TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";

export type GateUnlinkParameters = {
  gateId: bigint;
  destinationGateId: bigint;
};

export type GateUnlinkReturnType = TransactionReceipt;

export async function gateUnlink(
  client: WorldWriteClient,
  args: GateUnlinkParameters
): Promise<GateUnlinkReturnType> {
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartGateSystem.systemId,
    functionName: "unlinkSmartGates",
    args: [args.gateId, args.destinationGateId],
  });
}
