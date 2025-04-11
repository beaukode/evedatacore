import { keyBy } from "lodash-es";
import { MudSqlClient } from "../client";
import { Character } from "../types";
import { ensureArray, toSqlHex } from "../utils";

type DbRow = {
  smartObjectId: string;
  tribeId: string;
  createdAt: string;
  entity__entityId: string;
  entity__name: string;
  entity__dappURL?: string;
  entity__description?: string;
};

type EntityDbRow = {
  entityId: string;
  name: string;
  dappURL: string;
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
    if (options?.addresses) {
      const addresses = ensureArray(options.addresses);
      if (addresses.length === 0) return []; // No addresses to query
      where = `"evefrontier__OwnershipByObjec"."smartObjectId" IN ('${addresses.map(toSqlHex).join("', '")}')`;
    } else if (options?.ids) {
      const ids = ensureArray(options.ids);
      if (ids.length === 0) return []; // No ids to query
      where = `"evefrontier__Characters"."smartObjectId" IN ('${ids.join("', '")}')`;
    } else if (options?.corporationsId) {
      const corporationsId = ensureArray(options.corporationsId);
      if (corporationsId.length === 0) return []; // No corporations ids to query
      where = `"evefrontier__Characters"."tribeId" IN ('${corporationsId.join("', '")}')`;
    }

    const [characters, entities] = await client.selectFromBatch<
      [DbRow, EntityDbRow]
    >([
      {
        ns: "eveworld",
        table: "CharactersTable",
        options: { where, orderBy: "createdAt", orderDirection: "DESC" },
      },
      {
        ns: "eveworld",
        table: "EntityRecordOffc",
      },
    ]);

    const entitiesById = keyBy(entities, "entityId");

    return characters.map((c) => ({
      address: c.characterAddress,
      id: c.characterId,
      name: entitiesById[c.characterId]?.name || "**Unknown**",
      corpId: Number.parseInt(c.corpId, 10),
      createdAt: Number.parseInt(c.createdAt, 10) * 1000,
    }));
  };
