import { EnvVariablesService } from "./envVariables";
import { createMudSqlClient } from "@shared/mudsql/client";

export type MudSqlService = ReturnType<typeof createMudSqlService>;

interface MudSqlServiceConfig {
  env: EnvVariablesService;
}

export function createMudSqlService({ env }: MudSqlServiceConfig) {
  return createMudSqlClient({
    indexerBaseUrl: env.MUDSQL_INDEXER_BASE_URL,
    worldAddress: env.WORLD_ADDRESS,
  });
}
