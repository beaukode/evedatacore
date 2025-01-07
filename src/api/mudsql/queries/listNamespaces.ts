import { hexToResource } from "@latticexyz/common";
import { keyBy } from "lodash-es";
import { client } from "..";
import { ensureArray, toSqlHex } from "../utils";
import { Hex } from "viem";
import { listCharacters } from "./listCharacters";

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

type ListNamespacesOptions = {
  owners?: string[] | string;
};

export async function listNamespaces(
  options?: ListNamespacesOptions
): Promise<Namespace[]> {
  const where = options?.owners
    ? `"owner" IN ('${ensureArray(options.owners).map(toSqlHex).join("', '")}') AND "namespaceId" <> '\\x6e73000000000000000000000000000000000000000000000000000000000000'`
    : `"namespaceId" <> '\\x6e73000000000000000000000000000000000000000000000000000000000000'`; // exclude the null namespace

  const result = await client.selectFrom<DbRow>("world", "NamespaceOwner", {
    where,
    orderBy: "namespaceId",
  });

  const owners = [...new Set(result.map((r) => r.owner))];

  const characters = await listCharacters({ addresses: owners });
  const charactersByAddress = keyBy(characters, "address");

  return result.map((r) => ({
    namespaceId: r.namespaceId,
    name: hexToResource(r.namespaceId).namespace,
    owner: r.owner,
    ownerName: charactersByAddress[r.owner]?.name,
  }));
}
