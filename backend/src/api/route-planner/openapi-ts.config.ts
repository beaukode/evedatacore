import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "./src/api/route-planner/openapi.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/api/route-planner/generated",
  },
  plugins: [...defaultPlugins],
});
