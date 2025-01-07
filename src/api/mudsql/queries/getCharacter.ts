import { Hex, isHex } from "viem";
import { client } from "..";
import { toSqlHex } from "../utils";

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

export async function getCharacter(id: string): Promise<Character | undefined> {
  if (id.length !== 66 || !isHex(id)) return undefined;

  const result = await client.selectFrom<DbRow>(
    "eveworld",
    "CharactersByAddr",
    {
      where: `"characterAddress" = '${toSqlHex(id)}'`,
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
    }
  );

  const c = result[0];
  if (!c) return undefined;

  return {
    address: c.characterAddress,
    id: c.characterId,
    name: c.entity__name,
  };
}
