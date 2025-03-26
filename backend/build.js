const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/lambda.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    outdir: "dist",
    format: "cjs",
    external: ["@aws-sdk"], // Exclude AWS SDK from the bundle
  })
  .catch(() => process.exit(1));
