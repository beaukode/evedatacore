import { Lambda } from "@aws-sdk/client-lambda";
import { zodParse } from "../../utils";
import { Optimize, PathFinderResponse, pathFinderResponseSchema, SmartGateLink } from "./types";

export async function invokeLambda(
  arn: string,
  from: number,
  to: number,
  jumpDistance: number,
  optimize: Optimize,
  smartGates: SmartGateLink[],
): Promise<PathFinderResponse> {
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
