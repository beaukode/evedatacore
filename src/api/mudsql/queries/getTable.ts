import { Hex, isHex } from "viem";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import { Table as MudTable } from "@latticexyz/config";
import { client, getNamespace } from "..";

type Table = MudTable & {
  namespaceId: Hex;
  namespaceOwner?: Hex;
  namespaceOwnerName?: string;
};

export async function getTable(id: string): Promise<Table | undefined> {
  if (id.length !== 66 || !isHex(id)) return undefined;

  const table = hexToResource(id);
  const namespaceId = resourceToHex({
    type: "namespace",
    namespace: table.namespace,
    name: "",
  });

  const [schema, namespace] = await Promise.all([
    client.getTableSchema(id),
    getNamespace(namespaceId),
  ]);

  return {
    ...schema,
    namespaceId: namespaceId,
    namespaceOwner: namespace?.owner,
    namespaceOwnerName: namespace?.ownerName,
  };
}
