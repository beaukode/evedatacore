import { Hex } from "viem";
import { keyBy } from "lodash-es";
import { MudSqlClient } from "../client";
import { Inventory } from "../types";
import { toSqlHex } from "../utils";

type DbRow = {
  smartObjectId: string;
  ephemeralOwner: Hex;
  itemObjectId: string;
  exists: boolean;
  quantity: string;
  index: string;
  stateUpdate: string;
};

type EntityDbRow = {
  smartObjectId: string;
  exists: boolean;
  tenantId: string;
  typeId: string;
  itemId: string;
  volume: string;
};

export const getUserInventory =
  (client: MudSqlClient) =>
  async (ssuId: string, owner: Hex): Promise<Inventory> => {
    const [items] = await Promise.all([
      client.selectFrom<DbRow>("evefrontier", "EphemeralInvItem", {
        where: `"evefrontier__EphemeralInvItem"."smartObjectId" = '${ssuId}' AND "evefrontier__EphemeralInvItem"."ephemeralOwner" = '${toSqlHex(owner)}' AND "evefrontier__EphemeralInvItem"."exists" = true`,
        orderBy: ["index"],
      }),
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
      total: "0",
      used: "0",
      items: items.map((i) => ({
        itemId: i.smartObjectId,
        typeId: entityById[i.itemObjectId]?.typeId || "",
        quantity: i.quantity,
      })),
    };
  };
