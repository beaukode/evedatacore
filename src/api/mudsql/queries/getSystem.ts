import { hexToResource, resourceToHex } from "@latticexyz/common";
import { Hex, isHex } from "viem";
import { toSqlHex } from "../utils";
import { MudSqlClient } from "../client";

type DbRow = {
  systemId: Hex;
  system: Hex;
  publicAccess: boolean;
};

type System = {
  systemId: Hex;
  contract: Hex;
  publicAccess: boolean;
  name: string;
  namespace: string;
  namespaceId: Hex;
  namespaceOwner?: Hex;
  namespaceOwnerName?: string;
};

export const getSystem =
  (client: MudSqlClient) =>
  async (id: string): Promise<System | undefined> => {
    if (id.length !== 66) return undefined;
    if (!isHex(id)) return undefined;

    const system = hexToResource(id);
    const namespaceId = resourceToHex({
      type: "namespace",
      namespace: system.namespace,
      name: "",
    });

    const [result, namespace] = await Promise.all([
      client.selectFrom<DbRow>("world", "Systems", {
        where: `"systemId" = '${toSqlHex(id)}'`,
      }),
      client.getNamespace(namespaceId),
    ]);

    const r = result[0];
    if (!r) return undefined;

    return {
      systemId: r.systemId,
      publicAccess: r.publicAccess,
      contract: r.system,
      name: system.name,
      namespace: system.namespace,
      namespaceId,
      namespaceOwner: namespace?.owner,
      namespaceOwnerName: namespace?.ownerName,
    };
  };
