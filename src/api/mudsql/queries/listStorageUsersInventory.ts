import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { groupBy, keyBy } from "lodash-es";

type DbRow = {
  smartObjectId: string;
  inventoryItemId: string;
  ephemeralInvOwner: Hex;
  quantity: string;
  index: string;
  stateUpdate: string;
};

type InventoryItem = {
  itemId: string;
  quantity: string;
  stateUpdate: number;
};

type UsersInventory = {
  ownerId: string;
  ownerName?: string;
  used: string;
  total: string;
  items: InventoryItem[];
};

export const listStorageUsersInventory =
  (client: MudSqlClient) =>
  async (ssuId: string): Promise<UsersInventory[]> => {
    const [capacities, items] = await Promise.all([
      client.listStorageUsersInventoryCapacity(ssuId),
      client.selectFrom<DbRow>("eveworld", "EphemeralInvItem", {
        where: `"eveworld__EphemeralInvItem"."smartObjectId" = '${ssuId}'`,
        orderBy: ["ephemeralInvOwner", "index"],
      }),
    ]);

    const capacitiesByOwner = keyBy(capacities, "ownerId");
    const itemsByOwner = groupBy(items, "ephemeralInvOwner");

    return Object.entries(itemsByOwner).map(([owner, items]) => {
      const capacity = capacitiesByOwner[owner];
      return {
        ownerId: owner,
        ownerName: capacity?.ownerName,
        used: capacity?.used || "0",
        total: capacity?.total || "0",
        items: items.map((i) => ({
          itemId: i.inventoryItemId,
          quantity: i.quantity,
          stateUpdate: Number.parseInt(i.stateUpdate, 10) * 1000,
        })),
      };
    });
  };
