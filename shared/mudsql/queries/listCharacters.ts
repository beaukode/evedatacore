import { keyBy } from "lodash-es";
import { MudSqlClient } from "../client";
import { Character } from "../types";
import { ensureArray, toSqlHex } from "../utils";
import { Hex } from "viem";

type DbRow = {
  smartObjectId: string;
  exists: boolean;
  tribeId: string;
  createdAt: string;
};

type OwnershipDbRow = {
  smartObjectId: string;
  account: Hex;
};

type EntityDbRow = {
  smartObjectId: string;
  name: string;
  dappUrL: string;
  description: string;
};

type ListCharactersOptions = {
  addresses?: string[] | string;
  ids?: string[] | string;
  corporationsId?: number[] | number;
};

export const listCharacters =
  (client: MudSqlClient) =>
  async (options?: ListCharactersOptions): Promise<Character[]> => {
    let where: string | undefined = undefined;
    let whereOwnership: string | undefined = undefined;
    if (options?.addresses) {
      const addresses = ensureArray(options.addresses);
      if (addresses.length === 0) return []; // No addresses to query
      whereOwnership = `"evefrontier__OwnershipByObjec"."account" IN ('${addresses.map(toSqlHex).join("', '")}')`;
    } else if (options?.ids) {
      const ids = ensureArray(options.ids);
      if (ids.length === 0) return []; // No ids to query
      where = `"evefrontier__Characters"."smartObjectId" IN ('${ids.join("', '")}')`;
    } else if (options?.corporationsId) {
      const corporationsId = ensureArray(options.corporationsId);
      if (corporationsId.length === 0) return []; // No corporations ids to query
      where = `"evefrontier__Characters"."tribeId" IN ('${corporationsId.join("', '")}')`;
    }

    const [characters, ownerships, entities] = await client.selectFromBatch<
      [DbRow, OwnershipDbRow, EntityDbRow]
    >([
      {
        ns: "evefrontier",
        table: "Characters",
        options: {
          where,
          orderBy: "createdAt",
          orderDirection: "DESC",
        },
      },
      {
        ns: "evefrontier",
        table: "OwnershipByObjec",
        options: { where: whereOwnership },
      },
      {
        ns: "evefrontier",
        table: "EntityRecordMeta",
      },
    ]);

    const ownershipsById = keyBy(ownerships, "smartObjectId");
    const entitiesById = keyBy(entities, "smartObjectId");

    return characters
      .map((c) => {
        const ownership = ownershipsById[c.smartObjectId];
        if (!ownership) {
          return;
        }
        return {
          address: ownership.account,
          id: c.smartObjectId,
          name: entitiesById[c.smartObjectId]?.name || "**Unknown**",
          corpId: Number.parseInt(c.tribeId, 10),
          createdAt: Number.parseInt(c.createdAt, 10) * 1000,
        };
      })
      .filter((c) => c !== undefined);
  };
