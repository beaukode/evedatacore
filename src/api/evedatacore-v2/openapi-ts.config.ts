import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "../evedatacore-api/doc/openapi.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/api/evedatacore-v2/generated",
  },
  plugins: [...defaultPlugins],
});
