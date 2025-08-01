import { Hex } from "viem";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type GateGetSystemParameters = {
  gateId: bigint;
};

export type GateGetSystemReturnType = Hex;

export async function gateGetSystem(
  client: MudWeb3ClientBase,
  args: GateGetSystemParameters
): Promise<GateGetSystemReturnType> {
  const r = await storeGetRecord(client, {
    table: eveworld.tables.evefrontier__SmartGateConfig,
    key: { smartObjectId: args.gateId },
  });

  return (
    r?.systemId ||
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  );
}
