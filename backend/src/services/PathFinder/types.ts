import { z } from "zod";

export enum Optimize {
  FUEL = "fuel",
  DISTANCE = "distance",
  HOPS = "hops",
}

export type SmartGateLink = {
  from: number;
  to: number;
  distance: number;
  id: number;
};

export const pathFinderResponseSchema = z.object({
  status: z.enum(["found", "notfound", "timeout"]),
  path: z.array(
    z.object({
      conn_type: z.enum(["gate", "smartgate", "jump"]),
      distance: z.number(),
      target: z.number(),
      id: z.number(),
    }),
  ),
  stats: z.object({
    cost: z.number(),
    total_time: z.number(),
    successors_spend: z.number(),
    loop_spend: z.number(),
    visited: z.number(),
  }),
});

export type PathFinderResponse = z.infer<typeof pathFinderResponseSchema>;

export type PathFinderPathItem = PathFinderResponse["path"][number];
