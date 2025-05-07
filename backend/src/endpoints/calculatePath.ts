import { z } from "zod";
import { endpointsFactory } from "./factories";
import { Optimize } from "../services";

const pathItemSchema = z.object({
  from: z.number(),
  to: z.number(),
  distance: z.number(),
  type: z.enum(["jump", "gate"]),
});

const pathSmartgateItemSchema = z.object({
  from: z.number(),
  to: z.number(),
  distance: z.number(),
  type: z.literal("smartgate"),
  id: z.string(),
  owner: z.object({ address: z.string(), id: z.string(), name: z.string(), corpId: z.number() }).optional(),
  name: z.string().optional(),
  itemId: z.string(),
});

export const calculatePath = endpointsFactory.build({
  method: "get",
  input: z.object({
    from: z.coerce.number().positive().min(30000000).max(39000000),
    to: z.coerce.number().positive().min(30000000).max(39000000),
    jumpDistance: z.coerce.number().positive().max(500).optional().default(0),
    optimize: z.nativeEnum(Optimize).optional().default(Optimize.FUEL),
    characterId: z.string().optional(),
    corpId: z.coerce.number().optional(),
    smartGates: z.enum(["none", "unrestricted", "restricted"]).optional().default("unrestricted"),
    onlySmartGates: z.enum(["all", "mine", "corporation"]).optional().default("all"),
  }),
  output: z.object({
    path: z.array(z.union([pathItemSchema, pathSmartgateItemSchema])),
  }),
  handler: async ({
    input: { from, to, jumpDistance, optimize, characterId, corpId, smartGates, onlySmartGates },
    options: {
      responseHeaders,
      services: { pathFinder },
    },
  }) => {
    const path = await pathFinder.findPath(
      from,
      to,
      jumpDistance,
      optimize,
      characterId,
      corpId,
      smartGates,
      onlySmartGates,
    );
    let prevSystem = from;
    const pathItems = path.map((item) => {
      const { conn_type, distance, target } = item;
      const from = prevSystem;
      prevSystem = target;
      if (conn_type === "smartgate") {
        return {
          from,
          to: target,
          distance,
          type: "smartgate" as const,
          id: item.id,
          owner: item.owner,
          name: item.name,
          itemId: item.itemId,
        };
      } else {
        return {
          from,
          to: target,
          distance,
          type: conn_type,
        };
      }
    });
    responseHeaders.setCache(60 * 10);
    return {
      path: pathItems,
    };
  },
});
