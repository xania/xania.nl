import mkcert from "vite-plugin-mkcert";
import ipaddress from "./host/ipaddress";

/** @type {import('vite').UserConfig} */
export default {
  server: {
    port: 9091,
    host: ["::1:", ipaddress()],
    proxy: {
      "/rem/api/": {
        target: "http://localhost:5000",
        rewrite: (path) => path.replace(/^\/rem\/api/, "/api"),
      },
      "/api": {
        target: "http://localhost:5263",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
      },
    },
  },
  root: "src",
  build: {
    outDir: "../dist",
  },
  logLevel: "info",
  resolve(dd) {
    console.log(dd);
  },
};
