import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "./src/api/shish/openapi.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/api/shish/generated",
  },
  plugins: [...defaultPlugins],
});
