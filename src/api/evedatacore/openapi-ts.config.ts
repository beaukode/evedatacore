import { execSync } from "child_process";
import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

// Ensure OpenAPI documentation is up to date
execSync("npm run doc", {
  cwd: "./backend",
  stdio: "inherit",
});

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "./backend/doc/openapi.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/api/evedatacore/generated",
  },
  plugins: [...defaultPlugins],
});
