import { z } from "zod";
import { zodParse } from "../utils";

export type EnvVariablesService = ReturnType<typeof createEnvVariablesService>;

const envSchema = z.object({
  PATHFINDER_ARN_370: z
    .string()
    .default("arn:aws:lambda:eu-west-1:216634561923:function:evedatacore-route-planner-0-370-main"),
  PATHFINDER_ARN_500: z
    .string()
    .default("arn:aws:lambda:eu-west-1:216634561923:function:evedatacore-route-planner-300-500-main"),
  SOLARSYSTEMS_PATH: z.string().default("data/solarsystems.json"),
  MUDSQL_INDEXER_BASE_URL: z.string().default("https://indexer.mud.pyropechain.com"),
  WORLD_ADDRESS: z.string().default("0x9891ee4bf5f2a9e74e9d81b06b855eec70b78d4f"),
  CHAIN_ID: z.number().default(695569),
});

export function createEnvVariablesService() {
  return zodParse(envSchema, process.env, "Invalid environment variables");
}
