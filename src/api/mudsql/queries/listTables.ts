import { Hex, isHex, sliceHex } from "viem";
import { Table as MudTable } from "@latticexyz/config";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import { keyBy } from "lodash-es";
import { client, listNamespaces } from "..";
import { decodeTable } from "../externals";
import { ensureArray, incrementHex, toSqlHex } from "../utils";

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
  let where = "";
  if (options?.namespaceIds) {
    const namespaceIds = ensureArray(options.namespaceIds);
    if (namespaceIds.length === 0) return []; // No namespaces to query
    where = namespaceIds
      .flatMap((id) => {
        if (!isHex(id)) return [];
        const { namespace } = hexToResource(id);
        const tableId = sliceHex(
          resourceToHex({ type: "table", namespace, name: "" }),
          0,
          16
        );
        const offchainId = sliceHex(
          resourceToHex({ type: "offchainTable", namespace, name: "" }),
          0,
          16
        );
        const tableBound = incrementHex(tableId);
        const offchainBound = incrementHex(offchainId);

        return [
          `"tableId" >= '${toSqlHex(tableId)}' AND "tableId" < '${toSqlHex(tableBound)}'`,
          `"tableId" >= '${toSqlHex(offchainId)}' AND "tableId" < '${toSqlHex(offchainBound)}'`,
        ];
      })
      .join(" OR ");
  }
  const tables = await client
    .selectFrom<DbRow>("store", "Tables", { orderBy: "tableId", where })
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
