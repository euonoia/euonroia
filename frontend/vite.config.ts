import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      open: false,
      fs: {
        strict: false,
      },
    },
    build: {
      // ensures correct base paths for SPA
      outDir: "dist",
      assetsDir: "assets",
    },
    // 👇 This line tells Vite to serve index.html for all routes
    appType: "spa",
    define: {
      "process.env": env,
    },
  });
};
