interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_BACKEND_URL: string
  readonly MODE: "production"
  readonly API_SECRET_KEY: string
  readonly VITE_FRONTEND_URL: string
  // add more env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
