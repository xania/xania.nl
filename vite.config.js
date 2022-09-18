/** @type {import('vite').UserConfig} */
export default {
  server: {
    port: 9091,
    proxy: {
      "/api": { target: "http://localhost:7071", changeOrigin: true },
    },
  },
  root: "src",
  build: {
    outDir: "../dist",
  },
};
