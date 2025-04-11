import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { groupBy, keyBy } from "lodash-es";
import { UsersInventory } from "../types";

type DbRow = {
  smartObjectId: string;
  itemObjectId: string;
  ephemeralOwner: Hex;
  quantity: string;
  index: string;
};

export const listStorageUsersInventory =
  (client: MudSqlClient) =>
  async (ssuId: string): Promise<UsersInventory[]> => {
    const [capacities, items] = await Promise.all([
      client.listStorageUsersInventoryCapacity(ssuId),
      client.selectFrom<DbRow>("evefrontier", "EphemeralInvItem", {
        where: `"evefrontier__EphemeralInvItem"."smartObjectId" = '${ssuId}' AND "evefrontier__EphemeralInvItem"."exists" = true`,
        orderBy: ["ephemeralOwner", "index"],
      }),
    ]);

    const capacitiesByOwner = keyBy(capacities, "ownerId");
    const itemsByOwner = groupBy(items, "ephemeralOwner");

    return Object.entries(itemsByOwner).map(([owner, items]) => {
      const capacity = capacitiesByOwner[owner];
      return {
        ownerId: owner as Hex,
        ownerName: capacity?.ownerName,
        used: capacity?.used || "0",
        total: capacity?.total || "0",
        items: items.map((i) => ({
          itemId: i.itemObjectId,
          quantity: i.quantity,
        })),
      };
    });
  };
