import { getSchemaPrimitives } from "@latticexyz/protocol-parser/internal";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type AssemblyGetMetadataParameters = {
  assemblyId: bigint;
};

type TableSchema = typeof eveworld.tables.evefrontier__EntityRecordMeta.schema;

export type AssemblyGetMetadataReturnType =
  | getSchemaPrimitives<TableSchema>
  | undefined;

export async function assemblyGetMetadata(
  client: MudWeb3ClientBase,
  args: AssemblyGetMetadataParameters
): Promise<AssemblyGetMetadataReturnType> {
  const r = await storeGetRecord(client, {
    table: eveworld.tables.evefrontier__EntityRecordMeta,
    key: { smartObjectId: args.assemblyId },
  });

  return r;
}
