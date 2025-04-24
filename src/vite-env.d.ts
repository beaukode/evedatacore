/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_USE_ANVIL: boolean;
  readonly VITE_DISABLE_ANALYTICS: boolean;
  readonly VITE_DAPP_GATE_URL: string;
  readonly VITE_DAPP_GATE_SYSTEM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
