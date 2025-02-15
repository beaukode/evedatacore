/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_USE_ANVIL: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
