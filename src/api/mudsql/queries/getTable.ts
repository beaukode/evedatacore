import { isHex } from "viem";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import { MudSqlClient } from "../client";
import { Table } from "../types";

export const getTable =
  (client: MudSqlClient) =>
  async (id: string): Promise<Table | undefined> => {
    if (id.length !== 66 || !isHex(id)) return undefined;

    const table = hexToResource(id);
    const namespaceId = resourceToHex({
      type: "namespace",
      namespace: table.namespace,
      name: "",
    });

    const [schema, namespace] = await Promise.all([
      client.getTableSchema(id),
      client.getNamespace(namespaceId),
    ]);

    return {
      ...schema,
      namespaceId: namespaceId,
      namespaceOwner: namespace?.owner,
      namespaceOwnerName: namespace?.ownerName,
    };
  };
