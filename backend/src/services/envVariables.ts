import { z } from "zod";
import { zodParse } from "../utils";

export type EnvVariablesService = ReturnType<typeof createEnvVariablesService>;

const envSchema = z.object({
  PATHFINDER_ARN_370: z
    .string()
    .default(
      "arn:aws:lambda:eu-west-1:216634561923:function:evedatacore-route-planner-0-370-main"
    ),
  PATHFINDER_ARN_500: z
    .string()
    .default(
      "arn:aws:lambda:eu-west-1:216634561923:function:evedatacore-route-planner-300-500-main"
    ),
  SOLARSYSTEMS_PATH: z.string().default("data/solarsystems.json"),
});

export function createEnvVariablesService() {
  return zodParse(envSchema, process.env, "Invalid environment variables");
}
