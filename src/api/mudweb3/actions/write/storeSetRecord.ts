import { TransactionReceipt } from "viem";
import { Table } from "@latticexyz/config";
import {
  getSchemaTypes,
  getKeySchema,
  getValueSchema,
  encodeKey,
  getKey,
  encodeValueArgs,
  getSchemaPrimitives,
} from "@latticexyz/protocol-parser/internal";
import { WorldWriteClient } from "../../types";
import { worldWrite } from "./worldWrite";

export type StoreSetRecordParameters<table extends Table = Table> = {
  table: Table;
  values: getSchemaPrimitives<table["schema"]>;
};

export type StoreSetRecordReturnType = TransactionReceipt;

export async function storeSetRecord(
  client: WorldWriteClient,
  args: StoreSetRecordParameters
): Promise<StoreSetRecordReturnType> {
  const keySchema = getSchemaTypes(getKeySchema(args.table));
  const valueSchema = getSchemaTypes(getValueSchema(args.table));

  const key = encodeKey(keySchema, getKey(args.table, args.values));
  const { staticData, encodedLengths, dynamicData } = encodeValueArgs(
    valueSchema,
    args.values
  );

  return worldWrite(client, {
    functionName: "setRecord",
    args: [args.table.tableId, key, staticData, encodedLengths, dynamicData],
  });
}
