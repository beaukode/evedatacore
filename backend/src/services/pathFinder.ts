import { Lambda } from "@aws-sdk/client-lambda";
import { NotFound, RequestTimeout } from "http-errors";
import { z } from "zod";
import { zodParse } from "../utils";
import { EnvVariablesService } from "./envVariables";
import { SolarSystemsService } from "./solarSystems";

const pathFinderResponseSchema = z.object({
  status: z.enum(["found", "notfound", "timeout"]),
  path: z.array(
    z.object({
      conn_type: z.enum(["gate", "smartgate", "jump"]),
      distance: z.number(),
      target: z.number(),
    }),
  ),
  stats: z.object({
    cost: z.number(),
    total_time: z.number(),
    heuristic_spend: z.number(),
    successors_spend: z.number(),
    loop_spend: z.number(),
    visited: z.number(),
  }),
});

async function invokeLambda(
  arn: string,
  from: number,
  to: number,
  jumpDistance: number,
  optimize: Optimize,
  useSmartGates: boolean,
) {
  const lambda = new Lambda({
    region: "eu-west-1",
  });

  const params = {
    FunctionName: arn,
    Payload: JSON.stringify({
      from,
      to,
      jump_distance: jumpDistance,
      optimize,
      use_smart_gates: useSmartGates,
    }),
  };

  try {
    const response = await lambda.invoke(params);
    const payloadString = Buffer.from(response.Payload || []).toString("utf-8");
    const json = JSON.parse(payloadString);
    return zodParse(pathFinderResponseSchema, json);
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    throw error;
  }
}

export enum Optimize {
  FUEL = "fuel",
  DISTANCE = "distance",
  HOPS = "hops",
}

interface PathFinderServiceConfig {
  env: EnvVariablesService;
  solarSystems: SolarSystemsService;
}

export function createPathFinderService({ env }: PathFinderServiceConfig) {
  async function callPathFinder(
    from: number,
    to: number,
    jumpDistance: number,
    optimize: Optimize,
    useSmartGates: boolean,
  ) {
    let arn = "";
    if (jumpDistance <= 370) {
      arn = env.PATHFINDER_ARN_370;
    } else {
      arn = env.PATHFINDER_ARN_500;
    }
    console.log("findPath", arn, from, to, jumpDistance, optimize, useSmartGates);
    const r = await invokeLambda(arn, from, to, jumpDistance, optimize, useSmartGates);
    const { status, path, stats } = r;
    console.log(
      JSON.stringify(
        {
          arn,
          from,
          to,
          jumpDistance,
          status,
          path: path,
          ...stats,
        },
        null,
        2,
      ),
    );
    if (status === "notfound") {
      throw new NotFound("No path found");
    }
    if (status === "timeout") {
      throw new RequestTimeout("Pathfinder timeout");
    }
    return path;
  }

  return {
    findPath: async (from: number, to: number, jumpDistance: number, optimize: Optimize, useSmartGates: boolean) => {
      return callPathFinder(from, to, jumpDistance, optimize, useSmartGates);
    },
  };
}
