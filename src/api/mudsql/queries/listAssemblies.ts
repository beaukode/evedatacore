import { keyBy } from "lodash-es";
import { MudSqlClient } from "../client";
import { ensureArray, toSqlHex } from "../utils";

const assemblyTypeMap = {
  0: 77917,
  1: 84556,
  2: 84955,
} as const;

type DbRow = {
  smartObjectId: string;
  createdAt: string;
  previousState: string;
  currentState: string;
  isValid?: boolean;
  anchoredAt: string;
  updatedBlockNumber: string;
  updatedBlockTime: string;
  type__smartObjectId: string;
  type__smartAssemblyType: keyof typeof assemblyTypeMap;
  owner__tokenId: string;
  owner__owner: string;
  character__characterAddress: string;
  character__characterId: string;
  entity__entityId: string;
  entity__name: string;
  location__smartObjectId: string;
  location__solarSystemId: string;
  location__x: string;
  location__y: string;
  location__z: string;
};

type EntityDbRow = {
  entityId: string;
  name: string;
  dappURL: string;
  description: string;
};

type Assembly = {
  id: string;
  state: number;
  typeId: number;
  isValid: boolean;
  anchoredAt: number;
  updatedAt: number;
  ownerId: string;
  ownerName: string;
  solarSystemId?: number;
  location?: { x: string; y: string; z: string };
  name?: string;
  dappUrl?: string;
  description?: string;
};

type ListAssembliesOptions = {
  owners?: string[] | string;
  states?: string[] | string; // Not used, very slow filter
};

export const listAssemblies =
  (client: MudSqlClient) =>
  async (options?: ListAssembliesOptions): Promise<Assembly[]> => {
    const whereParts: string[] = [];
    if (options?.owners) {
      const owners = ensureArray(options.owners);
      if (owners.length === 0) return []; // No owner to query

      whereParts.push(
        `eveworld__CharactersByAddr."characterAddress" IN ('${owners.map(toSqlHex).join("', '")}')`
      );
    }
    if (options?.states) {
      const states = ensureArray(options.states);
      if (states.length === 0) return []; // No state to query
      if (states.length === 1) {
        whereParts.push(
          `eveworld__DeployableState."currentState" = '${states[0]}'`
        );
      } else {
        whereParts.push(
          `eveworld__DeployableState."currentState" IN ('${states.join("', '")}')`
        );
      }
    }

    const assemblies = await client.selectFrom<DbRow>(
      "eveworld",
      "DeployableState",
      {
        where: whereParts.join(" AND "),
        orderBy: "createdAt",
        orderDirection: "DESC",
        rels: {
          type: {
            ns: "eveworld",
            table: "SmartAssemblyTab",
            field: "smartObjectId",
            fkNs: "eveworld",
            fkTable: "DeployableState",
            fkField: "smartObjectId",
          },
          owner: {
            ns: "erc721deploybl",
            table: "Owners",
            field: "tokenId",
            fkNs: "eveworld",
            fkTable: "DeployableState",
            fkField: "smartObjectId",
          },
          character: {
            ns: "eveworld",
            table: "CharactersByAddr",
            field: "characterAddress",
            fkNs: "erc721deploybl",
            fkTable: "Owners",
            fkField: "owner",
          },
          entity: {
            ns: "eveworld",
            table: "EntityRecordOffc",
            field: "entityId",
            fkNs: "eveworld",
            fkTable: "CharactersByAddr",
            fkField: "characterId",
          },
          location: {
            ns: "eveworld",
            table: "LocationTable",
            field: "smartObjectId",
            fkNs: "eveworld",
            fkTable: "DeployableState",
            fkField: "smartObjectId",
          },
        },
      }
    );

    const ids = assemblies.map((a) => a.smartObjectId);
    if (ids.length === 0) return [];

    const entities = await client.selectFrom<EntityDbRow>(
      "eveworld",
      "EntityRecordOffc",
      {
        where: `"entityId" IN ('${ensureArray(ids).join("', '")}')`,
      }
    );
    const entitiesById = keyBy(entities, "entityId");

    return assemblies.map((a) => ({
      id: a.smartObjectId,
      state: Number.parseInt(a.currentState, 10),
      anchoredAt: Number.parseInt(a.anchoredAt, 10) * 1000,
      updatedAt: Number.parseInt(a.updatedBlockTime, 10) * 1000,
      isValid: a.isValid || false,
      typeId: assemblyTypeMap[a.type__smartAssemblyType],
      ownerId: a.owner__owner,
      ownerName: a.entity__name,
      solarSystemId:
        a.location__solarSystemId !== "0"
          ? Number.parseInt(a.location__solarSystemId, 10)
          : undefined,
      location:
        a.location__solarSystemId !== "0"
          ? {
              x: a.location__x,
              y: a.location__y,
              z: a.location__z,
            }
          : undefined,
      name: entitiesById[a.smartObjectId]?.name,
      dappUrl: entitiesById[a.smartObjectId]?.dappURL,
      description: entitiesById[a.smartObjectId]?.description,
    }));
  };
