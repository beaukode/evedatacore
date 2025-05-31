import { Hex } from "viem";
import { Table as MudTable } from "@latticexyz/config";

export type MudSqlClientConfig = {
  worldAddress: string;
  indexerBaseUrl: string;
  debugSql?: boolean;
};

export type SelectRelation = {
  ns: string;
  table: string;
  tableType?: TableType;
  field: string;
  fkNs: string;
  fkTable: string;
  fkTableType?: TableType;
  fkField: string;
};

export type SelectOptions = {
  where?: string;
  orderBy?: string | string[];
  orderDirection?: "ASC" | "DESC";
  rels?: Record<string, SelectRelation>;
  tableType?: TableType;
};

export type TableType = "table" | "offchainTable";

export type Assembly = {
  id: string;
  state: number;
  typeId: AssemblyType;
  isValid: boolean;
  anchoredAt: number;
  ownerId: Hex;
  ownerName: string;
  solarSystemId?: number;
  location?: { x: string; y: string; z: string };
  name?: string;
  dappUrl?: string;
  description?: string;
  networkNodeId?: string;
};

export type AssemblyFuel = {
  id: string;
  fuelUnitVolume: string;
  fuelConsumptionIntervalInSeconds: string;
  fuelMaxCapacity: string;
  fuelAmount: string;
  lastUpdatedAt: number;
};

export type Character = {
  address: Hex;
  id: string;
  name: string;
  corpId: number;
  createdAt: number;
};

export type Balance = {
  address: Hex;
  value: string;
};

export type Function = {
  worldSelector: Hex;
  signature: string;
  systemId?: Hex;
  systemName?: string;
  systemSelector?: Hex;
  namespace?: string;
  namespaceId?: Hex;
  namespaceOwner?: Hex;
  namespaceOwnerName?: string;
};

export type AssemblySystemConfig = {
  systemId: string;
  defaultSystem: boolean;
  system?: System;
};

export type TargetGate = Assembly & {
  isLinked: boolean;
};

export type Namespace = {
  namespaceId: Hex;
  name: string;
  owner: Hex;
  ownerName?: string;
};

export type System = {
  systemId: Hex;
  contract: Hex;
  publicAccess: boolean;
  name: string;
  namespace: string;
  namespaceId: Hex;
  namespaceOwner?: Hex;
  namespaceOwnerName?: string;
};

export type Table = MudTable & {
  namespaceId: Hex;
  namespaceOwner?: Hex;
  namespaceOwnerName?: string;
};

export type InventoryItem = {
  itemId: string;
  quantity: string;
};

export type Inventory = {
  used: string;
  total: string;
  items: InventoryItem[];
};

export type UsersInventory = Inventory & {
  ownerId: Hex;
  ownerName?: string;
};

export type InventoryCapacity = { used: string; total: string };

export type UserInventoryCapacity = InventoryCapacity & {
  ownerId: string;
  ownerName: string;
};

export type Killmail = {
  id: string;
  killerId: string;
  killerName?: string;
  killerAddress?: string;
  victimId: string;
  victimName?: string;
  victimAddress?: string;
  lossType: string;
  solarSystemId: number;
  timestamp: number;
};

export type UsableSmartgate = {
  id: string;
  solarSystemId: string;
  location: {
    x: string;
    y: string;
    z: string;
  };
  systemId: string;
  ownerAddress: string;
  owner?: Character;
  name?: string;
  dappUrl?: string;
  description?: string;
  destinationId: string;
  itemId: string;
};

export type Gate = Assembly & {
  isLinked: boolean;
  destinationId?: string;
  systemId: Hex;
  maxDistance: string;
};

export type NetworkNode = {
  maxEnergy: string;
  producedEnergy: string;
  reservedEnergy: string;
  assemblies: Assembly[];
};

export enum AssemblyType {
  Gate = 84955,
  Turret = 84556,
  Storage = 77917,
  NetworkNode = 88092,
  Hangar = 87160,
  Manufacturer = 87162,
}

export const assemblyTypeMap = {
  SSU: AssemblyType.Storage,
  ST: AssemblyType.Turret,
  SG: AssemblyType.Gate,
  NWN: AssemblyType.NetworkNode,
  smart_hangar: AssemblyType.Hangar,
  manufacturer: AssemblyType.Manufacturer,
} as const;

export const assemblyTypeReverseMap = {
  [AssemblyType.Storage]: "SSU",
  [AssemblyType.Turret]: "ST",
  [AssemblyType.Gate]: "SG",
  [AssemblyType.NetworkNode]: "NWN",
  [AssemblyType.Hangar]: "smart_hangar",
  [AssemblyType.Manufacturer]: "manufacturer",
} as const;

export enum AssemblyState {
  Unanchored = 1,
  Anchored = 2,
  Online = 3,
  Destroyed = 4,
}
