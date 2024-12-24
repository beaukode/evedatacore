import { fetchRecords, selectFrom } from "@latticexyz/store-sync/internal";
import { getSchemaPrimitives } from "@latticexyz/protocol-parser/internal";
import { hexToResource } from "@latticexyz/common";
import storeConfig from "@latticexyz/store/mud.config";
import worldConfig from "@latticexyz/world/mud.config";
import { worldAddress } from "../constants";
import { decodeTable, eveworld } from "./externals";
import { Table } from "@latticexyz/config";
import { ensureArray, toSqlHex } from "./utils";

const queryUncompleted = selectFrom({
  table: storeConfig.tables.store__Tables,
});

type MudConfigTablesLabels<T extends { [key: string]: { label: string } }> =
  T[keyof T]["label"];

export type SqlIndexer = {
  tables: {
    store: Record<MudConfigTablesLabels<typeof storeConfig.tables>, Table>;
    world: Record<MudConfigTablesLabels<typeof worldConfig.tables>, Table>;
    eveworld: Record<MudConfigTablesLabels<typeof eveworld.tables>, Table>;
    [key: string]:
      | {
          [key: string]: Table | undefined;
        }
      | undefined;
  };
  listNamespaces: (filters?: {
    owners: string[] | string;
  }) => Promise<{ namespaceId: string; name: string; owner: string }[]>;
};

// export type SqlIndexer = {
//   tables: {
//     store: {
//       [storeConfig.tables.store__ResourceIds.label]: Table;
//       [storeConfig.tables.store__StoreHooks.label]: Table;
//       [storeConfig.tables.store__Tables.label]: Table;
//     };
//     world: {
//       [worldConfig.tables.world__Balances.label]: Table;
//       [worldConfig.tables.world__FunctionSelectors.label]: Table;
//       [worldConfig.tables.world__FunctionSignatures.label]: Table;
//       [worldConfig.tables.world__InitModuleAddress.label]: Table;
//       [worldConfig.tables.world__InstalledModules.label]: Table;
//       [worldConfig.tables.world__NamespaceDelegationControl.label]: Table;
//       [worldConfig.tables.world__NamespaceOwner.label]: Table;
//       [worldConfig.tables.world__ResourceAccess.label]: Table;
//       [worldConfig.tables.world__SystemHooks.label]: Table;
//       [worldConfig.tables.world__SystemRegistry.label]: Table;
//       [worldConfig.tables.world__Systems.label]: Table;
//       [worldConfig.tables.world__UserDelegationControl.label]: Table;
//     };
//     eveworld: {
//       [eveworld.tables.eveworld__AccessEnforcePerObject.label]: Table;
//       [eveworld.tables.eveworld__AccessEnforcement.label]: Table;
//       [eveworld.tables.eveworld__AccessRole.label]: Table;
//       [eveworld.tables.eveworld__AccessRolePerObject.label]: Table;
//       [eveworld.tables.eveworld__AccessRolePerSys.label]: Table;
//       [eveworld.tables.eveworld__CharactersByAddressTable.label]: Table;
//       [eveworld.tables.eveworld__CharactersConstantsTable.label]: Table;
//       [eveworld.tables.eveworld__CharactersTable.label]: Table;
//       [eveworld.tables.eveworld__ClassConfig.label]: Table;
//       [eveworld.tables.eveworld__DeployableFuelBalance.label]: Table;
//       [eveworld.tables.eveworld__DeployableState.label]: Table;
//       [eveworld.tables.eveworld__DeployableTokenTable.label]: Table;
//       [eveworld.tables.eveworld__EntityRecordOffchainTable.label]: Table;
//       [eveworld.tables.eveworld__EntityRecordTable.label]: Table;
//       [eveworld.tables.eveworld__EphemeralInvCapacityTable.label]: Table;
//       [eveworld.tables.eveworld__EphemeralInvItemTable.label]: Table;
//       [eveworld.tables.eveworld__EphemeralInvTable.label]: Table;
//       [eveworld.tables.eveworld__GlobalDeployableState.label]: Table;
//       [eveworld.tables.eveworld__InventoryItemTable.label]: Table;
//       [eveworld.tables.eveworld__InventoryTable.label]: Table;
//       [eveworld.tables.eveworld__ItemTransferOffchainTable.label]: Table;
//       [eveworld.tables.eveworld__KillMailTable.label]: Table;
//       [eveworld.tables.eveworld__LocationTable.label]: Table;
//       [eveworld.tables.eveworld__SmartAssemblyTable.label]: Table;
//       [eveworld.tables.eveworld__SmartGateConfigTable.label]: Table;
//       [eveworld.tables.eveworld__SmartGateLinkTable.label]: Table;
//       [eveworld.tables.eveworld__SmartTurretConfigTable.label]: Table;
//       [eveworld.tables.eveworld__StaticDataGlobalTable.label]: Table;
//       [eveworld.tables.eveworld__StaticDataTable.label]: Table;
//     };
//     [key: string]:
//       | {
//           [key: string]: Table | undefined;
//         }
//       | undefined;
//   };
// };

export async function setupSqlIndexer(): Promise<SqlIndexer> {
  const queryResult = await fetchRecords({
    indexerUrl: "https://indexer.mud.garnetchain.com/q",
    storeAddress: worldAddress,
    queries: [queryUncompleted],
  });

  const result = queryResult.result.pop();
  if (!result) {
    throw new Error("Unable to fetch tables data");
  }
  const tables = result.records.reduce(
    (acc, schema) => {
      const table = decodeTable(schema);
      const namespace = table.namespace;
      if (!acc[namespace]) {
        acc[namespace] = {};
      }
      acc[namespace][table.label] = table;
      return acc;
    },
    {} as SqlIndexer["tables"]
  );

  async function listNamespaces(filters?: { owners: string[] | string }) {
    const queryResult = await fetchRecords({
      indexerUrl: "https://indexer.mud.garnetchain.com/q",
      storeAddress: worldAddress,
      queries: [
        selectFrom({
          table: tables.world.NamespaceOwner,
          where: filters?.owners
            ? `"owner" IN ('${ensureArray(filters.owners).map(toSqlHex).join("', '")}')`
            : undefined,
        }),
      ],
    });

    const records =
      (queryResult.result.pop()?.records as getSchemaPrimitives<
        typeof worldConfig.tables.world__NamespaceOwner.schema
      >[]) || [];
    return records.map((r) => ({
      namespaceId: r.namespaceId,
      name: hexToResource(r.namespaceId).namespace,
      owner: r.owner,
    }));
  }

  console.debug("tables", tables);

  return { tables, listNamespaces };
}
