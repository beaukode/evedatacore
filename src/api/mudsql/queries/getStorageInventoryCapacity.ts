import { MudSqlClient } from "../client";

type DbRow = {
  smartObjectId: string;
  capacity: string;
  usedCapacity: string;
};

type Capacity = { used: string; total: string };

export const getStorageInventoryCapacity =
  (client: MudSqlClient) =>
  async (id: string): Promise<Capacity> => {
    const records = await client.selectFrom<DbRow>(
      "eveworld",
      "InventoryTable",
      {
        where: `"eveworld__InventoryTable"."smartObjectId" = '${id}'`,
      }
    );

    const record = records[0];
    if (record) {
      return { used: record.usedCapacity, total: record.capacity };
    } else {
      return { used: "0", total: "0" };
    }
  };
