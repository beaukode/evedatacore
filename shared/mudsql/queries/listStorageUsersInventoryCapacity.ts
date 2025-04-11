import { MudSqlClient } from "../client";
import { UserInventoryCapacity } from "../types";

type DbRow = {
  smartObjectId: string;
  capacity: string;
  usage__smartObjectId: string;
  usage__ephemeralOwner: string;
  usage__usedCapacity: string;
  usage_capacity: string;
  character__account: string;
  character__smartObjectId: string;
  entity__entityId: string;
  entity__name: string;
};

export const listStorageUsersInventoryCapacity =
  (client: MudSqlClient) =>
  async (ssuId: string): Promise<UserInventoryCapacity[]> => {
    const records = await client.selectFrom<DbRow>(
      "evefrontier",
      "EphemeralInvCapa",
      {
        where: `"evefrontier__EphemeralInvCapa"."smartObjectId" = '${ssuId}'`,
        rels: {
          usage: {
            ns: "evefrontier",
            table: "EphemeralInvento",
            field: "smartObjectId",
            fkNs: "evefrontier",
            fkTable: "EphemeralInvCapa",
            fkField: "smartObjectId",
          },
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
      }
    );
    return records.map((r) => ({
      ownerId: r.character__account,
      ownerName: r.entity__name,
      used: r.usage__usedCapacity,
      total: r.capacity,
    }));
  };
