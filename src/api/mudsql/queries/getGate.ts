import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { Gate } from "../types";
import { getAssembly } from "./getAssembly";

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

export const getGate =
  (client: MudSqlClient) =>
  async (id: string): Promise<Gate | undefined> => {
    const assembly = await getAssembly(client)(id);
    if (!assembly) return undefined;

    const [configs, links] = await client.selectFromBatch<
      [ConfigDbRow, LinkDbRow]
    >([
      {
        ns: "evefrontier",
        table: "SmartGateConfig",
        options: {
          where: `"smartObjectId" = '${id}'`,
        },
      },
      {
        ns: "evefrontier",
        table: "SmartGateLink",
        options: {
          where: `"isLinked" = true AND "sourceGateId" = '${id}'`,
        },
      },
    ]);

    const link = links[0];
    const config = configs[0];

    return {
      ...assembly,
      isLinked: !!link,
      destinationId: link?.destinationGateId,
      systemId:
        config?.systemId ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      maxDistance: config?.maxDistance || "0",
    };
  };
