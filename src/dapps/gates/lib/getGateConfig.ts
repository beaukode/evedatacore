import { MudSqlClient } from "@shared/mudsql";

type GateConfigDbRow = {
  gateId: string;
  defaultRule: boolean;
  createdAt: string;
};

type CorpExceptionDbRow = {
  gateId: string;
  corpId: string;
  active: boolean;
};

type CharacterExceptionDbRow = {
  gateId: string;
  characterId: string;
  active: boolean;
};

export type GateConfig = {
  defaultRule: boolean;
  corporationsExceptions: string[];
  charactersExceptions: string[];
};

export const getGateConfig =
  (client: MudSqlClient) =>
  async (id: string): Promise<GateConfig | undefined> => {
    const [gateConfigs, corpExceptions, characterExceptions] =
      await client.selectFromBatch<
        [GateConfigDbRow, CorpExceptionDbRow, CharacterExceptionDbRow]
      >([
        {
          table: "Gates",
          ns: "staging",
          options: {
            where: `"gateId" = '${id}'`,
          },
        },
        {
          table: "GatesCorpExcepti",
          ns: "staging",
          options: {
            where: `"gateId" = '${id}'`,
          },
        },
        {
          table: "GatesCorpExcepti",
          ns: "staging",
          options: {
            where: `"gateId" = '${id}'`,
          },
        },
      ]);

    const gateConfig = gateConfigs[0];

    if (!gateConfig) return undefined;

    return {
      defaultRule: gateConfig.defaultRule,
      corporationsExceptions: corpExceptions.map((c) => c.corpId),
      charactersExceptions: characterExceptions.map((c) => c.characterId),
    };
  };
