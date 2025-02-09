import { getSchemaPrimitives } from "@latticexyz/protocol-parser/internal";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type AssemblyGetStateParameters = {
  assemblyId: bigint;
};

type TableSchema = typeof eveworld.tables.eveworld__DeployableState.schema;

export type AssemblyGetStateReturnType = getSchemaPrimitives<TableSchema>;

export async function assemblyGetState(
  client: MudWeb3ClientBase,
  args: AssemblyGetStateParameters
): Promise<AssemblyGetStateReturnType> {
  return storeGetRecord(client, {
    table: eveworld.tables.eveworld__DeployableState,
    key: { smartObjectId: args.assemblyId },
  });
}
