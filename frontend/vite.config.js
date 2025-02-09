import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: false,
        secure: false,
        ws: false,
      },
    },
    allowedHosts: ["localhost"],
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  // define: {
  //   'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
  //   'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
  //   'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID)
  // }
});
