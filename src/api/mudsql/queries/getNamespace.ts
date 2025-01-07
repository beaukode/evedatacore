import { hexToResource } from "@latticexyz/common";
import { client, getCharacter } from "..";
import { Hex } from "viem";
import { toSqlHex } from "../utils";

type DbRow = {
  namespaceId: Hex;
  owner: Hex;
};

type Namespace = {
  namespaceId: Hex;
  name: string;
  owner: Hex;
  ownerName?: string;
};

export async function getNamespace(id: string): Promise<Namespace | undefined> {
  if (id.length !== 66) return undefined;

  const result = await client.selectFrom<DbRow>("world", "NamespaceOwner", {
    where: `"namespaceId" = '${toSqlHex(id)}'`,
  });

  const ns = result[0];
  if (!ns) return undefined;

  const owner = await getCharacter(ns.owner);

  return {
    namespaceId: ns.namespaceId,
    name: hexToResource(ns.namespaceId).namespace,
    owner: ns.owner,
    ownerName: owner?.name,
  };
}
