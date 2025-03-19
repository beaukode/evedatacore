import fs from "fs/promises";
import { NotFound } from "http-errors";
import { z } from "zod";
import { zodParse } from "../utils";
import { EnvVariablesService } from "./envVariables";
import Big from "big.js";

export type SolarSystemsService = ReturnType<typeof createSolarSystemsService>;
export type SolarSystem = z.infer<typeof solarSystemSchema>;
export type Location = SolarSystem["location"];

const solarSystemSchema = z.object({
  solarSystemId: z.number(),
  solarSystemName: z.string(),
  location: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
});

function lyDistance(locationA: Location, locationB: Location): number {
  const s1x = new Big(locationA.x);
  const s1y = new Big(locationA.y);
  const s1z = new Big(locationA.z);
  const s2x = new Big(locationB.x);
  const s2y = new Big(locationB.y);
  const s2z = new Big(locationB.z);
  const meters = s1x.minus(s2x).pow(2).plus(s1y.minus(s2y).pow(2)).plus(s1z.minus(s2z).pow(2)).sqrt();
  const ly = meters.div(new Big(9.46073047258e15));
  return ly.toNumber();
}

interface SolarSystemsServiceConfig {
  env: EnvVariablesService;
}

export function createSolarSystemsService({ env }: SolarSystemsServiceConfig) {
  let solarSystems: Record<string, unknown> | undefined;

  async function getSolarSystem(solarSystemId: number | string): Promise<SolarSystem> {
    if (!solarSystems) {
      const json = await fs.readFile(env.SOLARSYSTEMS_PATH, {
        encoding: "utf-8",
      });
      solarSystems = JSON.parse(json);
      if (typeof solarSystems !== "object") {
        throw new Error("Invalid solar systems data");
      }
    }
    const solarSystem = solarSystems[solarSystemId.toString()];
    if (!solarSystem) {
      throw new NotFound("Solar system not found");
    }
    return zodParse(solarSystemSchema, solarSystem, `Invalid solar system data ${solarSystemId}`);
  }

  async function getDistance(
    solarSystem1: SolarSystem | number | string,
    solarSystem2: SolarSystem | number | string,
  ): Promise<number> {
    const s1 =
      typeof solarSystem1 === "number" || typeof solarSystem1 === "string"
        ? await getSolarSystem(solarSystem1)
        : solarSystem1;
    const s2 =
      typeof solarSystem2 === "number" || typeof solarSystem2 === "string"
        ? await getSolarSystem(solarSystem2)
        : solarSystem2;
    return lyDistance(s1.location, s2.location);
  }

  return {
    getSolarSystem,
    getDistance,
  };
}
