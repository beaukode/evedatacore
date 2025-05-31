import { intersection, keyBy } from "lodash-es";
import { MudSqlClient } from "../client";
import { ensureArray } from "../utils";
import { UsableSmartgate } from "../types";

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

type EntityRecordDbRow = {
  smartObjectId: string;
  itemId: string;
  typeId: string;
};

type LinkDbRow = {
  sourceGateId: string;
  destinationGateId: string;
  isLinked: boolean;
};

type LocationDbRow = {
  smartObjectId: string;
  solarSystemId: string;
  x: string;
  y: string;
  z: string;
};

type OwnershipDbRow = {
  smartObjectId: string;
  account: string;
};

type EntityDbRow = {
  smartObjectId: string;
  name: string;
  dappURL: string;
  description: string;
};

type ConfigDbRow = {
  smartObjectId: string;
  systemId: string;
  maxDistance: string;
};

export const listUsableSmartgates =
  (client: MudSqlClient) =>
  async (): Promise<Record<string, UsableSmartgate>> => {
    const [assemblies, items, links] = await client.selectFromBatch<
      [AssemblyDbRow, EntityRecordDbRow, LinkDbRow]
    >([
      {
        ns: "evefrontier",
        table: "DeployableState",
        options: {
          where: `"currentState" = 3`,
        },
      },
      {
        ns: "evefrontier",
        table: "EntityRecord",
        options: {
          where: `"typeId" = 84955`,
        },
      },
      {
        ns: "evefrontier",
        table: "SmartGateLink",
        options: {
          where: `"isLinked" = true`,
        },
      },
    ]);

    const linksById = keyBy(links, "sourceGateId");
    const smartObjectIds = intersection(
      assemblies.map((a) => (linksById[a.smartObjectId] ? a.smartObjectId : 0)), // Filter out non linked gates (0 will never be in the types array)
      items.map((t) => t.smartObjectId)
    );

    if (smartObjectIds.length === 0) return {};

    const [locations, owners, entities, config] = await client.selectFromBatch<
      [LocationDbRow, OwnershipDbRow, EntityDbRow, ConfigDbRow]
    >([
      {
        ns: "evefrontier",
        table: "Location",
        options: {
          where: `"smartObjectId" IN ('${ensureArray(smartObjectIds).join("', '")}')`,
        },
      },
      {
        ns: "evefrontier",
        table: "OwnershipByObjec",
        options: {
          where: `"smartObjectId" IN ('${ensureArray(smartObjectIds).join("', '")}')`,
        },
      },
      {
        ns: "evefrontier",
        table: "EntityRecordMeta",
        options: {
          where: `"smartObjectId" IN ('${ensureArray(smartObjectIds).join("', '")}')`,
        },
      },
      {
        ns: "evefrontier",
        table: "SmartGateConfig",
        options: {
          where: `"smartObjectId" IN ('${ensureArray(smartObjectIds).join("', '")}')`,
        },
      },
    ]);

    const ownersById = keyBy(owners, "smartObjectId");
    const entitiesById = keyBy(entities, "smartObjectId");
    const configById = keyBy(config, "smartObjectId");
    const itemsById = keyBy(items, "smartObjectId");

    const ownersAddresses = [...new Set(owners.map((o) => o.account))];
    const characters = await client.listCharacters({
      addresses: ownersAddresses,
    });
    const charactersByAddress = keyBy(characters, "address");

    const smartgates: Record<string, UsableSmartgate> = locations.reduce(
      (acc, { smartObjectId, solarSystemId, ...location }) => {
        const ownerAddress = ownersById[smartObjectId]?.account || "0x0";
        acc[smartObjectId] = {
          id: smartObjectId,
          solarSystemId,
          location,
          systemId: configById[smartObjectId]?.systemId || "0x0",
          ownerAddress,
          owner: charactersByAddress[ownerAddress],
          name: entitiesById[smartObjectId]?.name,
          dappUrl: entitiesById[smartObjectId]?.dappURL,
          description: entitiesById[smartObjectId]?.description,
          destinationId: linksById[smartObjectId]!.destinationGateId,
          itemId: itemsById[smartObjectId]?.itemId || "0",
        };
        return acc;
      },
      {} as Record<string, UsableSmartgate>
    );

    return smartgates;
  };
