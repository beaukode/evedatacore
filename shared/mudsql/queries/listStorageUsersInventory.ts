import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { groupBy, keyBy } from "lodash-es";
import { UsersInventory } from "../types";

type CapacityDbRow = {
  smartObjectId: string;
  ephemeralOwner: Hex;
  capacity: string;
  usedCapacity: string;
  character__account: string;
  character__smartObjectId: string;
  entity__entityId: string;
  entity__name: string;
};

type ItemDbRow = {
  smartObjectId: string;
  ephemeralOwner: Hex;
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

export const listStorageUsersInventory =
  (client: MudSqlClient) =>
  async (ssuId: string): Promise<UsersInventory[]> => {
    const [capacities, items] = await client.selectFromBatch<
      [CapacityDbRow, ItemDbRow]
    >([
      {
        ns: "evefrontier",
        table: "EphemeralInvento",
        options: {
          where: `"evefrontier__EphemeralInvento"."smartObjectId" = '${ssuId}'`,
          rels: {
            character: {
              ns: "evefrontier",
              table: "CharactersByAcco",
              field: "account",
              fkNs: "evefrontier",
              fkTable: "EphemeralInvento",
              fkField: "ephemeralOwner",
            },
            entity: {
              ns: "evefrontier",
              table: "EntityRecordMeta",
              field: "smartObjectId",
              fkNs: "evefrontier",
              fkTable: "CharactersByAcco",
              fkField: "smartObjectId",
            },
          },
        },
      },
      {
        ns: "evefrontier",
        table: "EphemeralInvItem",
        options: {
          where: `"evefrontier__EphemeralInvItem"."smartObjectId" = '${ssuId}' AND "evefrontier__EphemeralInvItem"."exists" = true`,
          orderBy: ["ephemeralOwner", "index"],
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

    const capacitiesByOwner = keyBy(capacities, "character__account");
    const itemsByOwner = groupBy(items, "ephemeralOwner");
    const entityById = keyBy(entities, "smartObjectId");

    return Object.entries(itemsByOwner).map(([owner, items]) => {
      const capacity = capacitiesByOwner[owner];
      return {
        ownerId: owner as Hex,
        ownerName: capacity?.entity__name,
        used: capacity?.usedCapacity || "0",
        total: capacity?.capacity || "0",
        items: items.map((i) => ({
          itemId: i.itemObjectId,
          quantity: i.quantity,
          typeId: entityById[i.itemObjectId]?.typeId || "",
        })),
      };
    });
  };
