import { client as restClient, postQ, PostQResponse } from "./generated/index";
import { indexerBaseUrl } from "@/constants";
import { createSchemasRepository } from "./schemasRepository";
import { SelectOptions } from "./types";
import { queryBuilder } from "./utils/queryBuilder";
import { listSelectedTables } from "./utils";

restClient.setConfig({ baseUrl: indexerBaseUrl });

export type MudSqlClientConfig = {
  worldAddress: string;
};

function transformResult(
  data: PostQResponse["result"]
): Record<string, string>[] {
  const results = data.shift();
  const header = results?.shift();
  console.log("header", header);
  if (!results || !header) {
    return [];
  }
  return results.map((row) => {
    const obj: Record<string, string> = {};
    header.forEach((key, index) => {
      if (row[index]) {
        obj[key] = row[index];
      }
    });
    return obj;
  });
}

export function createClient() {
  let worldAddress: string = "";
  const schemas = createSchemasRepository();

  async function selectFrom<T extends object = Record<string, string>>(
    ns: string,
    table: string,
    options?: SelectOptions
  ): Promise<T[]> {
    const tables = listSelectedTables(ns, table, options || {});
    const schemasMap = Object.fromEntries(
      await Promise.all(
        Object.entries(tables).map(([k, v]) =>
          // TODO: Optimize this to fetch all schemas in one request
          schemas
            .getTableSchema(v.ns, v.table)
            .then((table) => [k, table.schema])
        )
      )
    );

    const query = queryBuilder(ns, table, options || {}, schemasMap);

    console.log("query", query);
    const r = await postQ({ body: [{ address: worldAddress, query }] });
    if (r.error) {
      throw new Error(r.error.msg);
    }
    return transformResult(r.data.result) as T[];
  }

  async function selectRaw(sql: string): Promise<Record<string, string>[]> {
    const r = await postQ({ body: [{ address: worldAddress, query: sql }] });
    if (r.error) {
      throw new Error(r.error.msg);
    }
    return transformResult(r.data.result);
  }

  function setConfig(config: MudSqlClientConfig) {
    worldAddress = config.worldAddress;
  }

  async function getTableSchema(ns: string, table: string) {
    return schemas.getTableSchema(ns, table);
  }

  return { selectFrom, selectRaw, getTableSchema, setConfig };
}
