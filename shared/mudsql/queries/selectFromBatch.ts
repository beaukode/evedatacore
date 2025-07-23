import { hexToResource, resourceToHex } from "@latticexyz/common";
import { MudSqlClientConfig, SelectOptions } from "../types";
import { listSelectedTables, queryBuilder } from "../utils";
import { MudSqlClient } from "../client";
import { Hex } from "viem/_types/types/misc";

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

    const sql = queries.map((q) =>
      queryBuilder(q.ns, q.table, q.options || {}, schemasMap)
    );

    const results = await client.selectRawBatch(sql);

    return results as { [K in keyof T]: T[K][] };
  };
