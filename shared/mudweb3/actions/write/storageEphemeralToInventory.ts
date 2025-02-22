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
      eveworld.namespaces.eveworld.systems.InventoryInteractSystem.systemId,
    functionName: "ephemeralToInventoryTransfer",
    args: [
      args.storageId,
      args.transferts.map(({ inventoryItemId, quantity }) => ({
        inventoryItemId,
        owner: client.writeClient.account.address,
        quantity,
      })),
    ],
  });
}
