import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return defineConfig({
    plugins: [react()],
  })
}
