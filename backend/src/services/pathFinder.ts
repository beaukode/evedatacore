import { Lambda } from "@aws-sdk/client-lambda";
import { NotFound, InternalServerError } from "http-errors";
import { z } from "zod";
import { chunk } from "lodash-es";
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

export function createPathFinderService({ env, solarSystems }: PathFinderServiceConfig) {
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
      JSON.stringify({
        arn,
        from,
        to,
        jumpDistance,
        status,
        path: path,
        ...stats,
      }),
    );
    if (status === "notfound") {
      throw new NotFound("No path found");
    }
    if (status === "timeout") {
      throw new InternalServerError("Pathfinder timeout");
    }
    return path;
  }

  return {
    findPath: async (from: number, to: number, jumpDistance: number, optimize: Optimize, useSmartGates: boolean) => {
      const distance = await solarSystems.getDistance(from, to);
      if (optimize !== Optimize.HOPS && distance > jumpDistance * 10) {
        // We need to split the problem
        const parts = Math.min(distance / (jumpDistance * 10), 4); // 4 is the maximum number of parts
        console.log(`Splitting the path into ${parts} parts`);
        const largePath = await callPathFinder(from, to, 500, optimize, useSmartGates);
        const chunkSize = Math.round(largePath.length / parts);
        const chunks = chunk(largePath, chunkSize);
        const nodes = [from, ...chunks.map((chunk) => chunk[chunk.length - 1].target)];

        let start: number = nodes.shift()!;
        const promises: Promise<Awaited<ReturnType<typeof callPathFinder>>>[] = [];
        while (nodes.length > 0) {
          const end = nodes.shift()!;
          promises.push(callPathFinder(start, end, jumpDistance, optimize, useSmartGates));
          start = end;
        }
        const paths = await Promise.all(promises);
        return paths.flat();
      }

      return callPathFinder(from, to, jumpDistance, optimize, useSmartGates);
    },
  };
}
