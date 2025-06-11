/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_USE_ANVIL: boolean;
  readonly VITE_DISABLE_ANALYTICS: boolean;
  readonly VITE_DAPP_GATES_URL: string;
  readonly VITE_DAPP_GATES_NAMESPACE: string;
  readonly VITE_DAPP_GATES_ACCESS_SYSTEM_ID: string;
  readonly VITE_DAPP_GATES_CONFIG_SYSTEM_ID: string;
  readonly VITE_DEBUG_SQL: string;
  readonly VITE_WEB3_DEBUG: string;
  readonly VITE_WEB3_DISABLE_OWNER_CHECK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
