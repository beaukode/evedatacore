import { MudWeb3ClientBase } from "../../types";
import { systemSimulate } from "./systemSimulate";

export type CorporationIsClaimValidParameters = {
  corpId: bigint;
};

export type CorporationIsClaimValidReturnType = boolean;

export async function corporationIsClaimValid(
  client: MudWeb3ClientBase,
  args: CorporationIsClaimValidParameters
): Promise<CorporationIsClaimValidReturnType> {
  return systemSimulate(client, {
    systemAddress:
      "0x737973746167696e6700000000000000436f72706f726174696f6e7353797374",
    functionName: "isClaimValid",
    args: [args.corpId],
  });
}
