import { TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { worldWrite } from "./worldWrite";

export type GateLinkParameters = {
  gateId: bigint;
  destinationGateId: bigint;
};

export type GateLinkReturnType = TransactionReceipt;

export async function gateLink(
  client: WorldWriteClient,
  args: GateLinkParameters
): Promise<GateLinkReturnType> {
  return worldWrite(client, {
    functionName: "evefrontier__linkGates",
    args: [args.gateId, args.destinationGateId],
  });
}
