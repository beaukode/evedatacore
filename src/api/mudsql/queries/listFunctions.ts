import { Hex, isHex, sliceHex } from "viem";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import { keyBy } from "lodash-es";
import { MudSqlClient } from "../client";
import { ensureArray, incrementHex, toSqlHex } from "../utils";
import { Function } from "../types";

type SelectorRow = {
  worldFunctionSelector: Hex;
  systemId: Hex;
  systemFunctionSelector: Hex;
};

type SignatureRow = {
  functionSelector: Hex;
  functionSignature: string;
};

type ListSystemsOptions = {
  namespaceIds?: string[] | string;
  systemsIds?: string[] | string;
};

async function list(
  client: MudSqlClient,
  options?: ListSystemsOptions
): Promise<{ signatures: SignatureRow[]; selectors: SelectorRow[] }> {
  if (options?.namespaceIds || options?.systemsIds) {
    let where = "0=1";
    if (options.systemsIds) {
      const systemsIds = ensureArray(options.systemsIds);
      if (systemsIds.length === 0) return { signatures: [], selectors: [] };
      where = `"systemId" IN ('${systemsIds.map(toSqlHex).join("', '")}')`;
    }
    if (options.namespaceIds) {
      const namespaceIds = ensureArray(options.namespaceIds);
      if (namespaceIds.length === 0) return { signatures: [], selectors: [] };
      where = namespaceIds
        .map((id) => {
          if (!isHex(id)) return [];
          const { namespace } = hexToResource(id);
          const systemId = sliceHex(
            resourceToHex({ type: "system", namespace, name: "" }),
            0,
            16
          );
          const systemBound = incrementHex(systemId);

          return `"systemId" >= '${toSqlHex(systemId)}' AND "systemId" < '${toSqlHex(systemBound)}'`;
        })
        .join(" OR ");
    }
    const selectors = await client.selectFrom<SelectorRow>(
      "world",
      "FunctionSelector",
      {
        where,
      }
    );
    if (selectors.length === 0) return { signatures: [], selectors: [] };

    const worldSelectors = selectors.map((sel) => sel.worldFunctionSelector);
    const signatures = await client.selectFrom<SignatureRow>(
      "world",
      "FunctionSignatur",
      {
        tableType: "offchainTable",
        orderBy: "functionSignature",
        where: `functionSelector IN ('${worldSelectors.map(toSqlHex).join("', '")}')`,
      }
    );
    return { signatures, selectors };
  } else {
    const [signatures, selectors] = await Promise.all([
      client.selectFrom<SignatureRow>("world", "FunctionSignatur", {
        tableType: "offchainTable",
        orderBy: "functionSignature",
      }),
      client.selectFrom<SelectorRow>("world", "FunctionSelector"),
    ]);
    return { signatures, selectors };
  }
}

export const listFunctions =
  (client: MudSqlClient) =>
  async (options?: ListSystemsOptions): Promise<Function[]> => {
    const { signatures, selectors } = await list(client, options);

    if (signatures.length === 0) return [];

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
