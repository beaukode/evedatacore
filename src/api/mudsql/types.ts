import { Hex } from "viem";
import { Table as MudTable } from "@latticexyz/config";

export type MudSqlClientConfig = {
  worldAddress: string;
  indexerBaseUrl: string;
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
  typeId: number;
  isValid: boolean;
  anchoredAt: number;
  ownerId: string;
  ownerName: string;
  solarSystemId?: number;
  location?: { x: string; y: string; z: string };
  name?: string;
  dappUrl?: string;
  description?: string;
};

export type AssemblyFuel = {
  id: string;
  fuelUnitVolume: string;
  fuelConsumptionPerMinute: string;
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
  stateUpdate: number;
};

export type Inventory = {
  used: string;
  total: string;
  items: InventoryItem[];
};

export type UsersInventory = Inventory & {
  ownerId: string;
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
