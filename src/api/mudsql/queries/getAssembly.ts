import { MudSqlClient } from "../client";

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
  ownerId: string;
  ownerName: string;
  solarSystemId?: number;
  location?: { x: string; y: string; z: string };
  name?: string;
  dappUrl?: string;
  description?: string;
};

export const getAssembly =
  (client: MudSqlClient) =>
  async (id: string): Promise<Assembly | undefined> => {
    const [assemblies, entities] = await Promise.all([
      client.selectFrom<DbRow>("eveworld", "DeployableState", {
        where: `"eveworld__DeployableState"."smartObjectId" = '${id}'`,
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
      }),
      client.selectFrom<EntityDbRow>("eveworld", "EntityRecordOffc", {
        where: `"entityId" = '${id}'`,
      }),
    ]);
    const assembly = assemblies[0];
    if (!assembly) return undefined;

    const entity = entities[0];

    return {
      id: assembly.smartObjectId,
      state: Number.parseInt(assembly.currentState, 10),
      anchoredAt: Number.parseInt(assembly.anchoredAt, 10) * 1000,
      isValid: assembly.isValid || false,
      typeId: assemblyTypeMap[assembly.type__smartAssemblyType],
      ownerId: assembly.owner__owner,
      ownerName: assembly.entity__name,
      solarSystemId:
        assembly.location__solarSystemId !== "0"
          ? Number.parseInt(assembly.location__solarSystemId, 10)
          : undefined,
      location:
        assembly.location__solarSystemId !== "0"
          ? {
              x: assembly.location__x,
              y: assembly.location__y,
              z: assembly.location__z,
            }
          : undefined,
      name: entity?.name,
      dappUrl: entity?.dappURL,
      description: entity?.description,
    };
  };
