// vite.config.ts
import { defineConfig } from "vite";
import terser from "@rollup/plugin-terser";
import { resolve } from "path";

import path from "path";

export default defineConfig({
  server: {
    port: 1981,
    host: "0.0.0.0",
    proxy: {
      "/api/tned": {
        target: "https://www.tenderned.nl",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/tned/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    terser({
      format: {
        comments: false,
      },
    }),
  ],

  build: {
    rollupOptions: {
      input: resolve(__dirname, "jobs/index.html"),
    },
  },
});
