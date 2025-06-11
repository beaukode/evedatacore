import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { Inventory } from "../types";
import { toSqlHex } from "../utils";

type DbRow = {
  smartObjectId: string;
  itemObjectId: string;
  quantity: string;
  index: string;
  stateUpdate: string;
};

export const getUserInventory =
  (client: MudSqlClient) =>
  async (ssuId: string, owner: Hex): Promise<Inventory> => {
    const [items] = await Promise.all([
      client.selectFrom<DbRow>("evefrontier", "EphemeralInvItem", {
        where: `"evefrontier__EphemeralInvItem"."smartObjectId" = '${ssuId}' AND "evefrontier__EphemeralInvItem"."ephemeralOwner" = '${toSqlHex(owner)}' AND "evefrontier__InventoryItem"."exists" = true`,
        orderBy: ["index"],
      }),
    ]);

    return {
      total: "0",
      used: "0",
      items: items.map((i) => ({
        itemId: i.itemObjectId,
        quantity: i.quantity,
      })),
    };
  };
