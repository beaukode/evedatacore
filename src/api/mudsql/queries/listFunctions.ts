import { Hex, sliceHex } from "viem";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import { keyBy } from "lodash-es";
import { MudSqlClient } from "../client";

type SelectorRow = {
  worldFunctionSelector: Hex;
  systemId: Hex;
  systemFunctionSelector: Hex;
};

type SignatureRow = {
  functionSelector: Hex;
  functionSignature: string;
};

type Function = {
  worldSelector: Hex;
  signature: string;
  systemId?: Hex;
  systemName?: string;
  systemSelector?: Hex;
  namespace?: string;
  namespaceId?: Hex;
  namespaceOwner?: Hex;
  namespaceOwnerName?: string;
};

type ListSystemsOptions = {
  namespaceIds?: string[] | string;
};

export const listFunctions =
  (client: MudSqlClient) =>
  async (options?: ListSystemsOptions): Promise<Function[]> => {
    if (options?.namespaceIds) {
      throw new Error("Not implemented");
    }

    const [signatures, selectors] = await Promise.all([
      client.selectFrom<SignatureRow>("world", "FunctionSignatur", {
        tableType: "offchainTable",
        orderBy: "functionSignature",
      }),
      client.selectFrom<SelectorRow>("world", "FunctionSelector"),
    ]);

    const selectorsBySignature = keyBy(selectors, "worldFunctionSelector");
    const namespaceIds = [
      ...new Set(
        selectors.map(
          (sel) =>
            "0x6e73" +
            sel.systemId.slice(6, 34) +
            "00000000000000000000000000000000"
        )
      ),
    ];
    const namespaces = await client.listNamespaces({ ids: namespaceIds });
    const namespacesByAddress = keyBy(namespaces, "namespaceId");

    return signatures.map((sign) => {
      const selector = selectorsBySignature[sign.functionSelector];

      if (!selector) {
        return {
          worldSelector: sliceHex(sign.functionSelector, 0, 4),
          signature: sign.functionSignature,
        };
      } else {
        const { name, namespace } = hexToResource(selector.systemId);
        const namespaceId = resourceToHex({
          type: "namespace",
          namespace,
          name: "",
        });
        const { owner, ownerName } = namespacesByAddress[namespaceId] || {};
        return {
          worldSelector: sliceHex(sign.functionSelector, 0, 4),
          signature: sign.functionSignature,
          systemId: selector.systemId,
          systemName: name,
          systemSelector: selector.systemFunctionSelector,
          namespace,
          namespaceId,
          namespaceOwner: owner,
          namespaceOwnerName: ownerName,
        };
      }
    });
  };
