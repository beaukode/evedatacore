import { createCache } from "async-cache-dedupe";
import { postQ } from "./generated";
import { worldAddress } from "@/constants";
import { toSqlHex } from "./utils";
import { Table } from "@latticexyz/config";
import { decodeTable } from "./externals";
import { resourceToHex } from "@latticexyz/common";

export function createSchemasRepository() {
  const cache = createCache({
    ttl: 86400 * 365,
    storage: { type: "memory" },
  }).define("getTableSchema", async (tableId: string): Promise<Table> => {
    const query = `SELECT "tableId", "fieldLayout", "keySchema", "valueSchema", "abiEncodedKeyNames", "abiEncodedFieldNames"
    FROM store__Tables
    WHERE "tableId" = '${toSqlHex(tableId)}'`;

    const r = await postQ({ body: [{ address: worldAddress, query }] });
    if (r.error) {
      throw new Error(r.error.msg);
    }

    const results = r.data.result.shift();
    if (!results || results.length !== 2) {
      throw new Error("Invalid schema response");
    }
    const [
      ,
      ,
      keySchema,
      valueSchema,
      abiEncodedKeyNames,
      abiEncodedFieldNames,
    ] = results.pop() || [];

    return decodeTable({
      tableId,
      keySchema,
      valueSchema,
      abiEncodedKeyNames,
      abiEncodedFieldNames,
    });
  });

  async function getTableSchema(ns: string, table: string): Promise<Table> {
    const tableId = resourceToHex({
      type: "table",
      namespace: ns,
      name: table,
    });

    return cache.getTableSchema(tableId);
  }

  return { getTableSchema };
}
