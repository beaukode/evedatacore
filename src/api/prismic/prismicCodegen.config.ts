import type { Config } from "prismic-ts-codegen";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development.local" });

const config: Config = {
  output: "./src/api/prismic/generated/types.generated.ts",
  repositoryName: "evedatacore",
  customTypesAPIToken: process.env.PRISMIC_WRITE_TOKEN,
  models: {
    fetchFromRepository: true,
  },
};

export default config;
