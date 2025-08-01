import {
  decodeValueArgs,
  getKeySchema,
  getKeyTuple,
  getSchemaPrimitives,
  getSchemaTypes,
  getValueSchema,
} from "@latticexyz/protocol-parser/internal";
import { Table } from "@latticexyz/config";
import { MudWeb3ClientBase } from "../../types";
import { worldRead } from "./worldRead";
import { Hex } from "viem";

export type StoreGetRecordParameters<table extends Table> = {
  table: table;
  key: getSchemaPrimitives<getKeySchema<table>>;
};

export type StoreGetRecordReturnType<table extends Table> =
  | getSchemaPrimitives<table["schema"]>
  | undefined;

export async function storeGetRecord<table extends Table>(
  client: MudWeb3ClientBase,
  args: StoreGetRecordParameters<table>
): Promise<StoreGetRecordReturnType<table>> {
  const [staticData, encodedLengths, dynamicData] = await worldRead(client, {
    functionName: "getRecord",
    args: [
      args.table.tableId,
      getKeyTuple(args.table, args.key) as readonly Hex[],
    ] as [Hex, readonly Hex[]],
  });

  if (
    /^0x0*$/.test(staticData) &&
    /^0x0*$/.test(encodedLengths) &&
    /^0x0*$/.test(dynamicData)
  ) {
    // Record not found
    return undefined;
  }

  return {
    ...args.key,
    ...decodeValueArgs(getSchemaTypes(getValueSchema(args.table)), {
      staticData,
      encodedLengths,
      dynamicData,
    }),
  };
}
