import { MudSqlClient } from "../client";

type DbRow = {
  smartObjectId: string;
  systemId: string;
};

type GateConfig = {
  systemId: string;
  defaultSystem: boolean;
  system?: Awaited<ReturnType<MudSqlClient["getSystem"]>>;
};

export const getTurretConfig =
  (client: MudSqlClient) =>
  async (id: string): Promise<GateConfig | undefined> => {
    const configs = await client.selectFrom<DbRow>(
      "eveworld",
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
