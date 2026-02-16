/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FONNTE_API_URL: string
  readonly VITE_FONNTE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
