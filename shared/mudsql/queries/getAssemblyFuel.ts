import { MudSqlClient } from "../client";
import { AssemblyFuel } from "../types";

type DbRow = {
  smartObjectId: string;
  fuelUnitVolume: string;
  fuelConsumptionIntervalInSeconds: string;
  fuelMaxCapacity: string;
  fuelAmount: string;
  lastUpdatedAt: string;
};

export const getAssemblyFuel =
  (client: MudSqlClient) =>
  async (id: string): Promise<AssemblyFuel | undefined> => {
    const assemblies = await client.selectFrom<DbRow>("evefrontier", "Fuel", {
      where: `"smartObjectId" = '${id}'`,
    });
    const assembly = assemblies[0];
    if (!assembly) return undefined;

    return {
      id: assembly.smartObjectId,
      fuelUnitVolume: assembly.fuelUnitVolume,
      fuelConsumptionIntervalInSeconds:
        assembly.fuelConsumptionIntervalInSeconds,
      fuelMaxCapacity: assembly.fuelMaxCapacity,
      fuelAmount: assembly.fuelAmount,
      lastUpdatedAt: Number.parseInt(assembly.lastUpdatedAt, 10) * 1000,
    };
  };
