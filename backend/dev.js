const esbuild = require("esbuild");
const { spawn } = require("child_process");
const dotenv = require("dotenv");

dotenv.config();

let childProcess = null;

function killProcess() {
  if (childProcess) {
    childProcess.kill();
    childProcess = null;
  }
}

function startApp() {
  killProcess();
  childProcess = spawn("node", ["./dist/index.js"], {
    stdio: "inherit",
  });
}

let spawnPlugin = {
  name: "spawn",
  setup(build) {
    build.onEnd((result) => {
      killProcess();
      startApp();
    });
  },
};

process.on("SIGTERM", () => {
  killProcess();
  process.exit(0);
});

process.on("SIGINT", () => {
  killProcess();
  process.exit(0);
});

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ["src/index.ts"],
    bundle: true,
    logLevel: "info",
    platform: "node",
    outfile: "dist/index.js",
    sourcemap: false,
    target: ["node20"],
    plugins: [spawnPlugin],
  });

  await ctx.watch();
}

main();
