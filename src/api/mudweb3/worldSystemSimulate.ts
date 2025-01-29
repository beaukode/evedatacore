import { BaseError, Client, Hex } from "viem";
import { simulateContract } from "viem/actions";
import { IWorldAbi } from "@eveworld/contracts";
import SmartDeployableSystemAbi from "@eveworld/world/out/SmartDeployableSystem.sol/SmartDeployableSystem.abi.json";
import EntityRecordSystemAbi from "@eveworld/world/out/EntityRecordSystem.sol/EntityRecordSystem.abi.json";
import SmartGateSystemAbi from "@eveworld/world/out/SmartGateSystem.sol/SmartGateSystem.abi.json";
import { isError } from "lodash-es";
import { Web3TransactionError } from "./Web3TransactionError";

export async function worldSystemSimulate(
  publicClient: Client,
  worldAddress: Hex,
  systemAddress: Hex,
  data: Hex
) {
  try {
    const { result } = await simulateContract(publicClient, {
      address: worldAddress,
      abi: [
        ...IWorldAbi.abi,
        ...SmartDeployableSystemAbi,
        ...EntityRecordSystemAbi,
        ...SmartGateSystemAbi,
      ], // Merge all ABIs for error decoding
      functionName: "call",
      args: [systemAddress, data],
    });
    return result;
  } catch (e) {
    console.error(e);
    if (isError(e)) {
      if (e instanceof BaseError) {
        throw new Web3TransactionError(
          e.shortMessage,
          undefined,
          e.metaMessages
        );
      }
      throw new Web3TransactionError(e.message);
    } else if (typeof e === "string") {
      throw new Web3TransactionError(e);
    } else {
      throw new Web3TransactionError("Unknown error");
    }
  }
}
