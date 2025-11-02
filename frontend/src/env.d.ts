interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_BACKEND_URL: string
  readonly MODE: "production"
  // add more env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
