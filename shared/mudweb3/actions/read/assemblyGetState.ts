import { getSchemaPrimitives } from "@latticexyz/protocol-parser/internal";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type AssemblyGetStateParameters = {
  assemblyId: bigint;
};

type TableSchema = typeof eveworld.tables.evefrontier__DeployableState.schema;

export type AssemblyGetStateReturnType = getSchemaPrimitives<TableSchema>;

export async function assemblyGetState(
  client: MudWeb3ClientBase,
  args: AssemblyGetStateParameters
): Promise<AssemblyGetStateReturnType> {
  const r = await storeGetRecord(client, {
    table: eveworld.tables.evefrontier__DeployableState,
    key: { smartObjectId: args.assemblyId },
  });

  if (!r) {
    throw new Error(`Assembly ${args.assemblyId} not found`);
  }

  return r;
}
