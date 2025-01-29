import { Client, encodeFunctionData, Hex, isHex, WalletClient } from "viem";
import SmartDeployableSystemAbi from "@eveworld/world/out/SmartDeployableSystem.sol/SmartDeployableSystem.abi.json";
import EntityRecordSystemAbi from "@eveworld/world/out/EntityRecordSystem.sol/EntityRecordSystem.abi.json";
import SmartGateSystemAbi from "@eveworld/world/out/SmartGateSystem.sol/SmartGateSystem.abi.json";
import { getRecord, GetRecordOptions, Table } from "@latticexyz/store/internal";
import { eveworld } from "./eveworld";
import { worldSystemCall } from "./systemCall";
import { worldSystemSimulate } from "./worldSystemSimulate";

export function eveworldActions(worldAddress: Hex) {
  return function (client: Client) {
    async function getMudTableRecord<table extends Table>(
      options: GetRecordOptions<table>
    ) {
      return getRecord<table>(client, options);
    }
    async function getSmartCharacterId(
      characterAddress: Hex
    ): Promise<bigint | undefined> {
      const r = await getMudTableRecord({
        address: worldAddress,
        table: eveworld.tables.eveworld__CharactersByAddressTable,
        key: { characterAddress },
      });
      return r?.characterId;
    }

    function systemSimulate(systemAddress: Hex, data: Hex) {
      return worldSystemSimulate(client, worldAddress, systemAddress, data);
    }

    return {
      systemSimulate,
      getSmartCharacterId,
      async getDeployableState(id: bigint) {
        return getMudTableRecord({
          address: worldAddress,
          table: eveworld.tables.eveworld__DeployableState,
          key: { smartObjectId: id },
        });
      },
      async getDeployableMetadata(id: bigint) {
        return getMudTableRecord({
          address: worldAddress,
          table: eveworld.tables.eveworld__EntityRecordOffchainTable,
          key: { entityId: id },
        });
      },
      async canJump(
        accountOrCharacterId: string,
        sourceGateId: string,
        destinationGateId: string
      ) {
        let characterId: bigint | undefined;

        if (isHex(accountOrCharacterId)) {
          characterId = await getSmartCharacterId(accountOrCharacterId);
          if (!characterId) {
            throw new Error(
              `Character not found for address ${accountOrCharacterId}`
            );
          }
        } else {
          if (!/^\d+$/.test(accountOrCharacterId)) {
            throw new Error(`Invalid character ID: ${accountOrCharacterId}`);
          }
          characterId = BigInt(accountOrCharacterId);
        }
        console.log("jj", [
          characterId,
          BigInt(sourceGateId),
          BigInt(destinationGateId),
        ]);
        const data = encodeFunctionData({
          abi: SmartGateSystemAbi,
          functionName: "canJump",
          args: [characterId, BigInt(sourceGateId), BigInt(destinationGateId)],
        });
        const r = await systemSimulate(
          eveworld.namespaces.eveworld.systems.SmartGateSystem.systemId,
          data
        );
        return Boolean(BigInt(r));
      },
    };
  };
}

export function eveworlWalletActions(worldAddress: Hex, publicClient: Client) {
  return function (walletClient: WalletClient) {
    function systemCall(systemAddress: Hex, data: Hex) {
      return worldSystemCall(
        publicClient,
        walletClient,
        worldAddress,
        systemAddress,
        data
      );
    }

    return {
      systemCall,
      bringOnline: async (smartOjectId: bigint) => {
        const data = encodeFunctionData({
          abi: SmartDeployableSystemAbi,
          functionName: "bringOnline",
          args: [smartOjectId],
        });
        return systemCall(
          eveworld.namespaces.eveworld.systems.SmartDeployableSystem.systemId,
          data
        );
      },
      bringOffline: async (smartOjectId: bigint) => {
        const data = encodeFunctionData({
          abi: SmartDeployableSystemAbi,
          functionName: "bringOffline",
          args: [smartOjectId],
        });
        return systemCall(
          eveworld.namespaces.eveworld.systems.SmartDeployableSystem.systemId,
          data
        );
      },
      setDeployableMetadata: async (
        smartOjectId: bigint,
        name: string,
        dappURL: string,
        description: string
      ) => {
        const data = encodeFunctionData({
          abi: EntityRecordSystemAbi,
          functionName: "setEntityMetadata",
          args: [smartOjectId, name, dappURL, description],
        });
        return systemCall(
          eveworld.namespaces.eveworld.systems.EntityRecordSystem.systemId,
          data
        );
      },
    };
  };
}
