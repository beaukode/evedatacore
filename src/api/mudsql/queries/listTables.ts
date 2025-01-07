import { Hex } from "viem";
import { Table as MudTable } from "@latticexyz/config";
import { resourceToHex } from "@latticexyz/common";
import { keyBy } from "lodash-es";
import { client, listNamespaces } from "..";
import { decodeTable } from "../externals";

type DbRow = {
  tableId: Hex;
  fieldLayout: string;
  keySchema: string;
  valueSchema: string;
  abiEncodedKeyNames: string;
  abiEncodedFieldNames: string;
};

type Table = MudTable & {
  namespaceId: Hex;
  namespaceOwner?: Hex;
  namespaceOwnerName?: string;
};

type ListTablesOptions = {
  namespaceIds?: string[] | string;
};

export async function listTables(
  options?: ListTablesOptions
): Promise<Table[]> {
  if (options?.namespaceIds) {
    // TODO: Implement this
  }
  const tables = await client
    .selectFrom<DbRow>("store", "Tables", { orderBy: "tableId" })
    .then((result) =>
      result.map((r) => {
        const decoded = decodeTable({
          tableId: r.tableId,
          keySchema: r.keySchema,
          valueSchema: r.valueSchema,
          abiEncodedKeyNames: r.abiEncodedKeyNames,
          abiEncodedFieldNames: r.abiEncodedFieldNames,
        });
        return {
          ...decoded,
          namespaceId: resourceToHex({
            type: "namespace",
            namespace: decoded.namespace,
            name: "",
          }),
        };
      })
    );
  const namespaceIds = [...new Set(tables.map((t) => t.namespaceId))];

  const namespaces = await listNamespaces({ ids: namespaceIds });
  const namespacesByAddress = keyBy(namespaces, "namespaceId");

  return tables.map((t) => ({
    ...t,
    namespaceOwner: namespacesByAddress[t.namespaceId]?.owner,
    namespaceOwnerName: namespacesByAddress[t.namespaceId]?.ownerName,
  }));
}
