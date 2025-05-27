// This script create a types data json with image
// by merging data from https://blockchain-gateway-stillness.live.tech.evefrontier.com/types and
// https://blockchain-gateway-stillness.live.tech.evefrontier.com/types/{typeId}

import { ensureDirSync } from "fs-extra";
import { writeFileSync } from "fs";
import { join } from "path";

const typesUrl = "https://world-api-stillness.live.tech.evefrontier.com/types";

async function main() {
  ensureDirSync("./output");

  console.log("Downloading types data...");
  const response = await fetch(typesUrl);
  if (!response.ok) {
    throw new Error("Failed to download solarsystems data");
  }
  const typesData = await response.json();

  const total = Object.keys(typesData).length;
  console.log(`Downloaded ${total} types`);

  let count = 0;
  let missing = 0;
  for (const id in typesData) {
    // console.log(`Loading image ${id}...`);
    const response = await fetch(`${typesUrl}/${id}`);
    if (response.ok) {
      const data = await response.json();
      if (data.metadata.image) {
        typesData[id].image = data.metadata.image;
        count++;
      } else {
        console.log(`Missing image for type ${id}`);
        console.log(data);
        missing++;
      }
    } else {
      console.log(`Missing data for type ${id}`);
    }
  }

  console.log(
    `Merged ${count} types, ${missing} missing images, ${total} total types`
  );
  const outputPath = join("./output", "types.json");
  writeFileSync(outputPath, JSON.stringify(typesData), "utf-8");
  console.log(`Types data written to ${outputPath}`);
}

main();
