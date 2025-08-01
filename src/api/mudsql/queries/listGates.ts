import { keyBy } from "lodash-es";
import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { AssemblyState, AssemblyType, Gate } from "../types";
import { listAssemblies } from "./listAssemblies";

type ListGatesOptions = {
  owners?: string[] | string;
  solarSystemId?: string[] | string;
  types?: AssemblyType[] | AssemblyType;
  states?: AssemblyState[] | AssemblyState;
};

type ConfigDbRow = {
  smartObjectId: string;
  systemId: Hex;
  maxDistance: string;
};

type LinkDbRow = {
  sourceGateId: string;
  destinationGateId: string;
  isLinked: boolean;
};

export const listGates =
  (client: MudSqlClient) =>
  async (options?: ListGatesOptions): Promise<Gate[]> => {
    const assemblies = await listAssemblies(client)(options);

    const ids = assemblies.map((assembly) => assembly.id);

    if (ids.length === 0) {
      return [];
    }

    const [config, links] = await client.selectFromBatch<
      [ConfigDbRow, LinkDbRow]
    >([
      {
        ns: "evefrontier",
        table: "SmartGateConfig",
        options: {
          where: `"smartObjectId" IN ('${ids.join("', '")}')`,
        },
      },
      {
        ns: "evefrontier",
        table: "SmartGateLink",
        options: {
          where: `"isLinked" = true AND "sourceGateId" IN ('${ids.join("', '")}')`,
        },
      },
    ]);

    const configById = keyBy(config, "smartObjectId");
    const linksById = keyBy(links, "sourceGateId");

    return assemblies.map((assembly) => ({
      ...assembly,
      isLinked: !!linksById[assembly.id],
      destinationId: linksById[assembly.id]?.destinationGateId,
      systemId:
        configById[assembly.id]?.systemId ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      maxDistance: configById[assembly.id]?.maxDistance || "0",
    }));
  };
