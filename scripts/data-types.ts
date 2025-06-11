// This script create a types data json with image
// by merging data from https://blockchain-gateway-stillness.live.tech.evefrontier.com/types and
// https://blockchain-gateway-stillness.live.tech.evefrontier.com/types/{typeId}

import { ensureDirSync } from "fs-extra";
import { writeFileSync } from "fs";
import { join } from "path";

const typesUrl =
  "https://world-api-stillness.live.tech.evefrontier.com/v2/types";

async function main() {
  ensureDirSync("./output");

  console.log("Downloading types data...");
  const response = await fetch(typesUrl + "?limit=1000");
  if (!response.ok) {
    throw new Error("Failed to download solarsystems data");
  }
  const { data } = await response.json();

  const total = data.length;
  console.log(`Downloaded ${total} types`);

  const typesData = data.reduce(
    (acc: Record<string, unknown>, item: Record<string, unknown>) => {
      const { iconUrl, id, name, description, ...rest } = item;
      return {
        ...acc,
        [`${id}`]: {
          name,
          description,
          image: iconUrl,
          attributes: Object.entries(rest).map(([trait_type, value]) => ({
            trait_type,
            value,
          })),
        },
      };
    },
    {}
  );

  const outputPath = join("./output", "types.json");
  writeFileSync(outputPath, JSON.stringify(typesData), "utf-8");
  console.log(`Types data written to ${outputPath}`);
}

main();
