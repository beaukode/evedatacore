import { hexToString } from "viem";
import { MudWeb3ClientBase } from "../../types";
import { systemSimulate } from "./systemSimulate";

export type CorporationGetMetadataParameters = {
  corpId: bigint;
};

export type CorporationGetMetadataReturnType =
  | {
      CEO: bigint;
      ticker: string;
      claimedAt: bigint;
      name: string;
      description: string;
      homepage: string;
    }
  | undefined;

export async function corporationGetMetadata(
  client: MudWeb3ClientBase,
  args: CorporationGetMetadataParameters
): Promise<CorporationGetMetadataReturnType> {
  const r = await systemSimulate(client, {
    systemAddress:
      "0x737973746167696e6700000000000000436f72706f726174696f6e7353797374",
    functionName: "getMetadata",
    args: [args.corpId],
  });

  if (r.claimedAt === BigInt(0)) {
    return undefined;
  }

  return { ...r, ticker: hexToString(r.ticker, { size: 8 }) };
}
