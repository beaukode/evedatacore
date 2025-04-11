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
  entityId: string;
  itemId: string;
  typeId: string;
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

type ConfigDbRow = {
  smartObjectId: string;
  systemId: string;
};

type LinkDbRow = {
  sourceGateId: string;
  destinationGateId: string;
  isLinked: boolean;
};

type Owner = {
  tokenId: string;
  owner: string;
};

export const listUsableSmartgates =
  (client: MudSqlClient) => async (): Promise<Record<string, UsableSmartgate>> => {
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
        table: "EntityRecordTabl",
        options: {
          where: `"typeId" = 84955`,
        },
      },
      {
        ns: "evefrontier",
        table: "SmartGateLinkTab",
        options: {
          where: `"isLinked" = true`,
        },
      },
    ]);

    const linksById = keyBy(links, "sourceGateId");
    const smartObjectIds = intersection(
      assemblies.map((a) => (linksById[a.smartObjectId] ? a.smartObjectId : 0)), // Filter out non linked gates (0 will never be in the types array)
      items.map((t) => t.entityId)
    );

    const [locations, owners, entities, config] = await client.selectFromBatch<
      [LocationDbRow, Owner, EntityDbRow, ConfigDbRow]
    >([
      {
        ns: "evefrontier",
        table: "LocationTable",
        options: {
          where: `"smartObjectId" IN ('${ensureArray(smartObjectIds).join("', '")}')`,
        },
      },
      {
        ns: "erc721deploybl",
        table: "Owners",
        options: {
          where: `"tokenId" IN ('${ensureArray(smartObjectIds).join("', '")}')`,
        },
      },
      {
        ns: "evefrontier",
        table: "EntityRecordOffc",
        options: {
          where: `"entityId" IN ('${ensureArray(smartObjectIds).join("', '")}')`,
        },
      },
      {
        ns: "evefrontier",
        table: "SmartGateConfigT",
        options: {
          where: `"smartObjectId" IN ('${ensureArray(smartObjectIds).join("', '")}')`,
        },
      },
    ]);

    const ownersById = keyBy(owners, "tokenId");
    const entitiesById = keyBy(entities, "entityId");
    const configById = keyBy(config, "smartObjectId");
    const itemsById = keyBy(items, "entityId");

    const ownersAddresses = [...new Set(owners.map((o) => o.owner))];
    const characters = await client.listCharacters({
      addresses: ownersAddresses,
    });
    const charactersByAddress = keyBy(characters, "address");

    const smartgates: Record<string, UsableSmartgate> = locations.reduce(
      (acc, { smartObjectId, solarSystemId, ...location }) => {
        const ownerAddress = ownersById[smartObjectId]?.owner || "0x0";
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
