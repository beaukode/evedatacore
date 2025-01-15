import { MudSqlClient } from "../client";
import { ensureArray, toSqlHex } from "../utils";
import { Hex } from "viem";

type DbRow = {
  characterId: string;
  characterAddress: Hex;
  corpId: string;
  createdAt: string;
  entity__entityId: string;
  entity__name: string;
  entity__dappURL?: string;
  entity__description?: string;
};

type Character = {
  address: Hex;
  id: string;
  name: string;
  corpId: number;
  createdAt: number;
};

type ListCharactersOptions = {
  addresses?: string[] | string;
  ids?: string[] | string;
};

export const listCharacters =
  (client: MudSqlClient) =>
  async (options?: ListCharactersOptions): Promise<Character[]> => {
    let where: string | undefined = undefined;
    if (options?.addresses) {
      const addresses = ensureArray(options.addresses);
      if (addresses.length === 0) return []; // No addresses to query
      where = `"characterAddress" IN ('${addresses.map(toSqlHex).join("', '")}')`;
    } else if (options?.ids) {
      const ids = ensureArray(options.ids);
      if (ids.length === 0) return []; // No ids to query
      where = `"characterId" IN ('${ids.join("', '")}')`;
    }

    return client
      .selectFrom<DbRow>("eveworld", "CharactersTable", {
        where: where,
        orderBy: "createdAt",
        orderDirection: "DESC",
        rels: {
          entity: {
            ns: "eveworld",
            table: "EntityRecordOffc",
            field: "entityId",
            fkNs: "eveworld",
            fkTable: "CharactersTable",
            fkField: "characterId",
          },
        },
      })
      .then((result) =>
        result.map((c) => ({
          address: c.characterAddress,
          id: c.characterId,
          name: c.entity__name,
          corpId: Number.parseInt(c.corpId, 10),
          createdAt: Number.parseInt(c.createdAt, 10) * 1000,
        }))
      );
  };
