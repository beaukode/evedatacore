import { MudSqlClient } from "../client";
import { Inventory } from "../types";

type DbRow = {
  smartObjectId: string;
  itemObjectId: string;
  quantity: string;
  index: string;
};

export const getStorageInventory =
  (client: MudSqlClient) =>
  async (id: string): Promise<Inventory> => {
    const [capacity, items] = await Promise.all([
      client.getStorageInventoryCapacity(id),
      client.selectFrom<DbRow>("evefrontier", "InventoryItem", {
        where: `"evefrontier__InventoryItem"."smartObjectId" = '${id}' AND "evefrontier__InventoryItem"."exists" = true`,
        orderBy: "index",
      }),
    ]);

    return {
      ...capacity,
      items: items.map((i) => ({
        itemId: i.itemObjectId,
        quantity: i.quantity,
      })),
    };
  };
