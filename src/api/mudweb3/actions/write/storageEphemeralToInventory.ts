import { TransactionReceipt } from "viem";
import { InventoryItemTransfert, WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";

export type StorageEphemeralToInventoryParameters = {
  storageId: bigint;
  transferts: InventoryItemTransfert[];
};

export type StorageEphemeralToInventoryReturnType = TransactionReceipt;

export async function storageEphemeralToInventory(
  client: WorldWriteClient,
  args: StorageEphemeralToInventoryParameters
): Promise<StorageEphemeralToInventoryReturnType> {
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.evefrontier.systems.EphemeralInteractSystem.systemId,
    functionName: "transferFromEphemeral",
    args: [
      args.storageId,
      client.writeClient.account.address,
      args.transferts.map(({ inventoryItemId, quantity }) => ({
        smartObjectId: inventoryItemId,
        quantity,
      })),
    ],
  });
}
