import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// `mode` needs a type annotation
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return defineConfig({
    plugins: [react()],
    define: {
        'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL)
    },
  })
}
