import { keyBy } from "lodash-es";
import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { ensureArray, toSqlHex } from "../utils";
import {
  Assembly,
  AssemblyState,
  AssemblyType,
  assemblyTypeMap,
  assemblyTypeReverseMap,
} from "../types";

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
  assemblyType: keyof typeof assemblyTypeMap;
};

type OwnerDbRow = {
  smartObjectId: string;
  account: Hex;
};

type LocationDbRow = {
  smartObjectId: string;
  solarSystemId: string;
  x: string;
  y: string;
  z: string;
};

type EntityDbRow = {
  smartObjectId: string;
  name: string;
  dappURL: string;
  description: string;
};

type ListAssembliesOptions = {
  owners?: string[] | string;
  solarSystemId?: string[] | string;
  types?: AssemblyType[] | AssemblyType;
  states?: AssemblyState[] | AssemblyState;
  ids?: string[] | string;
};

function buildWhere(
  filter: string,
  idColumn: string,
  ids: string[] | undefined
) {
  if (!ids) {
    return filter;
  }
  return `${filter} AND "${idColumn}" IN ('${ids.join("', '")}')`;
}

export const listAssemblies =
  (client: MudSqlClient) =>
  async (options?: ListAssembliesOptions): Promise<Assembly[]> => {
    let ids: string[] | undefined = undefined;
    if (options?.owners) {
      const ownersAddress = ensureArray(options.owners);
      if (ownersAddress.length === 0) return []; // No owner to query

      const owners = await client.selectFrom<OwnerDbRow>(
        "evefrontier",
        "OwnershipByObjec",
        {
          where: buildWhere(
            `"account" IN ('${ownersAddress.map(toSqlHex).join("', '")}')`,
            "smartObjectId",
            ids
          ),
        }
      );
      ids = owners.map((o) => o.smartObjectId);
    }
    if (options?.solarSystemId) {
      const solarSystemIds = ensureArray(options.solarSystemId);
      if (solarSystemIds.length === 0) return []; // No solar system to query

      const locations = await client.selectFrom<LocationDbRow>(
        "evefrontier",
        "Location",
        {
          where: buildWhere(
            `"solarSystemId" IN ('${solarSystemIds.join("', '")}')`,
            "smartObjectId",
            ids
          ),
        }
      );
      ids = locations.map((l) => l.smartObjectId);
    }
    if (options?.types) {
      const typesIds = ensureArray(options.types).map(
        (t) => assemblyTypeReverseMap[t]
      );
      if (typesIds.length === 0) return []; // No types to query

      const types = await client.selectFrom<TypeDbRow>(
        "evefrontier",
        "SmartAssembly",
        {
          where: buildWhere(
            `"assemblyType" IN ('${typesIds.join("', '")}')`,
            "smartObjectId",
            ids
          ),
        }
      );
      ids = types.map((t) => t.smartObjectId);
    }
    if (options?.ids) {
      ids = ensureArray(options.ids);
    }

    let assembliesWhere = ids
      ? `"smartObjectId" IN ('${ids.join("', '")}')`
      : undefined;
    if (options?.states) {
      const statesIds = ensureArray(options.states);
      if (statesIds.length === 0) return []; // No states to query

      assembliesWhere = buildWhere(
        `"currentState" IN ('${statesIds.join("', '")}')`,
        "smartObjectId",
        ids
      );
    }

    if (ids && ids.length === 0) return [];

    const [assemblies, types, owners, locations, entities] =
      await client.selectFromBatch<
        [AssemblyDbRow, TypeDbRow, OwnerDbRow, LocationDbRow, EntityDbRow]
      >([
        {
          ns: "evefrontier",
          table: "DeployableState",
          options: {
            orderBy: "createdAt",
            orderDirection: "DESC",
            where: assembliesWhere,
          },
        },
        {
          ns: "evefrontier",
          table: "SmartAssembly",
          options: {
            where: ids
              ? `"smartObjectId" IN ('${ids.join("', '")}')`
              : undefined,
          },
        },
        {
          ns: "evefrontier",
          table: "OwnershipByObjec",
          options: {
            where: ids
              ? `"smartObjectId" IN ('${ids.join("', '")}')`
              : undefined,
          },
        },
        {
          ns: "evefrontier",
          table: "Location",
          options: {
            where: ids
              ? `"smartObjectId" IN ('${ids.join("', '")}')`
              : undefined,
          },
        },
        {
          ns: "evefrontier",
          table: "EntityRecordMeta",
          options: {
            where: ids
              ? `"smartObjectId" IN ('${ids.join("', '")}')`
              : undefined,
          },
        },
      ]);

    if (assemblies.length === 0) return [];

    const ownersAddresses = [...new Set(owners.map((o) => o.account))];
    const [characters] = await Promise.all([
      client.listCharacters({ addresses: ownersAddresses }),
    ]);
    const typesById = keyBy(types, "smartObjectId");
    const ownersById = keyBy(owners, "smartObjectId");
    const locationsById = keyBy(locations, "smartObjectId");
    const entitiesById = keyBy(entities, "smartObjectId");
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
          typeId: assemblyTypeMap[type.assemblyType],
          ownerId: owner.account,
          ownerName: charactersById[owner.account]?.name || "Unknown",
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
