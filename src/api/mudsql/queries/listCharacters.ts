import { client } from "..";
import { ensureArray, toSqlHex } from "../utils";
import { Hex } from "viem";

type DbRow = {
  characterAddress: Hex;
  characterId: string;
  entity__entityId: string;
  entity__name: string;
  entity__dappURL: string;
  entity__description: string;
};

type Character = {
  address: Hex;
  id: string;
  name: string;
};

type ListCharactersOptions = {
  addresses?: string[] | string;
  orderBy?: "name" | "owner";
};

export function listCharacters(
  options?: ListCharactersOptions
): Promise<Character[]> {
  const where = options?.addresses
    ? `"characterAddress" IN ('${ensureArray(options.addresses).map(toSqlHex).join("', '")}')`
    : undefined;

  return client
    .selectFrom<DbRow>("eveworld", "CharactersByAddr", {
      where,
      rels: {
        entity: {
          ns: "eveworld",
          table: "EntityRecordOffc",
          field: "entityId",
          fkNs: "eveworld",
          fkTable: "CharactersByAddr",
          fkField: "characterId",
        },
      },
    })
    .then((result) =>
      result.map((r) => ({
        address: r.characterAddress,
        id: r.characterId,
        name: r.entity__name,
      }))
    );
}
