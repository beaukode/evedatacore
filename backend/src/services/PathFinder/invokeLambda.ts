import { Lambda } from "@aws-sdk/client-lambda";
import { z } from "zod";
import { zodParse } from "../../utils";
import { Optimize, SmartGateLink } from "./types";
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
    successors_spend: z.number(),
    loop_spend: z.number(),
    visited: z.number(),
  }),
});

export async function invokeLambda(
  arn: string,
  from: number,
  to: number,
  jumpDistance: number,
  optimize: Optimize,
  smartGates: SmartGateLink[],
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
      smart_gates: smartGates,
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
