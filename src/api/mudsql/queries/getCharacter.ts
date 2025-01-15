import { Hex, isHex } from "viem";
import { MudSqlClient } from "../client";
import { toSqlHex } from "../utils";

type DbRow = {
  characterId: string;
  characterAddress: Hex;
  corpId: string;
  createdAt: string;
  entity__entityId: string;
  entity__name: string;
  entity__dappURL: string;
  entity__description: string;
};

type Character = {
  address: Hex;
  id: string;
  name: string;
  corpId: number;
  createdAt: number;
};

export const getCharacter =
  (client: MudSqlClient) =>
  async (address: string): Promise<Character | undefined> => {
    if (address.length !== 42 || !isHex(address)) return undefined;
    const result = await client.selectFrom<DbRow>(
      "eveworld",
      "CharactersTable",
      {
        where: `"characterAddress" = '${toSqlHex(address)}'`,
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
      }
    );

    const c = result[0];
    if (!c) return undefined;

    return {
      address: c.characterAddress,
      id: c.characterId,
      name: c.entity__name,
      corpId: Number.parseInt(c.corpId, 10),
      createdAt: Number.parseInt(c.createdAt, 10) * 1000,
    };
  };
