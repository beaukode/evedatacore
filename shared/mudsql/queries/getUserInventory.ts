import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { Inventory } from "../types";
import { toSqlHex } from "../utils";

type DbRow = {
  smartObjectId: string;
  inventoryItemId: string;
  quantity: string;
  index: string;
  stateUpdate: string;
};

export const getUserInventory =
  (client: MudSqlClient) =>
  async (ssuId: string, owner: Hex): Promise<Inventory> => {
    const [items] = await Promise.all([
      client.selectFrom<DbRow>("eveworld", "EphemeralInvItem", {
        where: `"eveworld__EphemeralInvItem"."smartObjectId" = '${ssuId}' AND "eveworld__EphemeralInvItem"."ephemeralInvOwner" = '${toSqlHex(owner)}'`,
        orderBy: ["index"],
      }),
    ]);

    return {
      total: "0",
      used: "0",
      items: items.map((i) => ({
        itemId: i.inventoryItemId,
        quantity: i.quantity,
        stateUpdate: Number.parseInt(i.stateUpdate, 10) * 1000,
      })),
    };
  };
