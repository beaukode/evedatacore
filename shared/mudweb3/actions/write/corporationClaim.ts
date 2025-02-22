import { TransactionReceipt, stringToHex } from "viem";
import { WorldWriteClient } from "../../types";
import { systemWrite } from "./systemWrite";

export type CorporationClaimParameters = {
  corpId: bigint;
  ticker: string;
  name: string;
};

export type CorporationClaimReturnType = TransactionReceipt;

export async function corporationClaim(
  client: WorldWriteClient,
  args: CorporationClaimParameters
): Promise<CorporationClaimReturnType> {
  const tickerBytes = stringToHex(args.ticker, { size: 8 });

  return systemWrite(client, {
    systemAddress:
      "0x737973746167696e6700000000000000436f72706f726174696f6e7353797374",
    functionName: "claim",
    args: [args.corpId, tickerBytes, args.name],
  });
}
