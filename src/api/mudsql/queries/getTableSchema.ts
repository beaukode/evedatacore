import { createCache } from "async-cache-dedupe";
import { Table } from "@latticexyz/config";
import { MudSqlClient } from "../client";
import { toSqlHex } from "../utils";
import { decodeTable } from "../externals";
import { omit } from "lodash-es";

export const getTableSchema = (client: MudSqlClient) => {
  const cache = createCache({
    ttl: 86400 * 365,
    storage: { type: "memory" },
  }).define("getTableSchema", async (tableId: string): Promise<Table> => {
    const query = `SELECT "tableId", "fieldLayout", "keySchema", "valueSchema", "abiEncodedKeyNames", "abiEncodedFieldNames"
    FROM store__Tables
    WHERE "tableId" = '${toSqlHex(tableId)}'`;

    const res = await client.selectRaw(query);
    const r = res.pop();

    if (!r) {
      throw new Error(`Table schema not found ${tableId}`);
    }
    const { keySchema, valueSchema, abiEncodedKeyNames, abiEncodedFieldNames } =
      r;

    if (
      typeof keySchema !== "string" ||
      typeof valueSchema !== "string" ||
      typeof abiEncodedKeyNames !== "string" ||
      typeof abiEncodedFieldNames !== "string"
    ) {
      throw new Error(`Invalid schema response ${tableId}`);
    }

    const table = {
      ...decodeTable({
        tableId,
        keySchema,
        valueSchema,
        abiEncodedKeyNames,
        abiEncodedFieldNames,
      }),
    };

    if (table.namespace === "eveworld" && table.name === "SmartGateConfigT") {
      table.schema = omit(table.schema, ["maxDistance"]);
    }
    if (table.namespace === "eveworld" && table.name === "EphemeralInvTabl") {
      table.schema = omit(table.schema, ["items"]);
    }
    if (table.namespace === "eveworld" && table.name === "InventoryTable") {
      table.schema = omit(table.schema, ["items"]);
    }

    return table;
  });

  return (id: string) => {
    return cache.getTableSchema(id);
  };
};
