import { Hex, isHex } from "viem";
import { Gate } from "@shared/mudsql";

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
export function isGateManaged(gate: Gate) {
  return gate.dappUrl === getDappUrl() && gate.systemId === getAccessSystemId();
}
