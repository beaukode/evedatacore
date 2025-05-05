import { Hex, isHex } from "viem";
import { MudSqlClient } from "../client";
import { toSqlHex } from "../utils";
import { Balance } from "../types";

type DbRow = {
  account: Hex;
  value: string;
};

export const getEveBalance =
  (client: MudSqlClient) =>
  async (address: string): Promise<Balance | undefined> => {
    if (address.length !== 42 || !isHex(address)) return undefined;
    const result = await client.selectFrom<DbRow>("eveerc20", "Balances", {
      where: `"account" = '${toSqlHex(address)}'`,
    });

    const c = result[0];
    if (!c) return { address, value: "0" };

    return {
      address: c.account,
      value: c.value,
    };
  };
