import { MudSqlClient } from "../client";

type DbRow = {
  smartObjectId: string;
  capacity: string;
  usage__smartObjectId: string;
  usage__ephemeralInvOwner: string;
  usage__usedCapacity: string;
  character__characterAddress: string;
  character__characterId: string;
  entity__entityId: string;
  entity__name: string;
};

type UserCapacity = {
  ownerId: string;
  ownerName: string;
  used: string;
  total: string;
};

export const listStorageUsersInventoryCapacity =
  (client: MudSqlClient) =>
  async (ssuId: string): Promise<UserCapacity[]> => {
    const records = await client.selectFrom<DbRow>(
      "eveworld",
      "EphemeralInvCapa",
      {
        where: `"eveworld__EphemeralInvCapa"."smartObjectId" = '${ssuId}'`,
        rels: {
          usage: {
            ns: "eveworld",
            table: "EphemeralInvTabl",
            field: "smartObjectId",
            fkNs: "eveworld",
            fkTable: "EphemeralInvCapa",
            fkField: "smartObjectId",
          },
          character: {
            ns: "eveworld",
            table: "CharactersByAddr",
            field: "characterAddress",
            fkNs: "eveworld",
            fkTable: "EphemeralInvTabl",
            fkField: "ephemeralInvOwner",
          },
          entity: {
            ns: "eveworld",
            table: "EntityRecordOffc",
            field: "entityId",
            fkNs: "eveworld",
            fkTable: "CharactersByAddr",
            fkField: "characterId",
          },
        },
      }
    );
    return records.map((r) => ({
      ownerId: r.character__characterAddress,
      ownerName: r.entity__name,
      used: r.usage__usedCapacity,
      total: r.capacity,
    }));
  };
