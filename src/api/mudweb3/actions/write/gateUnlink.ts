import { TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { worldWrite } from "./worldWrite";

export type GateUnlinkParameters = {
  gateId: bigint;
  destinationGateId: bigint;
};

export type GateUnlinkReturnType = TransactionReceipt;

export async function gateUnlink(
  client: WorldWriteClient,
  args: GateUnlinkParameters
): Promise<GateUnlinkReturnType> {
  return worldWrite(client, {
    functionName: "evefrontier__unlinkGates",
    args: [args.gateId, args.destinationGateId],
  });
}
