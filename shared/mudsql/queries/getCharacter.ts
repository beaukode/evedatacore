import { Hex, isHex } from "viem";
import { MudSqlClient } from "../client";
import { toSqlHex } from "../utils";
import { Character } from "../types";

type DbRow = {
  smartObjectId: string;
  characterAddress: Hex;
  tribeId: string;
  createdAt: string;
  entity__entityId: string;
  entity__name: string;
  entity__dappURL: string;
  entity__description: string;
};

type AccountDbRow = {
  smartObjectId: string;
  account: Hex;
};

export const getCharacter =
  (client: MudSqlClient) =>
  async (address: string): Promise<Character | undefined> => {
    if (address.length !== 42 || !isHex(address)) return undefined;
    const ownership = await client
      .selectFrom<AccountDbRow>("evefrontier", "CharactersByAcco", {
        where: `"account" = '${toSqlHex(address)}'`,
      })
      .then((r) => r[0]);
    if (!ownership) return undefined;
    const result = await client.selectFrom<DbRow>("evefrontier", "Characters", {
      where: `"evefrontier__Characters"."smartObjectId" = '${ownership.smartObjectId}'`,
      rels: {
        entity: {
          ns: "evefrontier",
          table: "EntityRecordMeta",
          field: "smartObjectId",
          fkNs: "evefrontier",
          fkTable: "Characters",
          fkField: "smartObjectId",
        },
      },
    });

    const c = result[0];
    if (!c) return undefined;

    return {
      address,
      id: c.smartObjectId,
      name: c.entity__name,
      corpId: Number.parseInt(c.tribeId, 10),
      createdAt: Number.parseInt(c.createdAt, 10) * 1000,
    };
  };
