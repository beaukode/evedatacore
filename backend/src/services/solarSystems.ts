import fs from "fs/promises";
import { NotFound } from "http-errors";
import { createCache } from "async-cache-dedupe";
import { lyDistance } from "@shared/utils";
import { z } from "zod";
import { zodParse } from "../utils";
import { EnvVariablesService } from "./envVariables";

export type SolarSystemsService = ReturnType<typeof createSolarSystemsService>;
export type SolarSystem = z.infer<typeof solarSystemSchema>;

const solarSystemSchema = z.object({
  solarSystemId: z.number(),
  solarSystemName: z.string(),
  location: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
});

interface SolarSystemsServiceConfig {
  env: EnvVariablesService;
}

export function createSolarSystemsService({ env }: SolarSystemsServiceConfig) {
  const cache = createCache({
    ttl: 60 * 60 * 24,
    stale: 60,
    storage: { type: "memory", options: { size: 50000 } },
  })
    .define("getSolarSystems", async () => {
      console.log("Loading solar systems from:", env.SOLARSYSTEMS_PATH);
      const json = await fs.readFile(env.SOLARSYSTEMS_PATH, {
        encoding: "utf-8",
      });
      const solarSystems = JSON.parse(json);
      if (typeof solarSystems !== "object") {
        throw new Error("Invalid solar systems data");
      }
      return solarSystems as Record<string, unknown>;
    })
    .define("getSolarSystem", async (solarSystemId: number | string) => {
      const solarSystems = await cache.getSolarSystems();
      const solarSystem = solarSystems[solarSystemId.toString()];
      if (!solarSystem) {
        throw new NotFound("Solar system not found");
      }
      return zodParse(solarSystemSchema, solarSystem, `Invalid solar system data ${solarSystemId}`);
    });

  async function getDistance(solarSystem1: number | string, solarSystem2: number | string): Promise<number> {
    const [s1, s2] = await Promise.all([cache.getSolarSystem(solarSystem1), cache.getSolarSystem(solarSystem2)]);
    return lyDistance(s1.location, s2.location);
  }

  return {
    getSolarSystem: cache.getSolarSystem,
    getDistance,
  };
}
