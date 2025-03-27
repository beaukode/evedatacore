import { createCache } from "async-cache-dedupe";
import { chunk } from "lodash-es";
import { EnvVariablesService } from "./envVariables";
import { SolarSystemsService } from "./solarSystems";
import { Character, MudSqlService, Smartgate } from "./mudSql";
import { MudWeb3Service } from "./mudWeb3";
import { Optimize, PathFinderPathItem, SmartGateLink } from "./PathFinder/types";
import { callPathFinder, CallPathFinderConfig } from "./PathFinder/callPathFinders";
export { Optimize };

interface PathFinderServiceConfig {
  env: EnvVariablesService;
  solarSystems: SolarSystemsService;
  mudSql: MudSqlService;
  mudWeb3: MudWeb3Service;
}

type RoutePlannerSmartGate = Smartgate & { routePlannerId: number };

interface SortedUsableSmartgates {
  public: RoutePlannerSmartGate[];
  restricted: RoutePlannerSmartGate[];
  bySmartObjectId: Record<string, Smartgate>;
  byRoutePlannerId: Record<string, Smartgate>;
}

interface SmartGateLinks {
  links: SmartGateLink[];
  smartGatesByRoutePlannerId: Record<string, Smartgate>;
}

type BasePathFinderItem = {
  conn_type: "gate" | "smartgate" | "jump";
  distance: number;
  target: number;
};

type SmartGatePathFinderItem = BasePathFinderItem & {
  conn_type: "smartgate";
  id: string;
  owner?: Character;
  name?: string;
  itemId: string;
};

type JumpPathFinderItem = BasePathFinderItem & {
  conn_type: "jump";
};

type GatePathFinderItem = BasePathFinderItem & {
  conn_type: "gate";
};

type PathFinderItem = SmartGatePathFinderItem | JumpPathFinderItem | GatePathFinderItem;

const MAX_U32 = 4294967295; // From Rust

export function createPathFinderService({ env, solarSystems, mudSql, mudWeb3 }: PathFinderServiceConfig) {
  const config: CallPathFinderConfig = {
    lambda370Arn: env.PATHFINDER_ARN_370,
    lambda500Arn: env.PATHFINDER_ARN_500,
  };

  const cache = createCache({
    ttl: 60 * 15, // 15 minutes
    stale: 60,
    storage: { type: "memory" },
  })
    .define("getUsableSmartgates", async (): Promise<SortedUsableSmartgates> => {
      const smartGates = await mudSql.listUsableSmartgates();

      let nextId = MAX_U32;
      return Object.values(smartGates).reduce(
        (acc, sg) => {
          const routePlannerSmartGate: RoutePlannerSmartGate = { ...sg, routePlannerId: --nextId };
          if (sg.systemId == "0x0000000000000000000000000000000000000000000000000000000000000000") {
            acc.public.push(routePlannerSmartGate);
          } else {
            acc.restricted.push(routePlannerSmartGate);
          }
          acc.byRoutePlannerId[routePlannerSmartGate.routePlannerId] = sg;
          return acc;
        },
        { public: [], restricted: [], bySmartObjectId: smartGates, byRoutePlannerId: {} } as SortedUsableSmartgates,
      );
    })
    .define("getSmartGateLinks", async (characterId: string): Promise<SmartGateLinks> => {
      if (!characterId) return { links: [], smartGatesByRoutePlannerId: {} };
      const smartGates = await cache.getUsableSmartgates();

      const links: SmartGateLink[] = await Promise.allSettled(
        (smartGates.public ?? []).map(async (smartGate) => {
          const destination = smartGates.bySmartObjectId[smartGate.destinationId];
          if (destination) {
            const distance = await solarSystems.getDistance(smartGate.solarSystemId, destination.solarSystemId);
            return {
              from: Number(smartGate.solarSystemId),
              to: Number(destination.solarSystemId),
              distance: Math.round(distance),
              id: smartGate.routePlannerId,
            };
          }
          throw new Error(`Destination destination not found: ${smartGate.id} -> ${smartGate.destinationId}`);
        }),
      ).then(
        (results) => results.filter((r) => r.status === "fulfilled").map((p) => p.value), // Missconfigured smartgate may throw an error, ignore it
      );

      let allowedLinks: SmartGateLink[] = [];
      if (characterId !== "0") {
        const start = Date.now();
        allowedLinks = await Promise.allSettled(
          (smartGates.restricted ?? []).map(async (smartGate) => {
            const destination = smartGates.bySmartObjectId[smartGate.destinationId];

            if (destination) {
              const canJump = await mudWeb3.gateCanJump({
                characterId,
                sourceGateId: smartGate.id,
                destinationGateId: destination.id,
              });
              if (canJump) {
                const distance = await solarSystems.getDistance(smartGate.solarSystemId, destination.solarSystemId);
                return {
                  from: Number(smartGate.solarSystemId),
                  to: Number(destination.solarSystemId),
                  distance: Math.round(distance),
                  id: smartGate.routePlannerId,
                };
              }
            }
            throw new Error(`Destination destination not found: ${smartGate.id} -> ${smartGate.destinationId}`);
          }),
        ).then(
          (results) => results.filter((r) => r.status === "fulfilled").map((p) => p.value), // Missconfigured smartgate may throw an error, ignore it
        );
        console.log(`Got ${allowedLinks.length} allowed smartgate links in ${Date.now() - start}ms`);
      }

      return { links: [...links, ...allowedLinks], smartGatesByRoutePlannerId: smartGates.byRoutePlannerId };
    });

  return {
    findPath: async (
      from: number,
      to: number,
      jumpDistance: number,
      optimize: Optimize,
      characterId: string = "0",
    ): Promise<PathFinderItem[]> => {
      const smartGateLinks = await cache.getSmartGateLinks(characterId);

      const distance = await solarSystems.getDistance(from, to);
      let path: PathFinderPathItem[] = [];
      if (optimize !== Optimize.HOPS && distance > jumpDistance * 20) {
        // We need to split the problem
        const parts = Math.min(Math.ceil(distance / (jumpDistance * 20)), 4); // 4 is the maximum number of parts
        console.log(`Splitting the path into ${parts} parts`, distance);
        const largePath = await callPathFinder(from, to, 500, optimize, smartGateLinks.links, config);
        const chunkSize = Math.ceil(largePath.length / parts);
        const chunks = chunk(largePath, chunkSize);
        const nodes = [from, ...chunks.map((chunk) => chunk[chunk.length - 1]?.target ?? from)];

        let start: number = nodes.shift()!;
        const promises: Promise<Awaited<ReturnType<typeof callPathFinder>>>[] = [];
        while (nodes.length > 0) {
          const end = nodes.shift()!;
          promises.push(callPathFinder(start, end, jumpDistance, optimize, smartGateLinks.links, config));
          start = end;
        }
        const paths = await Promise.all(promises);
        path = paths.flat();
      } else {
        path = await callPathFinder(from, to, jumpDistance, optimize, smartGateLinks.links, config);
      }

      // Post process the path to add the owner and name to the smartgate items
      return path.map((item): PathFinderItem => {
        if (item.conn_type === "smartgate") {
          const smartGate = smartGateLinks.smartGatesByRoutePlannerId[item.id];
          if (!smartGate) {
            throw new Error(`SmartGate not found: ${item.id}`);
          }
          return {
            ...item,
            id: smartGate.id,
            owner: smartGate.owner,
            name: smartGate.name,
            itemId: smartGate.itemId,
          };
        }
        return item as JumpPathFinderItem | GatePathFinderItem;
      });
    },
  };
}
