/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_USE_ANVIL: boolean;
  readonly VITE_DISABLE_ANALYTICS: boolean;
  readonly VITE_DAPP_GATES_URL: string;
  readonly VITE_DAPP_GATES_ACCESS_SYSTEM_ID: string;
  readonly VITE_DAPP_GATES_CONFIG_SYSTEM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
