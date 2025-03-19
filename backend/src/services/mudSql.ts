import { EnvVariablesService } from "./envVariables";
import { createMudSqlClient } from "@shared/mudsql/client";

interface MudSqlServiceConfig {
  env: EnvVariablesService;
}

export function createMudSqlService({ env }: MudSqlServiceConfig) {
  console.log("Creating mudSql service");
  return createMudSqlClient({
    indexerBaseUrl: env.MUDSQL_INDEXER_BASE_URL,
    worldAddress: env.WORLD_ADDRESS,
  });
}
