import { calcNear } from "../api/route-planner";

type FoundSystem = {
  solarSystemId: number;
  distance: number;
};

export function createNearFinderService() {
  return {
    findNear: async (from: number, distance: number): Promise<FoundSystem[]> => {
      const r = await calcNear({
        body: {
          from,
          distance: distance,
        },
        baseUrl: process.env.ROUTE_PLANNER_BASE_URL,
      });
      if (r.error) {
        throw new Error("Route planner API error: " + r.error);
      }
      if (!r.data?.connections) {
        throw new Error("Route planner API did not return any connections");
      }
      return r.data.connections.map((connection) => ({
        solarSystemId: connection.target,
        distance: connection.distance,
      }));
    },
  };
}
