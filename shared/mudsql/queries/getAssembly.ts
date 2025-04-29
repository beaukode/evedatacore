import { Hex } from "viem";
import { MudSqlClient } from "../client";
import { Assembly, AssemblyType } from "../types";

const assemblyTypeMap = {
  SSU: AssemblyType.Storage,
  ST: AssemblyType.Turret,
  SG: AssemblyType.Gate,
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
  type__assemblyType: keyof typeof assemblyTypeMap;
  owner__smartObjectId: string;
  owner__account: Hex;
  character__account: string;
  character__smartObjectId: string;
  ownerEntity__smartObjectId: string;
  ownerEntity__name: string;
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

export const getAssembly =
  (client: MudSqlClient) =>
  async (id: string): Promise<Assembly | undefined> => {
    const [assemblies, entities] = await Promise.all([
      client.selectFrom<DbRow>("evefrontier", "DeployableState", {
        where: `"evefrontier__DeployableState"."smartObjectId" = '${id}'`,
        orderBy: "createdAt",
        orderDirection: "DESC",
        rels: {
          type: {
            ns: "evefrontier",
            table: "SmartAssembly",
            field: "smartObjectId",
            fkNs: "evefrontier",
            fkTable: "DeployableState",
            fkField: "smartObjectId",
          },
          owner: {
            ns: "evefrontier",
            table: "OwnershipByObjec",
            field: "smartObjectId",
            fkNs: "evefrontier",
            fkTable: "DeployableState",
            fkField: "smartObjectId",
          },
          character: {
            ns: "evefrontier",
            table: "CharactersByAcco",
            field: "account",
            fkNs: "evefrontier",
            fkTable: "OwnershipByObjec",
            fkField: "account",
          },
          ownerEntity: {
            ns: "evefrontier",
            table: "EntityRecordMeta",
            field: "smartObjectId",
            fkNs: "evefrontier",
            fkTable: "CharactersByAcco",
            fkField: "smartObjectId",
          },
          location: {
            ns: "evefrontier",
            table: "Location",
            field: "smartObjectId",
            fkNs: "evefrontier",
            fkTable: "DeployableState",
            fkField: "smartObjectId",
          },
        },
      }),
      client.selectFrom<EntityDbRow>("evefrontier", "EntityRecordMeta", {
        where: `"smartObjectId" = '${id}'`,
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
      typeId: assemblyTypeMap[assembly.type__assemblyType],
      ownerId: assembly.owner__account,
      ownerName: assembly.ownerEntity__name,
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
