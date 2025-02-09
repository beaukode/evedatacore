import { getSchemaPrimitives } from "@latticexyz/protocol-parser/internal";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type AssemblyGetMetadataParameters = {
  assemblyId: bigint;
};

type TableSchema =
  typeof eveworld.tables.eveworld__EntityRecordOffchainTable.schema;

export type AssemblyGetMetadataReturnType = getSchemaPrimitives<TableSchema>;

export async function assemblyGetMetadata(
  client: MudWeb3ClientBase,
  args: AssemblyGetMetadataParameters
): Promise<AssemblyGetMetadataReturnType> {
  return storeGetRecord(client, {
    table: eveworld.tables.eveworld__EntityRecordOffchainTable,
    key: { entityId: args.assemblyId },
  });
}
