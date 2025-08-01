import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "./src/api/mudsql/openapi.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/api/mudsql/generated",
  },
  plugins: [...defaultPlugins],
});
