import { TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";

export type GateLinkParameters = {
  gateId: bigint;
  destinationGateId: bigint;
};

export type GateLinkReturnType = TransactionReceipt;

export async function gateLink(
  client: WorldWriteClient,
  args: GateLinkParameters
): Promise<GateLinkReturnType> {
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.evefrontier.systems.SmartGateSystem.systemId,
    functionName: "linkGates",
    args: [args.gateId, args.destinationGateId],
  });
}
