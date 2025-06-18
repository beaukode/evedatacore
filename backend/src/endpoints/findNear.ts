import { z } from "zod";
import { endpointsFactory } from "./factories";

const itemSchema = z.object({
  solarSystemId: z.number(),
  distance: z.number(),
});

export const findNear = endpointsFactory.build({
  method: "get",
  input: z.object({
    id: z.coerce.number().positive().min(30000000).max(39000000),
    distance: z.coerce.number().positive().max(300),
  }),
  output: z.object({
    items: z.array(itemSchema),
  }),
  handler: async ({
    input: { id, distance },
    options: {
      responseHeaders,
      services: { nearFinder },
    },
  }) => {
    const items = await nearFinder.findNear(id, distance);
    responseHeaders.setCache(60 * 60 * 1); // 1 hour (Should not change until the game data changes)
    return {
      items,
    };
  },
});
