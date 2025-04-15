import { Hex } from "viem";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type GetSmartCharacterParameters = {
  characterId: bigint;
};

export type GetSmartCharacterReturnType =
  | {
      characterAddress: Hex;
      corpId: bigint;
      createdAt: bigint;
    }
  | undefined;

export async function characterGet(
  client: MudWeb3ClientBase,
  args: GetSmartCharacterParameters
): Promise<GetSmartCharacterReturnType> {
  const r = await storeGetRecord(client, {
    table: eveworld.tables.eveworld__CharactersTable,
    key: { characterId: args.characterId },
  });

  return r;
}
