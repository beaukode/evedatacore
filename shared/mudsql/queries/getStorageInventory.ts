import { keyBy } from "lodash-es";
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
};

type EntityDbRow = {
  smartObjectId: string;
  exists: boolean;
  tenantId: string;
  typeId: string;
  itemId: string;
  volume: string;
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
        },
      },
    ]);

    const ids = items.map((i) => i.itemObjectId);
    const entities = await client.selectFrom<EntityDbRow>(
      "evefrontier",
      "EntityRecord",
      {
        where: `"evefrontier__EntityRecord"."smartObjectId" IN (${ids.join(",")})`,
      }
    );
    const entityById = keyBy(entities, "smartObjectId");

    return {
      used: capacity[0]?.usedCapacity || "0",
      total: capacity[0]?.capacity || "0",
      items: items.map((i) => ({
        itemId: i.itemObjectId,
        quantity: i.quantity,
        typeId: entityById[i.itemObjectId]?.typeId || "",
      })),
    };
  };
