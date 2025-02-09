import { Table, GetRecordOptions, getRecord } from "@latticexyz/store/internal";
import { getSchemaPrimitives } from "@latticexyz/protocol-parser/internal";
import { MudWeb3ClientBase } from "../../types";

export type StoreGetRecordParameters<table extends Table> = Pick<
  GetRecordOptions<table>,
  "table" | "key"
>;

export type StoreGetRecordReturnType<table extends Table> = getSchemaPrimitives<
  table["schema"]
>;

export async function storeGetRecord<table extends Table>(
  client: MudWeb3ClientBase,
  args: StoreGetRecordParameters<table>
): Promise<StoreGetRecordReturnType<table>> {
  return getRecord<table>(client, {
    address: client.mudAddresses.world,
    ...args,
  });
}
