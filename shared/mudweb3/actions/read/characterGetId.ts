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
    table: eveworld.tables.eveworld__CharactersByAddressTable,
    key: { characterAddress: args.ownerAddress },
  });

  return r?.characterId;
}
