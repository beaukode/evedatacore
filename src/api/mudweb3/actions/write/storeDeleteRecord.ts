import { TransactionReceipt } from "viem";
import { Table } from "@latticexyz/config";
import {
  getSchemaTypes,
  getKeySchema,
  encodeKey,
  getKey,
  getSchemaPrimitives,
} from "@latticexyz/protocol-parser/internal";
import { WorldWriteClient } from "../../types";
import { worldWrite } from "./worldWrite";

export type StoreDeleteRecordParameters<table extends Table = Table> = {
  table: Table;
  key: getSchemaPrimitives<getKeySchema<table>>;
};

export type StoreDeleteRecordReturnType = TransactionReceipt;

export async function storeDeleteRecord(
  client: WorldWriteClient,
  args: StoreDeleteRecordParameters
): Promise<StoreDeleteRecordReturnType> {
  const keySchema = getSchemaTypes(getKeySchema(args.table));

  const key = encodeKey(keySchema, getKey(args.table, args.key));

  return worldWrite(client, {
    functionName: "deleteRecord",
    args: [args.table.tableId, key],
  });
}
