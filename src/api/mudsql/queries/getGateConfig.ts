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

export const getGateConfig =
  (client: MudSqlClient) =>
  async (id: string): Promise<GateConfig | undefined> => {
    const configs = await client.selectFrom<DbRow>(
      "eveworld",
      "SmartGateConfigT",
      {
        where: `"smartObjectId" = '${id}'`,
      }
    );
    const config = configs[0];
    if (!config) return undefined;

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
