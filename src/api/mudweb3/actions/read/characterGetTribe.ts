import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type GetCharacterTribeIdParameters = {
  smartObjectId: bigint;
};

export type GetCharacterTribeIdReturnType = bigint | undefined;

export async function characterGetTribeId(
  client: MudWeb3ClientBase,
  args: GetCharacterTribeIdParameters
): Promise<GetCharacterTribeIdReturnType> {
  const r = await storeGetRecord(client, {
    table: eveworld.tables.evefrontier__Characters,
    key: { smartObjectId: args.smartObjectId },
  });

  return r?.tribeId;
}
