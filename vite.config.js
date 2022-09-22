/** @type {import('vite').UserConfig} */
export default {
  server: {
    port: 9091,
    proxy: {
      "/api": { target: "http://localhost:7125", changeOrigin: true },
    },
  },
  root: "src",
  build: {
    outDir: "../dist",
  },
};
