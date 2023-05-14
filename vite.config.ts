// vite.config.ts
import { defineConfig } from "vite";

import path from "path";

export default defineConfig({
  server: {
    port: 1981,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://0.0.0.0:7071",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
