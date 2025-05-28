import { MudSqlClient } from "../client";
import { NetworkNode } from "../types";

type DbRow = {
  smartObjectId: string;
  exists: boolean;
  maxEnergyCapacity: string;
  energyProduced: string;
  totalReservedEnergy: string;
  lastUpdatedAt: string;
  connectedAssemblies: string[];
};

export const getNetworkNode =
  (client: MudSqlClient) =>
  async (id: string): Promise<NetworkNode | undefined> => {
    const nodes = await client.selectFrom<DbRow>("evefrontier", "NetworkNode", {
      where: `"smartObjectId" = '${id}'`,
    });
    const node = nodes[0];
    if (!node) {
      return;
    }

    return {
      maxEnergy: node.maxEnergyCapacity,
      producedEnergy: node.energyProduced,
      reservedEnergy: node.totalReservedEnergy,
      assemblies: [],
    };
  };
