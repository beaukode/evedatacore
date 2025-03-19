import { MudSqlClient } from "../client";
import { Inventory } from "../types";

type DbRow = {
  smartObjectId: string;
  inventoryItemId: string;
  quantity: string;
  index: string;
  stateUpdate: string;
};

export const getStorageInventory =
  (client: MudSqlClient) =>
  async (id: string): Promise<Inventory> => {
    const [capacity, items] = await Promise.all([
      client.getStorageInventoryCapacity(id),
      client.selectFrom<DbRow>("eveworld", "InventoryItemTab", {
        where: `"eveworld__InventoryItemTab"."smartObjectId" = '${id}'`,
        orderBy: "index",
      }),
    ]);

    return {
      ...capacity,
      items: items.map((i) => ({
        itemId: i.inventoryItemId,
        quantity: i.quantity,
        stateUpdate: Number.parseInt(i.stateUpdate, 10) * 1000,
      })),
    };
  };
