import { MudSqlClient } from "../client";
import { TargetGate } from "../types";
type DbRow = {
  sourceGateId: string;
  destinationGateId: string;
  isLinked: boolean;
};

export const getGateLink =
  (client: MudSqlClient) =>
  async (id: string): Promise<TargetGate | undefined> => {
    const links = await client.selectFrom<DbRow>(
      "evefrontier",
      "SmartGateLink",
      {
        where: `"sourceGateId" = '${id}'`,
      }
    );
    const link = links[0];
    if (!link) return undefined;

    const assembly = await client.getAssembly(link.destinationGateId);
    if (!assembly) return undefined;

    return {
      ...assembly,
      isLinked: link.isLinked,
    };
  };
