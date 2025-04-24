import { Gate } from "@shared/mudsql";

export function isGateManaged(gate: Gate) {
  return (
    gate.dappUrl === import.meta.env.VITE_DAPP_GATE_URL &&
    gate.systemId === import.meta.env.VITE_DAPP_GATE_SYSTEM_ID
  );
}
