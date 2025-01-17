import {
  createClient as createApiClient,
  createConfig,
} from "@hey-api/client-fetch";
import { MudSqlClientConfig } from "./types";
import * as queries from "./queries";

export type MudSqlClient = {
  [K in keyof typeof queries]: ReturnType<(typeof queries)[K]>;
};

type QueryKey = keyof typeof queries;

export function createClient(config: MudSqlClientConfig): MudSqlClient {
  const restClient = createApiClient(
    createConfig({ baseUrl: config.indexerBaseUrl })
  );

  const client: Record<string, unknown> = {};
  for (const key in queries) {
    client[key] = queries[key as QueryKey](
      client as MudSqlClient,
      config,
      restClient
    );
  }
  return client as MudSqlClient;
}
