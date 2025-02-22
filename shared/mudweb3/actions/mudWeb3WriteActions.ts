import {
  AssemblyBringOfflineParameters,
  AssemblyBringOfflineReturnType,
  assemblyBringOffline,
} from "./write/assemblyBringOffline";
import {
  AssemblyBringOnlineParameters,
  AssemblyBringOnlineReturnType,
  assemblyBringOnline,
} from "./write/assemblyBringOnline";
import {
  AssemblySetMetadataParameters,
  AssemblySetMetadataReturnType,
  assemblySetMetadata,
} from "./write/assemblySetMetadata";
import {
  CorporationClaimParameters,
  CorporationClaimReturnType,
  corporationClaim,
} from "./write/corporationClaim";
import {
  CorporationSetMetadataParameters,
  CorporationSetMetadataReturnType,
  corporationSetMetadata,
} from "./write/corporationSetMetadata";
import {
  CorporationTransfertParameters,
  CorporationTransfertReturnType,
  corporationTransfert,
} from "./write/corporationTransfert";
import {
  GateLinkParameters,
  GateLinkReturnType,
  gateLink,
} from "./write/gateLink";
import {
  GateSetSystemParameters,
  GateSetSystemReturnType,
  gateSetSystem,
} from "./write/gateSetSystem";
import {
  GateUnlinkParameters,
  GateUnlinkReturnType,
  gateUnlink,
} from "./write/gateUnlink";
import {
  StorageEphemeralToInventoryParameters,
  StorageEphemeralToInventoryReturnType,
  storageEphemeralToInventory,
} from "./write/storageEphemeralToInventory";
import {
  StorageInventoryToEphemeralParameters,
  StorageInventoryToEphemeralReturnType,
  storageInventoryToEphemeral,
} from "./write/storageInventoryToEphemeral";
import {
  StoreDeleteRecordParameters,
  StoreDeleteRecordReturnType,
  storeDeleteRecord,
} from "./write/storeDeleteRecord";
import {
  StoreSetRecordParameters,
  StoreSetRecordReturnType,
  storeSetRecord,
} from "./write/storeSetRecord";
import {
  SytemWriteParameters,
  SystemWriteReturnType,
  systemWrite,
} from "./write/systemWrite";
import {
  TurretSetSystemParameters,
  TurretSetSystemReturnType,
  turretSetSystem,
} from "./write/turretSetSystem";
import {
  WorldWriteParameters,
  WorldWriteReturnType,
  worldWrite,
} from "./write/worldWrite";
import { isWorldWriteClient, MudWeb3ClientRead } from "../types";
import { Web3TransactionError } from "../Web3TransactionError";
import { WorldAbi } from "../abi";
import { Abi } from "viem";

export type MudWeb3WriteActions = {
  isWriteClient: boolean;
  assemblyBringOffline: (
    args: AssemblyBringOnlineParameters
  ) => Promise<AssemblyBringOnlineReturnType>;
  assemblyBringOnline: (
    args: AssemblyBringOnlineParameters
  ) => Promise<AssemblyBringOnlineReturnType>;
  assemblySetMetadata: (
    args: AssemblySetMetadataParameters
  ) => Promise<AssemblySetMetadataReturnType>;
  corporationClaim: (
    args: CorporationClaimParameters
  ) => Promise<CorporationClaimReturnType>;
  corporationSetMetadata: (
    args: CorporationSetMetadataParameters
  ) => Promise<CorporationSetMetadataReturnType>;
  corporationTransfert: (
    args: CorporationTransfertParameters
  ) => Promise<CorporationTransfertReturnType>;
  gateLink: (args: GateLinkParameters) => Promise<GateLinkReturnType>;
  gateSetSystem: (
    args: GateSetSystemParameters
  ) => Promise<GateSetSystemReturnType>;
  gateUnlink: (args: GateUnlinkParameters) => Promise<GateUnlinkReturnType>;
  storageEphemeralToInventory: (
    args: StorageEphemeralToInventoryParameters
  ) => Promise<StorageEphemeralToInventoryReturnType>;
  storageInventoryToEphemeral: (
    args: StorageInventoryToEphemeralParameters
  ) => Promise<StorageInventoryToEphemeralReturnType>;
  storeDeleteRecord: (
    args: StoreDeleteRecordParameters
  ) => Promise<StoreDeleteRecordReturnType>;
  storeSetRecord: (
    args: StoreSetRecordParameters
  ) => Promise<StoreSetRecordReturnType>;
  systemWrite: (args: SytemWriteParameters) => Promise<SystemWriteReturnType>;
  turretSetSystem: (
    args: TurretSetSystemParameters
  ) => Promise<TurretSetSystemReturnType>;
  worldWrite: <abi extends Abi = WorldAbi>(
    args: WorldWriteParameters<abi>
  ) => Promise<WorldWriteReturnType>;
};

export function mudWeb3WriteActions(
  client: MudWeb3ClientRead
): MudWeb3WriteActions {
  if (isWorldWriteClient(client)) {
    return {
      isWriteClient: true,
      assemblyBringOffline: (
        args: AssemblyBringOfflineParameters
      ): Promise<AssemblyBringOfflineReturnType> => {
        return assemblyBringOffline(client, args);
      },
      assemblyBringOnline: (
        args: AssemblyBringOnlineParameters
      ): Promise<AssemblyBringOnlineReturnType> => {
        return assemblyBringOnline(client, args);
      },
      assemblySetMetadata: (
        args: AssemblySetMetadataParameters
      ): Promise<AssemblySetMetadataReturnType> => {
        return assemblySetMetadata(client, args);
      },
      gateLink: (args: GateLinkParameters): Promise<GateLinkReturnType> => {
        return gateLink(client, args);
      },
      gateSetSystem: (
        args: GateSetSystemParameters
      ): Promise<GateSetSystemReturnType> => {
        return gateSetSystem(client, args);
      },
      corporationClaim: (
        args: CorporationClaimParameters
      ): Promise<CorporationClaimReturnType> => {
        return corporationClaim(client, args);
      },
      corporationSetMetadata: (
        args: CorporationSetMetadataParameters
      ): Promise<CorporationSetMetadataReturnType> => {
        return corporationSetMetadata(client, args);
      },
      corporationTransfert: (
        args: CorporationTransfertParameters
      ): Promise<CorporationTransfertReturnType> => {
        return corporationTransfert(client, args);
      },
      gateUnlink: (
        args: GateUnlinkParameters
      ): Promise<GateUnlinkReturnType> => {
        return gateUnlink(client, args);
      },
      storageEphemeralToInventory: (
        args: StorageEphemeralToInventoryParameters
      ): Promise<StorageEphemeralToInventoryReturnType> => {
        return storageEphemeralToInventory(client, args);
      },
      storageInventoryToEphemeral: (
        args: StorageInventoryToEphemeralParameters
      ): Promise<StorageInventoryToEphemeralReturnType> => {
        return storageInventoryToEphemeral(client, args);
      },
      storeDeleteRecord: (
        args: StoreDeleteRecordParameters
      ): Promise<StoreDeleteRecordReturnType> => {
        return storeDeleteRecord(client, args);
      },
      storeSetRecord: (
        args: StoreSetRecordParameters
      ): Promise<StoreSetRecordReturnType> => {
        return storeSetRecord(client, args);
      },
      systemWrite: (
        args: SytemWriteParameters
      ): Promise<SystemWriteReturnType> => {
        return systemWrite(client, args);
      },
      turretSetSystem: (
        args: TurretSetSystemParameters
      ): Promise<TurretSetSystemReturnType> => {
        return turretSetSystem(client, args);
      },
      worldWrite: <abi extends Abi = WorldAbi>(
        args: WorldWriteParameters<abi>
      ): Promise<WorldWriteReturnType> => {
        return worldWrite<abi>(client, args);
      },
    };
  } else {
    return {
      isWriteClient: false,
      assemblyBringOffline: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      assemblyBringOnline: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      assemblySetMetadata: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      corporationClaim: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      corporationSetMetadata: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      corporationTransfert: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      gateLink: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      gateSetSystem: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      gateUnlink: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      storageEphemeralToInventory: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      storageInventoryToEphemeral: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      storeDeleteRecord: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      storeSetRecord: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      systemWrite: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      turretSetSystem: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
      worldWrite: async () => {
        throw new Web3TransactionError("Web3 client is not a write client");
      },
    };
  }
}
