import { hexToResource } from "@latticexyz/common";
import { keyBy } from "lodash-es";
import { ensureArray, toSqlHex } from "../utils";
import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { Namespace } from "../types";

type DbRow = {
  namespaceId: Hex;
  owner: Hex;
};

type ListNamespacesOptions = {
  owners?: string[] | string;
  ids?: string[] | string;
};

export const listNamespaces =
  (client: MudSqlClient) =>
  async (options?: ListNamespacesOptions): Promise<Namespace[]> => {
    const where = [
      `"namespaceId" <> '\\x6e73000000000000000000000000000000000000000000000000000000000000'`, // exclude the null namespace
    ];
    if (options?.owners) {
      const owners = ensureArray(options.owners);
      if (owners.length === 0) return []; // No owners to query
      where.push(`"owner" IN ('${owners.map(toSqlHex).join("', '")}')`);
    }
    if (options?.ids) {
      const ids = ensureArray(options.ids);
      if (ids.length === 0) return []; // No ids to query
      where.push(`"namespaceId" IN ('${ids.map(toSqlHex).join("', '")}')`);
    }

    const result = await client.selectFrom<DbRow>("world", "NamespaceOwner", {
      where: where.join(" AND "),
      orderBy: "namespaceId",
    });

    const owners = [...new Set(result.map((r) => r.owner))];

    const characters = await client.listCharacters({ addresses: owners });
    const charactersByAddress = keyBy(characters, "address");

    return result.map((r) => ({
      namespaceId: r.namespaceId,
      name: hexToResource(r.namespaceId).namespace,
      owner: r.owner,
      ownerName: charactersByAddress[r.owner]?.name,
    }));
  };
