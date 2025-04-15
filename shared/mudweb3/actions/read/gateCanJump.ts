import { MudWeb3ClientBase } from "../../types";
import { eveworld } from "../../eveworld";
import { characterGetId } from "./characterGetId";
import { systemSimulate } from "./systemSimulate";

export type GateCanJumpParameters = {
  characterId?: string;
  sourceGateId: string;
  destinationGateId: string;
};

export type GateCanJumpReturnType = boolean;

export async function gateCanJump(
  client: MudWeb3ClientBase,
  args: GateCanJumpParameters
): Promise<GateCanJumpReturnType> {
  const { sourceGateId, destinationGateId } = args;
  let characterId = args.characterId ? BigInt(args.characterId) : undefined;

  if (!characterId) {
    const address = client.writeClient?.account?.address;

    if (!address) {
      throw new Error("Current user address is not set");
    }

    characterId = await characterGetId(client, {
      ownerAddress: address,
    });
    if (!characterId) {
      throw new Error(`Character not found for address ${address}`);
    }
  }

  const r = await systemSimulate(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartGateSystem.systemId,
    functionName: "canJump",
    args: [characterId, BigInt(sourceGateId), BigInt(destinationGateId)],
  });
  return r;
}
