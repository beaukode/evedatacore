import { hexToResource } from "@latticexyz/common";
import { client } from "..";
import { ensureArray, toSqlHex } from "../utils";
import { Hex } from "viem";

type DbRow = {
  namespaceId: Hex;
  owner: Hex;
};

export function listNamespaces(filters?: { owners: string[] | string }) {
  const where = filters?.owners
    ? `"owner" IN ('${ensureArray(filters.owners).map(toSqlHex).join("', '")}')`
    : undefined;

  return client
    .selectFrom<DbRow>("world", "NamespaceOwner", where)
    .then((result) =>
      result.map((r) => ({
        namespaceId: r.namespaceId,
        name: hexToResource(r.namespaceId).namespace,
        owner: r.owner,
      }))
    );
}
