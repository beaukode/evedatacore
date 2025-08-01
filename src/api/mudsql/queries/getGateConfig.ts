import { MudSqlClient } from "../client";
import { AssemblySystemConfig } from "../types";

type DbRow = {
  smartObjectId: string;
  systemId: string;
};

export const getGateConfig =
  (client: MudSqlClient) =>
  async (id: string): Promise<AssemblySystemConfig | undefined> => {
    const configs = await client.selectFrom<DbRow>(
      "evefrontier",
      "SmartGateConfig",
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
      : await client.getSystem(config.systemId);

    return {
      systemId: config.systemId,
      defaultSystem,
      system,
    };
  };
