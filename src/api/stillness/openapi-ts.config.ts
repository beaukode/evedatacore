import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",

  input:
    "https://blockchain-gateway-stillness.live.tech.evefrontier.com/docs/doc.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/api/stillness/generated",
  },
  plugins: [...defaultPlugins],
});
