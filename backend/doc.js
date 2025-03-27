const esbuild = require("esbuild");
const { exec } = require("child_process");

// Build the doc.ts file
esbuild.buildSync({
  entryPoints: ["src/doc.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: "dist/doc.js",
});

// Run the output file using Node.js
exec("node dist/doc.js", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Output: ${stdout}`);
});
