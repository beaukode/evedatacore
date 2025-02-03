import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { groupBy, keyBy } from "lodash-es";
import { UsersInventory } from "../types";

type DbRow = {
  smartObjectId: string;
  inventoryItemId: string;
  ephemeralInvOwner: Hex;
  quantity: string;
  index: string;
  stateUpdate: string;
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
        ownerId: owner as Hex,
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
