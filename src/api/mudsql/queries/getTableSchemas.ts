import { Schema } from "@latticexyz/config";
import { MudSqlClient } from "../client";
import { toSqlHex } from "../utils";
import { decodeTable } from "../externals";
import { difference, intersection } from "lodash-es";

type SchemasCacheMap = Record<string, Promise<Record<string, Schema>> | Schema>;

export const getTableSchemas = (client: MudSqlClient) => {
  const cache: SchemasCacheMap = {};

  async function querySchemas(ids: string[]): Promise<Record<string, Schema>> {
    const query = `SELECT "tableId", "fieldLayout", "keySchema", "valueSchema", "abiEncodedKeyNames", "abiEncodedFieldNames"
    FROM store__Tables
    WHERE "tableId" IN (${ids.map((id) => `'${toSqlHex(id)}'`).join(",")})`;
    const rows = await client.selectRaw(query);
    return rows.reduce(
      (acc, row) => {
        const {
          tableId,
          keySchema,
          valueSchema,
          abiEncodedKeyNames,
          abiEncodedFieldNames,
        } = row;
        if (
          !tableId ||
          typeof keySchema !== "string" ||
          typeof valueSchema !== "string" ||
          typeof abiEncodedKeyNames !== "string" ||
          typeof abiEncodedFieldNames !== "string"
        ) {
          throw new Error(`Invalid schema response ${tableId}`);
        }
        const table = decodeTable({
          tableId,
          keySchema,
          valueSchema,
          abiEncodedKeyNames,
          abiEncodedFieldNames,
        });
        acc[tableId] = table.schema;
        return acc;
      },
      {} as Record<string, Schema>
    );
  }

  return async (ids: string[]): Promise<Record<string, Schema>> => {
    const r: Record<string, Schema> = {};
    const inCache = intersection(ids, Object.keys(cache));

    for (const id of inCache) {
      if (!cache[id]) {
        continue;
      }
      if (cache[id] instanceof Promise) {
        const tables = await cache[id];
        if (tables[id]) {
          cache[id] = tables[id];
          r[id] = tables[id];
        }
      } else {
        r[id] = cache[id];
      }
    }

    const missingIds = difference(ids, Object.keys(r));

    if (missingIds.length > 0) {
      const tables = querySchemas(missingIds);
      for (const id of missingIds) {
        cache[id] = tables;
      }
      const resolvedTables = await tables;
      for (const id of missingIds) {
        r[id] = resolvedTables[id]!;
      }
    }
    return r;
  };
};
