import { encodeFunctionData, TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";
import { worldAbi } from "../../abi";

export type GateLinkParameters = {
  gateId: bigint;
  destinationGateId: bigint;
};

export type GateLinkReturnType = TransactionReceipt;

export async function gateLink(
  client: WorldWriteClient,
  args: GateLinkParameters
): Promise<GateLinkReturnType> {
  const data = encodeFunctionData({
    abi: worldAbi,
    functionName: "linkSmartGates",
    args: [args.gateId, args.destinationGateId],
  });
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartGateSystem.systemId,
    data,
  });
}
