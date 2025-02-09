import { Hex } from "viem";
import { MudWeb3ClientBase } from "../../types";
import { storeGetRecord } from "./storeGetRecord";
import { eveworld } from "../../eveworld";

export type TurretGetSystemParameters = {
  turretId: bigint;
};

export type TurretGetSystemReturnType = Hex;

export async function turretGetSystem(
  client: MudWeb3ClientBase,
  args: TurretGetSystemParameters
): Promise<TurretGetSystemReturnType> {
  const r = await storeGetRecord(client, {
    table: eveworld.tables.eveworld__SmartTurretConfigTable,
    key: { smartObjectId: args.turretId },
  });

  return (
    r?.systemId ||
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  );
}
