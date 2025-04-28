import { Client } from "@hey-api/client-fetch";
import { MudSqlClient } from "../client";
import { postQ } from "../generated";
import { MudSqlClientConfig } from "../types";
import { transformResult } from "../utils";

const DEBUG_SQL = import.meta.env.VITE_DEBUG_SQL === "true";

export const selectRawBatch =
  (_: MudSqlClient, config: MudSqlClientConfig, restClient: Client) =>
  async (sql: string[]): Promise<Record<string, string>[][]> => {
    const r = await postQ({
      body: sql.map((q) => ({ address: config.worldAddress, query: q })),
      client: restClient,
    });
    if (DEBUG_SQL) {
      console.log("SQL Batch:", {
        query: sql,
        response: { ...r },
      });
    }
    if (r.error) {
      throw new Error(r.error.msg);
    }
    return r.data.result.map((r) => transformResult(r));
  };
