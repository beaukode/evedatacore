import { MudSqlClient } from "../client";
import { AssemblySystemConfig } from "../types";

type DbRow = {
  smartObjectId: string;
  systemId: string;
};

export const getTurretConfig =
  (client: MudSqlClient) =>
  async (id: string): Promise<AssemblySystemConfig | undefined> => {
    const configs = await client.selectFrom<DbRow>(
      "evefrontier",
      "SmartTurretConfi",
      {
        where: `"smartObjectId" = '${id}'`,
      }
    );
    const config = configs[0];
    if (!config) {
      return {
        systemId:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        defaultSystem: true,
      };
    }

    const defaultSystem =
      config.systemId ===
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    const system = defaultSystem
      ? undefined
      : await client.getSystem(config.systemId).catch(() => {
          console.error("Failed to get system", config.systemId);
          return undefined;
        });

    return {
      systemId: config.systemId,
      defaultSystem,
      system,
    };
  };
