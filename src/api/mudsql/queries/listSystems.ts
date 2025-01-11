import { Hex, isHex, sliceHex } from "viem";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import { keyBy } from "lodash-es";
import { client, listNamespaces } from "..";
import { ensureArray, incrementHex, toSqlHex } from "../utils";

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

type ListSystemsOptions = {
  namespaceIds?: string[] | string;
};

export async function listSystems(
  options?: ListSystemsOptions
): Promise<System[]> {
  let where = "";
  if (options?.namespaceIds) {
    const namespaceIds = ensureArray(options.namespaceIds);
    if (namespaceIds.length === 0) return []; // No namespaces to query
    where = namespaceIds
      .flatMap((id) => {
        if (!isHex(id)) return [];
        const { namespace } = hexToResource(id);
        const systemId = sliceHex(
          resourceToHex({ type: "system", namespace, name: "" }),
          0,
          16
        );
        const systemBound = incrementHex(systemId);

        return [
          `"systemId" >= '${toSqlHex(systemId)}' AND "systemId" < '${toSqlHex(systemBound)}'`,
        ];
      })
      .join(" OR ");
  }
  const systems = await client
    .selectFrom<DbRow>("world", "Systems", { orderBy: "systemId", where })
    .then((result) =>
      result.map((r) => {
        const { system, ...rest } = r;
        const { name, namespace } = hexToResource(r.systemId);
        return {
          ...rest,
          contract: system,
          name,
          namespace,
          namespaceId: resourceToHex({
            type: "namespace",
            namespace,
            name: "",
          }),
        };
      })
    );
  const namespaceIds = [...new Set(systems.map((t) => t.namespaceId))];

  const namespaces = await listNamespaces({ ids: namespaceIds });
  const namespacesByAddress = keyBy(namespaces, "namespaceId");

  return systems.map((t) => ({
    ...t,
    namespaceOwner: namespacesByAddress[t.namespaceId]?.owner,
    namespaceOwnerName: namespacesByAddress[t.namespaceId]?.ownerName,
  }));
}
