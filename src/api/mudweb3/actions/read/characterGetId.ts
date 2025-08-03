import { Hex } from "viem";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type GetSmartCharacterIdParameters = {
  ownerAddress: Hex;
};

export type GetSmartCharacterIdReturnType = bigint | undefined;

export async function characterGetId(
  client: MudWeb3ClientBase,
  args: GetSmartCharacterIdParameters
): Promise<GetSmartCharacterIdReturnType> {
  const r = await storeGetRecord(client, {
    table: eveworld.tables.evefrontier__CharactersByAccount,
    key: { account: args.ownerAddress },
  });

  return r?.smartObjectId;
}
