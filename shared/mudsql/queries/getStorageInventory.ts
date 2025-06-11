import { MudSqlClient } from "../client";
import { Inventory } from "../types";

type CapacityDbRow = {
  smartObjectId: string;
  capacity: string;
  usedCapacity: string;
};

type ItemDbRow = {
  smartObjectId: string;
  itemObjectId: string;
  quantity: string;
  index: string;
  entity__smartObjectId: string;
  entity__exists: boolean;
  entity__tenantId: string;
  entity__typeId: string;
  entity__itemId: string;
  entity__volume: string;
};

export const getStorageInventory =
  (client: MudSqlClient) =>
  async (id: string): Promise<Inventory> => {
    const [capacity, items] = await client.selectFromBatch<
      [CapacityDbRow, ItemDbRow]
    >([
      {
        ns: "evefrontier",
        table: "Inventory",
        options: {
          where: `"evefrontier__Inventory"."smartObjectId" = '${id}'`,
        },
      },
      {
        ns: "evefrontier",
        table: "InventoryItem",
        options: {
          where: `"evefrontier__InventoryItem"."smartObjectId" = '${id}' AND "evefrontier__InventoryItem"."exists" = true`,
          orderBy: "index",
          rels: {
            entity: {
              ns: "evefrontier",
              table: "EntityRecord",
              field: "smartObjectId",
              fkNs: "evefrontier",
              fkTable: "InventoryItem",
              fkField: "itemObjectId",
            },
          },
        },
      },
    ]);

    return {
      used: capacity[0]?.usedCapacity || "0",
      total: capacity[0]?.capacity || "0",
      items: items.map((i) => ({
        itemId: i.itemObjectId,
        quantity: i.quantity,
        typeId: i.entity__typeId,
      })),
    };
  };
