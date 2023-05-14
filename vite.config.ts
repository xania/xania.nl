// vite.config.ts
import { defineConfig } from "vite";
import terser from "@rollup/plugin-terser";

import path from "path";

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {},
  },
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
  plugins: [
    terser({
      format: {
        comments: false,
      },
    }),
  ],
});
