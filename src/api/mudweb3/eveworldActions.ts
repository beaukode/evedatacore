import {
  Account,
  Chain,
  Client,
  encodeFunctionData,
  Hex,
  Transport,
  WalletClient,
} from "viem";
import SmartDeployableSystemAbi from "@eveworld/world/out/SmartDeployableSystem.sol/SmartDeployableSystem.abi.json";
import EntityRecordSystemAbi from "@eveworld/world/out/EntityRecordSystem.sol/EntityRecordSystem.abi.json";
import { getRecord, GetRecordOptions, Table } from "@latticexyz/store/internal";
import { eveworld } from "./eveworld";
import { worldSystemCall } from "./systemCall";

export function eveworldActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
>(worldAddress: Hex) {
  return function (client: Client<transport, chain, account>) {
    async function getMudTableRecord<table extends Table>(
      options: GetRecordOptions<table>
    ) {
      return getRecord<table>(client, options);
    }

    return {
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
    };
  };
}

type WalletActionsConfig = {
  worldAddress: Hex;
  smartDeployableSystem: Hex;
};

export function eveworlWalletActions(config: WalletActionsConfig) {
  return function (client: WalletClient) {
    function systemCall(systemAddress: Hex, data: Hex) {
      return worldSystemCall(client, config.worldAddress, systemAddress, data);
    }

    return {
      systemCall,
      bringOnline: async (smartOjectId: bigint) => {
        const data = encodeFunctionData({
          abi: SmartDeployableSystemAbi,
          functionName: "bringOnline",
          args: [smartOjectId],
        });
        return systemCall(config.smartDeployableSystem, data);
      },
      bringOffline: async (smartOjectId: bigint) => {
        const data = encodeFunctionData({
          abi: SmartDeployableSystemAbi,
          functionName: "bringOffline",
          args: [smartOjectId],
        });
        return systemCall(config.smartDeployableSystem, data);
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
