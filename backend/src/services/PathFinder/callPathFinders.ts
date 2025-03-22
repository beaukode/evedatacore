import { InternalServerError, NotFound } from "http-errors";
import { invokeLambda } from "./invokeLambda";
import { Optimize, PathFinderPathItem, SmartGateLink } from "./types";

export interface CallPathFinderConfig {
  lambda370Arn: string;
  lambda500Arn: string;
}

export async function callPathFinder(
  from: number,
  to: number,
  jumpDistance: number,
  optimize: Optimize,
  smartGates: SmartGateLink[],
  config: CallPathFinderConfig,
): Promise<PathFinderPathItem[]> {
  let arn = "";
  if (jumpDistance <= 370) {
    arn = config.lambda370Arn;
  } else {
    arn = config.lambda500Arn;
  }
  console.log("findPath", arn, from, to, jumpDistance, optimize, smartGates.length);
  const r = await invokeLambda(arn, from, to, jumpDistance, optimize, smartGates);
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
    console.error(`Pathfinder timeout for ${from} to ${to} with distance ${jumpDistance}`);
    throw new InternalServerError(`Pathfinder timeout`);
  }
  return path;
}
