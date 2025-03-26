import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "./shared/mudsql/openapi.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./shared/mudsql/generated",
  },
  plugins: [...defaultPlugins],
});
