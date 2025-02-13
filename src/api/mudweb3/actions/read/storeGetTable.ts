import { Hex } from "viem";
import { Table } from "@latticexyz/config";
import store from "@latticexyz/store/mud.config";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { decodeTable } from "../../externals";

export type StoreGetTableParameters = {
  tableId: Hex;
};

export type StoreGetTableReturnType = Table;

export async function storeGetTable(
  client: MudWeb3ClientBase,
  args: StoreGetTableParameters
): Promise<StoreGetTableReturnType> {
  const r = await storeGetRecord(client, {
    table: store.tables.store__Tables,
    key: { tableId: args.tableId },
  });

  return decodeTable(r);
}
