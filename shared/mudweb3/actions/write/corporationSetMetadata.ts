import { encodeFunctionData, stringToHex, TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { systemWrite } from "./systemWrite";
import { worldAbi } from "../../abi";

export type CorporationSetMetadataParameters = {
  corpId: bigint;
  name: string;
  ticker: string;
  description: string;
  homepage: string;
};

export type CorporationSetMetadataReturnType = TransactionReceipt;

export async function corporationSetMetadata(
  client: WorldWriteClient,
  args: CorporationSetMetadataParameters
): Promise<CorporationSetMetadataReturnType> {
  const tickerBytes = stringToHex(args.ticker, { size: 8 });

  const data = encodeFunctionData({
    abi: worldAbi,
    functionName: "setMetadata",
    args: [
      args.corpId,
      tickerBytes,
      args.name,
      args.description,
      args.homepage,
    ],
  });
  return systemWrite(client, {
    systemAddress:
      "0x737973746167696e6700000000000000436f72706f726174696f6e7353797374",
    data,
  });
}
