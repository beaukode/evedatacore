import { MudSqlClient } from "../client";
import { InventoryCapacity } from "../types";

type DbRow = {
  smartObjectId: string;
  capacity: string;
  usedCapacity: string;
};

export const getStorageInventoryCapacity =
  (client: MudSqlClient) =>
  async (id: string): Promise<InventoryCapacity> => {
    const records = await client.selectFrom<DbRow>(
      "evefrontier",
      "Inventory",
      {
        where: `"evefrontier__Inventory"."smartObjectId" = '${id}'`,
      }
    );

    const record = records[0];
    if (record) {
      return { used: record.usedCapacity, total: record.capacity };
    } else {
      return { used: "0", total: "0" };
    }
  };
