import { Table } from "@latticexyz/config";
import {
  AssemblyGetLocationParameters,
  AssemblyGetLocationReturnType,
  assemblyGetLocation,
} from "./read/assemblyGetLocation";
import {
  AssemblyGetMetadataParameters,
  AssemblyGetMetadataReturnType,
  assemblyGetMetadata,
} from "./read/assemblyGetMetadata";
import {
  AssemblyGetStateParameters,
  AssemblyGetStateReturnType,
  assemblyGetState,
} from "./read/assemblyGetState";
import {
  GetSmartCharacterIdParameters,
  GetSmartCharacterIdReturnType,
  characterGetId,
} from "./read/characterGetId";
import {
  CorporationGetMetadataParameters,
  CorporationGetMetadataReturnType,
  corporationGetMetadata,
} from "./read/corporationGetMetadata";
import {
  CorporationIsClaimValidParameters,
  CorporationIsClaimValidReturnType,
  corporationIsClaimValid,
} from "./read/corporationIsClaimValid";
import {
  GateCanJumpParameters,
  GateCanJumpReturnType,
  gateCanJump,
} from "./read/gateCanJump";
import {
  GateGetSystemParameters,
  GateGetSystemReturnType,
  gateGetSystem,
} from "./read/gateGetSystem";
import {
  StoreGetRecordParameters,
  StoreGetRecordReturnType,
  storeGetRecord,
} from "./read/storeGetRecord";
import {
  StoreGetTableParameters,
  StoreGetTableReturnType,
  storeGetTable,
} from "./read/storeGetTable";
import {
  SystemSimulateParameters,
  SystemSimulateReturnType,
  systemSimulate,
} from "./read/systemSimulate";
import {
  TurretGetSystemParameters,
  TurretGetSystemReturnType,
  turretGetSystem,
} from "./read/turretGetSystem";
import {
  WorldReadParameters,
  WorldReadReturnType,
  worldRead,
} from "./read/worldRead";
import {
  WorldSimulateParameters,
  WorldSimulateReturnType,
  worldSimulate,
} from "./read/worldSimulate";
import { MudWeb3ClientBase } from "../types";
import { WorldAbi } from "../abi";
import { Abi } from "viem";

export type MudWeb3ReadActions = {
  assemblyGetLocation: (
    args: AssemblyGetLocationParameters
  ) => Promise<AssemblyGetLocationReturnType>;
  assemblyGetMetadata: (
    args: AssemblyGetMetadataParameters
  ) => Promise<AssemblyGetMetadataReturnType>;
  assemblyGetState: (
    args: AssemblyGetStateParameters
  ) => Promise<AssemblyGetStateReturnType>;
  characterGetId: (
    args: GetSmartCharacterIdParameters
  ) => Promise<GetSmartCharacterIdReturnType>;
  corporationGetMetadata: (
    args: CorporationGetMetadataParameters
  ) => Promise<CorporationGetMetadataReturnType>;
  corporationIsClaimValid: (
    args: CorporationIsClaimValidParameters
  ) => Promise<CorporationIsClaimValidReturnType>;
  gateCanJump: (args: GateCanJumpParameters) => Promise<GateCanJumpReturnType>;
  gateGetSystem: (
    args: GateGetSystemParameters
  ) => Promise<GateGetSystemReturnType>;
  storeGetRecord: <table extends Table>(
    args: StoreGetRecordParameters<table>
  ) => Promise<StoreGetRecordReturnType<table>>;
  storeGetTable: (
    args: StoreGetTableParameters
  ) => Promise<StoreGetTableReturnType>;
  systemSimulate: <abi extends Abi = WorldAbi>(
    args: SystemSimulateParameters<abi>
  ) => Promise<SystemSimulateReturnType<abi>>;
  turretGetSystem: (
    args: TurretGetSystemParameters
  ) => Promise<TurretGetSystemReturnType>;
  worldRead: <abi extends Abi = WorldAbi>(
    args: WorldReadParameters<abi>
  ) => Promise<WorldReadReturnType<abi>>;
  worldSimulate: <abi extends Abi = WorldAbi>(
    args: WorldSimulateParameters<abi>
  ) => Promise<WorldSimulateReturnType>;
};

export function mudWeb3ReadActions(
  client: MudWeb3ClientBase
): MudWeb3ReadActions {
  return {
    assemblyGetLocation: async (
      args: AssemblyGetLocationParameters
    ): Promise<AssemblyGetLocationReturnType> => {
      return assemblyGetLocation(client, args);
    },
    assemblyGetMetadata: async (
      args: AssemblyGetMetadataParameters
    ): Promise<AssemblyGetMetadataReturnType> => {
      return assemblyGetMetadata(client, args);
    },
    assemblyGetState: async (
      args: AssemblyGetStateParameters
    ): Promise<AssemblyGetStateReturnType> => {
      return assemblyGetState(client, args);
    },
    gateCanJump: async (
      args: GateCanJumpParameters
    ): Promise<GateCanJumpReturnType> => {
      return gateCanJump(client, args);
    },
    characterGetId: async (
      args: GetSmartCharacterIdParameters
    ): Promise<GetSmartCharacterIdReturnType> => {
      return characterGetId(client, args);
    },
    corporationGetMetadata: async (
      args: CorporationGetMetadataParameters
    ): Promise<CorporationGetMetadataReturnType> => {
      return corporationGetMetadata(client, args);
    },
    corporationIsClaimValid: async (
      args: CorporationIsClaimValidParameters
    ): Promise<CorporationIsClaimValidReturnType> => {
      return corporationIsClaimValid(client, args);
    },
    gateGetSystem: async (
      args: GateGetSystemParameters
    ): Promise<GateGetSystemReturnType> => {
      return gateGetSystem(client, args);
    },
    storeGetRecord: async <table extends Table>(
      args: StoreGetRecordParameters<table>
    ): Promise<StoreGetRecordReturnType<table>> => {
      return storeGetRecord(client, args);
    },
    storeGetTable: async (
      args: StoreGetTableParameters
    ): Promise<StoreGetTableReturnType> => {
      return storeGetTable(client, args);
    },
    systemSimulate: async <abi extends Abi = WorldAbi>(
      args: SystemSimulateParameters<abi>
    ): Promise<SystemSimulateReturnType<abi>> => {
      return systemSimulate(client, args);
    },
    turretGetSystem: async (
      args: TurretGetSystemParameters
    ): Promise<TurretGetSystemReturnType> => {
      return turretGetSystem(client, args);
    },
    worldRead: async <abi extends Abi = WorldAbi>(
      args: WorldReadParameters<abi>
    ): Promise<WorldReadReturnType<abi>> => {
      return worldRead(client, args);
    },
    worldSimulate: async <abi extends Abi = WorldAbi>(
      args: WorldSimulateParameters<abi>
    ): Promise<WorldSimulateReturnType> => {
      return worldSimulate(client, args);
    },
  };
}
