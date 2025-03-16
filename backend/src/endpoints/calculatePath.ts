import { z } from "zod";
import { endpointsFactory } from "./factories";

const pathItemSchema = z.object({
  from: z.number(),
  to: z.number(),
  distance: z.number(),
  type: z.enum(["jump", "gate", "smartgate"]),
});

export const calculatePath = endpointsFactory.build({
  method: "get",
  input: z.object({
    from: z.coerce.number().positive().min(30000000).max(39000000),
    to: z.coerce.number().positive().min(30000000).max(39000000),
    jumpDistance: z.coerce.number().positive().max(500).optional().default(0),
  }),
  output: z.object({
    path: z.array(pathItemSchema),
  }),
  handler: async ({ input: { from, to, jumpDistance }, options, logger }) => {
    logger.debug("Options:", options); // middlewares provide options
    return {
      path: [
        { from, to, distance: jumpDistance, type: "jump" as const },
        { from: to, to: 30013950, distance: 1, type: "gate" as const },
        { from: 30013950, to, distance: 1, type: "smartgate" as const },
      ],
    };
  },
});
