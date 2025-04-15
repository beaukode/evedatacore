import { keyBy } from "lodash-es";
import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { ensureArray, toSqlHex } from "../utils";
import { Assembly } from "../types";

const assemblyTypeMap = {
  0: 77917,
  1: 84556,
  2: 84955,
} as const;

type AssemblyDbRow = {
  smartObjectId: string;
  createdAt: string;
  previousState: string;
  currentState: string;
  isValid?: boolean;
  anchoredAt: string;
  updatedBlockNumber: string;
  updatedBlockTime: string;
};

type TypeDbRow = {
  smartObjectId: string;
  smartAssemblyType: keyof typeof assemblyTypeMap;
};

type OwnerDbRow = {
  tokenId: string;
  owner: Hex;
};

type LocationDbRow = {
  smartObjectId: string;
  solarSystemId: string;
  x: string;
  y: string;
  z: string;
};

type EntityDbRow = {
  entityId: string;
  name: string;
  dappURL: string;
  description: string;
};

type ListAssembliesOptions = {
  owners?: string[] | string;
  solarSystemId?: string[] | string;
};

type Owner = {
  tokenId: string;
  owner: string;
};

export const listAssemblies =
  (client: MudSqlClient) =>
  async (options?: ListAssembliesOptions): Promise<Assembly[]> => {
    let ids: string[] | undefined = undefined;
    if (options?.owners) {
      const ownersAddress = ensureArray(options.owners);
      if (ownersAddress.length === 0) return []; // No owner to query

      const owners = await client.selectFrom<Owner>(
        "erc721deploybl",
        "Owners",
        {
          where: `"owner" IN ('${ownersAddress.map(toSqlHex).join("', '")}')`,
        }
      );
      ids = owners.map((o) => o.tokenId);
    }
    if (options?.solarSystemId) {
      const solarSystemIds = ensureArray(options.solarSystemId);
      if (solarSystemIds.length === 0) return []; // No solar system to query

      const locations = await client.selectFrom<LocationDbRow>(
        "eveworld",
        "LocationTable",
        {
          where: `"solarSystemId" IN ('${solarSystemIds.join("', '")}')`,
        }
      );
      ids = locations.map((l) => l.smartObjectId);
    }

    if (ids && ids.length === 0) return [];

    const [assemblies, types, owners, locations, entities] =
      await client.selectFromBatch<
        [AssemblyDbRow, TypeDbRow, OwnerDbRow, LocationDbRow, EntityDbRow]
      >([
        {
          ns: "eveworld",
          table: "DeployableState",
          options: {
            orderBy: "createdAt",
            orderDirection: "DESC",
            where: ids
              ? `"smartObjectId" IN ('${ids.join("', '")}')`
              : undefined,
          },
        },
        {
          ns: "eveworld",
          table: "SmartAssemblyTab",
          options: {
            where: ids
              ? `"smartObjectId" IN ('${ids.join("', '")}')`
              : undefined,
          },
        },
        {
          ns: "erc721deploybl",
          table: "Owners",
          options: {
            where: ids ? `"tokenId" IN ('${ids.join("', '")}')` : undefined,
          },
        },
        {
          ns: "eveworld",
          table: "LocationTable",
          options: {
            where: ids
              ? `"smartObjectId" IN ('${ids.join("', '")}')`
              : undefined,
          },
        },
        {
          ns: "eveworld",
          table: "EntityRecordOffc",
          options: {
            where: ids ? `"entityId" IN ('${ids.join("', '")}')` : undefined,
          },
        },
      ]);

    if (assemblies.length === 0) return [];

    const ownersAddresses = [...new Set(owners.map((o) => o.owner))];
    const [characters] = await Promise.all([
      client.listCharacters({ addresses: ownersAddresses }),
    ]);
    const typesById = keyBy(types, "smartObjectId");
    const ownersById = keyBy(owners, "tokenId");
    const locationsById = keyBy(locations, "smartObjectId");
    const entitiesById = keyBy(entities, "entityId");
    const charactersById = keyBy(characters, "address");

    return assemblies
      .map((a) => {
        const type = typesById[a.smartObjectId];
        const owner = ownersById[a.smartObjectId];
        const location = locationsById[a.smartObjectId];
        if (!type || !owner || !location) return undefined;
        return {
          id: a.smartObjectId,
          state: Number.parseInt(a.currentState, 10),
          anchoredAt: Number.parseInt(a.anchoredAt, 10) * 1000,
          isValid: a.isValid || false,
          typeId: assemblyTypeMap[type.smartAssemblyType],
          ownerId: owner.owner,
          ownerName: charactersById[owner.owner]?.name || "Unknown",
          solarSystemId:
            location.solarSystemId !== "0"
              ? Number.parseInt(location.solarSystemId, 10)
              : undefined,
          location:
            location.solarSystemId !== "0"
              ? {
                  x: location.x,
                  y: location.y,
                  z: location.z,
                }
              : undefined,
          name: entitiesById[a.smartObjectId]?.name,
          dappUrl: entitiesById[a.smartObjectId]?.dappURL,
          description: entitiesById[a.smartObjectId]?.description,
        };
      })
      .filter((a) => a !== undefined);
  };
