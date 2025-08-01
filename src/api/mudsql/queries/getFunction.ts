import { hexToResource } from "@latticexyz/common";
import { Hex, isHex, sliceHex } from "viem";
import { toSqlHex } from "../utils";
import { MudSqlClient } from "../client";
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

export const getFunction =
  (client: MudSqlClient) =>
  async (id: string): Promise<Function | undefined> => {
    if (id.length > 66) return undefined;
    if (!isHex(id)) return undefined;
    id = id.padEnd(66, "0");

    const [signatures, selectors] = await Promise.all([
      client.selectFrom<SignatureRow>("world", "FunctionSignatur", {
        tableType: "offchainTable",
        where: `"functionSelector" = '${toSqlHex(id)}'`,
      }),
      client.selectFrom<SelectorRow>("world", "FunctionSelector", {
        where: `"worldFunctionSelector" = '${toSqlHex(id)}'`,
      }),
    ]);

    const sign = signatures[0];
    const selector = selectors[0];
    if (!sign) return undefined;

    const namespace = selector
      ? await client.getNamespace(
          "0x6e73" +
            selector.systemId.slice(6, 34) +
            "00000000000000000000000000000000"
        )
      : undefined;
    const { name } = selector ? hexToResource(selector.systemId) : {};
    return {
      worldSelector: sliceHex(sign.functionSelector, 0, 4),
      signature: sign.functionSignature,
      systemId: selector?.systemId,
      systemName: name,
      systemSelector: selector?.systemFunctionSelector,
      namespace: namespace?.name,
      namespaceId: namespace?.namespaceId,
      namespaceOwner: namespace?.owner,
      namespaceOwnerName: namespace?.ownerName,
    };
  };
