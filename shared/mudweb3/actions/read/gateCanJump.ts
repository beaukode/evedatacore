import { encodeFunctionData } from "viem";
import { MudWeb3ClientBase } from "../../types";
import { eveworld } from "../../eveworld";
import { characterGetId } from "./characterGetId";
import { systemSimulate } from "./systemSimulate";
import { worldAbi } from "../../abi";

export type GateCanJumpParameters = {
  sourceGateId: string;
  destinationGateId: string;
};

export type GateCanJumpReturnType = boolean;

export async function gateCanJump(
  client: MudWeb3ClientBase,
  args: GateCanJumpParameters
): Promise<GateCanJumpReturnType> {
  const { sourceGateId, destinationGateId } = args;

  const address = client.writeClient?.account?.address;

  if (!address) {
    throw new Error("Current user address is not set");
  }

  const characterId = await characterGetId(client, {
    ownerAddress: address,
  });
  if (!characterId) {
    throw new Error(`Character not found for address ${address}`);
  }

  const data = encodeFunctionData({
    abi: worldAbi,
    functionName: "canJump",
    args: [characterId, BigInt(sourceGateId), BigInt(destinationGateId)],
  });

  const r = await systemSimulate(client, {
    systemAddress:
      eveworld.namespaces.eveworld.systems.SmartGateSystem.systemId,
    data,
  });
  return Boolean(BigInt(r));
}
