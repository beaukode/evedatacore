// This script create a solar system data json from the world-api

import { ensureDirSync } from "fs-extra";
import { writeFileSync } from "fs";
import { join } from "path";

const solarsystemsUrl =
  "https://world-api-stillness.live.tech.evefrontier.com/v2/solarsystems";
const limit = 1000;

async function fetchSolarsystems(offset: number = 0) {
  const response = await fetch(
    `${solarsystemsUrl}?offset=${offset}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to download solarsystems data");
  }
  const { data } = await response.json();
  if (data.length > 0) {
    const next = await fetchSolarsystems(offset + limit);
    return [...data, ...next];
  }
  return data;
}

async function main() {
  ensureDirSync("./output");

  console.log("Downloading solarsystems data...");
  const solarsystemsData = await fetchSolarsystems();

  console.log(`Downloaded ${solarsystemsData.length} solarsystems`);

  const map = solarsystemsData.reduce((acc, solarsystem) => {
    const { id, name, location } = solarsystem;
    acc[solarsystem.id] = {
      solarSystemId: id,
      solarSystemName: name,
      location,
    };
    return acc;
  }, {});

  const outputPath = join("./output", "solarsystems");
  writeFileSync(outputPath, JSON.stringify(map), "utf-8");
  console.log(`Solarsystems data written to ${outputPath}`);
}

main();
