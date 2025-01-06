// This script create a solar system data json with precise location
// by merging data from https://blockchain-gateway-nova.nursery.reitnorf.com/solarsystems and
// the game client data extracted using https://github.com/frontier-reapers/frontier-static-data?tab=readme-ov-file#export_starmappy
// starmap.json must exist in the same folder as this script

import { ensureDirSync } from "fs-extra";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const solarsystemsUrl = "https://blockchain-gateway-nova.nursery.reitnorf.com/solarsystems"

async function main() {
  ensureDirSync("./output");

  console.log("Downloading solarsystems data...");
  const response = await fetch(solarsystemsUrl);
  if (!response.ok) {
    throw new Error("Failed to download solarsystems data");
  }
  const solarsystemsData = await response.json();

  console.log(
    `Downloaded ${Object.keys(solarsystemsData).length} solarsystems`
  );

  console.log("Loading starmap...");
  const starmapPath = join(__dirname, "starmap.json");
  const starmapData = JSON.parse(readFileSync(starmapPath, "utf-8"));

  console.log(
    `Loaded ${Object.keys(starmapData.solarSystems).length} solarsystems`
  );

  let count = 0;
  for (const id in solarsystemsData) {
    if (starmapData.solarSystems[id] && starmapData.solarSystems[id].center) {
      const [x, y, z] = starmapData.solarSystems[id].center;
      solarsystemsData[id].location = { x, y, z };
      count++;
    } else {
      console.log(`Missing starmap data for solarsystem ${id}`);
    }
  }

  console.log(`Merged ${count} solarsystems`);
  const outputPath = join("./output", "solarsystems");
  writeFileSync(outputPath, JSON.stringify(solarsystemsData), "utf-8");
  console.log(`Solarsystems data written to ${outputPath}`);
}

main();
