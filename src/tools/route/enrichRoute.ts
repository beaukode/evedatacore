import { lyDistance } from "../";
import { SolarSystemsIndex } from "../solarSystemsIndex";
import { GetFindPathResponse } from "@/api/evedatacore-v2/generated/types.gen";

type RouteData = GetFindPathResponse["items"];

export type EnrichedRouteStep = RouteData[number] & {
  fromName: string;
  toName: string;
};

export type EnrichedRouteData = {
  path: EnrichedRouteStep[];
  distance: number;
  jumps: number;
  jumpsDistance: number;
  hops: number;
};

export function enrichRoute(
  solarSystems: SolarSystemsIndex,
  data: RouteData
): EnrichedRouteData {
  const summary = data.reduce(
    (acc, step) => {
      const from = solarSystems.getById(step.from.toString());
      const to = solarSystems.getById(step.to.toString());
      if (!from || !to) {
        return acc; // Should not happen
      }
      const distance = lyDistance(from.location, to.location);
      if (step.type === "jump") {
        acc.jumps += 1;
        acc.jumpsDistance += distance;
        acc.distance += distance;
      } else {
        acc.distance += distance;
      }
      acc.path.push({
        ...step,
        fromName: from.name,
        toName: to.name,
        distance,
      });
      acc.hops += 1;
      return acc;
    },
    {
      path: [],
      distance: 0,
      jumps: 0,
      jumpsDistance: 0,
      hops: 0,
    } as EnrichedRouteData
  );
  return summary;
}
