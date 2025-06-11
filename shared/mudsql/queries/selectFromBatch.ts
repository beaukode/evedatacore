import { resourceToHex } from "@latticexyz/common";
import { MudSqlClientConfig, SelectOptions } from "../types";
import { listSelectedTables, queryBuilder } from "../utils";
import { MudSqlClient } from "../client";

type SelectFromBatchQuery = {
  ns: string;
  table: string;
  options?: SelectOptions;
};

export const selectFromBatch =
  (client: MudSqlClient, config: MudSqlClientConfig) =>
  async <T extends unknown[]>(
    queries: [...SelectFromBatchQuery[]]
  ): Promise<{ [K in keyof T]: T[K][] }> => {
    const tables = queries.reduce(
      (acc, q) => {
        return {
          ...acc,
          ...listSelectedTables(q.ns, q.table, q.options || {}),
        };
      },
      {} as ReturnType<typeof listSelectedTables>
    );
    if (config.debugSql) {
      console.log("selectFromBatch", tables);
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

    const sql = queries.map((q) =>
      queryBuilder(q.ns, q.table, q.options || {}, schemasMap)
    );

    const results = await client.selectRawBatch(sql);

    return results as { [K in keyof T]: T[K][] };
  };
