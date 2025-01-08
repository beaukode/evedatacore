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

export type Namespace = {
  namespaceId: Hex;
  name: string;
  owner: Hex;
  ownerName?: string;
};

type ListNamespacesOptions = {
  owners?: string[] | string;
  ids?: string[] | string;
};

export async function listNamespaces(
  options?: ListNamespacesOptions
): Promise<Namespace[]> {
  const where = [
    `"namespaceId" <> '\\x6e73000000000000000000000000000000000000000000000000000000000000'`, // exclude the null namespace
  ];
  if (options?.owners) {
    where.push(
      `"owner" IN ('${ensureArray(options.owners).map(toSqlHex).join("', '")}')`
    );
  }
  if (options?.ids) {
    where.push(
      `"namespaceId" IN ('${ensureArray(options.ids).map(toSqlHex).join("', '")}')`
    );
  }

  const result = await client.selectFrom<DbRow>("world", "NamespaceOwner", {
    where: where.join(" AND "),
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
