import { getSchemaPrimitives } from "@latticexyz/protocol-parser/internal";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type AssemblyGetLocationParameters = {
  assemblyId: bigint;
};

type TableSchema = typeof eveworld.tables.eveworld__LocationTable.schema;

export type AssemblyGetLocationReturnType = getSchemaPrimitives<TableSchema>;

export async function assemblyGetLocation(
  client: MudWeb3ClientBase,
  args: AssemblyGetLocationParameters
): Promise<AssemblyGetLocationReturnType> {
  const r = await storeGetRecord(client, {
    table: eveworld.tables.eveworld__LocationTable,
    key: { smartObjectId: args.assemblyId },
  });

  if (!r) {
    throw new Error(`Assembly ${args.assemblyId} not found`);
  }

  return r;
}
