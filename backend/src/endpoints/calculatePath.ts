import { z } from "zod";
import { endpointsFactory } from "./factories";
import { Optimize } from "../services";

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
    optimize: z.nativeEnum(Optimize).optional().default(Optimize.FUEL),
    useSmartGates: z.coerce.string().optional().default(""),
  }),
  output: z.object({
    path: z.array(pathItemSchema),
  }),
  handler: async ({
    input: { from, to, jumpDistance, optimize, useSmartGates },
    options: {
      services: { pathFinder },
    },
  }) => {
    const path = await pathFinder.findPath(from, to, jumpDistance, optimize, useSmartGates);
    let prevSystem = from;
    const pathItems = path.map((item) => {
      const { conn_type, distance, target } = item;
      const newItem = {
        from: prevSystem,
        to: target,
        distance,
        type: conn_type,
      };
      prevSystem = target;
      return newItem;
    });
    return {
      path: pathItems,
    };
  },
});
