import { hexToResource, resourceToHex } from "@latticexyz/common";
import { MudSqlClientConfig, SelectOptions } from "../types";
import { listSelectedTables, queryBuilder } from "../utils";
import { MudSqlClient } from "../client";
import { Hex } from "viem";

export const selectFrom =
  (client: MudSqlClient, config: MudSqlClientConfig) =>
  async <T extends object = Record<string, string | string[]>>(
    ns: string,
    table: string,
    options?: SelectOptions
  ): Promise<T[]> => {
    const tables = listSelectedTables(ns, table, options || {});
    if (config.debugSql) {
      console.log("selectFrom", tables);
    }
    const schemas = await client.getTableSchemas(
      Object.values(tables).map((t) =>
        resourceToHex({
          type: t.type || "table",
          namespace: t.ns,
          name: t.table,
        })
      )
    );

    const schemasMap = Object.fromEntries(
      Object.entries(schemas).map(([k, v]) => {
        const hex = hexToResource(k as Hex);
        return [`${hex.namespace}__${hex.name}`, v];
      })
    );

    const query = queryBuilder(ns, table, options || {}, schemasMap);

    const r = await client.selectRaw(query);
    return r as T[];
  };
