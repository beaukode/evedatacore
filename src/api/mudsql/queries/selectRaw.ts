import { Client } from "@hey-api/client-fetch";
import { MudSqlClient } from "../client";
import { postQ } from "../generated";
import { MudSqlClientConfig } from "../types";
import { transformResult } from "../utils";

export const selectRaw =
  (_: MudSqlClient, config: MudSqlClientConfig, restClient: Client) =>
  async (sql: string): Promise<Record<string, string>[]> => {
    const start = Date.now();
    const r = await postQ({
      body: [{ address: config.worldAddress, query: sql }],
      client: restClient,
    });
    if (config.debugSql) {
      console.log("SQL:", {
        query: sql,
        response: [...(r.data?.result ?? [])],
        time: (Date.now() - start) / 1000,
      });
    }
    if (r.error) {
      throw new Error(r.error.msg);
    }
    return transformResult(r.data.result.shift());
  };
