import { Hex, isHex } from "viem";
import { Assembly } from "@/api/evedatacore-v2";

export type SSUAssembly = Assembly & {
  isDappUrlSet: boolean;
  isSystemAllowed: boolean;
};

export function getDappUrl(): string {
  const VITE_DAPP_SSU_TRIBE_URL = import.meta.env.VITE_DAPP_SSU_TRIBE_URL;
  if (!VITE_DAPP_SSU_TRIBE_URL) {
    throw new Error("VITE_DAPP_SSU_TRIBE_URL is not set");
  }
  return VITE_DAPP_SSU_TRIBE_URL;
}

export function getSsuSystemId(): Hex {
  const VITE_DAPP_SSU_TRIBE_SYSTEM_ID = import.meta.env
    .VITE_DAPP_SSU_TRIBE_SYSTEM_ID;
  if (!isHex(VITE_DAPP_SSU_TRIBE_SYSTEM_ID)) {
    throw new Error("VITE_DAPP_SSU_TRIBE_SYSTEM_ID format is invalid");
  }
  return VITE_DAPP_SSU_TRIBE_SYSTEM_ID;
}

export function computeDappUrl(ssuId: bigint | string): string {
  return `${getDappUrl()}/${ssuId}`;
}

export function isDappUrlSet(ssu: Assembly) {
  return Boolean(
    ssu && ssu.dappURL && ssu.dappURL === `${getDappUrl()}/${ssu.id}`
  );
}
