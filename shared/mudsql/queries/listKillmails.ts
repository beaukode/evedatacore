import { keyBy } from "lodash-es";
import { MudSqlClient } from "../client";
import { ensureArray } from "../utils";
import { Killmail } from "../types";

type DbRow = {
  killMailId: string;
  killerCharacterId: string;
  victimCharacterId: string;
  lossType: string;
  solarSystemId: string;
  killTimestamp: string;
};

type ListCharactersOptions = {
  characterId?: string[] | string;
  solarSystemId?: string[] | string;
};

export const listKillmails =
  (client: MudSqlClient) =>
  async (options?: ListCharactersOptions): Promise<Killmail[]> => {
    let where: string | undefined = undefined;
    if (options?.characterId) {
      const characterIds = ensureArray(options.characterId);
      if (characterIds.length === 0) return []; // No addresses to query

      where = `"killerCharacterId" IN ('${characterIds.join("', '")}') OR "victimCharacterId" IN ('${characterIds.join("', '")}')`;
    }
    if (options?.solarSystemId) {
      const solarSystemIds = ensureArray(options.solarSystemId);
      if (solarSystemIds.length === 0) return []; // No solar system to query

      where = `"solarSystemId" IN ('${solarSystemIds.join("', '")}')`;
    }

    const killmails = await client.selectFrom<DbRow>(
      "evefrontier",
      "KillMail",
      {
        where: where,
        orderBy: "killTimestamp",
        orderDirection: "DESC",
      }
    );

    const characterIds = killmails.flatMap((killmail) => [
      killmail.killerCharacterId,
      killmail.victimCharacterId,
    ]);

    const characters = await client.listCharacters({ ids: characterIds });
    const charactersById = keyBy(characters, "id");

    return killmails.map<Killmail>((km) => ({
      id: km.killMailId,
      killerId: km.killerCharacterId,
      killerName: charactersById[km.killerCharacterId]?.name,
      killerAddress: charactersById[km.killerCharacterId]?.address,
      victimId: km.victimCharacterId,
      victimName: charactersById[km.victimCharacterId]?.name,
      victimAddress: charactersById[km.victimCharacterId]?.address,
      lossType: km.lossType === "0" ? "Ship" : "(Unknown)",
      solarSystemId: Number.parseInt(km.solarSystemId, 10),
      timestamp: Number.parseInt(km.killTimestamp, 10),
    }));
  };
