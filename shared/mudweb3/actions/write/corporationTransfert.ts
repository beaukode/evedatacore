import { TransactionReceipt } from "viem";
import { WorldWriteClient } from "../../types";
import { systemWrite } from "./systemWrite";

export type CorporationTransfertParameters = {
  corpId: bigint;
  newOwner: bigint;
};

export type CorporationTransfertReturnType = TransactionReceipt;

export async function corporationTransfert(
  client: WorldWriteClient,
  args: CorporationTransfertParameters
): Promise<CorporationTransfertReturnType> {
  return systemWrite(client, {
    systemAddress:
      "0x737973746167696e6700000000000000436f72706f726174696f6e7353797374",
    functionName: "transfer",
    args: [args.corpId, args.newOwner],
  });
}
