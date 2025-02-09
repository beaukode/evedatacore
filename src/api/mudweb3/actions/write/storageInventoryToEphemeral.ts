import { encodeFunctionData, Hex, TransactionReceipt } from "viem";
import { InventoryItemTransfert, WorldWriteClient } from "../../types";
import { eveworld } from "../../eveworld";
import { systemWrite } from "./systemWrite";
import { worldAbi } from "../../abi";

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
  const data = encodeFunctionData({
    abi: worldAbi,
    functionName: "inventoryToEphemeralTransfer",
    args: [
      args.storageId,
      args.to,
      args.transferts.map(({ inventoryItemId, quantity }) => ({
        inventoryItemId,
        owner: client.writeClient.account.address,
        quantity,
      })),
    ],
  });
  return systemWrite(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.InventoryInteractSystem.systemId,
    data,
  });
}
