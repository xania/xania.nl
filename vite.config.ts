import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    port: 9091,
    host: "0.0.0.0",
    proxy: {
      "/rem/api/": {
        target: "http://localhost:5000",
        rewrite: (path) => path.replace(/^\/rem\/api/, "/api"),
      },
      "/api": {
        target: "http://localhost:7071",
        // rewrite: (path) => path.replace(/^\/api/, "/api"),
        // changeOrigin: true,
      },
      "/jsfunc": {
        target: "http://localhost:7071",
        rewrite: (path) => path.replace(/^\/jsfunc/, "/api"),
      },
    },
    // watch: {
    //   ignored: ["xania-functions"],
    // },
  },
  root: "src",
  build: {
    outDir: "../dist",
  },
  logLevel: "info",
});
