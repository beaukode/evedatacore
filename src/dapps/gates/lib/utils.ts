import { Hex, isHex } from "viem";
import { difference } from "lodash-es";
import { Gate } from "@shared/mudsql";
import { GateConfig } from "./getGateConfig";

export function getDappUrl(): string {
  const VITE_DAPP_GATES_URL = import.meta.env.VITE_DAPP_GATES_URL;
  if (!VITE_DAPP_GATES_URL) {
    throw new Error("VITE_DAPP_GATES_URL is not set");
  }
  return VITE_DAPP_GATES_URL;
}

export function getAccessSystemId(): Hex {
  const VITE_DAPP_GATES_ACCESS_SYSTEM_ID = import.meta.env
    .VITE_DAPP_GATES_ACCESS_SYSTEM_ID;
  if (!isHex(VITE_DAPP_GATES_ACCESS_SYSTEM_ID)) {
    throw new Error("VITE_DAPP_GATES_ACCESS_SYSTEM_ID format is invalid");
  }
  return VITE_DAPP_GATES_ACCESS_SYSTEM_ID;
}

export function getConfigSystemId(): Hex {
  const VITE_DAPP_GATES_CONFIG_SYSTEM_ID = import.meta.env
    .VITE_DAPP_GATES_CONFIG_SYSTEM_ID;
  if (!isHex(VITE_DAPP_GATES_CONFIG_SYSTEM_ID)) {
    throw new Error("VITE_DAPP_GATES_CONFIG_SYSTEM_ID format is invalid");
  }
  return VITE_DAPP_GATES_CONFIG_SYSTEM_ID;
}

export function getNamespace(): string {
  const VITE_DAPP_GATES_NAMESPACE = import.meta.env.VITE_DAPP_GATES_NAMESPACE;
  if (!VITE_DAPP_GATES_NAMESPACE) {
    throw new Error("VITE_DAPP_GATES_NAMESPACE is not set");
  }
  return VITE_DAPP_GATES_NAMESPACE;
}

export function isGateManaged(gate: Gate) {
  return gate.dappUrl === getDappUrl() && gate.systemId === getAccessSystemId();
}

export type ConfigDiff = {
  defaultRule?: boolean;
  addCharacters: bigint[];
  removeCharacters: bigint[];
  addCorporations: bigint[];
  removeCorporations: bigint[];
};

export function configDiff(
  storedConfig: GateConfig,
  newConfig: GateConfig
): ConfigDiff | undefined {
  let defaultRule: boolean | undefined;
  if (storedConfig.defaultRule !== newConfig.defaultRule) {
    defaultRule = newConfig.defaultRule;
  }

  const addedCharacters = difference(
    newConfig.charactersExceptions,
    storedConfig.charactersExceptions
  );
  const removedCharacters = difference(
    storedConfig.charactersExceptions,
    newConfig.charactersExceptions
  );

  const addedCorporations = difference(
    newConfig.corporationsExceptions,
    storedConfig.corporationsExceptions
  );

  const removedCorporations = difference(
    storedConfig.corporationsExceptions,
    newConfig.corporationsExceptions
  );

  if (
    defaultRule === undefined &&
    addedCharacters.length === 0 &&
    removedCharacters.length === 0 &&
    addedCorporations.length === 0 &&
    removedCorporations.length === 0
  ) {
    return undefined;
  }

  return {
    defaultRule,
    addCharacters: addedCharacters.map(BigInt),
    removeCharacters: removedCharacters.map(BigInt),
    addCorporations: addedCorporations.map(BigInt),
    removeCorporations: removedCorporations.map(BigInt),
  };
}
