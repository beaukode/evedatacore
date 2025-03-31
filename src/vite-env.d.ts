/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_USE_ANVIL: boolean;
  readonly VITE_DISABLE_ANALYTICS: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
