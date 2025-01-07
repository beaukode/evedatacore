import { hexToResource } from "@latticexyz/common";
import { client } from "..";
import { Hex } from "viem";
import { listCharacters } from "./listCharacters";
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

  const characters = await listCharacters({ addresses: [ns.owner] });
  const owner = characters[0];

  return {
    namespaceId: ns.namespaceId,
    name: hexToResource(ns.namespaceId).namespace,
    owner: ns.owner,
    ownerName: owner?.name,
  };
}
