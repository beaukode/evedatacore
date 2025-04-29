import { resourceToHex } from "@latticexyz/common";
import { MudSqlClientConfig, SelectOptions } from "../types";
import { listSelectedTables, queryBuilder } from "../utils";
import { MudSqlClient } from "../client";

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
    const schemasMap = Object.fromEntries(
      await Promise.all(
        Object.entries(tables).map(([k, v]) =>
          // TODO: Optimize this to fetch all schemas in one request
          client
            .getTableSchema(
              resourceToHex({
                type: v.type || "table",
                namespace: v.ns,
                name: v.table,
              })
            )
            .then((table) => [k, table.schema])
        )
      )
    );

    const query = queryBuilder(ns, table, options || {}, schemasMap);

    const r = await client.selectRaw(query);
    return r as T[];
  };
