import { Hex, TransactionReceipt } from "viem";
import { InventoryItemTransfert, WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";

export type StorageInventoryToEphemeralParameters = {
  storageId: bigint;
  to: Hex;
  transferts: InventoryItemTransfert[];
};

export type StorageInventoryToEphemeralReturnType = TransactionReceipt;

export async function storageInventoryToEphemeral(
  client: WorldWriteClient,
  args: StorageInventoryToEphemeralParameters
): Promise<StorageInventoryToEphemeralReturnType> {
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.evefrontier.systems.EphemeralInteractSystem.systemId,
    functionName: "transferToEphemeral",
    args: [
      args.storageId,
      args.to,
      args.transferts.map(({ inventoryItemId, quantity }) => ({
        smartObjectId: inventoryItemId,
        quantity,
      })),
    ],
  });
}
